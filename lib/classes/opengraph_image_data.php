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

use stdClass;

/**
 * OpenGraph Image Class.
 *
 * @package    core
 * @copyright  2022 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class opengraph_image_data {

    /** @var string The title of the image slide */
    protected $title;

    /** @var string The subtitle of the image slide */
    protected $subtitle;

    /** @var stdClass[] A list of data items */
    protected $data;

    /** @var string The path to the primary image */
    protected $primaryimagepath;

    public function __construct(
        string $title,
        string $subtitle
    ) {
        $this->title = $title;
        $this->subtitle = $subtitle;
    }

    public function set_primary_image_path(string $path): void {
        $this->primaryimagepath = $path;
    }

    public function add_data_point(
        string $iconname,
        string $value,
        string $label
    ): void {
        $this->data[] = (object) [
            'iconname' => $iconname,
            'value' => $value,
            'label' => $label,
        ];
    }

    public function get_data(): stdClass {
        return (object) [
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'primaryimage' => $this->primaryimage,
            'data' => $this->data,
        ];
    }

    public function get_title(): string {
        return $this->title;
    }

    public function has_subtitle(): bool {
        return !empty($this->subtitle);
    }

    public function get_subtitle(): string {
        return $this->subtitle;
    }

    public function has_primary_image(): bool {
        return !empty($this->primaryimagepath);
    }

    public function get_primary_image_path(): string {
        return $this->primaryimagepath;
    }
}
