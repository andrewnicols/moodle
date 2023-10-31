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
     * Finds an entry of the container by its identifier and returns it.
     *
     * This is a shortcut helper for \core\container::get_container()->get($id).
     *
     * @param string $id Identifier of the entry to look for.
     * @return mixed Entry.
     */
    public static function get(string $id): mixed {
        return self::get_container()->get($id);
    }

    /**
     * Create a new Container Instance.
     *
     * @return ContainerInterface
     */
    protected static function create_container(): ContainerInterface {
        global $CFG, $DB;

        require_once("{$CFG->libdir}/php-di/php-di/src/functions.php");

        $builder = new \DI\ContainerBuilder();
        $builder->useAutowiring(true);

        $hookmanager = \core\hook\manager::get_instance();

        $builder->addDefinitions([
            // The hook manager should be in the container.
            \core\hook\manager::class => $hookmanager,

            \moodle_database::class => $DB,

            \core_string_manager::class => fn() => get_string_manager(),
        ]);

        // Add any additional definitions using hooks.
        $hookmanager->dispatch($builder);

        return $builder->build();
    }
}
