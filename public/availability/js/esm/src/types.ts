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
 * Shared types for the availability conditions React components.
 *
 * @module     core_availability/types
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import type {ComponentType} from 'react';

// --- Tree data types (matching existing JSON schema) ---

/**
 * Boolean operators supported by the availability tree.
 *
 * - `&`  — all conditions must be met (AND)
 * - `|`  — any condition must be met (OR)
 * - `!&` — NOT all (NAND) — displayed as "Student must not match all"
 * - `!|` — NOT any (NOR)  — displayed as "Student must not match any"
 */
export type TreeOperator = '&' | '|' | '!&' | '!|';

/**
 * The JSON structure for a single condition as stored in the database.
 * Every condition has a `type` discriminator; the rest is plugin-specific.
 */
export interface ConditionJSON {
    type: string;
    [key: string]: unknown;
}

/**
 * A tree node representing a group of conditions with a boolean operator.
 */
export interface AvailabilityTree {
    /** The boolean operator combining children. */
    op: TreeOperator;
    /** Child conditions (leaf conditions or nested trees). */
    c: AvailabilityNode[];
    /** Global show/hide flag (true = shown greyed out, false = hidden entirely). */
    show?: boolean;
    /** Per-child show/hide flags (overrides `show` per condition). */
    showc?: boolean[];
}

/**
 * A node in the availability tree — either a nested tree or a leaf condition.
 */
export type AvailabilityNode = AvailabilityTree | ConditionJSON;

// --- Plugin types ---

/**
 * Props passed to a plugin's React component when rendered inside a ConditionItem.
 */
export interface PluginComponentProps {
    /** Current condition JSON (or `{type, creating: true}` for new items). */
    json: ConditionJSON;
    /** Callback to update the condition value. Called on every meaningful change. */
    onChange: (value: ConditionJSON) => void;
    /** Callback to report validation errors. Pass an empty array when valid. */
    onValidate: (errors: string[]) => void;
    /** Per-plugin initialisation parameters supplied by PHP. */
    initParams: unknown[];
}

/**
 * Plugin descriptor as provided by PHP via data-react-props.
 */
export interface PluginDescriptor {
    /** The condition type name (e.g. "date", "grade"). */
    name: string;
    /** The ESM module path (e.g. "@moodle/lms/availability_date/form"). */
    modulePath: string;
    /** Whether this plugin can be added in the current context. */
    allowAdd: boolean;
    /** Default display mode (eye icon state). True = "hidden", false = "shown greyed out". */
    displayMode: boolean;
    /** Init params from PHP's `get_javascript_init_params()`. */
    initParams: unknown[];
}

/**
 * A loaded and validated plugin registration.
 */
export interface PluginRegistration {
    /** The condition type name (e.g. "date", "grade"). */
    name: string;
    /** Whether this plugin can be added in the current context. */
    allowAdd: boolean;
    /** Default display mode (eye icon state). */
    displayMode: boolean;
    /** Parameters from PHP's `get_javascript_init_params()`. */
    initParams: unknown[];
    /** The plugin instance. */
    plugin: AvailabilityPlugin;
}

/**
 * Props for the top-level form component (from data-react-props).
 */
export interface AvailabilityFormProps {
    /** Plugin descriptors from PHP. */
    plugins: PluginDescriptor[];
    /** ID of the hidden textarea element holding the JSON. */
    textareaId: string;
    /** Course ID. */
    courseId: number;
    /** Course module ID (null for section-level restrictions). */
    cmId?: number | null;
    /** Section ID (null for module-level restrictions). */
    sectionId?: number | null;
}

// --- Plugin base class ---

/**
 * Abstract base class for availability condition plugins.
 *
 * Every availability condition plugin must provide an ESM module at
 * `@moodle/lms/availability_<name>/form` which default-exports a class
 * extending this base class.
 *
 * Subclasses MUST implement {@link getComponent} and {@link fillValue}.
 * Other methods have default implementations that plugins MAY override.
 */
/**
 * Symbol used to brand AvailabilityPlugin instances so that `isAvailabilityPlugin()`
 * works across separately-compiled bundles (where `instanceof` fails because each
 * bundle gets its own copy of the class constructor).
 */
export const AVAILABILITY_PLUGIN_BRAND = Symbol.for('core_availability/AvailabilityPlugin');

/**
 * Type guard that checks whether a value is an AvailabilityPlugin instance.
 *
 * Uses a Symbol brand rather than `instanceof` so the check works reliably
 * across separately-bundled ESM entry points.
 */
export function isAvailabilityPlugin(value: unknown): value is AvailabilityPlugin {
    return (
        typeof value === 'object' &&
        value !== null &&
        (value as any)[AVAILABILITY_PLUGIN_BRAND] === true
    );
}

export abstract class AvailabilityPlugin {
    /** Brand marker — enables cross-bundle identification via {@link isAvailabilityPlugin}. */
    readonly [AVAILABILITY_PLUGIN_BRAND] = true;

    /**
     * Return the React component that renders this condition's form controls.
     *
     * The component receives {@link PluginComponentProps} and must call
     * `onChange` whenever the user modifies the condition, and `onValidate`
     * to report or clear validation errors.
     */
    abstract getComponent(): ComponentType<PluginComponentProps>;

    /**
     * Extract the condition JSON from the component's reported state.
     *
     * This is called by the tree when serialising conditions. The returned
     * object is stored directly in the availability JSON tree.
     *
     * @param formState The current state as reported by the plugin component via `onChange`.
     */
    abstract fillValue(formState: Record<string, unknown>): ConditionJSON;

    /**
     * Validate the current form state and return an array of error string
     * identifiers (in `component:stringid` format). Return an empty array
     * if the state is valid.
     *
     * Default implementation: no errors.
     */
    validate(_formState: Record<string, unknown>): string[] {
        return [];
    }

    /**
     * Focus the most relevant input element after a new condition of this
     * type is added to the form.
     *
     * Default implementation: focuses the first focusable element in the container.
     */
    focusAfterAdd(container: HTMLElement): void {
        const focusable = container.querySelector<HTMLElement>(
            'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])',
        );
        focusable?.focus();
    }

    /**
     * Derive the initial component state from a saved condition JSON object.
     *
     * Called when loading an existing condition from the database. Plugins can
     * override to transform or enrich the raw JSON before it is passed to the
     * component as props.
     *
     * Default implementation: returns the JSON object as-is.
     */
    getInitialState(json: ConditionJSON): Record<string, unknown> {
        return {...json};
    }
}
