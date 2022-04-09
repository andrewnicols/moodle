# API Changes for the `tool_usertours` plugin

## 4.0

- The `tourconfig` property returned by the `tool_usertours_fetch_and_start_tour`
  external method has also an `endtourlabel` property that contains the label to be used
  for the end tour button.

## 3.9

- The `tourconfig` property returned by the `tool_usertours_fetch_and_start_tour`
  external method is now optional, and will be omitted if the tour shouldn't be
  shown to the current user
