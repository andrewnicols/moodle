@editor @editor_tiny @tiny_media @javascript
Feature: Use the TinyMCE editor to upload a video
  In order to work with videos
  As a user
  I need to be able to upload and manipulate videos

  Scenario: Clicking on the Video button in the TinyMCE editor opens the video dialog
    Given I log in as "admin"
    And I open my profile in edit mode
    When I click on the "Moodle Video" button for the "Description" TinyMCE editor
    Then "Insert media" "dialogue" should exist

  Scenario: Browsing repositories in the TinyMCE editor shows the FilePicker
    Given I log in as "admin"
    And I open my profile in edit mode
    When I click on the "Moodle Video" button for the "Description" TinyMCE editor
    And I click on "Browse repositories" "button" in the "Insert media" "dialogue"
    Then "File picker" "dialogue" should exist

  @_file_upload @test_tiny
  Scenario: Browsing repositories in the TinyMCE editor shows the FilePicker
    Given I log in as "admin"
    And I open my profile in edit mode
    When I click on the "Moodle Video" button for the "Description" TinyMCE editor
    And I follow "Video"

    # It can't find the "Browse repositories button once I click "video"
    #And I click on "Browse repositories" "button" in the "Insert media" "dialogue"
    #And I click on "Browse repositories..." "button" in the "#id_description_editor_atto_media_form" "css_element"

    And I upload "/lib/editor/tiny/tests/behat/fixtures/moodle-logo.mp4" to the file picker for TinyMCE
    # Note: This needs to be replaced with a label.
    Then ".tiny_image_preview" "css_element" should be visible
