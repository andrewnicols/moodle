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

namespace editor_ckeditor;

use texteditor;

/**
 * CKEditor Implementation.
 *
 * @package    editor
 * @subpackage ckeditor
 * @copyright  2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

class editor extends texteditor {
    public function supported_by_browser() {
        return true;
    }

    public function get_supported_formats() {
        return array(FORMAT_HTML => FORMAT_HTML);
    }

    public function get_preferred_format() {
        return FORMAT_HTML;
    }

    public function supports_repositories() {
        return true;
    }

    public function use_editor($elementid, array $options=null, $fpoptions=null) {
        global $PAGE;

        $PAGE->requires->js_call_amd('editor_ckeditor/init', 'init', [[
            'element' => $elementid,
            'additionalPlugins' => [
                //'editor_ckeditor/plugin',
            ],
        ]]);
    }

    public function get_data_attributes(): array {
        return [
            'data-editor' => 'ckeditor',
            'data-toolbar' => json_encode([
                'heading', '|',
                'outdent', 'indent', '|',
                'bold', 'italic', 'underline', 'strikethrough', '|',
                'bulletedList', 'numberedList', '|',
                'code', '|',
                'subscript', 'superscript', '|',
                'highlight',
            ]),
        ];
    }
}
