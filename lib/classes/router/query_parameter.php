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

namespace core\router;

use Psr\Http\Message\ServerRequestInterface;
use Slim\Routing\Route;

/**
 * Routing query parameter for validation.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class query_parameter extends parameter {
    public function __construct(
        ...$args,
    ) {
        $args['in'] = 'query';
        parent::__construct(...$args);
    }

    public function validate(
        ServerRequestInterface $request,
        Route $route,
    ): void {
        $params = $request->getQueryParams();

        if (array_key_exists($this->name, $params)) {
            // This parameter was specified.

            if ($this->get_type() === PARAM_BOOL) {
                switch ($params[$this->name]) {
                    case 'true':
                        $params[$this->name] = 1;
                        break;
                    case 'false':
                        $params[$this->name] = 0;
                        break;
                    default:
                        throw new \ValueError('Invalid boolean value.');
                }
            }
            validate_param(
                param: $params[$this->name],
                type: $this->type,
            );
        }
    }

    public function get_schema_from_type(): \stdClass {
        // if ($this->get_type() === PARAM_BOOL) {
        //     return (object) [
        //         'type' => 'integer',
        //         'enum' => [0, 1],
        //     ];
        // }
        return parent::get_schema_from_type();
    }
}
