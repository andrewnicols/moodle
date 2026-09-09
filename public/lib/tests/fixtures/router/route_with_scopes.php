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

namespace core\fixtures;

use core\router\scope\scopeset;
use core\router\scope\unscoped_resource;
use GuzzleHttp\Psr7\Response;

/**
 * Fixture for tests of scope-related utility helpers.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class route_with_scopes {
    /**
     * A method with no scope-related attributes at all.
     *
     * @return Response
     */
    public function method_with_no_scope_attributes(): Response {
        return new Response(200, [], 'test');
    }

    /**
     * A method explicitly declared as not requiring any scopes.
     *
     * @return Response
     */
    #[unscoped_resource]
    public function method_with_unscoped_resource(): Response {
        return new Response(200, [], 'test');
    }

    /**
     * A method which does not declare any scope definition at all.
     *
     * @return Response
     */
    public function method_with_no_scope_definition(): Response {
        return new Response(200, [], 'test');
    }

    /**
     * A method requiring a single scope set with one required scope.
     *
     * @return Response
     */
    #[scopeset(
        new \fake_oauth2scope\route\scope\resource\read(),
    )]
    public function method_with_single_scopeset(): Response {
        return new Response(200, [], 'test');
    }

    /**
     * A method requiring one of three acceptable scope sets (OR condition), one of which targets a scope
     * class which does not exist (simulating a scope only present in a different version of Moodle to the
     * one currently running).
     *
     * @return Response
     */
    #[scopeset(
        new \fake_oauth2scope\route\scope\resource\read(),
    )]
    #[scopeset(
        new \fake_oauth2scope\route\scope\resource\write(),
    )]
    #[scopeset(
        new \fake_oauth2scope\route\scope\resource\writeasdf(),
    )]
    public function method_with_multiple_scopesets(): Response {
        return new Response(200, [], 'test');
    }

    /**
     * A method referencing a scope class which does not exist.
     *
     * This simulates a scope which was defined by a plugin which is no longer installed.
     *
     * @return Response
     */
    #[scopeset(
        new \fake_oauth2scope\route\scope\resource\does_not_exist(),
    )]
    public function method_with_invalid_scope(): Response {
        return new Response(200, [], 'test');
    }
}
