<?php
// This file is part of Moodle - https://moodle.org/
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
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

namespace core;

use core\context\module as context_module;
use core\context_helper;

/**
 * Unit tests for base context class.
 *
 * NOTE: more tests are in lib/tests/accesslib_test.php
 *
 * @package   core
 * @copyright Petr Skoda
 * @license   https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(context::class)]
final class context_test extends \advanced_testcase {
    /**
     * Tests legacy class name.
     */
    #[\PHPUnit\Framework\Attributes\CoversNothing]
    public function test_legacy_classname(): void {
        $this->assertSame('core\context', context::class);

        $context = \context_system::instance();
        $this->assertInstanceOf(context::class, $context);
        $this->assertInstanceOf('context', $context);
    }

    /**
     * Tests covered method.
     */
    public function test_factory_methods(): void {
        $context = context::instance_by_id(SYSCONTEXTID);
        $this->assertSame('core\\context\\system', get_class($context));
    }

    public function test_propery_change_protection(): void {
        $context = context\system::instance();

        $context->contextlevel = -10;
        $this->assertEquals($context::LEVEL, $context->contextlevel);
        $this->assertDebuggingCalled('Can not change context instance properties!');

        $context->instanceid = -10;
        $this->assertEquals(0, $context->instanceid);
        $this->assertDebuggingCalled('Can not change context instance properties!');

        $context->id = -10;
        $this->assertDebuggingCalled('Can not change context instance properties!');

        $context->locked = -10;
        $this->assertDebuggingCalled('Can not change context instance properties!');

        unset($context->contextlevel);
        $this->assertEquals($context::LEVEL, $context->contextlevel);
        $this->assertDebuggingCalled('Can not unset context instance properties!');
    }

    /**
     * Tests covered method.
     */
    public function test_incorrect_property(): void {
        $context = context\system::instance();

        $a = $context->whatever;
        $this->assertDebuggingCalled('Invalid context property accessed! whatever');
    }

    /**
     * Tests covered method.
     */
    public function test_iterator(): void {
        $context = context\system::instance();
        $array = iterator_to_array($context->getIterator());
        $expected = [
            'id' => $context->id,
            'contextlevel' => $context->contextlevel,
            'instanceid' => $context->instanceid,
            'path' => $context->path,
            'depth' => $context->depth,
            'locked' => false,
        ];
        $this->assertSame($expected, $array);
    }

    /**
     * Ensure that the get_parent_contexts() function limits the number of queries it performs.
     */
    public function test_get_parent_contexts_preload(): void {
        global $DB;

        $this->resetAfterTest();

        /*
         * Given the following data structure:
         * System
         * - Category
         * --- Category
         * ----- Category
         * ------- Category
         * --------- Course
         * ----------- Activity (Forum)
         */

        $contexts = [];

        $cat1 = $this->getDataGenerator()->create_category();
        $cat2 = $this->getDataGenerator()->create_category(['parent' => $cat1->id]);
        $cat3 = $this->getDataGenerator()->create_category(['parent' => $cat2->id]);
        $cat4 = $this->getDataGenerator()->create_category(['parent' => $cat3->id]);
        $course = $this->getDataGenerator()->create_course(['category' => $cat4->id]);
        $forum = $this->getDataGenerator()->create_module('forum', ['course' => $course->id]);

        $modcontext = context_module::instance($forum->cmid);

        context_helper::reset_caches();

        // There should only be a single DB query.
        $predbqueries = $DB->perf_get_reads();

        $parents = $modcontext->get_parent_contexts();
        // Note: For some databases There is one read, plus one FETCH, plus one CLOSE.
        // These all show as reads, when there has actually only been a single query.
        $this->assertLessThanOrEqual(3, $DB->perf_get_reads() - $predbqueries);
    }
}
