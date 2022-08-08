import ReactPaginate from "react-paginate"
import DoubleScrollbar from "react-double-scrollbar"
import Layout from "/components/layout"
import Button from "/components/button"
import Image from "next/image"
import { classNames } from "/utils-js/misc"
import { useState } from "react"
import fetchCatch from "/utils-js/fetchCatch"

const perPage = 30 // Later can make dynamic with: [perPage,setPerPage] = useState(100)
const maxResults = 1000 // From GitHub search API spec

export default function SearchGithub() {
  const [results, setResultsArr] = useState({
    search: null,
    pageIndex: null,
    items: [],
    overflow: false,
    limits: [30, 30]
  })
   
  /* App logic */
  const fetchGithub = async (search, pageIndex = 0, per_page = perPage, max_results = maxResults, sort, type = "users" ) => {
    if (!search) return
    const page = parseInt(pageIndex + 1)
    const data = await fetchCatch(`/api/github`, {search, page, per_page, max_results, sort, type})
    setResultsArr({...data, search, pageIndex})
  }

  const throttle = (() => {
    let runs = 0
    return (fn, time, ...args) => {
      runs += 1
      const currentRun = runs
      setTimeout(() => {
        if (currentRun === runs) fn(...args)
      }, time)
    }
  })()

  const limitAndThrottle = (remaining, limit, delayTime, fn, ...args) => {
    if (remaining === 0) { alert("Exceeded limit! Wait a minute."); return }
    // runCount += 1 // Posterity: Using rate limit API instead as stopper for simplicity.

    let time
    const left = remaining / limit
    if (left > .8) time = delayTime
    else if (left > .6) time = delayTime * 2
    else if (left > .4) time = delayTime * 4
    else if (left > .2) time = delayTime * 8
    else time = delayTime * 16

    throttle(fn, time, ...args)
  }

  const handlePageChange = (event) => {
    // Set new current page, show first page, last page, previous 3 pages and next 3 pages; Add links for page buttons
    const newPage = event.selected // "Event" has a custom method called selected which equal the index of the page array
    fetchGithub(results.search, newPage) // Fetch again with same search-query but change page results
  }

  const convertDate = (string) => {
    const date = new Date(string)
    return date.toLocaleDateString()
  }

  /* App structure and styling */
  const columns = ["Profile", "Login", "Name", "Repos", "Followers", "Email", "Website", "Company", "Location", "Bio", "Last Update", "Created At"]
  
  function Pagination(props) {
    const pageButtonClasses = "border border-brown-800 py-1 px-2" // Set classes on pagination buttons to same format
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
      />
    )
  }

  return (
    <Layout title="GitHub User Search">
      <p>Enter a name or email to search GitHub users.</p>
      <input id="search-query"
        className="block px-2 py-1 mt-2 ml-0 mr-auto border rounded shadow-inner border-brown-800"
        onChange={() => { limitAndThrottle(results.limits[0], results.limits[1], 200, () => fetchGithub(document.getElementById("search-query").value)) }}
        type="text"
        placeholder="Name or email..."
      />
      <Button className="mt-4" onClick={() => { fetchGithub(document.getElementById("search-query").value) }}>Search</Button>
      {results.overflow && <div id="results-overflow" className="block mt-2 ml-0 mr-auto"><p className="text-sm">Only the first {maxResults} search results are available from the GitHub API</p></div>}
      <div id="results-area" className="container mt-4">
        {results.items.length === 0 || <Pagination isTop={true} />}
        {results.totalCount === 0 && <div>No results.</div>}
        {results.totalCount > 0 &&
          <>
            <div id="results-total" className="block mt-4 ml-0 mr-auto"><span className="font-bold">Total Results: </span><span>{results.totalCount}</span></div>
              <DoubleScrollbar>
                <table className="w-full mt-10 text-sm text-center">
                  <thead><tr>{columns.map(col => <th className="-rotate-45 -translate-y-5" key={col}>{col}</th>)}</tr></thead>
                  <tbody>
                    {results.items.map(result => (
                      <tr key={result.id}>
                        <td className="border"><a href={result.html_url} target="_blank"><Image className="rounded" src={result.avatar_url} width="50" height="50"></Image></a></td>
                        <td className="p-1 break-words border max-w-[150px]">{result.login}</td>
                        <td className="p-1 break-words border max-w-[150px]">{result.name}</td>
                        <td className="p-1 break-words border max-w-[150px]"><span ><a className="text-green-500 underline" href={result.html_url + "?tab=repositories"}>{result.public_repos}</a></span></td>
                        <td className="p-1 break-words border max-w-[150px]">{result.followers}</td>
                        <td className="p-1 break-words border max-w-[150px]">{result.email}</td>
                        <td className="p-1 break-words border max-w-[150px]">{result.blog}</td>
                        <td className="p-1 break-words border max-w-[150px]">{result.company}</td>
                        <td className="p-1 break-words border max-w-[150px]">{result.location}</td>
                        <td className="p-1 break-words border max-w-[150px]">{result.bio}</td>
                        <td className="p-1 break-words border max-w-[150px]">{convertDate(result.updated_at)}</td>
                        <td className="p-1 break-words border max-w-[150px]">{convertDate(result.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </DoubleScrollbar>
          </>
        }
        {results.items.length === 0 || <Pagination isTop={false} />}
      </div>
    </Layout>
  )
}