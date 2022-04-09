# API Changes for the `core_enrol` system and plugintype

## 4.0

- Final deprecation of the following webservice:
  - core_enrol_edit_user_enrolment
- External function core_enrol_external::get_users_courses now returns the last time a course was modified (timemodified field)
- The behat step i_add_enrolment_method_with() has been deprecated. Please use the new method i_add_enrolment_method_for_with()

## 3.11

- Added onlysuspended option to core_enrol_get_enrolled_users webservice to retrieve only suspended users.

## 3.8

- Function enrol_manual_plugin::enrol_cohort now return the number of enrolled cohort users.

## 3.7

- Functions get_potential_users() and search_other_users() now return more information to avoid extra count query:
  - users: List of user objects returned by the query.
  - moreusers: True if there are still more users, otherwise is False.
  - totalusers: Number users matching the search. (This element only exists if the function is called with $returnexactcount param set to true).
- enrolledusercount is now optional in the return value of get_users_courses() for performance reasons. This is controlled with the new
  optional returnusercount parameter (default true).
- External function core_enrol_external::get_users_courses now returns a new field "completionusertracked" that indicates if the
  given user is being tracked for completion.
