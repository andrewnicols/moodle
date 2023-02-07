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

import Modal from './modal';
import ModalFactory from './modal_factory';
import ModalRegistry from './modal_registry';
import 'core/copy_to_clipboard';

/**
 * Permalink modal.
 *
 * @module     core/modal_permalink
 * @copyright  2023 Stephan Robotta <stephan.robotta@bfh.ch>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
export default class PermalinkModal extends Modal {
    static TYPE = 'core/permalink';
    static TEMPLATE = 'core/modal_permalink';

    constructor(...config) {
        // Override the constructor to set the removeOnClose property, and show the modal.
        super(...config);
        this.setRemoveOnClose(true);
        this.show();
    }

    /**
     * Set up all of the event handling for the modal.
     *
     * This is an override of the parent method, adding an event listener to close upon the action.
     *
     * @param {array} args
     */
    registerEventListeners(...args) {
        super.registerEventListeners(...args);

        this.getRoot().get(0).addEventListener('click', (e) => {
            if (!e.target.closest('[data-action="copytoclipboard"]')) {
                return;
            }

            if (!this.getRoot().get(0).contains(e.target)) {
                return;
            }

            // Note: We must call destroy() here, because the copy-to-clipboard action listens on the document,
            // which will be processed after this event listener has been processed.
            // By placing this in a setTimeout we move its processing to after the event loop has finished.
            setTimeout(this.destroy.bind(this));
        });
    }

    /**
     * Create an instance of the modal.
     *
     * @param {object} config
     * @param {string} config.link The link to be copied to the clipboard.
     * @param {string|Promise} title The title to use for the modal
     */
    static async create({link}, title) {
        if (!ModalRegistry.get(this.TYPE)) {
            ModalRegistry.register(this.TYPE, this, this.TEMPLATE);
        }

        const modal = await ModalFactory.create({
            type: this.TYPE,
            templateContext: {
                link,
            },
        });

        modal.setTitle(title);
    }
}
