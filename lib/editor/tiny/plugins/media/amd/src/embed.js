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
 * Tiny Media plugin Embed class for Moodle.
 *
 * @module      tiny_media/embed
 * @copyright   2022 Huong Nguyen <huongnv13@gmail.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Templates from 'core/templates';
import {get_string as getString} from 'core/str';
import * as Modal from 'core/modal_factory';
import * as ModalEvents from 'core/modal_events';
import {displayFilepicker} from 'editor_tiny/utils';
import {getMoodleLang} from 'editor_tiny/options';
import {component} from "./common";

export const MediaEmbed = class {

    MEDIA_TYPES = {LINK: 'LINK', VIDEO: 'VIDEO', AUDIO: 'AUDIO'};

    TRACK_KINDS = {
        SUBTITLES: 'SUBTITLES',
        CAPTIONS: 'CAPTIONS',
        DESCRIPTIONS: 'DESCRIPTIONS',
        CHAPTERS: 'CHAPTERS',
        METADATA: 'METADATA'
    };

    CSS = {
        FORM: 'form.tiny_media_form',
        SOURCE: 'tiny_media_source',
        TRACK: 'tiny_media_track',
        MEDIA_SOURCE: 'tiny_media_media_source',
        MEDIA_BROWSER: 'openmediabrowser',
        LINK_SOURCE: 'tiny_media_link_source',
        POSTER_SOURCE: 'tiny_media_poster_source',
        TRACK_SOURCE: 'tiny_media_track_source',
        DISPLAY_OPTIONS: 'tiny_media_display_options',
        NAME_INPUT: 'tiny_media_name_entry',
        TITLE_INPUT: 'tiny_media_title_entry',
        URL_INPUT: 'tiny_media_url_entry',
        POSTER_SIZE: 'tiny_media_poster_size',
        LINK_SIZE: 'tiny_media_link_size',
        WIDTH_INPUT: 'tiny_media_width_entry',
        HEIGHT_INPUT: 'tiny_media_height_entry',
        TRACK_KIND_INPUT: 'tiny_media_track_kind_entry',
        TRACK_LABEL_INPUT: 'tiny_media_track_label_entry',
        TRACK_LANG_INPUT: 'tiny_media_track_lang_entry',
        TRACK_DEFAULT_SELECT: 'tiny_media_track_default',
        MEDIA_CONTROLS_TOGGLE: 'tiny_media_controls',
        MEDIA_AUTOPLAY_TOGGLE: 'tiny_media_autoplay',
        MEDIA_MUTE_TOGGLE: 'tiny_media_mute',
        MEDIA_LOOP_TOGGLE: 'tiny_media_loop',
        ADVANCED_SETTINGS: 'tiny_media_advancedsettings',
        INPUTSUBMIT: 'tiny_media_submit',
        LINK: this.MEDIA_TYPES.LINK.toLowerCase(),
        VIDEO: this.MEDIA_TYPES.VIDEO.toLowerCase(),
        AUDIO: this.MEDIA_TYPES.AUDIO.toLowerCase(),
        TRACK_SUBTITLES: this.TRACK_KINDS.SUBTITLES.toLowerCase(),
        TRACK_CAPTIONS: this.TRACK_KINDS.CAPTIONS.toLowerCase(),
        TRACK_DESCRIPTIONS: this.TRACK_KINDS.DESCRIPTIONS.toLowerCase(),
        TRACK_CHAPTERS: this.TRACK_KINDS.CHAPTERS.toLowerCase(),
        TRACK_METADATA: this.TRACK_KINDS.METADATA.toLowerCase(),
    };

    SELECTORS = {
        SOURCE: '.' + this.CSS.SOURCE,
        TRACK: '.' + this.CSS.TRACK,
        MEDIA_SOURCE: '.' + this.CSS.MEDIA_SOURCE,
        MEDIA_BROWSER: '.' + this.CSS.MEDIA_BROWSER,
        POSTER_SOURCE: '.' + this.CSS.POSTER_SOURCE,
        TRACK_SOURCE: '.' + this.CSS.TRACK_SOURCE,
        DISPLAY_OPTIONS: '.' + this.CSS.DISPLAY_OPTIONS,
        NAME_INPUT: '.' + this.CSS.NAME_INPUT,
        TITLE_INPUT: '.' + this.CSS.TITLE_INPUT,
        URL_INPUT: '.' + this.CSS.URL_INPUT,
        POSTER_SIZE: '.' + this.CSS.POSTER_SIZE,
        LINK_SIZE: '.' + this.CSS.LINK_SIZE,
        WIDTH_INPUT: '.' + this.CSS.WIDTH_INPUT,
        HEIGHT_INPUT: '.' + this.CSS.HEIGHT_INPUT,
        TRACK_KIND_INPUT: '.' + this.CSS.TRACK_KIND_INPUT,
        TRACK_LABEL_INPUT: '.' + this.CSS.TRACK_LABEL_INPUT,
        TRACK_LANG_INPUT: '.' + this.CSS.TRACK_LANG_INPUT,
        TRACK_DEFAULT_SELECT: '.' + this.CSS.TRACK_DEFAULT_SELECT,
        MEDIA_CONTROLS_TOGGLE: '.' + this.CSS.MEDIA_CONTROLS_TOGGLE,
        MEDIA_AUTOPLAY_TOGGLE: '.' + this.CSS.MEDIA_AUTOPLAY_TOGGLE,
        MEDIA_MUTE_TOGGLE: '.' + this.CSS.MEDIA_MUTE_TOGGLE,
        MEDIA_LOOP_TOGGLE: '.' + this.CSS.MEDIA_LOOP_TOGGLE,
        ADVANCED_SETTINGS: '.' + this.CSS.ADVANCED_SETTINGS,
        INPUTSUBMIT: '.' + this.CSS.INPUTSUBMIT,
        LINK_TAB: 'li[data-medium-type="' + this.CSS.LINK + '"]',
        LINK_PANE: '.tab-pane[data-medium-type="' + this.CSS.LINK + '"]',
        VIDEO_TAB: 'li[data-medium-type="' + this.CSS.VIDEO + '"]',
        VIDEO_PANE: '.tab-pane[data-medium-type="' + this.CSS.VIDEO + '"]',
        AUDIO_TAB: 'li[data-medium-type="' + this.CSS.AUDIO + '"]',
        AUDIO_PANE: '.tab-pane[data-medium-type="' + this.CSS.AUDIO + '"]',
        TRACK_SUBTITLES_TAB: 'li[data-track-kind="' + this.CSS.TRACK_SUBTITLES + '"]',
        TRACK_SUBTITLES_PANE: '.tab-pane[data-track-kind="' + this.CSS.TRACK_SUBTITLES + '"]',
        TRACK_CAPTIONS_TAB: 'li[data-track-kind="' + this.CSS.TRACK_CAPTIONS + '"]',
        TRACK_CAPTIONS_PANE: '.tab-pane[data-track-kind="' + this.CSS.TRACK_CAPTIONS + '"]',
        TRACK_DESCRIPTIONS_TAB: 'li[data-track-kind="' + this.CSS.TRACK_DESCRIPTIONS + '"]',
        TRACK_DESCRIPTIONS_PANE: '.tab-pane[data-track-kind="' + this.CSS.TRACK_DESCRIPTIONS + '"]',
        TRACK_CHAPTERS_TAB: 'li[data-track-kind="' + this.CSS.TRACK_CHAPTERS + '"]',
        TRACK_CHAPTERS_PANE: '.tab-pane[data-track-kind="' + this.CSS.TRACK_CHAPTERS + '"]',
        TRACK_METADATA_TAB: 'li[data-track-kind="' + this.CSS.TRACK_METADATA + '"]',
        TRACK_METADATA_PANE: '.tab-pane[data-track-kind="' + this.CSS.TRACK_METADATA + '"]'
    };

    form = null;
    editor = null;
    currentModal = null;
    canShowFilePicker = true;
    eventInitialized = false;

    constructor(editor) {
        this.editor = editor;
    }

    async displayDialogue() {
        const [
            addSourceHelpString,
            tracksHelpString,
            subtitlesHelpString,
            captionsHelpString,
            descriptionsHelpString,
            chaptersHelpString,
            metadataHelpString,
        ] = await Promise.all([
            getString('addsource_help', component),
            getString('tracks_help', component),
            getString('subtitles_help', component),
            getString('captions_help', component),
            getString('descriptions_help', component),
            getString('chapters_help', component),
            getString('metadata_help', component),
        ]);
        const languages = this.prepareMoodleLang();
        Modal.create({
            type: Modal.types.DEFAULT,
            title: getString('createmedia', 'tiny_media'),
            body: Templates.render('tiny_media/embed_media_modal', {
                elementid: this.editor.getElement().id,
                CSS: this.CSS,
                showfilepicker: this.canShowFilePicker,
                addsourcehelpicon: {
                    text: addSourceHelpString,
                },
                trackshelpicon: {
                    text: tracksHelpString,
                },
                subtitleshelpicon: {
                    text: subtitlesHelpString,
                },
                captionshelpicon: {
                    text: captionsHelpString,
                },
                descriptionshelpicon: {
                    text: descriptionsHelpString,
                },
                chaptershelpicon: {
                    text: chaptersHelpString,
                },
                metadatahelpicon: {
                    text: metadataHelpString,
                },
                langsinstalled: languages.installed,
                langsavailable: languages.available,
            })
        }).then(modal => {
            this.currentModal = modal;
            modal.getRoot().on(ModalEvents.bodyRendered, () => {
                this.form = document.querySelector(this.CSS.FORM);
                this.applyMediumProperties();
                this.registerEventListeners();
            });
            modal.getRoot().on(ModalEvents.hidden, () => {
                modal.destroy();
            });
            modal.show();
            return modal;
        });
    }

    getSelectedMedia() {
        let mediaElm = this.editor.selection.getNode();

        if (!mediaElm) {
            return null;
        }

        if (mediaElm.nodeName.toLowerCase() === 'video' || mediaElm.nodeName.toLowerCase() === 'audio') {
            return mediaElm;
        }

        if (mediaElm.querySelector('video')) {
            return mediaElm.querySelector('video');
        }

        if (mediaElm.querySelector('audio')) {
            return mediaElm.querySelector('audio');
        }

        return null;
    }

    getMediumProperties() {
        const boolAttr = (elem, attr) => {
            // As explained in MDL-64175, some OS (like Ubuntu), are removing the value for these attributes.
            // So in order to check if attr="true", we need to check if the attribute exists and if the value is empty or true.
            return (elem.hasAttribute(attr) && (elem.getAttribute(attr) || elem.getAttribute(attr) === ''));
        };

        let tracks = {
            subtitles: [],
            captions: [],
            descriptions: [],
            chapters: [],
            metadata: []
        };
        let sources = [];

        const medium = this.getSelectedMedia();
        if (!medium) {
            return null;
        }
        medium.querySelectorAll('track').forEach(track => {
            tracks[track.getAttribute('kind')].push({
                src: track.getAttribute('src'),
                srclang: track.getAttribute('srclang'),
                label: track.getAttribute('label'),
                defaultTrack: boolAttr(track, 'default')
            });
        });

        medium.querySelectorAll('source').forEach(source => {
            sources.push(source.src);
        });

        return {
            type: medium.nodeName.toLowerCase() === 'video' ? this.MEDIA_TYPES.VIDEO : this.MEDIA_TYPES.AUDIO,
            sources: sources,
            poster: medium.getAttribute('poster'),
            title: medium.getAttribute('title'),
            width: medium.getAttribute('width'),
            height: medium.getAttribute('height'),
            autoplay: boolAttr(medium, 'autoplay'),
            loop: boolAttr(medium, 'loop'),
            muted: boolAttr(medium, 'muted'),
            controls: boolAttr(medium, 'controls'),
            tracks: tracks
        };
    }

    applyMediumProperties() {
        const properties = this.getMediumProperties();
        if (!properties) {
            return;
        }

        const applyTrackProperties = (track, properties) => {
            track.querySelector(this.SELECTORS.TRACK_SOURCE + ' ' + this.SELECTORS.URL_INPUT).value = properties.src;
            track.querySelector(this.SELECTORS.TRACK_LANG_INPUT).value = properties.srclang;
            track.querySelector(this.SELECTORS.TRACK_LABEL_INPUT).value = properties.label;
            track.querySelector(this.SELECTORS.TRACK_DEFAULT_SELECT).checked = properties.defaultTrack;
        };

        const tabPane = this.form.querySelector('.root.tab-content > .tab-pane#' + this.editor.getElement().id +
            '_' + properties.type.toLowerCase());

        // Populate sources.
        tabPane.querySelector(this.SELECTORS.MEDIA_SOURCE + ' ' + this.SELECTORS.URL_INPUT).value = properties.sources[0];
        properties.sources.slice(1).forEach(source => {
            this.addMediaSourceComponent(tabPane.querySelector(this.SELECTORS.MEDIA_SOURCE + ' .addcomponent'), newComponent => {
                newComponent.querySelector(this.SELECTORS.URL_INPUT).value = source;
            });
        });

        // Populate tracks.
        for (const [key, value] of Object.entries(properties.tracks)) {
            const trackData = value.length ? value : [{src: '', srclang: '', label: '', defaultTrack: false}];
            const paneSelector = this.SELECTORS['TRACK_' + key.toUpperCase() + '_PANE'];

            applyTrackProperties(tabPane.querySelector(paneSelector + ' ' + this.SELECTORS.TRACK), trackData[0]);
            trackData.slice(1).forEach(track => {
                this.addTrackComponent(
                    tabPane.querySelector(paneSelector + ' ' + this.SELECTORS.TRACK + ' .addcomponent'), newComponent => {
                        applyTrackProperties(newComponent, track);
                    });
            });
        }

        // Populate values.
        tabPane.querySelector(this.SELECTORS.TITLE_INPUT).value = properties.title;
        tabPane.querySelector(this.SELECTORS.MEDIA_CONTROLS_TOGGLE).checked = properties.controls;
        tabPane.querySelector(this.SELECTORS.MEDIA_AUTOPLAY_TOGGLE).checked = properties.autoplay;
        tabPane.querySelector(this.SELECTORS.MEDIA_MUTE_TOGGLE).checked = properties.muted;
        tabPane.querySelector(this.SELECTORS.MEDIA_LOOP_TOGGLE).checked = properties.loop;

        // Determine medium type.
        const mediumType = this.getMediumTypeFromTabPane(tabPane);

        if (mediumType === 'video') {
            // Populate values unique for video.
            tabPane.querySelector(this.SELECTORS.POSTER_SOURCE + ' ' + this.SELECTORS.URL_INPUT).value = properties.poster;
            tabPane.querySelector(this.SELECTORS.WIDTH_INPUT).value = properties.width;
            tabPane.querySelector(this.SELECTORS.HEIGHT_INPUT).value = properties.height;
        }

        // Switch to the correct tab.
        // Remove active class from all tabs + tab panes.
        tabPane.parentElement.querySelector('.active').classList.remove('active');
        this.form.querySelectorAll('.root.nav-tabs .nav-item a').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to the desired tab and tab pane.
        tabPane.classList.add('active');
        this.form.querySelector(this.SELECTORS[mediumType.toUpperCase() + '_TAB'] + ' a').classList.add('active');
    }

    prepareMoodleLang() {
        const moodleLangs = getMoodleLang(this.editor);
        const currentlang = moodleLangs.currentlang;
        const langsinstalled = moodleLangs.installed;
        const langsavailable = moodleLangs.available;

        let result = {};
        let installed = [];
        let available = [];

        for (const [key, value] of Object.entries(langsinstalled)) {
            installed.push({
                lang: value,
                code: key,
                default: key === currentlang,
            });
        }

        for (const [key, value] of Object.entries(langsavailable)) {
            available.push({
                lang: value,
                code: key,
                default: key === currentlang,
            });
        }

        result.installed = installed;
        result.available = available;

        return result;
    }

    getMoodleLangObj(subtitleLang) {
        const moodleLangs = getMoodleLang(this.editor);
        const langsavailable = moodleLangs.available;

        let result = false;
        for (const [key, value] of Object.entries(langsavailable)) {
            if (key === subtitleLang) {
                result = {
                    lang: value,
                    code: key,
                };
            }
        }

        return result;
    }

    filePickerCallback(params, element, fpType, self) {
        if (params.url !== '') {
            const tabPane = element.closest('.tab-pane');
            element.closest(self.SELECTORS.SOURCE).querySelector(self.SELECTORS.URL_INPUT).value = params.url;

            if (tabPane.id === self.editor.getElement().id + '_' + self.CSS.LINK) {
                tabPane.querySelector(self.SELECTORS.NAME_INPUT).value = params.file;
            }

            if (fpType === 'subtitle') {
                const subtitleLang = params.file.split('.vtt')[0].split('-').slice(-1)[0];
                const langObj = this.getMoodleLangObj(subtitleLang);
                if (langObj) {
                    element.closest(self.SELECTORS.TRACK).querySelector(self.SELECTORS.TRACK_LABEL_INPUT).value =
                        langObj.lang.trim();
                    element.closest(self.SELECTORS.TRACK).querySelector(self.SELECTORS.TRACK_LANG_INPUT).value = langObj.code;
                }
            }
        }
    }

    addMediaSourceComponent(element, callback) {
        const sourceElement = element.closest(this.SELECTORS.SOURCE + this.SELECTORS.MEDIA_SOURCE);
        const clone = sourceElement.cloneNode(true);

        sourceElement.querySelector('.removecomponent-wrapper').classList.remove('hidden');
        sourceElement.querySelector('.addcomponent-wrapper').classList.add('hidden');

        sourceElement.parentNode.insertBefore(clone, sourceElement.nextSibling);

        if (callback) {
            callback(clone);
        }
    }

    removeMediaSourceComponent(element) {
        const sourceElement = element.closest(this.SELECTORS.SOURCE + this.SELECTORS.MEDIA_SOURCE);
        sourceElement.remove();
    }

    addTrackComponent(element, callback) {
        const trackElement = element.closest(this.SELECTORS.TRACK);
        const clone = trackElement.cloneNode(true);

        trackElement.querySelector('.removecomponent-wrapper').classList.remove('hidden');
        trackElement.querySelector('.addcomponent-wrapper').classList.add('hidden');

        trackElement.parentNode.insertBefore(clone, trackElement.nextSibling);

        if (callback) {
            callback(clone);
        }
    }

    removeTrackComponent(element) {
        const sourceElement = element.closest(this.SELECTORS.TRACK);
        sourceElement.remove();
    }

    getMediumTypeFromTabPane(tabPane) {
        return tabPane.getAttribute('data-medium-type');
    }

    getTrackTypeFromTabPane(tabPane) {
        return tabPane.getAttribute('data-track-kind');
    }

    getMediaHTML() {
        const mediumType = this.getMediumTypeFromTabPane(this.form.querySelector('.root.tab-content > .tab-pane.active'));
        const tabContent = this.form.querySelector(this.SELECTORS[mediumType.toUpperCase() + '_PANE']);

        return this['getMediaHTML' + mediumType[0].toUpperCase() + mediumType.substr(1)](tabContent);
    }

    getMediaHTMLLink(tab) {
        const context = {
            url: tab.querySelector(this.SELECTORS.URL_INPUT).value,
            name: tab.querySelector(this.SELECTORS.NAME_INPUT).value || false
        };

        return context.url ? Templates.render('tiny_media/embed_media_link', context) : '';
    }

    getMediaHTMLVideo(tab) {
        let context = this.getContextForMediaHTML(tab);
        context.width = tab.querySelector(this.SELECTORS.WIDTH_INPUT).value || false;
        context.height = tab.querySelector(this.SELECTORS.HEIGHT_INPUT).value || false;
        context.poster = tab.querySelector(this.SELECTORS.POSTER_SOURCE + ' ' + this.SELECTORS.URL_INPUT).value || false;

        return context.sources.length ? Templates.render('tiny_media/embed_media_video', context) : '';
    }

    getMediaHTMLAudio(tab) {
        let context = this.getContextForMediaHTML(tab);

        return context.sources.length ? Templates.render('tiny_media/embed_media_audio', context) : '';
    }

    getContextForMediaHTML(tab) {
        let tracks = [];

        tab.querySelectorAll(this.SELECTORS.TRACK).forEach(track => {
            tracks.push({
                track: track.querySelector(this.SELECTORS.TRACK_SOURCE + ' ' + this.SELECTORS.URL_INPUT).value,
                kind: this.getTrackTypeFromTabPane(track.closest('.tab-pane')),
                label: track.querySelector(this.SELECTORS.TRACK_LABEL_INPUT).value ||
                    track.querySelector(this.SELECTORS.TRACK_LANG_INPUT).value,
                srclang: track.querySelector(this.SELECTORS.TRACK_LANG_INPUT).value,
                defaultTrack: track.querySelector(this.SELECTORS.TRACK_DEFAULT_SELECT).checked ? "true" : null
            });
        });

        let sources = [];
        tab.querySelectorAll(this.SELECTORS.MEDIA_SOURCE + ' ' + this.SELECTORS.URL_INPUT).forEach(source => {
            if (source.value) {
                sources.push(source.value);
            }
        });

        return {
            sources: sources,
            description: tab.querySelector(this.SELECTORS.MEDIA_SOURCE + ' ' + this.SELECTORS.URL_INPUT).value || false,
            tracks: tracks.filter(track => {
                return !!track.track;
            }),
            showControls: tab.querySelector(this.SELECTORS.MEDIA_CONTROLS_TOGGLE).checked,
            autoplay: tab.querySelector(this.SELECTORS.MEDIA_AUTOPLAY_TOGGLE).checked,
            muted: tab.querySelector(this.SELECTORS.MEDIA_MUTE_TOGGLE).checked,
            loop: tab.querySelector(this.SELECTORS.MEDIA_LOOP_TOGGLE).checked,
            title: tab.querySelector(this.SELECTORS.TITLE_INPUT).value || false
        };
    }

    registerEventListeners() {
        if (this.eventInitialized) {
            return;
        }
        const self = this;
        this.eventInitialized = true;
        if (this.canShowFilePicker) {
            document.addEventListener('click', e => {
                const element = e.target;
                const mediaBrowser = element.closest(this.SELECTORS.MEDIA_BROWSER);
                if (mediaBrowser) {
                    e.preventDefault();
                    let fpType = 'media';
                    if (element.closest(this.SELECTORS.POSTER_SOURCE)) {
                        fpType = 'image';
                    }
                    if (element.closest(this.SELECTORS.TRACK_SOURCE)) {
                        fpType = 'subtitle';
                    }
                    displayFilepicker(this.editor, fpType).then((params) => {
                        this.filePickerCallback(params, element, fpType, self);
                    }).catch();
                }

                const addComponentSourceAction = element.closest(this.SELECTORS.MEDIA_SOURCE + ' .addcomponent');
                if (addComponentSourceAction) {
                    e.preventDefault();
                    this.addMediaSourceComponent(element);
                }

                const removeComponentSourceAction = element.closest(this.SELECTORS.MEDIA_SOURCE + ' .removecomponent');
                if (removeComponentSourceAction) {
                    e.preventDefault();
                    this.removeMediaSourceComponent(element);
                }

                const addComponentTrackAction = element.closest(this.SELECTORS.TRACK + ' .addcomponent');
                if (addComponentTrackAction) {
                    e.preventDefault();
                    this.addTrackComponent(element);
                }

                const removeComponentTrackAction = element.closest(this.SELECTORS.TRACK + ' .removecomponent');
                if (removeComponentTrackAction) {
                    e.preventDefault();
                    this.removeTrackComponent(element);
                }

                // Only allow one track per tab to be selected as "default".
                const trackDefaultAction = element.closest(this.SELECTORS.TRACK_DEFAULT_SELECT);
                if (trackDefaultAction && trackDefaultAction.checked) {
                    const getKind = el => {
                        return this.getTrackTypeFromTabPane(el.parentElement.closest('.tab-pane'));
                    };

                    element.parentElement
                        .closest('.root.tab-content')
                        .querySelectorAll(this.SELECTORS.TRACK_DEFAULT_SELECT)
                        .forEach(select => {
                            if (select !== element && getKind(element) === getKind(select)) {
                                select.checked = false;
                            }
                        });
                }

                const submitAction = element.closest(this.SELECTORS.INPUTSUBMIT);
                if (submitAction) {
                    e.preventDefault();
                    const mediaHTML = this.getMediaHTML();
                    if (mediaHTML) {
                        mediaHTML.then(html => {
                            this.editor.insertContent(html);
                            this.currentModal.destroy();
                        });
                    }
                }
            });
        }
    }
};
