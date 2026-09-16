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

namespace core_grades\route\scope\grade;

/**
 * The core_grades:grade:read:self scope.
 *
 * This scope is used to guard reading a user's own grade data.
 *
 * @package    core_grades
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\core\router\scope\identifier_attribute('self')]
#[\core\router\scope\summary_attribute('grade_read_self_scope_summary', 'core_grades')]
#[\core\router\scope\description_attribute('grade_read_self_scope_desc', 'core_grades')]
class read_self extends read {
}
