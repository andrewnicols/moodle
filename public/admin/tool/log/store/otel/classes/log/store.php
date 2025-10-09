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

namespace logstore_otel\log;

/**
 * External database store.
 *
 * @package    logstore_otel
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class store implements \tool_log\log\writer {
    /**
     * Create a new instance of the OTel Logger.
     *
     * @param \tool_log\log\manager The log manager
     */
    public function __construct(
        /** @var \tool_log\log\manager The log manager */
        private readonly \tool_log\log\manager $manager,
    ) {
    }

    #[\Override]
    public function write(\core\event\base $event): void {
        \core\di::get(\core\logger::class)->info(
            $event->get_name(),
            context: [
                'description' => $event->get_description(),
                'data' => $event->get_data(),
                'contextid' => $event->get_context()->id,
            ],
            channel: 'logstore',
        );
    }

    public function dispose(): void {
    }
}
