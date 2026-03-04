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

namespace core\route\controller;

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
    use \core\router\esm_script_serving;

    #[\core\router\route(
        title: 'Serve ESM Content',
        path: '/esm/{revision:[0-9-]+}/{scriptpath:.*}',
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

        $importmap = \core\di::get(\core\output\requirements\import_map::class);
        $fullpath = rtrim($importmap->get_path_for_script($scriptpath), '.js') . ".js";
        if ($fullpath !== null) {
            if (file_exists($fullpath)) {
                return $this->serve_script($request, $response, $revision, $fullpath, basename($fullpath));
            }
        }
        throw new \core\exception\not_found_exception('script', $scriptpath);
    }
}
