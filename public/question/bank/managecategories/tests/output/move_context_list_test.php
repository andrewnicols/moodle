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

use core\context\module;
use core\output\core_renderer;
use core\url;
use qbank_managecategories\manage_category_test_base;
use qbank_managecategories\question_categories;

defined('MOODLE_INTERNAL') || die();

require_once(__DIR__ . '/../manage_category_test_base.php');

/**
 * Unit tests for move_context_list
 *
 * @package   qbank_managecategories
 * @copyright 2025 onwards Catalyst IT EU {@link https://catalyst-eu.net}
 * @author    Mark Johnson <mark.johnson@catalyst-eu.net>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers \qbank_managecategories\output\move_context_list
 */
final class move_context_list_test extends manage_category_test_base {
    /**
     * Correctly produce a tree of valid move targets for categories in a context.
     *
     * This test ensures that `move_context_list` correctly converts the data from a `question_categories` object
     * into a structure to be rendered by the `move_context_list` template.
     *
     * Given a category structure like this:
     *
     * - Top
     *   - Default category
     *   - Parent 1
     *   - Parent 2
     *     - Child 1
     *     - Child 2
     *       - Grandchild 1
     *       - Grandchild 2
     *     - Child 3
     *   - Parent 3
     *
     * A `move_context_list` for moving "Parent 1" should return data to render the following tree of targets, with the appropriate
     * data attached to pass to a `qbank_managecategories_move_category` web service call.
     *
     * - Before Default category
     *   - As new child of Default category (newchild: true)
     * - Before Parent 2
     *   - Before Child 1
     *     - As new child of Child 1 (newchild: true)
     *   - Before Child 2
     *     - Before Grandchild 1
     *       - As new child of Grandchild 1 (newchild: true)
     *     - Before Grandchild 2
     *       - As new child of Grandchild 2 (newchild: true)
     *     - After Grandchild 2 (lastchild: true)
     *   - Before Child 3
     *     - As new child of Child 3 (newchild: true)
     *   - After Child 3 (lastchild: true)
     * - Before Parent 3
     *   - As new child of Parent 3 (newchild: true)
     * - After Parent 3 (lastchild: true)
     *
     * @return void
     */
    public function test_export_for_template(): void {
        global $PAGE;
        $this->resetAfterTest();
        $course = $this->create_course();
        $qbank = $this->create_qbank($course);
        $context = module::instance($qbank->cmid);
        $topcat = question_get_top_category($context->id);
        $defaultcat = question_get_default_category($context->id);
        $parent1 = $this->create_question_category_for_a_qbank($qbank, ['parent' => $topcat->id, 'name' => 'Parent 1']);
        $parent2 = $this->create_question_category_for_a_qbank($qbank, ['parent' => $topcat->id, 'name' => 'Parent 2']);
        $child1 = $this->create_question_category_for_a_qbank($qbank, ['parent' => $parent2->id, 'name' => 'Child 1']);
        $child2 = $this->create_question_category_for_a_qbank($qbank, ['parent' => $parent2->id, 'name' => 'Child 1']);
        $grandchild1 = $this->create_question_category_for_a_qbank($qbank, ['parent' => $child2->id, 'name' => 'Grandchild 1']);
        $grandchild2 = $this->create_question_category_for_a_qbank($qbank, ['parent' => $child2->id, 'name' => 'Grandchild 2']);
        $child3 = $this->create_question_category_for_a_qbank($qbank, ['parent' => $parent2->id, 'name' => 'Child 1']);
        $parent3 = $this->create_question_category_for_a_qbank($qbank, ['parent' => $topcat->id, 'name' => 'Parent 3']);

        $expectedstructure = [
            (object) [
                'categoryid' => (int) $defaultcat->id,
                'movingcategoryid' => (int) $parent1->id,
                'precedingsiblingid' => 0,
                'parent' => (int) $topcat->id,
                'categoryname' => $defaultcat->name,
                'categories' => [
                    (object) [
                        'movingcategoryid' => (int) $parent1->id,
                        'precedingsiblingid' => 0,
                        'parent' => (int) $defaultcat->id,
                        'categoryname' => $defaultcat->name,
                        'categories' => [],
                        'newchild' => true,
                    ],
                ],
            ],
            // No entries for Parent 1, as we are moving it, and we can't move it before or within itself.
            (object) [
                'categoryid' => (int) $parent2->id,
                'movingcategoryid' => (int) $parent1->id,
                // Subtle detail here. Moving parent 1 to "before parent 2" is essentially putting it back in the same place.
                // This means the preceding sibling is the Default category because otherwise we would be trying to put parent 1
                // after itself.
                'precedingsiblingid' => (int) $defaultcat->id,
                'parent' => (int) $topcat->id,
                'categoryname' => $parent2->name,
                'categories' => [
                    (object) [
                        'categoryid' => (int) $child1->id,
                        'movingcategoryid' => (int) $parent1->id,
                        'precedingsiblingid' => 0,
                        'parent' => (int) $parent2->id,
                        'categoryname' => $child1->name,
                        'categories' => [
                            (object) [
                                'movingcategoryid' => (int) $parent1->id,
                                'precedingsiblingid' => 0,
                                'parent' => (int) $child1->id,
                                'categoryname' => $child1->name,
                                'categories' => [],
                                'newchild' => true,
                            ],
                        ],
                    ],
                    (object) [
                        'categoryid' => (int) $child2->id,
                        'movingcategoryid' => (int) $parent1->id,
                        'precedingsiblingid' => (int) $child1->id,
                        'parent' => (int) $parent2->id,
                        'categoryname' => $child2->name,
                        'categories' => [
                            (object) [
                                'categoryid' => (int) $grandchild1->id,
                                'movingcategoryid' => (int) $parent1->id,
                                'precedingsiblingid' => 0,
                                'parent' => (int) $child2->id,
                                'categoryname' => $grandchild1->name,
                                'categories' => [
                                    (object) [
                                        'movingcategoryid' => (int) $parent1->id,
                                        'precedingsiblingid' => 0,
                                        'parent' => (int) $grandchild1->id,
                                        'categoryname' => $grandchild1->name,
                                        'categories' => [],
                                        'newchild' => true,
                                    ],
                                ],
                            ],
                            (object) [
                                'categoryid' => (int) $grandchild2->id,
                                'movingcategoryid' => (int) $parent1->id,
                                'precedingsiblingid' => $grandchild1->id,
                                'parent' => (int) $child2->id,
                                'categoryname' => $grandchild2->name,
                                'categories' => [
                                    (object) [
                                        'movingcategoryid' => (int) $parent1->id,
                                        'precedingsiblingid' => 0,
                                        'parent' => (int) $grandchild2->id,
                                        'categoryname' => $grandchild2->name,
                                        'categories' => [],
                                        'newchild' => true,
                                    ],
                                ],
                            ],
                            (object) [
                                'movingcategoryid' => (int) $parent1->id,
                                'precedingsiblingid' => (int) $grandchild2->id,
                                'parent' => (int) $child2->id,
                                'categoryname' => $grandchild2->name,
                                'categories' => [],
                                'lastchild' => true,
                            ],
                        ],
                    ],
                    (object) [
                        'categoryid' => (int) $child3->id,
                        'movingcategoryid' => (int) $parent1->id,
                        'precedingsiblingid' => (int) $child2->id,
                        'parent' => (int) $parent2->id,
                        'categoryname' => $child3->name,
                        'categories' => [
                            (object) [
                                'movingcategoryid' => (int) $parent1->id,
                                'precedingsiblingid' => 0,
                                'parent' => (int) $child3->id,
                                'categoryname' => $child3->name,
                                'categories' => [],
                                'newchild' => true,
                            ],
                        ],
                    ],
                    (object) [
                        'movingcategoryid' => (int) $parent1->id,
                        'precedingsiblingid' => $child3->id,
                        'parent' => (int) $parent2->id,
                        'categoryname' => $child3->name,
                        'categories' => [],
                        'lastchild' => true,
                    ],
                ],
            ],
            (object) [
                'categoryid' => (int) $parent3->id,
                'movingcategoryid' => (int) $parent1->id,
                'precedingsiblingid' => (int) $parent2->id,
                'parent' => (int) $topcat->id,
                'categoryname' => $parent3->name,
                'categories' => [
                    (object) [
                        'movingcategoryid' => (int) $parent1->id,
                        'precedingsiblingid' => 0,
                        'parent' => (int) $parent3->id,
                        'categoryname' => $parent3->name,
                        'categories' => [],
                        'newchild' => true,
                    ],
                ],
            ],
            (object) [
                'movingcategoryid' => (int) $parent1->id,
                'precedingsiblingid' => (int) $parent3->id,
                'parent' => (int) $topcat->id,
                'categoryname' => $parent3->name,
                'categories' => [],
                'lastchild' => true,
            ],
        ];

        $categories = new question_categories(new url('/'), cmid: $qbank->cmid);

        $cm = get_fast_modinfo($course->id)->get_cm($qbank->cmid);

        $movecontextlist = new move_context_list($categories, $parent1->id, $cm, $context);
        $output = new core_renderer($PAGE, RENDERER_TARGET_GENERAL);
        $export = $movecontextlist->export_for_template($output);

        $this->assertEquals($context->id, $export['contextid']);
        $this->assertEquals($expectedstructure, $export['categories']);
    }
}
