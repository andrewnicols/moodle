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
    public static function get_plugin_info(): array {
        $plugindata = [];

        if (is_a(static::class, plugin_with_buttons::class, true)) {
            $plugindata['buttons'] = static::get_available_buttons();
        }

        if (is_a(static::class, plugin_with_menuitems::class, true)) {
            $plugindata['menuitems'] = static::get_available_menuitems();
        }

        return $plugindata;
    }

    public static function get_plugin_configuration_for_context(
        context $context,
        array $options,
        array $fpoptions
    ): array {
        if (is_a(static::class, plugin_with_configuration::class, true)) {
            return static::get_plugin_configuration_for_context($context, $options, $fpoptions);
        }

        return [];
    }
}
