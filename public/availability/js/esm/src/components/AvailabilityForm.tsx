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
 * Top-level availability form component.
 *
 * Reads the availability JSON from the hidden textarea, renders the tree
 * of conditions, and writes the updated JSON back on every change.
 *
 * @module     core_availability/components/AvailabilityForm
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useEffect, useRef} from 'react';
import type {AvailabilityTree, PluginRegistration} from '../types';
import {serialiseTree} from '../tree';
import {AvailabilityProvider, useAvailability} from './AvailabilityContext';
import {ConditionList} from './ConditionList';

interface AvailabilityFormInnerProps {
    /** The hidden textarea element to sync JSON to. */
    textareaEl: HTMLTextAreaElement;
}

/**
 * Inner form component that lives inside the AvailabilityProvider
 * and syncs tree state to the textarea.
 */
function AvailabilityFormInner({textareaEl}: AvailabilityFormInnerProps) {
    const {tree} = useAvailability();

    // Sync tree state to the textarea whenever it changes.
    useEffect(() => {
        const json = serialiseTree(tree);
        textareaEl.value = json;

        // Dispatch a change event so Moodle's form change detection notices.
        textareaEl.dispatchEvent(new Event('change', {bubbles: true}));
    }, [tree, textareaEl]);

    return (
        <div className="availability-field">
            <ConditionList tree={tree} path={[]} isRoot />
        </div>
    );
}

// --- Public component ---

interface AvailabilityFormProps {
    /** Loaded plugin registry. */
    plugins: Map<string, PluginRegistration>;
    /** The initial tree state (parsed from textarea). */
    initialTree: AvailabilityTree;
    /** The hidden textarea element. */
    textareaEl: HTMLTextAreaElement;
    /** Course ID. */
    courseId: number;
    /** Course module ID (null for section-level restrictions). */
    cmId: number | null;
    /** Section ID (null for module-level restrictions). */
    sectionId: number | null;
}

export function AvailabilityForm({
    plugins,
    initialTree,
    textareaEl,
    courseId,
    cmId,
    sectionId,
}: AvailabilityFormProps) {
    // Hide the original textarea.
    const hiddenRef = useRef(false);
    useEffect(() => {
        if (!hiddenRef.current) {
            textareaEl.setAttribute('aria-hidden', 'true');
            textareaEl.style.display = 'none';
            hiddenRef.current = true;
        }
    }, [textareaEl]);

    return (
        <AvailabilityProvider
            plugins={plugins}
            initialTree={initialTree}
            courseId={courseId}
            cmId={cmId}
            sectionId={sectionId}
        >
            <AvailabilityFormInner textareaEl={textareaEl} />
        </AvailabilityProvider>
    );
}
