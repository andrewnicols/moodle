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
use stdClass;

/**
 * An object used to represent content which can be served.
 *
 * @copyright   2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class servable_item {
    /** @var int Default cache time to use */
    const CACHETIME_DEFAULT = 10 * MINSECS;

    /** @var int Do not filter at all */
    const FILTER_NONE = 0;

    /** @var int Filter all content */
    const FILTER_ALL = 1;

    /** @var int Only filter HTML content */
    const FILTER_ONLY_HTML = 2;

    /** @var filearea $filearea The file area handler for this servable item */
    /** @var string $component The component associated with this servable item */
    /** @var context The context associated with this servable item */

    /** @var bool|null Whether to force the download */
    protected ?bool $forcedownload = null;

    /** @var array Options to pass to send_file */
    protected array $sendfileoptions = [];

    /** @var int The amount of time to request that the browser caches the file */
    protected ?int $cachetime = null;

    /** @var int The filter value to pass to send_file */
    protected int $filterfile = self::FILTER_NONE;

    /** @var array The list of headers added */
    protected array $headers = [];

    /**
     * Create a new servable_item instance.
     *
     * @param   string $component The component that this servable item belongs to
     * @param   context $context The context that this content belongs to
     * @param   filearea $filearea The filearea which generated the content
     *                   This is used to perform capability checks.
     */
    public function __construct(
        protected string $component,
        protected context $context,
        protected filearea $filearea,
    ) {
        $this->apply_filearea_options();
    }

    /**
     * Apply all relevant settings from the filearea.
     */
    protected function apply_filearea_options(): void {
        $this->set_cache_time($this->filearea->get_sendfile_cache_time($this));
        $this->set_force_download($this->filearea->should_force_download($this));
        $this->add_headers($this->filearea->get_pre_sendfile_headers($this));
        $this->set_sendfile_options($this->filearea->get_sendfile_option_overrides($this));
    }

    /**
     * Get the filearea instance.
     *
     * @return  filearea
     */
    public function get_filearea(): filearea {
        return $this->filearea;
    }

    /**
     * Get the string that this servable item relates to.
     *
     * @return  string
     */
    public function get_component(): string {
        return $this->component;
    }

    /**
     * Get the context that this servable item relates to.
     *
     * @return  context
     */
    public function get_context(): context {
        return $this->context;
    }

    /**
     * Send the file proxy.
     *
     * @param   array $sendfileoptions
     * @param   bool $forcedownload
     */
    abstract public function send_file(array $sendfileoptions, bool $forcedownload): void;

    /**
     * Check whether the specified user can access the supplied servable content item in the supplied context.
     *
     * @param   stdClass $user
     * @param   context $viewedcontext
     * @return  bool
     */
    public function user_can_access_from_context(stdClass $user, context $viewedcontext): bool {
        return $this->filearea->can_user_access_servable_item_from_content($this, $user, $viewedcontext);
    }

    /**
     * Override the forcedownload option with the specified value.
     *
     * @param   null|bool $forcedownload
     */
    public function set_force_download(?bool $forcedownload): void {
        $this->forcedownload = $forcedownload;
    }

    /**
     * Get the final configuration of whether to force a download.
     *
     * The configuration received via the @see{set_force_download} function overrides the value provided here.
     *
     * The usecase anticipated is that a component will call set_force_download if it has a need to override the value requested
     * by the user.
     *
     * @param   bool $forcedownloadrequested
     * @return  bool
     */
    public function get_force_download_value(bool $forcedownloadrequested): bool {
        if ($this->forcedownload === null) {
            return $forcedownloadrequested;
        }

        return $this->forcedownload;
    }

    /**
     * Override the standard options with the specified option.
     *
     * @param   string $key
     * @param   mixed $value
     */
    public function set_sendfile_option(string $key, $value): void {
        $this->sendfileoptions[$key] = $value;
    }

    /**
     * Add a set of additional sendfile options.
     *
     * @param   array An array of key/value pairs to add to any existing options.
     */
    public function set_sendfile_options(array $sendfileoptions): void {
        foreach ($sendfileoptions as $key => $value) {
            $this->set_sendfile_option($key, $value);
        }
    }

    /**
     * Get the final option configuration.
     *
     * The configuration received via the @see{set_sendfile_option} function overrides the value provided here.
     *
     * The usecase anticipated is that a component may set any specific options required, and may override any values
     * requested by the user.
     *
     * @param   array $userrequestedoptions
     * @return  array
     */
    public function get_sendfile_options(array $userrequestedoptions): array {
        return array_merge(
            $userrequestedoptions,
            $this->sendfileoptions,
        );
    }

    /**
     * Set the component-requested cache time.
     *
     * @param   int|null $cachetime
     */
    public function set_cache_time(?int $cachetime): void {
        $this->cachetime = $cachetime;
    }

    /**
     * Get the cache time to pass to send_file().
     *
     * @return int
     */
    public function get_cache_time(): int {
        if ($this->cachetime === null) {
            return self::CACHETIME_DEFAULT;
        }
        return $this->cachetime;
    }

    /**
     * How to filter the filter during send_file.
     *
     * Permitted values are:
     *      * 0 -  Do not filter
     *      * 1 -  All filters
     *      * 2 -  Only filter HTML files
     *
     * @param   int $filtervalue
     */
    public function set_filter_value(int $filtervalue): void {
        $this->filterfile = $filtervalue;
    }

    /**
     * Get the filter setting to pass to send_file().
     *
     * @return  int
     */
    public function get_filter_value(): int {
        return $this->filterfile;
    }

    /**
     * Add a header.
     *
     * @param   string $key The name of the header to add
     * @param   string $value The header content
     */
    public function add_header(string $key, string $value): void {
        $this->headers[] = "{$key}: {$value}";
    }

    /**
     * Add a set of additional headers to call before sendfile is called.
     *
     * @param   array An array of key/value header values
     */
    public function add_headers(array $headers): void {
        foreach ($headers as $key => $value) {
            $this->add_header($key, $value);
        }
    }

    /**
     * Get the list of headers to be added during file sending.
     *
     * @return  array
     */
    protected function get_headers(): array {
        return $this->headers;
    }

    /**
     * Send all headers.
     */
    protected function send_headers(): void {
        foreach ($this->get_headers() as $header) {
            header($header);
        }
    }

    /**
     * Check whether login is required for this servable item.
     *
     * This call will check the login behaviour according to the rules defined for the filearea of this file.
     */
    public function call_require_login_if_needed(
        bool $preventredirect = false,
    ): void {
        $filearea = $this->filearea;

        if ($filearea->requires_login($this)) {
            $loginargs = $filearea->get_require_login_params($this);
            $loginargs['preventredirect'] = $preventredirect;
            require_login(...$loginargs);
        }

        if ($filearea->requires_course_login($this)) {
            $loginargs = $filearea->get_require_course_login_params($this);
            $loginargs['preventredirect'] = $preventredirect;
            require_course_login(...$loginargs);
        }
    }

    /**
     * Check whether the user needs to log in to access this servable item.
     *
     * @return bool
     */
    public function meets_login_requirements(): bool {
        try {
            $this->call_require_login_if_needed(preventredirect: true);
        } catch (\require_login_exception) {
            return false;
        }

        return true;
    }

    /**
     * Check whether the specified user can access this content in the supplied context.
     *
     * @param   stdClass $user
     * @param   context $context
     * @return  bool
     */
    public function can_access_content(stdClass $user, context $context): bool {
        $filearea = $this->filearea;

        return $filearea->can_user_access_servable_item_from_content($this, $user, $context);
    }
}
