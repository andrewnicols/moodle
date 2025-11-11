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
 * The name attribute for a scope.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\Attribute(\Attribute::TARGET_CLASS)]
class name_attribute {
    /**
     * Constructor.
     *
     * @param string $name The name of the scope.
     * @throws \InvalidArgumentException
     */
    public function __construct(
        /** @var string The name of the scope. */
        private string $name,
    ) {
        $this->name = strtolower($name);
        $this->validate_name();
    }

    /**
     * Get the name of the scope.
     *
     * @return string
     */
    public function get_name(): string {
        return $this->name;
    }

    /**
     * Validate the scope name.
     *
     * @throws \InvalidArgumentException
     */
    private function validate_name(): void {
        if (!preg_match('/^[a-z][a-z0-9_]*$/', $this->name)) {
            throw new \InvalidArgumentException(
                'Scope name must start with a letter and contain only lowercase letters, numbers, and underscores.'
            );
        }
    }
}
