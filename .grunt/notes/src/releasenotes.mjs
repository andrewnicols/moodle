#!/usr/bin/env node
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

import { getAllComponents } from './components.mjs';
import { getCombinedNotesByComponent } from './note.mjs';
import logger from './logger.mjs';

/**
 * Generate the upgrade notes for a new release.
 *
 * @param {string|undefined} version
 * @param {Object} options
 * @param {boolean} options.generateUpgradeNotes
 * @param {boolean} options.deleteNotes
 * @returns {Promise<void>}
 */
export default async (tag, options = {}) => {
    const notes = await getCombinedNotesByComponent();

    if (Object.keys(notes).length === 0) {
        logger.warn('No notes to generate');
        return;
    }

    if (!tag) {
        logger.error('No tag provided');
    }

    // Generate the upgrade notes for this release.
    // We have
    // - a title with the release name
    // - the change types
    // - which contain the components
    // - which document each change
    let upgradeNotes = `### Component API updates\n<!--cspell: disable -->\n\n`;

    const componentList = Object.fromEntries(
        Object.values(getAllComponents()).map(({path, value}) => [value, path]),
    );
    Object.entries(notes).forEach(([component]) => {
        const componentPath = componentList[component];
        upgradeNotes += `- [${component}](https://github.com/moodle/moodle/blob/${tag}/${componentPath}/UPGRADING.md)\n`;
    });

    console.log(upgradeNotes);
};
