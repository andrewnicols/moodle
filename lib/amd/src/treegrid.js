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
 * An implementation of the TreeGrid design pattern.
 *
 * Note: The table must be configured correctly with all relevant ARIA attributes already set, including:
 * - aria-expanded
 * - aria-level
 * - aria-hidden
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/treegrid
 *
 * @module     core/treegrid
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @example <caption>Example of creating a new TreeGrid.</caption>
 * import TreeGrid from 'core/treegrid;
 *
 * new TreeGrid(document.querySelector('#my-table'));
 */

import AriaSelectors from 'core/local/aria/selectors';

/**
 * The TreeGrid class.
 *
 * Note: Once instantiated, it is not expected that any further configuration of the table will be required.
 * Therefore the entire API is considered private.
 *
 * @class TreeGrid
 */
export default class TreeGrid {
    /**
     * Create an instance of the TreeGrid for the specified Table.
     *
     * @param {HTMLTableElement} treeElement The table to apply the treegrid to.
     * @returns {TreeGrid}
     * @example <caption>Example of creating a new TreeGrid using the static helper.</caption>
     * import TreeGrid from 'core/treegrid;
     *
     * TreeGrid.createTreeGrid(document.querySelector('#my-table'));
     *
     * @example <caption>Example of creating a new TreeGrid using the static helper from PHP.</caption>
     * $PAGE->requires->js_call_amd('core/treegrid', 'createTreeGrid', ['#my-table']);
     */
    static createTreeGrid(
        treeElement,
    ) {
        return new TreeGrid(
            treeElement,
        );
    }

    /**
     * @property {HTMLElement} treeElement The table to apply the treegrid to.
     * @private
     */
    treeElement;

    constructor(
        treeElement,
    ) {
        this.treeElement = treeElement;
        this.registerEventListeners();
        this.initialiseAttributes();
    }

    initialiseAttributes() {
        this.treeElement.querySelectorAll(AriaSelectors.elements.focusable).forEach((element) => {
            // Makes the element focusable without including it in the tab sequence of the page.
            element.setAttribute('tabindex', '-1');
        });

        Array.from(this.treeElement.querySelectorAll('tr')).reverse().forEach((rowElement) => {
            rowElement.setAttribute('tabindex', '-1');
        });

        // Includes the element in the tab sequence.
        // Only one row or gridcell in the treegrid has tabindex = "0".
        // In this implementation, the first row in the treegrid is included in the tab sequence when the page loads.
        // When the user moves focus in the treegrid, the element included in the tab sequence changes to the element
        // with focus as described in the practice for Managing Focus Within Components Using a Roving tabindex.
        // https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex
        this.getFirstRow().setAttribute('tabindex', '0');
    }

    registerEventListeners() {
        this.treeElement.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.treeElement.addEventListener('click', this.handleClick.bind(this));
        this.treeElement.addEventListener('focusin', this.handleFocusIn.bind(this));
    }

    shouldHandleEvent(eventTarget) {
        const nearestElementWithRole = eventTarget.closest('[role]');
        if (nearestElementWithRole !== this.treeElement) {
            return false;
        }

        return true;
    }

    handleFocusIn(event) {
        // Get the focused item.
        const focusedItem = event.target;
        if (!this.shouldHandleEvent(focusedItem)) {
            return;
        }

        // Get all items currently with a tabindex.
        const itemsWithTabIndex = Array.from(this.treeElement.querySelectorAll('[tabindex="0"]'));
        itemsWithTabIndex.filter((item) => item !== focusedItem).forEach((item) => {
            // Remove the tabindex from all items except the focused item.
            item.setAttribute('tabindex', -1);
        });
    }

    handleClick(event) {
        // Get the focusable element that was focused on.
        const clickedItem = event.target;
        if (!this.shouldHandleEvent(clickedItem)) {
            return;
        }

        const focusableParent = clickedItem.closest('input:not([type="hidden"]), a[href], button, textarea, select');
        if (focusableParent) {
            // If the clicked element is focusable, then focus on it.
            this.focus(focusableParent);

            // Do not prevent default. If the item clicked was actionable, that action should be respected.
            return;
        }

        const tabbableParent = clickedItem.closest(AriaSelectors.elements.tabbable);
        if (tabbableParent) {
            // If the clicked element is tabbable, then focus on it.
            this.focus(tabbableParent);

            // Do not prevent default. If the item clicked was actionable, that action should be respected.
            return;
        }
    }

