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
use core\content\servable_item;
use core\content\servable_items\servable_stored_file;
use stdClass;
use stored_file;

/**
 * The definition for a single pluginfile file area within a component.
 *
 * This class is responsible for returning information about a file area used in Moodle, to support translation of a
 * pluginfile URL into an item of servable content, and determining whether a user can access that file.
 *
 * @copyright   2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class filearea {

    /**
     * @var int The itemid is not present at all in the URL and defaults to zero
     *
     * The URL is in the form:
     *     /pluginfile.php/[contextid]/[component]/[filearea]/[file/path]/[filename.extension]
     *
     * An example of this would be
     *     /pluginfile.php/29/mod_assign/intro/instructions/image_of_cat.png
     *
     *     contextid:   29
     *     component:   mod_assign
     *     filearea:    intro
     *     filepath:    instructions
     *     filename:    image_of_cat.png
     *     itemid:      0
     */
    const ITEMID_NOT_PRESENT = 0;

    /**
     * @var int The itemid is present in the URL but has no meaning and should always be zero
     *
     * The URL is in the form:
     *     /pluginfile.php/[contextid]/[component]/[filearea]/[itemid]/[file/path]/[filename.extension]
     *
     * An example of this would be
     *     /pluginfile.php/29/mod_assign/content/0/workbooks/template.docx
     *
     *     contextid:   29
     *     component:   mod_assign
     *     filearea:    content
     *     itemid:      0
     *     filepath:    workbooks
     *     filename:    template.docx
     */
    const ITEMID_PRESENT_BUT_DEFAULT = 1;

    /**
     *  @var int The itemid is present in the URL and is in use
     *
     * The URL is in the form:
     *     /pluginfile.php/[contextid]/[component]/[filearea]/[itemid]/[file/path]/[filename.extension]
     *
     * An example of this would be
     *     /pluginfile.php/32/mod_forum/attachment/950/cat.png
     *
     *     contextid:   32
     *     component:   mod_forum
     *     filearea:    attachment
     *     itemid:      950
     *     filepath:    [none]
     *     filename:    cat.png
     */
    const ITEMID_PRESENT_IN_USE = 2;

    /**
     * Get a list of stored_file instances in the current component and context combination.
     *
     * @param   context $context
     * @param   string $component
     * @return  stored_file[]
     */
    public static function get_all_files_in_context(context $context, string $component): array {
        $fs = get_file_storage();

        return $fs->get_area_files($context->id, $component, static::get_filearea_name());
    }

    /**
     * Check whether the specified user can access the supplied servable content item in the supplied context.
     *
     * @param   servable_item $servable
     * @param   stdClass $user
     * @param   context $viewcontext
     * @return  bool
     */
    public function can_user_access_servable_item_from_content(
        servable_item $servable,
        stdClass $user,
        context $viewcontext,
    ): bool {
        return static::can_user_access_content_from_context(
            $servable->get_component(),
            $servable->get_context(),
            $user,
            $viewcontext,
        );
    }

    /**
     * Check whether the specified use can access the supplied stored_file in the supplied context.
     *
     * @param   stored_file $file
     * @param   stdClass $user
     * @param   context $context
     * @return  bool
     */
    public static function can_user_access_stored_file_from_context(
        stored_file $file,
        stdClass $user,
        context $context,
    ): ?bool {
        return static::can_user_access_content_from_context(
            $file->get_component(),
            context::instance_by_id($file->get_contextid()),
            $user,
            $context,
        );
    }

    /**
     * Check whether the specified user can access the content in the supplied context.
     *
     * @param   string $component The component that the content belongs to
     * @param   context $filecontext The context of the content being viewed
     * @param   stdClass $user The user viewing the content
     * @param   context $context The context that the content is viewed from
     * @return  bool
     */
    abstract protected static function can_user_access_content_from_context(
        string $component,
        context $filecontext,
        stdClass $user,
        context $viewcontext,
    ): bool;

    /**
     * Get the name of the filearea.
     *
     * In situations where the filearea name does not match the classname, it will be necessary to override this
     * function.
     *
     * @return  string
     */
    public static function get_filearea_name(): string {
        $parts = explode('\\', static::class);

        return array_pop($parts);
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
        $args = func_get_args();
        return $this->get_servable_stored_file_from_pluginfile_params(...$args);
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

        if (!$file) {
            return null;
        }

        return new servable_stored_file($component, $context, $this, $file);
    }

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
     * Whether login is required to access this filearea.
     *
     * @param   servable_item $servable
     * @return  bool
     */
    public function requires_login(servable_item $servable): bool {
        return false;
    }

    /**
     * Whether login to a specific course required to access this filearea.
     *
     * @param   servable_item $servable
     * @return  bool
     */
    public function requires_course_login(servable_item $servable): bool {
        return $this->get_require_course_login_params($servable) !== null;
    }

    /**
     * Get arguments to pass to require_login().
     *
     * @param   servable_item $servable
     * @return  array
     */
    public function get_require_login_params(servable_item $servable): array {
        return [];
    }

    /**
     * Get arguments to pass to require_course_login(), or null if course login is not required.
     *
     * @param   servable_item $servable
     * @return  null|array
     */
    public function get_require_course_login_params(servable_item $servable): ?array {
        return null;
    }

    /**
     * Set whether the content should be forcibly downloaded.
     *
     * If a null value is returned, then the user-requested value is used, otherwise download is either forcibly set, or
     * forcibly unset.
     *
     * @param   servable_item $servable
     * @return  null|bool
     */
    public function should_force_download(servable_item $servable): ?bool {
        return null;
    }

    /**
     * Return a list of options to send_file() and send_stored_file() to forcibly set.
     *
     * @param   servable_item $servable
     * @return  array
     */
    public function get_sendfile_option_overrides(servable_item $servable): array {
        return [];
    }

    /**
     * Return a list of headers to add before calling send_file() or send_stored_file().
     *
     * @param   servable_item $servable
     * @return  array
     */
    public function get_pre_sendfile_headers(servable_item $servable): array {
        return [];
    }

    /**
     * Return the cache time to use for this file.
     *
     * @param   servable_item $servable
     * @return  null|int
     */
    public function get_sendfile_cache_time(servable_item $servable): ?int {
        return null;
    }

    /**
     * Get the itemid from the pluginfile_params.
     *
     * @param   context $context The context that the file is in
     * @param   string $component
     * @param   array $args The remaining args from the pluginfile
     * @return  array An array containing the args after any changes, and the itemid
     */
    protected function get_itemid_from_pluginfile_params(context $context, string $component, array $args): array {
        $itemidtype = $this->get_itemid_usage($context);

        if ($itemidtype === self::ITEMID_NOT_PRESENT) {
            // Some component file areas do not include the itemid at all.
            // This is the case in the generic activity 'intro' section, for example.
            $itemid = 0;
        }

        if ($itemidtype === self::ITEMID_PRESENT_BUT_DEFAULT) {
            // Many components have a space in the URL where an itemid would be, but only ever expect an itemid of 0.
            $itemid = 0;
            array_shift($args);
        }

        if ($itemidtype === self::ITEMID_PRESENT_IN_USE) {
            // Most uses of the pluginfile URL have the itemid as the first argument.
            $itemid = array_shift($args);
        }

        return [
            'args' => $args,
            'itemid' => $itemid,
        ];
    }

    /**
     * Get the stored file at the specified location.
     *
     * @return  null|stored_file A stored_file for the given params, or null if none was found
     */
    protected function get_stored_file_from_filepath(
        context $context,
        string $component,
        string $filearea,
        int $itemid,
        string $filepath,
        string $filename
    ): ?stored_file {
        $fs = get_file_storage();
        $file = $fs->get_file($context->id, $component, $filearea, $itemid, $filepath, $filename);

        if (!$file) {
            // File not found.
            return null;
        }

        return $file;
    }

    /**
     * Get the context object for a stored_file.
     *
     * @param   stored_file $file
     * @return  context
     */
    protected static function get_context_for_stored_file(stored_file $file): context {
        return context::instance_by_id($file->get_contextid());
    }
}
