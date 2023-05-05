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

namespace core;

use Psr\Http\Message\ResponseInterface;

class response_handler {
    protected int $chunksize = 4096;

    /**
     * Process the sending of a response.
     *
     * @param ResponseInterface $response The response to send.
     */
    public function send(ResponseInterface $response): void {
        // Send the headers.
        foreach ($response->getHeaders() as $name => $values) {
            foreach ($values as $value) {
                header(sprintf('%s: %s', $name, $value));
            }
        }

        // Send the status line.
        header(sprintf(
            "HTTP/%s %s %s",
            $response->getProtocolVersion(),
            $response->getStatusCode(),
            $response->getReasonPhrase(),
        ), true, $response->getStatusCode());

        if (!$this->is_response_empty($response)) {
            // Send the body content.
            $this->send_body($response);
        }

        exit();
    }

    public function send_body(ResponseInterface $response): void {
        $body = $response->getBody();
        if ($body->isSeekable()) {
            $body->rewind();
        }

        $size = (int) $response->getHeaderLine('Content-Length');
        if (!$size) {
            $size = $body->getSize();
        }

        if ($size) {
            while ($size > 0 && !$body->eof()) {
                $length = min($this->chunksize, $size);
                $data = $body->read($length);
                echo $data;

                $size -= strlen($data);

                if (connection_status() !== CONNECTION_NORMAL) {
                    break;
                }
            }
        } else {
            while (!$body->eof()) {
                echo $body->read($this->chunksize);
                if (connection_status() !== CONNECTION_NORMAL) {
                    break;
                }
            }
        }
    }

    public function is_response_empty(ResponseInterface $response): bool {
        // 204 = No Content.
        // 205 = Reset Content.
        // 304 = Not Modified.
        if (in_array($response->getStatusCode(), [204, 205, 304], true)) {
            return true;
        }

        // Determine if there is any stream content.
        $stream = $response->getBody();
        $seekable = $stream->isSeekable();
        if ($seekable) {
            // This stream is seekable.
            // Rewind it and check if there is any content.
            $stream->rewind();
            return $stream->read(1) === '';
        } else {
            // Check if this stream is at the end already.
            // If there is no content then start === end.
            return $stream->eof();
        }
    }

    public static function get_xsendfile_headers(string $filepath): ?array {
        global $CFG;

        if (empty($CFG->xsendfile)) {
            return null;
        }

        if (!file_exists($filepath)) {
            return null;
        }

        if (headers_sent()) {
            return null;
        }

        $filepath = realpath($filepath);

        $aliased = false;
        if (!empty($CFG->xsendfilealiases) && is_array($CFG->xsendfilealiases)) {
            foreach ($CFG->xsendfilealiases as $alias => $dir) {
                $dir = realpath($dir);
                if ($dir === false) {
                    continue;
                }
                if (substr($dir, -1) !== DIRECTORY_SEPARATOR) {
                    // Add trailing dir separator.
                    $dir .= DIRECTORY_SEPARATOR;
                }
                if (strpos($filepath, $dir) === 0) {
                    $filepath = $alias . substr($filepath, strlen($dir));
                    $aliased = true;
                    break;
                }
            }
        }

        if ($CFG->xsendfile === 'X-Accel-Redirect') {
            // See http://wiki.nginx.org/XSendfile
            // Nginx requires paths relative to aliases, you need to specify them in config.php.
            if (!$aliased) {
                return null;
            }
        }

        return [
            $CFG->xsendfile => $filepath,
        ];
    }
}
