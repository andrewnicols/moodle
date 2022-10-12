@editor @editor_tiny @javascript
Feature: TinyMCE standard formatting functionality
  In order to format text appropriately for its context
  As a user
  I need to be able use the formatting features

  Scenario Outline: Toggling the standard TinyMCE toggle buttons should indicate their state
    Given I log in as "admin"
    And I open my profile in edit mode
    And I click on the "More..." button for the "Description" TinyMCE editor
    Then the "<button>" button of the "Description" TinyMCE editor has state "false"
    When I click on the "<button>" button for the "Description" TinyMCE editor
    Then the "<button>" button of the "Description" TinyMCE editor has state "true"

  Examples:
      | button        |
      | Bold          |
      | Italic        |
      | Align left    |
      | Align center  |
      | Align right   |
      | Justify       |
      | Bullet list   |
      | Numbered list |

  Scenario Outline: Toggling the standard TinyMCE toggle buttons with content selected
    Given I log in as "admin"
    And I open my profile in edit mode
    And I click on the "More..." button for the "Description" TinyMCE editor
    And I type the following text in the "Description" TinyMCE editor:
      """
      This is not important
      This is important
      Final line
      """

    And I select the "p" element in position "1" of the "Description" TinyMCE editor
    When I click on the "<button>" button for the "Description" TinyMCE editor
    Then the field "Description" matches value "<result>"

    Examples:
      | button        | result                                                                                                  |
      | Bold          | <p>This is not important</p><p><strong>This is important</strong></p><p>Final line<</p> |
      | Italic        | <p>This is not important</p><p><em>This is important</em></p><p>Final line</p>                 |
      | Align left    | <p>This is not important</p><p style=\"text-align: left;\">This is important</p><p>Final line</p>       |
      | Align center  | <p>This is not important</p><p style=\"text-align: center;\">This is important</p><p>Final line</p>     |
      | Align right   | <p>This is not important</p><p style=\"text-align: right;\">This is important</p><p>Final line</p>      |
      | Justify       | <p>This is not important</p><p style=\"text-align: justify;\">This is important</p><p>Final line</p>    |
      | Bullet list   | <p>This is not important</p><ul><li>This is important</li></ul><p>Final line</p>                 |
      | Numbered list | <p>This is not important</p><ol><li>This is important</li></ol><p>Final line</p>                 |

  Scenario Outline: Applying standard TinyMCE formattings should reflect in the generated content
    # This test has unformatted text, followed by partially formatted text, followed by another line of formatted text.
    # We need this combination to test features which apply to the whole line, like alignment.
    Given I log in as "admin"
    And I open my profile in edit mode
    And I click on the "More..." button for the "Description" TinyMCE editor
    And I type the following text in the "Description" TinyMCE editor:
      """
      This is not important

      """

    When I click on the "<button>" button for the "Description" TinyMCE editor
    And I type the following text in the "Description" TinyMCE editor:
      """
      This is important
      """
    And I click on the "<button>" button for the "Description" TinyMCE editor
    And I type the following text in the "Description" TinyMCE editor:
      """
       (I promise)
      """
    And I type the following text in the "Description" TinyMCE editor:
      """


      """
    And I click on the "<button>" button for the "Description" TinyMCE editor
    And I type the following text in the "Description" TinyMCE editor:
      """
      Final line
      """
    Then the field "Description" matches value "<result>"

    Examples:
      | button        | result                                                                                                              |
      | Bold          | <p>This is not important</p><p><strong>This is important</strong> (I promise)</p><p><strong>Final line</strong></p> |
      | Italic        | <p>This is not important</p><p><em>This is important</em> (I promise)</p><p><em>Final line</em></p>                 |
      | Align left    | <p>This is not important</p><p>This is important (I promise)</p><p style=\"text-align: left;\">Final line</p>       |
      | Align center  | <p>This is not important</p><p>This is important (I promise)</p><p style=\"text-align: center;\">Final line</p>     |
      | Align right   | <p>This is not important</p><p>This is important (I promise)</p><p style=\"text-align: right;\">Final line</p>      |
      | Justify       | <p>This is not important</p><p>This is important (I promise)</p><p style=\"text-align: justify;\">Final line</p>    |
      | Bullet list   | <p>This is not important</p><p>This is important (I promise)</p><ul><li>Final line</li></ul>                        |
      | Numbered list | <p>This is not important</p><p>This is important (I promise)</p><ol><li>Final line</li></ol>                        |

  @tiny_test
  Scenario Outline: Applying standard TinyMCE formattings should reflect in the generated content
    # This test has unformatted text, followed by partially formatted text, followed by another line of formatted text.
    # We need this combination to test features which apply to the whole line, like alignment.
    Given I log in as "admin"
    And I change the window size to "large"
    And I open my profile in edit mode
    And I type the following text in the "Description" TinyMCE editor:
      """
      This is not important

      """

    When I click on the "<menuitem>" menu item for the "Description" TinyMCE editor
    And I type the following text in the "Description" TinyMCE editor:
      """
      This is important
      """
    When I click on the "<menuitem>" menu item for the "Description" TinyMCE editor
    And I type the following text in the "Description" TinyMCE editor:
      """
       (I promise)
      """
    And I type the following text in the "Description" TinyMCE editor:
      """


      """
    When I click on the "<menuitem>" menu item for the "Description" TinyMCE editor
    And I type the following text in the "Description" TinyMCE editor:
      """
      Final line
      """
    Then the field "Description" matches value "<result>"

    Examples:
      | menuitem                 | result                                                                                                              |
      | Format > Bold            | <p>This is not important</p><p><strong>This is important</strong> (I promise)</p><p><strong>Final line</strong></p> |
      | Format > Italic          | <p>This is not important</p><p><em>This is important</em> (I promise)</p><p><em>Final line</em></p>                 |
      | Format > Align > Left    | <p>This is not important</p><p>This is important (I promise)</p><p style=\"text-align: left;\">Final line</p>       |
      | Format > Align > Center  | <p>This is not important</p><p>This is important (I promise)</p><p style=\"text-align: center;\">Final line</p>     |
      | Format > Align > Right   | <p>This is not important</p><p>This is important (I promise)</p><p style=\"text-align: right;\">Final line</p>      |
      | Format > Align > Justify | <p>This is not important</p><p>This is important (I promise)</p><p style=\"text-align: justify;\">Final line</p>    |
