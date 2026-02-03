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

/**
 * Class environment
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class environment {
    /**
     * Ensure that Composer dependencies are installed and the necessary files are present.
     *
     * @param \environment_results $result
     * @return \environment_results|null
     */
    public static function check_composer_dependencies_installed(\environment_results $result): ?\environment_results {
        if (!class_exists(\Composer\InstalledVersions::class)) {
            $result->setInfo('Composer installed data not found');
            $result->setFeedbackStr('composernotfound');
            return $result;
        }

        return null;
    }

    /**
     * Ensure that Composer developer dependencies are not installed.
     *
     * @param \environment_results $result
     * @return \environment_results|null
     */
    public static function check_composer_developer_dependencies_not_installed(
        \environment_results $result
    ): ?\environment_results {
        if (static::is_developer_mode_enabled()) {
            $result->setInfo('Developer mode is enabled, skipping check for developer dependencies');
            return null; // Skip this check in developer mode.
        }

        if (!class_exists(\Composer\InstalledVersions::class)) {
            return null; // Skip this check. It's picked up in check_composer_dependencies_installed.
        }

        // Check if developer dependencies have been installed too.
        $installed = \Composer\InstalledVersions::getAllRawData()[0];
        if (is_array($installed) && array_key_exists('root', $installed)) {
            if ($installed['root']['dev']) {
                $result->setInfo('Composer Developer dependencies are installed');
                $result->setFeedbackStr('composerdeveloperdependenciesinstalled');
                return $result;
            }
        }

        return null;
    }

    /**
     * Ensure that Composer developer dependencies are optimised    .
     *
     * @param \environment_results $result
     * @return \environment_results|null
     * @codeCoverageIgnore
     */
    public static function check_composer_dependencies_optimised(
        \environment_results $result
    ): ?\environment_results {
        if (!class_exists(\Composer\InstalledVersions::class)) {
            return null; // Skip this check. It's picked up in check_composer_dependencies_installed.
        }

        // Get our Autoloader.
        $rootpackage = \Composer\InstalledVersions::getRootPackage();
        $rootpath = $rootpackage['install_path'];
        $rootvendor = realpath("{$rootpath}/vendor");
        $loaders = \Composer\Autoload\ClassLoader::getRegisteredLoaders();
        if (!array_key_exists($rootvendor, $loaders)) {
            return null; // No autoloader for our vendor dir, so nothing to check.
        }
        $autoloader = $loaders[$rootvendor];

        if (static::is_developer_mode_enabled()) {
            if ($autoloader->isClassMapAuthoritative()) {
                $result->setInfo('Composer autoloader is optimised');
                $result->setFeedbackStr('composeroptimisedindevmode');

                return $result;
            }

            $result->setInfo('Developer mode is enabled, optimiser is correctly disabled.');

            return null;
        }

        if ($autoloader->isClassMapAuthoritative()) {
            $result->setInfo('Autoloader is correctly optimised.');

            return null;
        }

        $result->setInfo('Composer autoloader is not optimised');
        $result->setFeedbackStr('composernotoptimised');

        return $result;
    }

    /**
     * Check if developer mode is enabled.
     *
     * @return bool
     */
    protected static function is_developer_mode_enabled(): bool {
        global $CFG;

        return !empty($CFG->debugdeveloper);
    }

    /**
     * Ensure that the Router is correctly configured.
     *
     * @param \environment_results $result
     * @return \environment_results|null
     */
    public static function check_router_configuration(\environment_results $result): ?\environment_results {
        global $CFG;

        if (empty($CFG->routerconfigured)) {
            // The router has not been marked as configured.
            $result->setInfo('Router not configured');
            $result->setFeedbackStr('routernotconfigured');
            return $result;
        }

        return null;
    }
}