    handleKeyDown(event) {
        if (!this.shouldHandleEvent(event.target)) {
            return;
        }

        // https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/#keyboardinteraction
        if (event.key === 'Enter') {
            this.handleKeyEnter(event);
            return;
        }

        if (event.key === 'Tab') {
            this.handleKeyTab(event);
            return;
        }

        if (event.key === 'ArrowRight') {
            this.handleKeyArrowRight(event);
            return;
        }

        if (event.key === 'ArrowLeft') {
            this.handleKeyArrowLeft(event);
            return;
        }

        if (event.key === 'ArrowUp') {
            this.handleKeyArrowUp(event);
            return;
        }

        if (event.key === 'ArrowDown') {
            this.handleKeyArrowDown(event);
            return;
        }

        if (event.key === 'Home') {
            if (event.ctrlKey) {
                this.handleKeyControlHome(event);
                return;
            } else {
                this.handleKeyHome(event);
                return;
            }
        }

        if (event.key === 'End') {
            if (event.ctrlKey) {
                this.handleKeyControlEnd(event);
                return;
            } else {
                this.handleKeyEnd(event);
                return;
            }
        }
    }

    handleKeyEnter(event) {
        // If cell-only focus is enabled and focus is on the first cell with the aria-expanded property,
        // opens or closes the child rows.
        if (this.cellOnlyFocusEnabled()) {
            event.preventDefault();
        }

        // Otherwise, performs the default action for the cell.
    }

    handleKeyTab(event) {
        const focusedItem = this.getFocusedItem();
        const row = this.getRowForItem(focusedItem);
        // If the row containing focus contains focusable elements (e.g., inputs, buttons, links, etc.),
        // moves focus to the next input in the row.
        const focusableRowElements = this.getFocusableElements(row);

        if (focusableRowElements.length > 0) {
            const focusedItem = this.getFocusedItem();
            const focusedItemIndex = focusableRowElements.indexOf(focusedItem);

            if (focusedItemIndex !== -1) {
                // The focused item is a focusable element in the row.
                // Find the next item in the row which is not just a cell.
                const getPossibleItems = () => {
                    if (event.shiftKey) {
                        return focusableRowElements.slice(0, focusedItemIndex).reverse();
                    }
                    return focusableRowElements.slice(focusedItemIndex + 1);
                };
                const nextItem = getPossibleItems().find((item) => {
                    return item.matches('input:not([type="hidden"]), a[href], button, textarea, select');
                });


                if (nextItem) {
                    event.preventDefault();
                    this.focus(nextItem);
                    return;
                }
            }

            // If focus is on the last focusable element in the row,
            // moves focus out of the treegrid widget to the next focusable element.
            return;
        }
    }

    handleKeyArrowRight(event) {
        const focusedItem = this.getFocusedItem();
        const isRow = this.isRow(focusedItem);
        const isCell = this.isCell(focusedItem);

        if (isRow) {
            // If focus is on a collapsed row, expands the row.
            if (this.isRowCollapsed(focusedItem)) {
                event.preventDefault();
                this.expandRow(focusedItem);
                return;
            }

            // If focus is on an expanded row or is on a row that does not have child rows,
            // moves focus to the first cell in the row.
            if (this.isRowExpanded(focusedItem) || this.isRow(focusedItem)) {
                event.preventDefault();
                this.focusFirstCell(focusedItem);
                return;
            }
        }

        if (isCell) {
            const cell = this.getCellWithItem(focusedItem);
            // If focus is on the right-most cell in a row, focus does not move.
            if (!cell.nextElementSibling) {
                return;
            }

            // If focus is on any other cell, moves focus one cell to the right.
            this.focusNextCell(cell);
            event.preventDefault();
        }
    }

