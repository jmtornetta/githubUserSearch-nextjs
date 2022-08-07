// import { fetchCatch } from "/testFetch.js"
// import { token } from "/token.js" // For testing and development
// const token = process.env.GITHUB_AUTH

// export default async (req, res) => {
//   const URL = `https://api.i.require.keys/?&api_key=${process.env.SECRET_KEY}`;
//   const response = await axios.get(URL);
//   res.status(200).json({ data: response.data })
// }

const fetchOptions = {
  headers: {
    Authorization: `token ${process.env.GITHUB_AUTH}`
  }
} // Posterity: Including different header options seems to cause a cors issue

const maxResults = 1000 // From GitHub search API spec

// [ ] Insert fetch here.  

export default async (req,res) => {
  const token = process.env.GITHUB_AUTH
  console.log(token)
  console.log(req.query)
  const {query, page = 0, perPage = 30, sortMethod, type = "users" } = req.query

  const getGithubLimits = async (endpoint = `https://api.github.com/rate_limit`, options = fetchOptions) => {
    const limits = await fetch(endpoint, options).then(res => res.json())
    return [limits.resources.search.remaining, limits.resources.search.limit]
  }

  if (!query) { return }
  const endpoint = `https://api.github.com/search/${type}`
  const queryString = '?q=' + encodeURIComponent(`${query}` + " type:user"); // Can add "is:public" here for public repos only
  const sortString = sortMethod ? '&sort=' + sortMethod : ""
  // const pageGithub = page ? parseInt(page) + 1 : null // If a "page" is passed, add one to it. Otherwise, page must be zero.
  const pageString = '&page=' + page // Add 1 to page selection (array index)
  const perPageString = perPage ? '&per_page=' + perPage : ""
  const url = endpoint + queryString + pageString + perPageString + sortString
  let output
  try {
    // Schema: {total_count,incomplete_results,items}
    const data = await fetch(url, fetchOptions).then(res => res.json())
    if (data.total_count > maxResults) { data.overflow = true }
    const allData = Promise.all(data.items.map(async (user) => {
      const userDetails = await fetch(user.url, fetchOptions).then(res => res.json()) // Schema: Object of user detail properties
      user = { ...user, ...userDetails }
      // user.repos = await fetch(user.repos_url).then(response => response.json())// Schema: Array of repo objects
      return user
    }))
    output = { query, page, items: await allData, totalCount: data.total_count, overflow: data.overflow, incompleteResults: data.incomplete_results, limits: await getGithubLimits()}
  } catch (err) {
    console.error(`GitHub fetch failed: ${err}`)
    // alert(err)
    return
  }
  console.log(`Fetched from: ${url}`)
  // console.log(output)
  return res.status(200).json(output)
  // return output // Not using output in this case because we are updating state directing within function
}