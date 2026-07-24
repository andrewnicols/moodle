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

namespace core\tests\plugininfo;

/**
 * Testable plugininfo subclass representing a fake plugin type instance.
 *
 * @package     core
 * @category    test
 * @copyright   2015 David Mudrak <david@moodle.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class base extends \core\plugininfo\base {
    /**
     * Create a fake plugin instance.
     *
     * @param mixed $type
     * @param mixed $typerootdir
     * @param mixed $name
     * @param mixed $namerootdir
     * @param mixed $typeclass
     * @param mixed $pluginman
     * @return \core\plugininfo\base
     */
    public static function fake_plugin_instance($type, $typerootdir, $name, $namerootdir, $typeclass, $pluginman) {
        return self::make_plugin_instance($type, $typerootdir, $name, $namerootdir, $typeclass, $pluginman);
    }

    #[\Override]
    public function init_display_name() {
        $this->displayname = 'Testable fake pluginfo instance';
    }

    #[\Override]
    public function load_db_version() {
        $this->versiondb = null;
    }

    #[\Override]
    public function init_is_standard() {
        $this->source = \core\plugin_manager::PLUGIN_SOURCE_EXTENSION;
    }
}
