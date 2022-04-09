# API Changes for `mod/quiz/report/*`

## 3.9

- Quiz report plugins defining capabilities used to require an extra string like
  $string['statistics:componentname'] = 'Quiz statistics report';
in addition to
  $string['pluginname'] = 'Statistics';
This is no longer required.

## 3.8

- New quiz_attempts_report_table method: \quiz_attempts_report_table::checkbox_col_header()
  This generates a column header containing a checkbox that toggles the checked state of all the checkboxes corresponding to the
  entries listed on a given quiz report table. It requires the name of the checkbox column as a parameter in order to disable
  sorting on the checkbox column.
