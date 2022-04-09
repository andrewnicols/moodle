# API Changes for the `report` plugintype

## 4.0

- The method report_helper::save_selected_report() has been been deprecated because it is no longer used.

## 3.11

- The new report plugin's can have drop down, which can be included by calling static
  methods save_selected_report and print_report_selector in lib/classes/report_helper.php.
  The save_selected_report helps to remember the most recently accessed report plugin.
  print_report_selector would help to show the dropdown, on the report page. Make sure
  to call print_report_selector after the header is printed/echoed.
