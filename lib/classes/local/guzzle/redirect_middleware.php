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

/**
 * Check that each URL is valid in a redirect.
 *
 * @package   core
 * @copyright 2022 Andrew Lyons <andrew@nicols.co.uk>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace core\local\guzzle;

use core\files\curl_security_helper_base;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\RedirectMiddleware;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;
use GuzzleHttp\Promise\PromiseInterface;

class redirect_middleware extends RedirectMiddleware {
    /** @var curl_security_helper_base The helper to iuse */
    protected $securityhelper;

    protected $settings;

    public static function setup(array $settings): callable {
        return static function (callable $handler) use ($settings): self {
            return new self($handler, $settings);
        };
    }

    /**
     * @param callable(RequestInterface, array): PromiseInterface $nextHandler Next handler to invoke.
     */
    public function __construct(callable $next, array $settings) {
        parent::__construct($next);
        $this->settings = $settings;
    }

    protected function set_security(curl_security_helper_base $securityhelper): void {
        $this->securityhelper = $securityhelper;
    }

    public function __invoke(RequestInterface $request, array $options): PromiseInterface {
        $settings = $this->settings;
        // Curl security setup. Allow injection of a security helper, but if not found, default to the core helper.
        if (isset($settings['securityhelper']) && $settings['securityhelper'] instanceof \core\files\curl_security_helper_base) {
            $this->set_security($settings['securityhelper']);
        } else {
            $this->set_security(new \core\files\curl_security_helper());
        }

        return parent::__invoke($request, $options);
    }

    public function modifyRequest(RequestInterface $request, array $options, ResponseInterface $response): RequestInterface {
        $settings = $this->settings;

        $request = parent::modifyRequest($request, $options, $response);

        if (!empty($settings['ignoresecurity'])) {
            return $request;
        }

        if ($this->securityhelper->url_is_blocked((string) $request->getUri())) {
            throw new RequestException(
                $this->securityhelper->get_blocked_url_string(),
                $request,
                $response
            );
        }
        return $request;
    }
}
