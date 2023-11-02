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

namespace core\router\schema\response;

use core\router\schema\openapi_base;
use core\router\schema\specification;
use core\router\schema\response\content\payload_response_type;
use Psr\Http\Message\ResponseInterface;

/**
 * An OpenAPI Response.
 *
 * https://spec.openapis.org/oas/v3.1.0#response-object
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class response extends openapi_base {
    public function __construct(
        protected int $statuscode = 200,

        protected string $description = '',
        protected array $headers = [],
        protected array|payload_response_type $content = [],

        ...$extra,
    ) {
        parent::__construct(...$extra);
    }

    public function validate(
        ResponseInterface $response,
    ): void {
        $response;
    }

    protected function get_description(): string {
        if ($this->description !== '') {
            return $this->description;
        }

        switch ($this->statuscode) {
            case 200:
                return 'OK';
            default:
                return '';
        }
    }

    public function get_openapi_description(
        specification $api,
        ?string $path = null,
    ): ?\stdClass {
        $data = (object) [
            'description' => $this->get_description(),
        ];
        if (count($this->headers)) {
            foreach ($this->headers as $header) {
                $data->headers[$header->get_name()] = $header->get_openapi_schema(
                    api: $api,
                );
            }
        }

        if ($this->content instanceof content\payload_response_type) {
            $data->content = $this->content->get_openapi_description(
                api: $api,
                path: $path,
            );
        } else if (count($this->content)) {
            foreach ($this->content as $body) {
                $data->content[$body->get_mimetype()] = $body->get_openapi_description(
                    api: $api,
                    path: $path,
                );
            }
        }

        return $data;
    }

    public function get_statuscode(): int {
        return $this->statuscode;
    }

}
