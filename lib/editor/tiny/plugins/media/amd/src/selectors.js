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
 * Tiny Media plugin helper function to build queryable data selectors.
 *
 * @module      tiny_media/selectors
 * @copyright   2022 Huong Nguyen <huongnv13@gmail.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

export default {
    IMAGE: {
        actions: {
            submit: '.tiny_image_urlentrysubmit',
            imageBrowser: '.openimagebrowser',
        },
        elements: {
            form: 'form.tiny_image_form',
            alignment: '.tiny_image_alignment',
            alignSettings: '.tiny_image_button',
            alt: '.tiny_image_altentry',
            altWarning: '.tiny_image_altwarning',
            height: '.tiny_image_heightentry',
            width: '.tiny_image_widthentry',
            url: '.tiny_image_urlentry',
            urlWarning: '.tiny_image_urlwarning',
            size: '.tiny_image_size',
            presentation: '.tiny_image_presentation',
            constrain: '.tiny_image_constrain',
            customStyle: '.tiny_image_customstyle',
            preview: '.tiny_image_preview',
            previewBox: '.tiny_image_preview_box',
        },
        styles: {
            responsive: 'img-fluid',
        },
        alignments: [
            // Vertical alignment.
            {
                name: 'verticalAlign',
                value: 'text-top',
                margin: '0 0.5em'
            },
            {
                name: 'verticalAlign',
                value: 'middle',
                margin: '0 0.5em'
            },
            {
                name: 'verticalAlign',
                value: 'text-bottom',
                margin: '0 0.5em',
                isDefault: true
            },

            // Floats.
            {
                name: 'float',
                value: 'left',
                margin: '0 0.5em 0 0'
            },
            {
                name: 'float',
                value: 'right',
                margin: '0 0 0 0.5em'
            }
        ]
    },
};
