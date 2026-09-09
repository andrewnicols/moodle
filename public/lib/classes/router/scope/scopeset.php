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

namespace core\router\scope;

/**
 * A set of scopes.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\Attribute(\Attribute::TARGET_METHOD | \Attribute::IS_REPEATABLE)]
final readonly class scopeset {
    /**
     * @var \core\router\scope\abstract_scope[]
     *
     * A list of required scopes. All scopes are required.
     */
    public readonly array $requiredscopes;

    /**
     * Create an instance of the scope set attribute.
     *
     * @param \core\router\scope\abstract_scope[] $requiredscopes The list of required scopes as an AND condition
     */
    public function __construct(
        \core\router\scope\abstract_scope ...$requiredscopes,
    ) {
        $this->requiredscopes = $requiredscopes;
    }

    /**
     * Determine whether this scope set is fully satisfied by the provided scopes.
     *
     * @param array $grantedscopes
     * @return bool
     */
    public function is_satisfied_by(array $grantedscopes): bool {
        foreach ($this->requiredscopes as $requiredscope) {
            if (!$requiredscope->is_satisfied_by($grantedscopes)) {
                return false;
            }
        }

        return true;
    }
}
