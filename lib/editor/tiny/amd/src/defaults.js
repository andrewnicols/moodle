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

/* eslint-disable max-len,  */

/**
 * TinyMCE Editor Upstream defaults.
 *
 * @module editor_tiny/editor
 * @copyright  2022 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * The upstream defaults for the TinyMCE Menu.
 *
 * This value is defined in the TinyMCE documentation, but not exported anywhere useful.
 * https://www.tiny.cloud/docs/tinymce/6/menus-configuration-options/#menu
 *
 * @returns {Object}
 */
export const getDefaultMenu = () => {
    return {
        file: { title: 'File', items: 'newdocument restoredraft | preview | export print | deleteallconversations' },
        edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
        view: { title: 'View', items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments' },
        insert: { title: 'Insert', items: 'image link media addcomment pageembed template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime' },
        format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat' },
        tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount' },
        table: { title: 'Table', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' },
        help: { title: 'Help', items: 'help' }
    };
};

/**
 * The default toolbar configuration to use.
 *
 * This is based upon the default value used if no toolbar is specified.
 *
 * https://www.tiny.cloud/docs/tinymce/6/menus-configuration-options/#menu
 *
 * @returns {Object}
 */
export const getDefaultToolbar = () => {
    return [
        {
            name: 'content',
            items: [],
        },
        {
            name: 'styles',
            items: ['styles']
        },
        {
            name: 'formatting',
            items: [
                'bold',
                'italic'
            ]
        },
        {
            name: 'history',
            items: [
                'undo',
                'redo'
            ]
        },
        {
            name: 'alignment',
            items: [
                'alignleft',
                'aligncenter',
                'alignright',
                'alignjustify'
            ]
        },
        {
            name: 'indentation',
            items: [
                'outdent',
                'indent'
            ]
        },
        {
            name: 'comments',
            items: ['addcomment']
        },
    ];
};
