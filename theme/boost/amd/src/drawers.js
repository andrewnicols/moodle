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
 * Toggling the visibility of the secondary navigation on mobile.
 *
 * @package    theme_boost
 * @copyright  2021 Bas Brands
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import ModalBackdrop from 'core/modal_backdrop';
import Templates from 'core/templates';
import * as Aria from 'core/aria';
import {dispatchEvent} from 'core/event_dispatcher';
import {debounce} from 'core/utils';

let backdropPromise = null;

const drawerMap = new Map();

export const eventTypes = {
    /**
     * An event triggered before a drawer is shown.
     *
     * @event theme_boost/drawers:show
     * @type {CustomEvent}
     * @property {HTMLElement} target The drawer that will be opened.
     */
    drawerShow: 'theme_boost/drawers:show',

    /**
     * An event triggered after a drawer is shown.
     *
     * @event theme_boost/drawers:shown
     * @type {CustomEvent}
     * @property {HTMLElement} target The drawer that was be opened.
     */
    drawerShown: 'theme_boost/drawers:shown',

    /**
     * An event triggered before a drawer is hidden.
     *
     * @event theme_boost/drawers:hide
     * @type {CustomEvent}
     * @property {HTMLElement} target The drawer that will be hidden.
     */
    drawerHide: 'theme_boost/drawers:hide',

    /**
     * An event triggered after a drawer is hidden.
     *
     * @event theme_boost/drawers:hidden
     * @type {CustomEvent}
     * @property {HTMLElement} target The drawer that was be hidden.
     */
    drawerHidden: 'theme_boost/drawers:hidden',
};

/**
 * Maximum sizes for breakpoints. This needs to correspond with Bootstrap
 * Breakpoints
 */
const sizes = {
    medium: 991,
    large: 1200
};

const getCurrentWidth = () => {
    const DomRect = document.body.getBoundingClientRect();
    return DomRect.x + DomRect.width;
};
const isSmall = () => {
    const browserWidth = getCurrentWidth();
    return browserWidth < sizes.medium;
};

/**
 * Check if the user uses a medium size browser.
 * @returns {Bool} true if the body is smaller than sizes.medium max size.
 * @private
 */
const isMedium = () => {
    const browserWidth = getCurrentWidth();
    return (browserWidth >= sizes.medium) && (browserWidth < sizes.large);
};

/**
 * Check if the user uses a large size browser.
 * @returns {Bool} true if the body is smaller than sizes.large max size.
 * @private
 */
const isLarge = () => {
    const browserWidth = getCurrentWidth();
    return browserWidth >= sizes.large;
};

/**
 * Add a backdrop to the page.
 *
 * @return {Promise} rendering of modal backdrop.
 */
const getBackdrop = () => {
    if (!backdropPromise) {
        backdropPromise = Templates.render('core/modal_backdrop', {})
        .then(html => new ModalBackdrop(html))
        .then(modalBackdrop => {
            modalBackdrop.getAttachmentPoint().get(0).addEventListener('click', e => {
                e.preventDefault();
                Drawers.closeAllDrawers();
            });
            return modalBackdrop;
        })
        .catch();
    }
    return backdropPromise;
};

