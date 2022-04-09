# API Changes for the `core_calendar` subsystem

## 4.0

- The following external functions now accepts an optional parameter 'searchvalue' to search the events:
  - core_calendar_external::get_calendar_action_events_by_timesort
  - core_calendar_external::get_calendar_action_events_by_courses
  - core_calendar_external::get_calendar_action_events_by_course
- Added core_calendar_delete_subscription, which allows to delete the calendar subscription.
- Updated calendar_can_manage_user_event() function to check permissions to user events.
- The following functions have been deprecated because they were no longer used:
  - calendar_process_subscription_row()
  - calendar_import_icalendar_events()
- The following has been removed after being deprecated in 3.8
  - CALENDAR_EVENT_GLOBAL
- The following have been deprecated because the three-month pseudo block has been removed:
  - fake_block_threemonths() renderer method.
  - calendar_threemonth.js.
  - calendar_threemonth and threemonth_month templates.
  - Behat step definitions i_hover_over_day_of_this_month_in_calendar and i_click_day_of_this_month_in_calendar.

## 3.10

- The core_calendar\local\event\value_objects\times_interface class now has new method get_usermidnight_time() which
  returns the user midnight time for a given event.

## 3.9

- Plugins can now create their own calendar events, both standard and action ones. To do it they need to specify
  $event->component when creating an event. Component events can not be edited or deleted manually.
  See https://docs.moodle.org/dev/Calendar_API#Component_events
- The following functions have been deprecated because they were no longer used:
  - calendar_add_event_metadata()
  - core_calendar_renderer::event()

## 3.8

- The following functions have been finally deprecated and can not be used anymore:
  - calendar_wday_name()
  - calendar_get_block_upcoming()
  - calendar_print_month_selector()
  - calendar_cron()
  - calendar_get_mini()
  - calendar_get_upcoming()
- Added core_calendar_external::get_timestamps(), which allows an array containing an arbitrary number of arrays of
  date/time data to be converted and returned as timestamps, along with an optional key.
