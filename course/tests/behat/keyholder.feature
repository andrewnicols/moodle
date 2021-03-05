@core @core_course @javascript
Feature: Keyholder role is listed as course contact
  As a student I need to know who the keyholder is to enrol in a course

  Background:
    Given the following "categories" exist:
      | name | category | idnumber |
      | Cat 1 | 0 | CAT1 |
    And the following "role" exists:
        | shortname | keyholder  |
        | name      | Keyholder |
    And the following "permissions" exist:
      | role      | capability         | permission |
      | Keyholder | enrol/self:holdkey | Allow      |
    And I log in as "admin"
    And I navigate to "Appearance > Courses" in site administration
    And I click on "Keyholder" "checkbox"
    And I press "Save changes"
    And the following "users" exist:
      | username | firstname | lastname | email |
      | teacher1 | Teacher | 1 | teacher1@example.com |
      | keyholder1 | Keyholder | 1 | keyholder1@example.com |
      | student1 | Student | 1 | teacher1@example.com |
    And the following "courses" exist:
      | fullname | shortname | format | coursedisplay | numsections | category |
      | Course 1 | C1 | topics | 0 | 5 | CAT1 |
    And I am on "Course 1" course homepage
    And I add "Self enrolment" enrolment method with:
      | Custom instance name | Test student enrolment |
      | Enrolment key | letmein |
    And I log out

  Scenario: Keyholder assigned to a course
    Given the following "course enrolments" exist:
      | user | course | role |
      | teacher1 | C1 | editingteacher |
      | keyholder1 | C1 | keyholder |
    When I am on the "Course 1" course page logged in as student1
    Then I should see "Keyholder 1"

  Scenario: Keyholder assigned to a category
    Given the following "role assigns" exist:
      | user    | role          | contextlevel | reference |
      | keyholder1 | keyholder       | Category     | CAT1      |
    And the following "course enrolments" exist:
      | user | course | role |
      | teacher1 | C1 | editingteacher |
    When I am on the "Course 1" course page logged in as student1
    Then I should see "Keyholder 1"
