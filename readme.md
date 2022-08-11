# About
Search GitHub users via the GitHub search, users, and repos API.  
# Plan
## Next
## Later
+ [ ] Add filter/sort to table columns (esp Repos + Followers) via GitHub Search API > Sort/Filter.  
+ [ ] Display spinner icon while fetching is happening.  
+ [ ] Add total contributions / contributions calendar via Graphql API : [ Add requisite permission to token since Graphql communicates via POST; Perhaps use GraphQL for resources higher in node tree and REST for the deep resources (list of repos). Might be too complicated; Update fetchCatch function with graphql preset. ] // See https://stackoverflow.com/questions/18262288/finding-total-contributions-of-a-user-from-github-api#59042992 & https://docs.github.com/en/graphql/overview/resource-limitations    
+ [ ] Store pages in prior states array so additional "fetches" aren't required for pre-existing page.  
+ [ ] Create popup to show all repos when repo number is clicked.  
+ [ ] Move results into separate component.  
+ [ ] Add site icon.  
# Changelog
## 08/07/2022
+ [x] Reduce throttle speed to limit dropped search queries.  
+ [x] Setup proxy so `Authorization:"token ".concat(...)` doesn't show in source; Reset auth token and redeploy.    
## 08/04/2022
+ [x] Add guard clause if no API key provided.  
+ [x] Add double scroll bars to table.  
+ [x] Reformat link colors (green).  
## 08/03/2022
+ [x] Create timeout and instant search (search as you go).  
+ [x] Test "instant search" with timeout from browser and max (hourly) limit stored in app state.  
+ [x] Move authorization token to env variable before makeing public.  
+ [x] Deplpoy via Vercel.  
## 08/02/2022
+ [x] MVP completed.   