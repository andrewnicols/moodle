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

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\Table;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * List, and optionally search, the routes registered with the router.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[AsCommand(
    name: 'core:route:list',
    description: 'List the registered routes',
)]
class route_list extends Command {
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
                'search',
                InputArgument::OPTIONAL,
                'Only list routes whose pattern, methods, or callable contain this text (case-insensitive)',
            )
            ->setHelp(<<<'EOT'
                The <info>core:route:list</info> command lists all of the routes registered with the router.

                  <info>php bin/moodle core:route:list</info>

                Provide a search term to only show routes whose pattern, methods, or callable contain it:
                  <info>php bin/moodle core:route:list course</info>
                EOT);
    }

    #[\Override]
    protected function execute(InputInterface $input, OutputInterface $output): int {
        $search = trim((string) $input->getArgument('search'));
        $showfile = $output->isVerbose();

        $collector = $this->router->get_app()->getRouteCollector();
        $basepath = $collector->getBasePath();

        $rows = [];
        foreach ($collector->getRoutes() as $route) {
            $callable = $route->getCallable();
            $row = [
                $basepath . $route->getPattern(),
                implode(', ', $route->getMethods()),
                is_array($callable) ? implode('::', $callable) : 'Closure',
            ];

            if ($search !== '' && stripos(implode("\n", $row), $search) === false) {
                continue;
            }

            if ($showfile) {
                $row[] = $this->get_source_location($callable);
            }

            $rows[] = $row;
        }

        if (empty($rows)) {
            $output->writeln('<comment>No routes match the given criteria.</comment>');
            return Command::SUCCESS;
        }

        $table = new Table($output);
        $table->setHeaders($showfile ? ['Pattern', 'Methods', 'Callable', 'Source'] : ['Pattern', 'Methods', 'Callable']);
        $table->setRows($rows);
        $table->render();

        $output->writeln(sprintf('<info>%d route(s) listed.</info>', count($rows)));

        return Command::SUCCESS;
    }
}
