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

namespace core\router;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Trait for serving ES module script files with appropriate HTTP caching headers.
 *
 * Provides a reusable serve_script() method for controllers that serve JavaScript
 * files as ES modules, handling both cached (with ETag/Cache-Control) and
 * uncached (revision -1) responses.
 *
 * @package    core
 * @copyright  Meirza <meirza.arsom@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
trait esm_script_serving {
    /**
     * Write the file content into the response with appropriate cache headers.
     *
     * When $revision is -1 (invalid/development), short-lived cache headers are used.
     * Otherwise, immutable long-lived cache headers are set with an ETag, and a
     * 304 Not Modified response is returned if the client already has the file cached.
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param int $revision The JS revision number; -1 disables long-term caching.
     * @param string $file Absolute filesystem path to the JS file.
     * @param string $presentedfilename Filename to use in Content-Disposition.
     */
    protected function serve_script(
        ServerRequestInterface $request,
        ResponseInterface $response,
        int $revision,
        string $file,
        string $presentedfilename,
    ): ResponseInterface {
        $now = \core\di::get(\core\clock::class)->time();

        if ($revision === -1) {
            $response = $response
                ->withHeader('Content-Type', 'application/javascript; charset=utf-8')
                ->withHeader('Content-Disposition', "inline; filename=\"{$presentedfilename}\"")
                ->withHeader('Last-Modified', gmdate('D, d M Y H:i:s', $now) . ' GMT')
                ->withHeader('Expires', gmdate('D, d M Y H:i:s', $now + 2) . ' GMT')
                ->withHeader('Pragma', '')
                ->withHeader('Accept-Ranges', 'none');
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
                ->withHeader('Expires', gmdate('D, d M Y H:i:s', $now + 31536000) . ' GMT')
                ->withHeader('Pragma', '')
                ->withHeader('Cache-Control', 'public, max-age=31536000, immutable')
                ->withHeader('Accept-Ranges', 'none');
        }

        $response->getBody()->write(file_get_contents($file));
        return $response;
    }
}
