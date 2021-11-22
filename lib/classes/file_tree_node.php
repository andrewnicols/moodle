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

declare(strict_types=1);

namespace core;

use moodle_url;
use stdClass;
use stored_file;

/**
 * A generic tree node.
 *
 * @package   core
 * @copyright 2021 Andrew Lyons <andrew@nicols.co.uk>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class file_tree_node extends tree_node {
    public function __construct(\stored_file $file) {
        $this->file = $file;

        if ($file->is_directory()) {
            $value = $file->get_directory_name();
        } else {
            $value = $file->get_filename();
        }

        parent::__construct($file->get_id(), $value);
    }

    public function has_link(): bool {
        if ($this->file->is_directory()) {
            return false;
        }

        return true;
    }

    public function get_link(): moodle_url {
        // TODO Determine the endpoint to use:
        // - pluginfile
        // - draftfile
        // TODO Determine forcedownload
        // TODO Determine includetoken
        $file = $this->file;
        return moodle_url::make_pluginfile_url(
            $file->get_contextid(),
            $file->get_component(),
            $file->get_filearea(),
            $file->get_itemid(),
            $file->get_filepath(),
            $file->get_filename()
        );
    }

    public function get_icon(): ?stdClass {
        $result = (object) [
            'identifier' => null,
            'component' => 'core',
            'label' => null,
        ];

        if ($this->file->is_directory()) {
            $result->identifier = file_folder_icon();
        } else {
            $result->identifier = file_file_icon($this->file);
        }

        return $result;
    }

    public static function from_stored_file(\stored_file $file): self {
        $node = new self($file);

        if ($file->is_directory()) {
            $tree = new file_tree(
                \context::instance_by_id($file->get_contextid()),
                $file->get_component(),
                $file->get_filearea(),
                (int) $file->get_itemid(),
                $file->get_filepath()
            );
            $node->set_child_tree($tree);
        }

        return $node;
    }
}
