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
 * Steps definitions that will be deprecated in the next releases.
 *
 * @package    core
 * @category   test
 * @copyright  2013 David Monllaó
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// NOTE: no MOODLE_INTERNAL test here, this file may be required by behat before including /config.php.

require_once(__DIR__ . '/../../../lib/behat/behat_base.php');

use Behat\Mink\Exception\ElementNotFoundException as ElementNotFoundException,
    Behat\Gherkin\Node\TableNode as TableNode,
    Behat\Gherkin\Node\PyStringNode as PyStringNode;

/**
 * Deprecated behat step definitions.
 *
 * @package    core
 * @category   test
 * @copyright  2013 David Monllaó
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class behat_deprecated extends behat_base {

    /**
     * Throws an exception if $CFG->behat_usedeprecated is not allowed.
     *
     * @throws Exception
     * @param string|array $alternatives Alternative/s to the requested step
     * @param bool $throwexception If set to true we always throw exception, irrespective of behat_usedeprecated setting.
     * @return void
     */
    protected function deprecated_message($alternatives, $throwexception = false) {
        global $CFG;

        // We do nothing if it is enabled.
        if (!empty($CFG->behat_usedeprecated) && !$throwexception) {
            return;
        }

        if (is_scalar($alternatives)) {
            $alternatives = array($alternatives);
        }

        // Show an appropriate message based on the throwexception flag.
        if ($throwexception) {
            $message = 'This step has been removed. Rather than using this step you can:';
        } else {
            $message = 'Deprecated step, rather than using this step you can:';
        }

        // Add all alternatives to the message.
        foreach ($alternatives as $alternative) {
            $message .= PHP_EOL . '- ' . $alternative;
        }

        if (!$throwexception) {
            $message .= PHP_EOL . '- Set $CFG->behat_usedeprecated in config.php to allow the use of deprecated steps
                    if you don\'t have any other option';
        }

        throw new Exception($message);
    }

    /**
     * Set system level permissions to the specified role. Expects a table with capability name and permission (Inherit/Allow/Prevent/Prohibit) columns.
     * @Given /^I set the following system permissions of "(?P<rolefullname_string>(?:[^"]|\\")*)" role:$/
     * @param string $rolename
     * @param TableNode $table
     * @deprecated since Moodle 4.0
     */
    public function i_set_the_following_system_permissions_of_role(string $rolename, TableNode $table): void {
        $this->deprecated("This step has been deprecated. Please use a data generator instead.");
        $this->set_role_capabilities('System', '', $rolename, $table);
    }

    /**
     * Overrides system capabilities at category, course and module levels. This step begins after clicking 'Permissions' link. Expects a table with capability name and permission (Inherit/Allow/Prevent/Prohibit) columns.
     * @Given /^I override the system permissions of "(?P<rolefullname_string>(?:[^"]|\\")*)" role with:$/
     * @param string $rolename
     * @param TableNode $table
     */
    public function i_override_the_system_permissions_of_role_with($rolename, $table) {
        $this->deprecated("This step has been deprecated. Please use a data generator instead.");

        // We don't know the number of overrides so we have to get it to match the option contents.
        $roleoption = $this->find('xpath', '//select[@name="roleid"]/option[contains(.,"' . $this->escape($rolename) . '")]');

        $this->execute('behat_forms::i_set_the_field_to',
            array(get_string('advancedoverride', 'role'), $this->escape($roleoption->getText()))
        );

        if (!$this->running_javascript()) {
            $this->execute("behat_general::i_click_on_in_the", [get_string('go'), 'button', 'region-main', 'region']);
        }

        $this->execute("behat_permissions::i_fill_the_capabilities_form_with_the_following_permissions", $table);

        $this->execute('behat_forms::press_button', get_string('savechanges'));
    }

    /**
     * Set the capabiltiies in the specified context.
     *
     * @param string $contextlevel
     * @param string $reference
     * @param string $rolename
     * @param TableNode $table
     */
    protected function set_role_capabilities(string $contextlevel, string $reference, string $rolename, TableNode $table): void {
        // Translate the data into the format accepted by the generator.
        $tabledata = [[
            'contextlevel',
            'reference',
            'capability',
            'permission',
            'role',
        ]];

        foreach ($table->getRowsHash() as $capability => $permission) {
            if ($capability === 'capability') {
                // In the old step, the header row was optional.
                // If specified, remove it.
                continue;
            }
            $tabledata[] = [
                $contextlevel,
                $reference,
                $capability,
                $permission,
                $rolename,
            ];
        }

        if (!empty($tabledata)) {
            $table = new TableNode($tabledata);
            $this->execute('behat_data_generators::the_following_entities_exist', ['permissions', $table]);
        }
    }
}
