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

namespace core\hook;

use core\attribute\label;

/**
 * A hook to support creation of custom log channel loggers.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[label('A hook to support creation of custom log channel loggers.')]
class log_channel_request_hook implements
    \Psr\EventDispatcher\StoppableEventInterface
{
    use stoppable_trait;

    /** @var null|\Psr\Log\LoggerInterface The logger instance for the channel */
    private ?\Psr\Log\LoggerInterface $logger = null;

    /**
     * Create the log channel request hook instance.
     *
     * @param string $channelname The name of the log channel to create
     */
    public function __construct(
        /** @var string The name of the log channel to create */
        public readonly string $channelname,
    ) {
    }

    /**
     * Set the logger for this channel.
     *
     * @param \Psr\Log\LoggerInterface $logger
     */
    public function set_logger(\Psr\Log\LoggerInterface $logger): void {
        $this->logger = $logger;

        $this->stop_propagation();
    }

    /**
     * Get the logger channel if one has been configured.
     *
     * @return \Psr\Log\LoggerInterface|null
     */
    public function get_logger(): ?\Psr\Log\LoggerInterface {
        return $this->logger;
    }
}
