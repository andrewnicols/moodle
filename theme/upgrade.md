# API Changes for the `theme` plugintype

information provided here is intended especially for theme designer.

## 4.0

- A new theme config 'removedprimarynavitems' allows a theme to customise primary navigation by specifying the list of items to remove.
- A new theme config 'usescourseindex' allows a theme to specify whether it implements and uses course index.
- A new theme setting 'unaddableblocks' allows admins to define the blocks that won't be displayed in the "Add a block" list.

## 3.11

- The classname 'viewmode-cobmined' in course/management.php has been changed to 'viewmode-combined'

## 3.10

- The Bootstrap legacy css utilities from Bootstrap 2 and 4alpha have been removed.
The syntax for the new Bootstrap 4.5 utility classes is {property}{sides}-{breakpoint}-{size} for sm, md, lg, and xl.
The size values are:
1: 0.25rem
2: 0.5rem
3: 1rem
4: 1.5rem
5: 2rem
6: 3rem

In Bootstrap 4alpa a spacing utility class '.m-l-1' would mean margin-left 1rem. With the new spacing classes it should now be '.ml-3'

These class names have changed:
.row-fluid is now .row
.text-error is now .text-danger

These classes should no longer be used:
.label .label-{type}, use .badge .badge-{type} instead
.tag .tag-{type}, use .badge .badge-{type} instead
.well, just set a border with .border and a background with .bg-light

## 3.9

- Add class .d-print-block to #page, #page-wrapper and #page content to fix Firefox printing problems
- A function to core_renderer has been added, secure_layout_login_info. This allows the boost and classic templates to
  display the users full name in a secure layout.
- Secure layout in themes boost and classic have been modified to allow language selection as they now call the
  output.secure_layout_language_menu function.

## 3.8

- Moodle does not produce chunked CSS anymore, instead an unique css fils is generated and served (MDL-55751). This implies:
  - css_chunk_by_selector_count() has been removed.
  - css_store_css(), theme_styles_get_filename() and theme_styles_get_etag() don't accept any chunk-related param anymore.
- The PHP Less compilier has now been removed from the core library.
  Please consider migrating your theme to use SCSS.
- It is now possible to use sub-directories when creating mustache templates.
  The standard rules for Level 2 namespaces also apply to templates.
  The sub-directory used must be either an valid component, or placed inside a 'local' directory to ensure that it does not conflict with other components.

    The following are all valid template names and locations in your theme:
theme_themename/columns2: theme/[themename]/templates/columns2.mustache
theme_themename/local/layouts/columns2: theme/[themename]/templates/local/layouts/columns2.mustache

    The following are core templates, locations, and override locations in your theme:
core/modal: lib/templates/modal.mustache => theme/[themename]/templates/core/modal.mustache
mod_forum/forum_post: mod/forum/templates/forum_post.mustache => theme/[themename]/templates/mod_forum/forum_post.mustache
mod_forum/local/post/user: mod/forum/templates/local/post/user.mustache => theme/[themename]/templates/mod_forum/local/post/user.mustache

    The following are _invalid_ template names and locations:
theme_themename/layouts/columns2: theme/[themename]/layouts/columns2.mustache

## 3.7

- The core/form_autocompelte_input template now has a `data-tags` attribute.
- Boost theme renderer overrides have now been migrated to core.
- Renderers that were overridden by Boost are now in Bootstrapbase
- Core templates in Boost have now moved into core
- Templates that were overridden by boost are now located in Bootstrapbase
- Themes bootstrapbase, clean & more have now been removed.
