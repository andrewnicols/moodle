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

namespace core\router\schema\parameters;

use core\param;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Routing\Route;

/**
 * An OpenAPI Parameter which supports validation.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class validatable_parameter extends \core\router\schema\parameter {
    /**
     * Validate query parameters.
     *
     * @param ServerRequestInterface $request
     * @param Route $route
     */
    public function validate(
        ServerRequestInterface $request,
        array $params,
    ): ServerRequestInterface {
        if (array_key_exists($this->name, $params)) {
            // This parameter was specified. Validate it.
            if ($this->get_type() === param::BOOL) {
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
            $this->type->validate_param($params[$this->name]);

            return $this->update_request_params(
                $request,
                array_merge(
                    $params,
                    [$this->name => $params[$this->name]],
                ),
            );
        }

        if ($this->required) {
            throw new \coding_exception(
                "A required parameter {$this->name} was not provided and must be specified",
            );
        }

        if ($this->default !== null) {
            // This parameter is optional. Fill the default.
            return $this->update_request_params(
                $request,
                array_merge(
                    $params,
                    [$this->name => $this->default],
                ),
            );
        }

        // This parameter is optional and there is no default.
        // Fill a null value.
        return $this->update_request_params(
            $request,
            array_merge(
                $params,
                [$this->name => null],
            ),
        );
    }

    /**
     * Update the request parameters.
     *
     * @param ServerRequestInterface $request
     * @param array $params
     * @return ServerRequestInterface
     */
    abstract protected function update_request_params(
        ServerRequestInterface $request,
        array $params,
    ): ServerRequestInterface;
}
