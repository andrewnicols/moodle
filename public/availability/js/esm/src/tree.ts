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
 * Tree data model for availability conditions.
 *
 * Provides type guards and pure helper functions for manipulating the
 * availability condition tree. The tree format matches the existing JSON
 * schema stored in course_modules.availability / course_sections.availability.
 *
 * This module has NO React dependency — it is a pure data layer.
 *
 * @module     core_availability/tree
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import type {AvailabilityTree, AvailabilityNode, ConditionJSON, TreeOperator} from './types';

/**
 * Type guard: returns true if the node is a nested tree (has `op` and `c`).
 */
export function isTree(node: AvailabilityNode): node is AvailabilityTree {
    return 'op' in node && 'c' in node;
}

/**
 * Type guard: returns true if the node is a leaf condition (has `type`).
 */
export function isCondition(node: AvailabilityNode): node is ConditionJSON {
    return 'type' in node && !('op' in node);
}

/**
 * Parse a JSON string (from the hidden textarea) into an availability tree.
 * Returns null for empty/invalid input.
 */
export function parseTree(json: string): AvailabilityTree | null {
    if (!json || !json.trim()) {
        return null;
    }
    try {
        const parsed = JSON.parse(json);
        if (parsed && typeof parsed === 'object' && 'op' in parsed && 'c' in parsed) {
            return parsed as AvailabilityTree;
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Serialise an availability tree to JSON for storage in the textarea.
 */
export function serialiseTree(tree: AvailabilityTree): string {
    return JSON.stringify(tree);
}

/**
 * Create a new empty tree with the given operator.
 */
export function createEmptyTree(op: TreeOperator = '&'): AvailabilityTree {
    return {op, c: [], showc: []};
}

/**
 * Add a child node to a tree. Returns a new tree (immutable).
 */
export function addChild(
    tree: AvailabilityTree,
    child: AvailabilityNode,
    show: boolean = true,
): AvailabilityTree {
    return {
        ...tree,
        c: [...tree.c, child],
        showc: [...(tree.showc ?? []), show],
    };
}

/**
 * Remove a child at the given index. Returns a new tree (immutable).
 */
export function removeChild(tree: AvailabilityTree, index: number): AvailabilityTree {
    const c = tree.c.filter((_, i) => i !== index);
    const showc = tree.showc?.filter((_, i) => i !== index);
    return {...tree, c, showc};
}

/**
 * Update a child at the given index. Returns a new tree (immutable).
 */
export function updateChild(
    tree: AvailabilityTree,
    index: number,
    child: AvailabilityNode,
): AvailabilityTree {
    const c = tree.c.map((existing, i) => (i === index ? child : existing));
    return {...tree, c};
}

/**
 * Change the operator of a tree. Returns a new tree (immutable).
 */
export function setOperator(tree: AvailabilityTree, op: TreeOperator): AvailabilityTree {
    return {...tree, op};
}

/**
 * Update the show/hide flag for a child at the given index.
 * Returns a new tree (immutable).
 */
export function setChildVisibility(
    tree: AvailabilityTree,
    index: number,
    show: boolean,
): AvailabilityTree {
    const showc = [...(tree.showc ?? tree.c.map(() => true))];
    showc[index] = show;
    return {...tree, showc};
}

/**
 * Add an empty nested subtree as a child. Returns a new tree (immutable).
 */
export function addNestedSet(
    tree: AvailabilityTree,
    nestedOp: TreeOperator = '&',
): AvailabilityTree {
    return addChild(tree, createEmptyTree(nestedOp), true);
}
