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
import {
    get_string as getString,
    get_strings as getStrings,
} from 'core/str';
import * as ModalFactory from 'core/modal_factory';
import * as ModalEvents from 'core/modal_events';
import {displayFilepicker} from 'editor_tiny/utils';
import {getMoodleLang} from 'editor_tiny/options';
import {component} from "./common";
import Modal from './embedmodal';


const MEDIA_TYPES = {
    LINK: 'LINK',
    VIDEO: 'VIDEO',
    AUDIO: 'AUDIO',
};

const TRACK_KINDS = {
    SUBTITLES: 'SUBTITLES',
    CAPTIONS: 'CAPTIONS',
    DESCRIPTIONS: 'DESCRIPTIONS',
    CHAPTERS: 'CHAPTERS',
    METADATA: 'METADATA',
};

// TODO Move all of these into the tempaltes themselves.
// We should use class names within templates rather than passing variables because styles are
// the property of the theme owner.
// We should use data attributes as selectors because they are the property of of the JS.
const CSS = {
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
    LINK: MEDIA_TYPES.LINK.toLowerCase(),
    VIDEO: MEDIA_TYPES.VIDEO.toLowerCase(),
    AUDIO: MEDIA_TYPES.AUDIO.toLowerCase(),
    TRACK_SUBTITLES: TRACK_KINDS.SUBTITLES.toLowerCase(),
    TRACK_CAPTIONS: TRACK_KINDS.CAPTIONS.toLowerCase(),
    TRACK_DESCRIPTIONS: TRACK_KINDS.DESCRIPTIONS.toLowerCase(),
    TRACK_CHAPTERS: TRACK_KINDS.CHAPTERS.toLowerCase(),
    TRACK_METADATA: TRACK_KINDS.METADATA.toLowerCase(),
};

const SELECTORS = {
    SOURCE: `.${CSS.SOURCE}`,
    TRACK: `.${CSS.TRACK}`,
    MEDIA_SOURCE: `.${CSS.MEDIA_SOURCE}`,
    MEDIA_BROWSER: `.${CSS.MEDIA_BROWSER}`,
    POSTER_SOURCE: `.${CSS.POSTER_SOURCE}`,
    TRACK_SOURCE: `.${CSS.TRACK_SOURCE}`,
    DISPLAY_OPTIONS: `.${CSS.DISPLAY_OPTIONS}`,
    NAME_INPUT: `.${CSS.NAME_INPUT}`,
    TITLE_INPUT: `.${CSS.TITLE_INPUT}`,
    URL_INPUT: `.${CSS.URL_INPUT}`,
    POSTER_SIZE: `.${CSS.POSTER_SIZE}`,
    LINK_SIZE: `.${CSS.LINK_SIZE}`,
    WIDTH_INPUT: `.${CSS.WIDTH_INPUT}`,
    HEIGHT_INPUT: `.${CSS.HEIGHT_INPUT}`,
    TRACK_KIND_INPUT: `.${CSS.TRACK_KIND_INPUT}`,
    TRACK_LABEL_INPUT: `.${CSS.TRACK_LABEL_INPUT}`,
    TRACK_LANG_INPUT: `.${CSS.TRACK_LANG_INPUT}`,
    TRACK_DEFAULT_SELECT: `.${CSS.TRACK_DEFAULT_SELECT}`,
    MEDIA_CONTROLS_TOGGLE: `.${CSS.MEDIA_CONTROLS_TOGGLE}`,
    MEDIA_AUTOPLAY_TOGGLE: `.${CSS.MEDIA_AUTOPLAY_TOGGLE}`,
    MEDIA_MUTE_TOGGLE: `.${CSS.MEDIA_MUTE_TOGGLE}`,
    MEDIA_LOOP_TOGGLE: `.${CSS.MEDIA_LOOP_TOGGLE}`,
    ADVANCED_SETTINGS: `.${CSS.ADVANCED_SETTINGS}`,
    INPUTSUBMIT: `.${CSS.INPUTSUBMIT}`,
    LINK_TAB: `li[data-medium-type="${CSS.LINK}"]`,
    LINK_PANE: `.tab-pane[data-medium-type="${CSS.LINK}"]`,
    VIDEO_TAB: `li[data-medium-type="${CSS.VIDEO}"]`,
    VIDEO_PANE: `.tab-pane[data-medium-type="${CSS.VIDEO}"]`,
    AUDIO_TAB: `li[data-medium-type="${CSS.AUDIO}"]`,
    AUDIO_PANE: `.tab-pane[data-medium-type="${CSS.AUDIO}"]`,
    TRACK_SUBTITLES_TAB: `li[data-track-kind="${CSS.TRACK_SUBTITLES}"]`,
    TRACK_SUBTITLES_PANE: `.tab-pane[data-track-kind="${CSS.TRACK_SUBTITLES}"]`,
    TRACK_CAPTIONS_TAB: `li[data-track-kind="${CSS.TRACK_CAPTIONS}"]`,
    TRACK_CAPTIONS_PANE: `.tab-pane[data-track-kind="${CSS.TRACK_CAPTIONS}"]`,
    TRACK_DESCRIPTIONS_TAB: `li[data-track-kind="${CSS.TRACK_DESCRIPTIONS}"]`,
    TRACK_DESCRIPTIONS_PANE: `.tab-pane[data-track-kind="${CSS.TRACK_DESCRIPTIONS}"]`,
    TRACK_CHAPTERS_TAB: `li[data-track-kind="${CSS.TRACK_CHAPTERS}"]`,
    TRACK_CHAPTERS_PANE: `.tab-pane[data-track-kind="${CSS.TRACK_CHAPTERS}"]`,
    TRACK_METADATA_TAB: `li[data-track-kind="${CSS.TRACK_METADATA}"]`,
    TRACK_METADATA_PANE: `.tab-pane[data-track-kind="${CSS.TRACK_METADATA}"]`,
};

