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

use Monolog\Level;
use Monolog\LogRecord;
use Stringable;

/**
 * PSR-3 Logger wrapper.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class logger {
    /** @var string The default channel name */
    public const CHANNEL_DEFAULT = 'moodle';

    /** @var string The debug channel name */
    public const CHANNEL_DEBUG = 'debug';

    /** @var \Monolog\Logger[] A collection of Loggers indexed by channel name */
    protected array $channels = [];

    /**
     * Get the log level that corresponds to a Moodle debug level.
     *
     * @param int $level The Moodle debug level
     * @return Level The corresponding PSR-3 log level
     */
    public static function get_log_level_from_moodle_debug_level(int $level): Level {
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
     * @return \Monolog\Logger
     */
    public function get_channel(string $channel): \Monolog\Logger {
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
    final public static function log(
        mixed $level,
        string|Stringable $message,
        array $context = [],
        string $channel = self::CHANNEL_DEFAULT,
    ): void {
        \core\di::get(self::class)
            ->get_channel($channel)->log(
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
    public static function moodle_data_processor(LogRecord $record): LogRecord {
        global $CFG, $USER;

        $record->extra['requestid'] = defined('PAGE_ID') ? PAGE_ID : 'unknown';

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

        // TODO: Add a unique identifier to each page to tie logging in together.
        // This should be used for all logging, tracing, and metrics within the same request.
        // It should be available within the UI for easier correlation.

        return $record;
    }

    /**
     * Log at Emergency level.
     *
     * @param string|Stringable $message
     * @param array $context
     * @param string $channel
     */
    final public static function emergency(
        string|Stringable $message,
        array $context = [],
        string $channel = self::CHANNEL_DEFAULT,
    ): void {
        self::log(\Psr\Log\LogLevel::EMERGENCY, $message, $context, $channel);
    }

    /**
     * Log at alert level.
     *
     * @param string|Stringable $message
     * @param array $context
     * @param string $channel
     */
    final public static function alert(
        string|Stringable $message,
        array $context = [],
        string $channel = self::CHANNEL_DEFAULT,
    ): void {
        self::log(\Psr\Log\LogLevel::ALERT, $message, $context, $channel);
    }

    /**
     * Log at critical level.
     *
     * @param string|Stringable $message
     * @param array $context
     * @param string $channel
     */
    final public static function critical(
        string|Stringable $message,
        array $context = [],
        string $channel = self::CHANNEL_DEFAULT,
    ): void {
        self::log(\Psr\Log\LogLevel::CRITICAL, $message, $context, $channel);
    }

    /**
     * Log at error level.
     *
     * @param string|Stringable $message
     * @param array $context
     * @param string $channel
     */
    final public static function error(
        string|Stringable $message,
        array $context = [],
        string $channel = self::CHANNEL_DEFAULT,
    ): void {
        self::log(\Psr\Log\LogLevel::ERROR, $message, $context, $channel);
    }

    /**
     * Log at warning level.
     *
     * @param string|Stringable $message
     * @param array $context
     * @param string $channel
     */
    final public static function warning(
        string|Stringable $message,
        array $context = [],
        string $channel = self::CHANNEL_DEFAULT,
    ): void {
        self::log(\Psr\Log\LogLevel::WARNING, $message, $context, $channel);
    }

    /**
     * Log at notice level.
     *
     * @param string|Stringable $message
     * @param array $context
     * @param string $channel
     */
    final public static function notice(
        string|Stringable $message,
        array $context = [],
        string $channel = self::CHANNEL_DEFAULT,
    ): void {
        self::log(\Psr\Log\LogLevel::NOTICE, $message, $context, $channel);
    }

    /**
     * Log at info level.
     *
     * @param string|Stringable $message
     * @param array $context
     * @param string $channel
     */
    final public static function info(
        string|Stringable $message,
        array $context = [],
        string $channel = self::CHANNEL_DEFAULT,
    ): void {
        self::log(\Psr\Log\LogLevel::INFO, $message, $context, $channel);
    }


    /**
     * Create a logger for a specific channel.
     *
     * It is possible to create log channels in multiple ways:
     * 1. The debug channel is always created with specific settings.
     * 2. A custom logger can be provided from config via a callable.
     * 3. A custom logger can be provided from a hook.
     * 4. If no custom logger is provided, a standard logger is created.
     *
     * It is not possible to override the debug channel from config, but handlers and processors can by calling
     *
     * \core\di::get(\core\logger::class)->get_channel(\core\logger::CHANNEL_DEBUG)
     *     ->pushHandler($customhandler);
     *
     * @param string $channel The channel name
     * @return \Monolog\Logger
     */
    protected function create_logger_for_channel(string $channel): \Monolog\Logger {
        $logger = match ($channel) {
            // Get the debug channel.
            self::CHANNEL_DEBUG => $this->get_debug_channel(),

            // Check for a custom logger from config.
            default => $this->create_channel_logger_from_config($channel),
        };

        // Check for a custom logger from a hook.
        $logger ??= $this->create_channel_logger_from_hook($channel);

        // Create a standard logger for the channel.
        $logger ??= $this->get_default_logger($channel);

        return $logger;
    }

    /**
     * Create a standard logger for a specific channel.
     *
     * @param string $channel
     * @return \Monolog\Logger
     */
    protected function get_default_logger(string $channel): \Monolog\Logger {
        $errorhandler = new \Monolog\Handler\ErrorLogHandler(
            level: $this->get_channel_loglevel($channel),
        );

        $errorhandler->setFormatter(new \Monolog\Formatter\LineFormatter(
            format: '[%datetime%] %extra.requestid% %channel%.%level_name%: %message% %context% %extra%',
            allowInlineLineBreaks: true,
            includeStacktraces: true,
        ));

        return new \Monolog\Logger(
            name: $channel,
            handlers: [$errorhandler],
            processors: [self::moodle_data_processor(...)],
        );
    }

    /**
     * Get a custom logger for a specific channel from config, if available.
     *
     * @param string $channel
     * @return \Monolog\Logger|null
     */
    protected function create_channel_logger_from_config(string $channel): ?\Monolog\Logger {
        global $CFG;

        $channel = null;
        if (property_exists($CFG, 'logger_channel_callable')) {
            $callable = $CFG->logger_channel_callable;
            if (is_callable($callable)) {
                $channel = $callable($channel);

                if ($channel instanceof \Monolog\Logger) {
                    return $channel;
                }
            }
        }

        return null;
    }

    /**
     * Get a custom logger for a specific channel from a hook, if available.
     *
     * @param string $channel
     * @return \Monolog\Logger|null
     */
    protected function create_channel_logger_from_hook(string $channel): ?\Monolog\Logger {
        $hook = new \core\hook\log_channel_request_hook($channel);
        \core\di::get(hook\manager::class)->dispatch($hook);

        return $hook->get_logger();
    }

    /**
     * Get the log level for a specific channel.
     *
     * @param string $channel
     * @return Level
     */
    protected function get_channel_loglevel(string $channel): Level {
        global $CFG;

        if (property_exists($CFG, 'logger_channel_loglevel_callable')) {
            $callable = $CFG->logger_channel_loglevel_callable;
            if (is_callable($callable)) {
                $level = $callable($channel);

                if ($level instanceof Level) {
                    return $level;
                }
            }
        }

        // Return defaults.
        return match ($channel) {
            self::CHANNEL_DEBUG => Level::Debug,
            default => Level::Info,
        };
    }

    /**
     * Get the channel for the debug channel.
     *
     * @return \Monolog\Logger
     */
    protected function get_debug_channel(): \Monolog\Logger {
        $errorhandler = new \Monolog\Handler\ErrorLogHandler(
            level: $this->get_channel_loglevel(self::CHANNEL_DEBUG),
        );
        $errorhandler->setFormatter(new \Monolog\Formatter\LineFormatter(
            format: '[%datetime%] %extra.requestid% %channel%.%level_name%: %message% %context% %extra%',
            allowInlineLineBreaks: true,
            includeStacktraces: true,
        ));

        return new \Monolog\Logger(
            name: self::CHANNEL_DEBUG,
            handlers: [$errorhandler],
            processors: [self::moodle_data_processor(...)],
        );
    }
}
