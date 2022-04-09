# API Changes for the `mod_glossary` plugin

## 3.10

- External function get_entries_by_id now returns and additional "permissions" field indicating the user permissions for managing
  the entry.

## 3.8

- The following functions have been finally deprecated and can not be used anymore:
  - glossary_scale_used()

## 3.7

- External functions get_entries_by_* and get_entry now return an additional field "tags" containing the entry tags.
