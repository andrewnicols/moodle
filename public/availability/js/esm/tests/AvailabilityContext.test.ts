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
 * Unit tests for the AvailabilityContext tree reducer.
 *
 * @module     core_availability/components/AvailabilityContext
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {treeReducer} from '@moodle/lms/core_availability/components/AvailabilityContext';
import type {TreeAction} from '@moodle/lms/core_availability/components/AvailabilityContext';
import type {AvailabilityTree, ConditionJSON} from '@moodle/lms/core_availability/types';
import {createEmptyTree, addChild, addNestedSet} from '@moodle/lms/core_availability/tree';

describe('treeReducer', () => {
    let initialTree: AvailabilityTree;

    beforeEach(() => {
        initialTree = createEmptyTree('&');
    });

    describe('SET_TREE', () => {
        it('replaces the entire tree', () => {
            const newTree: AvailabilityTree = {
                op: '|',
                c: [{type: 'date', d: '>=', t: 100}],
                showc: [true],
            };
            const action: TreeAction = {type: 'SET_TREE', tree: newTree};
            const result = treeReducer(initialTree, action);
            expect(result).toEqual(newTree);
        });
    });

    describe('SET_OPERATOR', () => {
        it('sets operator on root tree', () => {
            const action: TreeAction = {type: 'SET_OPERATOR', path: [], op: '|'};
            const result = treeReducer(initialTree, action);
            expect(result.op).toBe('|');
        });

        it('sets operator on nested tree', () => {
            let tree = createEmptyTree('&');
            tree = addNestedSet(tree, '&');

            const action: TreeAction = {type: 'SET_OPERATOR', path: [0], op: '!|'};
            const result = treeReducer(tree, action);

            const nested = result.c[0] as AvailabilityTree;
            expect(nested.op).toBe('!|');
        });
    });

    describe('ADD_CONDITION', () => {
        it('adds a condition to the root', () => {
            const condition: ConditionJSON = {type: 'grade', id: 5};
            const action: TreeAction = {type: 'ADD_CONDITION', path: [], condition};
            const result = treeReducer(initialTree, action);

            expect(result.c).toHaveLength(1);
            expect(result.c[0]).toEqual(condition);
            expect(result.showc).toEqual([true]);
        });

        it('adds a condition to a nested tree', () => {
            let tree = createEmptyTree('&');
            tree = addNestedSet(tree, '|');

            const condition: ConditionJSON = {type: 'group', id: 3};
            const action: TreeAction = {type: 'ADD_CONDITION', path: [0], condition, show: false};
            const result = treeReducer(tree, action);

            const nested = result.c[0] as AvailabilityTree;
            expect(nested.c).toHaveLength(1);
            expect(nested.c[0]).toEqual(condition);
            expect(nested.showc).toEqual([false]);
        });
    });

    describe('REMOVE_CONDITION', () => {
        it('removes a condition from the root', () => {
            let tree = createEmptyTree('&');
            tree = addChild(tree, {type: 'date', d: '>=', t: 100});
            tree = addChild(tree, {type: 'grade', id: 1});

            const action: TreeAction = {type: 'REMOVE_CONDITION', path: [], index: 0};
            const result = treeReducer(tree, action);

            expect(result.c).toHaveLength(1);
            expect((result.c[0] as ConditionJSON).type).toBe('grade');
        });

        it('removes a condition from a nested tree', () => {
            let tree = createEmptyTree('&');
            let nested = createEmptyTree('|');
            nested = addChild(nested, {type: 'date', d: '>=', t: 100});
            nested = addChild(nested, {type: 'group'});
            tree = addChild(tree, nested);

            const action: TreeAction = {type: 'REMOVE_CONDITION', path: [0], index: 1};
            const result = treeReducer(tree, action);

            const resultNested = result.c[0] as AvailabilityTree;
            expect(resultNested.c).toHaveLength(1);
            expect((resultNested.c[0] as ConditionJSON).type).toBe('date');
        });
    });

    describe('UPDATE_CONDITION', () => {
        it('updates a condition at the root level', () => {
            let tree = createEmptyTree('&');
            tree = addChild(tree, {type: 'grade', id: 1});

            const updated: ConditionJSON = {type: 'grade', id: 1, min: 50, max: 100};
            const action: TreeAction = {type: 'UPDATE_CONDITION', path: [], index: 0, condition: updated};
            const result = treeReducer(tree, action);

            expect(result.c[0]).toEqual(updated);
        });
    });

    describe('SET_VISIBILITY', () => {
        it('updates visibility flag for a child', () => {
            let tree = createEmptyTree('&');
            tree = addChild(tree, {type: 'date', d: '>=', t: 100}, true);
            tree = addChild(tree, {type: 'grade', id: 1}, true);

            const action: TreeAction = {type: 'SET_VISIBILITY', path: [], index: 1, show: false};
            const result = treeReducer(tree, action);

            expect(result.showc).toEqual([true, false]);
        });
    });

    describe('ADD_NESTED_SET', () => {
        it('adds a nested tree to the root', () => {
            const action: TreeAction = {type: 'ADD_NESTED_SET', path: [], op: '|'};
            const result = treeReducer(initialTree, action);

            expect(result.c).toHaveLength(1);
            const nested = result.c[0] as AvailabilityTree;
            expect(nested.op).toBe('|');
            expect(nested.c).toEqual([]);
        });

        it('defaults to AND operator', () => {
            const action: TreeAction = {type: 'ADD_NESTED_SET', path: []};
            const result = treeReducer(initialTree, action);

            const nested = result.c[0] as AvailabilityTree;
            expect(nested.op).toBe('&');
        });
    });

    describe('unknown action', () => {
        it('returns the state unchanged', () => {
            const action = {type: 'UNKNOWN_ACTION'} as unknown as TreeAction;
            const result = treeReducer(initialTree, action);
            expect(result).toBe(initialTree);
        });
    });

    describe('deep path navigation', () => {
        it('handles two levels of nesting', () => {
            // root (AND) → nested1 (OR) → nested2 (AND) → condition
            let nested2 = createEmptyTree('&');
            nested2 = addChild(nested2, {type: 'group', id: 7});
            let nested1 = createEmptyTree('|');
            nested1 = addChild(nested1, nested2);
            let root = createEmptyTree('&');
            root = addChild(root, nested1);

            // Update condition at path [0, 0] index 0
            const updated: ConditionJSON = {type: 'group', id: 99};
            const action: TreeAction = {type: 'UPDATE_CONDITION', path: [0, 0], index: 0, condition: updated};
            const result = treeReducer(root, action);

            const r1 = result.c[0] as AvailabilityTree;
            const r2 = r1.c[0] as AvailabilityTree;
            expect(r2.c[0]).toEqual({type: 'group', id: 99});
        });

        it('returns state unchanged for invalid path', () => {
            const action: TreeAction = {type: 'SET_OPERATOR', path: [99], op: '|'};
            const result = treeReducer(initialTree, action);
            expect(result).toEqual(initialTree);
        });
    });
});
