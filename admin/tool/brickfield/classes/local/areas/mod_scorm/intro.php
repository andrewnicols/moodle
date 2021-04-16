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

namespace tool_brickfield\local\areas\mod_scorm;

use tool_brickfield\local\areas\module_area_base;

defined('MOODLE_INTERNAL') || die();

class intro extends module_area_base {

    /**
     * @return string
     */
    public function get_tablename(): string {
        return 'scorm';
    }

    /**
     * @return string
     */
    public function get_fieldname(): string {
        return 'intro';
    }
}
