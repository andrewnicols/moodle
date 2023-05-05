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

namespace core\content;

use core\context;
use core\response_handler;
use core\content\controllers\component_file_controller;
use core\content\servable_item;
use moodle_url;
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
class file_handler {

    public function __construct(
        private response_handler $responsehandler,
    ) {
    }

    /**
     * Get and instanv eo
     * @return self
     */
    public static function instance(): self {
        return new self(new response_handler());
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
    public function get_servable_item_from_pluginfile_params(
        string $component,
        context $context,
        string $filearea,
        array $args,
        stdClass $user,
    ): ?servable_item {
        if ($componentclass = $this->get_contentarea_classname($component)) {
            return $componentclass::get_servable_item_from_pluginfile_params(
                component: $component,
                context: $context,
                filearea: $filearea,
                args: $args,
                user: $user,
            );
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
    public function can_user_access_stored_file_from_context(
        stored_file $file,
        stdClass $user,
        context $context,
        ?string $component = null,
    ): bool {
        $component = $component ?? $file->get_component();
        if ($componentclass = $this->get_contentarea_classname($component)) {
            return $componentclass::can_user_access_stored_file_from_context(
                file: $file,
                component: $component,
                user: $user,
                context: $context,
            ) ?? false;
        }

        return false;
    }

    /**
     * Serve some servable content given the sendfile options.
     *
     * @param   null|servable_item $servable
     * @param   array $sendfileoptions
     * @param   bool $forcedownload
     */
    public function serve_servable_item(?servable_item $content, array $sendfileoptions, bool $forcedownload): void {
        // Close the session to prevent it blocking during large file transmission.
        \core\session\manager::write_close();

        if (!$content) {
            $this->responsehandler->send(new not_found_response());
        }

        // Serve the file.
        $this->responsehandler->send($content->get_response($sendfileoptions, $forcedownload));
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
    public function serve_file_from_pluginfile_params(
        string $component,
        context $context,
        string $filearea,
        array $args,
        stdClass $user,
        array $sendfileoptions,
        bool $forcedownload,
    ): void {
        // Fetch the servable file.
        $servable = $this->get_servable_item_from_pluginfile_params($component, $context, $filearea, $args, $user);
        if ($servable) {
            $servable->call_require_login_if_needed();

            if ($servable->can_access_content($user, $context)) {
                 $this->serve_servable_item($servable, $sendfileoptions, $forcedownload);
            } else {
                // The servable was found, but permission denied.
                $this->responsehandler->send(new access_denied_response());
            }
        }

        // The supplied component did not return a file.
        // In the future this will return a file not found, but for now it will return void to allow the legacy
        // `file_pluginfile` system to serve legacy content.
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
    public function get_pluginfile_url_for_stored_file(
        stored_file $file,
        ?string $component = null,
        bool $forcedownload = false,
        bool $tokenurl = false,
        ?context $viewcontext = null,
    ): ?moodle_url {
        $component = $component ?? $file->get_component();
        if ($componentclass = $this->get_contentarea_classname($component)) {
            return $componentclass::get_pluginfile_url_for_stored_file(
                file: $file,
                forcedownload: $forcedownload,
                tokenurl: $tokenurl,
                viewcontext: $viewcontext,
            );
        }

        return null;
    }

    /**
     * Get the contentarea classname for a component.
     *
     * @param   string $component The component name
     * @return  null|string The classname or null if not found
     */
    protected function get_contentarea_classname(string $component): ?string {
        return component_file_controller::get_contentarea_classname_for_component($component);
    }

    /**
     * Get a list of stored_file instances in the current component and context combination.o
     *
     * @param   context $context
     * @param   string $component
     * @return  stored_file[]
     */
    public function get_all_files_in_context(
        context $context,
        string $component,
    ): array {
        $classname = $this->get_contentarea_classname($component);

        if (!$classname) {
            return [];
        }

        return $classname::get_all_files_in_context(
            context: $context,
            component: $component,
        );
    }
}
