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

use Psr\Container\ContainerInterface;

/**
 * DI Container Helper.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class container {
    /** @var ContainerInterface The stored container */
    protected static ?ContainerInterface $container;

    /**
     * Get the DI Container.
     *
     * @return ContainerInterface
     */
    public static function get_container(): ContainerInterface {
        if (!isset(self::$container)) {
            self::$container = self::create_container();
        }
        return self::$container;
    }

    /**
     * Reset the DI Container.
     *
     * This is primarily intended for Unit Testing, and for use in Scheduled tasks.
     */
    public static function reset_container(): void {
        self::$container = null;
    }

    /**
     * Create a new Container Instance.
     *
     * @return ContainerInterface
     */
    protected static function create_container(): ContainerInterface {
        global $CFG;

        require_once("{$CFG->libdir}/php-di/php-di/src/functions.php");

        $builder = new \DI\ContainerBuilder();
        $builder->useAutowiring(true);

        $hookmanager = \core\hook\manager::get_instance();

        $builder->addDefinitions([
            \core\hook\manager::class => $hookmanager,
            \moodle_database::class => function() {
                global $DB;

                return $DB;
            },
            \moodle_page::class => function() {
                global $CFG, $PAGE;

                if ($PAGE === null) {
                    if (!empty($CFG->moodlepageclass)) {
                        if (!empty($CFG->moodlepageclassfile)) {
                            require_once($CFG->moodlepageclassfile);
                        }
                        $classname = $CFG->moodlepageclass;
                    } else {
                        $classname = 'moodle_page';
                    }
                    $PAGE = new $classname();
                }

                return $PAGE;
            },

            \core_renderer::class => function() {
                global $OUTPUT;
                return $OUTPUT;
            },

            \core_string_manager::class => fn() => get_string_manager(),

            \core\config::class => function() {
                global $CFG;

                return $CFG;
            },

            ServerRequestInterface::class => function() {
                // TODO: Can we get this?
                // Probably not, because the request is immutable and we may replace it during the course of processing.
                // See query parameter validation for an example.
                return \Slim\Psr7\Factory\ServerRequestFactory::createFromGlobals();
            },

            \core\router::class => function() {
                global $CFG;
                $scriptroot = parse_url($CFG->wwwroot, PHP_URL_PATH);

                return new \core\router(
                    basepath: $scriptroot,
                );
            }
        ]);

        // Add any additional definitions using hooks.
        $hookmanager->dispatch($builder);

        return $builder->build();
    }
}
