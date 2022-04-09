# API Changes for the `core_competency` subsystem

## 3.7

- tool_lp can render the ui for a competency summary or a competency picker.
  Use get_plugins_with_function('competency_picker') or
  get_plugins_with_function('render_competency_summary') to call it.
