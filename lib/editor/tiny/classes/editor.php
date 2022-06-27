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

namespace editor_tiny;

/**
 * Tiny Editor.
 *
 * @package    editor_tiny
 * @copyright  2021 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

class editor extends \texteditor {

    /** @var manager The Tiny Manager instace */
    protected $manager;

    public function __construct() {
        $this->manager = new manager();
    }

    /**
     * Is the current browser supported by this editor?
     *
     * @return bool
     */
    public function supported_by_browser() {
        return true;
    }

    /**
     * List of supported text field formats.
     *
     * @return array
     */
    public function get_supported_formats() {
        return [
            FORMAT_HTML => FORMAT_HTML,
        ];
    }

    /**
     * Returns text format preferred by this editor.
     *
     * @return int
     */
    public function get_preferred_format() {
        return FORMAT_HTML;
    }

    /**
     * Does this editor support picking from repositories?
     *
     * @return bool
     */
    public function supports_repositories() {
        return true;
    }

    /**
     * Use this editor for given element.
     *
     * @param string $elementid
     * @param array $options
     * @param null $fpoptions
     */
    public function use_editor($elementid, array $options = null, $fpoptions = null) {
        global $PAGE;

        $PAGE->requires->js_call_amd('editor_tiny/editor', 'setupForElementId', [[
            'elementId' => $elementid,
        ]]);
    }

    public function get_data_attributes(): array {
        // TODO Make this work properly.
        return [
            'data-region' => 'editor_tiny',
            'data-pluginlist' => json_encode($this->manager->get_available_plugins()),
        ];
    }
}
