@core @core_course
Feature: Restrict activities availability
  In order to prevent the use of some activities
  As an admin
  I need to control which activities can be used in courses

  Background:
    Given the following "users" exist:
      | username |
      | teacher1 |
    And the following "courses" exist:
      | fullname | shortname |
      | Course 1 | C1        |
    And the following "course enrolments" exist:
      | user     | course | role           |
      | teacher1 | C1     | editingteacher |

  @javascript
  Scenario: Activities can be added with the default permissions
    Given I log in as "teacher1"
    And I am on "Course 1" course homepage with editing mode on
    When I add a "Glossary" to section "1" and I fill the form with:
      | Name | Test glossary name |
      | Description | Test glossary description |
    And I add a "Chat" to section "1" and I fill the form with:
      | Name of this chat room | Test chat name |
      | Description | Test chat description |
    Then I should see "Test glossary name"
    And I should see "Test chat name"

  @javascript
  Scenario: Activities can not be added when the admin restricts the permissions
    Given I set the following system permissions of "Teacher" role:
      | mod/chat:addinstance | Prohibit |
    And the following permissions are overridden for the Teacher role in the "Course 1" course:
      | mod/glossary:addinstance | Prohibit |
    When I am on the "C1" Course page logged in as teacher1
    And I am on "Course 1" course homepage with editing mode on
    And I press "Add an activity or resource"
    Then "Add a new Chat" "link" should not exist in the "Add an activity or resource" "dialogue"
    And "Add a new Glossary" "link" should not exist in the "Add an activity or resource" "dialogue"
    And "Add a new Forum" "link" should exist in the "Add an activity or resource" "dialogue"
