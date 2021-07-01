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
 * A javascript module that enhances a button and text container to support copy-to-clipboard functionality.
 *
 * @module     core/copy_to_clipboard
 * @copyright  2021 Jun Pataleta
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {get_string as getString} from 'core/str';
import {add as addToast} from 'core/toast';
import {exception as displayException} from 'core/notification';

const addEventListeners = () => {
    document.addEventListener('click', e => {
        const copyButton = e.target.closest('[data-action="copytoclipboard"]');
        if (!copyButton) {
            return;
        }

        if (!copyButton.dataset.clipboardTarget) {
            return;
        }

        const copyTarget = document.querySelector(copyButton.dataset.clipboardTarget);
        if (!copyTarget) {
            return;
        }

        // This is a copy target and there is content.
        // Prevent the default action.
        e.preventDefault();

        // We have a copy target - great. Let's copy it's content.
        const textToCopy = getTextFromContainer(copyTarget);
        if (textToCopy) {
            const messageIdentifier = copyButton.dataset.clipboardSuccessMessageIdentifier || 'copiedtoclipboard';
            const messageComponent = copyButton.dataset.clipboardSuccessMessageComponent || 'core';

            if (navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy)
                .then(() => getString(messageIdentifier, messageComponent))
                .then(message => addToast(message))
                .catch(displayException);

                return;
            }
            // The clipboard API is not available.
            // This may happen when the page is not served over SSL.
        }

        if (copyTarget instanceof HTMLInputElement) {
            copyTarget.focus();
            copyTarget.select();
        }

        getString('unabletocopytoclipboard', 'core')
        .then(message => addToast(message))
        .catch(displayException);
    });
};

const getTextFromContainer = container => {
    if (container.value) {
        // For containers which are form elements (e.g. text area, text input), get the element's value.
        return container.value;
    } else if (container.innerText) {
        // For other elements, try to use the innerText attribute.
        return container.innerText;
    }

    return null;
};

let loaded = false;
if (!loaded) {
    addEventListeners();
    loaded = true;
}
