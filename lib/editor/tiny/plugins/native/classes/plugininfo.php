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
 * Tiny ImgPen plugin for Moodle.
 *
 * @package     tiny_native
 * @copyright   2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace tiny_native;

use context;
use editor_tiny\editor;
use editor_tiny\plugin_with_configuration;
use editor_tiny\plugin;

class plugininfo extends plugin implements plugin_with_configuration {
    public static function get_plugin_configuration_for_context(
        context $context,
        array $options,
        array $fpoptions,
        ?editor $editor = null
    ): array {
        global $PAGE;

        $jsrev = $PAGE->requires->get_jsrev();

        $systemcontext = \context_system::instance();
        $itemid = 0;
        $fs = get_file_storage();
        $files = $fs->get_area_files(
            $systemcontext->id,
            'tiny_native',
            'pluginfiles',
            $itemid,
        );

        $pluginfiles = [];
        foreach ($files as $dir) {
            if (!$dir->is_directory()) {
                // All files must be in the format 'PluginName/plugin[.min].js'
                continue;
            }
            $dirfiles = $fs->get_directory_files(
                $systemcontext->id,
                'tiny_native',
                'pluginfiles',
                $itemid,
                $dir->get_filepath(),
            );

            $possiblefiles = [];
            foreach ($dirfiles as $file) {
                switch ($file->get_filename()) {
                    case 'plugin.js':
                    case 'plugin.min.js':
                        $possiblefiles[$file->get_filename()] = $file;
                        break;
                }
            }

            if (count($possiblefiles) === 0) {
                continue;
            } else if (count($possiblefiles) === 2) {
                if ($jsrev === -1) {
                    $file = $possiblefiles['plugin.js'];
                } else {
                    $file = $possiblefiles['plugin.min.js'];
                }
            } else {
                $file = reset($possiblefiles);
            }

            $pluginfiles[trim($dir->get_filepath(), '/')] = \moodle_url::make_pluginfile_url(
                $systemcontext->id,
                'tiny_native',
                'pluginfiles',
                null,
                "/{$jsrev}" . $file->get_filepath(),
                $file->get_filename(),
            )->out();
        }

        return [
            'pluginfiles' => $pluginfiles,
        ];
    }
}
