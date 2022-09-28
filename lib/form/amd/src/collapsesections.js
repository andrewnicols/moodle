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
 * Collapse or expand all form sections on clicking the expand all / collapse al link.
 *
 * @module core_form/collapsesections
 * @copyright 2021 Bas Brands
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since 4.0
 */

import $ from 'jquery';
import Pending from 'core/pending';

const selectors = {
    header: '.fheader',
    container: '.fcontainer',
    uncollapsedSections: '.fcontainer:not(.show)',
};

const classes = {
    collapsed: 'collapsed'
};

const setAllExpanded = (collapseMenu) => {
    collapseMenu.classList.remove(classes.collapsed);
    collapseMenu.setAttribute('aria-expanded', true);
};

const setSomeCollapsed = (collapseMenu) => {
    collapseMenu.classList.add(classes.collapsed);
    collapseMenu.removeAttribute('aria-expanded', true);
};

const updateCollapseMenu = (collapseMenu) => {
    if (!document.querySelectorAll(selectors.uncollapsedSections).length) {
        setAllExpanded(collapseMenu);
    } else {
        setSomeCollapsed(collapseMenu);
    }
};

const toggleAllSections = (collapseMenu) => {
    const collapsed = collapseMenu.classList.contains(classes.collapsed);

    document.querySelectorAll(selectors.container).forEach((collapseContainer) => {
        $(collapseContainer).collapse(collapsed ? 'show' : 'hide');
    });
    collapseMenu.classList.toggle(classes.collapsed);
};

/**
 * Initialises the form section collapse / expand action.
 *
 * @param {string} collapseSections the collapse/expand link id.
 */
export const init = (collapseSections) => {
    // All jQuery in this code can be replaced when MDL-71979 is integrated (move to Bootstrap 5).
    const pendingPromise = new Pending('core_form/collapseSections');
    const collapseMenu = document.querySelector(collapseSections);
    collapseMenu.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleAllSections(collapseMenu);
        }
    });
    collapseMenu.addEventListener('click', () => toggleAllSections(collapseMenu));

    // Ensure collapse menu button adds aria-controls attribute referring to each collapsible element.
    const collapsibleElementIds = Array.from(document.querySelectorAll(selectors.header)).map((element, index) => {
        if (!element.id) {
            element.id = `collapsible-${index}`;
        }

        return element.id;
    });
    collapseMenu.setAttribute('aria-controls', collapsibleElementIds.join(' '));

    $(selectors.container).on('hidden.bs.collapse shown.bs.collapse', () => updateCollapseMenu(collapseMenu));
    updateCollapseMenu(collapseMenu);

    pendingPromise.resolve();
};
