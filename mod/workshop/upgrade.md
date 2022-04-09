# API Changes for the `mod_workshop` plugin

## 4.0

- \mod_workshop\event\phase_automatically_switched event is triggered when the phase is automatically switched within
  the cron task.
- A new method \workshopallocation_scheduled::phase_automatically_switched added to handle the
  \mod_workshop\event\phase_automatically_switched event.
- A new boolean parameter, $checksubmissionphase, has been added to the workshop_scheduled_allocator::execute() method
  in order to allow (or not) the allocation of submissions to be done in phases other than the SUBMISSION_PHASE.

## 3.8

- The following functions have been finally deprecated and can not be used anymore:
  - workshop_scale_used()

## 3.7

- workshop_cron() has been removed. Sub-plugins should now implement scheduled tasks.
