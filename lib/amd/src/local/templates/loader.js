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

import $ from 'jquery';
import ajax from 'core/ajax';
import * as str from 'core/str';
import * as config from 'core/config';
import mustache from 'core/mustache';
import storage from 'core/localstorage';
import * as notification from 'core/notification';
import {getNormalisedComponent} from 'core/utils';

/**
 * Template Loader.
 *
 * @module     core/local/templates/loader
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      4.2
 */
export default class Loader {
    /** @var {String} themeName for the current render */
    currentThemeName = '';

    /** @var {Number} uniqInstances Count of times this constructor has been called. */
    static uniqInstances = 0;

    /** @var {Object[]} loadTemplateBuffer - List of templates to be loaded */
    static loadTemplateBuffer = [];

    /** @var {Bool} isLoadingTemplates - Whether templates are currently being loaded */
    static isLoadingTemplates = false;

    /** @var {Object} iconSystem - Object extending core/iconsystem */
    static iconSystem = {};

    /** @var {Array} disallowedNestedHelpers - List of helpers that can't be called within other helpers */
    static disallowedNestedHelpers = [
        'js',
    ];

    /** @var {String[]} templateCache - Cache of already loaded template strings */
    static templateCache = {};

    /** @var {Promise[]} templatePromises - Cache of already loaded template promises */
    static templatePromises = {};

    static getSearchKey (theme, templateName) {
        return `${theme}/${templateName}`;
    }

    /** @var {Promise[]} cachePartialPromises - Cache of already loaded template partial promises */
    static cachePartialPromises = [];

    /**
     * Load a template.
     *
     * @method getTemplate
     * @private
     * @param {string} templateName - should consist of the component and the name of the template like this:
     *                              core/menu (lib/templates/menu.mustache) or
     *                              tool_bananas/yellow (admin/tool/bananas/templates/yellow.mustache)
     * @param {string} [themeName=config.theme] - The theme to load the template from
     * @return {Promise} JQuery promise object resolved when the template has been fetched.
     */
    static getTemplate (templateName, themeName = config.theme) {
        const searchKey = this.getSearchKey(themeName, templateName);

        // If we haven't already seen this template then buffer it.
        const cachedPromise = this.getTemplatePromiseFromCache(searchKey);
        if (cachedPromise) {
            return cachedPromise;
        }

        // Check the buffer to see if this template has already been added.
        var existingBufferRecords = this.loadTemplateBuffer.filter(function (record) {
            return record.searchKey == searchKey;
        });
        if (existingBufferRecords.length) {
            // This template is already in the buffer so just return the existing
            // promise. No need to add it to the buffer again.
            return existingBufferRecords[0].deferred.promise();
        }

        // This is the first time this has been requested so let's add it to the buffer
        // to be loaded.
        var parts = templateName.split('/');
        var component = getNormalisedComponent(parts.shift());
        var name = parts.join('/');
        var deferred = $.Deferred();

        // Add this template to the buffer to be loaded.
        this.loadTemplateBuffer.push({
            component: component,
            name: name,
            theme: themeName,
            searchKey: searchKey,
            deferred: deferred
        });

        // We know there is at least one thing in the buffer so kick off a processing run.
        this.processLoadTemplateBuffer();
        return deferred.promise();
    }

    /**
     * Prefetch a set of templates without rendering them.
     *
     * @param {Array} templateNames The list of templates to fetch
     * @param {String} themeName
     */
    static prefetchTemplates (templateNames, themeName) {
        templateNames.forEach((templateName) => this.prefetchTemplate(templateName, themeName));
    }

    static prefetchTemplate (templateName, themeName) {
        const searchKey = this.getSearchKey(themeName, templateName);

        // If we haven't already seen this template then buffer it.
        if (this.getTemplatePromiseFromCache(searchKey)) {
            return;
        }

        // Check the buffer to see if this template has already been added.
        var existingBufferRecords = this.loadTemplateBuffer.filter(function (record) {
            return record.searchKey == searchKey;
        });

        if (existingBufferRecords.length) {
            // This template is already in the buffer so just return the existing promise.
            // No need to add it to the buffer again.
            return;
        }

        // This is the first time this has been requested so let's add it to the buffer to be loaded.
        var parts = templateName.split('/');
        var component = getNormalisedComponent(parts.shift());
        var name = parts.join('/');

        // Add this template to the buffer to be loaded.
        this.loadTemplateBuffer.push({
            component: component,
            name: name,
            theme: themeName,
            searchKey: searchKey,
            deferred: $.Deferred(),
        });

        this.processLoadTemplateBuffer();
    }

