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
 * Class plugin_installed.
 *
 * @package tool_brickfield
 * @author 2020 JM Tomas <jmtomas@tresipunt.com>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL
 */

namespace tool_brickfield\event;
use coding_exception;
use core\event\base;
use tool_brickfield\manager;

defined('MOODLE_INTERNAL') || die();

class plugin_installed extends base {

    /**
     * @inheritDoc
     */
    protected function init() {
        $this->data['crud'] = 'u';
        $this->data['edulevel'] = self::LEVEL_OTHER;
    }

    /**
     * @return string
     * @throws coding_exception
     */
    public static function get_name(): string {
        return get_string('installed', manager::PLUGINNAME);
    }

    /**
     * @return string
     * @throws coding_exception
     */
    public function get_description(): string {
        return get_string('installeddescription', manager::PLUGINNAME);
    }
}
