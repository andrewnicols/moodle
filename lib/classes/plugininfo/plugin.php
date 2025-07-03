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

namespace core\plugininfo;

use core\url;
use core_plugin_manager;
use moodle_url;

/**
 * Plugin information for the `plugin_` plugintype.
 *
 * @package   core
 * @copyright Andrew Lyons <andrew@nicols.co.uk>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class plugin extends base {
    #[\Override]
    public function is_uninstall_allowed(): bool {
        return true;
    }

    #[\Override]
    public static function plugintype_supports_disabling(): bool {
        return true;
    }

    #[\Override]
    public function get_settings_section_name(): string {
        return "{$this->type}_{$this->name}";
    }

    #[\Override]
    public function load_settings(
        \part_of_admin_tree $adminroot,
        $parentnodename,
        $hassiteconfig,
    ): void {
        // TODO - Rewrite this.
        // We need to support a better way of loading settings than a settings.php!!!

        global $CFG, $USER, $DB, $OUTPUT, $PAGE; // In case settings.php wants to refer to them.
        /** @var \admin_root $ADMIN */
        $ADMIN = $adminroot; // May be used in settings.php.
        $plugininfo = $this; // Also can be used inside settings.php.

        if (!$this->is_installed_and_upgraded()) {
            return;
        }

        if (!$hassiteconfig) {
            return;
        }

        $section = $this->get_settings_section_name();

        // Load the specific settings.
        $settings = new \core_ai\admin\admin_settingspage_provider(
            name: $section,
            visiblename: $this->displayname,
            req_capability: 'moodle/site:config',
            hidden: true,
        );
        if (file_exists($this->full_path('settings.php'))) {
            include($this->full_path('settings.php')); // This may also set $settings to null.
            // Show the save changes button between the specific settings and the actions table.
            $settings->add(new \admin_setting_savebutton("{$section}/savebutton"));
        }

        // Load the actions table.
        if (file_exists($this->full_path('setting_actions.php'))) {
            include($this->full_path('setting_actions.php')); // This may also set $settings to null.
        } else {
            $settings->add(new \admin_setting_heading("{$section}/generals",
                new \lang_string('placementactionsettings', 'core_ai'),
                new \lang_string('placementactionsettings_desc', 'core_ai')));
            // Load the setting table of actions that this provider supports.
            $settings->add(new \core_ai\admin\admin_setting_action_manager(
                $section,
                \core_ai\table\aiplacement_action_management_table::class,
                'manageaiplacements',
                new \lang_string('manageaiproviders', 'core_ai'),
            ));
        }

        if ($settings) {
            $ADMIN->add($parentnodename, $settings);
        }
    }

    #[\Override]
    public static function get_manage_url(): moodle_url {
        // TODO: Find a better way of doing this!
        return new url('/admin/settings.php', [
            'section' => 'plugin',
        ]);
    }

    #[\Override]
    public static function enable_plugin(string $pluginname, int $enabled): bool {
        $plugin = "plugin_$pluginname";
        $oldvalue = self::is_plugin_enabled($pluginname);
        $newvalue = (bool) $enabled;

        if ($oldvalue !== $newvalue) {
            if ($newvalue) {
                set_config('enabled', $enabled, $plugin);
            } else {
                unset_config('enabled', $plugin);
            }

            add_to_config_log('enabled', $oldvalue, $newvalue, $plugin);
            core_plugin_manager::reset_caches();
            return true;
        }

        return false;
    }

    #[\Override]
    public static function get_enabled_plugins(): ?array {
        $pluginmanager = core_plugin_manager::instance();
        $plugins = $pluginmanager->get_installed_plugins('plugin');

        if (!$plugins) {
            return [];
        }

        $plugins = array_keys($plugins);

        // Filter to return only enabled plugins.
        $enabled = [];
        foreach ($plugins as $plugin) {
            if (self::is_plugin_enabled($plugin)) {
                $enabled[$plugin] = $plugin;
            }
        }
        return $enabled;
    }

    /**
     * Check if a plugin is enabled in config.
     *
     * @param string $plugin
     * @return bool
     */
    public static function is_plugin_enabled(string $plugin): bool {
        $config = get_config("plugin_{$plugin}", 'enabled');
        return $config == 1;
    }
}
