import ReactPaginate from "react-paginate"
import Layout from "/components/layout"
import Button from "/components/button"
import Image from "next/image"
import { classNames } from "/utils/classNames.js"
import { useState } from "react"
// import { token } from "/token.js" // For testing and development

export default function SearchGithub() {
  const token = process.env.GITHUB_AUTH
  console.log(process.env.TEST_VAR)
  
  /* App configuration and constants */
  const fetchOptions = {
    headers: {
      Authorization: `token ${token}`
    }
  } // Posterity: Including different header options seems to cause a cors issue
  const perPage = 30 // Later can make dynamic with: [perPage,setPerPage] = useState(100)
  const [results, setResultsArr] = useState({
    query: null,
    pageIndex: null,
    items: [],
    overflow: false
  })
  const maxResults = 1000 // From GitHub search API spec

  /* App logic */
  const fetchGithub = async (query, pageIndex = 0, perPage = perPage, sortMethod, type = "users") => {
    if (!query) { return }
    const endpoint = `https://api.github.com/search/${type}`
    const queryString = '?q=' + encodeURIComponent(`${query}` + " type:user"); // Can add "is:public" here for public repos only
    const sortString = sortMethod ? '&sort=' + sortMethod : ""
    const pageGithub = pageIndex + 1 // If a "page" is passed, add one to it. Otherwise, page must be zero.
    const pageString = '&page=' + pageGithub // Add 1 to page selection (array index)
    const perPageString = perPage ? '&per_page=' + perPage : ""
    const url = endpoint + queryString + pageString + perPageString + sortString
    let output
    try {
      // Schema: {total_count,incomplete_results,items}
      const data = await fetch(url, fetchOptions).then(response => response.json())
      if (data.total_count > maxResults) { data.overflow = true }
      const allData = await Promise.all(data.items.map(async (user) => {
        const userDetails = await fetch(user.url, fetchOptions).then(response => response.json()) // Schema: Object of user detail properties
        user = { ...user, ...userDetails }
        console.log(user)
        // user.repos = await fetch(user.repos_url).then(response => response.json())// Schema: Array of repo objects
        return user
      }))
      output = { items: allData, totalCount: data.total_count, overflow: data.overflow, incompleteResults: data.incomplete_results }
    } catch (err) {
      console.error(`GitHub fetch failed: ${err}`)
      alert(err)
      return
    }
    setResultsArr({ ...output, query: query, pageIndex: pageIndex })
    console.log(`Fetched from: ${url}`)
    return output // Not using output in this case because we are updating state directing within function
  }

  const handlePageChange = (event) => {
    // [ ] Set timeout so fetch only occurs if timeout has a "true" value  
    // Set new current page, show first page, last page, previous 3 pages and next 3 pages; Add links for page buttons
    const newPage = event.selected // "Event" has a custom method called selected which equal the index of the page array
    fetchGithub(results.query, newPage) // Fetch again with same query but change page results
  }

  const convertDate = (string) => {
    const date = new Date(string)
    return date.toLocaleDateString()
  }

  /* App structure and styling */
  const columns = ["Profile", "Login", "Name", "Repos", "Followers", "Email", "Website", "Company", "Location", "Bio", "Last Update", "Created At"]
  const pageButtonClasses = "border border-brown-800 py-1 px-2" // Set classes on pagination buttons to same format

  function Pagination(props) {
    return (
      <ReactPaginate
        className={classNames("flex text-brown-800 flex-wrap justify-center sm:justify-start", props.isTop ? "mb-4" : "mt-4", props.classNames)}
        previousLabel="Prev"
        nextLabel="Next"
        pageClassName={pageButtonClasses}
        previousClassName={pageButtonClasses + " rounded-l"}
        nextClassName={pageButtonClasses + " rounded-r"}
        breakLabel="..."
        breakClassName={pageButtonClasses}
        pageCount={Math.ceil(results.overflow ? maxResults / perPage : results.totalCount / perPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={4}
        onPageChange={handlePageChange}
        activeClassName="bg-brown-800 text-white"
        forcePage={results.pageIndex} // Sets the active page from state
      // breakLinkClassName="page-link"
      // nextLinkClassName="page-link"
      // previousLinkClassName="page-link"
      // pageLinkClassName="page-link"
      // containerClassName="pagination"
      />
    )
  }

  return (
    <Layout title="GitHub User Search">
      <p>Enter a name or email to search GitHub users.</p>
      <input id="search-query" className="block px-2 py-1 mt-2 ml-0 mr-auto border rounded shadow-inner border-brown-800" type="text" placeholder="Name or email..."></input>
      <Button className="mt-4" onClick={() => { fetchGithub(document.getElementById("search-query").value) }}>Search</Button>
      <div id="results-total" className="block mt-4 ml-0 mr-auto"><span className="font-bold">Total Results: </span><span>{results.totalCount}</span></div>
      {results.overflow && <div id="results-overflow" className="block mt-2 ml-0 mr-auto"><p className="text-sm">Only the first {maxResults} search results are available from the GitHub API</p></div>}
      <div id="results-area" className="container mt-4">
        {results.items.length === 0 || <Pagination isTop={true} />}
        {results.items.length === 0 ? <div>No results</div> :
          <div className="container w-full overflow-x-auto">
            <table className="w-full mt-10 text-sm text-center">
              <thead><tr>{columns.map(col => <th className="-rotate-45 -translate-y-5" key={col}>{col}</th>)}</tr></thead>
              <tbody>
                {results.items.map(result => (
                  <tr key={result.id}>
                    <td className="border"><a href={result.html_url} target="_blank"><Image className="rounded" src={result.avatar_url} width="50" height="50"></Image></a></td>
                    <td className="p-1 break-words border max-w-[150px]">{result.login}</td>
                    <td className="p-1 break-words border max-w-[150px]">{result.name}</td>
                    <td className="p-1 break-words border max-w-[150px]"><span className="text-brown-800"><a href={result.html_url + "?tab=repositories"}>{result.public_repos}</a></span></td>
                    <td className="p-1 break-words border max-w-[150px]">{result.followers}</td>
                    <td className="p-1 break-words border max-w-[150px]">{result.email}</td>
                    <td className="p-1 break-words border max-w-[150px]">{result.blog}</td>
                    <td className="p-1 break-words border max-w-[150px]">{result.company}</td>
                    <td className="p-1 break-words border max-w-[150px]">{result.location}</td>
                    <td className="p-1 break-words border max-w-[150px]">{result.bio}</td>
                    <td className="p-1 break-words border max-w-[150px]">{convertDate(result.updated_at)}</td>
                    <td className="p-1 break-words border max-w-[150px]">{convertDate(result.created_at)}</td>
                  </tr>
                ))}</tbody></table></div>}
        {results.items.length === 0 || <Pagination isTop={false} />}
      </div>
    </Layout>
  )
}