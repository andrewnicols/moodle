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

namespace core\route\shim;

use core\router\schema\parameters\path_parameter;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Controller for serving ES module files.
 *
 * Handles all ES module requests under a single route /{revision:[0-9-]+}/{scriptpath:.*},
 * dispatching internally based on path prefix:
 * - external/{specifier}      → vendored upstream bundles (React, design system)
 * - {component}/{module}      → Moodle component React builds (everything else)
 *
 * The revision parameter uses a [0-9-]+ constraint to avoid shadowing static routes.
 *
 * @package    core
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class esm_controller {
    use \core\router\route_controller;
    use \core\router\esm_script_serving;

    /**
     * Map of ESM specifier → root-relative file path for vendored upstream bundles.
     *
     * Paths are relative to $CFG->root (one level above the web root).
     * These are fixed, versioned files. Add a new entry here when a new upstream bundle is vendored.
     */
    protected const UPSTREAM_BUNDLE_MAP = [
        'react'                  => '/lib/platform_bundles/react/latest/react.js',
        'react-dom'              => '/lib/platform_bundles/react/latest/react-dom-client.js',
        'react/jsx-runtime'      => '/lib/platform_bundles/react/latest/jsx-runtime.js',
        'react/jsx-dev-runtime'  => '/lib/platform_bundles/react/latest/jsx-dev-runtime.js',
        'design-system'          => '/lib/platform_bundles/moodle-design-system/0.1.0/index.js',
    ];

    #[\core\router\route(
        title: 'Serve ESM Content',
        path: '/{revision:[0-9-]+}/{scriptpath:.*}',
        pathtypes: [
            new path_parameter(
                name: 'revision',
                description: 'The revision number of the script to serve.',
                type: \core\param::INT,
            ),
            new path_parameter(
                name: 'scriptpath',
                description: 'The path to the script to serve.',
                type: \core\param::ESM_PATH,
            ),
        ],
        method: ['GET'],
        abortafterconfig: true,
    )]
    /**
     * Serve an ES module file, dispatching by path prefix.
     *
     * Paths beginning with `external/` are resolved as vendored upstream bundles.
     * All other paths are resolved as Moodle component React builds.
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param int $revision
     * @param string $scriptpath
     */
    public function serve(
        ServerRequestInterface $request,
        ResponseInterface $response,
        int $revision,
        string $scriptpath,
    ): ResponseInterface {
        // Normalise the revision: an outdated or invalid value disables long-term caching
        // so browsers always re-fetch rather than serving a stale file.
        if (!min_is_revision_valid_and_current($revision)) {
            $revision = -1;
        }

        // Paths beginning with 'external/' are vendored upstream bundles (e.g. React).
        // Strip the prefix to obtain the bare specifier, then look it up in the static map.
        if (str_starts_with($scriptpath, 'external/')) {
            $specifier = substr($scriptpath, 9);
            if (isset(self::UPSTREAM_BUNDLE_MAP[$specifier])) {
                global $CFG;
                // Resolve the absolute path: bundles live outside the web root under $CFG->root.
                $file = $CFG->root . self::UPSTREAM_BUNDLE_MAP[$specifier];
                if (!file_exists($file)) {
                    throw new \core\exception\not_found_exception('script', $scriptpath);
                }
                return $this->serve_script($request, $response, $revision, $file, basename($file));
            }
        }

        // Any other path is treated as a Moodle component React build (<component>/<module>).
        // resolve_module_identifier() maps it to the compiled JS file on disk.
        $file = $this->resolve_module_identifier($scriptpath);
        return $this->serve_script($request, $response, $revision, $file, $scriptpath);
    }

    /**
     * Resolve a `<component>/<module>` alias to an absolute filesystem path.
     *
     * For example, `mod_book/viewer` resolves to
     * `<dirroot>/mod/book/react/build/viewer.js`.
     *
     * @param string $identifier Alias in the form `<component>/<module>`.
     * @return string Absolute path to the JS file.
     * @throws \core\exception\not_found_exception If the component or file cannot be found.
     */
    protected function resolve_module_identifier(string $identifier): string {
        global $CFG;

        $modulepath = explode('/', $identifier);
        $component = array_shift($modulepath);

        if ($component === null || $component === '' || empty($modulepath)) {
            throw new \core\exception\not_found_exception('component', $component ?? '');
        }

        if (!class_exists('\\core\\component')) {
            require_once($CFG->dirroot . '/lib/classes/component.php');
        }

        $dir = \core\component::get_component_directory($component);
        if ($dir === null) {
            throw new \core\exception\not_found_exception('component', $component);
        }

        $file = $dir . '/js/react/build/' . implode('/', $modulepath) . '.js';
        if (!file_exists($file)) {
            throw new \core\exception\not_found_exception('script', $identifier);
        }

        return $file;
    }
}
