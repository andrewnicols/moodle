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

namespace core_user\local;

use core\exception\insufficient_scope_exception;
use core\router\scope\abstract_scope;
use core\router\scope\scopeset;
use Psr\Http\Message\ServerRequestInterface;
use stdClass;

/**
 * Scope checks shared by the user resource handlers.
 *
 * @package    core_user
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
trait user_scope_check_trait {
    /**
     * Ensure that a token which is only able to read the current user is not used to read somebody else.
     *
     * @param ServerRequestInterface $request
     * @param stdClass $user The user being read
     * @throws insufficient_scope_exception
     */
    protected function require_read_scope_for(ServerRequestInterface $request, stdClass $user): void {
        $this->require_scope_for_user(
            $request,
            $user,
            anyscope: new \core_user\route\scope\user\read(),
            ownscope: new \core_user\route\scope\user\read_self(),
        );
    }

    /**
     * Ensure that a token which is only able to update the current user is not used to update somebody else.
     *
     * @param ServerRequestInterface $request
     * @param stdClass $user The user being updated
     * @throws insufficient_scope_exception
     */
    protected function require_update_scope_for(ServerRequestInterface $request, stdClass $user): void {
        $this->require_scope_for_user(
            $request,
            $user,
            anyscope: new \core_user\route\scope\user\update(),
            ownscope: new \core_user\route\scope\user\update_self(),
        );
    }

    /**
     * Whether the token may only read the current user, for routes which list users.
     *
     * @param ServerRequestInterface $request
     * @return bool True if the results must be limited to the current user
     * @throws insufficient_scope_exception If the token has neither the read nor the read:self scope
     */
    protected function is_read_limited_to_current_user(ServerRequestInterface $request): bool {
        return $this->is_limited_to_own_user(
            $request,
            anyscope: new \core_user\route\scope\user\read(),
            ownscope: new \core_user\route\scope\user\read_self(),
        );
    }

    /**
     * Check the granted scopes against the user being acted upon.
     *
     * The request is rejected if the token is limited to the current user, and the user is somebody else.
     *
     * @param ServerRequestInterface $request
     * @param stdClass $user The user being acted upon
     * @param abstract_scope $anyscope The scope which allows acting upon any user
     * @param abstract_scope $ownscope The scope which only allows acting upon the current user
     * @throws insufficient_scope_exception
     */
    private function require_scope_for_user(
        ServerRequestInterface $request,
        stdClass $user,
        abstract_scope $anyscope,
        abstract_scope $ownscope,
    ): void {
        global $USER;

        if ($this->is_limited_to_own_user($request, $anyscope, $ownscope) && (int) $user->id !== (int) $USER->id) {
            throw new insufficient_scope_exception(
                "The {$anyscope::get_identifier()} scope is required to access other users.",
                [new scopeset($anyscope)],
            );
        }
    }

    /**
     * Determine whether the granted scopes limit the request to the current user.
     *
     * - A request which is not authenticated with a scoped token (for example a browser session) is not limited.
     * - If the token satisfies the scope for any user, it is not limited.
     * - If the token only satisfies the scope for the current user, it is limited to the current user.
     * - Otherwise the request is rejected.
     *
     * The scope for any user is checked first because scopes are hierarchical: a scope which grants access to any
     * user also satisfies the scope for the current user, so only a token which does not satisfy the former can
     * be limited to the current user.
     *
     * @param ServerRequestInterface $request
     * @param abstract_scope $anyscope The scope which allows acting upon any user
     * @param abstract_scope $ownscope The scope which only allows acting upon the current user
     * @return bool
     * @throws insufficient_scope_exception
     */
    private function is_limited_to_own_user(
        ServerRequestInterface $request,
        abstract_scope $anyscope,
        abstract_scope $ownscope,
    ): bool {
        $grantedscopes = $request->getAttribute(scopeset::GRANTED_SCOPES);
        if ($grantedscopes === null || $anyscope->is_satisfied_by($grantedscopes)) {
            return false;
        }

        if ($ownscope->is_satisfied_by($grantedscopes)) {
            return true;
        }

        throw new insufficient_scope_exception(
            "The {$anyscope::get_identifier()} scope is required to access users.",
            [new scopeset($anyscope)],
        );
    }
}
