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

namespace core_privacy\tests\local\request;

// phpcs:disable Generic.CodeAnalysis.UselessOverridingMethod.Found

/**
 * Testable core\privacy\contextlist_base class.
 *
 * @package    core_privacy
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class contextlist_base extends \core_privacy\local\request\contextlist_base {
    #[\Override]
    public function set_contextids(array $contextids) {
        parent::set_contextids($contextids);
    }
}
