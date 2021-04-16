@tool @tool_brickfield
Feature: Brickfield checktyperesults

  Background:
    Given the following "courses" exist:
      | fullname | shortname | category | description |
      | Course 1 | C1 | 0 | <b> Description text </b> |
    Given the following config values are set as admin:
      | key  | 763dbe6682289fe8f36df1a66aec62de | tool_brickfield |
      | hash | f3d029743bcfbb92ac721c64a6558ca1 | tool_brickfield |
      | id   | 29                               | tool_brickfield |

  @javascript
  Scenario: Test the checktyperesults plugin
    Given I log in as "admin"
    And I follow "Site administration"
    And I follow "Plugins"
    And I follow "Admin tools"
    And I follow "Accessibility"
    And I follow "Go to reports"
    When I follow "Content types"
    Then I should see "Results per content type : All reviewed courses (0)"
