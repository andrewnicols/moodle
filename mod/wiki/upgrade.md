# API Changes for the `mod_wiki` plugin

## 4.0

- wiki_info has been deprecated. Output will be handled within the $PAGE->activityheader instead.

## 3.8

- The following functions have been finally deprecated and can not be used anymore:
  - wiki_scale_used()

## 3.7

- External functions get_subwiki_pages and get_page_contents now return an additional field "tags" returning the entry tags.
