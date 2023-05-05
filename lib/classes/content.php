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

use coding_exception;
use core\context;
use core\content\controllers\component_file_controller;
use core\content\export\exporters\abstract_mod_exporter;
use core\content\export\exporters\component_exporter;
use core\content\export\exporters\course_exporter;
use core\content\export\zipwriter;
use core\content\servable_item;
use core\content\xsendfile_response;
use moodle_url;
use Psr\Http\Message\ResponseInterface;
use stdClass;
use stored_file;

/**
 * The Content API allows all parts of Moodle to determine details about content within a component, or plugintype.
 *
 * This includes the description of files.
 *
 * @package     core_files
 * @copyright   2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class content {

    /**
     * Check whether the specified user can export content for the specified context.
     *
     * @param   context $currentcontext
     * @param   stdClass $user
     * @return  bool
     */
    public static function can_export_context(context $currentcontext, stdClass $user): bool {
        global $CFG;

        $canexport = false;

        if ($currentcontext->contextlevel == CONTEXT_COURSE) {
            if ($CFG->downloadcoursecontentallowed &&
                    has_capability('moodle/course:downloadcoursecontent', $currentcontext, $user)) {

                $courseinfo = get_fast_modinfo($currentcontext->instanceid)->get_course();

                // If enabled/disabled explicitly set on course, use that as the course setting, otherwise use site default.
                if (isset($courseinfo->downloadcontent) && $courseinfo->downloadcontent != DOWNLOAD_COURSE_CONTENT_SITE_DEFAULT) {
                    $canexport = $courseinfo->downloadcontent;
                } else {
                    $canexport = get_config('moodlecourse')->downloadcontentsitedefault;
                }

            }
        } else if ($currentcontext->contextlevel == CONTEXT_MODULE) {
            $cm = get_fast_modinfo($currentcontext->get_course_context()->instanceid)->cms[$currentcontext->instanceid];

            // Do not export course content if disabled at activity level.
            if (isset($cm->downloadcontent) && $cm->downloadcontent == DOWNLOAD_COURSE_CONTENT_DISABLED) {
                return false;
            }

            // Modules can only be exported if exporting is allowed in their course context.
            $canexport = self::can_export_context($currentcontext->get_course_context(), $user);
        }

        return $canexport;
    }

    /**
     * Export content for the specified context.
     *
     * @param   context $requestedcontext The context to be exported
     * @param   stdClass $user The user being exported
     * @param   zipwriter $archive The Zip Archive to export to
     */
    public static function export_context(context $requestedcontext, stdClass $user, zipwriter $archive): void {
        global $USER;

        if ($requestedcontext->contextlevel != CONTEXT_COURSE) {
            throw new coding_exception('The Content Export API currently only supports the export of courses');
        }

        if ($USER->id != $user->id) {
            throw new coding_exception('The Content Export API currently only supports export of the current user');
        }

        // Ensure that the zipwriter is aware of the requested context.
        $archive->set_root_context($requestedcontext);

        // Fetch all child contexts, indexed by path.
        $contextlist = [
            $requestedcontext->path => $requestedcontext,
        ];
        foreach ($requestedcontext->get_child_contexts() as $context) {
            $contextlist[$context->path] = $context;
        }

        // Reverse the order by key - this ensures that child contexts are processed before their parent.
        krsort($contextlist);

        // Get the course modinfo.
        $modinfo = get_fast_modinfo($requestedcontext->instanceid);

        // Filter out any context which cannot be exported.
        $contextlist = array_filter($contextlist, function($context) use ($user, $modinfo): bool {
            if ($context->contextlevel == CONTEXT_COURSE) {
                return self::can_export_context($context, $user);
            }

            if ($context->contextlevel == CONTEXT_MODULE) {
                if (empty($modinfo->cms[$context->instanceid])) {
                    // Unknown coursemodule in the course.
                    return false;
                }

                $cm = $modinfo->cms[$context->instanceid];

                if (!$cm->uservisible) {
                    // This user cannot view the activity.
                    return false;
                }

                // Defer to setting checks.
                return self::can_export_context($context, $user);
            }

            // Only course and activities are supported at this time.
            return false;
        });

        // Export each context.
        $exportedcontexts = [];
        $coursecontroller = new course_exporter($requestedcontext->get_course_context(), $user, $archive);
        foreach ($contextlist as $context) {
            if ($context->contextlevel === CONTEXT_MODULE) {
                $cm = $modinfo->cms[$context->instanceid];
                $component = "mod_{$cm->modname}";

                // Check for a specific implementation for this module.
                // This will export any content specific to this activity.
                // For example, in mod_folder it will export the list of folders.
                $classname = component_exporter::get_classname_for_component($component);
                $exportables = [];
                if (class_exists($classname) && is_a($classname, abstract_mod_exporter::class, true)) {
                    $controller = new $classname($context, $component, $user, $archive);
                    $exportables = $controller->get_exportables();
                }

                // Pass the exportable content to the  course controller for export.
                $coursecontroller->export_mod_content($context, $exportables);

                $exportedcontexts[$context->id] = $context;
            } else if ($context->contextlevel === CONTEXT_COURSE) {
                // Export the course content.
                $coursecontroller->export_course($exportedcontexts);
            }
        }

        $archive->finish();
    }

    /**
     * Get the servable content from the parameters from a pluginfile URL.
     *
     * @param   string $component The component in the URL
     * @param   context $context The context of the contextid in the URL
     * @param   string $filearea The filearea in the URL
     * @param   array $args The array of arguments in the pluginfile URL after the component, context, and filearea have
     *          been removed
     * @param   stdClass $user The user accessing the content
     * @return  null|servable_item
     */
    public static function get_servable_item_from_pluginfile_params(
        string $component,
        context $context,
        string $filearea,
        array $args,
        stdClass $user,
    ): ?servable_item {
        $handler = content\file_handler::instance();
        return $handler->get_servable_item_from_pluginfile_params(...func_get_args());
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
        stdClass $user,
        context $context,
        ?string $component = null,
    ): bool {
        $handler = content\file_handler::instance();
        return $handler->can_user_access_stored_file_from_context(...func_get_args());
    }

    /**
     * Serve some servable content given the sendfile options.
     *
     * @param   null|servable_item $servable
     * @param   array $sendfileoptions
     * @param   bool $forcedownload
     */
    public static function serve_servable_item(?servable_item $content, array $sendfileoptions, bool $forcedownload): void {
        $handler = content\file_handler::instance();
        $handler->serve_servable_item(...func_get_args());
    }

    /**
     * Handle fetching, and serving, of a file for a pluginfile.
     *
     * @param   string $component
     * @param   context $context
     * @param   string $filearea
     * @param   array $args
     * @param   stdClass $user
     * @param   array $sendfileoptions
     * @param   bool $forcedownload
     * @codeCoverageIgnore This method cannot be covered because send_file dies.
     */
    public static function serve_file_from_pluginfile_params(
        string $component,
        context $context,
        string $filearea,
        array $args,
        stdClass $user,
        array $sendfileoptions,
        bool $forcedownload,
    ): void {
        $handler = content\file_handler::instance();
        $handler->serve_file_from_pluginfile_params(...func_get_args());
    }

    /**
     * Get a moodle_url which represents a stored_file.
     *
     * The viewcontext is required where the file is viewed from a different context. For example the course context is
     * used for the course variant of a user profile, but the file sits in a user context.
     *
     * @param   stored_file $file The file to create a pluginfile URL for
     * @param   string $component
     * @param   bool $forcedownload Request a URL which will cause the file to be forcible downloaded
     * @param   bool $tokenurl Request a URL which includes an authentication token so that an existing login session
     *          is not required for the user to view the file
     * @param   null|context $viewcontext The alternate context to use in the URL. If none is provided then the file's
     *          context is used
     * @return  moodle_url|null
     */
    public static function get_pluginfile_url_for_stored_file(
        stored_file $file,
        ?string $component = null,
        bool $forcedownload = false,
        bool $tokenurl = false,
        ?context $viewcontext = null,
    ): ?moodle_url {
        $handler = content\file_handler::instance();
        return $handler->get_pluginfile_url_for_stored_file(...func_get_args());
    }

    /**
     * Get a list of stored_file instances in the current component and context combination.o
     *
     * @param   context $context
     * @param   string $component
     * @return  stored_file[]
     */
    public static function get_all_files_in_context(
        context $context,
        string $component,
    ): array {
        $handler = content\file_handler::instance();
        return $handler->get_all_files_in_context(...func_get_args());
    }
}
