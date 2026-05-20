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

namespace theme_boost;

use core\hook\output\before_requirejs_config;

/**
 * Hook listeners for theme_boost.
 *
 * @package    theme_boost
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class hook_listener {
    /**
     * Add imports for Bootstrap JS to the RequireJS map.
     *
     * @param before_requirejs_config $hook The hook object.
     * @return array
     */
    public static function before_requirejs_config_listener(before_requirejs_config $hook): void {
        $hook->add_requirejs_esm_map_entries(
            entries: [
                'theme_boost/bootstrap/index' => '@moodle/lms/theme_boost/bootstrap',
                'theme_boost/bootstrap/alert' => '@moodle/lms/theme_boost/bootstrap/alert:default',
                'theme_boost/bootstrap/base-component' => '@moodle/lms/theme_boost/bootstrap/base-component:default',
                'theme_boost/bootstrap/button' => '@moodle/lms/theme_boost/bootstrap/button:default',
                'theme_boost/bootstrap/carousel' => '@moodle/lms/theme_boost/bootstrap/carousel:default',
                'theme_boost/bootstrap/collapse' => '@moodle/lms/theme_boost/bootstrap/collapse:default',
                'theme_boost/bootstrap/dom/data' => '@moodle/lms/theme_boost/bootstrap/dom/data:default',
                'theme_boost/bootstrap/dom/event-handler' => '@moodle/lms/theme_boost/bootstrap/dom/event-handler:default',
                'theme_boost/bootstrap/dom/manipulator' => '@moodle/lms/theme_boost/bootstrap/dom/manipulator:default',
                'theme_boost/bootstrap/dom/selector-engine' => '@moodle/lms/theme_boost/bootstrap/dom/selector-engine:default',
                'theme_boost/bootstrap/dropdown' => '@moodle/lms/theme_boost/bootstrap/dropdown:default',
                'theme_boost/bootstrap/modal' => '@moodle/lms/theme_boost/bootstrap/modal:default',
                'theme_boost/bootstrap/offcanvas' => '@moodle/lms/theme_boost/bootstrap/offcanvas:default',
                'theme_boost/bootstrap/popover' => '@moodle/lms/theme_boost/bootstrap/popover:default',
                'theme_boost/bootstrap/scrollspy' => '@moodle/lms/theme_boost/bootstrap/scrollspy:default',
                'theme_boost/bootstrap/tab' => '@moodle/lms/theme_boost/bootstrap/tab:default',
                'theme_boost/bootstrap/toast' => '@moodle/lms/theme_boost/bootstrap/toast:default',
                'theme_boost/bootstrap/tooltip' => '@moodle/lms/theme_boost/bootstrap/tooltip:default',
                'theme_boost/bootstrap/util/backdrop' => '@moodle/lms/theme_boost/bootstrap/util/backdrop:default',
                'theme_boost/bootstrap/util/component-functions' => '@moodle/lms/theme_boost/bootstrap/util/component-functions:default',
                'theme_boost/bootstrap/util/config' => '@moodle/lms/theme_boost/bootstrap/util/config:default',
                'theme_boost/bootstrap/util/focustrap' => '@moodle/lms/theme_boost/bootstrap/util/focustrap:default',
                'theme_boost/bootstrap/util/index' => '@moodle/lms/theme_boost/bootstrap/util/index:default',
                'theme_boost/bootstrap/util/sanitizer' => '@moodle/lms/theme_boost/bootstrap/util/sanitizer:default',
                'theme_boost/bootstrap/util/scrollbar' => '@moodle/lms/theme_boost/bootstrap/util/scrollbar:default',
                'theme_boost/bootstrap/util/swipe' => '@moodle/lms/theme_boost/bootstrap/util/swipe:default',
                'theme_boost/bootstrap/util/template-factory' => '@moodle/lms/theme_boost/bootstrap/util/template-factory:default',
            ],
        );
    }
}
