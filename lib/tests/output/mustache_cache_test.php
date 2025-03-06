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

namespace core\output;

/**
 * Tests for the mustache_cache class.
 *
 * @package    core
 * @category   test
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(mustache_cache::class)]
final class mustache_cache_test extends \advanced_testcase {
    /**
     * Ensure that false is returned when the template is not present in the cache.
     */
    public function test_not_present(): void {
        $cache = new mustache_cache();
        $this->assertFalse($cache->load('notpresent'));
    }

    /**
     * Ensure that the template is loaded from the cache when it is present.
     */
    public function test_present(): void {
        $cache = new mustache_cache();
        $cache->cache('present', '<?php debugging("hello world");');
        $this->assertTrue($cache->load('present'));

        $this->assertdebuggingcalledcount(2, [
            'hello world',
            'hello world',
        ]);
    }
}
