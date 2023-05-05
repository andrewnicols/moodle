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

namespace core\content;

use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\Utils;
use Psr\Http\Message\StreamInterface;

class redirect_response extends Response {
    private ?StreamInterface $stream = null;

    // TODO Add a body with content into it.
    public function __construct(
        protected \moodle_url $url,
        protected int $delay = 0,
        protected ?string $message = null,
        protected ?string $messagetype = null,
    ) {
        parent::__construct(
            status: 303,
        );

        $this->url = new \moodle_url($url);
    }

    public function getBody(): StreamInterface {
        if (!$this->stream) {
            $this->stream = $this->get_response_stream();
        }

        return $this->stream;
    }

    protected function get_callable_stream(callable $callable): StreamInterface {
        return Utils::streamFor(function ($size) use ($callable) {
            static $complete = false;

            if ($complete) {
                return false;
            }
            $complete = true;
            return call_user_func($callable);
        });
    }

    public function get_response_stream(): StreamInterface {
        global $PAGE;

        if ($PAGE) {
            return $this->get_callable_stream(function (): string {
                global $CFG, $OUTPUT;

                $CFG->docroot = false; // To prevent the link to moodle docs from being displayed on redirect page.
                return $OUTPUT->redirect_message(
                    $this->url,
                    $this->message,
                    $this->delay,
                    false,
                    $this->messagetype,
                );
            });
        } else {
            return $this->get_callable_stream(function (): string {
                return \bootstrap_renderer::early_redirect_message(
                    $this->url,
                    $this->message,
                    $this->delay,
                );
            });
        }
    }

}
