<?php

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

require_once(__DIR__ . '/.rector/ignore.php');

return RectorConfig::configure()
    ->withParallel()
    ->withBootstrapFiles([
        __DIR__ . '/.rector/bootstrap.php',
    ])
    ->withPaths([
        __DIR__ . '/admin',
        __DIR__ . '/ai',
        __DIR__ . '/analytics',
        __DIR__ . '/auth',
        __DIR__ . '/availability',
        __DIR__ . '/backup',
        __DIR__ . '/badges',
        __DIR__ . '/blocks',
        __DIR__ . '/blog',
        __DIR__ . '/cache',
        __DIR__ . '/calendar',
        __DIR__ . '/cohort',
        __DIR__ . '/comment',
        __DIR__ . '/communication',
        __DIR__ . '/competency',
        __DIR__ . '/completion',
        __DIR__ . '/contentbank',
        __DIR__ . '/course',
        __DIR__ . '/customfield',
        __DIR__ . '/dataformat',
        __DIR__ . '/enrol',
        __DIR__ . '/error',
        __DIR__ . '/favourites',
        __DIR__ . '/files',
        __DIR__ . '/filter',
        __DIR__ . '/group',
        __DIR__ . '/grade',
        __DIR__ . '/h5p',
        __DIR__ . '/install',
        __DIR__ . '/iplookup',
        __DIR__ . '/lang',
        __DIR__ . '/lib',
        __DIR__ . '/local',
        __DIR__ . '/login',
        __DIR__ . '/media',
        __DIR__ . '/message',
        __DIR__ . '/mnet',
        __DIR__ . '/mod',
        __DIR__ . '/moodlenet',
        __DIR__ . '/my',
        __DIR__ . '/notes',
        __DIR__ . '/payment',
        __DIR__ . '/plagiarism',
        __DIR__ . '/portfolio',
        __DIR__ . '/privacy',
        __DIR__ . '/question',
        __DIR__ . '/rating',
        __DIR__ . '/report',
        __DIR__ . '/reportbuilder',
        __DIR__ . '/repository',
        __DIR__ . '/rss',
        __DIR__ . '/search',
        __DIR__ . '/sms',
        __DIR__ . '/tag',
        __DIR__ . '/theme',
        __DIR__ . '/user',
        __DIR__ . '/userpix',
        __DIR__ . '/webservice',
    ])

    ->withRules([
        // Update the @covers annotation to use the new Attribute.
        CoversAnnotationWithValueToAttributeRector::class,

        // Update the @dataProvider annotation to use the new Attribute.
        DataProviderAnnotationToAttributeRector::class,

        // Ensure that all data providers are public and static.
        PublicDataProviderClassMethodRector::class,
        StaticDataProviderClassMethodRector::class,

        // Update the @depends annotation to use the new Attribute.
        DependsAnnotationWithValueToAttributeRector::class,
    ])
    ->withConfiguredRule(AnnotationWithValueToAttributeRector::class, [
        // Convert @backupGlobals annotation to attribute.
        new AnnotationWithValueToAttribute('backupGlobals', 'PHPUnit\Framework\Attributes\BackupGlobals', [
            'enabled' => true,
            'disabled' => false,
        ]),

        // Convert @group annotation to attribute.
        new AnnotationWithValueToAttribute('group', 'PHPUnit\Framework\Attributes\Group'),
    ])
    ->withConfiguredRule(AnnotationToAttributeRector::class, [
        // Convert @runTestInSeparateProcess annotation to attribute.
        new AnnotationToAttribute('runTestInSeparateProcess', 'PHPUnit\Framework\Attributes\RunInSeparateProcess'),

        // Convert @runTestInSeparateProcesses annotation to attribute.
        new AnnotationToAttribute('runTestsInSeparateProcesses', 'PHPUnit\Framework\Attributes\RunTestsInSeparateProcesses'),
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