    handleKeyArrowLeft(event) {
        const focusedItem = this.getFocusedItem();
        const isRow = this.isRow(focusedItem);
        const isCell = this.isCell(focusedItem);

        if (isRow) {
            // If focus is on an expanded row, collapses the row.
            if (this.isRowExpanded(focusedItem)) {
                event.preventDefault();
                this.collapseRow(focusedItem);
                return;
            }

            // If focus is on a collapsed row or on a row that does not have child rows, focus does not move.
            // Note: The TreeGrid example has an extra point:
            // https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/examples/treegrid-1/#kbd_label
            // If a row is focused, and it is collapsed, moves to the parent row (if there is one).
            if (this.isRowCollapsed(focusedItem) || !this.isRowCollapseSupported(focusedItem)) {
                // Attempt to find the parent.
                const parentRow = this.getParentRow(focusedItem);
                if (parentRow) {
                    event.preventDefault();
                    this.focus(parentRow);
                }
                return;
            }
        }

        if (isCell) {
            const cell = this.getCellWithItem(focusedItem);
            if (cell.previousElementSibling === null) {
                if (this.rowFocusSupported()) {
                    // If focus is on the first cell in a row and row focus is supported, moves focus to the row.
                    event.preventDefault();
                    this.focusCurrentRow(focusedItem);
                    return;
                } else {
                    // If focus is on the first cell in a row and row focus is not supported, focus does not move.
                    return;
                }
            }

            // If focus is on any other cell, moves focus one cell to the left.
            this.focusPreviousCell(cell);
            event.preventDefault();
        }
    }

    handleKeyArrowUp(event) {
        const focusedItem = this.getFocusedItem();

        // If focus is on a row, moves focus one row up.
        if (this.isRow(focusedItem)) {
            if (focusedItem.previousElementSibling === null) {
                // If focus is on the first row, focus does not move.
                return;
            }
            this.focusRowAbove(focusedItem);
            event.preventDefault();
            return;
        }

        // If focus is on a cell, moves focus one cell up.
        if (this.isCell(focusedItem)) {
            const owningRow = this.getRowForItem(focusedItem);
            if (owningRow.previousElementSibling === null) {
                // If focus is on the top cell in the column, focus does not move.
                return;
            }
            this.focusCellAbove(focusedItem);
            event.preventDefault();
        }
    }

    handleKeyArrowDown(event) {
        const focusedItem = this.getFocusedItem();

        // If focus is on a row, moves focus one row down.
        if (this.isRow(focusedItem)) {
            if (focusedItem.nextElementSibling === null) {
                // If focus is on the last row, focus does not move.
                return;
            }
            this.focusRowBelow(focusedItem);
            event.preventDefault();
            return;
        }

        // If focus is on a cell, moves focus one cell down.
        if (this.isCell(focusedItem)) {
            const owningRow = this.getRowForItem(focusedItem);
            if (owningRow.nextElementSibling === null) {
                // If focus is on the bottom cell in the column, focus does not move.
                return;
            }
            this.focusCellBelow(focusedItem);
            event.preventDefault();
        }
    }

    handleKeyHome(event) {
        // TODO Check these.
        const focusedItem = this.getFocusedItem();

        // If focus is on a row, moves focus to the first row.
        if (this.isRow(focusedItem)) {
            const row = this.getRowForItem(focusedItem);
            if (row.previousElementSibling === null) {
                // If focus is in the first row, focus does not move.
                return;
            }
            this.focusFirstRow(focusedItem);
            event.preventDefault();
            return;
        }

        if (this.isCell(focusedItem)) {
            const cell = this.getCellWithItem(focusedItem);
            // If focus is on a cell, moves focus to the first cell in the row.
            if (cell.previousElementSibling === null) {
                // If focus is in the first cell of the row, focus does not move.
                return;
            }
            this.focusFirstCell(focusedItem);
            event.preventDefault();
        }
    }

    handleKeyEnd(event) {
        // TODO Check these.
        const focusedItem = this.getFocusedItem();

        // If focus is on a row, moves focus to the last row.
        if (this.isRow(focusedItem)) {
            const row = this.getRowForItem(focusedItem);
            if (row.nextElementSibling === null) {
                // If focus is in the last row, focus does not move.
                return;
            }
            this.focusLastRow(focusedItem);
            event.preventDefault();
            return;
        }

        if (this.isCell(focusedItem)) {
            const cell = this.getCellWithItem(focusedItem);
            // If focus is on a cell, moves focus to the last cell in the row.
            if (cell.nextElementSibling === null) {
                // If focus is in the last cell of the row, focus does not move.
                return;
            }
            this.focusLastCell(focusedItem);
            event.preventDefault();
        }
    }

