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
 * @module     theme_boost/drawers
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

/**
 * Maximum sizes for breakpoints. This needs to correspond with Bootstrap
 * Breakpoints
 *
 * @private
 */
const sizes = {
    medium: 991,
    large: 1200
};

const getCurrentWidth = () => {
    const DomRect = document.body.getBoundingClientRect();
    return DomRect.x + DomRect.width;
};

/**
 * Check if the user uses a small size browser.
 *
 * @returns {Bool} true if the body is smaller than sizes.medium max size.
 * @private
 */
const isSmall = () => {
    const browserWidth = getCurrentWidth();
    return browserWidth < sizes.medium;
};

/**
 * Check if the user uses a medium size browser.
 *
 * @returns {Bool} true if the body is smaller than sizes.medium max size.
 * @private
 */
const isMedium = () => {
    const browserWidth = getCurrentWidth();
    return (browserWidth >= sizes.medium) && (browserWidth < sizes.large);
};

/**
 * Check if the user uses a large size browser.
 *
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
 * @returns {Promise} rendering of modal backdrop.
 * @private
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

/**
 * The Drawers class is used to control on-screen drawer elements.
 *
 * It handles opening, and closing of drawer elements, as well as more detailed behaviours such as closing a drawer when
 * another drawer is opened, and supports closing a drawer when the screen is resized.
 *
 * Drawers are instantiated on page load, and can also be toggled lazily when toggling any drawer toggle, open button,
 * or close button.
 *
 * A range of show and hide events are also dispatched as detailed in the class
 * {@link module:theme_boost/drawers#eventTypes eventTypes} object.
 *
 * @example <caption>Standard usage</caption>
 *
 * // The module just needs to be included to add drawer support.
 * import 'theme_boost/drawers';
 *
 * @example <caption>Manually open or close any drawer</caption>
 *
 * import Drawers from 'theme_boost/drawers';
 *
 * const myDrawer = Drawers.getDrawerInstanceForNode(document.querySelector('.myDrawerNode');
 * myDrawer.closeDrawer();
 *
 * @example <caption>Listen to the before show event and cancel it</caption>
 *
 * import Drawers from 'theme_boost/drawers';
 *
 * document.addEventListener(Drawers.eventTypes.drawerShow, e => {
 *     // The drawer which will be shown.
 *     window.console.log(e.target);
 *
 *     // The instance of the Drawers class for this drawer.
 *     window.console.log(e.detail.drawerInstance);
 *
 *     // Prevent this drawer from being shown.
 *     e.preventDefault();
 * });
 *
 * @example <caption>Listen to the shown event</caption>
 *
 * document.addEventListener(Drawers.eventTypes.drawerShown, e => {
 *     // The drawer which was shown.
 *     window.console.log(e.target);
 *
 *     // The instance of the Drawers class for this drawer.
 *     window.console.log(e.detail.drawerInstance);
 * });
 */
export default class Drawers {
    /**
     * The underlying HTMLElement which is controlled.
     */
    drawerNode = null;

    constructor(drawerNode) {
        this.drawerNode = drawerNode;

        if (this.drawerNode.classList.contains('show')) {
            this.openDrawer();
        } else {
            Aria.hide(this.drawerNode);
        }

        drawerMap.set(drawerNode, this);
    }

    /**
     * Whether the drawer is open.
     *
     * @returns {bool}
     */
    get isOpen() {
        return this.drawerNode.classList.contains('show');
    }

    /**
     * Whether the drawer should close when the window is resized
     *
     * @returns {bool}
     */
    get closeOnResize() {
        return !!parseInt(this.drawerNode.dataset.closeOnResize);
    }

    /**
     * The list of event types.
     *
     * @static
     * @property {String} drawerShow See {@link event:theme_boost/drawers:show}
     * @property {String} drawerShown See {@link event:theme_boost/drawers:shown}
     * @property {String} drawerHide See {@link event:theme_boost/drawers:hide}
     * @property {String} drawerHidden See {@link event:theme_boost/drawers:hidden}
     */
    static eventTypes = {
        /**
         * An event triggered before a drawer is shown.
         *
         * @event theme_boost/drawers:show
         * @type {CustomEvent}
         * @property {HTMLElement} target The drawer that will be opened.
         */
        drawerShow: 'theme_boost/drawers.show',

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
     * Get the drawer instance for the specified node
     *
     * @param {NodeElement} drawerNode
     * @returns {module:theme_boost/drawers}
     */
    static getDrawerInstanceForNode(drawerNode) {
        if (!drawerMap.has(drawerNode)) {
            new Drawers(drawerNode);
        }

        return drawerMap.get(drawerNode);
    }

    dispatchEvent(name, cancelable = false) {
        return dispatchEvent(
            Drawers.eventTypes[name],
            {
                drawerInstance: this,
            },
            this.drawerNode,
            {
                cancelable,
            }
        );
    }

    /**
     * Open the drawer.
     */
    openDrawer() {
        const showEvent = this.dispatchEvent('drawerShow', true);
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

        this.dispatchEvent('drawerShown');
    }

    /**
     * Close the drawer.
     */
    closeDrawer() {
        const hideEvent = this.dispatchEvent('drawerHide', true);
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

        this.dispatchEvent('drawerHidden');
    }

    /**
     * Toggle visibility of the drawer.
     */
    toggleVisibility() {
        if (this.drawerNode.classList.contains('show')) {
            this.closeDrawer();
        } else {
            this.openDrawer();
        }
    }

    /**
     * Close all drawers.
     */
    static closeAllDrawers() {
        drawerMap.forEach(drawerInstance => {
            drawerInstance.closeDrawer();
        });
    }

    /**
     * Close all drawers except for the specified drawer.
     *
     * @param {module:theme_boost/drawers} comparisonInstance
     */
    static closeOtherDrawers(comparisonInstance) {
        drawerMap.forEach(drawerInstance => {
            if (drawerInstance === comparisonInstance) {
                return;
            }

            drawerInstance.closeDrawer();
        });
    }
}

/**
 * Activate the scroller helper for the drawer layout.
 *
 * @private
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

/**
 * Register the event listeners for the drawer.
 *
 * @private
 */
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
    document.addEventListener(Drawers.eventTypes.drawerShow, e => {
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

scroller();
registerListeners();

const drawers = document.querySelectorAll('[data-region="fixed-drawer"]');
drawers.forEach(drawerNode => Drawers.getDrawerInstanceForNode(drawerNode));
