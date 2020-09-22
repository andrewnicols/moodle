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

/**
 * Unit tests for core\content\servable_item class.
 *
 * @package     core
 * @category    test
 * @copyright   2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @coversDefaultClass \core\content\servable_item
 * @covers ::__construct
 */
class servable_item_test extends \advanced_testcase {

    protected function get_filearea_mock(
        array $methods = [],
    ): filearea {
        $mock = $this->getMockBuilder(filearea::class);
        $methods[] = 'can_user_access_content_from_context';
        $mock->onlyMethods($methods);

        return $mock->getMock();
    }

    protected function get_servable_item_mock(filearea $filearea): servable_item {
        $mock = $this->getMockBuilder(servable_item::class)
            ->setConstructorArgs([
                'core',
                \core\context\system::instance(),
                $filearea,
            ])
            ->onlyMethods([
                'send_file',
            ])
            ->getMock();

        return $mock;
    }

    /**
     * @covers ::call_require_login_if_needed
     * @covers ::meets_login_requirements
     */
    public function test_meets_login_requirements(): void {
        $filearea = $this->get_filearea_mock();
        $mock = $this->get_servable_item_mock($filearea);

        $this->assertFalse($filearea->requires_login($mock));
        // The default is to not require login.
        $this->assertTrue($mock->meets_login_requirements());
    }

    /**
     * @covers ::call_require_login_if_needed
     * @covers ::meets_login_requirements
     */
    public function test_site_rmeets_login_requirements(): void {
        $filearea = $this->get_filearea_mock([
            'requires_login',
            'get_require_login_params',
        ]);
        $filearea
            ->method('requires_login')
            ->willReturn(true);
        $filearea
            ->method('get_require_login_params')
            ->willReturn([
            ]);

        $mock = $this->get_servable_item_mock($filearea);

        $this->assertTrue($filearea->requires_login($mock));
        $this->assertFalse($filearea->requires_course_login($mock));
        $this->assertFalse($mock->meets_login_requirements());
    }

    /**
     * @covers ::call_require_login_if_needed
     * @covers ::meets_login_requirements
     */
    public function test_course_rmeets_login_requirements(): void {
        $this->resetAfterTest(true);
        $course = $this->getDataGenerator()->create_course();

        $filearea = $this->get_filearea_mock([
            'get_require_course_login_params',
        ]);
        $filearea
            ->method('get_require_course_login_params')
            ->willReturn([
                $course->id,
            ]);

        $mock = $this->get_servable_item_mock($filearea);

        $this->assertFalse($filearea->requires_login($mock));
        $this->assertTrue($filearea->requires_course_login($mock));
        $this->assertFalse($mock->meets_login_requirements());
    }

    /**
     * @covers ::get_sendfile_options
     * @covers ::set_sendfile_options
     * @covers ::set_sendfile_option
     */
    public function test_get_sendfile_options(): void {
        $filearea = $this->get_filearea_mock();
        $mock = $this->get_servable_item_mock($filearea);
        $mock->set_sendfile_options([
            'filename' => 'test.txt',
            'disposition' => 'inline',
        ]);

        // Return the set options by default.
        $this->assertSame([
            'filename' => 'test.txt',
            'disposition' => 'inline',
        ], $mock->get_sendfile_options([]));

        // Options passed into the get_sendfile_options() are overriden by those set in the method.
        $this->assertSame([
            'somethingelse' => 'value',
            'disposition' => 'inline',
            'filename' => 'test.txt',
        ], $mock->get_sendfile_options([
            'somethingelse' => 'value',
            'disposition' => 'attachment',
        ]));
    }

    /**
     * @covers ::get_force_download_value
     * @covers ::set_force_download
     */
    public function test_force_download(): void {
        $filearea = $this->get_filearea_mock();
        $mock = $this->get_servable_item_mock($filearea);

        // If no value is set in the setter, then the default value specified in the getter is returned.
        $this->assertTrue($mock->get_force_download_value(true));
        $this->assertFalse($mock->get_force_download_value(false));

        // If a value is specified in the setter, it will instead be returned.
        $mock->set_force_download(false);
        $this->assertFalse($mock->get_force_download_value(true));
        $this->assertFalse($mock->get_force_download_value(false));

        $mock->set_force_download(true);
        $this->assertTrue($mock->get_force_download_value(true));
        $this->assertTrue($mock->get_force_download_value(false));

        // Unsetting the force_download value resets to fetching the default from the getter.
        $mock->set_force_download(null);
        $this->assertTrue($mock->get_force_download_value(true));
        $this->assertFalse($mock->get_force_download_value(false));
    }

    /**
     * @covers ::add_headers
     * @covers ::add_header
     * @covers ::get_headers
     * @covers ::send_headers
     * @runInSeparateProcess
     */
    public function test_headers(): void {
        $filearea = $this->get_filearea_mock();
        $mock = $this->get_servable_item_mock($filearea);
        $rc = new \ReflectionObject($mock);

        $mock->add_headers([
            'some' => 'thing',
            'another' => 'header',
        ]);

        // It isn't possible to capture the sent headers, but we can at least make sure that there aren't any failures.
        $rcm = $rc->getMethod('send_headers');
        $rcm->setAccessible(true);
        $rcm->invoke($mock);
        $headers = headers_list();

        $rcm = $rc->getMethod('get_headers');
        $this->assertSame([
            'some: thing',
            'another: header',
        ], $rcm->invoke($mock));
    }

    /**
     * @covers ::get_component
     * @covers ::get_context
     * @covers ::get_filearea
     */
    public function test_getters(): void {
        $admin = get_admin();
        $context = \context_user::instance($admin->id);

        $filearea = $this->get_filearea_mock();
        $mock = $this->getMockBuilder(servable_item::class)
            ->setConstructorArgs([
                'some_component',
                $context,
                $filearea,
            ])
            ->onlyMethods([
                'send_file',
            ])
            ->getMock();
        $this->assertEquals('some_component', $mock->get_component());
        $this->assertEquals($context, $mock->get_context());
        $this->assertEquals($filearea, $mock->get_filearea());
    }

    /**
     * @covers ::get_cache_time
     * @covers ::set_cache_time
     */
    public function test_cache_time(): void {
        $filearea = $this->get_filearea_mock();
        $mock = $this->get_servable_item_mock($filearea);

        // The default is 10 minutes.
        $this->assertEquals(10 * MINSECS, $mock->get_cache_time());

        $mock->set_cache_time(99);
        $this->assertEquals   (99, $mock->get_cache_time());
    }

    /**
     * @covers ::get_filter_value
     * @covers ::set_filter_value
     */
    public function test_filter_value(): void {
        $filearea = $this->get_filearea_mock();
        $mock = $this->get_servable_item_mock($filearea);

        // The default is 10 minutes.
        $this->assertEquals(servable_item::FILTER_NONE, $mock->get_filter_value());

        $mock->set_filter_value(servable_item::FILTER_ONLY_HTML);
        $this->assertEquals(servable_item::FILTER_ONLY_HTML, $mock->get_filter_value());
    }
}