    handleKeyControlHome(event) {
        const focusedItem = this.getFocusedItem();

        // If focus is on a row, moves focus to the first row.
        if (this.isRow(focusedItem)) {
            const row = this.getRowForItem(focusedItem);
            if (row.previousElementSibling === null) {
                // If focus is in the first row, focus does not move.
                return;
            }
            this.focusFirstRow(focusedItem);
            event.preventDefault();
            return;
        }

        // If focus is on a cell, moves focus to the first cell in the column.
        // Note: There is a bug in the spec here. This should be the first _row_, not the first _cell_ in the column.
        // Corrected text follows.
        // https://github.com/w3c/aria-practices/pull/2779
        // If focus is on a cell, moves focus to the cell in the first row in the same column as the cell that had focus.
        if (this.isCell(focusedItem)) {
            if (this.isFirstRow(focusedItem)) {
                // If focus is in the first row, focus does not move.
                return;
            }
            this.focusSameCellInRow(focusedItem, this.getFirstRow());
            event.preventDefault();
        }
    }

    handleKeyControlEnd(event) {
        const focusedItem = this.getFocusedItem();

        // If focus is on a row, moves focus to the last row.
        if (this.isRow(focusedItem)) {
            const row = this.getRowForItem(focusedItem);
            if (row.nextElementSibling === null) {
                // If focus is in the last row, focus does not move.
                return;
            }
            this.focusLastRow(focusedItem);
            event.preventDefault();
            return;
        }

        // If focus is on a cell, moves focus to the last cell in the column.
        // Note: There is a bug in the spec here. This should be the last _row_, not the last _cell_ in the column.
        // Corrected text follows.
        // https://github.com/w3c/aria-practices/pull/2779
        // If focus is on a cell, moves focus to the cell in the last row in the same column as the cell that had focus.
        if (this.isCell(focusedItem)) {
            if (this.isLastRow(focusedItem)) {
                // If focus is in the last row, focus does not move.
                return;
            }
            this.focusSameCellInRow(focusedItem, this.getLastRow());
            event.preventDefault();
        }
    }

    getFocusedItem() {
        return document.activeElement;
    }

    getFocusableElements(
        parent,
        {
            includeTabIndex = false,
        } = {}
    ) {
        if (includeTabIndex) {
            return Array.from(parent.querySelectorAll(
                'input:not([type="hidden"]), a[href], button, textarea, select, [tabindex]'
            ));
        }
        return Array.from(parent.querySelectorAll(
            'input:not([type="hidden"]), a[href], button, textarea, select'
        ));
    }

    isRow(item) {
        return !!item.matches('tr');
    }

    isFirstRow(item) {
        const row = this.getRowForItem(item);
        return row === this.getFirstRow();
    }

    isLastRow(item) {
        const row = this.getRowForItem(item);
        return row === this.getLastRow();
    }

    isCell(item) {
        return !!this.getCellWithItem(item);
    }

    focusCell(cell) {
        // Check for focusable child such as link or textbox
        // and use that if available
        const focusableChildren = this.getFocusableElements(cell);
        this.focus(focusableChildren[0] || cell);
    }

    focus(item) {
        // Ensure focusable.
        item.tabIndex = 0;
        item.focus({
            // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#focusvisible
            // Note: this is an experimental feature.
            focusVisible: true,
        });
    }

    getRowForItem(item) {
        return item.closest('tr');
    }

    isRowExpanded(item) {
        // Note: We check for an exact value because not all rows support expansion.
        const row = this.getRowForItem(item);
        return row.getAttribute('aria-expanded') === 'true';
    }

    isRowCollapsed(item) {
        // Note: We check for an exact value because not all rows support expansion.
        const row = this.getRowForItem(item);
        return row.getAttribute('aria-expanded') === 'false';
    }

    isRowCollapseSupported(item) {
        const row = this.getRowForItem(item);
        return row.getAttribute('aria-expanded') !== null;
    }

    expandRow(item) {
        const row = this.getRowForItem(item);
        row.setAttribute('aria-expanded', true);
        this.getChildRows(row).forEach((childRow) => {
            childRow.setAttribute('aria-hidden', false);
        });
    }

    collapseRow(item) {
        const row = this.getRowForItem(item);
        this.getChildRows(row).forEach((childRow) => {
            childRow.setAttribute('aria-hidden', true);
        });
        row.setAttribute('aria-expanded', false);
    }

