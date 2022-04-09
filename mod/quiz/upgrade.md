# API Changes for the `mod_quiz` plugin

## 4.0

- The following API methods have a new parameter, $studentisonline, to define whether the student is currently interacting:
  - process_finish() in mod/quiz/attemptlib.php
  - quiz_send_confirmation() in mod/quiz/locallib.php
  - quiz_send_notification_messages() in mod/quiz/locallib.php
- The completionpass criteria has been moved to core as 'completionpassgrade'. Refer to completion/upgrade.txt for
  further information.
- New argument quizhasquestions has been added to public methods: view_information in mod/quiz/renderer.php.
- The function no_questions_message() in class mod_quiz_renderer is deprecated. There is no replacement.
- Related to the Moodle 4.0 question bank changes, the quiz_slots database table.
  The fields removed are now manage by new core_question tables:
  - question_references -> Records where a specific question is used.
  - question_set_references -> Records where groups of questions are used (e.g. random questions).
- The quiz_slots_tags database table has been removed entirely, as has the get_slot_tags_for_slot_id() method
  from mod/quiz/classes/structure.php and the the locallib.php functions quiz_retrieve_slot_tags and
  quiz_retrieve_slot_tag_ids. This information is now stored in question_set_references
  and can be accessed using qbank_helper::get_random_question_data_from_slot.

## 3.11

- External function mod_quiz_external::get_user_best_grade now returns and additional optional field:
  - gradetopass: The grade to pass the quiz (if set)

## 3.10.1

- External functions mod_quiz_external::get_attempt_data, mod_quiz_external::get_attempt_summary
  and mod_quiz_external::get_attempt_review now return a new additional optional field:
  - settings: Containing the question definition settings for displaying the question in an external system.

## 3.10

- External functions mod_quiz_external::get_attempt_data, mod_quiz_external::get_attempt_summary
  and mod_quiz_external::get_attempt_review now return a new additional optional field:
  - responsefileareas: Containing the user responses to questions file area names including files.

## 3.7

- Quiz_cron() has been removed. Sub-plugins should implemented scheduled tasks, however legacy cron in subplugins are
  supported.
