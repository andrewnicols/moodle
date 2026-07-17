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
 * @copyright  2026 Mihail Geshoski <mihailgesoski@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\Attribute(\Attribute::TARGET_CLASS)]
class name_attribute {
    /**
     * Constructor.
     *
     * @param string $name The name of the scope.
     * @throws \coding_exception If the scope name is empty or invalid.
     */
    public function __construct(
        /** @var string The name of the scope. */
        private string $name,
    ) {
        $name = trim($this->name);

        if ($name === '') {
            throw new \coding_exception('OAuth2 scope name cannot be empty.');
        }

        // Validate the scope name.
        if (!preg_match('/^[a-z][a-z0-9_]*$/', $name)) {
            throw new \coding_exception(
                "Invalid OAuth2 scope name '{$name}'. Scope names must start with a letter and consist of " .
                "lowercase letters, numbers, and underscores."
            );
        }

        $this->name = $name;
    }

    /**
     * Get the name of the scope.
     *
     * @return string
     */
    public function get_name(): string {
        return $this->name;
    }
}
