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

use Rector\Config\RectorConfig;
use Rector\Renaming\Rector\Name\RenameClassRector;
use Rector\Php80\Rector\Class_\AnnotationToAttributeRector;
use Rector\Php80\ValueObject\AnnotationToAttribute;
use Rector\PHPUnit\AnnotationsToAttributes\Rector\Class_\AnnotationWithValueToAttributeRector;
use Rector\PHPUnit\AnnotationsToAttributes\Rector\Class_\CoversAnnotationWithValueToAttributeRector;
use Rector\PHPUnit\AnnotationsToAttributes\Rector\ClassMethod\DataProviderAnnotationToAttributeRector;
use Rector\PHPUnit\AnnotationsToAttributes\Rector\ClassMethod\DependsAnnotationWithValueToAttributeRector;
use Rector\PHPUnit\PHPUnit100\Rector\Class_\PublicDataProviderClassMethodRector;
use Rector\PHPUnit\PHPUnit100\Rector\Class_\StaticDataProviderClassMethodRector;
use Rector\PHPUnit\ValueObject\AnnotationWithValueToAttribute;

// Load the ignore list.
$ignorefile = __DIR__ . '/.rector/ignore.php';
if (!file_exists($ignorefile)) {
    throw new \RuntimeException(
        'The ignore file does not exist. Please generate it using `npx grunt ignorfiles`.',
    );
}

require_once(__DIR__ . '/.rector/ignore.php');

return RectorConfig::configure()
    ->withParallel()
    ->withBootstrapFiles([
        __DIR__ . '/.rector/bootstrap.php',
    ])
    ->withPaths([
        __DIR__,
    ])
    ->withRootFiles()
    ->withSkip([
        __DIR__ . '/coverage',
        __DIR__ . '/.git',
        __DIR__ . '/.rector',
        ...$exclude,
    ])
    ->withAttributesSets(phpunit: true)

    // Configure various rules for PHPUnit 10 updates which are not covered by the PHPUnit Sets.
    ->withRules([
        // Ensure that all data providers are public and static.
        PublicDataProviderClassMethodRector::class,
        StaticDataProviderClassMethodRector::class,
    ])
    ->withConfiguredRule(AnnotationToAttributeRector::class, [
        // Convert @runClassInSeparateProcess annotation to attribute.
        new AnnotationToAttribute('runClassInSeparateProcess', 'PHPUnit\Framework\Attributes\RunClassInSeparateProcess'),
    ])

// ->withConfiguredRule(
//     RenameClassRector::class,
    //     \bootstrap_renderer::class => \core\output\bootstrap_renderer::class,
    //     \coding_exception::class => \core\exception\coding_exception::class,
    //     \file_serving_exception::class => \core\exception\file_serving_exception::class,
    //     \invalid_dataroot_permissions::class => \core\exception\invalid_dataroot_permissions::class,
    //     \invalid_parameter_exception::class => \core\exception\invalid_parameter_exception::class,
    //     \invalid_response_exception::class => \core\exception\invalid_response_exception::class,
    //     \invalid_state_exception::class => \core\exception\invalid_state_exception::class,
    //     \moodle_exception::class => \core\exception\moodle_exception::class,
    //     \require_login_exception::class => \core\exception\require_login_exception::class,
    //     \require_login_session_timeout_exception::class => \core\exception\require_login_session_timeout_exception::class,
    //     \required_capability_exception::class => \core\exception\required_capability_exception::class,
    //     \webservice_parameter_exception::class => \core\exception\webservice_parameter_exception::class,
    // )

    // ->withSkip([
    //     RenameClassRector::class => [
    //         __DIR__ . '/lib/classes/exception',
    //         __DIR__ . '/lib/classes/output/bootstrap_renderer.php',
    //     ],
    //     ...$exclude,
    // ])

    ;
