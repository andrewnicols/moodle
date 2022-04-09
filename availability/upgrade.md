# API Changes for the `core_availability` subsystem

The information here is intended only for developers.

## 4.0

- Method render_core_availability_multiple_messages() is deprecated. Please use core_availability\\output\\multiple_messages
  The new rendereable will produce output with a 'more' link when there is lots of availability information.
- There were existing restrictions on what condition plugins can do in the get_description
  method (for example they mustn't call format_string), which were not well documented.
  New functions description_cm_name(), description_format_string(), description_callback()
  can be used so that condition plugins to behave correctly in all situations.
