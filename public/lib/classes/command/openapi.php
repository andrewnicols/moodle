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
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Path;

/**
 * Command to generate the OpenAPI specification.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[AsCommand(
    name: 'core:openapi',
    description: 'Generate the OpenAPI specification',
)]

class openapi extends Command {
    /**
     * Constructor for OpenAPI docs.
     *
     * @param \core\openapi $openapi
     */
    public function __construct(
        /** @var \core\openapi The OpenAPI instance */
        private \core\openapi $openapi,
    ) {
        parent::__construct();
    }

    #[\Override]
    protected function configure(): void {
        $this
            ->setDescription('Generate the OpenAPI specification')
            ->addOption('output', 'o', InputOption::VALUE_REQUIRED, 'Output file for the OpenAPI specification');
    }

    #[\Override]
    protected function execute(
        InputInterface $input,
        OutputInterface $output,
    ): int {
        global $CFG;

        // Generate the OpenAPI specification.
        $spec = $this->openapi->get_openapi_specification();

        // Output the specification as JSON.
        $outputfile = $input->getOption('output');
        if ($outputfile) {
            $outputfile = Path::makeAbsolute($outputfile, $CFG->root);
            file_put_contents($outputfile, json_encode($spec, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
            $output->writeln("OpenAPI specification written to $outputfile");
        } else {
            $output->writeln(json_encode($spec, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        }


        return Command::SUCCESS;
    }
}
