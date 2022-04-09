# API Changes for the `core_question` subsystem

## 4.0

Moodle 4.0 included the results of a major project to re-work the question bank.

1) Database changes (as usual, all existing data is updated automatically).
- Previously there was a single {question} table. This has now been split into three to handle versionning questions:
  - question              - This now has a row for each version of each question. Therefore, some of the metadata
    (e.g. category) is moved to the next table. However, data that defines how a question works
    is unchanged, so question type plugins will mostly keep working.
  - question_bank_entries - Each question bank entry is a question that appears in the question bank, which can
    have many versions.
  - question_versions     - This joins all the versions of a question in the {question} table to the
    {question_bank_entries} row they belong to.
    - Also, how other parts of the code refer to questions they want to to has changed, to be managed by the core
      API in two new tables.
    - question_references -> Records where a specific question is used.
    - question_set_references -> Records where groups of questions are used (for example random questions in quizzes).
      As a result of this, data from the two quiz tables {quiz_slot} and {quiz_slot_tags} was moved to these new tables.

2) There is a new plugin type 'qbank' for adding features to the question bank. See question/bank/upgrade.txt.

3) Many previously core features have been moved into new plugins, meaning that many old functionsand classes in
lib/questionlib.php and other locations have been deprecated and moved:
- Moved to qbank_previewquestion:
  - question_preview_url() is moved to qbank_previewquestion\helper::question_preview_url()
  - question_preview_popup_params() is moved to qbank_previewquestion\helper::question_preview_popup_params()
    the following were really part of the internal implementation of preview, so should not have been used elsewhere,
    but they were also moved (from previewlib.php).
  - restart_preview() => qbank_previewquestion\helper::restart_preview(),
  - question_preview_form_url() => qbank_previewquestion\helper::question_preview_form_url(),
  - question_preview_action_url() => qbank_previewquestion\helper::question_preview_action_url(),
  - question_preview_question_pluginfile() => qbank_previewquestion\helper::question_preview_question_pluginfile(),
  - class preview_options_form => 'qbank_previewquestion\form\preview_options_form',
  - class question_preview_options => 'qbank_previewquestion\output\question_preview_options',
    - Moved to qbank_managecategories:
    - qbank_managecategories\helper::question_remove_stale_questions_from_category()
    - flatten_category_tree() => qbank_managecategories\helper::flatten_category_tree()
    - add_indented_names() => qbank_managecategories\helper::add_indented_names()
    - question_category_select_menu() => qbank_managecategories\helper::question_category_select_menu()
    - get_categories_for_contexts() => qbank_managecategories\helper::get_categories_for_contexts()
    - question_category_options() => qbank_managecategories\helper::question_category_options()
    - question_add_context_in_key() => qbank_managecategories\helper::question_add_context_in_key()
    - question_fix_top_names() => qbank_managecategories\helper::question_fix_top_names()
    - class category_form => qbank_managecategories\form\category_form
    - class question_category_list => qbank_managecategories\question_category_list
    - class question_category_list_item => 'bank_managecategories\question_category_list_item
    - class question_category_object => qbank_managecategories\question_category_object
    - class question_category_edit_form => qbank_managecategories\form\category_form
    - class question_move_form => qbank_managecategories\form\question_move_form
    - Moved to qbank_exporttoxml:
    - question_get_export_single_question_url() -> qbank_exporttoxml\helper::question_get_export_single_question_url().
    - Moved to qbank_exportquestions:
    - class question_export_form => qbank_exportquestions\form\export_form
    - class export_form => qbank_exportquestions\form\export_form
    - Moved to qbank_importquestions:
    - class question_import_form => qbank_importquestions\form\question_import_form
    - Moved to qbank_tagquestion:
    - submit_tags_form and associated external services for question tag,
    - tags_form in question/type,
    - core_question_output_fragment_tags_form() => /question/bank/qbank_tagquestion/lib.php.

4) The following functions in questionlib.php now using type hinting. So, if you call them with the wrong types,
you will now get fatal errors.
- is_latest()
- get_next_version()
- get_question_version()
- get_question_bank_entry()
- core_question_find_next_unused_idnumber()
- question_module_uses_questions()
- question_page_type_list()
- core_question_question_preview_pluginfile()
- question_rewrite_question_preview_urls()
- question_rewrite_question_urls()
- question_get_all_capabilities()
- question_get_question_capabilities()
- question_require_capability_on()
- question_has_capability_on()
- question_default_export_filename()
- get_import_export_formats()
- question_categorylist_parents()
- question_categorylist()
- question_make_default_categories()
- question_get_top_categories_for_contexts()
- sort_categories_by_tree()
- print_question_icon()
- question_sort_tags()
- _tidy_question()
- question_preload_questions()
- question_move_category_to_context()
- move_question_set_references()
- question_move_questions_to_category()
- idnumber_exist_in_question_category()
- question_move_question_tags_to_new_context()
- question_delete_activity()
- question_delete_course_category()
- question_delete_course()
- question_delete_context()
- question_delete_question()
- delete_question_bank_entry()
- question_category_in_use()
- question_category_delete_safe()
- question_context_has_any_questions()
- questions_in_use()
- question_save_qtype_order()
- question_reorder_qtypes()

