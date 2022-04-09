# API Changes for the `theme_boost` plugin

information provided here is intended especially for theme designers.

## 4.0

- Following the adopted standards, breadcrumbs have been removed for pages that reside on the 1st level within a course
  e.g. participants, grades, settings, reports.
- Any custom complex node structures added to the nav tree will now be displayed as a flattened structure within the corresponding
  secondary navigation. It is dependent on what the first url for the construct.
  Refer to secondary_test.php:test_add_external_nodes_to_secondary for examples.
- New function addblockbutton in the renderer, which generates the new 'Add a block' button.
  Call this and output it into your templates.
- In order to view additional custom nodes, leverage the 'get_overflow_menu_data' which returns url_select if there are nodes available.
- In order for existing themes to leverage the changes in the Boost theme, it is recommended to follow the guidelines in the 4.0 docs
  https://docs.moodle.org/dev/Moodle_4.0_developer_update

## 3.7

- Templates and renderers moved to core.

- Behat override steps moved to core.

Form element template
---------------------
A 'wrapperid' has been added to 'templates/core_form/element-template.mustache' to restore unique ids
on Boost form element wrappers. This restores the same unique element ids seen on elements in BS2
themes, which were mistakenly dropped when introducing the Boost theme.
