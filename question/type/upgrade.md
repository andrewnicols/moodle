# API Changes for the `qtype` plugintype

## 4.0

1) The major question bank changes should not affect most basic question type plugins.
The navigation changes may affect Behat tests. If you encounter this,
the best way to fix it is to use the new navigation steps in MDL-74130.

2) The qualification 'most' is because some question types do more complex things, which
will require changes related to question versionning. Some examples that come to mind:
- the way qtype_mulitanswer (or qtype_combined) aggregates several sub-questions into a parent question.
- the way some contrib plugins (e.g. qtype_stack, qtype_pmatch) store additional data (question tests)
  linked to questions. That relationship will need to be updated.

## 3.11

- Introducing the following \question_type base class methods to save/fetch the last form values
  that were used when creating questions as the new defaults when creating new questions:
  - \question_type::get_default_value()
    - Fetches the default value for a given question field from the user preference.
      Question type plugins can use this in edit_{qtypename}_form.php when using $mform->setDefault().
    - \question_type::set_default_value()
    - Saves the default value for a given question form field in the user preferences.
    - \question_type::save_defaults_for_new_questions()
    - Saves the question type plugin's defined form defaults into the user preferences.
      It calls \question_type::set_default_value() to save each form field default value
      into the user preferences.
    - Question type plugins using \question_type::get_default_value() for their form fields must implement
      this in order to save the values from these form fields as defaults for new questions.

  This will help teachers who repeatedly create questions and use the same values for the fields
(e.g. Default mark, Penalty for each incorrect try, etc.) in the question edit form.

## 3.8

- There is a new method for question types get_extra_question_bank_actions.
  Assuming the question bank display is using the new 'edit_menu_column'
  (which it will be by default) this method lets you add question-type-specific
  actions to the menu. The question_type base class has extensive PHPdoc comments
  on the method to explain what you should do, and there is an example of how to
  use it in a question type at
  https://github.com/moodleou/moodle-qtype_pmatch/commit/2aefa8b5dcc7bab768f4707a4ffb7befcf4c2540.

## 3.8, 3.7.3, 3.6.7

- Coming up in Moodle 3.8 are some changes to the question bank UI. These will break any
  Behat automated tests which use the common pattern
  When I click on "Duplicate" "link" in the "Test question" "table_row"
  to trigger actions on questions when looking at the question bank screen. Therefore,
  a new step has been introduced:
  When I choose "Duplicate" action for "Test question" in the question bank
  If you want your Behat tests to continue working with Moodle 3.8, you will need to use
  the new step. The new step has been back-ported, so you can start updating your tests
  and have them work with Moodle 3.6 and 3.7. In addition, if you want to trigger the
  "Edit" action, you should change that to "Edit question".
