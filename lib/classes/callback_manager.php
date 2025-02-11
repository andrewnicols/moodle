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

use core\callbacks\abstract_callback_object;
use core\callbacks\callback_interface;
use core\callbacks\replaces_legacy_callback_interface;
use core\exception\coding_exception;

/**
 * Callback manager for dispatching callbacks.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class callback_manager {
    /**
     * Dispatch the callback to the named component.
     *
     * @param string $component A valid Moodle component
     * @param \core\callbacks\abstract_callback_object $callback
     * @return bool Whether a callback was dispatched.
     */
    public function dispatch(
        string $component,
        abstract_callback_object $callback,
    ): bool {
        $instance = $this->get_class_instance_for_interface_name($component, $callback);

        if ($instance === null) {
            $legacycalled = $this->call_legacy_callbacks($component, $callback);
            if ($legacycalled) {
                self::emit_legacy_callback_notice($component, $callback->get_implementing_interface_names());
            }

            if (!$legacycalled && $callback instanceof \core\callbacks\must_exist_interface) {
                self::emit_callback_required_error($component, $callback->get_implementing_interface_names());
            }

            return $legacycalled;
        }

        // Execute the callback.
        $instance->{$callback->get_executor_name()}($callback);

        return true;
    }

    /**
     * Get the callback class name for an interface name.
     *
     * @param string $component
     * @param string $interfacename
     * @throws \core\exception\coding_exception
     * @return string
     */
    public function get_class_name_for_interface_name(
        string $component,
        string $interfacename,
    ): string {
        // Pop off the component and 'callbacks' L2 namespace from the Interface name.
        $parts = explode('\\', $interfacename);

        // Pop off the owning component.
        array_shift($parts);

        // Pop off the 'callbacks' L2 namespace and confirm that it is indeed a callback interface.
        $callback = array_shift($parts);
        if ($callback !== 'callbacks') {
            throw new coding_exception(
                "Interface {$interfacename} is not in the callback namespace.",
            );
        }

        // The interface name is the remaining parts joined with backslashes.
        if (count($parts) !== 2) {
            throw new coding_exception(
                "Interface name {$interfacename} is not in the expected format. " .
                "It should contain a valid Level 2 namespace and a name.",
            );
        }

        [$api, $name] = $parts;
        if (!\core\component::is_core_api($api)) {
            throw new coding_exception(
                "Interface name {$interfacename} is not in the expected format. " .
                "The L3 namespace must be a valid API.",
            );
        }

        if (substr($name, -10) !== '_interface') {
            throw new coding_exception(
                "Interface name {$interfacename} is not in the expected format. " .
                "The name must end with '_interface'.",
            );
        }

        // Strip off the '_interface' suffix.
        $classname = substr($name, 0, -10);
        return "\\{$component}\\callbacks\\{$api}\\{$classname}_callback";
    }

    /**
     * Emit a notice that a newer interface implementation is available and should be implemented.
     *
     * @param string $component
     * @param string $interfacename
     */
    protected static function emit_newer_available_notice(
        string $component,
        string $interfacename,
    ): void {
        debugging(
            sprintf(
                "A newer implementation is available. Please implement the interface %s instead in $component.",
                $interfacename,
                $component,
            ),
            DEBUG_DEVELOPER,
        );
    }

    /**
     * Emit a notice that a legacy callback was found without a new callback implementation.
     *
     * Note: Legacy callbacks can continue to exist in the codebase as long as a new callback implementation is also provided.
     *
     * @param string $component
     * @param array $interfacenames
     */
    protected static function emit_legacy_callback_notice(
        string $component,
        array $interfacenames,
    ): void {
        if (count($interfacenames) === 1) {
            $notice = "Please implement the interface %s instead.";
            $interfacename = $interfacenames[0];
        } else {
            $notice = "Please implement one of the following interfaces: %s.";
            $interfacename = implode(', ', $interfacenames);
        }
        debugging(
            sprintf(
                "A legacy callback implementation was found for component %s. {$notice}",
                $component,
                $interfacename,
            ),
            DEBUG_DEVELOPER,
        );
    }

    /**
     * Emit an error that a callback is required for a component.
     *
     * This is determined by the presence of the must_exist_interface on the callback object.
     *
     * @param string $component
     * @param array $interfacenames
     */
    protected static function emit_callback_required_error(
        string $component,
        array $interfacenames,
    ): void {
        if (count($interfacenames) === 1) {
            $notice = "Please implement the %s interface.";
            $interfacename = $interfacenames[0];
        } else {
            $notice = "Please implement one of the following interfaces: %s.";
            $interfacename = implode(', ', $interfacenames);
        }

        throw new coding_exception(sprintf(
            "Callback class for component %s must implement one of the following interfaces: {$notice}",
            $component,
            $interfacename,
        ));
    }

    /**
     * Get the class instance for an interface name.
     *
     * @param string $component
     * @param abstract_callback_object $callback
     * @return ?callback_interface
     */
    protected function get_class_instance_for_interface_name(
        string $component,
        abstract_callback_object $callback,
    ): ?callback_interface {
        $interfaces = $callback->get_implementing_interface_names();

        foreach ($interfaces as $index => $interfacename) {
            $classname = $this->get_class_name_for_interface_name($component, $interfacename);
            if (class_exists($classname) && is_a($classname, $interfacename, true)) {
                if ($index !== 0) {
                    // A newer version of this interface is available.
                    // Continue to use this one but emit a notice to inform the developer.
                    self::emit_newer_available_notice($component, $interfaces[0]);
                }
                return \core\di::get($classname);
            }
        }

        return null;
    }

    /**
     * Call a legacy callback.
     *
     * @param string $component
     * @param abstract_callback_object $callback
     * @param array $args
     * @return bool Whether the legacy callback was called.
     */
    protected function call_legacy_callbacks(
        string $component,
        abstract_callback_object $callback,
    ): bool {
        if (!($callback instanceof replaces_legacy_callback_interface)) {
            return false;
        }

        return $callback->call_legacy_callback($component);
    }
}
