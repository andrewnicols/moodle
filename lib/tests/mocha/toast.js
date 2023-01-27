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

import {fetchComponentData} from '../../../.grunt/components.js';
import path from 'path';
import fs from 'fs/promises';

/**
 * Get the relative path to an AMD module from its module name
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


describe('core/toast', async () => {
    beforeEach(async () => {
        const Loader = (await import('core/local/templates/loader')).default;
        const Renderer = (await import('core/local/templates/renderer')).default;
        const getNormalisedComponent = (await import('core/utils')).getNormalisedComponent;

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
                    console.log(`Loading template for ${templateData.component} ${templateData.name} from ${path}`);
                    const templateSource = fs.readFile(path, {encoding: 'utf8'});

                    return templateSource.then((templateSource) => {
                        templateData.deferred.resolve(templateSource);
                        return templateSource;
                    });
                });

                this.isLoadingTemplates = false;
            }
        }

        Renderer.setLoader(TestLoader);
    });
    let Templates;

    it('Should do stuff', async () => {
        Templates = await import('core/templates');
        console.log(Templates);
        const result = Templates.default.render('core/welcome');
        console.log(await result);
    });
});
