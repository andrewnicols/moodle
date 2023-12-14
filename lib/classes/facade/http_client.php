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

namespace core\facade;

/**
 * A facade for the core\facade\http_client class
 *
 * @package core
 * @copyright http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @author Moodle Pty Ltd <moodlebot@moodle.com>
 * @see \core\http_client
 * @method static void __construct(array $config)
 * @method static void __call(string $method, array $args)
 * @method static \GuzzleHttp\Promise\PromiseInterface sendAsync(array $options = array (
 * )) Asynchronously send an HTTP request.
 * @method static \Psr\Http\Message\ResponseInterface send(array $options = array (
 * )) Send an HTTP request.
 * @method static \Psr\Http\Message\ResponseInterface sendRequest() The HttpClient PSR (PSR-18) specify this method.
 * @method static \GuzzleHttp\Promise\PromiseInterface requestAsync(string $method, string|\Psr\Http\Message\UriInterface $uri = '',
 * array $options = array (
 * )) Create and send an asynchronous HTTP request.
 * @method static \Psr\Http\Message\ResponseInterface request(string $method, string|\Psr\Http\Message\UriInterface $uri = '', array
 * $options = array (
 * )) Create and send an HTTP request.
 * @method static void getConfig(string|null $option = null) Get a client configuration option.
 * @method static \Psr\Http\Message\ResponseInterface get(string|\Psr\Http\Message\UriInterface $uri, array $options = array (
 * )) Create and send an HTTP GET request.
 * @method static \Psr\Http\Message\ResponseInterface head(string|\Psr\Http\Message\UriInterface $uri, array $options = array (
 * )) Create and send an HTTP HEAD request.
 * @method static \Psr\Http\Message\ResponseInterface put(string|\Psr\Http\Message\UriInterface $uri, array $options = array (
 * )) Create and send an HTTP PUT request.
 * @method static \Psr\Http\Message\ResponseInterface post(string|\Psr\Http\Message\UriInterface $uri, array $options = array (
 * )) Create and send an HTTP POST request.
 * @method static \Psr\Http\Message\ResponseInterface patch(string|\Psr\Http\Message\UriInterface $uri, array $options = array (
 * )) Create and send an HTTP PATCH request.
 * @method static \Psr\Http\Message\ResponseInterface delete(string|\Psr\Http\Message\UriInterface $uri, array $options = array (
 * )) Create and send an HTTP DELETE request.
 * @method static \GuzzleHttp\Promise\PromiseInterface getAsync(string|\Psr\Http\Message\UriInterface $uri, array $options = array (
 * )) Create and send an asynchronous HTTP GET request.
 * @method static \GuzzleHttp\Promise\PromiseInterface headAsync(string|\Psr\Http\Message\UriInterface $uri, array $options = array (
 * )) Create and send an asynchronous HTTP HEAD request.
 * @method static \GuzzleHttp\Promise\PromiseInterface putAsync(string|\Psr\Http\Message\UriInterface $uri, array $options = array (
 * )) Create and send an asynchronous HTTP PUT request.
 * @method static \GuzzleHttp\Promise\PromiseInterface postAsync(string|\Psr\Http\Message\UriInterface $uri, array $options = array (
 * )) Create and send an asynchronous HTTP POST request.
 * @method static \GuzzleHttp\Promise\PromiseInterface patchAsync(string|\Psr\Http\Message\UriInterface $uri, array $options = array (
 * )) Create and send an asynchronous HTTP PATCH request.
 * @method static \GuzzleHttp\Promise\PromiseInterface deleteAsync(string|\Psr\Http\Message\UriInterface $uri, array $options = array
 * (
 * )) Create and send an asynchronous HTTP DELETE request.
 * @method static void __construct(array $config = array (
 * )) Clients accept an array of constructor parameters.
 * @method static void __call(string $method, array $args)
 * @method static \GuzzleHttp\Promise\PromiseInterface sendAsync(array $options = array (
 * )) Asynchronously send an HTTP request.
 * @method static \Psr\Http\Message\ResponseInterface send(array $options = array (
 * )) Send an HTTP request.
 * @method static \Psr\Http\Message\ResponseInterface sendRequest() The HttpClient PSR (PSR-18) specify this method.
 * @method static \GuzzleHttp\Promise\PromiseInterface requestAsync(string $method, string|\Psr\Http\Message\UriInterface $uri = '',
 * array $options = array (
 * )) Create and send an asynchronous HTTP request.
 * @method static \Psr\Http\Message\ResponseInterface request(string $method, string|\Psr\Http\Message\UriInterface $uri = '', array
 * $options = array (
 * )) Create and send an HTTP request.
 * @method static void getConfig(string|null $option = null) Get a client configuration option.
 * @method static \Psr\Http\Message\ResponseInterface get(string|\Psr\Http\Message\UriInterface $uri, array $options = array (
 * )) Create and send an HTTP GET request.
 * @method static \Psr\Http\Message\ResponseInterface head(string|\Psr\Http\Message\UriInterface $uri, array $options = array (
 * )) Create and send an HTTP HEAD request.
 * @method static \Psr\Http\Message\ResponseInterface put(string|\Psr\Http\Message\UriInterface $uri, array $options = array (
 * )) Create and send an HTTP PUT request.
 * @method static \Psr\Http\Message\ResponseInterface post(string|\Psr\Http\Message\UriInterface $uri, array $options = array (
 * )) Create and send an HTTP POST request.
 * @method static \Psr\Http\Message\ResponseInterface patch(string|\Psr\Http\Message\UriInterface $uri, array $options = array (
 * )) Create and send an HTTP PATCH request.
 * @method static \Psr\Http\Message\ResponseInterface delete(string|\Psr\Http\Message\UriInterface $uri, array $options = array (
 * )) Create and send an HTTP DELETE request.
 * @method static \GuzzleHttp\Promise\PromiseInterface getAsync(string|\Psr\Http\Message\UriInterface $uri, array $options = array (
 * )) Create and send an asynchronous HTTP GET request.
 * @method static \GuzzleHttp\Promise\PromiseInterface headAsync(string|\Psr\Http\Message\UriInterface $uri, array $options = array (
 * )) Create and send an asynchronous HTTP HEAD request.
 * @method static \GuzzleHttp\Promise\PromiseInterface putAsync(string|\Psr\Http\Message\UriInterface $uri, array $options = array (
 * )) Create and send an asynchronous HTTP PUT request.
 * @method static \GuzzleHttp\Promise\PromiseInterface postAsync(string|\Psr\Http\Message\UriInterface $uri, array $options = array (
 * )) Create and send an asynchronous HTTP POST request.
 * @method static \GuzzleHttp\Promise\PromiseInterface patchAsync(string|\Psr\Http\Message\UriInterface $uri, array $options = array (
 * )) Create and send an asynchronous HTTP PATCH request.
 * @method static \GuzzleHttp\Promise\PromiseInterface deleteAsync(string|\Psr\Http\Message\UriInterface $uri, array $options = array
 * (
 * )) Create and send an asynchronous HTTP DELETE request.
 */
class http_client extends \core\facade {
    public static function get_facade_accessor(): string {
        return \core\http_client::class;
    }
}
