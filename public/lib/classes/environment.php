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
        $vendorpath = static::get_vendor_path();
        $composercheck = static::check_vendor_path($result, $vendorpath);
        if ($composercheck !== null) {
            return $composercheck;
        }

        // Ensure Composer runtime API is available.
        // This should already have been loaded in our Component Autoloader.
        require_once("{$vendorpath}/autoload.php");
        if (!class_exists(\Composer\InstalledVersions::class)) {
            $result->setInfo('Composer installed data not found');
            $result->setFeedbackStr('composernotfound');
            return $result;
        }

        return null;
    }

    /**
     * Validate that a Composer vendor path has the expected structure.
     *
     * @param \environment_results $result
     * @param string $vendorpath
     * @param string $label
     * @return \environment_results|null
     */
    protected static function check_vendor_path(
        \environment_results $result,
        string $vendorpath,
        string $label = 'Composer'
    ): ?\environment_results {
        if (!is_dir($vendorpath)) {
            $result->setInfo("{$label} vendor directory not found");
            $result->setFeedbackStr('composernotfound');
            return $result;
        }

        $autoloadpath = "{$vendorpath}/autoload.php";
        if (!is_file($autoloadpath)) {
            $result->setInfo("{$label} autoload file not found");
            $result->setFeedbackStr('composernotfound');
            return $result;
        }

        $installedpath = "{$vendorpath}/composer/installed.php";
        if (!is_file($installedpath)) {
            $result->setInfo("{$label} installed data not found");
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

        $vendorpath = static::get_vendor_path();
        if (!is_dir($vendorpath)) {
            return null; // No vendor directory, so no developer dependencies to check.
        }

        // Check if the installed.php file exists in the composer directory.
        $installedpath = "{$vendorpath}/composer/installed.php";
        if (!is_file($installedpath)) {
            return null; // No installed file, so no developer dependencies to check.
        }

        // Check if developer dependencies have been installed too.
        $installed = include($installedpath);
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
        $vendorpath = static::get_vendor_path();
        if (!is_dir($vendorpath)) {
            return null; // No vendor directory, so no developer dependencies to check.
        }

        $autoloader = require("{$vendorpath}/autoload.php");

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
     * Get the path to the Composer vendor directory.
     *
     * @return string
     */
    protected static function get_vendor_path(): string {
        global $CFG;

        // Composer vendor dependencies may live in different places depending on how Moodle is installed.
        // Prefer a local vendor directory in the Moodle dirroot, but allow for a parent directory vendor.
        $candidates = [];
        if (!empty($CFG->dirroot)) {
            $candidates[] = "{$CFG->dirroot}/vendor";
            $candidates[] = dirname($CFG->dirroot) . '/vendor';
        }
        if (!empty($CFG->root)) {
            $candidates[] = "{$CFG->root}/vendor";

            // In some installation layouts the vendor directory may live in the parent directory.
            // For example, a composed Moodle project may have a top-level vendor directory.
            $parentroot = dirname($CFG->root);
            $candidates[] = "{$parentroot}/vendor";
        }

        foreach (array_unique($candidates) as $path) {
            if (is_dir($path)) {
                return $path;
            }
        }

        // Fall back to the most likely location.
        if (!empty($CFG->dirroot)) {
            return "{$CFG->dirroot}/vendor";
        }

        return "{$CFG->root}/vendor";
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
