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

namespace qbank_managecategories\output;

use cm_info;
use core\context\module;
use core\output\renderer_base;
use core\output\renderable;
use core\output\templatable;
use qbank_managecategories\question_categories;
use stdClass;

/**
 * Data structure for the "move category" UI
 *
 * @package   qbank_managecategories
 * @copyright 2025 onwards Catalyst IT EU {@link https://catalyst-eu.net}
 * @author    Mark Johnson <mark.johnson@catalyst-eu.net>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class move_context_list implements renderable, templatable {
    /**
     * Constructor.
     *
     * @param question_categories $categories The categories to render move targets for.
     * @param int $movingcategoryid The ID of the category being moved. This doesn't have to exist in $categories, as it may be
     *     from a different question bank.
     * @param cm_info $cm The course module for the qbank we are getting targets for.
     * @param module $context The context of the course module.
     */
    public function __construct(
        /** @var question_categories The categories to render move targets for. */
        protected question_categories $categories,
        /**
         * @var int The ID of the category being moved. This doesn't have to exist in $categories, as it may be
         * from a different question bank.
         */
        protected int $movingcategoryid,
        /** @var cm_info The course module for the qbank we are getting targets for. */
        protected cm_info $cm,
        /** @var module The context of the course module. */
        protected module $context,
    ) {
    }

    /**
     * Given a list of categories, recursively build a tree of valid move targets.
     *
     * Each category can have a category moved before it.
     * If the category is the last child of its parent, it can also have a category moved after it.
     * If a category has no children yet, a category can be moved to be a child of that category.
     * If a category has children of its own, the same applies to each of its children.
     *
     * @param stdClass[] $categories Tree of categories, each with an id, parent, name and optionally an array of children.
     * @param int $movingcategoryid The ID of the category we are moving.
     * @return stdClass[] Tree of valid move targets.
     */
    protected function build_move_tree(array $categories, int $movingcategoryid): array {
        $movetree = [];
        $precedingsibling = null;
        foreach ($categories as $category) {
            if ($category->id == $movingcategoryid) {
                // Don't return any targets for the category we are moving.
                continue;
            }
            // Add a "before this category" target for each category.
            $child = (object) [
                'categoryid' => (int) $category->id,
                'movingcategoryid' => $movingcategoryid,
                'precedingsiblingid' => $precedingsibling ? (int) $precedingsibling->id : 0,
                'parent' => (int) $category->parent,
                'categoryname' => $category->name,
                'categories' => [],
            ];
            if (!empty($category->children)) {
                // If this category already has children, build a sub-tree of targets for those.
                $child->categories = $this->build_move_tree($category->children, $movingcategoryid);
            } else {
                // If the category doesn't have children yet, add a "newchild" target to allow the moving category to be moved
                // under this one.
                $child->categories = [
                    (object) [
                        'movingcategoryid' => $movingcategoryid,
                        'precedingsiblingid' => 0,
                        'parent' => (int) $category->id,
                        'categoryname' => $category->name,
                        'categories' => [],
                        'newchild' => true,
                    ],
                ];
            }
            $movetree[] = $child;
            $precedingsibling = $category;
        }
        // If there were child categories, add a final "lastchild" target to put the moving category at the bottom of the parent.
        if ($precedingsibling) {
            $movetree[] = (object) [
                'movingcategoryid' => $movingcategoryid,
                'precedingsiblingid' => (int) $precedingsibling->id,
                'parent' => (int) $precedingsibling->parent,
                'categoryname' => $precedingsibling->name,
                'categories' => [],
                'lastchild' => true,
            ];
        }
        return $movetree;
    }

    #[\Override]
    public function export_for_template(renderer_base $output): array {
        return [
            'contextname' => $this->categories->editlist->context->get_context_name(),
            'contextid' => $this->context->id,
            'categories' => $this->build_move_tree($this->categories->editlist->items, $this->movingcategoryid),
            'cmid' => $this->cm->id,
        ];
    }
}
