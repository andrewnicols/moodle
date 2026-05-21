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
 * React context for the availability conditions form.
 *
 * Provides the plugin registry, course/section/module context, and a dispatch
 * function for tree mutations to all descendant components.
 *
 * @module     core_availability/components/AvailabilityContext
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {createContext, useContext, useReducer} from 'react';
import type {Dispatch, ReactNode} from 'react';
import type {PluginRegistration, AvailabilityTree, TreeOperator, AvailabilityNode} from '../types';
import {
    addChild,
    removeChild,
    updateChild,
    setOperator,
    setChildVisibility,
    createEmptyTree,
    addNestedSet,
} from '../tree';

// --- Actions ---

export type TreeAction =
    | {type: 'SET_TREE'; tree: AvailabilityTree}
    | {type: 'SET_OPERATOR'; path: number[]; op: TreeOperator}
    | {type: 'ADD_CONDITION'; path: number[]; condition: AvailabilityNode; show?: boolean}
    | {type: 'REMOVE_CONDITION'; path: number[]; index: number}
    | {type: 'UPDATE_CONDITION'; path: number[]; index: number; condition: AvailabilityNode}
    | {type: 'SET_VISIBILITY'; path: number[]; index: number; show: boolean}
    | {type: 'ADD_NESTED_SET'; path: number[]; op?: TreeOperator};

// --- Context value ---

export interface AvailabilityContextValue {
    plugins: Map<string, PluginRegistration>;
    tree: AvailabilityTree;
    dispatch: Dispatch<TreeAction>;
    courseId: number;
    cmId: number | null;
    sectionId: number | null;
}

const AvailabilityContext = createContext<AvailabilityContextValue | null>(null);

/**
 * Hook to access the availability context. Throws if used outside the provider.
 */
export function useAvailability(): AvailabilityContextValue {
    const ctx = useContext(AvailabilityContext);
    if (!ctx) {
        throw new Error('useAvailability must be used within an AvailabilityProvider');
    }
    return ctx;
}

// --- Tree path navigation ---

/**
 * Apply a transformation to a subtree at the given path, returning a new root tree.
 * Path is an array of child indices to navigate into nested trees.
 */
function updateAtPath(
    tree: AvailabilityTree,
    path: number[],
    transform: (subtree: AvailabilityTree) => AvailabilityTree,
): AvailabilityTree {
    if (path.length === 0) {
        return transform(tree);
    }

    const [head, ...rest] = path;
    const child = tree.c[head];
    if (!child || !('op' in child) || !('c' in child)) {
        return tree;
    }

    const updatedChild = updateAtPath(child as AvailabilityTree, rest, transform);
    return updateChild(tree, head, updatedChild);
}

// --- Reducer ---

export function treeReducer(state: AvailabilityTree, action: TreeAction): AvailabilityTree {
    switch (action.type) {
        case 'SET_TREE':
            return action.tree;

        case 'SET_OPERATOR':
            return updateAtPath(state, action.path, (subtree) =>
                setOperator(subtree, action.op),
            );

        case 'ADD_CONDITION':
            return updateAtPath(state, action.path, (subtree) =>
                addChild(subtree, action.condition, action.show ?? true),
            );

        case 'REMOVE_CONDITION':
            return updateAtPath(state, action.path, (subtree) =>
                removeChild(subtree, action.index),
            );

        case 'UPDATE_CONDITION':
            return updateAtPath(state, action.path, (subtree) =>
                updateChild(subtree, action.index, action.condition),
            );

        case 'SET_VISIBILITY':
            return updateAtPath(state, action.path, (subtree) =>
                setChildVisibility(subtree, action.index, action.show),
            );

        case 'ADD_NESTED_SET':
            return updateAtPath(state, action.path, (subtree) =>
                addNestedSet(subtree, action.op ?? '&'),
            );

        default:
            return state;
    }
}

// --- Provider ---

interface AvailabilityProviderProps {
    plugins: Map<string, PluginRegistration>;
    initialTree: AvailabilityTree;
    courseId: number;
    cmId: number | null;
    sectionId: number | null;
    children: ReactNode;
}

export function AvailabilityProvider({
    plugins,
    initialTree,
    courseId,
    cmId,
    sectionId,
    children,
}: AvailabilityProviderProps) {
    const [tree, dispatch] = useReducer(treeReducer, initialTree);

    const value: AvailabilityContextValue = {
        plugins,
        tree,
        dispatch,
        courseId,
        cmId,
        sectionId,
    };

    return <AvailabilityContext value={value}>{children}</AvailabilityContext>;
}
