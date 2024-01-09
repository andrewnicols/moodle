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
 * A facade for the core\facade\logger class
 *
 * @package core
 * @copyright http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @author Moodle Pty Ltd <moodlebot@moodle.com>
 * @see \core\logger
 * @method static \Psr\Log\LoggerInterface get_channel(string $channel) Get the logger for a specific channel.
 * @method static void log(mixed $level, string|\Stringable $message, array $context = array (
 * ), string $channel = 'moodle') Log a message to the specified channel.
 * @method static void emergency(\Stringable|string $message, array $context, string $channel)
 * @method static void alert(\Stringable|string $message, array $context, string $channel)
 * @method static void critical(\Stringable|string $message, array $context, string $channel)
 * @method static void error(\Stringable|string $message, array $context, string $channel)
 * @method static void warning(\Stringable|string $message, array $context, string $channel)
 * @method static void notice(\Stringable|string $message, array $context, string $channel)
 * @method static void info(\Stringable|string $message, array $context, string $channel)
 */
class logger extends \core\facade {
    public static function get_facade_accessor(): string {
        return \core\logger::class;
    }
}
