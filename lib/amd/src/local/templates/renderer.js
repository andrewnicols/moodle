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

import * as Log from 'core/log';
import * as Truncate from 'core/truncate';
import * as UserDate from 'core/user_date';
import Pending from 'core/pending';
import * as str from 'core/str';
import IconSystem from 'core/icon_system';
import config from 'core/config';
import mustache from 'core/mustache';
import Loader from './loader';

/**
 * Normalise the provided component such that '', 'moodle', and 'core' are treated consistently.
 *
 * @param   {String} component
 * @returns {String}
 */
const getNormalisedComponent = (component) => {
    if (component) {
        if (component !== 'moodle' && component !== 'core') {
            return component;
        }
    }

    return 'core';
};

/**
 * Template Renderer Class.
 *
 * @module     core/local/templates/renderer
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      4.2
 */
export default class Renderer {
    /** @var {string[]} requiredStrings - Collection of strings found during the rendering of one template */
    requiredStrings = null;

    /** @var {object[]} requiredDates - Collection of dates found during the rendering of one template */
    requiredDates = [];

    /** @var {string[]} requiredJS - Collection of js blocks found during the rendering of one template */
    requiredJS = null;

    /** @var {String} themeName for the current render */
    currentThemeName = '';

    /** @var {Number} uniqInstances Count of times this constructor has been called. */
    static uniqInstances = 0;

    /** @var {Object[]} loadTemplateBuffer - List of templates to be loaded */
    static loadTemplateBuffer = [];

    /** @var {Bool} isLoadingTemplates - Whether templates are currently being loaded */
    static isLoadingTemplates = false;

    /** @var {Object} iconSystem - Object extending core/iconsystem */
    iconSystem = null;

    /** @var {Array} disallowedNestedHelpers - List of helpers that can't be called within other helpers */
    static disallowedNestedHelpers = [
        'js',
    ];

    /** @var {String[]} templateCache - Cache of already loaded template strings */
    static templateCache = {};

    /**
     * Cache of already loaded template promises.
     *
     * @type {Promise[]}
     * @static
     * @private
     */
    static templatePromises = {};

    /**
     * The loader used to fetch templates.
     * @type {Loader}
     * @static
     * @private
     */
    static loader = Loader;

    /**
     * Constructor
     *
     * Each call to templates.render gets it's own instance of this class.
     */
    constructor () {
        this.requiredStrings = [];
        this.requiredJS = [];
        this.requiredDates = [];
        this.currentThemeName = '';
    }

    /**
     * Set the template loader to use for all Template renderers.
     *
     * @param {Loader} loader
     */
    static setLoader (loader) {
        this.loader = loader;
    }

    /**
     * Get the Loader used to fetch templates.
     *
     * @returns {Loader}
     */
    static getLoader () {
        return this.loader;
    }

    /**
     * Render a single image icon.
     *
     * @method renderIcon
     * @private
     * @param {string} key The icon key.
     * @param {string} component The component name.
     * @param {string} title The icon title
     * @return {Promise}
     */
    async renderIcon (key, component, title) {
        // Preload the module to do the icon rendering based on the theme iconsystem.
        component = getNormalisedComponent(component);

        await this.setupIconSystem();
        const template = await Renderer.getLoader().getTemplate(
            this.iconSystem.getTemplateName(),
            this.currentThemeName,
        );

        return this.iconSystem.renderIcon(
            key,
            component,
            title,
            template
        );
    }

    /**
     * Helper to set up the icon system.
     */
    async setupIconSystem () {
        await import('core/ajax');
        await import('core/icon_system');
        window.console.log(`Icon system is '${config.iconsystemmodule}'`);
        const iconSystemName = 'core/icon_system_fontawesome';
        const System = await import(await iconSystemName);
        window.console.log("DONE!!!");
        const instance = new System();
        if (!(instance instanceof IconSystem)) {
            throw new Error(`Invalid icon system specified ${config.iconsystemmodule}`);
        }
        instance.init();

        this.iconSystem = instance;
    }

