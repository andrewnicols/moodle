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

use context;

abstract class plugin {
    /**
     * Whether the plugin is enabled
     *
     * @param context $context The context that the editor is used within
     * @param array $options The options passed in when requesting the editor
     * @param array $fpoptions The filepicker options passed in when requesting the editor
     * @param editor $editor The editor instance in which the plugin is initialised
     * @return boolean
     */
    public static function is_enabled(
        context $context,
        array $options,
        array $fpoptions,
        ?editor $editor = null
    ): bool {
        return true;
    }

    /**
     * Get the plugin information for the plugin.
     *
     * @param context $context The context that the editor is used within
     * @param array $options The options passed in when requesting the editor
     * @param array $fpoptions The filepicker options passed in when requesting the editor
     * @param editor $editor The editor instance in which the plugin is initialised
     * @return array
     */
    final public static function get_plugin_info(
        context $context,
        array $options,
        array $fpoptions,
        ?editor $editor = null
    ): array {
        $plugindata = [];

        if (is_a(static::class, plugin_with_buttons::class, true)) {
            $plugindata['buttons'] = static::get_available_buttons();
        }

        if (is_a(static::class, plugin_with_menuitems::class, true)) {
            $plugindata['menuitems'] = static::get_available_menuitems();
        }

        if (is_a(static::class, plugin_with_configuration::class, true)) {
            $plugindata['config'] = static::get_plugin_configuration_for_context($context, $options, $fpoptions, $editor);
        }

        return $plugindata;
    }
}
