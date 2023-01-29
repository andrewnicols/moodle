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
 * This file is responsible for the setup and configuration of the following for use in our Mocha tests:
 *
 * - The global M object.
 * - Including lib/javascript-static.js
 * - Mocking a global YUI instance.
 *
 * @copyright Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import path from 'path';
import fs from 'fs/promises';
import {
    fetchComponentData,
} from '../components.js';
import {
    getModulePath,
} from './moodle-helpers.mjs';

/**
 * Get the relative path to an AMD module from its module name
 * @param {String} component
 * @param {String} templateName
 * @returns {String}
 */
const getPathFromTemplatesName = (component, templateName) => {
    const componentList = fetchComponentData().components;

    for (const [componentPath, name] of Object.entries(componentList)) {
        if (name === component) {
            return path.join(
                process.cwd(),
                componentPath,
                'templates',
                `${templateName}.mustache`,
            );
        }
    }

    return null;
};

/**
 * Mock the template loader.
 */
export const mockTemplateLoader = async () => {
    const Loader = (await import(getModulePath('core/local/templates/loader'))).default.default;
    const Renderer = (await import(getModulePath('core/local/templates/renderer'))).default.default;
    const getNormalisedComponent = (await import(getModulePath('core/utils'))).default.getNormalisedComponent;

    class TestLoader extends Loader {
        static processLoadTemplateBuffer() {
            if (!this.loadTemplateBuffer.length) {
                return;
            }

            if (this.isLoadingTemplates) {
                return;
            }

            this.isLoadingTemplates = true;

            var templatesToLoad = this.loadTemplateBuffer.slice();
            templatesToLoad.map(function (templateData) {
                const path = getPathFromTemplatesName(
                    getNormalisedComponent(templateData.component),
                    templateData.name
                );
                const templateSource = fs.readFile(path, { encoding: 'utf8' });

                return templateSource.then((templateSource) => {
                    templateData.deferred.resolve(templateSource);
                    return templateSource;
                });
            });

            this.isLoadingTemplates = false;
        }
    }

    Renderer.setLoader(TestLoader);
};

export default {
    mockTemplateLoader,
};
