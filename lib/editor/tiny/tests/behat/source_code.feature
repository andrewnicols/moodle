@core @editor_tiny @source_code @javascript
Feature: A user can insert script tag in TinyMCE

  Scenario: Allow script elements in the editor
    Given I am on the "Profile advanced editing" page logged in as "admin"
    And I set the field "Description" to "<p><script>alert('script in tiny');</script></p>"
    When I click on the "Tools > Source code" menu item for the "Description" TinyMCE editor
    And I click on "Save" "button"
    Then the field "Description" matches multiline:
    """
  <p>
    <script>
        alert('script in tiny');
      </script>
    </p>
    """
