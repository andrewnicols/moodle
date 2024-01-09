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

use Monolog\Handler\ErrorLogHandler;
use Monolog\Level;
use Monolog\Logger as MonologLogger;
use Monolog\LogRecord;
use Psr\Log\LoggerInterface;
use Stringable;

/**
 * PSR-3 Logger wrapper.
 *
 * @package    core
 * @copyright  2024 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class logger {
    /** @var \Psr\Log\LoggerInterface[] A collection of Loggers indexed by channel name */
    protected array $channels = [];

    protected function create_logger_for_channel(string $channel): \Monolog\Logger {
        $logger = new MonologLogger($channel);
        $logger->pushHandler(new ErrorLogHandler(
            level: $this->get_channel_loglevel($channel),
        ));
        $logger->pushProcessor(fn ($record) => $this->moodle_data_processor($record));

        return $logger;
    }

    protected function get_channel_loglevel(string $channel) {
        global $CFG;

        if ($channel === 'performance') {
            if (MDL_PERF || (!empty($CFG->perfdebug) && $CFG->perfdebug > 7)) {
                return Level::Info;
            }
        }

        return match ($channel) {
            // TODO: Load these from config.
            'debug' => Level::Debug,
            default => Level::Info,
        };
    }

    public static function get_log_level_from_debug_level(int $level): Level {
        return match ($level) {
            DEBUG_NONE => Level::Emergency,
            DEBUG_MINIMAL => Level::Error,
            DEBUG_NORMAL => Level::Info,
            DEBUG_ALL => Level::Debug,
            default => Level::Debug,
        };
    }

    /**
     * Get the logger for a specific channel.
     *
     * @param string $channel The channel to get the logger for
     * @return \Psr\Log\LoggerInterface
     */
    public function get_channel(string $channel): \Psr\Log\LoggerInterface {
        // By default, all channels have the same configuration.
        // To implement something custom, please extend this and set the $CFG->alternative_logger_class setting.
        if (!array_key_exists($channel, $this->channels)) {
            $this->channels[$channel] = $this->create_logger_for_channel($channel);
        }
        return $this->channels[$channel];
    }

    /**
     * Log a message to the specified channel.
     *
     * @param mixed $level
     * @param string|Stringable $message
     * @param array $context
     * @param string $channel
     */
    final public function log(
        mixed $level,
        string|Stringable $message,
        array $context = [],
        string $channel = 'moodle',
    ): void {
        $this->get_channel($channel)->log(
            level: $level,
            message: $message,
            context: $context,
        );
    }

    /**
     * Add additional Moodle Data to the logger via a Log Processor.
     *
     * @param mixed $record
     * @return array
     */
    protected function moodle_data_processor(LogRecord $record): LogRecord {
        global $CFG, $USER;

        if (!isset($record->extra['userid'])) {
            $record->extra['userid'] = isset($USER->id) ? $USER->id : null;
        }
        if (isset($_SERVER['REQUEST_URI'])) {
            $record->extra['uri'] = $_SERVER['REQUEST_URI'];
        }
        if (isset($_SERVER['SCRIPT_FILENAME'])) {
            $record->extra['script'] = $_SERVER['SCRIPT_FILENAME'];
        }
        if (isset($_SERVER['argv'])) {
            $record->extra['cliargs'] = $_SERVER['argv'];
        }

        if (defined('CLI_SCRIPT') && CLI_SCRIPT) {
            $record->extra['type'] = 'CLI';
        } else if (defined('AJAX_SCRIPT') && AJAX_SCRIPT) {
            $record->extra['type'] = 'AJAX';
        } else if (isset($_SERVER) && isset($_SERVER['SERVER_ADDR'])) {
            $record->extra['type'] = 'HTTP';
        } else {
            $record->extra['type'] = 'Unknown';
        }

        if (function_exists('getremoteaddr')) {
            // Add the IP address of the client.
            $record->extra['ipaddress'] = getremoteaddr();
        }

        $record->extra['wwwroot'] = $CFG->wwwroot;

        return $record;
    }

    final public function emergency(
        string|Stringable $message,
        array $context = [],
        string $channel = 'moodle',
    ): void {
        $this->log(\Psr\Log\LogLevel::EMERGENCY, $message, $context, $channel);
    }

    final public function alert(
        string|Stringable $message,
        array $context = [],
        string $channel = 'moodle',
    ): void {
        $this->log(\Psr\Log\LogLevel::ALERT, $message, $context, $channel);
    }

    final public function critical(
        string|Stringable $message,
        array $context = [],
        string $channel = 'moodle',
    ): void {
        $this->log(\Psr\Log\LogLevel::CRITICAL, $message, $context, $channel);
    }

    final public function error(
        string|Stringable $message,
        array $context = [],
        string $channel = 'moodle',
    ): void {
        $this->log(\Psr\Log\LogLevel::ERROR, $message, $context, $channel);
    }

    final public function warning(
        string|Stringable $message,
        array $context = [],
        string $channel = 'moodle',
    ): void {
        $this->log(\Psr\Log\LogLevel::WARNING, $message, $context, $channel);
    }

    final public function notice(
        string|Stringable $message,
        array $context = [],
        string $channel = 'moodle',
    ): void {
        $this->log(\Psr\Log\LogLevel::NOTICE, $message, $context, $channel);
    }

    final public function info(
        string|Stringable $message,
        array $context = [],
        string $channel = 'moodle',
    ): void {
        $this->log(\Psr\Log\LogLevel::INFO, $message, $context, $channel);
    }
}
