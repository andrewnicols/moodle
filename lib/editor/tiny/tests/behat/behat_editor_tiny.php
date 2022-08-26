<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * TinyMCE custom steps definitions.
 *
 * @package    editor_tiny
 * @category   test
 * @copyright  2022 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

use Behat\Behat\Hook\Scope\BeforeScenarioScope;

require_once(__DIR__ . '/../../../../behat/behat_base.php');

class behat_editor_tiny extends behat_base {

    /**
     * @param $params
     * @param $editorid
     * @param $value
     * @return void
     */
    public function set_editor_value($params, $editorid, $value) {
        $js = <<<EOF
            require(['editor_tiny/editor'], (editor) => {
                const instance = editor.getInstanceForElementId('${editorid}');
                instance.setContent('${value}');
                instance.undoManager.add();
            });
        EOF;
        behat_base::execute_script_in_session($params->getSession(), $js);
    }

    /**
     * Set Tiny as default editor before executing Tiny tests.
     *
     * @BeforeScenario
     */
    public function set_default_editor_flag(BeforeScenarioScope $scope): void {
        // This only applies to a scenario which matches the editor_atto, or an atto subplugin.
        $callback = function (string $tag): bool {
            return $tag === 'editor_tiny' || substr($tag, 0, 5) === 'tiny_';
        };

        if (!self::scope_tags_match($scope, $callback)) {
            return;
        }

        $this->execute('behat_general::the_default_editor_is_set_to', ['tiny']);
    }
}
