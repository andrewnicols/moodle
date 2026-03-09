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
 * Auto-init shim for Mustache React helper components.
 *
 * Scans the DOM for elements with the `data-react-component` attribute and
 * mounts the matching React component into each one. A MutationObserver watches
 * for dynamically injected content (AJAX, fragments) so components are mounted
 * and unmounted automatically without any additional initialiser call.
 *
 * The expected DOM contract is:
 * ```html
 *   <div
 *     data-react-component="@mod_book/viewer"
 *     data-react-props='{"title":"My Book"}'
 *   ></div>
 * ```
 *
 * @module     core/react_autoinit
 * @copyright  Meirza <meirza.arson@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import React from "react";
import {createRoot} from "react-dom/client";

const SELECTOR = "[data-react-component]";
const MOUNTED_FLAG = "reactMounted";
const MOUNTING_FLAG = "reactMounting";
const reactUnmountMap: WeakMap<Element, () => void> = new WeakMap();

/**
 * DOM ready promise.
 *
 * @return {Promise<void>} Resolves when the DOM is ready.
 */
const domReady = () =>
    document.readyState === "loading"
        ? new Promise((resolve) =>
              document.addEventListener("DOMContentLoaded", resolve, {
                  once: true,
              })
          )
        : Promise.resolve();

/**
 * Safe JSON parsing from data-react-props.
 *
 * @param {Element} el The element with the data-react-props attribute.
 * @return {Record<string, any>} Parsed props object, or empty object on failure.
 */
const parseProps = (el: Element): Record<string, any> => {
    const raw = el.getAttribute("data-react-props");
    if (!raw) {
        return {};
    }
    try {
        return JSON.parse(raw);
    } catch (e) {
        window.console.error("[react_autoinit] invalid JSON", raw, e);
        return {};
    }
};

/**
 * Dynamically import a component module using ESM.
 *
 * Expects the specifier in `@moodle/lms/<component>/<path>` format, which is
 * resolved by the browser through the Moodle import map.
 * The module must have a default-exported React function component.
 *
 * @param {string} componentName The component specifier in `@moodle/lms/<component>/<path>` format.
 * @return {Promise<any>} The imported module, or null if resolution failed.
 */
const resolveComponent = async(componentName: string): Promise<any> => {
    if (!componentName) {
        return null;
    }

    if (!componentName.startsWith("@moodle/lms/")) {
        window.console.error(
            "[react_autoinit] Invalid component format, expected @moodle/lms/<component>/<path>:",
            componentName
        );
        return null;
    }

    try {
        const module = await import(componentName);
        return module;
    } catch (e) {
        window.console.error(`[react_autoinit] Failed to import: ${componentName}`, e);
        return null;
    }
};

/**
 * Mount an element with the `data-react-component` attribute.
 *
 * @param {Element} el The element to mount.
 */
const mountOne = async(el: Element) => {
    if ((el as HTMLElement).dataset[MOUNTED_FLAG]) {
        return;
    }

    if ((el as HTMLElement).dataset[MOUNTING_FLAG]) {
        return;
    }

    (el as HTMLElement).dataset[MOUNTING_FLAG] = "1";

    const componentName = el.getAttribute("data-react-component");
    if (!componentName) {
        delete (el as HTMLElement).dataset[MOUNTING_FLAG];
        return;
    }

    const mod = await resolveComponent(componentName);

    if (!mod) {
        window.console.warn("[react_autoinit] Component not found:", componentName);
        delete (el as HTMLElement).dataset[MOUNTING_FLAG];
        return;
    }

    const Component = mod.default;

    if (!Component) {
        window.console.warn("[react_autoinit] Module has no default export:", componentName);
        delete (el as HTMLElement).dataset[MOUNTING_FLAG];
        return;
    }

    try {
        const root = createRoot(el);
        root.render(React.createElement(Component, parseProps(el)));
        reactUnmountMap.set(el, () => root.unmount());
        (el as HTMLElement).dataset[MOUNTED_FLAG] = "1";
    } catch (e) {
        window.console.error("[react_autoinit] Mount failed:", componentName, e);
    } finally {
        delete (el as HTMLElement).dataset[MOUNTING_FLAG];
    }
};

/**
 * Unmount a single element.
 *
 * @param {Element} el The element to unmount.
 */
const unmountOne = (el: Element) => {
    const unmount = reactUnmountMap.get(el);
    if (unmount) {
        try {
            unmount();
        } catch (e) {
            window.console.error("[react_autoinit] Error unmounting:", e);
        }
        reactUnmountMap.delete(el);
    }
    delete (el as HTMLElement).dataset[MOUNTED_FLAG];
    delete (el as HTMLElement).dataset[MOUNTING_FLAG];
};

/**
 * Scan a root element and mount all matching React components within it.
 *
 * @param {Element|Document} root The root to scan.
 */
const scanAndMount = (root: Element | Document) => {
    for (const el of root.querySelectorAll(SELECTOR)) {
        mountOne(el);
    }
};

/**
 * Handle an added DOM node, mounting any React components within it.
 *
 * @param {Node} node The added node to handle.
 */
const handleAddedNode = (node: Node) => {
    if (!(node instanceof Element)) {
        return;
    }

    if (node.matches?.(SELECTOR)) {
        mountOne(node);
    }
    node.querySelectorAll?.(SELECTOR).forEach(mountOne);
};

/**
 * Handle a removed DOM node, unmounting any React components within it.
 *
 * @param {Node} node The removed node to handle.
 */
const handleRemovedNode = (node: Node) => {
    if (!(node instanceof Element)) {
        return;
    }

    if (node.matches?.(SELECTOR)) {
        unmountOne(node);
    }

    node.querySelectorAll?.(SELECTOR).forEach(unmountOne);
};

/**
 * Install a MutationObserver to handle dynamically added and removed nodes.
 *
 * @return {MutationObserver} The installed observer.
 */
const installObserver = () => {
    const obs = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes?.forEach(handleAddedNode);
            mutation.removedNodes?.forEach(handleRemovedNode);
        });
    });

    obs.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    return obs;
};

let observer: MutationObserver | null = null;

/**
 * Scan the document for React components and install the MutationObserver.
 */
const init = async() => {
    await domReady();
    if (!observer) {
        observer = installObserver();
    }
    scanAndMount(document);
};

init();
