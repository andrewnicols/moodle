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

namespace core\router\schema\objects;

use core\model\attribute\expose;
use core\router\schema\specification;

/**
 * Adapt exposed scalar metadata to the router's OpenAPI 3.1 schema.
 *
 * @package    core
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class exposed_scalar extends scalar_type {
    /**
     * Create a scalar schema with independent nullability and presence rules.
     *
     * @param expose $exposure Metadata.
     * @param bool $computed Whether the property is a virtual getter.
     */
    public function __construct(
        /** @var expose Metadata. */
        protected readonly expose $exposure,
        /** @var bool Whether the value is computed. */
        protected readonly bool $computed,
    ) {
        parent::__construct($exposure->type, required: !$exposure->nullable);
    }

    #[\Override]
    public function get_openapi_description(specification $api, ?string $path = null): ?\stdClass {
        $data = parent::get_openapi_description($api, $path);
        if ($this->exposure->nullable) {
            $data->type = [(string) $data->type, 'null'];
        }
        if ($this->exposure->readonly || $this->computed) {
            $data->readOnly = true;
        }
        if ($this->exposure->description !== null) {
            $data->description = $this->exposure->description;
        }
        if ($this->exposure->choices !== null) {
            $data->enum = $this->exposure->choices;
        }
        return $data;
    }

    #[\Override]
    public function validate_data(mixed $data) {
        $value = parent::validate_data($data);
        if ($this->exposure->choices !== null && !in_array($value, $this->exposure->choices, true)) {
            throw new \invalid_parameter_exception('Invalid exposed choice.');
        }
        return $value;
    }
}