export const MediaEmbed = class {
    editor = null;
    canShowFilePicker = true;

    constructor(editor) {
        this.editor = editor;
    }

    async getTemplateContext() {
        const [
            addSourceHelpString,
            tracksHelpString,
            subtitlesHelpString,
            captionsHelpString,
            descriptionsHelpString,
            chaptersHelpString,
            metadataHelpString,
        ] = await getStrings([
            'addsource_help',
            'tracks_help',
            'subtitles_help',
            'captions_help',
            'descriptions_help',
            'chapters_help',
            'metadata_help',
        ].map((key) => ({
            key,
            component,
        })));

        const languages = this.prepareMoodleLang();
        return {
            elementid: this.editor.getElement().id,
            CSS: CSS,
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
        };
    }

    async displayDialogue() {
        const modal = await ModalFactory.create({
            type: Modal.TYPE,
            title: getString('createmedia', 'tiny_media'),
            templateContext: await this.getTemplateContext(),
            removeOnClose: true,
            large: true,
        });

        this.applyMediumProperties(modal);
        this.registerEventListeners(modal);
        modal.show();
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
            type: medium.nodeName.toLowerCase() === 'video' ? MEDIA_TYPES.VIDEO : MEDIA_TYPES.AUDIO,
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

    async applyMediumProperties(modal) {
        // Ideally we should do this by passing in the values as the template context.
        // We should modify the template to make use of these values.
        await modal.getBody();
        const root = modal.getRoot()[0];
        const properties = this.getMediumProperties();
        if (!properties) {
            return;
        }

        const applyTrackProperties = (track, properties) => {
            track.querySelector(SELECTORS.TRACK_SOURCE + ' ' + SELECTORS.URL_INPUT).value = properties.src;
            track.querySelector(SELECTORS.TRACK_LANG_INPUT).value = properties.srclang;
            track.querySelector(SELECTORS.TRACK_LABEL_INPUT).value = properties.label;
            track.querySelector(SELECTORS.TRACK_DEFAULT_SELECT).checked = properties.defaultTrack;
        };

        const paneId = `${this.editor.getElement().id}_${properties.type.toLowerCase()}`;
        const tabPane = root.querySelector(`.root.tab-content > .tab-pane#${paneId}`);

        // Populate sources.
        tabPane.querySelector(SELECTORS.MEDIA_SOURCE + ' ' + SELECTORS.URL_INPUT).value = properties.sources[0];
        properties.sources.slice(1).forEach(source => {
            this.addMediaSourceComponent(tabPane.querySelector(SELECTORS.MEDIA_SOURCE + ' .addcomponent'), newComponent => {
                newComponent.querySelector(SELECTORS.URL_INPUT).value = source;
            });
        });

        // Populate tracks.
        for (const [key, value] of Object.entries(properties.tracks)) {
            const trackData = value.length ? value : [{src: '', srclang: '', label: '', defaultTrack: false}];
            const paneSelector = SELECTORS['TRACK_' + key.toUpperCase() + '_PANE'];

            applyTrackProperties(tabPane.querySelector(paneSelector + ' ' + SELECTORS.TRACK), trackData[0]);
            trackData.slice(1).forEach(track => {
                this.addTrackComponent(
                    tabPane.querySelector(paneSelector + ' ' + SELECTORS.TRACK + ' .addcomponent'), newComponent => {
                        applyTrackProperties(newComponent, track);
                    });
            });
        }

        // Populate values.
        tabPane.querySelector(SELECTORS.TITLE_INPUT).value = properties.title;
        tabPane.querySelector(SELECTORS.MEDIA_CONTROLS_TOGGLE).checked = properties.controls;
        tabPane.querySelector(SELECTORS.MEDIA_AUTOPLAY_TOGGLE).checked = properties.autoplay;
        tabPane.querySelector(SELECTORS.MEDIA_MUTE_TOGGLE).checked = properties.muted;
        tabPane.querySelector(SELECTORS.MEDIA_LOOP_TOGGLE).checked = properties.loop;

        // Determine medium type.
        const mediumType = this.getMediumTypeFromTabPane(tabPane);

        if (mediumType === 'video') {
            // Populate values unique for video.
            tabPane.querySelector(SELECTORS.POSTER_SOURCE + ' ' + SELECTORS.URL_INPUT).value = properties.poster;
            tabPane.querySelector(SELECTORS.WIDTH_INPUT).value = properties.width;
            tabPane.querySelector(SELECTORS.HEIGHT_INPUT).value = properties.height;
        }

        // Switch to the correct tab.
        // Remove active class from all tabs + tab panes.
        tabPane.parentElement.querySelector('.active').classList.remove('active');
        root.querySelectorAll('.root.nav-tabs .nav-item a').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to the desired tab and tab pane.
        tabPane.classList.add('active');
        root.querySelector(SELECTORS[mediumType.toUpperCase() + '_TAB'] + ' a').classList.add('active');
    }

    prepareMoodleLang() {
        const moodleLangs = getMoodleLang(this.editor);
        const currentLang = moodleLangs.currentlang;

        const installed = Object.entries(moodleLangs.installed).map(([lang, code]) => ({
            lang,
            code,
            "default": lang === currentLang,
        }));

        const available = Object.entries(moodleLangs.available).map(([lang, code]) => ({
            lang,
            code,
            "default": lang === currentLang,
        }));

        return {
            installed,
            available,
        };
    }

    getMoodleLangObj(subtitleLang) {
        const {available} = getMoodleLang(this.editor);

        if (available[subtitleLang]) {
            return {
                lang: subtitleLang,
                code: available[subtitleLang],
            };
        }

        return null;
    }

    filePickerCallback(params, element, fpType) {
        if (params.url !== '') {
            const tabPane = element.closest('.tab-pane');
            element.closest(SELECTORS.SOURCE).querySelector(SELECTORS.URL_INPUT).value = params.url;

            if (tabPane.id === this.editor.getElement().id + '_' + CSS.LINK) {
                tabPane.querySelector(SELECTORS.NAME_INPUT).value = params.file;
            }

            if (fpType === 'subtitle') {
                // TODO wtf does this do!? lol
                const subtitleLang = params.file.split('.vtt')[0].split('-').slice(-1)[0];
                const langObj = this.getMoodleLangObj(subtitleLang);
                if (langObj) {
                    const track = element.closest(SELECTORS.TRACK);
                    track.querySelector(SELECTORS.TRACK_LABEL_INPUT).value = langObj.lang.trim();
                    track.querySelector(SELECTORS.TRACK_LANG_INPUT).value = langObj.code;
                }
            }
        }
    }

    addMediaSourceComponent(element, callback) {
        const sourceElement = element.closest(SELECTORS.SOURCE + SELECTORS.MEDIA_SOURCE);
        const clone = sourceElement.cloneNode(true);

        sourceElement.querySelector('.removecomponent-wrapper').classList.remove('hidden');
        sourceElement.querySelector('.addcomponent-wrapper').classList.add('hidden');

        sourceElement.parentNode.insertBefore(clone, sourceElement.nextSibling);

        if (callback) {
            callback(clone);
        }
    }

    removeMediaSourceComponent(element) {
        const sourceElement = element.closest(SELECTORS.SOURCE + SELECTORS.MEDIA_SOURCE);
        sourceElement.remove();
    }

    addTrackComponent(element, callback) {
        const trackElement = element.closest(SELECTORS.TRACK);
        const clone = trackElement.cloneNode(true);

        trackElement.querySelector('.removecomponent-wrapper').classList.remove('hidden');
        trackElement.querySelector('.addcomponent-wrapper').classList.add('hidden');

        trackElement.parentNode.insertBefore(clone, trackElement.nextSibling);

        if (callback) {
            callback(clone);
        }
    }

    removeTrackComponent(element) {
        const sourceElement = element.closest(SELECTORS.TRACK);
        sourceElement.remove();
    }

    getMediumTypeFromTabPane(tabPane) {
        return tabPane.getAttribute('data-medium-type');
    }

    getTrackTypeFromTabPane(tabPane) {
        return tabPane.getAttribute('data-track-kind');
    }

    getMediaHTML(form) {
        const mediumType = this.getMediumTypeFromTabPane(form.querySelector('.root.tab-content > .tab-pane.active'));
        const tabContent = form.querySelector(SELECTORS[mediumType.toUpperCase() + '_PANE']);

        return this['getMediaHTML' + mediumType[0].toUpperCase() + mediumType.substr(1)](tabContent);
    }

    getMediaHTMLLink(tab) {
        const context = {
            url: tab.querySelector(SELECTORS.URL_INPUT).value,
            name: tab.querySelector(SELECTORS.NAME_INPUT).value || false
        };

        return context.url ? Templates.renderForPromise('tiny_media/embed_media_link', context) : '';
    }

    getMediaHTMLVideo(tab) {
        const context = this.getContextForMediaHTML(tab);
        context.width = tab.querySelector(SELECTORS.WIDTH_INPUT).value || false;
        context.height = tab.querySelector(SELECTORS.HEIGHT_INPUT).value || false;
        context.poster = tab.querySelector(SELECTORS.POSTER_SOURCE + ' ' + SELECTORS.URL_INPUT).value || false;

        return context.sources.length ? Templates.renderForPromise('tiny_media/embed_media_video', context) : '';
    }

    getMediaHTMLAudio(tab) {
        let context = this.getContextForMediaHTML(tab);

        return context.sources.length ? Templates.renderForPromise('tiny_media/embed_media_audio', context) : '';
    }

    getContextForMediaHTML(tab) {
        const tracks = Array.from(tab.querySelectorAll(SELECTORS.TRACK)).map(track => ({
                track: track.querySelector(SELECTORS.TRACK_SOURCE + ' ' + SELECTORS.URL_INPUT).value,
                kind: this.getTrackTypeFromTabPane(track.closest('.tab-pane')),
                label: track.querySelector(SELECTORS.TRACK_LABEL_INPUT).value ||
                    track.querySelector(SELECTORS.TRACK_LANG_INPUT).value,
                srclang: track.querySelector(SELECTORS.TRACK_LANG_INPUT).value,
                defaultTrack: track.querySelector(SELECTORS.TRACK_DEFAULT_SELECT).checked ? "true" : null
        })).filter((track) => !!track.track);

        const sources = Array.from(tab.querySelectorAll(SELECTORS.MEDIA_SOURCE + ' ' + SELECTORS.URL_INPUT))
            .filter((source) => !!source.value)
            .map((source) => source.value);

        return {
            sources,
            description: tab.querySelector(SELECTORS.MEDIA_SOURCE + ' ' + SELECTORS.URL_INPUT).value || false,
            tracks,
            showControls: tab.querySelector(SELECTORS.MEDIA_CONTROLS_TOGGLE).checked,
            autoplay: tab.querySelector(SELECTORS.MEDIA_AUTOPLAY_TOGGLE).checked,
            muted: tab.querySelector(SELECTORS.MEDIA_MUTE_TOGGLE).checked,
            loop: tab.querySelector(SELECTORS.MEDIA_LOOP_TOGGLE).checked,
            title: tab.querySelector(SELECTORS.TITLE_INPUT).value || false
        };
    }

    getFilepickerTypeFromElement(element) {
        if (element.closest(SELECTORS.POSTER_SOURCE)) {
            return 'image';
        }
        if (element.closest(SELECTORS.TRACK_SOURCE)) {
            return 'subtitle';
        }

        return 'media';
    }

    async clickHandler(e) {
        const element = e.target;

        const mediaBrowser = element.closest(SELECTORS.MEDIA_BROWSER);
        if (mediaBrowser) {
            e.preventDefault();
            const fpType = this.getFilepickerTypeFromElement(element);
            const params = await displayFilepicker(this.editor, fpType);
            this.filePickerCallback(params, element, fpType);
        }

        const addComponentSourceAction = element.closest(SELECTORS.MEDIA_SOURCE + ' .addcomponent');
        if (addComponentSourceAction) {
            e.preventDefault();
            this.addMediaSourceComponent(element);
        }

        const removeComponentSourceAction = element.closest(SELECTORS.MEDIA_SOURCE + ' .removecomponent');
        if (removeComponentSourceAction) {
            e.preventDefault();
            this.removeMediaSourceComponent(element);
        }

        const addComponentTrackAction = element.closest(SELECTORS.TRACK + ' .addcomponent');
        if (addComponentTrackAction) {
            e.preventDefault();
            this.addTrackComponent(element);
        }

        const removeComponentTrackAction = element.closest(SELECTORS.TRACK + ' .removecomponent');
        if (removeComponentTrackAction) {
            e.preventDefault();
            this.removeTrackComponent(element);
        }

        // Only allow one track per tab to be selected as "default".
        const trackDefaultAction = element.closest(SELECTORS.TRACK_DEFAULT_SELECT);
        if (trackDefaultAction && trackDefaultAction.checked) {
            const getKind = el => {
                return this.getTrackTypeFromTabPane(el.parentElement.closest('.tab-pane'));
            };

            element.parentElement
                .closest('.root.tab-content')
                .querySelectorAll(SELECTORS.TRACK_DEFAULT_SELECT)
                .forEach(select => {
                    if (select !== element && getKind(element) === getKind(select)) {
                        select.checked = false;
                    }
                });
        }
    }

    async handleDialogueSubmission(event, modal) {
        const {html} = await this.getMediaHTML(modal.getRoot()[0]);
        if (html) {
            this.editor.insertContent(html);
        }
    }

    registerEventListeners(modal) {
        const $root = modal.getRoot();
        const root = $root[0];
        if (this.canShowFilePicker) {
            root.addEventListener('click', this.clickHandler.bind(this));
        }

        $root.on(ModalEvents.save, this.handleDialogueSubmission.bind(this));
    }
};
