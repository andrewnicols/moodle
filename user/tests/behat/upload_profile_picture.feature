@core @core_user @_file_upload @javascript
Feature: Upload profile picture
  In order to personalise the user account
  As a user
  I need to upload a profile picture

  @javascript
  Scenario: Upload user profile picture image.
    Given the following "users" exist:
      | username | firstname | lastname | email           |
      | user1    | Henry     | Hobel     | first@example.com  |
    And I log in as "user1"
    And I follow "Profile" in the user menu
    And I click on "Edit profile" "link" in the "region-main" "region"
    And I set the field "Image" to "lib/tests/fixtures/gd-logo.png"
    And I press "Update profile"
    Then I should see "Henry Hobel"
    And "//*[contains(@class, 'page-header-image')]//img[contains(@src, 'pluginfile.php') and @alt='Picture of Henry Hobel']" "xpath_element" should exist