    /**
     * Load a partial from the cache or ajax.
     *
     * @method partialHelper
     * @private
     * @param {string} name The partial name to load.
     * @param {string} [themeName = config.theme] The theme to load the partial from.
     * @return {string}
     */
    static partialHelper (name, themeName = config.theme) {
        const searchKey = this.getSearchKey(themeName, name);

        if (!(searchKey in this.templateCache)) {
            notification.exception(new Error('Failed to pre-fetch the template: ' + name));
        }

        return this.templateCache[searchKey];
    }

    /**
     * Scan a template source for partial tags and return a list of the found partials.
     *
     * @method scanForPartials
     * @private
     * @param {string} templateSource - source template to scan.
     * @return {Array} List of partials.
     */
    static scanForPartials (templateSource) {
        const tokens = mustache.parse(templateSource);
        const partials = [];

        const findPartial = (tokens, partials) => {
            let i;
            for (i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                if (token[0] == '>' || token[0] == '<') {
                    partials.push(token[1]);
                }
                if (token.length > 4) {
                    findPartial(token[4], partials);
                }
            }
        };

        findPartial(tokens, partials);

        return partials;
    }

    /**
     * Load a template and scan it for partials. Recursively fetch the partials.
     *
     * @method cachePartials
     * @private
     * @param {string} templateName - should consist of the component and the name of the template like this:
     *                              core/menu (lib/templates/menu.mustache) or
     *                              tool_bananas/yellow (admin/tool/bananas/templates/yellow.mustache)
     * @param {string} [themeName=config.theme]
     * @param {Array} parentage - A list of requested partials in this render chain.
     * @return {Promise} JQuery promise object resolved when all partials are in the cache.
     */
    static cachePartials (templateName, themeName = config.theme, parentage = []) {
        const searchKey = this.getSearchKey(this.currentThemeName, templateName);

        if (searchKey in this.cachePartialPromises) {
            return this.cachePartialPromises[searchKey];
        }

        // This promise will not be resolved until all child partials are also resolved and ready.
        // We create it here to allow us to check for recursive inclusion of templates.
        // Keep track of the requested partials in this chain.
        parentage = parentage || [searchKey];

        this.cachePartialPromises[searchKey] = $.Deferred();

        this.getTemplate(templateName, themeName)
            .then(function (templateSource) {
                var partials = this.scanForPartials(templateSource);
                var uniquePartials = partials.filter(function (partialName) {
                    // Check for recursion.

                    if (parentage.indexOf(this.currentThemeName + '/' + partialName) >= 0) {
                        // Ignore templates which include a parent template already requested in the current chain.
                        return false;
                    }

                    // Ignore templates that include themselves.
                    return partialName != templateName;
                }.bind(this));

                // Fetch any partial which has not already been fetched.
                var fetchThemAll = uniquePartials.map(function (partialName) {
                    parentage.push(this.currentThemeName + '/' + partialName);
                    return this.cachePartials(partialName, themeName, parentage);
                }.bind(this));

                // Resolve the templateName promise when all of the children are resolved.
                return $.when.apply($, fetchThemAll)
                    .then(function () {
                        return Loader.cachePartialPromises[searchKey].resolve(templateSource);
                    });
            }.bind(this))
            .catch(Loader.cachePartialPromises[searchKey].reject);

        return this.cachePartialPromises[searchKey];
    }

