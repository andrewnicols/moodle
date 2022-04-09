# API Changes for the `mod` plugintype

## 4.0

- A new API function introduced to handle custom completion logic. Refer to completion/upgrade.txt for additional information.
- Modules that extend the settings navigation via '_extend_settings_navigation()' should use the get_page() method from
  the settings_navigation class in order to obtain the correct moodle_page information associated to the given settings
  navigation. After the recent changes to the navigation in single activity courses, using the global $PAGE may result
  in returning inaccurate data in this course format, therefore it is advisable to use $settingsnavigation->get_page().

## 3.9

- The callback get_shortcuts() is now deprecated. Please use get_course_content_items and get_all_content_items instead.
  See source code examples in get_course_content_items() and get_all_content_items() in mod/lti/lib.php for details.
- When creating the calendar events and setting the event description to match the module intro description, the filters
  must not be applied on the passed description text. Doing so leads to loosing some expected text filters features and
  causes unnecessarily early theme and output initialisation in unit tests. If your activity creates calendar events,
  you probably have code like:
  ```
  $event->description = format_module_intro('quiz', $quiz, $cmid);
  ```
  You need to change it to:
  ```
  $event->description = format_module_intro('quiz', $quiz, $cmid, false);
  $event->format = FORMAT_HTML;
  ```
  Even this is still technically wrong. Content should normally only be formatted just before it is output. Ideally, we
  should pass the raw description text, format and have a way to copy the embedded files; or provide another way for the
  calendar to call the right format_text() later. The calendar API does not allow us to do these things easily at the
  moment. Therefore, this compromise approach is used. The false parameter added ensures that text filters are not run
  at this time which is important. And the format must be set to HTML, because otherwise it would use the current user's
  preferred editor default format.
- Related to the above and to help with detecting the problematic places in contributed 3rd party modules, the
  testing_module_generator::create_instance() now throws coding_exception if creating a module instance initialised the
  theme and output as a side effect.

## 3.8

- The final deprecation of xxx_print_overview() callback means that this function will no longer be called.
- Activities which define multiple grade items must now describe the mapping of the gradeitem's itemnumber to a
  meaningful name in a class implementing \core_grades\local\gradeitem\itemnumber_mapping located in
  \mod_name\grades\gradeitems (located in mod/[mod_name]/classes/grades/gradeitems.php).
