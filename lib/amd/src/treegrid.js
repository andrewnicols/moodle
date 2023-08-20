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

import AriaSelectors from 'core/local/aria/selectors';

export default class TreeGrid {
    static createTreeGrid(
        treeElement,
    ) {
        return new TreeGrid(
            treeElement,
        );
    }

    /** @property {HTMLElement} treeElement */
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
    }

    handleClick(event) {
        // Get the focusable element that was focused on.
        const clickedItem = event.target;

        const focusableParent = clickedItem.closest(AriaSelectors.elements.focusable);
        if (focusableParent) {
            // If the clicked element is focusable, then focus on it.
            focusableParent.focus();

            // Do not prevent default. If the item clicked was actionable, that action should be respected.
            return;
        }

        const tabbableParent = clickedItem.closest(AriaSelectors.elements.tabbable);
        if (tabbableParent) {
            // If the clicked element is tabbable, then focus on it.
            tabbableParent.focus();

            // Do not prevent default. If the item clicked was actionable, that action should be respected.
            return;
        }
    }

    handleKeyDown(event) {
        window.console.log(this);
        // eslint-disable-next-line no-debugger
        debugger;
        // https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/#keyboardinteraction
        if (event.key === 'Enter') {
            return this.handleKeyEnter(event);
        }

        if (event.key === 'ArrowRight') {
            return this.handleKeyArrowRight(event);
        }

        if (event.key === 'ArrowLeft') {
            return this.handleKeyArrowLeft(event);
        }

        if (event.key === 'ArrowUp') {
            return this.handleKeyArrowUp(event);
        }

        if (event.key === 'ArrowDown') {
            return this.handleKeyArrowDown(event);
        }

        if (event.key === 'Home') {
            if (event.ctrl) {
                return this.handleKeyCtrlHome(event);
            } else {
                return this.handleKeyHome(event);
            }
        }

        if (event.key === 'End') {
            if (event.ctrl) {
                return this.handleKeyCtrlEnd(event);
            } else {
                return this.handleKeyEnd(event);
            }
        }
    }

    handleKeyEnter(event) {
        // If cell-only focus is enabled and focus is on the first cell with the aria-expanded property,
        // opens or closes the child rows.
        // Otherwise, performs the default action for the cell.
        event.preventDefault();
    }

    handleKeyArrowRight(event) {
        const focusedItem = this.getFocusedItem();

        // If focus is on a collapsed row, expands the row.
        if (focusedItem.getAttribute('aria-expanded') === 'false') {
            event.preventDefault();
            this.expandRow(focusedItem);
            return;
        }

        // If focus is on an expanded row or is on a row that does not have child rows, moves focus to the first cell in the row.
        if (focusedItem.getAttribute('aria-expanded') === 'true') {
            event.preventDefault();
            this.focusFirstCell(focusedItem);
            return;
        }

        // If focus is on the right-most cell in a row, focus does not move.
        if (!focusedItem.nextElementSibling) {
            return;
        }

        // If focus is on any other cell, moves focus one cell to the right.
        this.focusNextCell(focusedItem);
        event.preventDefault();
    }

    handleKeyArrowLeft(event) {
        const focusedItem = this.getFocusedItem();

        // If focus is on an expanded row, collapses the row.
        if (focusedItem.getAttribute('aria-expanded') === 'true') {
            event.preventDefault();
            this.collapseRow(focusedItem);
            return;
        }

        // If focus is on a collapsed row or on a row that does not have child rows, focus does not move.
        if (focusedItem.getAttribute('aria-expanded') === 'false') {
            return;
        }

        if (focusedItem.previousElementSibling === null) {
            if (this.rowFocusSupported()) {
                // If focus is on the first cell in a row and row focus is supported, moves focus to the row.
                event.preventDefault();
                this.focusRow(focusedItem);
                return;
            } else {
                // If focus is on the first cell in a row and row focus is not supported, focus does not move.
                return;
            }
        }

        // If focus is on any other cell, moves focus one cell to the left.
        this.focusPreviousCell(focusedItem);
        event.preventDefault();
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
            if (focusedItem.previousElementSibling === null) {
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
            if (focusedItem.nextElementSibling === null) {
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
            if (focusedItem.previousElementSibling === null) {
                // If focus is in the first row, focus does not move.
                return;
            }
            this.focusFirstRow(focusedItem);
            event.preventDefault();
            return;
        }

        if (this.isCell(focusedItem)) {
            // If focus is on a cell, moves focus to the first cell in the row.
            if (focusedItem.previousElementSibling === null) {
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
            if (focusedItem.nextElementSibling === null) {
                // If focus is in the last row, focus does not move.
                return;
            }
            this.focusLastRow(focusedItem);
            event.preventDefault();
            return;
        }

        if (this.isCell(focusedItem)) {
            // If focus is on a cell, moves focus to the last cell in the row.
            if (focusedItem.nextElementSibling === null) {
                // If focus is in the last cell of the row, focus does not move.
                return;
            }
            this.focusLastCell(focusedItem);
            event.preventDefault();
        }
    }

    handleKeyControlHome(event) {
        // TODO Check these.
        const focusedItem = this.getFocusedItem();

        // If focus is on a row, moves focus to the first row.
        if (this.isRow(focusedItem)) {
            if (this.getRowForItem(focusedItem).previousElementSibling === null) {
                // If focus is in the first row, focus does not move.
                return;
            }
            this.focusFirstRow(focusedItem);
            event.preventDefault();
            return;
        }

        // If focus is on a cell, moves focus to the first cell in the column.
        if (this.isCell(focusedItem)) {
            if (this.getRowForItem(focusedItem).previousElementSibling === null) {
                // If focus is in the first row, focus does not move.
                return;
            }
            this.focusFirstCellInRow(focusedItem);
            event.preventDefault();
        }
    }

    handleKeyControlEnd(event) {
        // TODO Check these.
        const focusedItem = this.getFocusedItem();

        // If focus is on a row, moves focus to the last row.
        if (this.isRow(focusedItem)) {
            if (this.getRowForItem(focusedItem).nextElementSibling === null) {
                // If focus is in the last row, focus does not move.
                return;
            }
            this.focusLastRow(focusedItem);
            event.preventDefault();
            return;
        }

        // If focus is on a cell, moves focus to the last cell in the column.
        if (this.isCell(focusedItem)) {
            if (this.getRowForItem(focusedItem).nextElementSibling === null) {
                // If focus is in the last row, focus does not move.
                return;
            }
            this.focusLastCellInRow(focusedItem);
            event.preventDefault();
        }
    }

    getFocusedItem() {
        return document.activeElement;
    }

    getFocusableElements(parent) {
        return Array.from(parent.closest(AriaSelectors.elements.focusable));
    }

    isRow(item) {
        return item.matches('tr');
    }

    isCell(item) {
        return item.closest('td');
    }

    focusCell(cell) {
        // Check for focusable child such as link or textbox
        // and use that if available
        const focusableChildren = this.getFocusableElements(cell);
        focus(focusableChildren[0] || cell);
    }

    focus(item) {
        // Ensure focusable.
        item.tabIndex = 0;
        item.focus();
    }

    getRowForItem(item) {
        return item.closest('tr');
    }

    expandRow(item) {
        item.setAttribute('aria-expanded', 'true');
    }

    collapseRow(item) {
        item.setAttribute('aria-expanded', 'false');
    }

    getCellWithItem(item) {
        return item.closest('td');
    }

    getNavigableColumns(row) {
        return Array.from(row.getElementsByTagName('td'));
    }

    getFirstRow() {
        return this.treeElement.querySelector('tr');
    }

    getLastRow() {
        return this.treeElement.querySelector('tr:last-child');
    }

    getPreviousRow(item) {
        return this.getRowForItem(item).previousElementSibling;
    }

    getNextRow(item) {
        return this.getRowForItem(item).nextElementSibling;
    }

    focusSameCellInRow(currentItem, targetRow) {
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

    focusRowAbove(item) {
        this.focus(this.getPreviousRow(item));
    }

    focusRowBelow(item) {
        this.focus(this.getNextRow(item));
    }

    focusFirstCell(row) {
        this.focus(row.querySelector('td'));
    }

    focusLastCell(row) {
        this.focus(row.querySelectorAll('td').pop());
    }

    focusFirstCellInRow(item) {
        this.focusFirstCell(this.getRowForItem(item));
    }

    focusLastCellInRow(item) {
        this.focusLastCell(this.getRowForItem(item));
    }

    focusNextCell(item) {
        this.focus(item.nextElementSibling);
    }

    focusPreviousCell(item) {
        focus(item.previousElementSibling);
    }

    rowFocusSupported() {
        if ('focusRows' in this.treeElement.dataset) {
            // TODO Consider what a falsty value may look like...
            return this.treeElement.dataset.focusRows;
        }
        return true;
    }
}
