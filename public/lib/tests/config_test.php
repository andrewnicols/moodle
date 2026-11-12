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

defined('MOODLE_INTERNAL') || die();

/**
 * Unit tests for the core configuration class.
 *
 * @package    core
 * @category   test
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(config::class)]
final class config_test extends \advanced_testcase {
    /**
     * Test that object settings are loaded and directory defaults are calculated.
     */
    public function test_from_object_applies_directory_defaults(): void {
        $original = [
            'directorypermissions' => 0750,
            'wwwroot' => 'https://example.test/moodle',
            'customsetting' => 'custom value',
            'root' => '/incorrect/root',
            'dirroot' => '/incorrect/dirroot',
            'libdir' => '/incorrect/lib',
        ];

        $config = $this->create_config($original);

        $this->assertSame('https://example.test/moodle', $config->wwwroot);
        $this->assertSame('custom value', $config->customsetting);
        $this->assertSame(dirname(__DIR__, 2), $config->dirroot);
        $this->assertSame(dirname(dirname(__DIR__, 2)), $config->root);
        $this->assertSame($config->dirroot . '/lib', $config->libdir);
        $this->assertSame(0640, $config->filepermissions);
        $this->assertSame(0027, $config->umaskpermissions);
        $this->assertSame('/moodledata/temp', $config->tempdir);
        $this->assertSame('/moodledata/temp/backup', $config->backuptempdir);
        $this->assertSame('/moodledata/cache', $config->cachedir);
        $this->assertSame('/moodledata/localcache', $config->localcachedir);
        $this->assertSame('/moodledata/lang', $config->langotherroot);
        $this->assertSame('/moodledata/lang', $config->langlocalroot);
        $this->assertSame(12 * 60 * 60, $config->taskruntimewarn);
        $this->assertSame(24 * 60 * 60, $config->taskruntimeerror);
    }

    /**
     * Test that explicitly configured directory values are preserved.
     */
    public function test_from_object_preserves_directory_overrides(): void {
        $original = [
            'tempdir' => '/custom/temp',
            'backuptempdir' => '/custom/backup',
            'cachedir' => '/custom/cache',
            'localcachedir' => '/custom/localcache',
            'localrequestdir' => '/custom/request',
            'langotherroot' => '/custom/lang',
        ];

        $config = $this->create_config($original);

        $this->assertSame('/custom/temp', $config->tempdir);
        $this->assertSame('/custom/backup', $config->backuptempdir);
        $this->assertSame('/custom/cache', $config->cachedir);
        $this->assertSame('/custom/localcache', $config->localcachedir);
        $this->assertSame('/custom/request', $config->localrequestdir);
        $this->assertSame('/custom/lang', $config->langotherroot);
    }

    /**
     * Test that supported database types are normalized to lowercase.
     *
     * @param string $dbtype The configured database type.
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('supported_dbtype_provider')]
    public function test_dbtype_normalizes_supported_values(string $dbtype): void {
        $config = $this->create_config(['dbtype' => $dbtype]);

        $this->assertSame(strtolower($dbtype), $config->dbtype);
    }

    /**
     * Data provider for supported database types.
     *
     * @return array
     */
    public static function supported_dbtype_provider(): array {
        return [
            'PostgreSQL' => ['PgSQL'],
            'MySQL' => ['MySQLi'],
            'MariaDB' => ['MariaDB'],
            'SQL Server' => ['SQLSRV'],
            'Aurora' => ['AuroraMySQL'],
        ];
    }

    /**
     * Test that path validation canonicalizes the data directory.
     */
    public function test_validate_paths_canonicalizes_dataroot(): void {
        $this->resetAfterTest();
        $dataroot = make_request_directory();
        $original = [
            'dataroot' => $dataroot . '/..' . DIRECTORY_SEPARATOR . basename($dataroot),
            'wwwroot' => 'https://example.test/moodle',
        ];
        $config = $this->create_config($original);

        $_SERVER['REMOTE_ADDR'] = '127.0.0.1';
        $config->validate_paths();

        $this->assertSame(realpath($dataroot), $config->dataroot);
    }
}
