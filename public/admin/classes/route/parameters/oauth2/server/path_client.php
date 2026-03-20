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

namespace core_admin\route\parameters\oauth2\server;

use core\exception\not_found_exception;
use core\router\schema\example;
use Psr\Http\Message\ServerRequestInterface;

/**
 * A Moodle parameter referenced in the path.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class path_client extends \core\router\schema\parameters\path_parameter implements
    \core\router\schema\parameters\mapped_property_parameter,
    \core\router\schema\referenced_object
{
    /**
     * Create a new course parameter.
     *
     * @param string $name The name of the parameter to use for the course identifier
     * @param mixed ...$extra Additional arguments
     */
    public function __construct(
        string $name = 'client',
        ...$extra,
    ) {
        $extra['name'] = $name;
        $extra['type'] = \core\param::INT;
        $extra['description'] = <<<EOF
        The client identifier, which is the id of the OAuth2 Server client in the database.
        EOF;
        $extra['examples'] = [
            new example(
                name: 'A client id',
                value: 54,
            ),
        ];

        parent::__construct(...$extra);
    }

    /**
     * Get the client object for the given identifier.
     *
     * @param string $value A client identifier value from the route parameter.
     * @return \stdClass The client object from the database.
     * @throws not_found_exception If the client cannot be found
     */
    protected function get_client_for_value(string $value): \stdClass {
        $repository = \core\di::get(\core\oauth2\server\client_manager::class);

        $data = $repository->get_client_by_id($value);

        if ($data) {
            return $data;
        }

        throw new not_found_exception('client', $value);
    }

    /**
     * Add client parameter to the request.
     *
     * @param ServerRequestInterface $request
     * @param string $value
     * @return ServerRequestInterface
     */
    public function add_attributes_for_parameter_value(
        ServerRequestInterface $request,
        string $value,
    ): ServerRequestInterface {
        $client = $this->get_client_for_value($value);

        return $request
            ->withAttribute("{$this->name}object", $client);
    }
}
