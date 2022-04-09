# API Changes for the `mod_book` plugin

## 4.0

- book_get_nav_types() has been deprecated. Related settings have been removed. The navigation is now set to only "next" and
  "previous".

## 3.11

- Final deprecation - booktool_print_get_toc(). Please use render_print_book_toc() instead.

## 3.8

- The following functions have been finally deprecated and can not be used anymore:
  - book_scale_used()

## 3.7

- book_export_contents() callback now returns tags information for every chapter.
