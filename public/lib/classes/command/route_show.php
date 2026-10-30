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

namespace core\command;

use Slim\Routing\RoutingResults;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Show how the router resolves a URI.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[AsCommand(
    name: 'core:route:show',
    description: 'Show the route which matches a URI',
)]
class route_show extends Command {
    use route_source_location_trait;

    /**
     * Constructor.
     *
     * @param \core\router $router The router.
     */
    public function __construct(
        /** @var \core\router The router. */
        protected \core\router $router,
    ) {
        parent::__construct();
    }

    #[\Override]
    protected function configure(): void {
        $this
            ->addArgument(
                'uri',
                InputArgument::REQUIRED,
                'The URI to resolve, with or without the router base path',
            )
            ->addOption(
                'method',
                'm',
                InputOption::VALUE_REQUIRED,
                'The HTTP method to resolve the URI with',
                'GET',
            )
            ->setHelp(<<<'EOT'
                The <info>core:route:show</info> command displays the route which the router resolves for a URI.

                  <info>php bin/moodle core:route:show /course/42/manage</info>

                Resolve the URI for a different HTTP method:
                  <info>php bin/moodle core:route:show /user/users/42 --method=PATCH</info>
                EOT);
    }

    #[\Override]
    protected function execute(InputInterface $input, OutputInterface $output): int {
        $method = strtoupper($input->getOption('method'));

        $app = $this->router->get_app();
        $basepath = $app->getRouteCollector()->getBasePath();

        $uri = $input->getArgument('uri');
        if (!str_starts_with($uri, $basepath)) {
            $uri = $basepath . $uri;
        }

        $results = $app->getRouteResolver()->computeRoutingResults($uri, $method);

        if ($results->getRouteStatus() !== RoutingResults::FOUND) {
            $output->writeln(match ($results->getRouteStatus()) {
                RoutingResults::METHOD_NOT_ALLOWED => "<error>Method not allowed: {$method}</error>",
                default => '<error>Route not found</error>',
            });
            return Command::FAILURE;
        }

        $route = $app->getRouteCollector()->lookupRoute($results->getRouteIdentifier());
        $callable = $route->getCallable();

        $output->writeln(sprintf('<info>Route for %s (%s)</info>', $uri, $method));
        $output->writeln('');
        $output->writeln(sprintf('%-19s: %s', 'Pattern', $route->getPattern()));
        $output->writeln(sprintf('%-19s: %s', 'Route methods', implode(', ', $route->getMethods())));
        $output->writeln(sprintf('%-19s: %s', 'Route callable', is_array($callable) ? implode('::', $callable) : 'Closure'));
        $output->writeln(sprintf('%-19s: %s', 'Route source', $this->get_source_location($callable)));
        $output->writeln(sprintf('%-19s: %s', 'Route identifier', $results->getRouteIdentifier()));
        $output->writeln(sprintf('%-19s: %s', 'Route name', $route->getName()));
        $output->writeln(sprintf('%-19s:', 'Route arguments'));
        foreach ($results->getRouteArguments() as $key => $value) {
            $output->writeln(sprintf('%20s: "%s"', $key, $value));
        }

        return Command::SUCCESS;
    }
}
