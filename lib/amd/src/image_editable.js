/**
 * This file is part of Moodle - http://moodle.org/
 *
 * Moodle is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Moodle is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @package   image_editable
 * @copyright 2020 Bas Brands
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Ajax from 'core/ajax';
import Croppie from 'core/croppie';
import {get_string as getString} from 'core/str';
import Templates from 'core/templates';
import Notification from 'core/notification';

const selectors = {
    actions: {
        confirm: '[data-action="confirm"]',
        cancel: '[data-action="cancel"]',
        cropimage: '[data-action="cropimage"]',
        uploadimage: '[data-action="uploadimage"]',
        deleteimage: '[data-action="deleteimage"]'
    },
    regions: {
        imagehandler: '[data-region="imagehandler"]',
        imagecontrols: '[data-region="imagecontrols"]',
        alert: '.alert',
        zoomslider: '.cr-slider',
        editactions: '[data-region="editactions"]',
        confirmactions: '[data-region="confirmactions"]',
        ajaxing: '[data-region="ajaxing"]',
        hiddenFormField: '[data-region="hiddenformfield"]'
    },
    classes: {
        hidden: 'd-none',
        saving: 'saving',
        deleting: 'deleting',
        disabled: 'disabled',
        enabled: 'js-enabled'
    }
};

/**
 * Show an alert on the image.
 * @param  {HTMLElement} target DOM node of the editable image
 * @param  {String} msg Message to show in the alert
 * @return {Promise} Template promise.
 */
const showImageAlert = (target, msg) => {
    return Templates.render('core/notification', {
        message: msg,
        closebutton: true,
        iswarning: true
    }).then(function(html, js) {
        Templates.prependNodeContents(target, html, js);
        return;
    });
};

/**
 * Remove the image alert.
 * @param {HTMLElement} target DOM node of the editable image
 */
const removeImageAlert = (target) => {
    const alert = target.querySelector(selectors.regions.alert);
    if (alert) {
        alert.remove();
    }
};

/**
 * Show the spinner.
 * @param  {HTMLElement} target DOM node of the editable image
 * @param  {Bool} show.
 */
const ajaxing = (target, show) => {
    const ajaxing = target.querySelector(selectors.regions.ajaxing);
    if (show) {
        ajaxing.classList.remove(selectors.classes.hidden);
    } else {
        ajaxing.classList.add(selectors.classes.hidden);
    }
};

/**
 * show delete option
 * @param  {HTMLElement} target DOM node of the editable image
 * @param {Bool} show
 */
 const showDeleteOption = (target, show) => {
    const deleteimage = target.querySelector(selectors.actions.deleteimage);
    if (show) {
        deleteimage.classList.add(selectors.classes.enabled);
        deleteimage.setAttribute('tabindex', 0);
    } else {
        deleteimage.classList.remove(selectors.classes.enabled);
        deleteimage.setAttribute('tabindex', -1);
    }
 };

/**
 * Show the edit actions upload image and crop image, this hides
 * the confirm actions.
 * @param  {HTMLElement} target DOM node of the editable image
 */
const showEditActions = (target) => {
    const currentimage = target.getAttribute('data-currentimage');
    const cropimage = target.querySelector(selectors.actions.cropimage);
    const confirmactions = target.querySelector(selectors.regions.confirmactions);
    const editactions = target.querySelector(selectors.regions.editactions);
    if (currentimage) {
        cropimage.classList.remove(selectors.classes.hidden);
        showDeleteOption(target, true);
    } else {
        cropimage.classList.add(selectors.classes.hidden);
        showDeleteOption(target, false);
    }
    confirmactions.classList.add(selectors.classes.hidden);
    editactions.classList.remove(selectors.classes.hidden);
    removeImageAlert(target);
};

/**
 * Save an image from the image handler
 * @param {Object} args The request arguments
 * @return {Promise} Resolved with an array file the stored file url.
 */
const updateImage = (args) => {
    const request = {
        methodname: 'core_update_image_editable',
        args: args
    };

    let promise = Ajax.call([request])[0]
        .fail(Notification.exception);

    return promise;
};

/**
 * Get human file size from bytes.
 * @param {Int} size
 * @returns {string} the human readable size string
 */
