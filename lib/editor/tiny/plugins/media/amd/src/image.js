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
 * Tiny Media plugin Image class for Moodle.
 *
 * @module      tiny_media/image
 * @copyright   2022 Huong Nguyen <huongnv13@gmail.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Templates from 'core/templates';
import {get_string as getString, get_strings as getStrings} from 'core/str';
import * as ModalFactory from 'core/modal_factory';
import {displayFilepicker} from 'editor_tiny/utils';
import Selectors from 'tiny_media/selectors';
import Modal from 'tiny_media/imagemodal';
import {getImagePermissions} from 'tiny_media/options';
import {component} from "./common";

export const MediaImage = class {

    DEFAULTS = {
        WIDTH: 160,
        HEIGHT: 160,
    };

    form = null;
    rawImageDimensions = null;
    canShowFilePicker = false;
    editor = null;
    currentModal = null;
    selectedImage = null;
    imageAlignment = null;

    constructor(editor) {
        const permissions = getImagePermissions(editor);
        this.canShowFilePicker = permissions.filepicker;
        this.editor = editor;
    }

    async displayDialogue() {
        // Reset the image dimensions.
        this.rawImageDimensions = null;
        let data = {};

        const currentImageData = await this.getCurrentImageData();
        if (currentImageData) {
            Object.assign(data, currentImageData);
        }

        const modal = await ModalFactory.create({
            type: Modal.TYPE,
            title: getString('imageproperties', 'tiny_media'),
            templateContext: await this.getTemplateContext(data),
            removeOnClose: true,
            large: true,
        });

        this.currentModal = modal;
        await this.registerEventListeners(modal);
        modal.show();
    }

    async getImageAlignment(selected = '') {
        const [
            alignmentTopString,
            alignmentMiddleString,
            alignmentBottomString,
            alignmentLeftString,
            alignmentRightString,
        ] = await getStrings([
            'alignment_top',
            'alignment_middle',
            'alignment_bottom',
            'alignment_left',
            'alignment_right',
        ].map((key) => ({
            key,
            component,
        })));

        let alignments = [
            {
                text: alignmentTopString,
                value: 'text-top'
            },
            {
                text: alignmentMiddleString,
                value: 'middle'
            },
            {
                text: alignmentBottomString,
                value: 'text-bottom'
            },
            {
                text: alignmentLeftString,
                value: 'left'
            },
            {
                text: alignmentRightString,
                value: 'right'
            },
        ];

        if (selected) {
            alignments.forEach((alignment, index, array) => {
                if (alignment.value === selected) {
                    array[index]['selected'] = true;
                }
            });
        }

        return alignments;
    }

    async getTemplateContext(data) {
        return Object.assign({}, {
            elementid: this.editor.id,
            showfilepicker: this.canShowFilePicker,
            alignoptions: await this.getImageAlignment(),
        }, data);
    }

    async getCurrentImageData() {
        const properties = this.getSelectedImageProperties();
        if (!properties) {
            return false;
        }
        if (properties.align) {
            properties.alignoptions = await this.getImageAlignment(properties.align);
        }
        if (properties.src) {
            properties.haspreview = true;
        }
        if (!properties.alt) {
            properties.presentation = true;
        }
        return properties;
    }

    filePickerCallback(params, self) {
        if (params.url !== '') {
            const input = self.form.querySelector(Selectors.IMAGE.elements.url);
            input.value = params.url;

            // Auto set the width and height.
            self.form.querySelector(Selectors.IMAGE.elements.width).value = '';
            self.form.querySelector(Selectors.IMAGE.elements.height).value = '';

            // Load the preview image.
            self.loadPreviewImage(params.url);
        }
    }

    loadPreviewImage(url) {
        const image = new Image();

        image.onerror = () => {
            const preview = this.form.querySelector(Selectors.IMAGE.elements.preview);
            preview.style.display = 'none';
        };

        image.onload = () => {
            let input, currentWidth, currentHeight, widthRatio, heightRatio;

            // Store dimensions of the raw image, falling back to defaults for images without dimensions (e.g. SVG).
            this.rawImageDimensions = {
                width: image.width || this.DEFAULTS.WIDTH,
                height: image.height || this.DEFAULTS.HEIGHT,
            };

            input = this.form.querySelector(Selectors.IMAGE.elements.width);
            currentWidth = input.value;
            if (currentWidth === '') {
                input.value = this.rawImageDimensions.width;
                currentWidth = "" + this.rawImageDimensions.width;
            }

            input = this.form.querySelector(Selectors.IMAGE.elements.height);
            currentHeight = input.value;
            if (currentHeight === '') {
                input.value = this.rawImageDimensions.height;
                currentHeight = "" + this.rawImageDimensions.height;
            }

            input = this.form.querySelector(Selectors.IMAGE.elements.preview);
            input.setAttribute('src', image.src);
            input.style.display = 'inline';

            input = this.form.querySelector(Selectors.IMAGE.elements.constrain);
            if (this.isPercentageValue(currentWidth) && this.isPercentageValue(currentHeight)) {
                input.checked = currentWidth === currentHeight;
            } else if (image.width === 0 || image.height === 0) {
                // If we don't have both dimensions of the image, we can't auto-size it, so disable control.
                input.disabled = 'disabled';
            } else {
                // This is the same as comparing to 3 decimal places.
                widthRatio = Math.round(1000 * parseInt(currentWidth, 10) / image.width);
                heightRatio = Math.round(1000 * parseInt(currentHeight, 10) / image.height);
                input.checked = widthRatio === heightRatio;
            }
        };

        image.src = url;
    }

    urlChanged() {
        const input = this.form.querySelector(Selectors.IMAGE.elements.url);

        if (input.value !== '') {
            // Load the preview image.
            this.loadPreviewImage(input.value);
        }
    }

    hasErrorUrlField() {
        const url = this.form.querySelector(Selectors.IMAGE.elements.url).value;
        const urlError = url === '';
        this.toggleVisibility(Selectors.IMAGE.elements.urlWarning, urlError);
        this.toggleAriaInvalid([Selectors.IMAGE.elements.url], urlError);

        return urlError;
    }

    hasErrorAltField() {
        const alt = this.form.querySelector(Selectors.IMAGE.elements.alt).value;
        const presentation = this.form.querySelector(Selectors.IMAGE.elements.presentation).checked;
        const imageAltError = alt === '' && !presentation;
        this.toggleVisibility(Selectors.IMAGE.elements.altWarning, imageAltError);
        this.toggleAriaInvalid([Selectors.IMAGE.elements.alt, Selectors.IMAGE.elements.presentation], imageAltError);

        return imageAltError;
    }

    toggleVisibility(selector, predicate) {
        const elements = this.form.querySelectorAll(selector);
        elements.forEach((element) => {
            element.style.display = predicate ? 'block' : 'none';
        });
    }

    toggleAriaInvalid(selectors, predicate) {
        selectors.forEach((selector) => {
            const elements = this.form.querySelectorAll(selector);
            elements.forEach((element) => {
                element.setAttribute('aria-invalid', predicate);
            });
        });
    }

    getAlignmentClass(alignment) {
        return Selectors.IMAGE.elements.alignSettings + '_' + alignment;
    }

    updateWarning() {
        const urlError = this.hasErrorUrlField();
        const imageAltError = this.hasErrorAltField();

        return urlError || imageAltError;
    }

    setImage() {
        const url = this.form.querySelector(Selectors.IMAGE.elements.url).value,
            alt = this.form.querySelector(Selectors.IMAGE.elements.alt).value,
            width = this.form.querySelector(Selectors.IMAGE.elements.width).value,
            height = this.form.querySelector(Selectors.IMAGE.elements.height).value,
            alignment = this.getAlignmentClass(this.form.querySelector(Selectors.IMAGE.elements.alignment).value),
            presentation = this.form.querySelector(Selectors.IMAGE.elements.presentation).checked,
            constrain = this.form.querySelector(Selectors.IMAGE.elements.constrain).value,
            customStyle = this.form.querySelector(Selectors.IMAGE.elements.customStyle).value;
        let classList = [];

        // Check if there are any accessibility issues.
        if (this.updateWarning()) {
            return;
        }

        if (url !== '') {
            if (constrain) {
                classList.push(Selectors.IMAGE.styles.responsive);
            }

            // Add the alignment class for the image.
            classList.push(alignment);

            if (!this.isPercentageValue(width) && isNaN(parseInt(width, 10))) {
                this.form.querySelector(Selectors.IMAGE.elements.width).focus();
                return;
            }
            if (!this.isPercentageValue(height) && isNaN(parseInt(height, 10))) {
                this.form.querySelector(Selectors.IMAGE.elements.height).focus();
                return;
            }

            Templates.render('tiny_media/image', {
                url: url,
                alt: alt,
                width: width,
                height: height,
                presentation: presentation,
                customstyle: customStyle,
                classlist: classList.join(' ')
            }).then(html => {
                this.editor.insertContent(html);
                this.currentModal.destroy();
            });
        }
    }

    handleKeyupCharacterCount() {
        const alt = this.form.querySelector(Selectors.IMAGE.elements.alt).value,
            current = this.form.querySelector('#currentcount');
        current.innerHTML = alt.length;
    }

    autoAdjustSize(e, forceHeight) {
        forceHeight = forceHeight || false;

        let keyField = this.form.querySelector(Selectors.IMAGE.elements.width),
            keyFieldType = 'width',
            subField = this.form.querySelector(Selectors.IMAGE.elements.height),
            subFieldType = 'height',
            constrainField = this.form.querySelector(Selectors.IMAGE.elements.constrain),
            keyFieldValue = keyField.value,
            subFieldValue = subField.value,
            imagePreview = this.form.querySelector(Selectors.IMAGE.elements.preview),
            rawPercentage,
            rawSize;

        // If we do not know the image size, do not do anything.
        if (!this.rawImageDimensions) {
            return;
        }

        // Set the width back to default if it is empty.
        if (keyFieldValue === '') {
            keyFieldValue = this.rawImageDimensions[keyFieldType];
            keyField.value = keyFieldValue;
            keyFieldValue = keyField.value;
        }

        // Clear the existing preview sizes.
        imagePreview.style.width = null;
        imagePreview.style.height = null;

        // Now update with the new values.
        if (!constrainField.checked) {
            // We are not keeping the image proportion - update the preview accordingly.

            // Width.
            if (this.isPercentageValue(keyFieldValue)) {
                rawPercentage = parseInt(keyFieldValue, 10);
                rawSize = this.rawImageDimensions.width / 100 * rawPercentage;
                imagePreview.style.width = rawSize + 'px';
            } else {
                imagePreview.style.width = keyFieldValue + 'px';
            }

            // Height.
            if (this.isPercentageValue(subFieldValue)) {
                rawPercentage = parseInt(subFieldValue, 10);
                rawSize = this.rawImageDimensions.height / 100 * rawPercentage;
                imagePreview.style.height = rawSize + 'px';
            } else {
                imagePreview.style.height = subFieldValue + 'px';
            }
        } else {
            // We are keeping the image in proportion.
            if (forceHeight) {
                // By default, we update based on width. Swap the key and sub fields around to achieve a height-based scale.
                let temporaryValue;
                temporaryValue = keyField;
                subField = temporaryValue;

                temporaryValue = keyFieldType;
                keyFieldType = subFieldType;
                subFieldType = temporaryValue;

                temporaryValue = keyFieldValue;
                keyFieldValue = subFieldValue;
                subFieldValue = temporaryValue;
            }

            if (this.isPercentageValue(keyFieldValue)) {
                // This is a percentage based change. Copy it verbatim.
                subFieldValue = keyFieldValue;

                // Set the width to the calculated pixel width.
                rawPercentage = parseInt(keyFieldValue, 10);
                rawSize = this.rawImageDimensions.width / 100 * rawPercentage;

                // And apply the width/height to the container.
                imagePreview.style.width = rawSize;
                rawSize = this.rawImageDimensions.height / 100 * rawPercentage;
                imagePreview.style.height = rawSize;
            } else {
                // Calculate the scaled subFieldValue from the keyFieldValue.
                subFieldValue = Math.round((keyFieldValue / this.rawImageDimensions[keyFieldType]) *
                    this.rawImageDimensions[subFieldType]);

                if (forceHeight) {
                    imagePreview.style.width = subFieldValue;
                    imagePreview.style.height = keyFieldValue;
                } else {
                    imagePreview.style.width = keyFieldValue;
                    imagePreview.style.height = subFieldValue;
                }
            }

            // Update the subField's value within the form to reflect the changes.
            subField.value = subFieldValue;
        }
    }

    getSelectedImageProperties() {
        let properties = {
                src: null,
                alt: null,
                width: null,
                height: null,
                align: '',
                presentation: false
            },

            // Get the current selection.
            image = this.getSelectedImage(),
            width,
            height,
            style;

        if (image) {
            image = this.removeLegacyAlignment(image);
            this.selectedImage = image;

            style = image.style;
            properties.customstyle = style;

            width = image.width;
            if (!this.isPercentageValue(String(width))) {
                width = parseInt(width, 10);
            }
            height = image.height;
            if (!this.isPercentageValue(String(height))) {
                height = parseInt(height, 10);
            }

            if (width !== 0) {
                properties.width = width;
            }
            if (height !== 0) {
                properties.height = height;
            }
            this.getAlignmentProperties(image, properties);
            properties.src = image.getAttribute('src');
            properties.alt = image.getAttribute('alt') || '';
            properties.presentation = (image.getAttribute('role') === 'presentation');
            return properties;
        }

        // No image selected - clean up.
        this.selectedImage = null;
        return false;
    }

    removeLegacyAlignment(imageNode) {
        if (!imageNode.style.margin) {
            // There is no margin therefore this cannot match any known alignments.
            return imageNode;
        }

        Selectors.IMAGE.alignments.some(alignment => {
            if (imageNode.style[alignment.name] !== alignment.value) {
                // The name/value do not match. Skip.
                return false;
            }
            const normalisedNode = document.createElement('div');
            normalisedNode.style.margin = alignment.margin;
            if (imageNode.style.margin !== normalisedNode.style.margin) {
                // The margin does not match.
                return false;
            }

            imageNode.classList.add(this.getAlignmentClass(alignment.value));
            imageNode.style[alignment.name] = null;
            imageNode.style.margin = null;

            return true;
        });

        return imageNode;
    }

    getAlignmentProperties(image, properties) {
        let complete,
            defaultAlignment;

        // Check for an alignment value.
        complete = Selectors.IMAGE.alignments.some(alignment => {
            const classname = this.getAlignmentClass(alignment.value);
            if (image.classList.contains(classname)) {
                properties.align = alignment.value;
                return true;
            }

            if (alignment.isDefault) {
                defaultAlignment = alignment.value;
            }

            return false;
        });

        if (!complete && defaultAlignment) {
            properties.align = defaultAlignment;
        }
    }

    getSelectedImage() {
        const imgElm = this.editor.selection.getNode();
        const figureElm = this.editor.dom.getParent(imgElm, 'figure.image');
        if (figureElm) {
            return this.editor.dom.select('img', figureElm)[0];
        }
        if (imgElm && (imgElm.nodeName !== 'IMG' || this.isPlaceholderImage(imgElm))) {
            return null;
        }
        return imgElm;
    }

    isPlaceholderImage(imgElm) {
        return imgElm.nodeName === 'IMG' && (imgElm.hasAttribute('data-mce-object') || imgElm.hasAttribute('data-mce-placeholder'));
    }

    isPercentageValue(value) {
        return value.match(/\d+%/);
    }

    async registerEventListeners(modal) {
        await modal.getBody();
        const $root = modal.getRoot();
        const root = $root[0];
        this.form = root.querySelector(Selectors.IMAGE.elements.form);

        root.addEventListener('click', e => {
            const submitAction = e.target.closest(Selectors.IMAGE.actions.submit);
            const imageBrowserAction = e.target.closest(Selectors.IMAGE.actions.imageBrowser);
            if (submitAction) {
                e.preventDefault();
                this.setImage();
            }
            if (imageBrowserAction && this.canShowFilePicker) {
                e.preventDefault();
                displayFilepicker(this.editor, 'image').then((params) => {
                    const self = this;
                    this.filePickerCallback(params, self);
                }).catch();
            }
        });

        root.addEventListener('change', e => {
            const urlEle = e.target.closest(Selectors.IMAGE.elements.url);
            const presentationEle = e.target.closest(Selectors.IMAGE.elements.presentation);
            const constrainEle = e.target.closest(Selectors.IMAGE.elements.constrain);
            if (urlEle) {
                this.hasErrorUrlField();
            }
            if (presentationEle) {
                this.hasErrorAltField();
            }
            if (constrainEle) {
                this.autoAdjustSize(e, true);
            }
        });

        root.addEventListener('blur', e => {
            if (e.target.nodeType === Node.ELEMENT_NODE) {
                const urlEle = e.target.closest(Selectors.IMAGE.elements.url);
                const altEle = e.target.closest(Selectors.IMAGE.elements.alt);
                const widthEle = e.target.closest(Selectors.IMAGE.elements.width);
                const heightEle = e.target.closest(Selectors.IMAGE.elements.height);
                if (urlEle) {
                    this.urlChanged();
                }
                if (altEle) {
                    this.hasErrorAltField();
                }
                if (widthEle) {
                    this.autoAdjustSize(e);
                }
                if (heightEle) {
                    this.autoAdjustSize(e, true);
                }
            }
        }, true);

        // Character count.
        root.addEventListener('keyup', e => {
            const altEle = e.target.closest(Selectors.IMAGE.elements.alt);
            if (altEle) {
                this.handleKeyupCharacterCount();
            }
        });
    }
};
