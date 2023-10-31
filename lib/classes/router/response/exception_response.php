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

namespace core\router\response;

use core\router\schema\objects\schema_object;
use core\router\schema\objects\stacktrace;
use core\router\schema\referenced_object;
use core\router\schema\response\content\payload_response_type;
use core\router\schema\response\payload_response;
use Exception;
use GuzzleHttp\Psr7\Response;
use Psr\Http\Message\ServerRequestInterface;

/**
 * A standard response for user preferences.
 *
 * @package    core_user
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class exception_response extends \core\router\schema\response\response implements
    referenced_object
{
    /**
     * Constructor for a new exception-related response.
     */
    public function __construct() {
        parent::__construct(
            statuscode: static::get_status_code(),
            description: static::get_response_description(),
            content: new payload_response_type(
                schema: new schema_object(
                    content: [
                        'stacktrace' => new stacktrace(),
                    ],
                ),
            ),
        );
    }

    public static function get_response(
        ServerRequestInterface $request,
        \moodle_exception $exception,
        ...$extra,
    ): payload_response {
        return new payload_response(
            payload: static::get_payload_data($exception, ...$extra),
            request: $request,
            response: new Response(
                status: static::get_status_code(),
                body: $exception->getMessage(),
                reason: $exception->getMessage(),
            ),
        );
    }

    /**
     * The status code that this exception should return.
     *
     * @return int
     */
    abstract protected static function get_status_code(): int;

    /**
     * Get the description of this response.
     *
     * @return string
     */
    abstract protected static function get_response_description(): string;

    /**
     * Get the response payload data.
     *
     * @param Exception $exception
     * @param mixed $extra
     * @return array
     */
    protected static function get_payload_data(
        \Exception $exception,
        ...$extra,
    ): array {
        return [
            'stacktrace' => $exception->getTrace(),
        ];
    }
}
