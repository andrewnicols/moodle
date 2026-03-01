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

use core\router\route_loader;
use core\tests\router\route_testcase;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\ServerRequest;

/**
 * Tests for the ESM controller shim route.
 *
 * @package    core
 * @category   test
 * @copyright  2026 Meirza <meirza.arson@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(esm_controller::class)]
final class esm_controller_test extends route_testcase {
    /** @var string|null Temporary JS file created for tests that need a real file. */
    private ?string $tmpfile = null;

    protected function setUp(): void {
        parent::setUp();
        $this->resetAfterTest();
    }

    protected function tearDown(): void {
        if ($this->tmpfile !== null && file_exists($this->tmpfile)) {
            unlink($this->tmpfile);
            $this->tmpfile = null;
        }
        parent::tearDown();
    }

    /**
     * Create a temporary JS fixture file and register it for tearDown cleanup.
     *
     * @return string Absolute path to the created file.
     */
    private function make_temp_js_file(): string {
        $this->tmpfile = tempnam(sys_get_temp_dir(), 'esm_test_') . '.js';
        file_put_contents($this->tmpfile, 'export default {};');
        return $this->tmpfile;
    }

    /**
     * Create a controller whose resolve_module_identifier() returns a temporary fixture file.
     *
     * This avoids repeating the anonymous-subclass boilerplate in every cache/success test.
     *
     * @return esm_controller
     */
    private function make_test_controller(): esm_controller {
        $fixture = $this->make_temp_js_file();
        return new class ($fixture) extends esm_controller {
            // phpcs:ignore
            private string $fixture;
            // phpcs:ignore
            public function __construct(string $fixture) {
                $this->fixture = $fixture;
            }
            // phpcs:ignore
            protected function resolve_module_identifier(string $identifier): string {
                return $this->fixture;
            }
        };
    }

    /**
     * Assert that esm_controller::serve is the only core shim route with a variable first segment.
     *
     * Core shim routes registered for the 'core' component have an empty componentpath, so their
     * patterns carry no literal URL prefix. If two such routes both begin with a variable segment
     * (e.g. /{something}/...), FastRoute cannot distinguish between them and they will
     * ambiguously match the same URLs.
     *
     * This test acts as a guard: it will fail as soon as a second unprefixed variable-first
     * shim route is added, prompting the author to resolve the ambiguity before it reaches
     * production.
     */
    public function test_esm_controller_is_only_variable_first_segment_shim_route(): void {
        $loader = new class () extends route_loader {
            // phpcs:ignore
            public function get_shimmed(): array {
                return $this->get_all_shimmed_routes();
            }
        };

        $shimroutes = $loader->get_shimmed();

        // Find all shim routes whose pattern starts with a variable segment (no literal prefix).
        $variablefirst = array_values(array_filter(
            $shimroutes,
            fn(array $route) => (bool) preg_match('@^/\{@', $route['pattern']),
        ));

        $patterns = array_column($variablefirst, 'pattern');

        $this->assertCount(
            1,
            $variablefirst,
            'Only esm_controller::serve should have a variable first path segment among core shim '
            . 'routes. A second unprefixed variable route will cause URL ambiguity. '
            . 'Found: ' . implode(', ', $patterns),
        );

        $this->assertEquals(
            [esm_controller::class, 'serve'],
            $variablefirst[0]['callable'],
            'The only variable-first core shim route must be esm_controller::serve.',
        );
    }

    /**
     * Data provider for serve() not-found cases.
     *
     * @return array
     */
    public static function serve_not_found_provider(): array {
        return [
            'unknown external specifier'            => ['external/no-such-lib'],
            'upstream bundle with missing file'     => ['external/react'],
            'unknown component'                     => ['notacomponent/module'],
            'known component, missing module file'  => ['core/nonexistentmodule'],
        ];
    }

    /**
     * serve() throws not_found_exception for paths that cannot be resolved to a file.
     *
     * @param string $scriptpath
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('serve_not_found_provider')]
    public function test_serve_not_found(string $scriptpath): void {
        $this->expectException(\core\exception\not_found_exception::class);
        (new esm_controller())->serve(
            new ServerRequest('GET', "/12345/{$scriptpath}"),
            new Response(),
            12345,
            $scriptpath,
        );
    }

    /**
     * A valid component module returns 200 with an application/javascript Content-Type.
     */
    public function test_serve_component_module_returns_javascript(): void {
        $response = $this->make_test_controller()->serve(
            new ServerRequest('GET', '/-1/mod_test/index'),
            new Response(),
            -1,
            'mod_test/index',
        );

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertStringContainsString('application/javascript', $response->getHeaderLine('Content-Type'));
    }

    /**
     * An invalid revision (−1) results in a short-lived cache response with no ETag.
     */
    public function test_serve_invalid_revision_uses_short_cache(): void {
        $response = $this->make_test_controller()->serve(
            new ServerRequest('GET', '/-1/mod_test/index'),
            new Response(),
            -1,
            'mod_test/index',
        );

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertFalse($response->hasHeader('ETag'), 'Short-cache responses must not include an ETag.');
        $this->assertFalse($response->hasHeader('Cache-Control'), 'Short-cache responses must not include Cache-Control.');
    }

    /**
     * A valid revision results in a long-lived immutable cache response with an ETag.
     */
    public function test_serve_valid_revision_sets_long_cache(): void {
        $clock = $this->mock_clock_with_frozen();
        $revision = $clock->time();

        $response = $this->make_test_controller()->serve(
            new ServerRequest('GET', "/{$revision}/mod_test/index"),
            new Response(),
            $revision,
            'mod_test/index',
        );

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertTrue($response->hasHeader('ETag'), 'Long-cache responses must include an ETag.');
        $this->assertStringContainsString('immutable', $response->getHeaderLine('Cache-Control'));
    }

    /**
     * When the request carries an If-None-Match header that matches the ETag, serve() returns 304.
     */
    public function test_serve_matching_etag_returns_304(): void {
        $controller = $this->make_test_controller();
        $clock = $this->mock_clock_with_frozen();
        $revision = $clock->time();
        $etag = sha1($revision . ':' . $this->tmpfile);

        $request = (new ServerRequest('GET', "/{$revision}/mod_test/index"))
            ->withHeader('If-None-Match', $etag);

        $response = $controller->serve($request, new Response(), $revision, 'mod_test/index');

        $this->assertEquals(304, $response->getStatusCode());
    }
}
