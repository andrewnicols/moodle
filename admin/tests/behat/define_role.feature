@core @core_admin
Feature: An administrator can define roles
  In order to control access to features
  As an administrator
  I can define new and existing roles

  Scenario: An administrator can define a new role
    Given I log in as "admin"
    And I am on site homepage
    And I navigate to "Users > Permissions > Define roles" in site administration
    And I click on "Add a new role" "button"
    And I click on "Continue" "button"
    When I set the following fields to these values:
      | Short name                           | Parent |
      | Custom full name                     | Parent |
      | contextlevel30                       | 1      |
      | moodle/user:editprofile              | 1      |
    And I click on "Create this role" "button"
    Then I should see "Allow" in the "moodle/user:editprofile" "table_row"

  Scenario: An administrator can edit an existing role
    Given I log in as "admin"
    And I am on site homepage
    And I navigate to "Users > Permissions > Define roles" in site administration
    And I click on "Edit Non-editing teacher role" "link"
    When I set the following fields to these values:
      | moodle/site:accessallgroups              | 1      |
    And I click on "Save changes" "button"
    And I click on "Non-editing teacher role" "link"
    Then I should see "Allow" in the "moodle/site:accessallgroups" "table_row"
