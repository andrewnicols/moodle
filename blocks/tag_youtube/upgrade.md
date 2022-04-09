# API Changes for the `block_tag_youtube` plugin

## 3.10.1

- The config category now stores the category ID, instead of a string representation of the category name.
  In YouTube Data API v3, the API call to fetch the videos related to a certain category expects the category ID to be
  passed to the videoCategoryId parameter, instead of the category name.
