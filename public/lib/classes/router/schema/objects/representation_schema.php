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

use core\model\representation;
use core\router\schema\referenced_object;
use core\router\schema\specification;

/**
 * Generate a reusable router schema from the same metadata as serialization.
 *
 * @package    core
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class representation_schema extends schema_object implements referenced_object {
    /** @var string[] Required response keys, independently of nullable values. */
    protected array $requiredkeys = [];

    /**
     * Describe an exposed class without instantiating it.
     *
     * @param class-string $class Representation class.
     * @param mixed ...$extra Additional router metadata.
     */
    public function __construct(
        /** @var class-string Representation class, also distinguishing component references. */
        protected readonly string $class,
        mixed ...$extra,
    ) {
        $content = [];
        foreach (representation::definitions($class) as $name => $definition) {
            $exposure = $definition['expose'];
            $content[$name] = new exposed_scalar($exposure, $definition['property']->isVirtual());
            if ($exposure->required) {
                $this->requiredkeys[] = $name;
            }
        }
        parent::__construct($content, ...$extra);
    }

    #[\Override]
    public function get_openapi_description(specification $api, ?string $path = null): ?\stdClass {
        $data = parent::get_openapi_description($api, $path);
        if ($this->requiredkeys) {
            $data->required = $this->requiredkeys;
        }
        return $data;
    }

    #[\Override]
    public function validate_data(mixed $data) {
        if (!is_array($data)) {
            throw new \invalid_parameter_exception('An exposed representation must be an array.');
        }
        foreach ($this->requiredkeys as $key) {
            if (!array_key_exists($key, $data)) {
                throw new \invalid_parameter_exception("Missing exposed key: {$key}.");
            }
        }
        return parent::validate_data($data);
    }
}
