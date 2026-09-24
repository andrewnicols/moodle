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

namespace core\hook\composer;

use core\hook\di_configuration;

/**
 * Hook listener for composer related DI definitions.
 *
 * @package    core
 * @copyright  2026 Mihail Geshoski <mihail@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class composer_di {
    /**
     * Configure DI definitions.
     *
     * @param di_configuration $hook
     * @return void
     */
    public static function configure(di_configuration $hook): void {
        $hook->add_definition(
            \core\composer::class,
            function (): \core\composer {
                global $CFG;

                // We need to provide the vendor directory for the Moodle composer installation.
                // We accept the following locations:
                // 1. The default vendor directory within the Moodle root were the package type is 'moodle-core'; or
                // 2. A composer package type of 'project', and an install path which is:
                // 2a. in the parent directory of the Moodle root; or
                // 2b. completely separate from the Moodle root (symlink).
                // If none of these conditions are met, we will fallback to the default vendor directory within the Moodle root.

                $vendordir = null;
                if (class_exists(\Composer\InstalledVersions::class)) {
                    $rootrealpath = realpath($CFG->root);
                    foreach (\Composer\InstalledVersions::getAllRawData() as $packagedata) {
                        $package = $packagedata['root'];
                        // First check if this is the main Moodle core package -- Moodle is not installed using Composer.
                        if ($package['type'] === 'moodle-core') {
                            if (isset($package['install_path']) && is_dir($package['install_path'] . '/vendor')) {
                                $vendordir = $package['install_path'] . '/vendor';
                                break;
                            }
                        }

                        // Our next option is that Moodle is installed using Composer.
                        // In these cases we expect the Composer type to be 'project' rather than library or some other type.
                        if ($package['type'] === 'project') {
                            $realpath = $package['install_path'] ?? null;
                            if (str_starts_with($rootrealpath, $realpath)) {
                                $vendordir = $realpath . '/vendor';
                                break;
                            }

                            // Our final option is that Moodle is installed using Composer,
                            // but the Composer install path is not a parent, or child, of the Moodle root.
                            // This can happen with symlinks.
                            // Note: We already checked if the realpath is a parent of the Moodle root,
                            // so here we only need to check if it is not a child.
                            if (!str_starts_with($realpath, $rootrealpath)) {
                                $vendordir = $realpath . '/vendor';
                                break;
                            }
                        }
                    }
                }

                if ($vendordir === null) {
                    // Fallback to the default vendor directory within the Moodle root if no specific vendor directory was found.
                    $vendordir = $CFG->root . '/vendor';
                }

                return new \core\composer(
                    $vendordir,
                    dirname($vendordir) . '/composer.lock',
                );
            }
        );
    }
}
