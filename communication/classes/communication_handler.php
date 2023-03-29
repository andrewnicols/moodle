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

namespace core_communication;

use core_communication\task\room_operation_processor;
use core_communication\task\user_operation_processor;

/**
 * Class communication_handler to manage the provider communication objects and actions for apis using core_communication.
 *
 * @package    core_communication
 * @copyright  2023 Safat Shahin <safat.shahin@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class communication_handler {

    /** @var communication $communication The communication settings object */

    /**
     * Communication handler constructor to manage and handle all communication related actions.
     *
     * This class is the entrypoint for all kinda usages.
     *
     * @param string $component The component of the item for the instance
     * @param string $instancetype The type of the item for the instance
     * @param int $instanceid The id of the instance
     *
     */
    public function __construct(
        private communication $communication,
    ) {
    }

    /**
     * Get the list of plugins for form selection.
     *
     * @return array
     */
    public static function get_communication_plugin_list_for_form(): array {
        // Add the option to have communication disabled.
        $selection[communication::PROVIDER_NONE] = get_string('nocommunicationselected', 'communication');
        $communicationplugins = \core\plugininfo\communication::get_enabled_plugins();
        foreach ($communicationplugins as $pluginname => $notusing) {
            $selection["communication_{$pluginname}"] = get_string('pluginname', 'communication_'. $pluginname);
        }
        return $selection;
    }

    /**
     * Define the form elements for the communication api.
     *
     * @param \MoodleQuickForm $mform The form element
     * @return void
     */
    public function form_definition(\MoodleQuickForm $mform): void {
        $mform->addElement('header', 'communication', get_string('communication', 'communication'));

        // List the communication providers.
        $communicationproviders = self::get_communication_plugin_list_for_form();
        $mform->addElement(
            'select',
            'selectedcommunication',
            get_string('seleccommunicationprovider', 'communication'),
            $communicationproviders,
        );
        $mform->addHelpButton('selectedcommunication', 'seleccommunicationprovider', 'communication');
        $mform->setDefault('selectedcommunication', communication::PROVIDER_NONE);

        // Room name for the communication provider.
        $mform->addElement(
            'text',
            'communicationroomname',
            get_string('communicationroomname', 'communication'),
            'maxlength="100" size="20"',
        );
        $mform->addHelpButton('communicationroomname', 'communicationroomname', 'communication');
        $mform->setType('communicationroomname', PARAM_TEXT);
        $mform->hideIf('communicationroomname', 'selectedcommunication', 'eq', communication::PROVIDER_NONE);
    }

    /**
     * Set the form data if the data is already available.
     *
     * @param \stdClass $instance The instance object
     * @return void
     */
    public function set_data(\stdClass $instance): void {
        if ($this->communication) {
            $instance->selectedcommunication = $this->communication->get_provider();
            $instance->communicationroomname = $this->communication->get_room_name();
        }
    }
}
