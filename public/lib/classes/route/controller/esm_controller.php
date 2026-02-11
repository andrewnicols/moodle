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
 * Class esm_controller
 *
 * @package    core
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class esm_controller {
    use \core\router\route_controller;

    #[\core\router\route(
        title: 'Serve ESM Content',
        path: '/js/{revision}/{scriptpath:.*}',
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
     * Serve content as ES modules.
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     */
    public function serve_esm(
        ServerRequestInterface $request,
        ResponseInterface $response,
        int $revision,
        string $scriptpath,
    ): ResponseInterface {
        // TODO:
        if (!min_is_revision_valid_and_current($revision)) {
            $revision = -1;
        }

        $args = [
            'request' => $request,
            'response' => $response,
            'revision' => $revision,
            'scriptpath' => $scriptpath,
        ];

        return match (true) {
            str_starts_with($scriptpath, '@moodle/lms/') => $this->serve_moodle_esm_script(...$args),
                str_starts_with($scriptpath, 'react/')
                || str_starts_with($scriptpath, 'react-dom/')
                || str_starts_with($scriptpath, '@moodlehq/design-system') => $this->serve_upstream_bundle(...$args),

            default => throw new \core\exception\not_found_exception('script', $scriptpath),
        };
    }

    protected function serve_moodle_esm_script(
        ServerRequestInterface $request,
        ResponseInterface $response,
        int $revision,
        string $scriptpath,
    ): ResponseInterface {
        $alias = substr($scriptpath, strlen('@moodle/lms/'));
        $file = $this->resolve_module_identifier($alias);
        if ($file === null) {
            throw new \core\exception\not_found_exception('script', $scriptpath);
        }

        return $this->serve_script($request, $response, $revision, $file, $scriptpath);
    }

    protected function serve_upstream_bundle(
        ServerRequestInterface $request,
        ResponseInterface $response,
        int $revision,
        string $scriptpath,
    ): ResponseInterface {
        global $CFG;

        $map = [
            'react/' => '/lib/js/platform_bundles/react/',
            'react-dom/' => '/lib/js/platform_bundles/react-dom/',
            '@moodlehq/design-system/' => '/lib/js/platform_bundles/moodle-design-system/',
        ];

        foreach ($map as $prefix => $basepath) {
            if (str_starts_with($scriptpath, $prefix)) {
                $relativepath = substr($scriptpath, strlen($prefix));
                $file = $CFG->root . $basepath . $relativepath . '.js';
                if (!file_exists($file)) {
                    throw new \core\exception\not_found_exception('script', $scriptpath);
                }
                return $this->serve_script($request, $response, $revision, $file, $scriptpath);
            }
        }

        throw new \core\exception\not_found_exception('script', $scriptpath);
    }

    protected function serve_script(
        ServerRequestInterface $request,
        ResponseInterface $response,
        int $revision,
        string $file,
        string $presentedfilename,
    ): ResponseInterface {
        // Add the file content.

        if ($revision === -1) {
            $response = $response
                ->withHeader('Content-Disposition', "inline; filename='{$presentedfilename}'"  )
                ->withHeader('Last-Modified', gmdate('D, d M Y H:i:s', time()) . ' GMT')
                ->withHeader('Expires', gmdate('D, d M Y H:i:s', time() + 2) . ' GMT')
                ->withHeader('Pragma', '')
                ->withHeader('Accept-Ranges', 'none')
                ->withHeader('Content-Type', 'application/javascript; charset=utf-8')
            // TODO... Is this detected automatically?
            // ->withHeader('Content-Length', strlen($js))
            ;
        } else {
            $etag = sha1($revision . ':' . $file);

            if ($request->hasHeader('If-None-Match') && in_array($etag, $request->getHeader('If-None-Match'))) {
                return $response->withStatus(304);
            }

            $response = $response
                ->withHeader('Content-Type', 'application/javascript; charset=utf-8')
                ->withHeader('ETag', $etag)
                ->withHeader('Content-Disposition', 'inline; filename="' . basename($file) . '"')
                ->withHeader('Last-Modified', gmdate('D, d M Y H:i:s', filemtime($file)) . ' GMT')
                ->withHeader('Expires', gmdate('D, d M Y H:i:s', time() + 31536000) . ' GMT')
                ->withHeader('Pragma', '')
                ->withHeader('Cache-Control', 'public, max-age=31536000, immutable')
                ->withHeader('Accept-Ranges', 'none');
        }

        $response->getBody()->write(file_get_contents($file));
        return $response;

    }

    protected function resolve_module_identifier(string $identifier): ?string {
        global $CFG;

        $modulepath = explode('/', $identifier);

        $component = array_shift($modulepath);
        if ($component === null || $component === '' || empty($modulepath)) {
            throw new \core\exception\not_found_exception('component', $component);
        }

        if (!class_exists('\\core\\component')) {
            require_once($CFG->dirroot . '/lib/classes/component.php');
        }

        $dir = \core\component::get_component_directory($component);
        if ($dir === null) {
            throw new \core\exception\not_found_exception('component', $component);
        }

        $file = $dir . '/react/build/' . implode('/', $modulepath) . '.js';
        if (!file_exists($file)) {
            throw new \core\exception\not_found_exception('script', $identifier);
        }

        return $file;
    }
}
