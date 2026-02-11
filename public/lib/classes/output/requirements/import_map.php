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

namespace core\output\requirements;

/**
 * Class import_map
 *
 * @package    core
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class import_map implements
    \JsonSerializable
{
    /** @var array<string> The list of imports */
    protected array $imports = [];

    protected \core\url $loader;

    public function __construct() {
        $this->add_standard_imports();
    }

    public function jsonSerialize(): array {
        $importmap = [
            'imports' => [],
        ];

        foreach ($this->imports as $specifier) {
            $importmap['imports'][$specifier] = (new \core\url($this->loader . "{$specifier}"))->out(false);
        }


        return $importmap;
    }

    public function set_loader(\core\url $loader): void {
        $this->loader = $loader;
    }

    protected function add_standard_imports(): void {
        $this->add_import('@moodle/lms/');
        $this->add_import('react');
        $this->add_import('react-dom/client');
        $this->add_import('react/jsx-runtime');
        $this->add_import('react/jsx-dev-runtime');
        $this->add_import('/stable/react@19.1.1/es2022/react.mjs');
        $this->add_import('@moodlehq/design-system');
    }

    public function add_import(string $specifier): void {
        $this->imports[] = $specifier;
    }
}
