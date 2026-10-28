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

namespace core\test\phpunit;

/**
 * Test util extra features.
 *
 * @package    core
 * @category   test
 * @copyright  2015 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(phpunit_util::class)]
final class util_test extends \advanced_testcase {
    /**
     * Reset must not recreate file caches that dataroot cleanup already removed.
     */
    public function test_reset_dataroot_does_not_recreate_file_stores(): void {
        global $CFG;

        $this->resetAfterTest();
        $cache = \cache::make('core', 'roledefs');
        $cache->set('reset_purge', 'changed');
        $definitionpath = $CFG->cachedir . '/cachestore_file/default_application/core_roledefs';
        $this->assertDirectoryExists($definitionpath);

        phpunit_util::reset_dataroot();

        $this->assertDirectoryDoesNotExist($definitionpath);
        $this->assertFalse(\cache::make('core', 'roledefs')->get('reset_purge'));
    }

    /**
     * Custom file paths and ad-hoc caches still need to be purged.
     *
     * @param bool $internal Whether the custom path is inside the cache directory.
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('custom_cache_paths_provider')]
    public function test_reset_dataroot_purges_custom_and_adhoc_caches(bool $internal): void {
        $this->resetAfterTest();
        $custompath = $internal ? make_cache_directory('reset_custom') : sys_get_temp_dir() . '/moodle-reset-purge-' . uniqid();
        if (!$internal) {
            mkdir($custompath);
        }
        try {
            $config = \core_cache\factory::instance()->create_config_instance();
            $config->add_store_instance('reset_external', 'file', ['path' => $custompath, 'prescan' => true]);
            $config->phpunit_add_definition('phpunit/resetexternal', [
                'mode' => \core_cache\store::MODE_APPLICATION,
                'component' => 'phpunit',
                'area' => 'resetexternal',
            ], false);
            $config->phpunit_add_definition_mapping('phpunit/resetexternal', 'reset_external', 1);
            $cache = \cache::make('phpunit', 'resetexternal');
            $this->assertTrue($cache->set('test', 'changed'));
            $definitionpath = $custompath . '/phpunit_resetexternal';
            $this->assertNotEmpty(glob($definitionpath . '/*/*.cache'));
            $adhoc = \cache::make_from_params(\core_cache\store::MODE_SESSION, 'phpunit', 'resetadhoc');
            $this->assertTrue($adhoc->set('test', 'changed'));

            phpunit_util::reset_dataroot();

            if ($internal) {
                $this->assertDirectoryDoesNotExist($definitionpath);
            } else {
                $this->assertDirectoryExists($definitionpath);
            }
            $this->assertEmpty(glob($definitionpath . '/*/*.cache'));
            $this->assertFalse($adhoc->get('test'));
        } finally {
            if (is_dir($custompath)) {
                remove_dir($custompath);
            }
        }
    }

    /**
     * Custom paths can be deleted by dataroot cleanup or require a separate purge.
     *
     * @return array
     */
    public static function custom_cache_paths_provider(): array {
        return [
            'outside dataroot' => [false],
            'inside cachedir' => [true],
        ];
    }

    /**
     * A default file store outside dataroot must still be purged.
     */
    public function test_reset_dataroot_purges_external_cachedir(): void {
        global $CFG;

        $this->resetAfterTest();
        $originalcachedir = $CFG->cachedir;
        $externalpath = sys_get_temp_dir() . '/moodle-reset-purge-' . uniqid();
        mkdir($externalpath);
        try {
            $CFG->cachedir = $externalpath;
            \core_cache\factory::reset();
            $cache = \cache::make('core', 'roledefs');
            $this->assertTrue($cache->set('reset_purge', 'changed'));

            phpunit_util::reset_dataroot();

            $this->assertFalse(\cache::make('core', 'roledefs')->get('reset_purge'));
        } finally {
            $CFG->cachedir = $originalcachedir;
            \core_cache\factory::reset();
            remove_dir($externalpath);
        }
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('set_table_modified_by_sql_provider')]
    public function test_set_table_modified_by_sql($sql, $expectations): void {
        phpunit_util::reset_updated_table_list();
        phpunit_util::set_table_modified_by_sql($sql);
        foreach ($expectations as $table => $present) {
            $this->assertEquals($present, !empty(phpunit_util::$tableupdated[$table]));
        }
    }

    public static function set_table_modified_by_sql_provider(): array {
        global $DB;
        $prefix = $DB->get_prefix();

        return array(
            'Basic update' => array(
                'sql'           => "UPDATE {$prefix}user SET username = username || '_test'",
                'expectations'  => array(
                    'user'      => true,
                    'course'    => false,
                ),
            ),
            'Basic update with a fieldname sharing the same prefix' => array(
                'sql'           => "UPDATE {$prefix}user SET {$prefix}username = username || '_test'",
                'expectations'  => array(
                    'user'      => true,
                    'course'    => false,
                ),
            ),
            'Basic update with a table which contains the prefix' => array(
                'sql'           => "UPDATE {$prefix}user{$prefix} SET username = username || '_test'",
                'expectations'  => array(
                    "user{$prefix}" => true,
                    'course'        => false,
                ),
            ),
            'Update table with a numeric name' => array(
                'sql'           => "UPDATE {$prefix}example42 SET username = username || '_test'",
                'expectations'  => array(
                    'example42' => true,
                    'user'      => false,
                    'course'    => false,
                ),
            ),
            'Drop basic table' => array(
                'sql'           => "DROP TABLE {$prefix}user",
                'expectations'  => array(
                    'user'      => true,
                    'course'    => false,
                ),
            ),
            'Drop table with a numeric name' => array(
                'sql'           => "DROP TABLE {$prefix}example42",
                'expectations'  => array(
                    'example42' => true,
                    'user'      => false,
                    'course'    => false,
                ),
            ),
            'Insert in table' => array(
                'sql'           => "INSERT INTO {$prefix}user (username,password) VALUES ('moodle', 'test')",
                'expectations'  => array(
                    'user'      => true,
                    'course'    => false,
                ),
            ),
        );
    }
}
