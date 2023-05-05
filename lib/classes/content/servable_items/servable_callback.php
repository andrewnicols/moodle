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

use Closure;
use core\content\filearea;
use core\content\servable_item;
use core\context;
use GuzzleHttp\Psr7\Utils;
use Psr\Http\Message\StreamInterface;

/**
 * Servable content item where content is returned from a callback.
 *
 * @package     core
 * @copyright   2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class servable_callback extends servable_item {

    /** @var Closure $callback The callable which generates the content */
    /** @var string $filename The name of the file to suggest with the file download */

    /**
     * Constructor for the stored_file proxy.
     *
     * @param   string $component The component that this servable item belongs to
     * @param   context $context The context that this content belongs to
     * @param   filearea $filearea The filearea which generated the content
     *                   This is used to perform capability checks.
     * @param   callable $callback The callback which generates the content
     * @param   null|string $filename The name of the file to suggest with the file download
     */
    public function __construct(
        string $component,
        context $context,
        filearea $filearea,
        protected Closure $callback,
        protected ?string $filename = null,
    ) {
        parent::__construct($component, $context, $filearea);

        $this->callback = $callback;
        $this->filename = $filename;
    }

    public function get_response_stream(): StreamInterface {
        return Utils::streamFor(function ($size) {
            static $complete = false;

            if ($complete) {
                return false;
            }
            $complete = true;
            return call_user_func($this->callback);
        });
    }

    public function get_filename(): ?string {
        return $this->filename;
    }

    public function get_mimetype(): ?string {
        return null;
    }
}
