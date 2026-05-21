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
 * Legacy YUI plugin adapter.
 *
 * Wraps a YUI-based availability condition plugin (one that implements
 * `M.availability_<name>.form`) as a React component, allowing third-party
 * plugins that haven't migrated to ESM/React to continue working inside the
 * new availability form.
 *
 * @module     core_availability/legacy_adapter
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {type FC, useRef, useEffect, useCallback} from 'react';
import {AvailabilityPlugin} from './types';
import type {ComponentType, PluginComponentProps, ConditionJSON} from './types';

/**
 * The shape of a legacy YUI plugin form object (M.availability_<name>.form).
 */
interface LegacyYuiPlugin {
    initInner?: (...args: unknown[]) => void;
    getNode: (json: Record<string, unknown>) => any; // Y.Node
    fillValue: (value: Record<string, unknown>, node: any) => void;
    fillErrors?: (errors: string[], node: any) => void;
    focusAfterAdd?: (node: any) => void;
}

/**
 * React component that wraps a legacy YUI plugin.
 *
 * Renders a container div and mounts the YUI plugin's node into it.
 * Bridges onChange/onValidate by polling the YUI node state.
 */
function createLegacyComponent(
    name: string,
    yuiPlugin: LegacyYuiPlugin,
): FC<PluginComponentProps> {
    const LegacyComponent: FC<PluginComponentProps> = ({json, onChange, onValidate}) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const yuiNodeRef = useRef<any>(null);
        const mountedRef = useRef(false);

        // Mount the YUI node on first render.
        useEffect(() => {
            if (mountedRef.current || !containerRef.current) {
                return;
            }
            mountedRef.current = true;

            const yuiNode = yuiPlugin.getNode(json);
            yuiNodeRef.current = yuiNode;

            // Y.Node has a getDOMNode() method to get the raw DOM element.
            const domNode = yuiNode.getDOMNode ? yuiNode.getDOMNode() : yuiNode;
            if (domNode instanceof HTMLElement) {
                containerRef.current.appendChild(domNode);
            }

            // Listen for changes on the container (input/change events bubble).
            const handleChange = () => {
                syncValue();
                syncErrors();
            };
            containerRef.current.addEventListener('input', handleChange);
            containerRef.current.addEventListener('change', handleChange);

            return () => {
                containerRef.current?.removeEventListener('input', handleChange);
                containerRef.current?.removeEventListener('change', handleChange);
            };
        }, []); // eslint-disable-line react-hooks/exhaustive-deps

        const syncValue = useCallback(() => {
            if (!yuiNodeRef.current) {
                return;
            }
            const value: Record<string, unknown> = {type: name};
            try {
                yuiPlugin.fillValue(value, yuiNodeRef.current);
                onChange(value as ConditionJSON);
            } catch (e) {
                window.console.warn(`[legacy_adapter] fillValue failed for "${name}":`, e);
            }
        }, [onChange]);

        const syncErrors = useCallback(() => {
            if (!yuiNodeRef.current || !yuiPlugin.fillErrors) {
                return;
            }
            const errors: string[] = [];
            try {
                yuiPlugin.fillErrors(errors, yuiNodeRef.current);
                onValidate(errors);
            } catch (e) {
                window.console.warn(`[legacy_adapter] fillErrors failed for "${name}":`, e);
            }
        }, [onValidate]);

        return (
            <div
                ref={containerRef}
                className="availability-legacy-plugin"
                data-legacy-plugin={name}
            />
        );
    };

    LegacyComponent.displayName = `LegacyPlugin(${name})`;
    return LegacyComponent;
}

/**
 * Adapter that wraps a legacy YUI availability plugin as an AvailabilityPlugin.
 */
export class LegacyPluginAdapter extends AvailabilityPlugin {
    #name: string;
    #yuiPlugin: LegacyYuiPlugin;
    #component: ComponentType<PluginComponentProps>;

    constructor(name: string, yuiPlugin: LegacyYuiPlugin, initParams: unknown[]) {
        super();
        this.#name = name;
        this.#yuiPlugin = yuiPlugin;
        this.#component = createLegacyComponent(name, yuiPlugin);

        // Call initInner if the plugin defines it.
        if (yuiPlugin.initInner) {
            yuiPlugin.initInner(...initParams);
        }
    }

    getComponent(): ComponentType<PluginComponentProps> {
        return this.#component;
    }

    fillValue(formState: Record<string, unknown>): ConditionJSON {
        // The formState already has type set by the component's syncValue.
        return {type: this.#name, ...formState};
    }

    validate(_formState: Record<string, unknown>): string[] {
        // Validation is handled inside the component via syncErrors.
        return [];
    }

    focusAfterAdd(container: HTMLElement): void {
        const target = container.querySelector<HTMLElement>('input:not([disabled]), select:not([disabled])');
        target?.focus();
    }
}
