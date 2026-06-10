@core @core_course @testme @javascript
Feature: Test login failures
    In order to group users and contents
    As a manager
    I need to create courses and set default values on them

  Scenario: Test scenario 1
    Given the following "users" exist:
      | username | firstname | lastname | email             |
      | kevin    | Kevin     | the      | kevin@example.com |
    And the following "roles" exist:
      | shortname | name    | archetype |
      | creator   | Creator |           |
    And I am logged in as "kevin"
    Then I should not see "Your session has timed out. Please log in again."

  Scenario: Test scenario 2
    Given the following "users" exist:
      | username | firstname | lastname | email             |
      | kevin    | Kevin     | the      | kevin@example.com |
    And the following "roles" exist:
      | shortname | name    | archetype |
      | creator   | Creator |           |
    And I am logged in as "kevin"
    Then I should not see "Your session has timed out. Please log in again."

  Scenario: Test scenario 3
    Given the following "users" exist:
      | username | firstname | lastname | email             |
      | kevin    | Kevin     | the      | kevin@example.com |
    And the following "roles" exist:
      | shortname | name    | archetype |
      | creator   | Creator |           |
    And I am logged in as "kevin"
    Then I should not see "Your session has timed out. Please log in again."
    And I log out

  Scenario: Test scenario 4
    Given the following "users" exist:
      | username | firstname | lastname | email             |
      | kevin    | Kevin     | the      | kevin@example.com |
    And the following "roles" exist:
      | shortname | name    | archetype |
      | creator   | Creator |           |
    And I am logged in as "kevin"
    Then I should not see "Your session has timed out. Please log in again."