    /**
     * Render image icons.
     *
     * @method pixHelper
     * @private
     * @param {object} context The mustache context
     * @param {string} sectionText The text to parse arguments from.
     * @param {function} helper Used to render the alt attribute of the text.
     * @return {string}
     */
    async pixHelper (context, sectionText, helper) {
        const parts = sectionText.split(',');
        let key = '';
        let component = '';
        let text = '';

        if (parts.length > 0) {
            key = helper(parts.shift().trim(), context);
        }
        if (parts.length > 0) {
            component = helper(parts.shift().trim(), context);
        }
        if (parts.length > 0) {
            text = helper(parts.join(',').trim(), context);
        }

        const template = await Renderer.getLoader().getTemplate(
            this.iconSystem.getTemplateName(),
            this.currentTheme
        );

        component = getNormalisedComponent(component);

        // The key might have been escaped by the JS Mustache engine which
        // converts forward slashes to HTML entities. Let us undo that here.
        key = key.replace(/&#x2F;/gi, '/');

        return this.iconSystem.renderIcon(
            key,
            component,
            text,
            template
        );
    }

    /**
     * Render blocks of javascript and save them in an array.
     *
     * @method jsHelper
     * @private
     * @param {object} context The current mustache context.
     * @param {string} sectionText The text to save as a js block.
     * @param {function} helper Used to render the block.
     * @return {string}
     */
    jsHelper (context, sectionText, helper) {
        this.requiredJS.push(helper(sectionText, context));
        return '';
    }

    /**
     * String helper used to render {{#str}}abd component { a : 'fish'}{{/str}}
     * into a get_string call.
     *
     * @method stringHelper
     * @private
     * @param {object} context The current mustache context.
     * @param {string} sectionText The text to parse the arguments from.
     * @param {function} helper Used to render subsections of the text.
     * @return {string}
     */
    stringHelper (context, sectionText, helper) {
        var parts = sectionText.split(',');
        var key = '';
        var component = '';
        var param = '';
        if (parts.length > 0) {
            key = parts.shift().trim();
        }
        if (parts.length > 0) {
            component = parts.shift().trim();
        }
        if (parts.length > 0) {
            param = parts.join(',').trim();
        }

        component = getNormalisedComponent(component);

        if (param !== '') {
            // Allow variable expansion in the param part only.
            param = helper(param, context);
        }

        // Allow json formatted $a arguments.
        // Added double quote after left curly bracket to differentiate between string and JSON string.
        if (param.indexOf('{"') === 0) {
            // If it can't be parsed then the string is not a JSON format.
            try {
                const parsedParam = JSON.parse(param);
                // Handle non-exception-throwing cases, e.g. null, integer, boolean.
                if (parsedParam && typeof parsedParam === "object") {
                    param = parsedParam;
                }
            } catch (err) {
                // This was probably not JSON.
                // Keep the error message visible.
                window.console.warn(err.message);
            }
        }

        var index = this.requiredStrings.length;
        this.requiredStrings.push({
            key: key,
            component: component,
            param: param
        });

        // The placeholder must not use {{}} as those can be misinterpreted by the engine.
        return '[[_s' + index + ']]';
    }

    /**
     * String helper to render {{#cleanstr}}abd component { a : 'fish'}{{/cleanstr}}
     * into a get_string following by an HTML escape.
     *
     * @method cleanStringHelper
     * @private
     * @param {object} context The current mustache context.
     * @param {string} sectionText The text to parse the arguments from.
     * @param {function} helper Used to render subsections of the text.
     * @return {string}
     */
    cleanStringHelper (context, sectionText, helper) {
        var str = this.stringHelper(context, sectionText, helper);

        // We're going to use [[_cx]] format for clean strings, where x is a number.
        // Hence, replacing 's' with 'c' in the placeholder that stringHelper returns.
        return str.replace('s', 'c');
    }

    /**
     * Quote helper used to wrap content in quotes, and escape all special JSON characters present in the content.
     *
     * @method quoteHelper
     * @private
     * @param {object} context The current mustache context.
     * @param {string} sectionText The text to parse the arguments from.
     * @param {function} helper Used to render subsections of the text.
     * @return {string}
     */
    quoteHelper (context, sectionText, helper) {
        var content = helper(sectionText.trim(), context);

        // Escape the {{ and JSON encode.
        // This involves wrapping {{, and }} in change delimeter tags.
        content = JSON.stringify(content);
        content = content.replace(/([{}]{2,3})/g, '{{=<% %>=}}$1<%={{ }}=%>');
        return content;
    }

    /**
     * Shorten text helper to truncate text and append a trailing ellipsis.
     *
     * @method shortenTextHelper
     * @private
     * @param {object} context The current mustache context.
     * @param {string} sectionText The text to parse the arguments from.
     * @param {function} helper Used to render subsections of the text.
     * @return {string}
     */
    shortenTextHelper (context, sectionText, helper) {
        // Non-greedy split on comma to grab section text into the length and
        // text parts.
        var regex = /(.*?),(.*)/;
        var parts = sectionText.match(regex);
        // The length is the part matched in the first set of parethesis.
        var length = parts[1].trim();
        // The length is the part matched in the second set of parethesis.
        var text = parts[2].trim();
        var content = helper(text, context);
        return Truncate.truncate(content, {
            length: length,
            words: true,
            ellipsis: '...'
        });
    }

    /**
     * User date helper to render user dates from timestamps.
     *
     * @method userDateHelper
     * @private
     * @param {object} context The current mustache context.
     * @param {string} sectionText The text to parse the arguments from.
     * @param {function} helper Used to render subsections of the text.
     * @return {string}
     */
    userDateHelper (context, sectionText, helper) {
        // Non-greedy split on comma to grab the timestamp and format.
        var regex = /(.*?),(.*)/;
        var parts = sectionText.match(regex);
        var timestamp = helper(parts[1].trim(), context);
        var format = helper(parts[2].trim(), context);
        var index = this.requiredDates.length;

        this.requiredDates.push({
            timestamp: timestamp,
            format: format
        });

        return '[[_t_' + index + ']]';
    }

    /**
     * Return a helper function to be added to the context for rendering the a
     * template.
     *
     * This will parse the provided text before giving it to the helper function
     * in order to remove any disallowed nested helpers to prevent one helper
     * from calling another.
     *
     * In particular to prevent the JS helper from being called from within another
     * helper because it can lead to security issues when the JS portion is user
     * provided.
     *
     * @param  {function} helperFunction The helper function to add
     * @param  {object} context The template context for the helper function
     * @return {Function} To be set in the context
     */
    addHelperFunction (helperFunction, context) {
        return function () {
            return function (sectionText, helper) {
                // Override the disallowed helpers in the template context with
                // a function that returns an empty string for use when executing
                // other helpers. This is to prevent these helpers from being
                // executed as part of the rendering of another helper in order to
                // prevent any potential security issues.
                var originalHelpers = Renderer.disallowedNestedHelpers.reduce(function (carry, name) {
                    if (context.hasOwnProperty(name)) {
                        carry[name] = context[name];
                    }

                    return carry;
                }, {});

                Renderer.disallowedNestedHelpers.forEach(function (helperName) {
                    context[helperName] = function () {
                        return '';
                    };
                });

                // Execute the helper with the modified context that doesn't include
                // the disallowed nested helpers. This prevents the disallowed
                // helpers from being called from within other helpers.
                var result = helperFunction.apply(this, [context, sectionText, helper]);

                // Restore the original helper implementation in the context so that
                // any further rendering has access to them again.
                for (var name in originalHelpers) {
                    context[name] = originalHelpers[name];
                }

                return result;
            }.bind(this);
        }.bind(this);
    }

    /**
     * Add some common helper functions to all context objects passed to templates.
     * These helpers match exactly the helpers available in php.
     *
     * @method addHelpers
     * @private
     * @param {Object} context Simple types used as the context for the template.
     * @param {String} themeName We set this multiple times, because there are async calls.
     */
    addHelpers (context, themeName) {
        this.currentThemeName = themeName;
        this.requiredStrings = [];
        this.requiredJS = [];
        context.uniqid = (Renderer.uniqInstances++);
        context.str = this.addHelperFunction(this.stringHelper, context);
        context.cleanstr = this.addHelperFunction(this.cleanStringHelper, context);
        context.pix = this.addHelperFunction(this.pixHelper, context);
        context.js = this.addHelperFunction(this.jsHelper, context);
        context.quote = this.addHelperFunction(this.quoteHelper, context);
        context.shortentext = this.addHelperFunction(this.shortenTextHelper, context);
        context.userdate = this.addHelperFunction(this.userDateHelper, context);
        context.globals = {config: config};
        context.currentTheme = themeName;
    }

    /**
     * Get all the JS blocks from the last rendered template.
     *
     * @method getJS
     * @private
     * @return {string}
     */
    getJS () {
        var js = '';
        if (this.requiredJS.length > 0) {
            js = this.requiredJS.join(";\n");
        }

        return js;
    }

    /**
     * Treat strings in content.
     *
     * The purpose of this method is to replace the placeholders found in a string
     * with the their respective translated strings.
     *
     * Previously we were relying on String.replace() but the complexity increased with
     * the numbers of strings to replace. Now we manually walk the string and stop at each
     * placeholder we find, only then we replace it. Most of the time we will
     * replace all the placeholders in a single run, at times we will need a few
     * more runs when placeholders are replaced with strings that contain placeholders
     * themselves.
     *
     * @param {String} content The content in which string placeholders are to be found.
     * @param {Array} strings The strings to replace with.
     * @return {String} The treated content.
     */
    treatStringsInContent (content, strings) {
        var pattern = /\[\[_(s|c)\d+\]\]/;
        var treated;
        var index;
        var strIndex;
        var walker;
        var char;
        var strFinal;
        var isClean;

        do {
            treated = '';
            index = content.search(pattern);
            while (index && index > -1) {

                // Copy the part prior to the placeholder to the treated string.
                treated += content.substring(0, index);
                content = content.substr(index);
                isClean = content[3] == 'c';
                strIndex = '';
                walker = 4; // 4 is the length of either '[[_s' or '[[_c'.

                // Walk the characters to manually extract the index of the string from the placeholder.
                char = content.substr(walker, 1);
                do {
                    strIndex += char;
                    walker++;
                    char = content.substr(walker, 1);
                } while (char != ']');

                // Get the string, add it to the treated result, and remove the placeholder from the content to treat.
                strFinal = strings[parseInt(strIndex, 10)];
                if (typeof strFinal === 'undefined') {
                    Log.debug('Could not find string for pattern [[_' + (isClean ? 'c' : 's') + strIndex + ']].');
                    strFinal = '';
                }
                if (isClean) {
                    strFinal = mustache.escape(strFinal);
                }
                treated += strFinal;
                content = content.substr(6 + strIndex.length); // 6 is the length of the placeholder without the index.
                                                                // That's either '[[_s]]' or '[[_c]]'.

                // Find the next placeholder.
                index = content.match(pattern);
            }

            // The content becomes the treated part with the rest of the content.
            content = treated + content;

            // Check if we need to walk the content again, in case strings contained placeholders.
            index = content.search(pattern);

        } while (index > -1);

        return content;
    }

    /**
     * Treat strings in content.
     *
     * The purpose of this method is to replace the date placeholders found in the
     * content with the their respective translated dates.
     *
     * @param {String} content The content in which string placeholders are to be found.
     * @param {Array} dates The dates to replace with.
     * @return {String} The treated content.
     */
    treatDatesInContentfunction (content, dates) {
        dates.forEach(function (date, index) {
            var key = '\\[\\[_t_' + index + '\\]\\]';
            var re = new RegExp(key, 'g');
            content = content.replace(re, date);
        });

        return content;
    }

    /**
     * Render a template and then call the callback with the result.
     *
     * @method doRender
     * @private
     * @param {string} templateSource The mustache template to render.
     * @param {Object} context Simple types used as the context for the template.
     * @param {String} themeName Name of the current theme.
     * @return {Promise} object
     */
    doRender (templateSource, context, themeName) {
        this.currentThemeName = themeName;
        const iconTemplate = this.iconSystem.getTemplateName();

        var pendingPromise = new Pending('core/templates:doRender');
        return Renderer.getLoader().getTemplate(iconTemplate, themeName)
        .then(() => {
            this.addHelpers(context, themeName);
            return templateSource;
        })
        .then((source) => mustache.render(source, context, (partialName) => {
            return Renderer.getLoader().partialHelper(partialName, themeName);
        }))
        .then((result) => {
            return {
                html: result.trim(),
                js: this.getJS(),
            };
        })
        .then(function ({html, js}) {
            if (this.requiredStrings.length > 0) {
                return str.get_strings(this.requiredStrings).then(function (strings) {

                    // Make sure string substitutions are done for the userdate
                    // values as well.
                    this.requiredDates = this.requiredDates.map(function (date) {
                        return {
                            timestamp: this.treatStringsInContent(date.timestamp, strings),
                            format: this.treatStringsInContent(date.format, strings)
                        };
                    }.bind(this));

                    // Why do we not do another call the render here?
                    //
                    // Because that would expose DOS holes. E.g.
                    // I create an assignment called "{{fish" which
                    // would get inserted in the template in the first pass
                    // and cause the template to die on the second pass (unbalanced).
                    html = this.treatStringsInContent(html, strings);
                    js = this.treatStringsInContent(js, strings);
                    return {html, js};
                }.bind(this));
            }

            return {html, js};
        }.bind(this))
        .then(({html, js}) => {
            // This has to happen after the strings replacement because you can
            // use the string helper in content for the user date helper.
            if (this.requiredDates.length > 0) {
                return UserDate.get(this.requiredDates).then(function (dates) {
                    html = this.treatDatesInContent(html, dates);
                    js = this.treatDatesInContent(js, dates);
                    return {html, js};
                }.bind(this));
            }

            return {html, js};
        })
        .then(({html, js}) => {
            pendingPromise.resolve();
            return {html, js};
        });
    }

    /**
     * Load a template and call doRender on it.
     *
     * @method render
     * @private
     * @param {string} templateName - should consist of the component and the name of the template like this:
     *                              core/menu (lib/templates/menu.mustache) or
     *                              tool_bananas/yellow (admin/tool/bananas/templates/yellow.mustache)
     * @param {Object} context - Could be array, string or simple value for the context of the template.
     * @param {string} themeName - Name of the current theme.
     * @returns {Promise<object>} Native promise object resolved when the template has been rendered.}
     */
    async render (templateName, context, themeName = config.theme) {
        this.currentThemeName = themeName;

        // Preload the module to do the icon rendering based on the theme iconsystem.
        await this.setupIconSystem();

        const templateSource = Renderer.getLoader().cachePartials(templateName, themeName);
        return this.doRender(templateSource, context, themeName);
    }
}
