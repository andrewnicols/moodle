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

use core\param;
use core\router\schema\objects\array_of_things;
use core\router\schema\objects\scalar_type;
use core\router\schema\objects\schema_object;
use core\router\schema\referenced_object;
use core\router\schema\response\content\payload_response_type;

/**
 * A standard response for user preferences.
 *
 * @package    core_user
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class invalid_parameter_response extends \core\router\schema\response\response implements
    referenced_object
{
    /** @var int The standard status code */
    public const STATUSCODE = 400;

    public function __construct() {
        parent::__construct(
            statuscode: self::STATUSCODE,
            description: 'The parameter provided was invalid in some way.',
            content: new payload_response_type(
                schema: new schema_object(
                    content: [
                        'stacktrace' => new schema_object(
                            required: false,
                            content: [
                                new schema_object(content: [
                                    'file' => new scalar_type(param::PATH),
                                    'line' => new scalar_type(param::INT),
                                    'function' => new scalar_type(param::RAW),
                                    'args' => new array_of_things(),
                                    'class' => new scalar_type(param::RAW),
                                    'type' => new scalar_type(param::RAW),
                                ]),
                            ],
                        ),
                    ],
                ),
                examples: [
                    new \core\router\schema\example(
                        name: 'A parameter was not of the right type',
                        value: [
                            "stacktrace" => [
                                [
                                    "file" => "/Users/nicols/Sites/moodles/ws2/moodle/lib/classes/router/schema/objects/array_of_strings.php",
                                    "line" => 48,
                                    "function" => "validate_param",
                                    "args" => [
                                        "string",
                                        "int",
                                        false,
                                        "The value 'string' was not of type string.",
                                    ],
                                ],
                                [
                                    "file" => "/Users/nicols/Sites/moodles/ws2/moodle/lib/classes/router/schema/objects/schema_object.php",
                                    "line" => 85,
                                    "function" => "validate_data",
                                    "class" => "core\\router\\schema\\objects\\array_of_strings",
                                    "type" => "->",
                                    "args" => [
                                        [
                                            "additionalProp1" => "string",
                                            "additionalProp2" => "string",
                                            "additionalProp3" => "string",
                                        ],
                                    ],
                                ],
                                [
                                    "file" => "/Users/nicols/Sites/moodles/ws2/moodle/lib/classes/router/route.php",
                                    "line" => 264,
                                    "function" => "validate_data",
                                    "class" => "core\\router\\schema\\objects\\schema_object",
                                    "type" => "->",
                                    "args" => [
                                        [
                                            "preferences" => [
                                                "additionalProp1" => "string",
                                                "additionalProp2" => "string",
                                                "additionalProp3" => "string",
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ),
                ]
            ),
        );
    }
}
