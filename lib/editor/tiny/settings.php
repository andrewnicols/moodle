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
 * Tiny admin settings.
 *
 * @package    editor_tiny
 * @copyright  2022 Huong Nguyen <huongnv13@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

$ADMIN->add('editorsettings', new admin_category('editortiny', $editor->displayname, $editor->is_enabled() === false));

$settings = new admin_settingpage('editorsettingstiny', new lang_string('settings', 'editor_tiny'));

foreach (core_plugin_manager::instance()->get_plugins_of_type('tiny') as $plugin) {
    /** @var \editor_tiny\plugininfo\tiny $plugin */
    $plugin->load_settings($ADMIN, 'editortiny', $hassiteconfig);
}

// Required or the editor plugininfo will add this section twice.
unset($settings);
$settings = null;
