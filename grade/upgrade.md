# API Changes for the `core_grades` subsystem

## 4.0

- The select_in_gradebook_tabs() function in behat_grade.php has been deprecated. Please use the function
  select_in_gradebook_navigation_selector() instead.
- The setting $CFG->grade_navmethod setting has been completely removed because it's not required anymore. This setting
  was used to set the type of navigation (tabs or dropdown box) used in gradebook which is now replaced with tertiary
  navigation.
- The print_grade_plugin_selector() function has been deprecated. This function was used to generate and output the
  dropdown box navigation in gradebook which is now replaced with tertiary navigation.
- The grade_print_tabs() function has been deprecated. This function was used to generate and output the tabs navigation
  in gradebook which is now replaced with tertiary navigation.
- There is a new callback inside of grade_get_plugin_info called extend_gradebook_plugininfo
  which allows for new tabs to be added to the gradebook.

## 3.7

- The grade_cron() function has been removed. Please use grade_history_cleanup_task and grade_cron_task scheduled tasks instead.
