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
use Rector\PHPUnit\PHPUnit100\Rector\Class_\PublicDataProviderClassMethodRector;
use Rector\PHPUnit\PHPUnit100\Rector\Class_\StaticDataProviderClassMethodRector;

// Load the ignore list.
$ignorefile = __DIR__ . '/.rector/ignore.php';
if (!file_exists($ignorefile)) {
    throw new \RuntimeException(
        'The ignore file does not exist. Please generate it using `npx grunt ignorefiles`.',
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
    ;
