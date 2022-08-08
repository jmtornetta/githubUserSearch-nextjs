import fetchCatch from "/utils-js/fetchCatch"
const token = `token ${process.env.GITHUB_AUTH}`

export default async (req,res) => {
  const {search, page = 0, per_page, max_results = 1000, type = "users", sort } = req.query
  const q = search + " type:user" // Poserity: Only encode URL parameters once!
  const endpoint = `https://api.github.com/search/${type}`
  let output

  const getGithubLimits = async (url = `https://api.github.com/rate_limit`) => {
    const limits = await fetchCatch(url,null,token)
    return [limits.resources.search.remaining, limits.resources.search.limit]
  }

  try {
    const data = await fetchCatch(endpoint, {q, page, per_page, sort}, token) // Schema: {total_count,incomplete_results,items}
    if (data.total_count > max_results) data.overflow = true
    const allData = Promise.all(data.items.map(async (user) => {
      const userDetails = await fetchCatch(user.url, null, token) // Schema: Object of user detail properties
      user = { ...user, ...userDetails }
      // user.repos = await fetch(user.repos_url).then(response => response.json())// [ ] Add later; Schema: Array of repo objects
      return user
    }))
    output = { items: await allData, totalCount: data.total_count, overflow: data.overflow, incompleteResults: data.incomplete_results, limits: await getGithubLimits()}
  } catch (err) {
    console.error(`GitHub fetch failed: ${err}`)
    return
  }
  console.log(`Fetched from: ${endpoint}`)
  return res.status(200).json(output) // Set response handshake for fetch on other side
}