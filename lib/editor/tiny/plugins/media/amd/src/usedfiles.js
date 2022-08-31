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
 * Tiny Media Manager usedfiles.
 *
 * @module      tiny_mediamanager/usedfiles
 * @copyright   2022, Stevani Andolo <stevani@hotmail.com.au>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

const usedFiles = (files, usercontext, itemid) => {
    const CSS = {
        HASMISSINGFILES: 'has-missing-files',
        HASUNUSEDFILES: 'has-unused-files'
    };

    const SELECTORS = {
        FILEANCESTOR: '.fitem',
        FORM: '#tiny_mediamanager_form',
        MISSINGFILES: '.missing-files'
    };

    // Return the list of files used in the area.
    const getUsedFiles = () => {
        let iframe = window.parent.document.getElementById('id_description_editor_ifr'),
            content = iframe.contentWindow.document.getElementById('tinymce'),
            baseUrl = `${M.cfg.wwwroot}/draftfile.php/${_usercontext}/user/draft/${_itemid}/`,
            pattern = new RegExp("[\"']" + baseUrl.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + "(.+?)[\\?\"']", 'gm'),
            filename = '',
            match = '',
            usedFiles = {};

        // The pattern matches any draftfile URL contained within quotes, e.g. 'src="<filename>"' or 'href="<filename>"'.
        while ((match = pattern.exec(content.innerHTML)) !== null) {
            filename = decodeURIComponent(match[1]);
            usedFiles[filename] = true;
        }

        return usedFiles;
    };

    // Return an array of unused files.
    const findUnusedFiles = (allFiles, usedFiles) => {
        let key,
            list = [];
        for (key in allFiles) {
            if (!usedFiles[key]) {
                list.push(key);
            }
        }
        return list;
    };

    // Return an array of missing files.
    const findMissingFiles = (allFiles, usedFiles) => {
        let key,
            list = [];
        for (key in usedFiles) {
            if (!allFiles[key]) {
                list.push(key);
            }
        }
        return list;
    };

    // Sanitizes any unsafe html.
    const escapeHtml = (html) => {
        return html
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
    };

    const _files = files,
    _usercontext = usercontext,
    _itemid = itemid,
    form = document.querySelector(SELECTORS.FORM),
    usedFiles = getUsedFiles(),
    unusedFiles = findUnusedFiles(_files, usedFiles),
    missingFiles = findMissingFiles(_files, usedFiles);

    let missingFilesTxt = null,
    i = null;

    if (!form || !window.parent) {
        window.console.log("Unable to find parent window");
        return;
    }

    // There are some unused files.
    if (unusedFiles.length > 0) {
        // Loop over all the files in the form.
        form.querySelectorAll('input[type=checkbox][name^="deletefile"]').forEach(function(node) {
            // If the file is used, remove it.
            if (unusedFiles.indexOf(node.getAttribute('data-filename')) === -1) {
                node.closest(SELECTORS.FILEANCESTOR).remove();
            }
        });
        form.classList.add(CSS.HASUNUSEDFILES);
    } else {
        // This is needed as the init may be called twice due to the double call to $PAGE->requires->js_call_amd().
        form.classList.remove(CSS.HASUNUSEDFILES);
    }

    // There are some files missing.
    if (missingFiles.length > 0) {
        missingFilesTxt = '<ol>';
        for (i = 0; i < missingFiles.length; i++) {
            missingFilesTxt += `<li>${escapeHtml(missingFiles[i])}</li>`;
        }
        missingFilesTxt += '</ol>';
        form.querySelector(SELECTORS.MISSINGFILES).innerHTML = missingFilesTxt;
        form.classList.add(CSS.HASMISSINGFILES);
    } else {
        form.classList.remove(CSS.HASMISSINGFILES);
    }
};

export const init = (files, usercontext, itemid) => {
    usedFiles(files, usercontext, itemid);
};