    getChildRows(parent) {
        const parentRow = this.getRowForItem(parent);
        const parentRowLevel = this.getRowLevel(parentRow);

        const allRows = this.getAllRows();
        const parentRowIndex = allRows.indexOf(parentRow);

        const possibleChildren = allRows.slice(parentRowIndex + 1);
        const childRows = [];
        for (const childRow of possibleChildren) {
            if (this.getRowLevel(childRow) === parentRowLevel + 1) {
                childRows.push(childRow);
            } else {
                break;
            }
        }

        return childRows;
    }

    getParentRow(child) {
        const childRow = this.getRowForItem(child);
        const childRowLevel = this.getRowLevel(childRow);

        const allRows = this.getAllRows();
        const childRowIndex = allRows.indexOf(childRow);
        const possibleParents = allRows.slice(0, childRowIndex).reverse();
        for (const parentRow of possibleParents) {
            if (this.getRowLevel(parentRow) === childRowLevel - 1) {
                return parentRow;
            }
        }
        return null;
    }

    getCellWithItem(item) {
        return item.closest('td');
    }

    getNavigableRows() {
        // Fetch all TR elements which are not in a THEAD.
        return this.getAllRows()
            .filter((row) => row.matches(':not([aria-hidden="true"]'));
    }

    getAllRows() {
        // Fetch all TR elements which are not in a THEAD.
        return Array.from(this.treeElement.querySelectorAll('tr'))
            .filter((row) => !row.closest('thead'));
    }

    getNavigableColumns(row) {
        return Array.from(row.getElementsByTagName('td'));
    }

    getFirstRow() {
        return this.getNavigableRows()?.shift();
    }

    getLastRow() {
        return this.getNavigableRows()?.pop();
    }

    getPreviousRow(item) {
        const allRows = this.getNavigableRows();
        const currentRow = this.getRowForItem(item);

        const index = allRows.indexOf(currentRow);
        if (index === 0) {
            return null;
        }

        return allRows[index - 1];
    }

    getNextRow(item) {
        const allRows = this.getNavigableRows();
        const currentRow = this.getRowForItem(item);

        const index = allRows.indexOf(currentRow);
        if (index >= allRows.length - 1) {
            return null;
        }

        return allRows[index + 1];
    }

    focusSameCellInRow(currentItem, targetRow) {
        if (!targetRow) {
            // The target row does nto exist.
            return;
        }
        const currentRow = this.getRowForItem(currentItem);
        const currentCols = this.getNavigableColumns(currentRow);
        const currentIndex = currentCols.indexOf(this.getCellWithItem(currentItem));

        const targetCols = this.getNavigableColumns(targetRow);
        this.focusCell(targetCols[currentIndex]);
    }

    focusCellAbove(item) {
        this.focusSameCellInRow(item, this.getPreviousRow(item));
    }

    focusCellBelow(item) {
        this.focusSameCellInRow(item, this.getNextRow(item));
    }

    focusCurrentRow(rowChild) {
        this.focus(this.getRowForItem(rowChild));
    }

    focusRowAbove(item) {
        this.focus(this.getPreviousRow(item));
    }

    focusRowBelow(item) {
        this.focus(this.getNextRow(item));
    }

    focusFirstRow() {
        this.focus(this.getFirstRow());
    }

    focusLastRow() {
        this.focus(this.getLastRow());
    }

    focusFirstCell(item) {
        const row = this.getRowForItem(item);
        this.focusCell(row.querySelector('td'));
    }

    focusLastCell(item) {
        const row = this.getRowForItem(item);
        const cells = this.getNavigableColumns(row);
        this.focusCell(cells[cells.length - 1]);
    }

    focusFirstCellInRow(item) {
        const row = this.getRowForItem(item);
        const cells = this.getNavigableColumns(row);
        this.focusCell(cells[0]);
    }

    focusLastCellInRow(item) {
        this.focusLastCell(this.getRowForItem(item));
    }

    focusNextCell(item) {
        this.focusCell(item.nextElementSibling);
    }

    focusPreviousCell(item) {
        this.focusCell(item.previousElementSibling);
    }

    cellOnlyFocusEnabled() {
        // We do not currently supported cell-only focus.
        return false;
    }

    rowFocusSupported() {
        if ('focusRows' in this.treeElement.dataset) {
            return this.treeElement.dataset.focusRows !== "false";
        }
        return true;
    }

    getRowLevel(row) {
        return parseInt(row.getAttribute('aria-level'));
    }
}
