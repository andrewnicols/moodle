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

namespace core\router\parameters;

use core\param;
use core\router\schema\{
    example,
    parameters\mapped_property_parameter,
    referenced_object,
};
use Psr\Http\Message\ServerRequestInterface;

/**
 * Routing parameter for validation.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class path_theme_with_language extends \core\router\schema\parameters\path_parameter implements
    mapped_property_parameter,
    referenced_object
{
    /**
     * Create a new path_themename parameter.
     *
     * @param string $name The name of the parameter to use for the theme name
     * @param mixed ...$args Additional arguments
     */
    public function __construct(
        string $name = 'themelang',
        ...$args,
    ) {
        $args['name'] = $name;

        $args['type'] = param::RAW;
        $args['description'] = 'The name of a Moodle theme.';
        $args['examples'] = [
            new example(
                name: 'The Boost theme with the language of the current user',
                value: 'boost',
            ),
            new example(
                name: 'The Boost theme in English',
                value: 'boost:en',
            ),
            new example(
                name: 'A custom theme name in German',
                value: 'mytheme:de',
            ),
        ];

        parent::__construct(...$args);
    }

    #[\Override]
    public function add_attributes_for_parameter_value(
        ServerRequestInterface $request,
        string $value,
    ): ServerRequestInterface {
        if (str_contains($value, ':')) {
            [$theme, $lang] = explode(':', $value, 2);
        } else {
            $theme = $value;
            $lang = null;
        }
        return $request
            ->withAttribute(
                "{$this->name}Theme",
                $theme,
            )
            ->withAttribute(
                "{$this->name}Lang",
                $lang,
            );
    }

    #[\Override]
    public function get_schema_from_type(param $type): \stdClass {
        $schema = parent::get_schema_from_type($type);

        $schema->pattern = "^(theme:lang)$";

        return $schema;
    }
}
