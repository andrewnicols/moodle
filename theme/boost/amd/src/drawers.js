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
import Notification from 'core/notification';
import * as Aria from 'core/aria';

let backdropPromise = null;
const pageWrapper = document.getElementById('page-wrapper');
const page = document.getElementById('page');

/**
 * Maximum sizes for breakpoints. This needs to correspond with Bootstrap
 * Breakpoints
 */
const Sizes = {
    medium: 991,
    large: 1200
};

/**
 * Add a backdrop to the page.
 * @return {Promise} rendering of modal backdrop.
 */
const getBackdrop = () => {
    if (!backdropPromise) {
        backdropPromise = Templates.render('core/modal_backdrop', {})
            .then(html => {
                return new ModalBackdrop(html);
            })
            .fail(Notification.exception);
    }
    return backdropPromise;
};

/**
 * Close the drawer
 *
 * @param {DOMElement} pageDrawer The drawer to close.
 * @param {DOMElement} toggleButton The button toggling the drawer.
 * @param {Bool} closeBackdrop Remove the backdrop on closing.
 */
const closeDrawer = (pageDrawer, toggleButton, closeBackdrop = true) => {
    const preference = toggleButton.getAttribute('data-preference');
    const state = toggleButton.getAttribute('data-state');
    Aria.hide(pageDrawer);
    pageDrawer.classList.remove('show');

    if (state) {
        page.classList.remove(state);
    }
    if (!isMedium() && preference) {
        M.util.set_user_preference(preference, false);
    }

    if (isMedium() && closeBackdrop) {
        getBackdrop().then(backdrop => {
            backdrop.hide();
            pageWrapper.style.overflow = 'auto';
            return null;
        }).catch(Notification.exception);
    }
};

/**
 * Show the drawer
 *
 * @param {DOMElement} pageDrawer The drawer to open.
 * @param {DOMElement} toggleButton The button toggling the drawer.
 */
const showDrawer = (pageDrawer, toggleButton) => {
    const preference = toggleButton.getAttribute('data-preference');
    const state = toggleButton.getAttribute('data-state');

    Aria.unhide(pageDrawer);
    pageDrawer.classList.add('show');

    if (!isMedium() && preference) {
        M.util.set_user_preference(preference, true);
    }

    if (state) {
        page.classList.add(state);
    }

    if (isMedium()) {
        window.console.log('showbackdrop');
        getBackdrop().then(backdrop => {
            backdrop.show();
            pageWrapper.style.overflow = 'hidden';
            backdrop.getRoot()[0].addEventListener('click', () => {
                closeDrawer(pageDrawer);
            });
            return null;
        }).catch(Notification.exception);
    }

    const trigger = pageDrawer.getAttribute('data-trigger');
    if (trigger) {
        pageDrawer.dispatchEvent(new CustomEvent('show-boost-drawer', {bubbles: true, detail: trigger}));
    }
};

/**
 * Check if the user uses a medium size browser.
 * @returns {Bool} true if the body is smaller than Sizes.medium max size.
 */
const isMedium = () => {
    const DomRect = document.body.getBoundingClientRect();
    return (DomRect.x + DomRect.width) <= Sizes.medium;
};

/**
 * Check if the user uses a medium size browser.
 * @returns {Bool} true if the body is smaller than Sizes.large max size.
 */
const isLarge = () => {
    const DomRect = document.body.getBoundingClientRect();
    return (DomRect.x + DomRect.width) <= Sizes.large;
};

/**
 * Activate the event listeners for this drawer.
 *
 * @param {DOMElement} pageDrawer the drawer
 * @param {DOMElement} toggleButton the button that toggles the drawer
*/
const activateDrawer = (pageDrawer, toggleButton) => {
    const closeButton = pageDrawer.querySelector('[data-action="closedrawer"]');

    if (!pageDrawer.classList.contains('show')) {
        Aria.hide(pageDrawer);
    }

    toggleButton.addEventListener('click', () => {
        if (pageDrawer.classList.contains('show')) {
            closeDrawer(pageDrawer, toggleButton);
            toggleButton.focus();
        } else {
            showDrawer(pageDrawer, toggleButton);
            closeButton.focus();
        }
    });

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            closeDrawer(pageDrawer, toggleButton);
            toggleButton.focus();
        });
    }

    if (toggleButton.getAttribute('data-closeonresize')) {
        window.addEventListener('resize', () => {
            if (isLarge() && !isMedium()) {
                closeDrawer(pageDrawer, toggleButton);
            }
        });
    }

    // Close drawer when another drawer opens.
    document.addEventListener('show-boost-drawer', e => {
        const trigger = pageDrawer.getAttribute('data-trigger');
        if (trigger != e.detail && isLarge()) {
            closeDrawer(pageDrawer, toggleButton, false);
        }
    });
    pageDrawer.setAttribute('initialised', 'true');
};

/** Activate the scroller helper for the drawer layout
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
 * Activate all drawers for this page
 *
 * @param {String} drawer unique identifier for the drawer to toggle
 * @param {String} toggle unique identifier for the drawer toggle button
 */
export const init = () => {
    scroller();
    const drawers = document.querySelectorAll('[data-region="fixed-drawer"]');
    drawers.forEach((pageDrawer) => {
        if (!pageDrawer.hasAttribute('initialised')) {
            const trigger = pageDrawer.getAttribute('data-trigger');
            if (trigger) {
                const toggleButton = document.querySelector(`[data-action="${trigger}"]`);
                if (toggleButton) {
                    activateDrawer(pageDrawer, toggleButton);
                }
            }
        }
    });
};
