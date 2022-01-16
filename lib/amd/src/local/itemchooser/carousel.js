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
 * A tab containing a set of items.
 *
 * @module     core/local/itemchooser/carousel
 * @copyright  2021 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import * as Templates from 'core/templates';
import {BaseComponent} from 'core/reactive';
import {addIconToContainer} from 'core/loadingicon';
import jQuery from 'jquery';

export default class extends BaseComponent {
    create() {
        this.name = 'carousel';

        this.selectors = {
            item: '.carousel-item',
        };
    }

    stateReady() {
        jQuery(this.getElement()).carousel({
            interval: false,
            pause: true,
            keyboard: false,
        });
        this.addEventListener(
            this.getElement(),
            'click',
            this._handleResponse,
        );
    }

    getWatchers() {
        return [{
            watch: 'carousel:updated',
            handler: this._refreshVisibility,
        }];
    }

    _handleResponse(e) {
        const backButton = e.target.closest('[data-action="close-chooser-option-summary"]');
        if (backButton) {
            e.preventDefault();
            this.reactive.dispatch('setPanel', 'items');
        }
    }

    _refreshVisibility({element}) {
        // Move to the next slide, and resolve the transition promise when it's done.
        const carousel = jQuery(this.getElement());

        if (element.id === 'help' && element.isActive) {
            this.showModuleHelp(element.item);
            carousel.carousel('next');
        } else if (element.isActive) {
            carousel.carousel('prev');
        }

        return;
    }

    showModuleHelp(moduleData, modal = null) {
        const help = this.getElement(this.selectors.item, 'help');

        // If we have a real footer then we need to change temporarily.
        if (modal !== null && moduleData.showFooter === true) {
            modal.setFooter(Templates.render('core_course/local/activitychooser/footer_partial', moduleData));
        }

        help.innerHTML = '';
        help.classList.add('m-auto');

        // Add a spinner.
        const spinnerPromise = addIconToContainer(help);

        // Used later...
        let transitionPromiseResolver = null;
        const transitionPromise = new Promise(resolve => {
            transitionPromiseResolver = resolve;
        });

        // Build up the html & js ready to place into the help section.
        const contentPromise = Templates.renderForPromise(
            'core_course/local/activitychooser/help',
            Object.assign({}, moduleData)
        );

        // Wait for the content to be ready, and for the transition to be complet.
        Promise.all([contentPromise, spinnerPromise, transitionPromise])
        .then(([{html, js}]) => Templates.replaceNodeContents(help, html, js))
        .then(() => {
            // TODO
            help.querySelector('[data-region="summary-header"]').focus();
            return;
        })
        .catch(Notification.exception);

        // Move to the next slide, and resolve the transition promise when it's done.
        const carousel = jQuery(this.getElement());
        carousel.one('slid.bs.carousel', () => {
            transitionPromiseResolver();
        });
    }
}
