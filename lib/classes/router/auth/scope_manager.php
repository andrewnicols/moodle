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

namespace core\router\auth;

/**
 * User Scope Manager for AAA.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class scope_manager {
    /**
     * Get the list of scopes that the current user has access to.
     *
     * @return array
     */
    public function get_user_scopes(): array {
        // TODO: Implement this method.
        // Heavy Caching required.
        return [];
    }

    /**
     * Confirm whether the current user has access to the specified scope.
     *
     * @param string $scope
     * @return bool
     */
    public function user_has_scope(string $scope): bool {
        return array_search(
            $scope,
            $this->get_user_scopes(),
            true,
        ) !== false);
    }

    /**
     * Confirm whether the current user has access to all of the specified scopes.
     *
     * @param string[] $scopes
     * @return bool
     */
    public function user_has_all_scopes(array $scopes): bool {
        return array_intersect($scopes, $this->get_user_scopes()) === $scopes;
    }

    /**
     * Get a list of scopes in the specified list that the user does not have access to.
     *
     * @param string[] $scopes
     * @return array
     */
    public function get_missing_scopes_for_user(array $scopes): array {
        // TODO.
        return [];
    }
}
