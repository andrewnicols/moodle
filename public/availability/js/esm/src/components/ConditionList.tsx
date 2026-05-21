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
 * Condition list component.
 *
 * Renders a group of conditions combined with a boolean operator, plus
 * controls for adding new conditions and nested sets.
 *
 * Supports arbitrary nesting — a list may contain both leaf conditions
 * and nested sub-lists.
 *
 * @module     core_availability/components/ConditionList
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useCallback, useState} from 'react';
import {Button} from '@moodlehq/design-system';
import type {AvailabilityTree, ConditionJSON} from '../types';
import {isTree} from '../tree';
import {useAvailability} from './AvailabilityContext';
import {OperatorSelector} from './OperatorSelector';
import {ConditionItem} from './ConditionItem';
import {DeleteButton} from './DeleteButton';

interface ConditionListProps {
    /** The tree node for this list. */
    tree: AvailabilityTree;
    /** Path to this list within the root tree (array of child indices). */
    path: number[];
    /** Whether this is the root list (cannot be deleted). */
    isRoot?: boolean;
}

export function ConditionList({tree, path, isRoot}: ConditionListProps) {
    const {plugins, dispatch} = useAvailability();
    const [newItemIndex, setNewItemIndex] = useState<number | null>(null);

    const handleOperatorChange = useCallback((op: typeof tree.op) => {
        dispatch({type: 'SET_OPERATOR', path, op});
    }, [dispatch, path]);

    const handleAddCondition = useCallback((conditionType: string) => {
        const condition: ConditionJSON = {type: conditionType, creating: true};
        const registration = plugins.get(conditionType);
        const show = registration ? !registration.displayMode : true;
        dispatch({type: 'ADD_CONDITION', path, condition, show});
        setNewItemIndex(tree.c.length);
    }, [dispatch, path, tree.c.length, plugins]);

    const handleAddNestedSet = useCallback(() => {
        dispatch({type: 'ADD_NESTED_SET', path});
    }, [dispatch, path]);

    const handleDeleteList = useCallback(() => {
        // The parent list needs to know the index. The path encodes this:
        // path is [...parentPath, thisIndex].
        if (path.length > 0) {
            const parentPath = path.slice(0, -1);
            const index = path[path.length - 1];
            dispatch({type: 'REMOVE_CONDITION', path: parentPath, index});
        }
    }, [dispatch, path]);

    // Collect addable plugins for the dropdown.
    const addablePlugins = Array.from(plugins.values()).filter((p) => p.allowAdd);

    return (
        <div
            className={`availability-list ${isRoot ? 'availability-list-root' : 'availability-childlist'}`}
            role="group"
            aria-label="Condition group"
        >
            {/* Header: operator selector */}
            <div className="availability-header d-flex align-items-center gap-2 mb-2">
                <span className="availability-connector">Student</span>
                <OperatorSelector
                    value={tree.op}
                    onChange={handleOperatorChange}
                    disabled={tree.c.length <= 1}
                />
                {!isRoot && <DeleteButton onDelete={handleDeleteList} label="Delete condition group" />}
            </div>

            {/* Children */}
            <div className="availability-children ps-3">
                {tree.c.length === 0 && (
                    <div className="availability-none text-muted px-3 mb-2">
                        No conditions added yet.
                    </div>
                )}

                {tree.c.map((child, index) => {
                    const visible = tree.showc?.[index] ?? true;

                    if (isTree(child)) {
                        return (
                            <ConditionList
                                key={`nested-${index}`}
                                tree={child}
                                path={[...path, index]}
                            />
                        );
                    }

                    return (
                        <ConditionItem
                            key={`item-${index}`}
                            condition={child as ConditionJSON}
                            path={path}
                            index={index}
                            visible={visible}
                            isNew={newItemIndex === index}
                        />
                    );
                })}
            </div>

            {/* Footer: add buttons */}
            <div className="availability-buttons d-flex gap-2 mt-2">
                {addablePlugins.length > 0 && (
                    <AddConditionDropdown
                        plugins={addablePlugins}
                        onAdd={handleAddCondition}
                    />
                )}
                <Button
                    variant="outline-secondary"
                    size="sm"
                    label="Add condition group"
                    onClick={handleAddNestedSet}
                />
            </div>
        </div>
    );
}

// --- Add condition dropdown ---

interface AddConditionDropdownProps {
    plugins: Array<{name: string; allowAdd: boolean}>;
    onAdd: (type: string) => void;
}

function AddConditionDropdown({plugins, onAdd}: AddConditionDropdownProps) {
    const [selectedType, setSelectedType] = useState('');

    const handleAdd = () => {
        if (selectedType) {
            onAdd(selectedType);
            setSelectedType('');
        }
    };

    return (
        <div className="availability-add d-flex gap-1">
            <select
                className="form-select form-select-sm"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                aria-label="Condition type to add"
            >
                <option value="">Add restriction...</option>
                {plugins.map((p) => (
                    <option key={p.name} value={p.name}>
                        {p.name}
                    </option>
                ))}
            </select>
            <Button
                variant="primary"
                size="sm"
                label="Add"
                onClick={handleAdd}
                disabled={!selectedType}
            />
        </div>
    );
}
