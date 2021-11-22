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

use context;

/**
 * A generic tree structure supporting collapsing, lazy loading, and more.
 *
 * @package   core
 * @copyright 2021 Andrew Lyons <andrew@nicols.co.uk>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class file_tree extends tree {
    /** @var context The context to show */
    protected $context;

    /** @var string The component to show */
    protected $component;

    /** @var string The filearea to show */
    protected $filearea;

    /** @var int The itemid to show */
    protected $itemid;

    /** @var string $filepath The filepath to restrict results to */
    protected $filepath;

    /** @var string The sort field to use when fetching the tree content */
    protected $sortby = 'filepath, filename';

    public function __construct(
        context $context,
        string $component,
        string $filearea,
        int $itemid,
        string $filepath = '/'
    ) {
        $this->context = $context;
        $this->component = $component;
        $this->filearea = $filearea;
        $this->itemid = $itemid;
        $this->filepath = $filepath;

        $this->load_tree();

        parent::__construct();
    }

    protected function load_tree(): void {
        $fs = get_file_storage();

        // Fetch the files in this directory.
        // Do not recurse.
        $files = $fs->get_directory_files(
            $this->context->id,
            $this->component,
            $this->filearea,
            $this->itemid,
            $this->filepath,
            false,
            true,
            $this->sortby
        );

        foreach ($files as $file) {
            $filenode = file_tree_node::from_stored_file($file);
            $this->add_node($filenode);
        }
    }

    /**
     * Add a new node to this tree at the end of the list.
     *
     * @param tree_node $newnode
     */
    public function add_node(tree_node $newnode): void {
        parent::add_node($newnode);
    }
}
