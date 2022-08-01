@core @core_user
Feature: Edit the user description

  @javascript
  Scenario: Edit the user description field
    Given I am logged in as "admin"
    And I follow "Profile" in the user menu
    And I follow "Edit profile"
    And I set the following fields to these values:
      | Description                   | Example |
    And I click on "Update profile" "button"
