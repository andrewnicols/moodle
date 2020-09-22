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

namespace core\content\controllers;

use core\context;
use core\content\filearea;
use core\content\servable_item;
use moodle_url;
use stdClass;
use stored_file;

/**
 * A class to help define, describe, and control access to file content within a part of Moodle.
 *
 * This class is responsible for returning information about a file area used in Moodle, to support translation of a
 * pluginfile URL into an item of servable content, and determining whether a user can access that file.
 *
 * @copyright   2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class file_controller extends abstract_controller {

    /**
     * Get the list of file areas in the component.
     *
     * @return  array
     */
    public static function get_fileareas(): array {
        return [];
    }

    /**
     * Get the class name for the specified filearea.
     *
     * @param string $filearea
     * @return null|string
     */
    public static function get_filearea_classname(string $filearea): ?string {
        $fileareas = static::get_fileareas();

        if (!array_key_exists($filearea, $fileareas)) {
            return null;
        }

        if (!class_exists($fileareas[$filearea])) {
            return null;
        }

        if (!is_subclass_of($fileareas[$filearea], filearea::class, true)) {
            debugging("The {$fileareas[$filearea]} class is not a subclass of " . filearea::class, DEBUG_DEVELOPER);
            return null;
        }

        return $fileareas[$filearea];
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
    public static function get_servable_item_from_pluginfile_params(
        string $component,
        context $context,
        string $filearea,
        array $args,
        stdClass $user,
    ): ?servable_item {
        // Get an instance of the filearea handler for this component/filearea combinatino.
        $handler = static::get_filearea_instance_for_component($component, $filearea);
        if (!$handler) {
            debugging("No file area found for {$filearea}", DEBUG_DEVELOPER);
            // None found.
            return null;
        }

        // Return the servable content item.
        return $handler->get_servable_item_from_pluginfile_params(
            $component,
            $context,
            $filearea,
            $args,
            $user,
        );
    }

    /**
     * Get a list of stored_file instances in the current component and context combination.
     *
     * @param   context $context
     * @param   string $component
     * @return  stored_file[]
     */
    public static function get_all_files_in_context(context $context, string $component): array {
        $files = [];
        foreach (array_values(static::get_fileareas()) as $classname) {
            if (!class_exists($classname)) {
                continue;
            }

            $files = array_merge(
                $files,
                $classname::get_all_files_in_context($context, $component),
            );
        }

        return $files;
    }

    /**
     * Get the filearea instance for a component and filearea combination.
     *
     * @param   string $component The component name
     * @param   string $filearea The file area
     * @return  filearea
     */
    protected static function get_filearea_instance_for_component(string $component, string $filearea): ?filearea {
        if ($classname = static::get_filearea_classname($filearea)) {
            return new $classname();
        }

        return null;
    }

    /**
     * Check whether the specified use can access the supplied stored_file in the supplied context.
     *
     * @param   stored_file $file
     * @param   string $component
     * @param   stdClass $user
     * @param   context $context
     * @return  bool
     */
    public static function can_user_access_stored_file_from_context(
        stored_file $file,
        string $component,
        stdClass $user,
        context $context,
    ): ?bool {
        $classname = static::get_filearea_classname($file->get_filearea());
        return $classname::can_user_access_stored_file_from_context($file, $user, $context);
    }

    /**
     * Get a moodle_url which represents a stored_file.
     *
     * The viewcontext is required where the file is viewed from a different context. For example the course context is
     * used for the course variant of a user profile, but the file sits in a user context.
     *
     * @param   stored_file $file The file to create a pluginfile URL for
     * @param   bool $forcedownload Request a URL which will cause the file to be forcible downloaded
     * @param   bool $tokenurl Request a URL which includes an authentication token so that an existing login session
     *          is not required for the user to view the file
     * @param   null|context $viewcontext The alternate context to use in the URL. If none is provided then the file's
     *          context is used
     * @return  moodle_url
     */
    public static function get_pluginfile_url_for_stored_file(
        stored_file $file,
        bool $forcedownload = false,
        bool $tokenurl = false,
        ?context $viewcontext = null,
    ): moodle_url {
        $contextid = $viewcontext ? $viewcontext->id : $file->get_contextid();

        return moodle_url::make_pluginfile_url(
            $contextid,
            $file->get_component(),
            $file->get_filearea(),
            $file->get_itemid(),
            $file->get_filepath(),
            $file->get_filename(),
            $forcedownload,
            $tokenurl,
        );
    }
}
