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

use core\content\filearea;
use core\content\servable_item;
use core\context;
use GuzzleHttp\Psr7\Utils;
use Psr\Http\Message\StreamInterface;

/**
 * A servable item representing a file stored on the local disk.
 *
 * @package     core
 * @copyright   2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class servable_local_file extends servable_item {

    /** @var string The path to the file to be proxied */
    protected $filepath;

    /**
     * Constructor for the stored_file proxy.
     *
     * @param   string $component The component that this servable item belongs to
     * @param   context $context The context that this content belongs to
     * @param   filearea $filearea The filearea which generated the content
     *                   This is used to perform capability checks.
     * @param   stored_file $file
     */
    public function __construct(string $component, context $context, filearea $filearea, string $filepath) {
        parent::__construct($component, $context, $filearea);

        $this->filepath = $filepath;
    }

    public function get_response_stream(): StreamInterface {
        return Utils::streamFor(fopen($this->filepath, 'rb'));
    }

    public function get_filename(): ?string {
        return basename($this->filepath);
    }

    public function get_mimetype(): ?string {
        return null;
    }
}
