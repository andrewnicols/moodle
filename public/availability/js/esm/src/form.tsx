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
 * Entry point for the availability conditions React form.
 *
 * This is the default export used by the `react_autoinit` system. PHP
 * renders a `<div data-react-component="@moodle/lms/core_availability/form">`
 * element with props containing the plugin descriptors and form metadata.
 *
 * @module     core_availability/form
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {type FC, useState, useEffect} from 'react';
import type {AvailabilityFormProps as EntryProps, PluginRegistration, AvailabilityTree} from './types';
import {loadPlugins} from './registry';
import {parseTree, createEmptyTree} from './tree';
import {AvailabilityForm} from './components/AvailabilityForm';

/**
 * Root component mounted by react_autoinit.
 *
 * Loads plugins, parses the initial JSON from the textarea, then renders
 * the full availability form tree.
 */
const AvailabilityFormEntry: FC<EntryProps> = ({plugins: pluginDescriptors, textareaId, courseId, cmId, sectionId}) => {
    const [plugins, setPlugins] = useState<Map<string, PluginRegistration> | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Load all plugins on mount.
    useEffect(() => {
        loadPlugins(pluginDescriptors).then((loaded) => {
            setPlugins(loaded);
            return undefined;
        }).catch((err) => {
            window.console.error('[core_availability/form] Failed to load plugins:', err);
            setError('Failed to load availability condition plugins.');
        });
    }, [pluginDescriptors]);

    // Find the textarea.
    const textareaEl = document.getElementById(textareaId) as HTMLTextAreaElement | null;
    if (!textareaEl) {
        return <div className="alert alert-danger">Availability textarea not found: #{textareaId}</div>;
    }

    // Parse initial tree from textarea value.
    const initialTree: AvailabilityTree = parseTree(textareaEl.value) ?? createEmptyTree();

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!plugins) {
        return <div className="availability-loading">Loading availability conditions...</div>;
    }

    return (
        <AvailabilityForm
            plugins={plugins}
            initialTree={initialTree}
            textareaEl={textareaEl}
            courseId={courseId}
            cmId={cmId ?? null}
            sectionId={sectionId ?? null}
        />
    );
};

AvailabilityFormEntry.displayName = 'AvailabilityFormEntry';
export default AvailabilityFormEntry;
