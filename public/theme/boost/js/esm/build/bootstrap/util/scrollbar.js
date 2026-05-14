var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// public/theme/boost/js/esm/src/bootstrap/dom/manipulator.js
var require_manipulator = __commonJS({
  "public/theme/boost/js/esm/src/bootstrap/dom/manipulator.js"(exports, module) {
    "use strict";
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Manipulator = factory());
    })(exports, (function() {
      "use strict";
      function normalizeData(value) {
        if (value === "true") {
          return true;
        }
        if (value === "false") {
          return false;
        }
        if (value === Number(value).toString()) {
          return Number(value);
        }
        if (value === "" || value === "null") {
          return null;
        }
        if (typeof value !== "string") {
          return value;
        }
        try {
          return JSON.parse(decodeURIComponent(value));
        } catch (_unused) {
          return value;
        }
      }
      __name(normalizeData, "normalizeData");
      function normalizeDataKey(key) {
        return key.replace(/[A-Z]/g, (chr) => `-${chr.toLowerCase()}`);
      }
      __name(normalizeDataKey, "normalizeDataKey");
      const Manipulator = {
        setDataAttribute(element, key, value) {
          element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
        },
        removeDataAttribute(element, key) {
          element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
        },
        getDataAttributes(element) {
          if (!element) {
            return {};
          }
          const attributes = {};
          const bsKeys = Object.keys(element.dataset).filter((key) => key.startsWith("bs") && !key.startsWith("bsConfig"));
          for (const key of bsKeys) {
            let pureKey = key.replace(/^bs/, "");
            pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1);
            attributes[pureKey] = normalizeData(element.dataset[key]);
          }
          return attributes;
        },
        getDataAttribute(element, key) {
          return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
        }
      };
      return Manipulator;
    }));
  }
});

// public/theme/boost/js/esm/src/bootstrap/util/index.js
var require_util = __commonJS({
  "public/theme/boost/js/esm/src/bootstrap/util/index.js"(exports, module) {
    "use strict";
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.Index = {}));
    })(exports, (function(exports2) {
      "use strict";
      const MAX_UID = 1e6;
      const MILLISECONDS_MULTIPLIER = 1e3;
      const TRANSITION_END = "transitionend";
      const parseSelector = /* @__PURE__ */ __name((selector) => {
        if (selector && window.CSS && window.CSS.escape) {
          selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
        }
        return selector;
      }, "parseSelector");
      const toType = /* @__PURE__ */ __name((object) => {
        if (object === null || object === void 0) {
          return `${object}`;
        }
        return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
      }, "toType");
      const getUID = /* @__PURE__ */ __name((prefix) => {
        do {
          prefix += Math.floor(Math.random() * MAX_UID);
        } while (document.getElementById(prefix));
        return prefix;
      }, "getUID");
      const getTransitionDurationFromElement = /* @__PURE__ */ __name((element) => {
        if (!element) {
          return 0;
        }
        let {
          transitionDuration,
          transitionDelay
        } = window.getComputedStyle(element);
        const floatTransitionDuration = Number.parseFloat(transitionDuration);
        const floatTransitionDelay = Number.parseFloat(transitionDelay);
        if (!floatTransitionDuration && !floatTransitionDelay) {
          return 0;
        }
        transitionDuration = transitionDuration.split(",")[0];
        transitionDelay = transitionDelay.split(",")[0];
        return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
      }, "getTransitionDurationFromElement");
      const triggerTransitionEnd = /* @__PURE__ */ __name((element) => {
        element.dispatchEvent(new Event(TRANSITION_END));
      }, "triggerTransitionEnd");
      const isElement = /* @__PURE__ */ __name((object) => {
        if (!object || typeof object !== "object") {
          return false;
        }
        if (typeof object.jquery !== "undefined") {
          object = object[0];
        }
        return typeof object.nodeType !== "undefined";
      }, "isElement");
      const getElement = /* @__PURE__ */ __name((object) => {
        if (isElement(object)) {
          return object.jquery ? object[0] : object;
        }
        if (typeof object === "string" && object.length > 0) {
          return document.querySelector(parseSelector(object));
        }
        return null;
      }, "getElement");
      const isVisible = /* @__PURE__ */ __name((element) => {
        if (!isElement(element) || element.getClientRects().length === 0) {
          return false;
        }
        const elementIsVisible = getComputedStyle(element).getPropertyValue("visibility") === "visible";
        const closedDetails = element.closest("details:not([open])");
        if (!closedDetails) {
          return elementIsVisible;
        }
        if (closedDetails !== element) {
          const summary = element.closest("summary");
          if (summary && summary.parentNode !== closedDetails) {
            return false;
          }
          if (summary === null) {
            return false;
          }
        }
        return elementIsVisible;
      }, "isVisible");
      const isDisabled = /* @__PURE__ */ __name((element) => {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
          return true;
        }
        if (element.classList.contains("disabled")) {
          return true;
        }
        if (typeof element.disabled !== "undefined") {
          return element.disabled;
        }
        return element.hasAttribute("disabled") && element.getAttribute("disabled") !== "false";
      }, "isDisabled");
      const findShadowRoot = /* @__PURE__ */ __name((element) => {
        if (!document.documentElement.attachShadow) {
          return null;
        }
        if (typeof element.getRootNode === "function") {
          const root = element.getRootNode();
          return root instanceof ShadowRoot ? root : null;
        }
        if (element instanceof ShadowRoot) {
          return element;
        }
        if (!element.parentNode) {
          return null;
        }
        return findShadowRoot(element.parentNode);
      }, "findShadowRoot");
      const noop = /* @__PURE__ */ __name(() => {
      }, "noop");
      const reflow = /* @__PURE__ */ __name((element) => {
        element.offsetHeight;
      }, "reflow");
      const getjQuery = /* @__PURE__ */ __name(() => {
        if (window.jQuery && !document.body.hasAttribute("data-bs-no-jquery")) {
          return window.jQuery;
        }
        return null;
      }, "getjQuery");
      const DOMContentLoadedCallbacks = [];
      const onDOMContentLoaded = /* @__PURE__ */ __name((callback) => {
        if (document.readyState === "loading") {
          if (!DOMContentLoadedCallbacks.length) {
            document.addEventListener("DOMContentLoaded", () => {
              for (const callback2 of DOMContentLoadedCallbacks) {
                callback2();
              }
            });
          }
          DOMContentLoadedCallbacks.push(callback);
        } else {
          callback();
        }
      }, "onDOMContentLoaded");
      const isRTL = /* @__PURE__ */ __name(() => document.documentElement.dir === "rtl", "isRTL");
      const defineJQueryPlugin = /* @__PURE__ */ __name((plugin) => {
        onDOMContentLoaded(() => {
          const $ = getjQuery();
          if ($) {
            const name = plugin.NAME;
            const JQUERY_NO_CONFLICT = $.fn[name];
            $.fn[name] = plugin.jQueryInterface;
            $.fn[name].Constructor = plugin;
            $.fn[name].noConflict = () => {
              $.fn[name] = JQUERY_NO_CONFLICT;
              return plugin.jQueryInterface;
            };
          }
        });
      }, "defineJQueryPlugin");
      const execute = /* @__PURE__ */ __name((possibleCallback, args = [], defaultValue = possibleCallback) => {
        return typeof possibleCallback === "function" ? possibleCallback.call(...args) : defaultValue;
      }, "execute");
      const executeAfterTransition = /* @__PURE__ */ __name((callback, transitionElement, waitForTransition = true) => {
        if (!waitForTransition) {
          execute(callback);
          return;
        }
        const durationPadding = 5;
        const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
        let called = false;
        const handler = /* @__PURE__ */ __name(({
          target
        }) => {
          if (target !== transitionElement) {
            return;
          }
          called = true;
          transitionElement.removeEventListener(TRANSITION_END, handler);
          execute(callback);
        }, "handler");
        transitionElement.addEventListener(TRANSITION_END, handler);
        setTimeout(() => {
          if (!called) {
            triggerTransitionEnd(transitionElement);
          }
        }, emulatedDuration);
      }, "executeAfterTransition");
      const getNextActiveElement = /* @__PURE__ */ __name((list, activeElement, shouldGetNext, isCycleAllowed) => {
        const listLength = list.length;
        let index = list.indexOf(activeElement);
        if (index === -1) {
          return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
        }
        index += shouldGetNext ? 1 : -1;
        if (isCycleAllowed) {
          index = (index + listLength) % listLength;
        }
        return list[Math.max(0, Math.min(index, listLength - 1))];
      }, "getNextActiveElement");
      exports2.defineJQueryPlugin = defineJQueryPlugin;
      exports2.execute = execute;
      exports2.executeAfterTransition = executeAfterTransition;
      exports2.findShadowRoot = findShadowRoot;
      exports2.getElement = getElement;
      exports2.getNextActiveElement = getNextActiveElement;
      exports2.getTransitionDurationFromElement = getTransitionDurationFromElement;
      exports2.getUID = getUID;
      exports2.getjQuery = getjQuery;
      exports2.isDisabled = isDisabled;
      exports2.isElement = isElement;
      exports2.isRTL = isRTL;
      exports2.isVisible = isVisible;
      exports2.noop = noop;
      exports2.onDOMContentLoaded = onDOMContentLoaded;
      exports2.parseSelector = parseSelector;
      exports2.reflow = reflow;
      exports2.toType = toType;
      exports2.triggerTransitionEnd = triggerTransitionEnd;
      Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    }));
  }
});

