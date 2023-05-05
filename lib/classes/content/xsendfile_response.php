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

use Psr\Http\Message\MessageInterface;

/**
 * A servable item which is capable of sending an xsendfile response.
 *
 * @package core\content
 */
interface xsendfile_response {
    /**
     * Get the path to the file on disk for the file
     *
     * @return string
     */
    public function get_xsendfile_path(): string;

    /**
     * Whether this servable item can be sent using xsendfile.
     *
     * Note: This boils down to various settings and configuration, not code.
     *
     * @return bool
     */
    public function can_accelerate(): bool;
}
