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

/**
 * Plugin registry and dynamic loader for availability condition plugins.
 *
 * Dynamically imports ESM modules for each enabled availability plugin,
 * validates they export a proper {@link AvailabilityPlugin} subclass, and
 * falls back to the legacy YUI adapter for plugins that haven't migrated.
 *
 * @module     core_availability/registry
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {AvailabilityPlugin} from './types';
import type {PluginDescriptor, PluginRegistration} from './types';

/**
 * Load and validate all availability condition plugins.
 *
 * Each plugin is imported dynamically. Plugins that fail to load or don't
 * export a valid {@link AvailabilityPlugin} subclass are logged and skipped
 * gracefully — they will not break the rest of the form.
 *
 * @param descriptors Array of plugin descriptors from PHP.
 * @returns Map of plugin name → registration (only successfully loaded plugins).
 */
export async function loadPlugins(
    descriptors: PluginDescriptor[],
): Promise<Map<string, PluginRegistration>> {
    const registry = new Map<string, PluginRegistration>();

    const results = await Promise.allSettled(
        descriptors.map(async (descriptor) => loadSinglePlugin(descriptor)),
    );

    for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
            registry.set(result.value.name, result.value);
        }
    }

    return registry;
}

/**
 * Attempt to load a single plugin by its descriptor.
 *
 * Tries the ESM module first; if that fails or is invalid, falls back to
 * the legacy YUI adapter.
 */
async function loadSinglePlugin(descriptor: PluginDescriptor): Promise<PluginRegistration | null> {
    const {name, modulePath, allowAdd, displayMode, initParams} = descriptor;

    try {
        const module = await import(/* webpackIgnore: true */ modulePath);
        const PluginClass = module.default;

        if (!PluginClass) {
            window.console.warn(
                `[core_availability/registry] Plugin "${name}" (${modulePath}) has no default export. Skipping.`,
            );
            return tryLegacyAdapter(descriptor);
        }

        // Instantiate and validate.
        const instance: unknown = typeof PluginClass === 'function' ? new PluginClass() : PluginClass;

        if (!(instance instanceof AvailabilityPlugin)) {
            window.console.warn(
                `[core_availability/registry] Plugin "${name}" does not extend AvailabilityPlugin. ` +
                'Attempting legacy adapter fallback.',
            );
            return tryLegacyAdapter(descriptor);
        }

        return {name, allowAdd, displayMode, initParams, plugin: instance};
    } catch (error) {
        window.console.warn(
            `[core_availability/registry] Failed to import plugin "${name}" from "${modulePath}". ` +
            'Attempting legacy adapter fallback.',
            error,
        );
        return tryLegacyAdapter(descriptor);
    }
}

/**
 * Attempt to wrap a legacy YUI plugin with the adapter.
 *
 * Checks if the global `M.availability_<name>.form` exists and, if so,
 * dynamically imports the legacy adapter to wrap it.
 */
async function tryLegacyAdapter(descriptor: PluginDescriptor): Promise<PluginRegistration | null> {
    const {name, allowAdd, displayMode, initParams} = descriptor;

    // Check if the legacy YUI plugin is available globally.
    const globalM = (window as Record<string, any>).M;
    const globalForm = globalM?.['availability_' + name]?.form;

    if (!globalForm) {
        window.console.warn(
            `[core_availability/registry] No ESM module or legacy YUI plugin found for "${name}". Skipping.`,
        );
        return null;
    }

    try {
        const {LegacyPluginAdapter} = await import(
            /* webpackIgnore: true */ '@moodle/lms/core_availability/legacy_adapter'
        );
        const adapter = new LegacyPluginAdapter(name, globalForm, initParams);
        return {name, allowAdd, displayMode, initParams, plugin: adapter};
    } catch (error) {
        window.console.error(
            `[core_availability/registry] Failed to load legacy adapter for "${name}".`,
            error,
        );
        return null;
    }
}
