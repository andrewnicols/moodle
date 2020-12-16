@core @core_course @_file_upload @javascript
Feature: Add a course image

  In order style a course dashboard card
  As a teacher
  I need to add a course image to the course settings page

  @javascript
  Scenario: Upload a course image
    Given the following "users" exist:
      | username | firstname | lastname | email |
      | teacher1 | Teacher | 1 | teacher1@example.com |
    And the following "courses" exist:
      | fullname | shortname | format |
      | Course 1 | C1 | topics |
    And the following "course enrolments" exist:
      | user | course | role |
      | teacher1 | C1 | editingteacher |
    And I log in as "teacher1"
    And I am on "Course 1" course homepage
    And I navigate to "Edit settings" in current page administration
    And I upload "lib/tests/fixtures/gd-logo.png" file to "Course image" singleimage
    And I press "Save and display"
    And I am on site homepage
    And I should see "Available courses"
    Then the image at "//div[@class='courseimage']/img" "xpath_element" should be identical to "lib/tests/fixtures/gd-logo.png"
