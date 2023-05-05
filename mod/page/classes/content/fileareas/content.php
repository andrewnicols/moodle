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

namespace mod_page\content\fileareas;

use core\content\plugintypes\mod\filearea;
use core\content\servable_item;
use core\content\servable_items\servable_callback;
use core\content\servable_items\servable_stored_file;
use core\context;
use stdClass;
use stored_file;

/**
 * The definition of the content filearea for the mod_page component.
 *
 * @package     core
 * @copyright   2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class content extends filearea {

    /**
     * Get the itemid usage for this filearea.
     *
     * @param   context $context
     * @return  int
     */
    protected function get_itemid_usage(context $context): ?int {
        return self::ITEMID_PRESENT_BUT_DEFAULT;
    }

    /**
     * Get the servable stored file content from the parameters from a pluginfile URL.
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
        stdClass $user,
    ): ?servable_item {
        // Fetch function args before manipulating them.
        $functionargs = func_get_args();

        // All files in mod_page have a URL of either:
        // - /[context]/[component]/[filearea]/index.html; or
        // - /[context]/[component]/[filearea]/index.htm; or
        // - /[context]/[component]/[filearea]/[revision]/path/to/file.png .
        //
        // In the cases where there is no revision and the first field is an index, that content is rewritten to load
        // the relative files from the same URL.
        //
        // For that case the first parameter will be an index-like filename, and a callback is returned instead.
        $validindexfiles = [
            'index.html',
            'index.htm',
        ];

        $firstarg = array_pop($args);
        if (in_array($firstarg, $validindexfiles)) {
            $filename = $firstarg;
            $cm = self::get_cm_from_context($context);

            $callback = function() use ($filename, $context, $cm) {
                global $DB;

                $page = $DB->get_record('page', ['id' => $cm->instance]);

                // Rewrite the pluginfile URLs so the media filters can work.
                $content = file_rewrite_pluginfile_urls(
                    $page->content,
                    'webservice/pluginfile.php',
                    $context->id,
                    'mod_page',
                    'content',
                    $page->revision
                );
                $content = format_text($content, $page->contentformat, (object) [
                    'noclean' => true,
                    'overflowdiv' => true,
                    'context' => $context,
                ]);

                // Rewrite again in reverse mode to remove @@PLUGINFILE@@/.
                $content = file_rewrite_pluginfile_urls(
                    $content,
                    'webservice/pluginfile.php',
                    $context->id,
                    'mod_page',
                    'content',
                    $page->revision,
                    ['reverse' => true]
                );
                $content = str_replace('@@PLUGINFILE@@/', '', $content);

                return $content;
            };

            return new servable_callback($component, $context, $this, $callback, null);
        }

        // Fall back to the standard way of handling a pluginfile URL.
        return self::get_servable_stored_file_from_pluginfile_params(...$functionargs);
    }

    /**
     * Get the servable stored file content from the parameters from a pluginfile URL.
     *
     * @param   string $component The component in the URL
     * @param   context $context The context of the contextid in the URL
     * @param   string $filearea The filearea in the URL
     * @param   array $args The array of arguments in the pluginfile URL after the component, context, and filearea have
     *          been removed
     * @param   stdClass $user
     * @return  null|servable_item
     */
    protected function get_servable_stored_file_from_pluginfile_params(
        string $component,
        context $context,
        string $filearea,
        array $args,
        stdClass $user,
    ): ?servable_stored_file {
        xdebug_break();
        global $DB;

        [
            'itemid' => $itemid,
            'args' => $args,
        ] = $this->get_itemid_from_pluginfile_params($context, $filearea, $args);

        $filename = array_pop($args);

        // Get the remaining filepath.
        if (empty($args)) {
            $filepath = '/';
        } else {
            $filepath = '/' . implode('/', $args) . '/';
        }

        $file = $this->get_stored_file_from_filepath(
            $context,
            $component,
            static::get_filearea_name(),
            $itemid,
            $filepath,
            $filename
        );

        if ($file) {
            return new servable_stored_file($component, $context, $this, $file);
        }

        // The file was not found. Check the legacy variant.
        $cm = self::get_cm_from_context($context);
        $page = $DB->get_record('page', ['id' => $cm->instance]);

        if ($page->legacyfiles != RESOURCELIB_DISPLAY_POPUP) {
            // Legacy files not configured.
            return null;
        }

        // Attempt to migrate the file.
        $file = resourcelib_try_file_migration($filepath, $cm->id, $cm->course, 'mod_page', 'content', 0);

        if ($file) {
            $servable = new servable_stored_file($component, $context, $this, $file);

            // File migrate - update flag.
            $page->legacyfileslast = time();
            $DB->update_record('page', $page);

            return $servable;
        }

        // No values found.
        return null;
    }

    /**
     * Check whether the specified user can access content in the filecontext from the viewed context.
     *
     * @param   string $component The component that the content belongs to
     * @param   context $filecontext The context of the content being viewed
     * @param   stdClass $user The user viewing the content
     * @param   context $context The context that the content is viewed from
     * @return  bool
     */
    protected static function can_user_access_content_from_context(
        string $component,
        context $filecontext,
        stdClass $user,
        context $viewcontext,
    ): bool {
        if ($filecontext != $viewcontext) {
            // The filecontext does not match the context that the item is viewed from.
            return false;
        }

        // Check the view capability first as this is the cheapest check.
        if (!has_capability("mod/page:view", $filecontext, $user)) {
            return false;
        }

        // Check if the user can view the page.
        $cm = self::get_cm_from_context($filecontext);
        return $cm->uservisible;
    }
}