    /**
     * Take all of the templates waiting in the buffer and load them from the server
     * or from the cache.
     *
     * All of the templates that need to be loaded from the server will be batched up
     * and sent in a single network request.
     */
    static processLoadTemplateBuffer () {
        if (!this.loadTemplateBuffer.length) {
            return;
        }

        if (this.isLoadingTemplates) {
            return;
        }

        this.isLoadingTemplates = true;
        // Grab any templates waiting in the buffer.
        var templatesToLoad = this.loadTemplateBuffer.slice();
        // This will be resolved with the list of promises for the server request.
        var serverRequestsDeferred = $.Deferred();
        var requests = [];
        // Get a list of promises for each of the templates we need to load.
        var templatePromises = templatesToLoad.map(function (templateData) {
            var component = getNormalisedComponent(templateData.component);
            var name = templateData.name;
            var searchKey = templateData.searchKey;
            var theme = templateData.theme;
            var templateDeferred = templateData.deferred;
            var promise = null;

            // Double check to see if this template happened to have landed in the
            // cache as a dependency of an earlier template.
            var cachedPromise = Loader.getTemplatePromiseFromCache(searchKey);
            if (cachedPromise) {
                // We've seen this template so immediately resolve the existing promise.
                promise = cachedPromise;
            } else {
                // We haven't seen this template yet so we need to request it from
                // the server.
                requests.push({
                    methodname: 'core_output_load_template_with_dependencies',
                    args: {
                        component: component,
                        template: name,
                        themename: theme,
                        lang: $('html').attr('lang').replace(/-/g, '_')
                    }
                });
                // Remember the index in the requests list for this template so that
                // we can get the appropriate promise back.
                var index = requests.length - 1;

                // The server deferred will be resolved with a list of all of the promises
                // that were sent in the order that they were added to the requests array.
                promise = serverRequestsDeferred.promise()
                    .then(function (promises) {
                        // The promise for this template will be the one that matches the index
                        // for it's entry in the requests array.
                        //
                        // Make sure the promise is added to the promises cache for this template
                        // search key so that we don't request it again.
                        templatePromises[searchKey] = promises[index].then(function (response) {
                            var templateSource = null;

                            // Process all of the template dependencies for this template and add
                            // them to the caches so that we don't request them again later.
                            response.templates.forEach(function (data) {
                                data.component = getNormalisedComponent(data.component);
                                // Generate the search key for this template in the response so that we
                                // can add it to the caches.
                                var tempSearchKey = [theme, data.component, data.name].join('/');
                                // Cache all of the dependent templates because we'll need them to render
                                // the requested template.
                                Loader.templateCache[tempSearchKey] = data.value;

                                if (M.cfg.templaterev > 0) {
                                    // The template cache is enabled - set the value there.
                                    storage.set('core_template/' + M.cfg.templaterev + ':' + tempSearchKey, data.value);
                                }

                                if (data.component == component && data.name == name) {
                                    // This is the original template that was requested so remember it to return.
                                    templateSource = data.value;
                                }
                            });

                            if (response.strings.length) {
                                // If we have strings that the template needs then warm the string cache
                                // with them now so that we don't need to re-fetch them.
                                str.cache_strings(response.strings.map(function (data) {
                                    return {
                                        component: getNormalisedComponent(data.component),
                                        key: data.name,
                                        value: data.value
                                    };
                                }));
                            }

                            // Return the original template source that the user requested.
                            return templateSource;
                        });

                        return templatePromises[searchKey];
                    });
            }

            return promise
                .then(function (source) {
                    // When we've successfully loaded the template then resolve the deferred
                    // in the buffer so that all of the calling code can proceed.
                    return templateDeferred.resolve(source);
                })
                .catch(function (error) {
                    // If there was an error loading the template then reject the deferred
                    // in the buffer so that all of the calling code can proceed.
                    templateDeferred.reject(error);
                    // Rethrow for anyone else listening.
                    throw error;
                });
        });

        if (requests.length) {
            // We have requests to send so resolve the deferred with the promises.
            serverRequestsDeferred.resolve(ajax.call(requests, true, false, false, 0, M.cfg.templaterev));
        } else {
            // Nothing to load so we can resolve our deferred.
            serverRequestsDeferred.resolve();
        }

        // Once we've finished loading all of the templates then recurse to process
        // any templates that may have been added to the buffer in the time that we
        // were fetching.
        $.when.apply(null, templatePromises)
            .then(function () {
                // Remove the templates we've loaded from the buffer.
                Loader.loadTemplateBuffer.splice(0, templatesToLoad.length);
                Loader.isLoadingTemplates = false;
                Loader.processLoadTemplateBuffer();
                return;
            })
            .catch(function () {
                // Remove the templates we've loaded from the buffer.
                Loader.loadTemplateBuffer.splice(0, templatesToLoad.length);
                Loader.isLoadingTemplates = false;
                Loader.processLoadTemplateBuffer();
            });
    }

    /**
     * Search the various caches for a template promise for the given search key.
     * The search key should be in the format <theme>/<component>/<template> e.g. boost/core/modal.
     *
     * If the template is found in any of the caches it will populate the other caches with
     * the same data as well.
     *
     * @param {String} searchKey The template search key in the format <theme>/<component>/<template> e.g. boost/core/modal
     * @returns {Object|null} jQuery promise resolved with the template source
     */
    static getTemplatePromiseFromCache (searchKey) {
        // First try the cache of promises.
        if (searchKey in this.templatePromises) {
            return this.templatePromises[searchKey];
        }

        // Check the module cache.
        if (searchKey in this.templateCache) {
            // Add this to the promises cache for future.
            this.templatePromises[searchKey] = $.Deferred().resolve(this.templateCache[searchKey]).promise();
            return this.templatePromises[searchKey];
        }

        if (config.templaterev <= 0) {
            // Template caching is disabled. Do not store in persistent storage.
            return null;
        }

        // Now try local storage.
        const cached = storage.get('core_template/' + M.cfg.templaterev + ':' + searchKey);
        if (cached) {
            // Add this to the module cache for future.
            this.templateCache[searchKey] = cached;
            // Add this to the promises cache for future.
            this.templatePromises[searchKey] = $.Deferred().resolve(cached).promise();
            return this.templatePromises[searchKey];
        }

        return null;
    }
}
