# API Changes for the `tool_log` plugin

## 3.7

- The new jsonformat option, which defaults to 'on' for a new install (and 'off' for existing installs) means that
  the 'other' event field is now stored in JSON format instead of PHP serialize format in the database. The system
  can read data in both formats but if any third-party software directly accesses the database field, it may need
  to be modified (or require users to turn off jsonformat).
