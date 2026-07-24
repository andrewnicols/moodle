@core @core_auth
Feature: Test the 'remember username' feature works.
  In order for users to easily log in to the site
  As a user
  I need the site to remember my username when the feature is enabled

  Background:
    Given the following "users" exist:
      | username |
      | teacher1 |

  # Given the user has logged in and selected 'Remember username', when they log in again, then their username should be remembered.
  @javascript
  Scenario: Check that 'remember username' works
    # Log in the first time with $CFG->rememberusername set to Yes.
    Given the following config values are set as admin:
      | rememberusername | 1 |
    And I am on homepage
    And I set the field "Username" to "teacher1"
    And I set the field "Password" to "teacher1"
    And I press "Log in"
    And I log out
    # Log out and check that the username was remembered.
    When I am on homepage
    Then the field "username" matches value "teacher1"
