# API Changes for the `core_notes` subsystem

## 3.7

- External function core_notes_external::get_course_notes now returns this additional two fields:
  - canmanagesystemnotes: Whether the user can manage notes at system level.
  - canmanagecoursenotes: Whether the user can manage notes at the given course.
