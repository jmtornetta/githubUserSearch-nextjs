# About
Search GitHub users via the GitHub search, users, and repos API.  
# Plan
## Next
+ [ ] Setup proxy so `Authorization:"token ".concat(...)` doesn't show in source; Reset auth token and redeploy.    
## Later
+ [ ] Add filter/sort to table columns (esp Repos + Followers) via GitHub Search API > Sort/Filter.  
+ [ ] Reformat link colors (green).  
+ [ ] Display spinner icon while fetching is happening.  
+ [ ] Store pages in prior states array so additional "fetches" aren't required for pre-existing page.  
+ [ ] Create popup to show all repos when repo number is clicked.  
+ [ ] Move results into separate component.  
+ [ ] Add site icon.  
# Changelog
## 08/03/2022
+ [x] Create timeout and instant search (search as you go).  
+ [x] Test "instant search" with timeout from browser and max (hourly) limit stored in app state.  
+ [x] Move authorization token to env variable before makeing public.  
+ [x] Deplpoy via Vercel.  
## 08/02/2022
+ [x] MVP completed.   