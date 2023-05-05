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

namespace core\content\servable_items;

use core\context;
use core\content\filearea;
use core\content\servable_item;
use core\content\xsendfile_response;
use Psr\Http\Message\StreamInterface;
use stored_file;

/**
 * A servable item representing a stored_file object.
 *
 * @package     core
 * @copyright   2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class servable_stored_file extends servable_item implements
    xsendfile_response
{

    /** @var stored_file $file The file to be proxied */

    /**
     * Constructor for the stored_file proxy.
     *
     * @param   string $component The component that this servable item belongs to
     * @param   context $context The context that this content belongs to
     * @param   filearea $filearea The filearea which generated the content
     *                   This is used to perform capability checks.
     * @param   stored_file $file
     */
    public function __construct(
        string $component,
        context $context,
        filearea $filearea,
        protected stored_file $file,
    ) {
        parent::__construct($component, $context, $filearea);
    }

    /**
     * Send the file proxy.
     *
     * @param   array $sendfileoptions he user-requested send_file options.
     *          Note: These may be overridden by the component as required.
     * @param   bool $forcedownload Whether the user-requested the file be downloaded.
     *          Note: The component may override this value as required.
     * @codeCoverageIgnore This method calls send_file which will die.
     * TODO Remove
     */
    public function send_file(array $sendfileoptions, bool $forcedownload): void {
        $this->send_headers();

        send_stored_file(
            $this->file,
            lifetime: $this->get_cache_time(),
            filter: $this->get_filter_value(),
            forcedownload: $this->get_force_download_value($forcedownload),
            options: $this->get_sendfile_options($sendfileoptions),
        );
    }

    public function get_response_stream(): StreamInterface {
        return $this->file->get_psr_stream();
    }

    public function get_xsendfile_path(): string {
        $filesystem = get_file_storage()->get_file_system();
        return $filesystem->get_local_path_from_storedfile($this->file);
    }

    public function can_accelerate(): bool {
        $fs = get_file_storage();
        return $fs->supports_xsendfile();
    }

    public function get_filename(): ?string {
        return $this->file->get_filename();
    }

    public function get_mimetype(): ?string {
        return $this->file->get_mimetype();
    }
}
