@format @format_singleactivity
Feature: Courses can be created in Single Activity mode
  In order to create a single activity course
  As a manager
  I need to create courses and set default values on them

  Scenario: Create a course as a custom course creator
    Given the following "users" exist:
      | username  | firstname | lastname | email          |
      | kevin  | Kevin   | the        | kevin@example.com |
    And the following "roles" exist:
      | shortname | name    | archetype |
      | creator   | Creator |           |
    And the following "system role assigns" exist:
      | user   | role    | contextlevel |
      | kevin  | creator | System       |
    Given the following "permissions" exist:
      | role    | capability                     | permission |
      | Creator | moodle/course:create           | Allow      |
      | Creator | moodle/course:update           | Allow      |
      | Creator | moodle/course:manageactivities | Allow      |
      | Creator | moodle/course:viewparticipants | Allow      |
      | Creator | moodle/role:assign             | Allow      |
      | Creator | mod/quiz:addinstance           | Allow      |
    And I log in as "kevin"
    And I am on site homepage
    When I press "Add a new course"
    And I set the following fields to these values:
      | Course full name  | My first course |
      | Course short name | myfirstcourse |
      | Format | Single activity format |
    And I press "Update format"
    Then I should see "Quiz" in the "Type of activity" "field"
    And I should not see "Forum" in the "Type of activity" "field"
    And I press "Save and display"
    And I should see "Adding a new Quiz"
