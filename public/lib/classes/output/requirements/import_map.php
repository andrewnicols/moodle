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
 * The import map requirement class, which defines the import map for ES module loading.
 *
 * This class is responsible for defining the import map that will be used by the ES module loader to
 * resolve module specifiers to URLs.
 *
 * A default loader URL should be set for the import map, which will be used for any specifiers
 * that do not have a specific loader defined.
 *
 * The import map can be extended by adding additional imports with specific loaders, or overriding
 * the standard loaders, during a pre_render hook.
 *
 * The import map will be serialized to JSON and included in the page output as a script tag with type "importmap".
 *
 * The class should be fetched using the dependency injection container, and the default loader URL
 * should be set before the page is rendered.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class import_map implements \JsonSerializable {
    /** @var array<string> The list of imports */
    protected array $imports = [];

    /** @var \core\url The default loader URL to use */
    protected \core\url $loader;

    /**
     * Initialise the import_map requirement by setting the standard import list.
     */
    public function __construct() {
        $this->add_standard_imports();
    }

    /**
     * Prepare the content for json encoding.
     *
     * @return array[]|array{imports: array}
     */
    public function jsonSerialize(): array {
        $importmap = [
            'imports' => [],
        ];

        if (!isset($this->loader)) {
            throw new \core\exception\coding_exception('Default loader URL must be set before serializing the import map.');
        }

        foreach ($this->imports as $specifier => $loader) {
            if ($loader === null) {
                $loader = new \core\url($this->loader->out(false) . $specifier);
            } else if (is_string($loader)) {
                $loader = new \core\url($this->loader->out(false) . $loader);
            }
            $importmap['imports'][$specifier] = $loader->out(false);
        }

        return $importmap;
    }

    /**
     * Set the default loader URL.
     *
     * @param \core\url $loader The default loader URL.
     */
    public function set_default_loader(\core\url $loader): void {
        $this->loader = $loader;
    }

    /**
     * Add the standard entries to the importmap.
     * @return void
     */
    protected function add_standard_imports(): void {
        $this->add_import('@moodle/lms/', path: '');
        $this->add_import('@moodlehq/design-system', path: 'external/design-system');
        $this->add_import('react', path: 'external/react');
        $this->add_import('react-dom', path: 'external/react-dom');
        $this->add_import('react/jsx-runtime', path: 'external/react/jsx-runtime');
        $this->add_import('react/jsx-dev-runtime', path: 'external/react/jsx-dev-runtime');
    }

    /**
     * Add an key to the importmap.
     *
     * @param string $specifier The module specifier (the key in the importmap).
     * @param \core\url|null $loader The full URL to load the module from.
     * If null, the default loader URL will be used with the specifier (or $path) appended.
     * @param string|null $path Optional URL path suffix to append to the default loader URL,
     * when no explicit $loader is given. Defaults to $specifier when not set.
     */
    public function add_import(string $specifier, ?\core\url $loader = null, ?string $path = null): void {
        $this->imports[$specifier] = $loader ?? $path;
    }

    public function get_import_path_for_specifier(string $specifier): ?array {
        global $CFG;

        // Ensure that imports are sorted longest first.
        // This ensures that where keys share a similar starting prefix that a more-specific one will be used.
        uksort($this->importmap, fn ($a, $b) => strlen($b) <=> strlen($a));

        // Find the first matching map.
        foreach ($this->importmap as $importspecifier => $path) {
            if (str_starts_with($specifier, $importspecifier)) {
                return [
                    $importspecifier,
                    $CFG->root . DIRECTORY_SEPARATOR . $path,
                ];
            }
        }

        return null;
    }
}
