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
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Clear the route cache.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[AsCommand(
    name: 'core:route:cache:clear',
    description: 'Clear the route cache',
)]
class route_cache_clear extends Command {
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
    protected function execute(InputInterface $input, OutputInterface $output): int {
        global $CFG;

        @unlink(sprintf(
            '%s/routes.%s.cache',
            $CFG->cachedir,
            sha1($this->router->basepath),
        ));
        \core_cache\cache::make('core', 'routes')->purge();

        // Also purge 'other' caches to clear the cachedir. This is used for component cache, where we store the
        // autoloader cache.
        purge_other_caches();

        $output->writeln('<info>Route cache cleared.</info>');

        return Command::SUCCESS;
    }
}
