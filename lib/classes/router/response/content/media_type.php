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

namespace core\router\response\content;

use core\openapi\specification;
use Psr\Http\Message\ResponseInterface;

/**
 * An OpenAPI MediaType.
 * https://swagger.io/specification/#media-type-object
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class media_type {
    public function __construct(
        protected string $encoding,
        protected $schema = null,
        protected ?string $example = null,
        protected array $examples = [],

        ...$extra,
    ) {
        assert(
            $example === null || count($examples) === 0,
            'Only one of example or examples can be specified.',
        );
    }

    public function get_openapi_description(
        specification $api,
        string $component,
        array $parentcontexts = [],
    ): \stdClass {
        $data = (object) [];

        if ($this->schema) {
            $data->schema = $this->schema->get_openapi_description(
                $api,
                $component,
                [$this, $parentcontexts],
            );
        }

        if ($this->example) {
            $data->example = $this->example;
        } else if (count($this->examples)) {
            $data->examples = array_map(
                fn(\core\router\response\example $example) => $example->get_openapi_description(
                    $api,
                    $component,
                    [$this, $parentcontexts],
                ),
                $this->examples,
            );
        }

        return $data;
    }

    public function get_mimetype(): string {
        return $this->encoding;
    }
}
