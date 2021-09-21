@mod @mod_feedback
Feature: Feedbacks in courses with groups
  In order to collect feedbacks per group
  As an teacher
  I need to be able to filter feedback replies by groups

  Background:
    Given I change window size to "large"
    And the following "users" exist:
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
      | activity | name                 | course | idnumber  | anonymous | publish_stats | groupmode | section |
      | feedback | Course anon feedback | C1     | feedback1 | 1         | 1             | 1         | 0       |
    And the following "mod_feedback > question" exists:
      | activity        | feedback1                               |
      | name            | Do you like this course?                |
      | questiontype    | multichoice                             |
      | label           | multichoice1                            |
      | subtype         | r                                       |
      | hidenoselect    | 1                                       |
      | values          | Yes of course\nNot at all\nI don't know |

  @javascript
  Scenario: Anonymous feedback with groups in a course - insufficient responses
    Given the following "mod_feedback > responses" exist:
      | activity  | user  | Do you like this course? |
      | feedback1 | user1 | Not at all               |
    When I am on the "Course anon feedback" "mod_feedback > analysis" page logged in as user1
    Then I should not see "Yes of course"
    And I should see "There are insufficient responses for this group"

  @javascript
  Scenario: Anonymous feedback - View analysis, user1 should only see one group - group 1
    Given the following "mod_feedback > responses" exist:
      | activity  | user  | Do you like this course? |
      | feedback1 | user1 | Not at all               |
      | feedback1 | user2 | I don't know             |
      | feedback1 | user3 | Not at all               |
      | feedback1 | user4 | Yes of course            |
      | feedback1 | user5 | Yes of course            |
      | feedback1 | user6 | Not at all               |
      | feedback1 | user7 | I don't know             |

    When I am on the "Course anon feedback" "mod_feedback > analysis" page logged in as user1
    Then I should see "Separate groups: Group 1"
    And I show chart data for the "multichoice1" feedback
    And I should see "2 (50.00 %)" in the "Yes of course" "table_row"
    And I should see "1 (25.00 %)" in the "Not at all" "table_row"

  @javascript
  Scenario: Anonymous feedback - View analysis, user3 should only see one group - group 2
    Given the following "mod_feedback > responses" exist:
      | activity  | user  | Do you like this course? |
      | feedback1 | user1 | Not at all               |
      | feedback1 | user2 | I don't know             |
      | feedback1 | user3 | Not at all               |
      | feedback1 | user4 | Yes of course            |
      | feedback1 | user5 | Yes of course            |
      | feedback1 | user6 | Not at all               |
      | feedback1 | user7 | I don't know             |

    When I am on the "Course anon feedback" "mod_feedback > analysis" page logged in as user3
    Then I should see "Separate groups: Group 2"
    And I show chart data for the "multichoice1" feedback
    And I should see "0" in the "Yes of course" "table_row"
    And I should see "2 (66.67 %)" in the "Not at all" "table_row"

  @javascript
  Scenario: Anonymous feedback - View analysis, user2 should see a group selector and be able to change the group but not view all
    Given the following "mod_feedback > responses" exist:
      | activity  | user  | Do you like this course? |
      | feedback1 | user1 | Not at all               |
      | feedback1 | user2 | I don't know             |
      | feedback1 | user3 | Not at all               |
      | feedback1 | user4 | Yes of course            |
      | feedback1 | user5 | Yes of course            |
      | feedback1 | user6 | Not at all               |
      | feedback1 | user7 | I don't know             |

    When I am on the "Course anon feedback" "mod_feedback > analysis" page logged in as user2
    Then the field "Separate groups" matches value "Group 1"
    And I show chart data for the "multichoice1" feedback
    And I should see "2 (50.00 %)" in the "Yes of course" "table_row"
    And I should see "1 (25.00 %)" in the "Not at all" "table_row"
    And I select "Group 2" from the "Separate groups" singleselect
    And I show chart data for the "multichoice1" feedback
    And I should see "0" in the "Yes of course" "table_row"
    And I should see "2 (66.67 %)" in the "Not at all" "table_row"
    And the "Separate groups" select box should not contain "All participants"

  @javascript
  Scenario: Anonymous feedback - User without group can see all participants only
    Given the following "mod_feedback > responses" exist:
      | activity  | user  | Do you like this course? |
      | feedback1 | user1 | Not at all               |
      | feedback1 | user2 | I don't know             |
      | feedback1 | user3 | Not at all               |
      | feedback1 | user4 | Yes of course            |
      | feedback1 | user5 | Yes of course            |
      | feedback1 | user6 | Not at all               |
      | feedback1 | user7 | I don't know             |

    When I am on the "Course anon feedback" "mod_feedback > analysis" page logged in as user7
    Then I should see "Separate groups: All participants"
    And I show chart data for the "multichoice1" feedback
    And I should see "2 (28.57 %)" in the "Yes of course" "table_row"
    And I should see "3 (42.86 %)" in the "Not at all" "table_row"
    And I should see "2 (28.57 %)" in the "I don't know" "table_row"

  @javascript
  Scenario: Anonymous feedback - Teacher can browse everybody
    Given the following "mod_feedback > responses" exist:
      | activity  | user  | Do you like this course? |
      | feedback1 | user1 | Not at all               |
      | feedback1 | user2 | I don't know             |
      | feedback1 | user3 | Not at all               |
      | feedback1 | user4 | Yes of course            |
      | feedback1 | user5 | Yes of course            |
      | feedback1 | user6 | Not at all               |
      | feedback1 | user7 | I don't know             |

    When I am on the "Course anon feedback" "mod_feedback > analysis" page logged in as teacher
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
    # The response numbers were randomly allocated, we only can assert the number of visible responses here:
    And the field "Separate groups" matches value "Group 2"
    And "//tr[contains(@id,'_r2') and contains(.,'Response number')]" "xpath_element" should exist
    And "//tr[contains(@id,'_r3') and contains(@class,'emptyrow')]" "xpath_element" should exist
    And I select "Group 1" from the "Separate groups" singleselect
    And "//tr[contains(@id,'_r3') and contains(.,'Response number')]" "xpath_element" should exist
    And "//tr[contains(@id,'_r4') and contains(@class,'emptyrow')]" "xpath_element" should exist
    And I select "All participants" from the "Separate groups" singleselect
    And "//tr[contains(@id,'_r6') and contains(.,'Response number')]" "xpath_element" should exist
    And "//tr[contains(@id,'_r7') and contains(@class,'emptyrow')]" "xpath_element" should exist