5) Function question_hash() from questionlib.php is deprecated without replacement.

6) The following classes have been moved, to better follow Moodle's name-space usage rules:
'core_question\bank\action_column_base' => 'core_question\local\bank\action_column_base',
'core_question\bank\checkbox_column' => 'core_question\local\bank\checkbox_column',
'core_question\bank\column_base' => 'core_question\local\bank\column_base',
'core_question\bank\edit_menu_column' => 'core_question\local\bank\edit_menu_column',
'core_question\bank\menu_action_column_base' => 'core_question\local\bank\menu_action_column_base',
'core_question\bank\menuable_action' => 'core_question\local\bank\menuable_action',
'core_question\bank\random_question_loader' => 'core_question\local\bank\random_question_loader',
'core_question\bank\row_base' => 'core_question\local\bank\row_base',
'core_question\bank\view' => 'core_question\local\bank\view',
'core_question\bank\copy_action_column' => 'qbank_editquestion\copy_action_column',
'core_question\bank\edit_action_column' => 'qbank_editquestion\edit_action_column',
'core_question\bank\creator_name_column' => 'qbank_viewcreator\creator_name_column',
'core_question\bank\question_name_column' => 'qbank_viewquestionname\viewquestionname_column_helper',
'core_question\bank\question_name_idnumber_tags_column' => 'qbank_viewquestionname\question_name_idnumber_tags_column',
'core_question\bank\delete_action_column' => 'qbank_deletequestion\delete_action_column',
'core_question\bank\export_xml_action_column' => 'qbank_exporttoxml\export_xml_action_column',
'core_question\bank\preview_action_column' => 'qbank_previewquestion\preview_action_column',
'core_question\bank\question_text_row' => 'qbank_viewquestiontext\question_text_row',
'core_question\bank\question_type_column' => 'qbank_viewquestiontype\question_type_column',
'core_question\bank\tags_action_column' => 'qbank_tagquestion\tags_action_column',
'core_question\form\tags' => '\qbank_tagquestion\form\tags_form',
'core_question\output\qbank_chooser' => 'qbank_editquestion\qbank_chooser',
'core_question\output\qbank_chooser_item' => 'qbank_editquestion\qbank_chooser_item',

7) The Behat class for question-related steps has been renamed to behat_core_question
to match the expected naming convention. In the unlikely event that you are directly
referring to the behat_question class name (nothing in the standard Moodle code was)
then you will have to update your reference.

## 3.9

1) For years, the ..._questions_in_use callback has been the right way for plugins to
tell the core question system if questions are required. Previously this callback
only worked in mods. Now it works in all plugins.

   At the same time, if you are still relying on the legacy ..._question_list_instances
callback for this, you will now get a debugging warning telling you to upgrade.

2) Previously, the functions question_delete_activity, question_delete_course and
question_delete_course_category would echo output. This was not correct behaviour for
a low-level API function. Now, they no longer output. Related to this, the helper
function they use, question_delete_context, now always returns an empty array.

   This probably won't acutally cause you any problems. However, you may previously
have had to add expectOutputRegex calls to your unit tests to avoid warnings about
risky tests. If you have done that, those tests will now fail until you delete that expectation.

## 3.8

If you have customised the display of the question bank (using $CFG->questionbankcolumns)
then be aware that the default configuration has changed, and you may wish to make
equivalent changes in your customised version. The old column question_name_column
has been replaced by question_name_idnumber_tags_column. The old question_name_column
still exists, so it is safe to continue using it.

There is a new question bank column edit_menu_column which displays all actions
in a drop-down menu, instead of as separate icons. This is now used by default.
Specifically, it gathers all other columns which implement the new interface
menuable_action. If you have made a custom subclasses of action_column_base,
you probably want to implement the new interface. If your column is a simple action,
the easiest way to do this will be to subclass menu_action_column_base. If your action
is more complex, and does not follow the simple pattern that menu_action_column_base
uses, then you will need to implement menuable_action yourself. The commit for
MDL-66816 updates all the core action columns. Looking at that change should make
it clearly the changes you need to make to your columns.

## 3.7

The code for the is_valid_number function that was duplicated in the
qtype_numerical and qtype_multianswer plugins in the qtype_numerical_edit_form
and qtype_multianswer_edit_form classes has been moved to a static function
in the qtype_numerical class of the qtype_numerical plugin.

The exportprocess function of the qformat_default class doesn't output a blank line
if the result of the writequestion function is null. This permit to qformat plugins
to ignore some questions without the need to overwrite this function.

- The question_preview_cron() has been deleted. Please use \core\task\question_cron_task::execute().
- The question_usage_statistics_cron() has been deleted. Please use \core\task\question_cron_task::execute().
- The method question_bank::cron() has been deleted, please use question related scheduled tasks.
