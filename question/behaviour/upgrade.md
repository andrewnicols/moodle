# API Changes for the `qbehaviour` plugintype

## 4.0

1) The major question bank changes should not affect behaviour plugins.
The navigation changes may affect Behat tests. If you encounter this,
the best way to fix it is to use the new navigation steps in MDL-74130.

## 3.10

1) The slot parameter of method M.core_question_engine.init_submit_button now removed.
The method will get the unique id by using the 'Check' button element.
