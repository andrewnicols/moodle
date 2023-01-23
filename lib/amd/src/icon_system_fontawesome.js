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
 * Competency rule points module.
 *
 * @module core/icon_system_fontawesome
 * @copyright  2017 Damyon Wiese
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import IconSystem from 'core/icon_system';
import $ from 'jquery';
import {fetchOne} from 'core/fetch';
import Mustache from 'core/mustache';
import LocalStorage from 'core/localstorage';
import Url from 'core/url';
import MoodleConfig from 'core/config';

const getIconMap = () => fetchOne(
    'core_output_load_fontawesome_icon_system_map',
    {
        themename: MoodleConfig.theme,
    },
    false,
    {
        cacheKey: MoodleConfig.themerev,
    }
);


/**
 * IconSystemFontawesome
 * @class core/icon_system_fontawesome
 */
export default class IconSystemFontawesome extends IconSystem {
    constructor() {
        super();
        this.staticMap = new Map();
        this.fetchMap = null;
    }

    /**
     * Prefetch resources so later calls to renderIcon can be resolved synchronously.
     *
     * @method init
     * @returns {Promise}
     */
    init() {
        if (this.staticMap) {
            return $.when(this);
        }

        const currentTheme = MoodleConfig.theme;

        let map = LocalStorage.get(`core_iconsystem/theme/${currentTheme}/core/iconmap-fontawesome`);
        if (map) {
            map = JSON.parse(map);
        }

        if (map) {
            this.staticMap = new Map(map);
            return $.when(this);
        }

        if (this.fetchMap === null) {
            this.fetchMap = getIconMap();
        }

        return this.fetchMap.then((map) => {
            this.staticMap = new Map();
            map.forEach(({component, pix, to}) => {
                this.staticMap.set(`${component}/${pix}`, to);
            });
            LocalStorage.set(
                `core_iconsystem/theme/${currentTheme}/core/iconmap-fontawesome`,
                JSON.stringify(this.staticMap)
            );
            return this;
        });
    }

    /**
     * Render an icon.
     *
     * @param {String} key
     * @param {String} component
     * @param {String} title
     * @param {String} template
     * @returns {String}
     * @method renderIcon
     */
    renderIcon(key, component, title, template) {
        const mappedIcon = this.staticMap.get(`${component}/${key}`);
        let unmappedIcon = false;
        if (typeof mappedIcon === "undefined") {
            const url = Url.imageUrl(key, component);

            unmappedIcon = {
                attributes: [
                    {name: 'src', value: url},
                    {name: 'alt', value: title},
                    {name: 'title', value: title}
                ]
            };
        }

        const context = {
            key: mappedIcon,
            title: title,
            alt: title,
            unmappedIcon: unmappedIcon
        };

        if (typeof title === "undefined" || title === '') {
            context['aria-hidden'] = true;
        }

        return Mustache.render(template, context).trim();
    }

    /**
     * Get the name of the template to pre-cache for this icon system.
     *
     * @returns {String}
     */
    getTemplateName() {
        return 'core/pix_icon_fontawesome';
    }
}