const humanFileSize = (size) => {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

/**
 * Set the background image
 * @param {HTMLElement} imageHandler DOM node of the editable image
 * @param {String} imageUrl the new background image url or data.
 */
const setBackgroundImage = (imageHandler, imageUrl) => {
    imageHandler.style.backgroundImage = 'url("' + imageUrl + '")';
};

/**
 * Show the confirm actions, this hides the edit actions.
 * @param {HTMLElement} target DOM node of the editable image wrapper
 * @param {Promise} string promise to show on confirm button.
 * @param {function} action to execute.
 */
const confirmAction = (target, string, action) => {
    const confirmactions = target.querySelector(selectors.regions.confirmactions);
    const editactions = target.querySelector(selectors.regions.editactions);
    const confirm = target.querySelector(selectors.actions.confirm);

    // Create a new button to remove all old event listeners.
    const newconfirm = confirm.cloneNode(true);
    confirm.parentNode.replaceChild(newconfirm, confirm);

    string.done(function(str) {
        newconfirm.innerHTML = str;

        confirmactions.classList.remove(selectors.classes.hidden);
        editactions.classList.add(selectors.classes.hidden);

        newconfirm.addEventListener('click', (e) => {
            action();
            e.preventDefault();
        });
    });
    showDeleteOption(target, false);
};

/**
 * Show the cancel actions.
 * @param {HTMLElement} target DOM node of the editable image wrapper
 * @param {function} action callback to execute.
 */
const cancelAction = (target, action) => {
    let cancel = target.querySelector(selectors.actions.cancel);

    // Create a new button to remove all old event listeners.
    const newcancel = cancel.cloneNode(true);
    cancel.parentNode.replaceChild(newcancel, cancel);

    newcancel.addEventListener('click', (e) => {
        action();
        e.preventDefault();
    });
};

/**
 * Crop the current image.
 * @param {HTMLElement} target DOM node of the editable image wrapper.
 */
const imageCropper = (target) => {
    const imageHandler = target.querySelector(selectors.regions.imagehandler);

    let currentImage = target.getAttribute('data-currentimage');

    const size = target.getAttribute('data-size');

    const croppedImage = new Croppie(imageHandler, {
        enableExif: true,
        viewport: {
            width: (size / 100) * (90),
            height: (size / 100) * (90),
            type: 'square'
        }
    });
    croppedImage.bind({
        url: currentImage,
    });

    setBackgroundImage(imageHandler, '');

    const zoomslider = target.querySelector(selectors.regions.zoomslider);
    zoomslider.classList.add('form-control-range');
    // Increase the slider step size so it is keyboard accessible.
    zoomslider.setAttribute('step', 0.01);

    // Makes the viewport look like a circle
    if (target.getAttribute('data-rounded') === 'rounded') {
        target.querySelector('.cr-viewport').classList.add('cr-vp-circle');
    }

    confirmAction(target, getString('cropimage', 'repository'), function() {
        croppedImage.result('base64').then(function(imageData) {

            let ajaxParams = {
                imagedata: imageData.split('base64,')[1],
                imagefilename: 'cropped.png',
                cropped: 1,
                component: target.getAttribute('data-component'),
                filearea: target.getAttribute('data-filearea'),
                contextid: target.getAttribute('data-contextid'),
                draftitemid: target.getAttribute('data-draftitemid')
            };
            ajaxing(target, true);
            updateImage({params: ajaxParams}).then(function(result) {
                if (result.success) {
                    setBackgroundImage(imageHandler, imageData);
                    croppedImage.destroy();
                }
                if (result.warning) {
                    showImageAlert(imageHandler, result.warning, 'warning');
                }
                ajaxing(target, false);
                showEditActions(target);
                return;
            });
        });
    });

    cancelAction(target, function() {
        croppedImage.destroy();
        setBackgroundImage(imageHandler, currentImage);
        showEditActions(target);
    });
};

/**
 * Upload a new image.
 * @param {HTMLElement} target DOM node of the editable image wrapper.
 * @param {Int} siteMaxBytes the maximum size for these images.
 * @param {Event} event the event listener event.
 */
const imageUploader = (target, siteMaxBytes, event) => {
    const imageHandler = target.querySelector(selectors.regions.imagehandler);

    const hiddenFormField = target.querySelector(selectors.regions.hiddenFormField);

    let file = event.target.files[0];

    // Only process image files.
    if (!file.type.match('image.*')) {
        return;
    }

    let backupImage = target.getAttribute('data-currentimage');

    if (backupImage === '') {
        backupImage = target.getAttribute('data-defaultimage');
    }

    var reader = new FileReader();
    reader.onload = (function() {
        let filedata = reader.result;

        if (file.size > siteMaxBytes) {
            const maxbytesstr = {
                size: humanFileSize(siteMaxBytes),
                file: file.name
            };
            getString('maxbytesfile', 'error', maxbytesstr).done(function(message) {
                showImageAlert(imageHandler, message);
            });
            return;
        }

        // Warn if image resolution is too small.
        let img = document.createElement('img');
        img.setAttribute('src', filedata);
        img.addEventListener('load', () => {
            if (img.naturalWidth < 512) {
                getString('resolutionlow', 'error').done(function(message) {
                    showImageAlert(imageHandler, message);
                });
            }
        });
        setBackgroundImage(imageHandler, filedata);

        let ajaxParams = {
            imagefilename: file.name,
            imagedata: filedata.split('base64,')[1],
            cropped: 0,
            component: target.getAttribute('data-component'),
            filearea: target.getAttribute('data-filearea'),
            contextid: target.getAttribute('data-contextid'),
            draftitemid: target.getAttribute('data-draftitemid')
        };

        confirmAction(target, getString('save', 'admin'), function() {
            ajaxing(target, true);
            updateImage({params: ajaxParams}).then(function(result) {
                if (result.success) {
                    target.setAttribute('data-currentimage', result.fileurl);
                    backupImage = result.fileurl;
                }
                if (result.warning) {
                    showImageAlert(imageHandler, result.warning, 'warning');
                }
                if (hiddenFormField) {
                    hiddenFormField.value = ajaxParams.draftitemid;
                }
                ajaxing(target, false);
                showEditActions(target);
                return;
            });
        });
        cancelAction(target, function() {
            setBackgroundImage(imageHandler, backupImage);
            showEditActions(target);
        });
    });
    // Read in the image file as a data URL.
    reader.readAsDataURL(file);
};

/**
 * Delete the image
 * @param {HTMLElement} target DOM node of the editable image wrapper.
 */
const imageDelete = (target) => {
    const deleteimage = target.querySelector(selectors.actions.deleteimage);

    const hiddenFormField = target.querySelector(selectors.regions.hiddenFormField);

    if (!deleteimage.classList.contains(selectors.classes.enabled)) {
        return '';
    }

    const defaultImage = target.getAttribute('data-defaultimage');

    const imageHandler = target.querySelector(selectors.regions.imagehandler);

    let ajaxParams = {
        imagedata: '',
        imagefilename: '',
        cropped: 0,
        component: target.getAttribute('data-component'),
        filearea: target.getAttribute('data-filearea'),
        contextid: target.getAttribute('data-contextid'),
        draftitemid: target.getAttribute('data-draftitemid'),
        delete: 1
    };

    confirmAction(target, getString('delete', 'moodle'), function() {
        ajaxing(target, true);
        updateImage({params: ajaxParams}).then(function(result) {
            if (result.success) {
                setBackgroundImage(imageHandler, defaultImage);
                target.setAttribute('data-currentimage', '');
            }
            if (hiddenFormField) {
                hiddenFormField.value = -1;
            }
            ajaxing(target, false);
            showEditActions(target);
            return;
        });
    });

    cancelAction(target, function() {
        showEditActions(target);
    });
};

/**
 * Initiate the editable image controls.
 *
 * @param {HTMLElement} target DOM node of the editable image
 * @param {int} siteMaxBytes
 */
export const init = (target, siteMaxBytes) => {
    const cropimage = target.querySelector(selectors.actions.cropimage);
    const uploadimage = target.querySelector(selectors.actions.uploadimage);
    const deleteimage = target.querySelector(selectors.actions.deleteimage);
    const imagecontrols = target.querySelector(selectors.regions.imagecontrols);

    // Actions on cropping
    cropimage.addEventListener('click', (e) => {
        imageCropper(target);
        e.preventDefault();
    });

    // Process the uploaded file
    uploadimage.addEventListener('change', (e) => {
        imageUploader(target, siteMaxBytes, e);
        e.preventDefault();
    });

    // Delete the shown image.
    deleteimage.addEventListener('click', (e) => {
        imageDelete(target);
        e.preventDefault();
    });

    showEditActions(target);
    imagecontrols.classList.add('js-enabled');
};
