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
 * Guzzle Integration for Moodle.
 *
 * @package   core
 * @copyright 2022 Andrew Lyons <andrew@nicols.co.uk>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace core;

use core\local\guzzle\check_request;
use core\local\guzzle\redirect_middleware;
use GuzzleHttp\Client;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\RequestOptions;

// General TODO:
// - Update moodle_url to implement the Psr7\UriInterface
// - Testing
// - Caching
// - Cookies
// - See if it's possible to have the existing curl class just call these functions.

class http_client extends Client {
    public function __construct(array $config = []) {
        $config = $this->get_options($config);

        parent::__construct($config);
    }

    protected function get_options(array $settings): array {
        if (empty($settings['handler'])) {
            // Configure the default handlers.
            $settings['handler'] = $this->get_handlers($settings);
        }

        // Request debugging @see {https://docs.guzzlephp.org/en/stable/request-options.html#debug}.
        if (!empty($settings[RequestOptions::DEBUG])) {
            // Accepts either a bool, or an fopen resource.
            if (!is_resource($settings[RequestOptions::DEBUG])) {
                $settings[RequestOptions::DEBUG] = !empty($settings['debug']);
            }
        }

        // Cookies.
        // TODO. The Current curl cookiejar is file-based.
        // Need to see if this is still relevant.

        // Proxy.
        $proxy = $this->setup_proxy($settings);
        if (!empty($proxy)) {
            $settings[RequestOptions::PROXY] = $proxy;
        }

        // Cache.
        // TODO Look at whether to implement our own cache, or something like this:
        // @see {https://github.com/Kevinrob/guzzle-cache-middleware}.

        return $settings;
    }

    protected function get_handlers(array $settings): HandlerStack {
        $stack = HandlerStack::create();

            // Ensure that the first piece of middleware checks the block list.
            $stack->unshift(check_request::setup($settings), 'moodle_check_initial_request');

        // Replace the standard redirect handler with our custom Moodle one.
        // This handler checks the block list.
        // It extends the standard 'allow_redirects' handler so supports the same options.
        $stack->after('allow_redirects', redirect_middleware::setup($settings), 'moodle_allow_redirect');
        $stack->remove('allow_redirects');

        return $stack;
    }

    /**
     * Get the proxy configuration.
     *
     * @see {https://docs.guzzlephp.org/en/stable/request-options.html#proxy}
     * @param array $settings The incoming settings
     * @return array The proxy settings
     */
    protected function setup_proxy(array $settings): ?array {
        global $CFG;

        if (empty($CFG->proxyhost)) {
            return null;
        }

        $proxy = $this->get_proxy($settings);
        $noproxy = [];

        if (!empty($CFG->proxybypass)) {
            $noproxy = array_map(function(string $hostname): string {
                return trim($hostname);
            }, explode(',', $CFG->proxybypass));
        }

        return [
            'http' => $proxy,
            'https' => $proxy,
            'no' => $noproxy,
        ];
    }

    /**
     * Get the proxy server identified.
     *
     * @param array $settings The incoming settings
     * @return string The URI for the Proxy Server
     */
    protected function get_proxy(array $settings): string {
        global $CFG;
        $proxyhost = $CFG->proxyhost;
        if (!empty($CFG->proxyport)) {
            $proxyhost = "{$CFG->proxyhost}:{$CFG->proxyport}";
        }

        $proxyauth = "";
        if (!empty($CFG->proxyuser) && !empty($CFG->proxypassword)) {
            $proxyauth = "{$CFG->proxyuser}{$CFG->proxypassword}";
        }

        $protocol = "http://";
        if (!empty($CFG->proxytype) && $CFG->proxytype == 'SOCKS5') {
            $protocol = "socks5://";
        }

        return "{$protocol}{$proxyauth}{$proxyhost}";
    }
}
