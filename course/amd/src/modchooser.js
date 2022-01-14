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
 * A type of dialogue used as for choosing modules in a course.
 *
 * @module     core_course/activitychooser
 * @copyright  2021 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import selectors from 'core_course/local/activitychooser/selectors';
import ItemChooser from './local/modchooser/itemchooser';

const getCaller = target => {
    // We need to know who called this.
    // Standard courses use the ID in the main section info.
    const sectionDiv = target.closest(selectors.elements.section);

    if (sectionDiv !== null && sectionDiv.hasAttribute('data-sectionid')) {
        // We check for attributes just in case of outdated contrib course formats.
        return sectionDiv;
    }

    // If we don't have a section ID use the fallback ID.
    // We always want the sectionDiv caller first as it keeps track of section ID's after DnD changes.
    // The button attribute is always just a fallback for us as the section div is not always available.
    // A YUI change could be done maybe to only update the button attribute but we are going for minimal change here.

    // Front page courses need some special handling.
    return target.closest(selectors.elements.sectionmodchooser);
};

export const init = (courseId, chooserConfig) => {
    let chooserInstance;
    const getChooser = () => {
        if (!chooserInstance) {
            chooserInstance = new ItemChooser(courseId);
            chooserInstance.tabMode = chooserConfig.tabmode;
        }

        return chooserInstance;
    };

    const showChooser = e => {
        if (!e.target.closest(selectors.elements.sectionmodchooser)) {
            return;
        }

        const chooser = getChooser();
        chooser.setCaller(getCaller(e.target));
        chooser.show();
    };

    document.addEventListener('click', showChooser);
};
