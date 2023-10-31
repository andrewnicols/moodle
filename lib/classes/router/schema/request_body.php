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

namespace core\router\schema;

use core\router\schema\openapi_base;
use core\router\schema\specification;
use core\router\schema\response\content\media_type;
use core\router\schema\response\content\payload_response_type;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Routing query parameter for validation.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class request_body extends openapi_base {
    /**
     * Query parameter constructor to override the location of the parameter.
     *
     * @param array $args
     */
    public function __construct(
        protected string $description = '',
        protected array|payload_response_type $content = [],
        protected bool $required = false,
        ...$args,
    ) {
        if (!empty($content)) {
            $this->required = true;
        }
        parent::__construct(...$args);
    }

    /**
     * Get the OpenAPI description for this class.
     *
     * @param specification $api
     * @return stdClass
     */
    public function get_openapi_description(
        specification $api,
        ?string $path = null,
    ): ?\stdClass {
        $data = (object) [
            'description' => $this->description,
            'required' => $this->required,
            'content' => [],
        ];

        if ($this->content instanceof response\content\payload_response_type) {
            $data->content = $this->content->get_openapi_schema(
                api: $api,
            );
            return $data;
        }

        foreach ($this->content as $content) {
            $data->content[$content::get_encoding()] = $content->get_openapi_schema(
                api: $api,
            );
        }

        return $data;
    }

    public function get_body_for_request(
        ServerRequestInterface $request,
    ): media_type {
        if ($this->content instanceof payload_response_type) {
            $content = $this->content->get_media_type_instance(
                mimetype: $request->getHeaderLine('Content-Type'),
            );

            if ($content) {
                return $content;
            }
        } else {
            foreach ($this->content as $content) {
                if ($content::get_encoding() === $request->getHeaderLine('Content-Type')) {
                    return $content;
                }
            }
        }

        throw new \Exception('No matching content type found.');
    }

}