// public/theme/boost/js/esm/src/bootstrap/dom/selector-engine.js
var require_selector_engine = __commonJS({
  "public/theme/boost/js/esm/src/bootstrap/dom/selector-engine.js"(exports, module) {
    "use strict";
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_util()) : typeof define === "function" && define.amd ? define(["../util/index"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.SelectorEngine = factory(global.Index));
    })(exports, (function(index_js) {
      "use strict";
      const getSelector = /* @__PURE__ */ __name((element) => {
        let selector = element.getAttribute("data-bs-target");
        if (!selector || selector === "#") {
          let hrefAttribute = element.getAttribute("href");
          if (!hrefAttribute || !hrefAttribute.includes("#") && !hrefAttribute.startsWith(".")) {
            return null;
          }
          if (hrefAttribute.includes("#") && !hrefAttribute.startsWith("#")) {
            hrefAttribute = `#${hrefAttribute.split("#")[1]}`;
          }
          selector = hrefAttribute && hrefAttribute !== "#" ? hrefAttribute.trim() : null;
        }
        return selector ? selector.split(",").map((sel) => index_js.parseSelector(sel)).join(",") : null;
      }, "getSelector");
      const SelectorEngine = {
        find(selector, element = document.documentElement) {
          return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
        },
        findOne(selector, element = document.documentElement) {
          return Element.prototype.querySelector.call(element, selector);
        },
        children(element, selector) {
          return [].concat(...element.children).filter((child) => child.matches(selector));
        },
        parents(element, selector) {
          const parents = [];
          let ancestor = element.parentNode.closest(selector);
          while (ancestor) {
            parents.push(ancestor);
            ancestor = ancestor.parentNode.closest(selector);
          }
          return parents;
        },
        prev(element, selector) {
          let previous = element.previousElementSibling;
          while (previous) {
            if (previous.matches(selector)) {
              return [previous];
            }
            previous = previous.previousElementSibling;
          }
          return [];
        },
        // TODO: this is now unused; remove later along with prev()
        next(element, selector) {
          let next = element.nextElementSibling;
          while (next) {
            if (next.matches(selector)) {
              return [next];
            }
            next = next.nextElementSibling;
          }
          return [];
        },
        focusableChildren(element) {
          const focusables = ["a", "button", "input", "textarea", "select", "details", "[tabindex]", '[contenteditable="true"]'].map((selector) => `${selector}:not([tabindex^="-"])`).join(",");
          return this.find(focusables, element).filter((el) => !index_js.isDisabled(el) && index_js.isVisible(el));
        },
        getSelectorFromElement(element) {
          const selector = getSelector(element);
          if (selector) {
            return SelectorEngine.findOne(selector) ? selector : null;
          }
          return null;
        },
        getElementFromSelector(element) {
          const selector = getSelector(element);
          return selector ? SelectorEngine.findOne(selector) : null;
        },
        getMultipleElementsFromSelector(element) {
          const selector = getSelector(element);
          return selector ? SelectorEngine.find(selector) : [];
        }
      };
      return SelectorEngine;
    }));
  }
});

