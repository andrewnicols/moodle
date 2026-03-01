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
 * Tests for the ESM import map class.
 *
 * @package    core
 * @category   test
 * @copyright  2026 Meirza <meirza.arson@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(import_map::class)]
final class import_map_test extends \advanced_testcase {
    /**
     * The constructor pre-populates the standard ESM specifiers.
     */
    public function test_constructor_adds_standard_imports(): void {
        $map = new import_map();
        $map->set_default_loader(new \core\url('https://example.com/'));

        $data = $map->jsonSerialize();

        $this->assertArrayHasKey('@moodle/lms/', $data['imports']);
        $this->assertArrayHasKey('@moodlehq/design-system', $data['imports']);
        $this->assertArrayHasKey('react', $data['imports']);
        $this->assertArrayHasKey('react-dom', $data['imports']);
        $this->assertArrayHasKey('react/jsx-runtime', $data['imports']);
        $this->assertArrayHasKey('react/jsx-dev-runtime', $data['imports']);
    }

    /**
     * jsonSerialize() throws a coding_exception when no default loader has been set.
     */
    public function test_jsonserialize_throws_without_loader(): void {
        $this->expectException(\core\exception\coding_exception::class);
        (new import_map())->jsonSerialize();
    }

    /**
     * jsonSerialize() returns an array with an 'imports' key.
     */
    public function test_jsonserialize_returns_imports_structure(): void {
        $map = new import_map();
        $map->set_default_loader(new \core\url('https://example.com/'));

        $data = $map->jsonSerialize();

        $this->assertIsArray($data);
        $this->assertArrayHasKey('imports', $data);
        $this->assertIsArray($data['imports']);
    }

    /**
     * set_default_loader() is used as the base URL when no explicit loader or path is given.
     */
    public function test_set_default_loader_is_used_as_base_url(): void {
        $map = new import_map();
        $map->set_default_loader(new \core\url('https://example.com/esm/12345/'));
        $map->add_import('my-module');

        $data = $map->jsonSerialize();

        $this->assertEquals('https://example.com/esm/12345/my-module', $data['imports']['my-module']);
    }

    /**
     * add_import() with an explicit \core\url uses that URL verbatim, ignoring the default loader.
     */
    public function test_add_import_with_explicit_url(): void {
        $map = new import_map();
        $map->set_default_loader(new \core\url('https://example.com/'));
        $map->add_import('my-module', loader: new \core\url('https://cdn.example.com/my-module.js'));

        $data = $map->jsonSerialize();

        $this->assertEquals('https://cdn.example.com/my-module.js', $data['imports']['my-module']);
    }

    /**
     * add_import() with a $path string appends that path to the default loader URL.
     */
    public function test_add_import_with_path_appends_to_loader(): void {
        $map = new import_map();
        $map->set_default_loader(new \core\url('https://example.com/esm/12345/'));
        $map->add_import('react', path: 'external/react');

        $data = $map->jsonSerialize();

        $this->assertEquals('https://example.com/esm/12345/external/react', $data['imports']['react']);
    }

    /**
     * add_import() with no $path and no explicit $loader appends the specifier to the loader URL.
     */
    public function test_add_import_without_path_uses_specifier(): void {
        $map = new import_map();
        $map->set_default_loader(new \core\url('https://example.com/esm/12345/'));
        $map->add_import('some/specifier');

        $data = $map->jsonSerialize();

        $this->assertEquals('https://example.com/esm/12345/some/specifier', $data['imports']['some/specifier']);
    }

    /**
     * add_import() with an empty string $path produces the loader base URL with nothing appended.
     *
     * This is used for @moodle/lms/ to map the prefix to the bare base URL.
     */
    public function test_add_import_with_empty_path_uses_loader_base(): void {
        $map = new import_map();
        $map->set_default_loader(new \core\url('https://example.com/esm/12345/'));
        $map->add_import('@moodle/lms/', path: '');

        $data = $map->jsonSerialize();

        $this->assertEquals('https://example.com/esm/12345/', $data['imports']['@moodle/lms/']);
    }
}
