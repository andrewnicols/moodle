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

class http_client {
    public static function get_client(array $settings = []): Client {
        return new Client(self::get_options($settings));
    }

    protected static function get_options(array $settings): array {
        $options = [];

        $options['handler'] = self::get_handlers($settings);

        // Debugging.
        if (!empty($settings['debug'])) {
            // Request debugging @see {https://docs.guzzlephp.org/en/stable/request-options.html#debug}.
            $options['debug'] = true;
        }

        // Cookies.
        // TODO. The Current curl cookiejar is file-based.
        // Need to see if this is still relevant.

        // Proxy.
        $proxy = self::setup_proxy($settings);
        if (!empty($proxy)) {
            $options['proxy'] = $proxy;
        }

        // Cache.
        // TODO Look at whether to implement our own cache, or something like this:
        // https://github.com/Kevinrob/guzzle-cache-middleware


        return $options;
    }

    protected static function get_handlers(array $settings): HandlerStack
    {
        $stack = HandlerStack::create();

        // Replace the standard redirect handler with our custom Moodle one.
        // This handler checks the block list.
        $stack->after('allow_redirects', redirect_middleware::setup($settings), 'moodle_allow_redirect');
        $stack->remove('allow_redirects');

        // Ensure that the first piece of middleware also checks the block list.
        $stack->unshift(check_request::setup($settings), 'moodle_checkinitialrequest');

        return $stack;
    }

    protected static function setup_proxy(array $settings): array {
        global $CFG;
        if (empty($CFG->proxyhost)) {
            return [];
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

    protected static function get_proxy(array $settings): string {
        global $CFG;
        $proxyhost = $CFG->proxyhost;
        if (!empty($CFG->proxyport)) {
            $proxyhost = "{$CFG->proxyhost}:{$CFG->proxyport}";
        }

        $proxyauth = "";
        if (!empty($CFG->proxyuser) and !empty($CFG->proxypassword)) {
            $proxyauth = "{$CFG->proxyuser}{$CFG->proxypassword}";
        }

        $protocol = "http://";
        if (!empty($CFG->proxytype) && $CFG->proxytype == 'SOCKS5') {
            $protocol = "socks5://";
        }

        return "{$protocol}{$proxyauth}{$proxyhost}";
    }
}
