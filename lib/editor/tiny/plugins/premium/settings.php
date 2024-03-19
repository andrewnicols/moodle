<?php
// This file is part of Moodle - https://moodle.org/
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
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Settings for the Tiny Premium plugin.
 *
 * @package     tiny_premium
 * @category    admin
 * @copyright   2023 David Woloszyn <david.woloszyn@moodle.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

if ($hassiteconfig) {
    // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedIf
    if ($ADMIN->fulltree) {
        // Set API key.
        $setting = new admin_setting_configpasswordunmask(
            'tiny_premium/apikey',
            get_string('apikey', 'tiny_premium'),
            get_string('apikey_desc', 'tiny_premium'),
            '',
        );
        $settings->add($setting);

        // Enable/disable individual premium plugins.
        $setting = new admin_setting_configmulticheckbox(
            name: 'tiny_premium/enabledplugins',
            visiblename: get_string('enablepremiumplugins', 'tiny_premium'),
            description: get_string('enablepremiumplugins_desc', 'tiny_premium'),
            defaultsetting: [],
            choices:[
                    'advtable' => get_string('premiumplugin:advtable', 'tiny_premium'),
                    'editimage' => get_string('premiumplugin:editimage', 'tiny_premium'),
                    'export' => get_string('premiumplugin:export', 'tiny_premium'),
                    'pageembed' => get_string('premiumplugin:pageembed', 'tiny_premium'),
                    'typography' => get_string('premiumplugin:typography', 'tiny_premium'),
                    'casechange' => get_string('premiumplugin:casechange', 'tiny_premium'),
                    'checklist' => get_string('premiumplugin:checklist', 'tiny_premium'),
                    'tinymcespellchecker' => get_string('premiumplugin:tinymcespellchecker', 'tiny_premium'),
                    'autocorrect' => get_string('premiumplugin:autocorrect', 'tiny_premium'),
                    'permanentpen' => get_string('premiumplugin:permanentpen', 'tiny_premium'),
                    'formatpainter' => get_string('premiumplugin:formatpainter', 'tiny_premium'),
                    'linkchecker' => get_string('premiumplugin:linkchecker', 'tiny_premium'),
                    'tableofcontents' => get_string('premiumplugin:tableofcontents', 'tiny_premium'),
                    'footnotes' => get_string('premiumplugin:footnotes', 'tiny_premium'),
                    'powerpaste' => get_string('premiumplugin:powerpaste', 'tiny_premium'),
                ],
            );
            $settings->add($setting);
    }
}
