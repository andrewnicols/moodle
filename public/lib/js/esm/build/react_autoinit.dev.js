var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// public/lib/js/esm/src/react_autoinit.ts
import { isProfilerEnabled } from "@moodle/lms/core/profiler";
import { mountReactApp, unmountReactApp } from "@moodle/lms/core/mount";
var SELECTOR = "[data-react-component]";
var MOUNTED_FLAG = "reactMounted";
var MOUNTING_FLAG = "reactMounting";
var reactUnmountMap = /* @__PURE__ */ new WeakMap();
var profilingEnabled = isProfilerEnabled();
var domReady = /* @__PURE__ */ __name(() => document.readyState === "loading" ? new Promise(
  (resolve) => document.addEventListener("DOMContentLoaded", resolve, {
    once: true
  })
) : Promise.resolve(), "domReady");
var parseProps = /* @__PURE__ */ __name((el) => {
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
}, "parseProps");
var resolveComponent = /* @__PURE__ */ __name(async (componentName) => {
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
    if (profilingEnabled) {
      window.console.log(
        `[react_autoinit] Loading: ${componentName}`
      );
    }
    const module = await import(componentName);
    return module;
  } catch (e) {
    window.console.error(`[react_autoinit] Failed to import: ${componentName}`, e);
    return null;
  }
}, "resolveComponent");
var mountReactComponent = /* @__PURE__ */ __name((el, Component, props) => {
  const componentName = el.getAttribute("data-react-component") || "Unknown";
  const unmount = mountReactApp(el, Component, props, {
    id: componentName
  });
  reactUnmountMap.set(el, unmount);
}, "mountReactComponent");
var mountOne = /* @__PURE__ */ __name(async (el) => {
  if (el.dataset[MOUNTED_FLAG]) {
    return;
  }
  if (el.dataset[MOUNTING_FLAG]) {
    return;
  }
  el.dataset[MOUNTING_FLAG] = "1";
  const componentName = el.getAttribute("data-react-component");
  if (!componentName) {
    delete el.dataset[MOUNTING_FLAG];
    return;
  }
  const mod = await resolveComponent(componentName);
  if (!mod) {
    window.console.warn("[react_autoinit] Component not found:", componentName);
    delete el.dataset[MOUNTING_FLAG];
    return;
  }
  const Component = mod.default;
  if (!Component) {
    window.console.warn("[react_autoinit] Module has no default export:", componentName);
    delete el.dataset[MOUNTING_FLAG];
    return;
  }
  try {
    const props = parseProps(el);
    mountReactComponent(el, Component, props);
    el.dataset[MOUNTED_FLAG] = "1";
    if (profilingEnabled) {
      window.console.log(
        `[react_autoinit] Mounted via default: ${componentName}`
      );
    }
  } catch (e) {
    window.console.error("[react_autoinit] Mount failed:", componentName, e);
  } finally {
    delete el.dataset[MOUNTING_FLAG];
  }
}, "mountOne");
var unmountOne = /* @__PURE__ */ __name((el) => {
  const unmount = reactUnmountMap.get(el) ?? (() => unmountReactApp(el));
  if (unmount) {
    try {
      unmount();
      if (profilingEnabled) {
        const componentName = el.getAttribute("data-react-component");
        window.console.log(`[react_autoinit] Unmounted: ${componentName}`);
      }
    } catch (e) {
      window.console.error("[react_autoinit] Error unmounting:", e);
    }
    reactUnmountMap.delete(el);
  }
  delete el.dataset[MOUNTED_FLAG];
  delete el.dataset[MOUNTING_FLAG];
}, "unmountOne");
var scanAndMount = /* @__PURE__ */ __name((root) => {
  const elements = root.querySelectorAll(SELECTOR);
  if (profilingEnabled && elements.length > 0) {
    window.console.log(
      `[react_autoinit] Found ${elements.length} component(s) to mount`
    );
  }
  for (const el of elements) {
    mountOne(el);
  }
}, "scanAndMount");
var handleAddedNode = /* @__PURE__ */ __name((node) => {
  if (!(node instanceof Element)) {
    return;
  }
  if (node.matches?.(SELECTOR)) {
    if (profilingEnabled) {
      window.console.log("[react_autoinit] New component detected");
    }
    mountOne(node);
  }
  node.querySelectorAll?.(SELECTOR).forEach(mountOne);
}, "handleAddedNode");
var handleRemovedNode = /* @__PURE__ */ __name((node) => {
  if (!(node instanceof Element)) {
    return;
  }
  if (node.matches?.(SELECTOR)) {
    unmountOne(node);
  }
  node.querySelectorAll?.(SELECTOR).forEach(unmountOne);
}, "handleRemovedNode");
var installObserver = /* @__PURE__ */ __name(() => {
  const obs = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes?.forEach(handleAddedNode);
      mutation.removedNodes?.forEach(handleRemovedNode);
    });
  });
  obs.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  return obs;
}, "installObserver");
var observer = null;
var init = /* @__PURE__ */ __name(async () => {
  await domReady();
  if (profilingEnabled) {
    window.console.log("[react_autoinit] Initializing (profiling enabled)...");
  }
  if (!observer) {
    observer = installObserver();
    if (profilingEnabled) {
      window.console.log("[react_autoinit] MutationObserver active");
    }
  }
  scanAndMount(document);
}, "init");
init();
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
//# sourceMappingURL=react_autoinit.dev.js.map