export const Drawers = class {
    drawerNode = null;

    /**
     */
    get isOpen() {
        return this.drawerNode.classList.contains('show');
    }

    get closeOnResize() {
        return !!parseInt(this.drawerNode.dataset.closeOnResize);
    }

    constructor(drawerNode) {
        this.drawerNode = drawerNode;

        if (this.drawerNode.classList.contains('show')) {
            this.openDrawer();
        } else {
            Aria.hide(this.drawerNode);
        }

        drawerMap.set(drawerNode, this);
    }

    static getDrawerInstanceForNode(drawerNode) {
        if (!drawerMap.has(drawerNode)) {
            new Drawers(drawerNode);
        }

        return drawerMap.get(drawerNode);
    }

    dispatchEvent(name, cancelable) {
        return dispatchEvent(
            eventTypes[name],
            {
                drawerInstance: this,
            },
            this.drawerNode,
            {
                cancelable,
            }
        );
    }

    openDrawer() {
        const showEvent = dispatchEvent('drawerShow', true);
        if (showEvent.defaultPrevented) {
            return;
        }

        Aria.unhide(this.drawerNode);
        this.drawerNode.classList.add('show');

        const preference = this.drawerNode.dataset.preference;
        if (!isMedium() && preference) {
            M.util.set_user_preference(preference, true);
        }

        const state = this.drawerNode.dataset.state;
        if (state) {
            const page = document.getElementById('page');
            page.classList.add(state);
        }

        if (isSmall()) {
            getBackdrop().then(backdrop => {
                backdrop.show();

                // TODO
                const pageWrapper = document.getElementById('page-wrapper');
                pageWrapper.style.overflow = 'hidden';
                return backdrop;
            })
            .catch();
        }

        dispatchEvent('drawerShown');
    }

    closeDrawer() {
        const hideEvent = dispatchEvent('drawerHide', true);
        if (hideEvent.defaultPrevented) {
            return;
        }

        const preference = this.drawerNode.dataset.preference;
        if (!isMedium() && preference) {
            M.util.set_user_preference(preference, false);
        }

        const state = this.drawerNode.dataset.state;
        if (state) {
            const page = document.getElementById('page');
            page.classList.remove(state);
        }

        Aria.hide(this.drawerNode);
        this.drawerNode.classList.remove('show');

        getBackdrop().then(backdrop => {
            backdrop.hide();

            if (isMedium()) {
                const pageWrapper = document.getElementById('page-wrapper');
                pageWrapper.style.overflow = 'auto';
            }
            return backdrop;
        })
        .catch();

        dispatchEvent('drawerHidden');
    }

    toggleVisibility() {
        if (this.drawerNode.classList.contains('show')) {
            this.closeDrawer();
        } else {
            this.openDrawer();
        }
    }

    static closeAllDrawers() {
        drawerMap.forEach(drawerInstance => {
            drawerInstance.closeDrawer();
        });
    }

    static closeOtherDrawers(comparisonInstance) {
        drawerMap.forEach(drawerInstance => {
            if (drawerInstance === comparisonInstance) {
                return;
            }

            drawerInstance.closeDrawer();
        });
    }
};

/**
 * Activate the scroller helper for the drawer layout.
 */
const scroller = () => {
    const body = document.querySelector('body');
    const drawerLayout = document.querySelector('#page.drawers');
    drawerLayout.addEventListener("scroll", () => {
        if (drawerLayout.scrollTop >= window.innerHeight) {
            body.classList.add('scrolled');
        } else {
            body.classList.remove('scrolled');
        }
    });
};

const registerListeners = () => {
    // Listen for show/hide events.
    document.addEventListener('click', e => {
        const toggleButton = e.target.closest('[data-toggle="drawers"][data-action="toggle"]');
        if (toggleButton && toggleButton.dataset.target) {
            e.preventDefault();
            const targetDrawer = document.getElementById(toggleButton.dataset.target);
            const drawerInstance = Drawers.getDrawerInstanceForNode(targetDrawer);

            drawerInstance.toggleVisibility();
        }

        const openDrawerButton = e.target.closest('[data-toggle="drawers"][data-action="opendrawer"]');
        if (openDrawerButton && openDrawerButton.dataset.target) {
            e.preventDefault();
            const targetDrawer = document.getElementById(openDrawerButton.dataset.target);
            const drawerInstance = Drawers.getDrawerInstanceForNode(targetDrawer);

            drawerInstance.openDrawer();
        }

        const closeDrawerButton = e.target.closest('[data-toggle="drawers"][data-action="closedrawer"]');
        if (closeDrawerButton && closeDrawerButton.dataset.target) {
            e.preventDefault();
            const targetDrawer = document.getElementById(closeDrawerButton.dataset.target);
            const drawerInstance = Drawers.getDrawerInstanceForNode(targetDrawer);

            drawerInstance.closeDrawer();
        }
    });

    // Close drawer when another drawer opens.
    document.addEventListener(eventTypes.drawerShow, e => {
        if (!isLarge()) {
            return;
        }
        Drawers.closeOtherDrawers(e.detail.drawerInstance);
    });

    const closeOnResizeListener = () => {
        if (isSmall()) {
            let anyOpen = false;
            drawerMap.forEach(drawerInstance => {
                if (drawerInstance.isOpen) {
                    if (drawerInstance.closeOnResize) {
                        drawerInstance.closeDrawer();
                    } else {
                        anyOpen = true;
                    }
                }
            });

            if (anyOpen) {
                getBackdrop().then(backdrop => backdrop.show()).catch();
            }
        } else {
            getBackdrop().then(backdrop => backdrop.hide()).catch();
        }
    };

    window.addEventListener('resize', debounce(closeOnResizeListener, 400));
};

/**
 * Activate all drawers for this page
 *
 * @param {String} drawer unique identifier for the drawer to toggle
 * @param {String} toggle unique identifier for the drawer toggle button
 */
export const init = () => {
    const drawers = document.querySelectorAll('[data-region="fixed-drawer"]');
    drawers.forEach(drawerNode => Drawers.getDrawerInstanceForNode(drawerNode));
};

scroller();
registerListeners();
