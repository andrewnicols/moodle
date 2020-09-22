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

/**
 * Content API File Area definition.
 *
 * @package     core_files
 * @copyright   2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
namespace core_user\content\fileareas;

use core\content\filearea;
use core\content\servable_item;
use core\content\servable_items\servable_local_file;
use core\content\servable_items\servable_stored_file;
use core\content\servable_items\servable_redirect;
use core\context;
use stdClass;
use stored_file;
use theme_config;

/**
 * File area definition for the icon filearea of core_user.
 *
 * @copyright   2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class icon extends filearea {

    /**
     * Get the itemid usage for this filearea.
     *
     * @param   context $context
     * @return  int
     */
    protected function get_itemid_usage(context $context): ?int {
        return self::ITEMID_NOT_PRESENT;
    }

    /**
     * Check whether the specified user can access the supplied servable content item in the supplied context.
     *
     * @param   servable_item $servable
     * @param   stdClass $user
     * @param   context $viewcontext
     * @return  bool
     */
    public function can_user_access_servable_item_from_content(servable_item $servable, stdClass $user, context $viewcontext): bool {
        // Icons are always available.
        // Different servable content items are returned depending on conditions such as whether the user is logged in,
        // is a guest user, and the values of the forcelogin and forceloginforprofileimage config settings.
        return true;
    }

    /**
     * Get the servable content from the parameters from a pluginfile URL.
     *
     * @param   string $component The component in the URL
     * @param   context $context The context of the contextid in the URL
     * @param   string $filearea The filearea in the URL
     * @param   array $args The array of arguments in the pluginfile URL after the component, context, and filearea have
     *          been removed
     * @param   stdClass $user
     * @return  null|servable_item
     */
    public function get_servable_item_from_pluginfile_params(
        string $component,
        context $context,
        string $filearea,
        array $args,
        stdClass $user
    ): ?servable_item {
        global $CFG, $DB;

        // Icon URLs are in the following formats:
        // - /pluginfile.php/[contextid]/user/icon/[filename]; or
        // - /pluginfile.php/[contextid]/user/icon/[themename]/[filename].
        ['args' => $args] = $this->get_itemid_from_pluginfile_params($context, $filearea, $args);

        if (count($args) == 1) {
            $themename = theme_config::DEFAULT_THEME;
            $filename = array_shift($args);
        } else {
            $themename = array_shift($args);
            $filename = array_shift($args);
        }

        // Normalise the filename.
        $filename = self::get_icon_filename($filename);

        if (!self::should_allow_access_to_uploaded_icons()) {
            $theme = theme_config::load($themename);

            return new servable_redirect(
                $component,
                $context,
                $this,
                $user,
                $theme->image_url("u/{$filename}", "moodle"),
            );
        }

        $validfilenames = array_unique([
            "{$filename}.png",
            "{$filename}.jpg",

            // The f3 512x512px was introduced in 2.3, there might be only the smaller version.
            "f1.png",
            "f1.jpg",
        ]);

        $fs = get_file_storage();

        // Fetch all area files in one query.
        // Only the best match is returned but this can information can be fetched a single time.
        $files = $fs->get_area_files($context->id, 'user', 'icon', 0);

        foreach ($validfilenames as $filename) {
            foreach ($files as $file) {
                if ($file->get_filename() === $filename) {
                    return new servable_stored_file($component, $context, $this, $file);
                }
            }
        }

        // Bad reference - try to prevent future retries as hard as possible.
        if ($picture = $DB->get_field('user', 'picture', ['id' => $context->instanceid])) {
            $DB->set_field('user', 'picture', 0, ['id' => $context->instanceid]);
        }

        // Note: Do not serve a redirect here because it should not be cached.
        $theme = theme_config::load($themename);
        return new servable_local_file($component, $context, $this, $theme->resolve_image_location("u/{$filename}", 'moodle', null));
    }

    /**
     * Check whether the specified use can access the supplied stored_file in the supplied context.
     *
     * @param   stored_file $file
     * @param   stdClass $user
     * @param   context $context
     * @return  bool
     */
    public static function can_user_access_stored_file_from_context(stored_file $file, stdClass $user, context $context): ?bool {
        // Some form of user icon is always available, but those actually uploaded as a stored file are only accessible
        // in some cases.
        // The should_allow_access_to_uploaded_icons function is used both here, and in
        // get_servable_item_from_pluginfile_params to check correct access to these files.
        return self::should_allow_access_to_uploaded_icons();
    }

    /**
     * Get the filename icon.
     *
     * @param   string $filename
     * @return  string
     */
    protected static function get_icon_filename(string $filename): string {
        switch ($filename) {
            case 'f1':
                return 'f1';
            case 'f2':
                return 'f2';
            case 'f3':
                return 'f3';
            default:
                return 'f1';
        }
    }

    /**
     * Check whether the current user should have access to uploaded user icons.
     *
     * @return  bool
     */
    protected static function should_allow_access_to_uploaded_icons(): bool {
        global $CFG;

        if (!empty($CFG->forcelogin) && !isloggedin()) {
            return false;
        }

        if (!empty($CFG->forceloginforprofileimage)) {
            if (!isloggedin()) {
                return false;
            }

            if (isguestuser()) {
                return false;
            }
        }

        return true;
    }

    /**
     * Return a list of options to send_file() and send_stored_file() to forcibly set.
     *
     * @param   servable_item $servable
     * @return  array
     */
    public function get_sendfile_option_overrides(servable_item $servable): array {
        global $CFG;

        $options = [];

        if ($servable instanceof servable_stored_file) {
            if (empty($CFG->forcelogin) && empty($CFG->forceloginforprofileimage)) {
                // Profile images should be cache-able by both browsers and proxies according
                // to $CFG->forcelogin and $CFG->forceloginforprofileimage.
                $options['cacheability'] = 'public';
            }
        }

        return array_merge(
            parent::get_sendfile_option_overrides($servable),
            $options
        );
    }

    /**
     * Set whether the content should be forcibly downloaded.
     *
     * If a null value is returned, then the user-requested value is used, otherwise download is either forcibly set, or
     * forcibly unset.
     *
     * @return  null|bool
     */
    public function should_force_download(servable_item $servable): ?bool {
        return false;
    }

    /**
     * Return the cache time to use for this file.
     *
     * @param   servable_item $servable
     * @return  null|int
     */
    public function get_sendfile_cache_time(servable_item $servable): ?int {
        if ($servable instanceof servable_stored_file) {
            // Cache for an entire year.
            // The URL includes a revision token ($user->picture).
            return YEARSECS;
        }

        // Cache for two weeks.
        return 2 * WEEKSECS;
    }
}
