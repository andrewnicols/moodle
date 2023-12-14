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

namespace core\facade\hook;

/**
 * A facade for the core\facade\hook\manager class
 *
 * @package core
 * @copyright http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @author Moodle Pty Ltd <moodlebot@moodle.com>
 * @see \core\hook\manager
 * @method static void phpunit_redirect_hook(string $hookname, callable $callback) Override hook callbacks for testing purposes.
 * @method static void phpunit_stop_redirections() Cancel all redirections of hook callbacks.
 * @method static array get_callbacks_for_hook(string $hookclassname) Returns list of callbacks for given hook name.
 * @method static iterable get_all_callbacks() Returns list of all callbacks found in db/hooks.php files.
 * @method static iterable getListenersForEvent(object $event) Get the list of listeners for the specified event.
 * @method static array get_hooks_with_callbacks() Returns the list of Hook class names that have registered callbacks.
 * @method static object dispatch(object $event) Provide all relevant listeners with an event to process.
 * @method static bool is_deprecated_plugin_callback(string $plugincallback) Is the plugin callback from lib.php deprecated by any
 * hook?
 * @method static bool is_deprecating_hook_present(string $component, string $plugincallback) Is there a hook callback in component
 * that deprecates given lib.php plugin callback?
 */
class manager extends \core\facade {
    public static function get_facade_accessor(): string {
        return \core\hook\manager::class;
    }
}
