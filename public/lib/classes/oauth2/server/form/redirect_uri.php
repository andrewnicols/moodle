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

namespace core\oauth2\server\form;

use core\oauth2\server\client_manager;

defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir . '/formslib.php');

/**
 * Form for adding a redirect URI to an OAuth2 server client.
 *
 * @package    core
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class redirect_uri extends \moodleform {
    #[\Override]
    protected function definition(): void {
        $mform = $this->_form;

        $mform->addElement('hidden', 'clientidentifier');
        $mform->setType('clientidentifier', PARAM_ALPHANUMEXT);

        $mform->addElement('hidden', 'action', 'adduri');
        $mform->setType('action', PARAM_ALPHA);

        $mform->addElement('text', 'uri', get_string('oauth2server:addredirecturi', 'moodle'), ['size' => 80]);
        $mform->setType('uri', PARAM_URL);
        $mform->addRule('uri', null, 'required', null, 'client');

        $this->add_action_buttons(true, get_string('add'));
    }

    #[\Override]
    public function validation($data, $files): array {
        $errors = parent::validation($data, $files);

        if (!empty($data['uri'])) {
            $error = client_manager::validate_redirect_uri($data['uri']);
            if ($error !== null) {
                $errors['uri'] = $error;
            }
        }

        return $errors;
    }
}
