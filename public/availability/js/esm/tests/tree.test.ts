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
 * Unit tests for the availability tree data model.
 *
 * @module     core_availability/tree
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {
    isTree,
    isCondition,
    parseTree,
    serialiseTree,
    createEmptyTree,
    addChild,
    removeChild,
    updateChild,
    setOperator,
    setChildVisibility,
    addNestedSet,
} from '@moodle/lms/core_availability/tree';

import type {AvailabilityTree, ConditionJSON} from '@moodle/lms/core_availability/types';

describe('core_availability/tree', () => {
    describe('isTree', () => {
        it('returns true for a valid tree node', () => {
            const tree: AvailabilityTree = {op: '&', c: [], showc: []};
            expect(isTree(tree)).toBe(true);
        });

        it('returns true for a tree with children', () => {
            const tree: AvailabilityTree = {
                op: '|',
                c: [{type: 'date', d: '>=', t: 1234567890}],
                showc: [true],
            };
            expect(isTree(tree)).toBe(true);
        });

        it('returns false for a leaf condition', () => {
            const condition: ConditionJSON = {type: 'date', d: '>=', t: 1234567890};
            expect(isTree(condition)).toBe(false);
        });
    });

    describe('isCondition', () => {
        it('returns true for a leaf condition', () => {
            const condition: ConditionJSON = {type: 'grade', id: 5, min: 50};
            expect(isCondition(condition)).toBe(true);
        });

        it('returns false for a tree node', () => {
            const tree: AvailabilityTree = {op: '&', c: [], showc: []};
            expect(isCondition(tree)).toBe(false);
        });
    });

    describe('parseTree', () => {
        it('returns null for empty string', () => {
            expect(parseTree('')).toBeNull();
        });

        it('returns null for whitespace-only string', () => {
            expect(parseTree('   ')).toBeNull();
        });

        it('returns null for invalid JSON', () => {
            expect(parseTree('{not valid json')).toBeNull();
        });

        it('returns null for JSON that is not a tree', () => {
            expect(parseTree('{"type":"date"}')).toBeNull();
        });

        it('returns null for a plain array', () => {
            expect(parseTree('[1,2,3]')).toBeNull();
        });

        it('parses a valid tree JSON', () => {
            const json = '{"op":"&","c":[{"type":"date","d":">=","t":1234567890}],"showc":[true]}';
            const result = parseTree(json);
            expect(result).not.toBeNull();
            expect(result!.op).toBe('&');
            expect(result!.c).toHaveLength(1);
            expect(result!.showc).toEqual([true]);
        });

        it('parses a tree with nested subtrees', () => {
            const json = JSON.stringify({
                op: '|',
                c: [
                    {type: 'date', d: '>=', t: 100},
                    {op: '&', c: [{type: 'grade', id: 1}], showc: [true]},
                ],
                showc: [true, false],
            });
            const result = parseTree(json);
            expect(result).not.toBeNull();
            expect(result!.c).toHaveLength(2);
            expect(isTree(result!.c[1])).toBe(true);
        });
    });

    describe('serialiseTree', () => {
        it('serialises a tree to JSON', () => {
            const tree: AvailabilityTree = {op: '&', c: [], showc: []};
            const json = serialiseTree(tree);
            expect(JSON.parse(json)).toEqual({op: '&', c: [], showc: []});
        });

        it('preserves all condition data', () => {
            const tree: AvailabilityTree = {
                op: '|',
                c: [{type: 'grade', id: 5, min: 50, max: 100}],
                showc: [true],
            };
            const json = serialiseTree(tree);
            const parsed = JSON.parse(json);
            expect(parsed.c[0]).toEqual({type: 'grade', id: 5, min: 50, max: 100});
        });
    });

    describe('createEmptyTree', () => {
        it('creates a tree with AND operator by default', () => {
            const tree = createEmptyTree();
            expect(tree.op).toBe('&');
            expect(tree.c).toEqual([]);
            expect(tree.showc).toEqual([]);
        });

        it('creates a tree with specified operator', () => {
            const tree = createEmptyTree('!|');
            expect(tree.op).toBe('!|');
            expect(tree.c).toEqual([]);
        });
    });

    describe('addChild', () => {
        it('adds a condition to an empty tree', () => {
            const tree = createEmptyTree();
            const condition: ConditionJSON = {type: 'date', d: '>=', t: 100};
            const result = addChild(tree, condition);

            expect(result.c).toHaveLength(1);
            expect(result.c[0]).toEqual(condition);
            expect(result.showc).toEqual([true]);
        });

        it('adds with show=false', () => {
            const tree = createEmptyTree();
            const condition: ConditionJSON = {type: 'group'};
            const result = addChild(tree, condition, false);

            expect(result.showc).toEqual([false]);
        });

        it('preserves existing children', () => {
            let tree = createEmptyTree();
            tree = addChild(tree, {type: 'date', d: '>=', t: 100});
            tree = addChild(tree, {type: 'grade', id: 1});

            expect(tree.c).toHaveLength(2);
            expect((tree.c[0] as ConditionJSON).type).toBe('date');
            expect((tree.c[1] as ConditionJSON).type).toBe('grade');
        });

        it('does not mutate the original tree', () => {
            const original = createEmptyTree();
            addChild(original, {type: 'date', d: '>=', t: 100});

            expect(original.c).toHaveLength(0);
        });
    });

    describe('removeChild', () => {
        it('removes a child at the given index', () => {
            let tree = createEmptyTree();
            tree = addChild(tree, {type: 'date', d: '>=', t: 100});
            tree = addChild(tree, {type: 'grade', id: 1});
            tree = addChild(tree, {type: 'group'});

            const result = removeChild(tree, 1);
            expect(result.c).toHaveLength(2);
            expect((result.c[0] as ConditionJSON).type).toBe('date');
            expect((result.c[1] as ConditionJSON).type).toBe('group');
        });

        it('removes the corresponding showc entry', () => {
            let tree = createEmptyTree();
            tree = addChild(tree, {type: 'date', d: '>=', t: 100}, true);
            tree = addChild(tree, {type: 'grade', id: 1}, false);
            tree = addChild(tree, {type: 'group'}, true);

            const result = removeChild(tree, 1);
            expect(result.showc).toEqual([true, true]);
        });

        it('does not mutate the original tree', () => {
            let tree = createEmptyTree();
            tree = addChild(tree, {type: 'date', d: '>=', t: 100});
            const before = tree.c.length;
            removeChild(tree, 0);
            expect(tree.c.length).toBe(before);
        });
    });

    describe('updateChild', () => {
        it('replaces a child at the given index', () => {
            let tree = createEmptyTree();
            tree = addChild(tree, {type: 'date', d: '>=', t: 100});
            tree = addChild(tree, {type: 'grade', id: 1});

            const updated: ConditionJSON = {type: 'grade', id: 2, min: 80};
            const result = updateChild(tree, 1, updated);

            expect(result.c[1]).toEqual(updated);
            expect(result.c[0]).toEqual({type: 'date', d: '>=', t: 100});
        });

        it('does not mutate the original tree', () => {
            let tree = createEmptyTree();
            tree = addChild(tree, {type: 'date', d: '>=', t: 100});
            const originalChild = tree.c[0];

            updateChild(tree, 0, {type: 'grade', id: 5});
            expect(tree.c[0]).toBe(originalChild);
        });
    });

    describe('setOperator', () => {
        it('changes the operator', () => {
            const tree = createEmptyTree('&');
            const result = setOperator(tree, '|');
            expect(result.op).toBe('|');
        });

        it('preserves children when changing operator', () => {
            let tree = createEmptyTree('&');
            tree = addChild(tree, {type: 'date', d: '>=', t: 100});

            const result = setOperator(tree, '!&');
            expect(result.c).toHaveLength(1);
            expect(result.op).toBe('!&');
        });

        it('does not mutate the original tree', () => {
            const tree = createEmptyTree('&');
            setOperator(tree, '|');
            expect(tree.op).toBe('&');
        });
    });

    describe('setChildVisibility', () => {
        it('sets a child visibility to false', () => {
            let tree = createEmptyTree();
            tree = addChild(tree, {type: 'date', d: '>=', t: 100}, true);
            tree = addChild(tree, {type: 'grade', id: 1}, true);

            const result = setChildVisibility(tree, 0, false);
            expect(result.showc).toEqual([false, true]);
        });

        it('sets a child visibility to true', () => {
            let tree = createEmptyTree();
            tree = addChild(tree, {type: 'date', d: '>=', t: 100}, false);

            const result = setChildVisibility(tree, 0, true);
            expect(result.showc).toEqual([true]);
        });

        it('does not mutate the original tree', () => {
            let tree = createEmptyTree();
            tree = addChild(tree, {type: 'date', d: '>=', t: 100}, true);

            setChildVisibility(tree, 0, false);
            expect(tree.showc).toEqual([true]);
        });
    });

    describe('addNestedSet', () => {
        it('adds an empty nested tree as a child', () => {
            const tree = createEmptyTree('&');
            const result = addNestedSet(tree, '|');

            expect(result.c).toHaveLength(1);
            expect(isTree(result.c[0])).toBe(true);

            const nested = result.c[0] as AvailabilityTree;
            expect(nested.op).toBe('|');
            expect(nested.c).toEqual([]);
        });

        it('defaults to AND operator for nested set', () => {
            const tree = createEmptyTree('|');
            const result = addNestedSet(tree);

            const nested = result.c[0] as AvailabilityTree;
            expect(nested.op).toBe('&');
        });

        it('sets showc to true for the nested set', () => {
            const tree = createEmptyTree();
            const result = addNestedSet(tree);
            expect(result.showc).toEqual([true]);
        });
    });
});
