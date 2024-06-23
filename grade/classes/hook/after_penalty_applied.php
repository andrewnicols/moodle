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

namespace core_grades\hook;

use Psr\EventDispatcher\StoppableEventInterface;

/**
 * Hook after penalty is applied.
 *
 * This hook will be dispatched after the penalty is applied to the grade.
 * Allow plugins to perform further action after penalty is applied.
 *
 * @package   core_grades
 * @copyright 2024 Catalyst IT Australia Pty Ltd
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\core\attribute\label('Allow plugins to perform further action after penalty is applied.')]
#[\core\attribute\tags('grade')]
class after_penalty_applied implements StoppableEventInterface {
    use grade_penalty_handler;
}
