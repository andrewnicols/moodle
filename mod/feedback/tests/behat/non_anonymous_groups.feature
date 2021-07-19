@mod @mod_feedback @javascript
Feature: Feedbacks in courses with groups
  In order to collect feedbacks per group
  As an teacher
  I need to be able to filter feedback replies by groups

  Background:
    Given the following "users" exist:
      | username | firstname | lastname |
      | user1    | Username  | 1        |
      | user2    | Username  | 2        |
      | user3    | Username  | 3        |
      | user4    | Username  | 4        |
      | user5    | Username  | 5        |
      | user6    | Username  | 6        |
      | user7    | Username  | 7        |
      | teacher  | Teacher   | T        |
    And the following "courses" exist:
      | fullname | shortname | groupmode |
      | Course 1 | C1        | 1 |
    And the following "course enrolments" exist:
      | user  | course | role    |
      | user1 | C1     | student |
      | user2 | C1     | student |
      | user3 | C1     | student |
      | user4 | C1     | student |
      | user5 | C1     | student |
      | user6 | C1     | student |
      | user7 | C1     | student |
      | teacher | C1   | editingteacher |
    And the following "groups" exist:
      | name | course | idnumber |
      | Group 1 | C1 | G1 |
      | Group 2 | C1 | G2 |
    And the following "group members" exist:
      | user | group |
      | user1 | G1 |
      | user2 | G1 |
      | user2 | G2 |
      | user3 | G2 |
      | user4 | G1 |
      | user5 | G1 |
      | user6 | G2 |
    And the following "activities" exist:
      | activity   | name            | course               | idnumber  | anonymous | publish_stats | groupmode | section |
      | feedback   | Course feedback | C1                   | feedback1 | 2         | 1             | 1         | 0       |
    And the following "mod_feedback > question" exists:
      | activity        | feedback1                               |
      | name            | Do you like this course?                |
      | questiontype    | multichoice                             |
      | label           | multichoice1                            |
      | subtype         | r                                       |
      | hidenoselect    | 1                                       |
      | values          | Yes of course\nNot at all\nI don't know |
    And the following "mod_feedback > responses" exist:
      | activity  | user  | Do you like this course? |
      | feedback1 | user1 | Not at all               |
      | feedback1 | user2 | I don't know             |
      | feedback1 | user3 | Not at all               |
      | feedback1 | user4 | Yes of course            |
      | feedback1 | user5 | Yes of course            |
      | feedback1 | user6 | Not at all               |
      | feedback1 | user7 | I don't know             |

  Scenario: View analysis, user1 should only see one group - group 1
    When I am on the "Course feedback" "mod_feedback > analysis" page logged in as user1
    Then I should see "Separate groups: Group 1"
    And I show chart data for the "multichoice1" feedback
    And I should see "2 (50.00 %)" in the "Yes of course" "table_row"
    And I should see "1 (25.00 %)" in the "Not at all" "table_row"

  Scenario: View analysis, user3 should only see one group - group 2
    When I am on the "Course feedback" "mod_feedback > analysis" page logged in as user3
    Then I should see "Separate groups: Group 2"
    And I show chart data for the "multichoice1" feedback
    And I should see "0" in the "Yes of course" "table_row"
    And I should see "2 (66.67 %)" in the "Not at all" "table_row"

  Scenario: View analysis, user2 should see a group selector and be able to change the group but not view all.
    When I am on the "Course feedback" "mod_feedback > analysis" page logged in as user2
    Then the field "Separate groups" matches value "Group 1"
    And I show chart data for the "multichoice1" feedback
    And I should see "2 (50.00 %)" in the "Yes of course" "table_row"
    And I should see "1 (25.00 %)" in the "Not at all" "table_row"
    And I select "Group 2" from the "Separate groups" singleselect
    And I show chart data for the "multichoice1" feedback
    And I should see "0" in the "Yes of course" "table_row"
    And I should see "2 (66.67 %)" in the "Not at all" "table_row"
    And the "Separate groups" select box should not contain "All participants"

  Scenario: User without group can see all participants only
    When I am on the "Course feedback" "mod_feedback > analysis" page logged in as user7
    Then I should see "Separate groups: All participants"
    And I show chart data for the "multichoice1" feedback
    And I should see "2 (28.57 %)" in the "Yes of course" "table_row"
    And I should see "3 (42.86 %)" in the "Not at all" "table_row"
    And I should see "2 (28.57 %)" in the "I don't know" "table_row"

  Scenario: Teacher can browse everybody
    When I am on the "Course feedback" "mod_feedback > analysis" page logged in as teacher
    Then the field "Separate groups" matches value "All participants"
    And I show chart data for the "multichoice1" feedback
    And I should see "2 (28.57 %)" in the "Yes of course" "table_row"
    And I should see "3 (42.86 %)" in the "Not at all" "table_row"
    And I should see "2 (28.57 %)" in the "I don't know" "table_row"
    And I select "Group 1" from the "Separate groups" singleselect
    And I show chart data for the "multichoice1" feedback
    And I should see "2 (50.00 %)" in the "Yes of course" "table_row"
    And I should see "1 (25.00 %)" in the "Not at all" "table_row"
    And I select "Group 2" from the "Separate groups" singleselect
    And I show chart data for the "multichoice1" feedback
    And I should see "0" in the "Yes of course" "table_row"
    And I should see "2 (66.67 %)" in the "Not at all" "table_row"
    And I follow "Show responses"
    And the field "Separate groups" matches value "Group 2"
    And I should not see "Username 1"
    And I should see "Username 3"
    And I select "Group 1" from the "Separate groups" singleselect
    And I should see "Username 1"
    And I should not see "Username 3"
    And I select "All participants" from the "Separate groups" singleselect
    And I should see "Username 1"
    And I should see "Username 3"
