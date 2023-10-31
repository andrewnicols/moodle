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

/**
 * A standard Moodle response for all supported payload types.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class payload_response_type {
    protected array $args;

    public function __construct(
        ...$args,
    ) {
        $this->args = $args;
    }

    /**
     * Get the supported content types.
     *
     * @return media_type[]
     */
    protected function get_supported_content_types(): array {
        return [
            json_media_type::class,
            xml_media_type::class,
        ];
    }

    public function get_openapi_description(
        specification $api,
    ): \stdClass {
        $content = (object) [];

        foreach ($this->get_supported_content_types() as $contenttypeclass) {
            $contenttype = new $contenttypeclass(...$this->args);
            $content->{$contenttype->get_mimetype()} = $contenttype->get_openapi_description(
                $api,
            );
        }

        return $content;
    }
}