// public/theme/boost/js/esm/src/bootstrap/util/scrollbar.js
var require_scrollbar = __commonJS({
  "public/theme/boost/js/esm/src/bootstrap/util/scrollbar.js"(exports, module) {
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_manipulator(), require_selector_engine(), require_util()) : typeof define === "function" && define.amd ? define(["../dom/manipulator", "../dom/selector-engine", "./index"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Scrollbar = factory(global.Manipulator, global.SelectorEngine, global.Index));
    })(exports, (function(Manipulator, SelectorEngine, index_js) {
      "use strict";
      const SELECTOR_FIXED_CONTENT = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top";
      const SELECTOR_STICKY_CONTENT = ".sticky-top";
      const PROPERTY_PADDING = "padding-right";
      const PROPERTY_MARGIN = "margin-right";
      class ScrollBarHelper {
        static {
          __name(this, "ScrollBarHelper");
        }
        constructor() {
          this._element = document.body;
        }
        // Public
        getWidth() {
          const documentWidth = document.documentElement.clientWidth;
          return Math.abs(window.innerWidth - documentWidth);
        }
        hide() {
          const width = this.getWidth();
          this._disableOverFlow();
          this._setElementAttributes(this._element, PROPERTY_PADDING, (calculatedValue) => calculatedValue + width);
          this._setElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, (calculatedValue) => calculatedValue + width);
          this._setElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, (calculatedValue) => calculatedValue - width);
        }
        reset() {
          this._resetElementAttributes(this._element, "overflow");
          this._resetElementAttributes(this._element, PROPERTY_PADDING);
          this._resetElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING);
          this._resetElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN);
        }
        isOverflowing() {
          return this.getWidth() > 0;
        }
        // Private
        _disableOverFlow() {
          this._saveInitialAttribute(this._element, "overflow");
          this._element.style.overflow = "hidden";
        }
        _setElementAttributes(selector, styleProperty, callback) {
          const scrollbarWidth = this.getWidth();
          const manipulationCallBack = /* @__PURE__ */ __name((element) => {
            if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
              return;
            }
            this._saveInitialAttribute(element, styleProperty);
            const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty);
            element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`);
          }, "manipulationCallBack");
          this._applyManipulationCallback(selector, manipulationCallBack);
        }
        _saveInitialAttribute(element, styleProperty) {
          const actualValue = element.style.getPropertyValue(styleProperty);
          if (actualValue) {
            Manipulator.setDataAttribute(element, styleProperty, actualValue);
          }
        }
        _resetElementAttributes(selector, styleProperty) {
          const manipulationCallBack = /* @__PURE__ */ __name((element) => {
            const value = Manipulator.getDataAttribute(element, styleProperty);
            if (value === null) {
              element.style.removeProperty(styleProperty);
              return;
            }
            Manipulator.removeDataAttribute(element, styleProperty);
            element.style.setProperty(styleProperty, value);
          }, "manipulationCallBack");
          this._applyManipulationCallback(selector, manipulationCallBack);
        }
        _applyManipulationCallback(selector, callBack) {
          if (index_js.isElement(selector)) {
            callBack(selector);
            return;
          }
          for (const sel of SelectorEngine.find(selector, this._element)) {
            callBack(sel);
          }
        }
      }
      return ScrollBarHelper;
    }));
  }
});
export default require_scrollbar();
/*!
  * Bootstrap manipulator.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
/*!
  * Bootstrap index.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
/*!
  * Bootstrap selector-engine.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
/*!
  * Bootstrap scrollbar.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL3NyYy9kb20vbWFuaXB1bGF0b3IuanMiLCAiLi4vLi4vLi4vc3JjL3NyYy91dGlsL2luZGV4LmpzIiwgIi4uLy4uLy4uL3NyYy9zcmMvZG9tL3NlbGVjdG9yLWVuZ2luZS5qcyIsICIuLi8uLi8uLi9zcmMvc3JjL3V0aWwvc2Nyb2xsYmFyLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBCb290c3RyYXAgZG9tL21hbmlwdWxhdG9yLmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuZnVuY3Rpb24gbm9ybWFsaXplRGF0YSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT09ICd0cnVlJykge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBpZiAodmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGlmICh2YWx1ZSA9PT0gTnVtYmVyKHZhbHVlKS50b1N0cmluZygpKSB7XG4gICAgcmV0dXJuIE51bWJlcih2YWx1ZSlcbiAgfVxuXG4gIGlmICh2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09ICdudWxsJykge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVEYXRhS2V5KGtleSkge1xuICByZXR1cm4ga2V5LnJlcGxhY2UoL1tBLVpdL2csIGNociA9PiBgLSR7Y2hyLnRvTG93ZXJDYXNlKCl9YClcbn1cblxuY29uc3QgTWFuaXB1bGF0b3IgPSB7XG4gIHNldERhdGFBdHRyaWJ1dGUoZWxlbWVudCwga2V5LCB2YWx1ZSkge1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGBkYXRhLWJzLSR7bm9ybWFsaXplRGF0YUtleShrZXkpfWAsIHZhbHVlKVxuICB9LFxuXG4gIHJlbW92ZURhdGFBdHRyaWJ1dGUoZWxlbWVudCwga2V5KSB7XG4gICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYGRhdGEtYnMtJHtub3JtYWxpemVEYXRhS2V5KGtleSl9YClcbiAgfSxcblxuICBnZXREYXRhQXR0cmlidXRlcyhlbGVtZW50KSB7XG4gICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICByZXR1cm4ge31cbiAgICB9XG5cbiAgICBjb25zdCBhdHRyaWJ1dGVzID0ge31cbiAgICBjb25zdCBic0tleXMgPSBPYmplY3Qua2V5cyhlbGVtZW50LmRhdGFzZXQpLmZpbHRlcihrZXkgPT4ga2V5LnN0YXJ0c1dpdGgoJ2JzJykgJiYgIWtleS5zdGFydHNXaXRoKCdic0NvbmZpZycpKVxuXG4gICAgZm9yIChjb25zdCBrZXkgb2YgYnNLZXlzKSB7XG4gICAgICBsZXQgcHVyZUtleSA9IGtleS5yZXBsYWNlKC9eYnMvLCAnJylcbiAgICAgIHB1cmVLZXkgPSBwdXJlS2V5LmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpICsgcHVyZUtleS5zbGljZSgxKVxuICAgICAgYXR0cmlidXRlc1twdXJlS2V5XSA9IG5vcm1hbGl6ZURhdGEoZWxlbWVudC5kYXRhc2V0W2tleV0pXG4gICAgfVxuXG4gICAgcmV0dXJuIGF0dHJpYnV0ZXNcbiAgfSxcblxuICBnZXREYXRhQXR0cmlidXRlKGVsZW1lbnQsIGtleSkge1xuICAgIHJldHVybiBub3JtYWxpemVEYXRhKGVsZW1lbnQuZ2V0QXR0cmlidXRlKGBkYXRhLWJzLSR7bm9ybWFsaXplRGF0YUtleShrZXkpfWApKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hbmlwdWxhdG9yXG4iLCAiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQm9vdHN0cmFwIHV0aWwvaW5kZXguanNcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFpbi9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5jb25zdCBNQVhfVUlEID0gMV8wMDBfMDAwXG5jb25zdCBNSUxMSVNFQ09ORFNfTVVMVElQTElFUiA9IDEwMDBcbmNvbnN0IFRSQU5TSVRJT05fRU5EID0gJ3RyYW5zaXRpb25lbmQnXG5cbi8qKlxuICogUHJvcGVybHkgZXNjYXBlIElEcyBzZWxlY3RvcnMgdG8gaGFuZGxlIHdlaXJkIElEc1xuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5jb25zdCBwYXJzZVNlbGVjdG9yID0gc2VsZWN0b3IgPT4ge1xuICBpZiAoc2VsZWN0b3IgJiYgd2luZG93LkNTUyAmJiB3aW5kb3cuQ1NTLmVzY2FwZSkge1xuICAgIC8vIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IgbmVlZHMgZXNjYXBpbmcgdG8gaGFuZGxlIElEcyAoaHRtbDUrKSBjb250YWluaW5nIGZvciBpbnN0YW5jZSAvXG4gICAgc2VsZWN0b3IgPSBzZWxlY3Rvci5yZXBsYWNlKC8jKFteXFxzXCIjJ10rKS9nLCAobWF0Y2gsIGlkKSA9PiBgIyR7Q1NTLmVzY2FwZShpZCl9YClcbiAgfVxuXG4gIHJldHVybiBzZWxlY3RvclxufVxuXG4vLyBTaG91dC1vdXQgQW5ndXMgQ3JvbGwgKGh0dHBzOi8vZ29vLmdsL3B4d1FHcClcbmNvbnN0IHRvVHlwZSA9IG9iamVjdCA9PiB7XG4gIGlmIChvYmplY3QgPT09IG51bGwgfHwgb2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gYCR7b2JqZWN0fWBcbiAgfVxuXG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KS5tYXRjaCgvXFxzKFthLXpdKykvaSlbMV0udG9Mb3dlckNhc2UoKVxufVxuXG4vKipcbiAqIFB1YmxpYyBVdGlsIEFQSVxuICovXG5cbmNvbnN0IGdldFVJRCA9IHByZWZpeCA9PiB7XG4gIGRvIHtcbiAgICBwcmVmaXggKz0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogTUFYX1VJRClcbiAgfSB3aGlsZSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJlZml4KSlcblxuICByZXR1cm4gcHJlZml4XG59XG5cbmNvbnN0IGdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50ID0gZWxlbWVudCA9PiB7XG4gIGlmICghZWxlbWVudCkge1xuICAgIHJldHVybiAwXG4gIH1cblxuICAvLyBHZXQgdHJhbnNpdGlvbi1kdXJhdGlvbiBvZiB0aGUgZWxlbWVudFxuICBsZXQgeyB0cmFuc2l0aW9uRHVyYXRpb24sIHRyYW5zaXRpb25EZWxheSB9ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudClcblxuICBjb25zdCBmbG9hdFRyYW5zaXRpb25EdXJhdGlvbiA9IE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EdXJhdGlvbilcbiAgY29uc3QgZmxvYXRUcmFuc2l0aW9uRGVsYXkgPSBOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRGVsYXkpXG5cbiAgLy8gUmV0dXJuIDAgaWYgZWxlbWVudCBvciB0cmFuc2l0aW9uIGR1cmF0aW9uIGlzIG5vdCBmb3VuZFxuICBpZiAoIWZsb2F0VHJhbnNpdGlvbkR1cmF0aW9uICYmICFmbG9hdFRyYW5zaXRpb25EZWxheSkge1xuICAgIHJldHVybiAwXG4gIH1cblxuICAvLyBJZiBtdWx0aXBsZSBkdXJhdGlvbnMgYXJlIGRlZmluZWQsIHRha2UgdGhlIGZpcnN0XG4gIHRyYW5zaXRpb25EdXJhdGlvbiA9IHRyYW5zaXRpb25EdXJhdGlvbi5zcGxpdCgnLCcpWzBdXG4gIHRyYW5zaXRpb25EZWxheSA9IHRyYW5zaXRpb25EZWxheS5zcGxpdCgnLCcpWzBdXG5cbiAgcmV0dXJuIChOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRHVyYXRpb24pICsgTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkRlbGF5KSkgKiBNSUxMSVNFQ09ORFNfTVVMVElQTElFUlxufVxuXG5jb25zdCB0cmlnZ2VyVHJhbnNpdGlvbkVuZCA9IGVsZW1lbnQgPT4ge1xuICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFRSQU5TSVRJT05fRU5EKSlcbn1cblxuY29uc3QgaXNFbGVtZW50ID0gb2JqZWN0ID0+IHtcbiAgaWYgKCFvYmplY3QgfHwgdHlwZW9mIG9iamVjdCAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb2JqZWN0LmpxdWVyeSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBvYmplY3QgPSBvYmplY3RbMF1cbiAgfVxuXG4gIHJldHVybiB0eXBlb2Ygb2JqZWN0Lm5vZGVUeXBlICE9PSAndW5kZWZpbmVkJ1xufVxuXG5jb25zdCBnZXRFbGVtZW50ID0gb2JqZWN0ID0+IHtcbiAgLy8gaXQncyBhIGpRdWVyeSBvYmplY3Qgb3IgYSBub2RlIGVsZW1lbnRcbiAgaWYgKGlzRWxlbWVudChvYmplY3QpKSB7XG4gICAgcmV0dXJuIG9iamVjdC5qcXVlcnkgPyBvYmplY3RbMF0gOiBvYmplY3RcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb2JqZWN0ID09PSAnc3RyaW5nJyAmJiBvYmplY3QubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHBhcnNlU2VsZWN0b3Iob2JqZWN0KSlcbiAgfVxuXG4gIHJldHVybiBudWxsXG59XG5cbmNvbnN0IGlzVmlzaWJsZSA9IGVsZW1lbnQgPT4ge1xuICBpZiAoIWlzRWxlbWVudChlbGVtZW50KSB8fCBlbGVtZW50LmdldENsaWVudFJlY3RzKCkubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBjb25zdCBlbGVtZW50SXNWaXNpYmxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCd2aXNpYmlsaXR5JykgPT09ICd2aXNpYmxlJ1xuICAvLyBIYW5kbGUgYGRldGFpbHNgIGVsZW1lbnQgYXMgaXRzIGNvbnRlbnQgbWF5IGZhbHNpZSBhcHBlYXIgdmlzaWJsZSB3aGVuIGl0IGlzIGNsb3NlZFxuICBjb25zdCBjbG9zZWREZXRhaWxzID0gZWxlbWVudC5jbG9zZXN0KCdkZXRhaWxzOm5vdChbb3Blbl0pJylcblxuICBpZiAoIWNsb3NlZERldGFpbHMpIHtcbiAgICByZXR1cm4gZWxlbWVudElzVmlzaWJsZVxuICB9XG5cbiAgaWYgKGNsb3NlZERldGFpbHMgIT09IGVsZW1lbnQpIHtcbiAgICBjb25zdCBzdW1tYXJ5ID0gZWxlbWVudC5jbG9zZXN0KCdzdW1tYXJ5JylcbiAgICBpZiAoc3VtbWFyeSAmJiBzdW1tYXJ5LnBhcmVudE5vZGUgIT09IGNsb3NlZERldGFpbHMpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGlmIChzdW1tYXJ5ID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZWxlbWVudElzVmlzaWJsZVxufVxuXG5jb25zdCBpc0Rpc2FibGVkID0gZWxlbWVudCA9PiB7XG4gIGlmICghZWxlbWVudCB8fCBlbGVtZW50Lm5vZGVUeXBlICE9PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2Rpc2FibGVkJykpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgaWYgKHR5cGVvZiBlbGVtZW50LmRpc2FibGVkICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBlbGVtZW50LmRpc2FibGVkXG4gIH1cblxuICByZXR1cm4gZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJykgIT09ICdmYWxzZSdcbn1cblxuY29uc3QgZmluZFNoYWRvd1Jvb3QgPSBlbGVtZW50ID0+IHtcbiAgaWYgKCFkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXR0YWNoU2hhZG93KSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIC8vIENhbiBmaW5kIHRoZSBzaGFkb3cgcm9vdCBvdGhlcndpc2UgaXQnbGwgcmV0dXJuIHRoZSBkb2N1bWVudFxuICBpZiAodHlwZW9mIGVsZW1lbnQuZ2V0Um9vdE5vZGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjb25zdCByb290ID0gZWxlbWVudC5nZXRSb290Tm9kZSgpXG4gICAgcmV0dXJuIHJvb3QgaW5zdGFuY2VvZiBTaGFkb3dSb290ID8gcm9vdCA6IG51bGxcbiAgfVxuXG4gIGlmIChlbGVtZW50IGluc3RhbmNlb2YgU2hhZG93Um9vdCkge1xuICAgIHJldHVybiBlbGVtZW50XG4gIH1cblxuICAvLyB3aGVuIHdlIGRvbid0IGZpbmQgYSBzaGFkb3cgcm9vdFxuICBpZiAoIWVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICByZXR1cm4gZmluZFNoYWRvd1Jvb3QoZWxlbWVudC5wYXJlbnROb2RlKVxufVxuXG5jb25zdCBub29wID0gKCkgPT4ge31cblxuLyoqXG4gKiBUcmljayB0byByZXN0YXJ0IGFuIGVsZW1lbnQncyBhbmltYXRpb25cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKiBAcmV0dXJuIHZvaWRcbiAqXG4gKiBAc2VlIGh0dHBzOi8vd3d3LmhhcnJ5dGhlby5jb20vYmxvZy8yMDIxLzAyL3Jlc3RhcnQtYS1jc3MtYW5pbWF0aW9uLXdpdGgtamF2YXNjcmlwdC8jcmVzdGFydGluZy1hLWNzcy1hbmltYXRpb25cbiAqL1xuY29uc3QgcmVmbG93ID0gZWxlbWVudCA9PiB7XG4gIGVsZW1lbnQub2Zmc2V0SGVpZ2h0IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG59XG5cbmNvbnN0IGdldGpRdWVyeSA9ICgpID0+IHtcbiAgaWYgKHdpbmRvdy5qUXVlcnkgJiYgIWRvY3VtZW50LmJvZHkuaGFzQXR0cmlidXRlKCdkYXRhLWJzLW5vLWpxdWVyeScpKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5qUXVlcnlcbiAgfVxuXG4gIHJldHVybiBudWxsXG59XG5cbmNvbnN0IERPTUNvbnRlbnRMb2FkZWRDYWxsYmFja3MgPSBbXVxuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWQgPSBjYWxsYmFjayA9PiB7XG4gIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnbG9hZGluZycpIHtcbiAgICAvLyBhZGQgbGlzdGVuZXIgb24gdGhlIGZpcnN0IGNhbGwgd2hlbiB0aGUgZG9jdW1lbnQgaXMgaW4gbG9hZGluZyBzdGF0ZVxuICAgIGlmICghRE9NQ29udGVudExvYWRlZENhbGxiYWNrcy5sZW5ndGgpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgY2FsbGJhY2sgb2YgRE9NQ29udGVudExvYWRlZENhbGxiYWNrcykge1xuICAgICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBET01Db250ZW50TG9hZGVkQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spXG4gIH0gZWxzZSB7XG4gICAgY2FsbGJhY2soKVxuICB9XG59XG5cbmNvbnN0IGlzUlRMID0gKCkgPT4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmRpciA9PT0gJ3J0bCdcblxuY29uc3QgZGVmaW5lSlF1ZXJ5UGx1Z2luID0gcGx1Z2luID0+IHtcbiAgb25ET01Db250ZW50TG9hZGVkKCgpID0+IHtcbiAgICBjb25zdCAkID0gZ2V0alF1ZXJ5KClcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoJCkge1xuICAgICAgY29uc3QgbmFtZSA9IHBsdWdpbi5OQU1FXG4gICAgICBjb25zdCBKUVVFUllfTk9fQ09ORkxJQ1QgPSAkLmZuW25hbWVdXG4gICAgICAkLmZuW25hbWVdID0gcGx1Z2luLmpRdWVyeUludGVyZmFjZVxuICAgICAgJC5mbltuYW1lXS5Db25zdHJ1Y3RvciA9IHBsdWdpblxuICAgICAgJC5mbltuYW1lXS5ub0NvbmZsaWN0ID0gKCkgPT4ge1xuICAgICAgICAkLmZuW25hbWVdID0gSlFVRVJZX05PX0NPTkZMSUNUXG4gICAgICAgIHJldHVybiBwbHVnaW4ualF1ZXJ5SW50ZXJmYWNlXG4gICAgICB9XG4gICAgfVxuICB9KVxufVxuXG5jb25zdCBleGVjdXRlID0gKHBvc3NpYmxlQ2FsbGJhY2ssIGFyZ3MgPSBbXSwgZGVmYXVsdFZhbHVlID0gcG9zc2libGVDYWxsYmFjaykgPT4ge1xuICByZXR1cm4gdHlwZW9mIHBvc3NpYmxlQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicgPyBwb3NzaWJsZUNhbGxiYWNrLmNhbGwoLi4uYXJncykgOiBkZWZhdWx0VmFsdWVcbn1cblxuY29uc3QgZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbiA9IChjYWxsYmFjaywgdHJhbnNpdGlvbkVsZW1lbnQsIHdhaXRGb3JUcmFuc2l0aW9uID0gdHJ1ZSkgPT4ge1xuICBpZiAoIXdhaXRGb3JUcmFuc2l0aW9uKSB7XG4gICAgZXhlY3V0ZShjYWxsYmFjaylcbiAgICByZXR1cm5cbiAgfVxuXG4gIGNvbnN0IGR1cmF0aW9uUGFkZGluZyA9IDVcbiAgY29uc3QgZW11bGF0ZWREdXJhdGlvbiA9IGdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50KHRyYW5zaXRpb25FbGVtZW50KSArIGR1cmF0aW9uUGFkZGluZ1xuXG4gIGxldCBjYWxsZWQgPSBmYWxzZVxuXG4gIGNvbnN0IGhhbmRsZXIgPSAoeyB0YXJnZXQgfSkgPT4ge1xuICAgIGlmICh0YXJnZXQgIT09IHRyYW5zaXRpb25FbGVtZW50KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjYWxsZWQgPSB0cnVlXG4gICAgdHJhbnNpdGlvbkVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihUUkFOU0lUSU9OX0VORCwgaGFuZGxlcilcbiAgICBleGVjdXRlKGNhbGxiYWNrKVxuICB9XG5cbiAgdHJhbnNpdGlvbkVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihUUkFOU0lUSU9OX0VORCwgaGFuZGxlcilcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgaWYgKCFjYWxsZWQpIHtcbiAgICAgIHRyaWdnZXJUcmFuc2l0aW9uRW5kKHRyYW5zaXRpb25FbGVtZW50KVxuICAgIH1cbiAgfSwgZW11bGF0ZWREdXJhdGlvbilcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIHByZXZpb3VzL25leHQgZWxlbWVudCBvZiBhIGxpc3QuXG4gKlxuICogQHBhcmFtIHthcnJheX0gbGlzdCAgICBUaGUgbGlzdCBvZiBlbGVtZW50c1xuICogQHBhcmFtIGFjdGl2ZUVsZW1lbnQgICBUaGUgYWN0aXZlIGVsZW1lbnRcbiAqIEBwYXJhbSBzaG91bGRHZXROZXh0ICAgQ2hvb3NlIHRvIGdldCBuZXh0IG9yIHByZXZpb3VzIGVsZW1lbnRcbiAqIEBwYXJhbSBpc0N5Y2xlQWxsb3dlZFxuICogQHJldHVybiB7RWxlbWVudHxlbGVtfSBUaGUgcHJvcGVyIGVsZW1lbnRcbiAqL1xuY29uc3QgZ2V0TmV4dEFjdGl2ZUVsZW1lbnQgPSAobGlzdCwgYWN0aXZlRWxlbWVudCwgc2hvdWxkR2V0TmV4dCwgaXNDeWNsZUFsbG93ZWQpID0+IHtcbiAgY29uc3QgbGlzdExlbmd0aCA9IGxpc3QubGVuZ3RoXG4gIGxldCBpbmRleCA9IGxpc3QuaW5kZXhPZihhY3RpdmVFbGVtZW50KVxuXG4gIC8vIGlmIHRoZSBlbGVtZW50IGRvZXMgbm90IGV4aXN0IGluIHRoZSBsaXN0IHJldHVybiBhbiBlbGVtZW50XG4gIC8vIGRlcGVuZGluZyBvbiB0aGUgZGlyZWN0aW9uIGFuZCBpZiBjeWNsZSBpcyBhbGxvd2VkXG4gIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICByZXR1cm4gIXNob3VsZEdldE5leHQgJiYgaXNDeWNsZUFsbG93ZWQgPyBsaXN0W2xpc3RMZW5ndGggLSAxXSA6IGxpc3RbMF1cbiAgfVxuXG4gIGluZGV4ICs9IHNob3VsZEdldE5leHQgPyAxIDogLTFcblxuICBpZiAoaXNDeWNsZUFsbG93ZWQpIHtcbiAgICBpbmRleCA9IChpbmRleCArIGxpc3RMZW5ndGgpICUgbGlzdExlbmd0aFxuICB9XG5cbiAgcmV0dXJuIGxpc3RbTWF0aC5tYXgoMCwgTWF0aC5taW4oaW5kZXgsIGxpc3RMZW5ndGggLSAxKSldXG59XG5cbmV4cG9ydCB7XG4gIGRlZmluZUpRdWVyeVBsdWdpbixcbiAgZXhlY3V0ZSxcbiAgZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbixcbiAgZmluZFNoYWRvd1Jvb3QsXG4gIGdldEVsZW1lbnQsXG4gIGdldGpRdWVyeSxcbiAgZ2V0TmV4dEFjdGl2ZUVsZW1lbnQsXG4gIGdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50LFxuICBnZXRVSUQsXG4gIGlzRGlzYWJsZWQsXG4gIGlzRWxlbWVudCxcbiAgaXNSVEwsXG4gIGlzVmlzaWJsZSxcbiAgbm9vcCxcbiAgb25ET01Db250ZW50TG9hZGVkLFxuICBwYXJzZVNlbGVjdG9yLFxuICByZWZsb3csXG4gIHRyaWdnZXJUcmFuc2l0aW9uRW5kLFxuICB0b1R5cGVcbn1cbiIsICIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBCb290c3RyYXAgZG9tL3NlbGVjdG9yLWVuZ2luZS5qc1xuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmltcG9ydCB7IGlzRGlzYWJsZWQsIGlzVmlzaWJsZSwgcGFyc2VTZWxlY3RvciB9IGZyb20gJy4uL3V0aWwvaW5kZXguanMnXG5cbmNvbnN0IGdldFNlbGVjdG9yID0gZWxlbWVudCA9PiB7XG4gIGxldCBzZWxlY3RvciA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWJzLXRhcmdldCcpXG5cbiAgaWYgKCFzZWxlY3RvciB8fCBzZWxlY3RvciA9PT0gJyMnKSB7XG4gICAgbGV0IGhyZWZBdHRyaWJ1dGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpXG5cbiAgICAvLyBUaGUgb25seSB2YWxpZCBjb250ZW50IHRoYXQgY291bGQgZG91YmxlIGFzIGEgc2VsZWN0b3IgYXJlIElEcyBvciBjbGFzc2VzLFxuICAgIC8vIHNvIGV2ZXJ5dGhpbmcgc3RhcnRpbmcgd2l0aCBgI2Agb3IgYC5gLiBJZiBhIFwicmVhbFwiIFVSTCBpcyB1c2VkIGFzIHRoZSBzZWxlY3RvcixcbiAgICAvLyBgZG9jdW1lbnQucXVlcnlTZWxlY3RvcmAgd2lsbCByaWdodGZ1bGx5IGNvbXBsYWluIGl0IGlzIGludmFsaWQuXG4gICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9pc3N1ZXMvMzIyNzNcbiAgICBpZiAoIWhyZWZBdHRyaWJ1dGUgfHwgKCFocmVmQXR0cmlidXRlLmluY2x1ZGVzKCcjJykgJiYgIWhyZWZBdHRyaWJ1dGUuc3RhcnRzV2l0aCgnLicpKSkge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICAvLyBKdXN0IGluIGNhc2Ugc29tZSBDTVMgcHV0cyBvdXQgYSBmdWxsIFVSTCB3aXRoIHRoZSBhbmNob3IgYXBwZW5kZWRcbiAgICBpZiAoaHJlZkF0dHJpYnV0ZS5pbmNsdWRlcygnIycpICYmICFocmVmQXR0cmlidXRlLnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgaHJlZkF0dHJpYnV0ZSA9IGAjJHtocmVmQXR0cmlidXRlLnNwbGl0KCcjJylbMV19YFxuICAgIH1cblxuICAgIHNlbGVjdG9yID0gaHJlZkF0dHJpYnV0ZSAmJiBocmVmQXR0cmlidXRlICE9PSAnIycgPyBocmVmQXR0cmlidXRlLnRyaW0oKSA6IG51bGxcbiAgfVxuXG4gIHJldHVybiBzZWxlY3RvciA/IHNlbGVjdG9yLnNwbGl0KCcsJykubWFwKHNlbCA9PiBwYXJzZVNlbGVjdG9yKHNlbCkpLmpvaW4oJywnKSA6IG51bGxcbn1cblxuY29uc3QgU2VsZWN0b3JFbmdpbmUgPSB7XG4gIGZpbmQoc2VsZWN0b3IsIGVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcbiAgICByZXR1cm4gW10uY29uY2F0KC4uLkVsZW1lbnQucHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3JBbGwuY2FsbChlbGVtZW50LCBzZWxlY3RvcikpXG4gIH0sXG5cbiAgZmluZE9uZShzZWxlY3RvciwgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuICAgIHJldHVybiBFbGVtZW50LnByb3RvdHlwZS5xdWVyeVNlbGVjdG9yLmNhbGwoZWxlbWVudCwgc2VsZWN0b3IpXG4gIH0sXG5cbiAgY2hpbGRyZW4oZWxlbWVudCwgc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gW10uY29uY2F0KC4uLmVsZW1lbnQuY2hpbGRyZW4pLmZpbHRlcihjaGlsZCA9PiBjaGlsZC5tYXRjaGVzKHNlbGVjdG9yKSlcbiAgfSxcblxuICBwYXJlbnRzKGVsZW1lbnQsIHNlbGVjdG9yKSB7XG4gICAgY29uc3QgcGFyZW50cyA9IFtdXG4gICAgbGV0IGFuY2VzdG9yID0gZWxlbWVudC5wYXJlbnROb2RlLmNsb3Nlc3Qoc2VsZWN0b3IpXG5cbiAgICB3aGlsZSAoYW5jZXN0b3IpIHtcbiAgICAgIHBhcmVudHMucHVzaChhbmNlc3RvcilcbiAgICAgIGFuY2VzdG9yID0gYW5jZXN0b3IucGFyZW50Tm9kZS5jbG9zZXN0KHNlbGVjdG9yKVxuICAgIH1cblxuICAgIHJldHVybiBwYXJlbnRzXG4gIH0sXG5cbiAgcHJldihlbGVtZW50LCBzZWxlY3Rvcikge1xuICAgIGxldCBwcmV2aW91cyA9IGVsZW1lbnQucHJldmlvdXNFbGVtZW50U2libGluZ1xuXG4gICAgd2hpbGUgKHByZXZpb3VzKSB7XG4gICAgICBpZiAocHJldmlvdXMubWF0Y2hlcyhzZWxlY3RvcikpIHtcbiAgICAgICAgcmV0dXJuIFtwcmV2aW91c11cbiAgICAgIH1cblxuICAgICAgcHJldmlvdXMgPSBwcmV2aW91cy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nXG4gICAgfVxuXG4gICAgcmV0dXJuIFtdXG4gIH0sXG4gIC8vIFRPRE86IHRoaXMgaXMgbm93IHVudXNlZDsgcmVtb3ZlIGxhdGVyIGFsb25nIHdpdGggcHJldigpXG4gIG5leHQoZWxlbWVudCwgc2VsZWN0b3IpIHtcbiAgICBsZXQgbmV4dCA9IGVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nXG5cbiAgICB3aGlsZSAobmV4dCkge1xuICAgICAgaWYgKG5leHQubWF0Y2hlcyhzZWxlY3RvcikpIHtcbiAgICAgICAgcmV0dXJuIFtuZXh0XVxuICAgICAgfVxuXG4gICAgICBuZXh0ID0gbmV4dC5uZXh0RWxlbWVudFNpYmxpbmdcbiAgICB9XG5cbiAgICByZXR1cm4gW11cbiAgfSxcblxuICBmb2N1c2FibGVDaGlsZHJlbihlbGVtZW50KSB7XG4gICAgY29uc3QgZm9jdXNhYmxlcyA9IFtcbiAgICAgICdhJyxcbiAgICAgICdidXR0b24nLFxuICAgICAgJ2lucHV0JyxcbiAgICAgICd0ZXh0YXJlYScsXG4gICAgICAnc2VsZWN0JyxcbiAgICAgICdkZXRhaWxzJyxcbiAgICAgICdbdGFiaW5kZXhdJyxcbiAgICAgICdbY29udGVudGVkaXRhYmxlPVwidHJ1ZVwiXSdcbiAgICBdLm1hcChzZWxlY3RvciA9PiBgJHtzZWxlY3Rvcn06bm90KFt0YWJpbmRleF49XCItXCJdKWApLmpvaW4oJywnKVxuXG4gICAgcmV0dXJuIHRoaXMuZmluZChmb2N1c2FibGVzLCBlbGVtZW50KS5maWx0ZXIoZWwgPT4gIWlzRGlzYWJsZWQoZWwpICYmIGlzVmlzaWJsZShlbCkpXG4gIH0sXG5cbiAgZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlbGVtZW50KSB7XG4gICAgY29uc3Qgc2VsZWN0b3IgPSBnZXRTZWxlY3RvcihlbGVtZW50KVxuXG4gICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICByZXR1cm4gU2VsZWN0b3JFbmdpbmUuZmluZE9uZShzZWxlY3RvcikgPyBzZWxlY3RvciA6IG51bGxcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbFxuICB9LFxuXG4gIGdldEVsZW1lbnRGcm9tU2VsZWN0b3IoZWxlbWVudCkge1xuICAgIGNvbnN0IHNlbGVjdG9yID0gZ2V0U2VsZWN0b3IoZWxlbWVudClcblxuICAgIHJldHVybiBzZWxlY3RvciA/IFNlbGVjdG9yRW5naW5lLmZpbmRPbmUoc2VsZWN0b3IpIDogbnVsbFxuICB9LFxuXG4gIGdldE11bHRpcGxlRWxlbWVudHNGcm9tU2VsZWN0b3IoZWxlbWVudCkge1xuICAgIGNvbnN0IHNlbGVjdG9yID0gZ2V0U2VsZWN0b3IoZWxlbWVudClcblxuICAgIHJldHVybiBzZWxlY3RvciA/IFNlbGVjdG9yRW5naW5lLmZpbmQoc2VsZWN0b3IpIDogW11cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTZWxlY3RvckVuZ2luZVxuIiwgIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEJvb3RzdHJhcCB1dGlsL3Njcm9sbEJhci5qc1xuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmltcG9ydCBNYW5pcHVsYXRvciBmcm9tICcuLi9kb20vbWFuaXB1bGF0b3IuanMnXG5pbXBvcnQgU2VsZWN0b3JFbmdpbmUgZnJvbSAnLi4vZG9tL3NlbGVjdG9yLWVuZ2luZS5qcydcbmltcG9ydCB7IGlzRWxlbWVudCB9IGZyb20gJy4vaW5kZXguanMnXG5cbi8qKlxuICogQ29uc3RhbnRzXG4gKi9cblxuY29uc3QgU0VMRUNUT1JfRklYRURfQ09OVEVOVCA9ICcuZml4ZWQtdG9wLCAuZml4ZWQtYm90dG9tLCAuaXMtZml4ZWQsIC5zdGlja3ktdG9wJ1xuY29uc3QgU0VMRUNUT1JfU1RJQ0tZX0NPTlRFTlQgPSAnLnN0aWNreS10b3AnXG5jb25zdCBQUk9QRVJUWV9QQURESU5HID0gJ3BhZGRpbmctcmlnaHQnXG5jb25zdCBQUk9QRVJUWV9NQVJHSU4gPSAnbWFyZ2luLXJpZ2h0J1xuXG4vKipcbiAqIENsYXNzIGRlZmluaXRpb25cbiAqL1xuXG5jbGFzcyBTY3JvbGxCYXJIZWxwZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuYm9keVxuICB9XG5cbiAgLy8gUHVibGljXG4gIGdldFdpZHRoKCkge1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XaW5kb3cvaW5uZXJXaWR0aCN1c2FnZV9ub3Rlc1xuICAgIGNvbnN0IGRvY3VtZW50V2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcbiAgICByZXR1cm4gTWF0aC5hYnMod2luZG93LmlubmVyV2lkdGggLSBkb2N1bWVudFdpZHRoKVxuICB9XG5cbiAgaGlkZSgpIHtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMuZ2V0V2lkdGgoKVxuICAgIHRoaXMuX2Rpc2FibGVPdmVyRmxvdygpXG4gICAgLy8gZ2l2ZSBwYWRkaW5nIHRvIGVsZW1lbnQgdG8gYmFsYW5jZSB0aGUgaGlkZGVuIHNjcm9sbGJhciB3aWR0aFxuICAgIHRoaXMuX3NldEVsZW1lbnRBdHRyaWJ1dGVzKHRoaXMuX2VsZW1lbnQsIFBST1BFUlRZX1BBRERJTkcsIGNhbGN1bGF0ZWRWYWx1ZSA9PiBjYWxjdWxhdGVkVmFsdWUgKyB3aWR0aClcbiAgICAvLyB0cmljazogV2UgYWRqdXN0IHBvc2l0aXZlIHBhZGRpbmdSaWdodCBhbmQgbmVnYXRpdmUgbWFyZ2luUmlnaHQgdG8gc3RpY2t5LXRvcCBlbGVtZW50cyB0byBrZWVwIHNob3dpbmcgZnVsbHdpZHRoXG4gICAgdGhpcy5fc2V0RWxlbWVudEF0dHJpYnV0ZXMoU0VMRUNUT1JfRklYRURfQ09OVEVOVCwgUFJPUEVSVFlfUEFERElORywgY2FsY3VsYXRlZFZhbHVlID0+IGNhbGN1bGF0ZWRWYWx1ZSArIHdpZHRoKVxuICAgIHRoaXMuX3NldEVsZW1lbnRBdHRyaWJ1dGVzKFNFTEVDVE9SX1NUSUNLWV9DT05URU5ULCBQUk9QRVJUWV9NQVJHSU4sIGNhbGN1bGF0ZWRWYWx1ZSA9PiBjYWxjdWxhdGVkVmFsdWUgLSB3aWR0aClcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuX3Jlc2V0RWxlbWVudEF0dHJpYnV0ZXModGhpcy5fZWxlbWVudCwgJ292ZXJmbG93JylcbiAgICB0aGlzLl9yZXNldEVsZW1lbnRBdHRyaWJ1dGVzKHRoaXMuX2VsZW1lbnQsIFBST1BFUlRZX1BBRERJTkcpXG4gICAgdGhpcy5fcmVzZXRFbGVtZW50QXR0cmlidXRlcyhTRUxFQ1RPUl9GSVhFRF9DT05URU5ULCBQUk9QRVJUWV9QQURESU5HKVxuICAgIHRoaXMuX3Jlc2V0RWxlbWVudEF0dHJpYnV0ZXMoU0VMRUNUT1JfU1RJQ0tZX0NPTlRFTlQsIFBST1BFUlRZX01BUkdJTilcbiAgfVxuXG4gIGlzT3ZlcmZsb3dpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0V2lkdGgoKSA+IDBcbiAgfVxuXG4gIC8vIFByaXZhdGVcbiAgX2Rpc2FibGVPdmVyRmxvdygpIHtcbiAgICB0aGlzLl9zYXZlSW5pdGlhbEF0dHJpYnV0ZSh0aGlzLl9lbGVtZW50LCAnb3ZlcmZsb3cnKVxuICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuICB9XG5cbiAgX3NldEVsZW1lbnRBdHRyaWJ1dGVzKHNlbGVjdG9yLCBzdHlsZVByb3BlcnR5LCBjYWxsYmFjaykge1xuICAgIGNvbnN0IHNjcm9sbGJhcldpZHRoID0gdGhpcy5nZXRXaWR0aCgpXG4gICAgY29uc3QgbWFuaXB1bGF0aW9uQ2FsbEJhY2sgPSBlbGVtZW50ID0+IHtcbiAgICAgIGlmIChlbGVtZW50ICE9PSB0aGlzLl9lbGVtZW50ICYmIHdpbmRvdy5pbm5lcldpZHRoID4gZWxlbWVudC5jbGllbnRXaWR0aCArIHNjcm9sbGJhcldpZHRoKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0aGlzLl9zYXZlSW5pdGlhbEF0dHJpYnV0ZShlbGVtZW50LCBzdHlsZVByb3BlcnR5KVxuICAgICAgY29uc3QgY2FsY3VsYXRlZFZhbHVlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZShzdHlsZVByb3BlcnR5KVxuICAgICAgZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShzdHlsZVByb3BlcnR5LCBgJHtjYWxsYmFjayhOdW1iZXIucGFyc2VGbG9hdChjYWxjdWxhdGVkVmFsdWUpKX1weGApXG4gICAgfVxuXG4gICAgdGhpcy5fYXBwbHlNYW5pcHVsYXRpb25DYWxsYmFjayhzZWxlY3RvciwgbWFuaXB1bGF0aW9uQ2FsbEJhY2spXG4gIH1cblxuICBfc2F2ZUluaXRpYWxBdHRyaWJ1dGUoZWxlbWVudCwgc3R5bGVQcm9wZXJ0eSkge1xuICAgIGNvbnN0IGFjdHVhbFZhbHVlID0gZWxlbWVudC5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKHN0eWxlUHJvcGVydHkpXG4gICAgaWYgKGFjdHVhbFZhbHVlKSB7XG4gICAgICBNYW5pcHVsYXRvci5zZXREYXRhQXR0cmlidXRlKGVsZW1lbnQsIHN0eWxlUHJvcGVydHksIGFjdHVhbFZhbHVlKVxuICAgIH1cbiAgfVxuXG4gIF9yZXNldEVsZW1lbnRBdHRyaWJ1dGVzKHNlbGVjdG9yLCBzdHlsZVByb3BlcnR5KSB7XG4gICAgY29uc3QgbWFuaXB1bGF0aW9uQ2FsbEJhY2sgPSBlbGVtZW50ID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gTWFuaXB1bGF0b3IuZ2V0RGF0YUF0dHJpYnV0ZShlbGVtZW50LCBzdHlsZVByb3BlcnR5KVxuICAgICAgLy8gV2Ugb25seSB3YW50IHRvIHJlbW92ZSB0aGUgcHJvcGVydHkgaWYgdGhlIHZhbHVlIGlzIGBudWxsYDsgdGhlIHZhbHVlIGNhbiBhbHNvIGJlIHplcm9cbiAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICBlbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KHN0eWxlUHJvcGVydHkpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBNYW5pcHVsYXRvci5yZW1vdmVEYXRhQXR0cmlidXRlKGVsZW1lbnQsIHN0eWxlUHJvcGVydHkpXG4gICAgICBlbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KHN0eWxlUHJvcGVydHksIHZhbHVlKVxuICAgIH1cblxuICAgIHRoaXMuX2FwcGx5TWFuaXB1bGF0aW9uQ2FsbGJhY2soc2VsZWN0b3IsIG1hbmlwdWxhdGlvbkNhbGxCYWNrKVxuICB9XG5cbiAgX2FwcGx5TWFuaXB1bGF0aW9uQ2FsbGJhY2soc2VsZWN0b3IsIGNhbGxCYWNrKSB7XG4gICAgaWYgKGlzRWxlbWVudChzZWxlY3RvcikpIHtcbiAgICAgIGNhbGxCYWNrKHNlbGVjdG9yKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBzZWwgb2YgU2VsZWN0b3JFbmdpbmUuZmluZChzZWxlY3RvciwgdGhpcy5fZWxlbWVudCkpIHtcbiAgICAgIGNhbGxCYWNrKHNlbClcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2Nyb2xsQmFySGVscGVyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7QUFPQSxlQUFTQSxjQUFjQyxPQUFPO0FBQzVCLFlBQUlBLFVBQVUsUUFBUTtBQUNwQixpQkFBTztRQUNUO0FBRUEsWUFBSUEsVUFBVSxTQUFTO0FBQ3JCLGlCQUFPO1FBQ1Q7QUFFQSxZQUFJQSxVQUFVQyxPQUFPRCxLQUFLLEVBQUVFLFNBQVEsR0FBSTtBQUN0QyxpQkFBT0QsT0FBT0QsS0FBSztRQUNyQjtBQUVBLFlBQUlBLFVBQVUsTUFBTUEsVUFBVSxRQUFRO0FBQ3BDLGlCQUFPO1FBQ1Q7QUFFQSxZQUFJLE9BQU9BLFVBQVUsVUFBVTtBQUM3QixpQkFBT0E7UUFDVDtBQUVBLFlBQUk7QUFDRixpQkFBT0csS0FBS0MsTUFBTUMsbUJBQW1CTCxLQUFLLENBQUM7UUFDN0MsU0FBRU0sU0FBTTtBQUNOLGlCQUFPTjtRQUNUO01BQ0Y7QUExQlNEO0FBNEJULGVBQVNRLGlCQUFpQkMsS0FBSztBQUM3QixlQUFPQSxJQUFJQyxRQUFRLFVBQVVDLFNBQU8sSUFBSUEsSUFBSUMsWUFBVyxDQUFFLEVBQUU7TUFDN0Q7QUFGU0o7QUFJVCxZQUFNSyxjQUFjO1FBQ2xCQyxpQkFBaUJDLFNBQVNOLEtBQUtSLE9BQU87QUFDcENjLGtCQUFRQyxhQUFhLFdBQVdSLGlCQUFpQkMsR0FBRyxDQUFDLElBQUlSLEtBQUs7UUFDaEU7UUFFQWdCLG9CQUFvQkYsU0FBU04sS0FBSztBQUNoQ00sa0JBQVFHLGdCQUFnQixXQUFXVixpQkFBaUJDLEdBQUcsQ0FBQyxF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VUksb0JBQW9CO1FBQ2hFO1FBRUFQLHNCQUFzQlEsU0FBU0osZUFBZTtBQUM1QyxnQkFBTVcsY0FBY1AsUUFBUVAsTUFBTVMsaUJBQWlCTixhQUFhO0FBQ2hFLGNBQUlXLGFBQWE7QUFDZkMsd0JBQVlDLGlCQUFpQlQsU0FBU0osZUFBZVcsV0FBVztVQUNsRTtRQUNGO1FBRUFqQix3QkFBd0JLLFVBQVVDLGVBQWU7QUFDL0MsZ0JBQU1HLHVCQUF1QkMsb0NBQVc7QUFDdEMsa0JBQU1VLFFBQVFGLFlBQVlHLGlCQUFpQlgsU0FBU0osYUFBYTtBQUVqRSxnQkFBSWMsVUFBVSxNQUFNO0FBQ2xCVixzQkFBUVAsTUFBTW1CLGVBQWVoQixhQUFhO0FBQzFDO1lBQ0Y7QUFFQVksd0JBQVlLLG9CQUFvQmIsU0FBU0osYUFBYTtBQUN0REksb0JBQVFQLE1BQU1VLFlBQVlQLGVBQWVjLEtBQUs7VUFDaEQsR0FWNkJWO0FBWTdCLGVBQUtNLDJCQUEyQlgsVUFBVUksb0JBQW9CO1FBQ2hFO1FBRUFPLDJCQUEyQlgsVUFBVW1CLFVBQVU7QUFDN0MsY0FBSUMsU0FBQUEsVUFBVXBCLFFBQVEsR0FBRztBQUN2Qm1CLHFCQUFTbkIsUUFBUTtBQUNqQjtVQUNGO0FBRUEscUJBQVdxQixPQUFPQyxlQUFlQyxLQUFLdkIsVUFBVSxLQUFLdEIsUUFBUSxHQUFHO0FBQzlEeUMscUJBQVNFLEdBQUc7VUFDZDtRQUNGO01BQ0Y7Ozs7OyIsCiAgIm5hbWVzIjogWyJub3JtYWxpemVEYXRhIiwgInZhbHVlIiwgIk51bWJlciIsICJ0b1N0cmluZyIsICJKU09OIiwgInBhcnNlIiwgImRlY29kZVVSSUNvbXBvbmVudCIsICJfdW51c2VkIiwgIm5vcm1hbGl6ZURhdGFLZXkiLCAia2V5IiwgInJlcGxhY2UiLCAiY2hyIiwgInRvTG93ZXJDYXNlIiwgIk1hbmlwdWxhdG9yIiwgInNldERhdGFBdHRyaWJ1dGUiLCAiZWxlbWVudCIsICJzZXRBdHRyaWJ1dGUiLCAicmVtb3ZlRGF0YUF0dHJpYnV0ZSIsICJyZW1vdmVBdHRyaWJ1dGUiLCAiZ2V0RGF0YUF0dHJpYnV0ZXMiLCAiYXR0cmlidXRlcyIsICJic0tleXMiLCAiT2JqZWN0IiwgImtleXMiLCAiZGF0YXNldCIsICJmaWx0ZXIiLCAic3RhcnRzV2l0aCIsICJwdXJlS2V5IiwgImNoYXJBdCIsICJzbGljZSIsICJnZXREYXRhQXR0cmlidXRlIiwgImdldEF0dHJpYnV0ZSIsICJNQVhfVUlEIiwgIk1JTExJU0VDT05EU19NVUxUSVBMSUVSIiwgIlRSQU5TSVRJT05fRU5EIiwgInBhcnNlU2VsZWN0b3IiLCAic2VsZWN0b3IiLCAid2luZG93IiwgIkNTUyIsICJlc2NhcGUiLCAicmVwbGFjZSIsICJtYXRjaCIsICJpZCIsICJ0b1R5cGUiLCAib2JqZWN0IiwgInVuZGVmaW5lZCIsICJPYmplY3QiLCAicHJvdG90eXBlIiwgInRvU3RyaW5nIiwgImNhbGwiLCAidG9Mb3dlckNhc2UiLCAiZ2V0VUlEIiwgInByZWZpeCIsICJNYXRoIiwgImZsb29yIiwgInJhbmRvbSIsICJkb2N1bWVudCIsICJnZXRFbGVtZW50QnlJZCIsICJnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCIsICJlbGVtZW50IiwgInRyYW5zaXRpb25EdXJhdGlvbiIsICJ0cmFuc2l0aW9uRGVsYXkiLCAiZ2V0Q29tcHV0ZWRTdHlsZSIsICJmbG9hdFRyYW5zaXRpb25EdXJhdGlvbiIsICJOdW1iZXIiLCAicGFyc2VGbG9hdCIsICJmbG9hdFRyYW5zaXRpb25EZWxheSIsICJzcGxpdCIsICJ0cmlnZ2VyVHJhbnNpdGlvbkVuZCIsICJkaXNwYXRjaEV2ZW50IiwgIkV2ZW50IiwgImlzRWxlbWVudCIsICJqcXVlcnkiLCAibm9kZVR5cGUiLCAiZ2V0RWxlbWVudCIsICJsZW5ndGgiLCAicXVlcnlTZWxlY3RvciIsICJpc1Zpc2libGUiLCAiZ2V0Q2xpZW50UmVjdHMiLCAiZWxlbWVudElzVmlzaWJsZSIsICJnZXRQcm9wZXJ0eVZhbHVlIiwgImNsb3NlZERldGFpbHMiLCAiY2xvc2VzdCIsICJzdW1tYXJ5IiwgInBhcmVudE5vZGUiLCAiaXNEaXNhYmxlZCIsICJOb2RlIiwgIkVMRU1FTlRfTk9ERSIsICJjbGFzc0xpc3QiLCAiY29udGFpbnMiLCAiZGlzYWJsZWQiLCAiaGFzQXR0cmlidXRlIiwgImdldEF0dHJpYnV0ZSIsICJmaW5kU2hhZG93Um9vdCIsICJkb2N1bWVudEVsZW1lbnQiLCAiYXR0YWNoU2hhZG93IiwgImdldFJvb3ROb2RlIiwgInJvb3QiLCAiU2hhZG93Um9vdCIsICJub29wIiwgInJlZmxvdyIsICJvZmZzZXRIZWlnaHQiLCAiZ2V0alF1ZXJ5IiwgImpRdWVyeSIsICJib2R5IiwgIkRPTUNvbnRlbnRMb2FkZWRDYWxsYmFja3MiLCAib25ET01Db250ZW50TG9hZGVkIiwgImNhbGxiYWNrIiwgInJlYWR5U3RhdGUiLCAiYWRkRXZlbnRMaXN0ZW5lciIsICJwdXNoIiwgImlzUlRMIiwgImRpciIsICJkZWZpbmVKUXVlcnlQbHVnaW4iLCAicGx1Z2luIiwgIiQiLCAibmFtZSIsICJOQU1FIiwgIkpRVUVSWV9OT19DT05GTElDVCIsICJmbiIsICJqUXVlcnlJbnRlcmZhY2UiLCAiQ29uc3RydWN0b3IiLCAibm9Db25mbGljdCIsICJleGVjdXRlIiwgInBvc3NpYmxlQ2FsbGJhY2siLCAiYXJncyIsICJkZWZhdWx0VmFsdWUiLCAiZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbiIsICJ0cmFuc2l0aW9uRWxlbWVudCIsICJ3YWl0Rm9yVHJhbnNpdGlvbiIsICJkdXJhdGlvblBhZGRpbmciLCAiZW11bGF0ZWREdXJhdGlvbiIsICJjYWxsZWQiLCAiaGFuZGxlciIsICJ0YXJnZXQiLCAicmVtb3ZlRXZlbnRMaXN0ZW5lciIsICJzZXRUaW1lb3V0IiwgImdldE5leHRBY3RpdmVFbGVtZW50IiwgImxpc3QiLCAiYWN0aXZlRWxlbWVudCIsICJzaG91bGRHZXROZXh0IiwgImlzQ3ljbGVBbGxvd2VkIiwgImxpc3RMZW5ndGgiLCAiaW5kZXgiLCAiaW5kZXhPZiIsICJtYXgiLCAibWluIiwgImdldFNlbGVjdG9yIiwgImVsZW1lbnQiLCAic2VsZWN0b3IiLCAiZ2V0QXR0cmlidXRlIiwgImhyZWZBdHRyaWJ1dGUiLCAiaW5jbHVkZXMiLCAic3RhcnRzV2l0aCIsICJzcGxpdCIsICJ0cmltIiwgIm1hcCIsICJzZWwiLCAicGFyc2VTZWxlY3RvciIsICJqb2luIiwgIlNlbGVjdG9yRW5naW5lIiwgImZpbmQiLCAiZG9jdW1lbnQiLCAiZG9jdW1lbnRFbGVtZW50IiwgImNvbmNhdCIsICJFbGVtZW50IiwgInByb3RvdHlwZSIsICJxdWVyeVNlbGVjdG9yQWxsIiwgImNhbGwiLCAiZmluZE9uZSIsICJxdWVyeVNlbGVjdG9yIiwgImNoaWxkcmVuIiwgImZpbHRlciIsICJjaGlsZCIsICJtYXRjaGVzIiwgInBhcmVudHMiLCAiYW5jZXN0b3IiLCAicGFyZW50Tm9kZSIsICJjbG9zZXN0IiwgInB1c2giLCAicHJldiIsICJwcmV2aW91cyIsICJwcmV2aW91c0VsZW1lbnRTaWJsaW5nIiwgIm5leHQiLCAibmV4dEVsZW1lbnRTaWJsaW5nIiwgImZvY3VzYWJsZUNoaWxkcmVuIiwgImZvY3VzYWJsZXMiLCAiZWwiLCAiaXNEaXNhYmxlZCIsICJpc1Zpc2libGUiLCAiZ2V0U2VsZWN0b3JGcm9tRWxlbWVudCIsICJnZXRFbGVtZW50RnJvbVNlbGVjdG9yIiwgImdldE11bHRpcGxlRWxlbWVudHNGcm9tU2VsZWN0b3IiLCAiU0VMRUNUT1JfRklYRURfQ09OVEVOVCIsICJTRUxFQ1RPUl9TVElDS1lfQ09OVEVOVCIsICJQUk9QRVJUWV9QQURESU5HIiwgIlBST1BFUlRZX01BUkdJTiIsICJTY3JvbGxCYXJIZWxwZXIiLCAiY29uc3RydWN0b3IiLCAiX2VsZW1lbnQiLCAiZG9jdW1lbnQiLCAiYm9keSIsICJnZXRXaWR0aCIsICJkb2N1bWVudFdpZHRoIiwgImRvY3VtZW50RWxlbWVudCIsICJjbGllbnRXaWR0aCIsICJNYXRoIiwgImFicyIsICJ3aW5kb3ciLCAiaW5uZXJXaWR0aCIsICJoaWRlIiwgIndpZHRoIiwgIl9kaXNhYmxlT3ZlckZsb3ciLCAiX3NldEVsZW1lbnRBdHRyaWJ1dGVzIiwgImNhbGN1bGF0ZWRWYWx1ZSIsICJyZXNldCIsICJfcmVzZXRFbGVtZW50QXR0cmlidXRlcyIsICJpc092ZXJmbG93aW5nIiwgIl9zYXZlSW5pdGlhbEF0dHJpYnV0ZSIsICJzdHlsZSIsICJvdmVyZmxvdyIsICJzZWxlY3RvciIsICJzdHlsZVByb3BlcnR5IiwgImNhbGxiYWNrIiwgInNjcm9sbGJhcldpZHRoIiwgIm1hbmlwdWxhdGlvbkNhbGxCYWNrIiwgImVsZW1lbnQiLCAiZ2V0Q29tcHV0ZWRTdHlsZSIsICJnZXRQcm9wZXJ0eVZhbHVlIiwgInNldFByb3BlcnR5IiwgIk51bWJlciIsICJwYXJzZUZsb2F0IiwgIl9hcHBseU1hbmlwdWxhdGlvbkNhbGxiYWNrIiwgImFjdHVhbFZhbHVlIiwgIk1hbmlwdWxhdG9yIiwgInNldERhdGFBdHRyaWJ1dGUiLCAidmFsdWUiLCAiZ2V0RGF0YUF0dHJpYnV0ZSIsICJyZW1vdmVQcm9wZXJ0eSIsICJyZW1vdmVEYXRhQXR0cmlidXRlIiwgImNhbGxCYWNrIiwgImlzRWxlbWVudCIsICJzZWwiLCAiU2VsZWN0b3JFbmdpbmUiLCAiZmluZCJdCn0K
