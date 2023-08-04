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

use OpenApi\Analysers\AttributeAnnotationFactory;
use OpenApi\Analysers\DocBlockAnnotationFactory;
use OpenApi\Analysers\ReflectionAnalyser;
use OpenApi\Analysis;
use OpenApi\Context;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;
use Slim\Routing\RouteCollectorProxy;
use OpenApi\Attributes as OAT;

/**
 * Open API (Swagger) support.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class openapi {
    public function __construct(
        protected \Slim\App $app,
    ) {}

    /**
     * Get the OpenAPI Generator.
     *
     * @return OAT\OpenApi
     */
    protected function get_openapi_specification(): OAT\OpenApi {
        global $CFG;

        // Create an analyser. This is the main class that will analyse the code.
        $analyser = new ReflectionAnalyser([
            new DocBlockAnnotationFactory(),
            new AttributeAnnotationFactory(),
        ]);

        // Create the generator and configure it to use the analayser.
        $generator = (new \OpenApi\Generator())
            ->setAliases(\OpenApi\Generator::DEFAULT_ALIASES)
            ->setNamespaces(\OpenApi\Generator::DEFAULT_NAMESPACES)
            ->setAnalyser($analyser);

        // Create the analysis with a root context.
        $rootcontext = new Context([
            'version' => $generator->getVersion(),
            'logger' => $generator->getLogger(),
        ]);
        $analysis = new Analysis([], $rootcontext);

        // Analyse the dynamic information for the server specification.
        $analysis->addAnalysis($analyser->fromFqdn($this->get_server_spec(), $analysis));

        // Analyse the rest of Moodle.
        return $generator->generate(
            sources: array_merge(
                array_values($this->get_all_paths('api')),
                array_values($this->get_all_paths('openapi/schema')),
            ),
            analysis: $analysis,
            validate: $CFG->debugdeveloper,
        );
    }

    /**
     * Add the routes for the OpenAPI Documentation Generator.
     *
     * @param RouteCollectorProxy $group 
     */
    public function add_openapi_generator_routes(RouteCollectorProxy $group): void {
        $group->get('/openapi.{extension:yml|yaml}', function (RequestInterface $request, ResponseInterface $response): ResponseInterface {
            $openapi = $this->get_openapi_specification();

            // Return the OpenAPI specification.
            return $response
                ->withHeader('Content-Type', 'application/x-yaml')
                ->withBody(\GuzzleHttp\Psr7\Utils::streamFor($openapi->toYaml()));
        });
        $group->get('/openapi.json', function (RequestInterface $request, ResponseInterface $response): ResponseInterface {
            $openapi = $this->get_openapi_specification();

            // Return the OpenAPI specification.
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withBody(\GuzzleHttp\Psr7\Utils::streamFor($openapi->toJson(JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)));
        });
    }

    /**
     * Generate a class in a request-directory to hold the server specification for the current server.
     *
     * @return string The fully qualified class name of the dynamically generated content class
     */
    protected function get_server_spec() {
        global $CFG;

        $namespacedclass = "\Moodle\CurrentServerDetail";

        if (!class_exists($namespacedclass)) {
            $serverdescription = str_replace("'", "\'", format_string(get_site()->fullname));
            // Note: This template uses a class name that we don't use in Moodle.
            $template = <<<EOF
            <?php
            namespace Moodle;

            use OpenApi\Attributes as OAT;

            #[OAT\OpenApi(
                servers: [
                    new OAT\Server(
                        url: "{$CFG->wwwroot}/api/rest/v2",
                        description: '{$serverdescription}',
                    ),
                ],
                externalDocs: new OAT\ExternalDocumentation(
                    description: 'Find out more about developing for Moodle',
                    url: 'https://moodledev.io',
                ),
            )]
            #[OAT\Info(
                version: 'Moodle {$CFG->release}',
                description: '',
                title: 'Moodle LMS',
                license: new OAT\License(
                    name: 'GNU GPL v3 or later',
                    url: 'https://www.gnu.org/licenses/gpl-3.0.en.html'
                ),
            )]
            class CurrentServerDetail {}
            EOF;

            $targetdir = make_request_directory();

            file_put_contents("{$targetdir}/CurrentServerDetail.php", $template);
            require_once("{$targetdir}/CurrentServerDetail.php");
        }

        return $namespacedclass;
    }

    /**
     * Fetch all paths to API components.
     *
     * @return array
     */
    public function get_all_paths(
        string $subpath = 'api',
    ): array {
        global $CFG;

        $componentlist = \core_component::get_component_list();
        $componentpaths = [];
        $componentlist['core']['core'] = $CFG->libdir;
        foreach ($componentlist as $componenttype) {
            $componentsintype = array_filter($componenttype, fn ($path) => $path !== null);
            $componentpaths = array_merge(
                $componentpaths,
                array_map(fn ($path) => "{$path}/classes/{$subpath}", $componentsintype),
            );
        }

        return $componentpaths;
    }
}
