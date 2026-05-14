var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

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

// public/theme/boost/js/esm/src/bootstrap/dom/event-handler.js
var require_event_handler = __commonJS({
  "public/theme/boost/js/esm/src/bootstrap/dom/event-handler.js"(exports, module) {
    "use strict";
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_util()) : typeof define === "function" && define.amd ? define(["../util/index"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.EventHandler = factory(global.Index));
    })(exports, (function(index_js) {
      "use strict";
      const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
      const stripNameRegex = /\..*/;
      const stripUidRegex = /::\d+$/;
      const eventRegistry = {};
      let uidEvent = 1;
      const customEvents = {
        mouseenter: "mouseover",
        mouseleave: "mouseout"
      };
      const nativeEvents = /* @__PURE__ */ new Set(["click", "dblclick", "mouseup", "mousedown", "contextmenu", "mousewheel", "DOMMouseScroll", "mouseover", "mouseout", "mousemove", "selectstart", "selectend", "keydown", "keypress", "keyup", "orientationchange", "touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "pointerleave", "pointercancel", "gesturestart", "gesturechange", "gestureend", "focus", "blur", "change", "reset", "select", "submit", "focusin", "focusout", "load", "unload", "beforeunload", "resize", "move", "DOMContentLoaded", "readystatechange", "error", "abort", "scroll"]);
      function makeEventUid(element, uid) {
        return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
      }
      __name(makeEventUid, "makeEventUid");
      function getElementEvents(element) {
        const uid = makeEventUid(element);
        element.uidEvent = uid;
        eventRegistry[uid] = eventRegistry[uid] || {};
        return eventRegistry[uid];
      }
      __name(getElementEvents, "getElementEvents");
      function bootstrapHandler(element, fn) {
        return /* @__PURE__ */ __name(function handler(event) {
          hydrateObj(event, {
            delegateTarget: element
          });
          if (handler.oneOff) {
            EventHandler.off(element, event.type, fn);
          }
          return fn.apply(element, [event]);
        }, "handler");
      }
      __name(bootstrapHandler, "bootstrapHandler");
      function bootstrapDelegationHandler(element, selector, fn) {
        return /* @__PURE__ */ __name(function handler(event) {
          const domElements = element.querySelectorAll(selector);
          for (let {
            target
          } = event; target && target !== this; target = target.parentNode) {
            for (const domElement of domElements) {
              if (domElement !== target) {
                continue;
              }
              hydrateObj(event, {
                delegateTarget: target
              });
              if (handler.oneOff) {
                EventHandler.off(element, event.type, selector, fn);
              }
              return fn.apply(target, [event]);
            }
          }
        }, "handler");
      }
      __name(bootstrapDelegationHandler, "bootstrapDelegationHandler");
      function findHandler(events, callable, delegationSelector = null) {
        return Object.values(events).find((event) => event.callable === callable && event.delegationSelector === delegationSelector);
      }
      __name(findHandler, "findHandler");
      function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
        const isDelegated = typeof handler === "string";
        const callable = isDelegated ? delegationFunction : handler || delegationFunction;
        let typeEvent = getTypeEvent(originalTypeEvent);
        if (!nativeEvents.has(typeEvent)) {
          typeEvent = originalTypeEvent;
        }
        return [isDelegated, callable, typeEvent];
      }
      __name(normalizeParameters, "normalizeParameters");
      function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
        if (typeof originalTypeEvent !== "string" || !element) {
          return;
        }
        let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
        if (originalTypeEvent in customEvents) {
          const wrapFunction = /* @__PURE__ */ __name((fn2) => {
            return function(event) {
              if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
                return fn2.call(this, event);
              }
            };
          }, "wrapFunction");
          callable = wrapFunction(callable);
        }
        const events = getElementEvents(element);
        const handlers = events[typeEvent] || (events[typeEvent] = {});
        const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
        if (previousFunction) {
          previousFunction.oneOff = previousFunction.oneOff && oneOff;
          return;
        }
        const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ""));
        const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
        fn.delegationSelector = isDelegated ? handler : null;
        fn.callable = callable;
        fn.oneOff = oneOff;
        fn.uidEvent = uid;
        handlers[uid] = fn;
        element.addEventListener(typeEvent, fn, isDelegated);
      }
      __name(addHandler, "addHandler");
      function removeHandler(element, events, typeEvent, handler, delegationSelector) {
        const fn = findHandler(events[typeEvent], handler, delegationSelector);
        if (!fn) {
          return;
        }
        element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
        delete events[typeEvent][fn.uidEvent];
      }
      __name(removeHandler, "removeHandler");
      function removeNamespacedHandlers(element, events, typeEvent, namespace) {
        const storeElementEvent = events[typeEvent] || {};
        for (const [handlerKey, event] of Object.entries(storeElementEvent)) {
          if (handlerKey.includes(namespace)) {
            removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
          }
        }
      }
      __name(removeNamespacedHandlers, "removeNamespacedHandlers");
      function getTypeEvent(event) {
        event = event.replace(stripNameRegex, "");
        return customEvents[event] || event;
      }
      __name(getTypeEvent, "getTypeEvent");
      const EventHandler = {
        on(element, event, handler, delegationFunction) {
          addHandler(element, event, handler, delegationFunction, false);
        },
        one(element, event, handler, delegationFunction) {
          addHandler(element, event, handler, delegationFunction, true);
        },
        off(element, originalTypeEvent, handler, delegationFunction) {
          if (typeof originalTypeEvent !== "string" || !element) {
            return;
          }
          const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
          const inNamespace = typeEvent !== originalTypeEvent;
          const events = getElementEvents(element);
          const storeElementEvent = events[typeEvent] || {};
          const isNamespace = originalTypeEvent.startsWith(".");
          if (typeof callable !== "undefined") {
            if (!Object.keys(storeElementEvent).length) {
              return;
            }
            removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
            return;
          }
          if (isNamespace) {
            for (const elementEvent of Object.keys(events)) {
              removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
            }
          }
          for (const [keyHandlers, event] of Object.entries(storeElementEvent)) {
            const handlerKey = keyHandlers.replace(stripUidRegex, "");
            if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
              removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
            }
          }
        },
        trigger(element, event, args) {
          if (typeof event !== "string" || !element) {
            return null;
          }
          const $ = index_js.getjQuery();
          const typeEvent = getTypeEvent(event);
          const inNamespace = event !== typeEvent;
          let jQueryEvent = null;
          let bubbles = true;
          let nativeDispatch = true;
          let defaultPrevented = false;
          if (inNamespace && $) {
            jQueryEvent = $.Event(event, args);
            $(element).trigger(jQueryEvent);
            bubbles = !jQueryEvent.isPropagationStopped();
            nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
            defaultPrevented = jQueryEvent.isDefaultPrevented();
          }
          const evt = hydrateObj(new Event(event, {
            bubbles,
            cancelable: true
          }), args);
          if (defaultPrevented) {
            evt.preventDefault();
          }
          if (nativeDispatch) {
            element.dispatchEvent(evt);
          }
          if (evt.defaultPrevented && jQueryEvent) {
            jQueryEvent.preventDefault();
          }
          return evt;
        }
      };
      function hydrateObj(obj, meta = {}) {
        for (const [key, value] of Object.entries(meta)) {
          try {
            obj[key] = value;
          } catch (_unused) {
            Object.defineProperty(obj, key, {
              configurable: true,
              get() {
                return value;
              }
            });
          }
        }
        return obj;
      }
      __name(hydrateObj, "hydrateObj");
      return EventHandler;
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

// public/theme/boost/js/esm/src/bootstrap/util/component-functions.js
var require_component_functions = __commonJS({
  "public/theme/boost/js/esm/src/bootstrap/util/component-functions.js"(exports, module) {
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require_event_handler(), require_selector_engine(), require_util()) : typeof define === "function" && define.amd ? define(["exports", "../dom/event-handler", "../dom/selector-engine", "./index"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.ComponentFunctions = {}, global.EventHandler, global.SelectorEngine, global.Index));
    })(exports, (function(exports2, EventHandler, SelectorEngine, index_js) {
      "use strict";
      const enableDismissTrigger = /* @__PURE__ */ __name((component, method = "hide") => {
        const clickEvent = `click.dismiss${component.EVENT_KEY}`;
        const name = component.NAME;
        EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function(event) {
          if (["A", "AREA"].includes(this.tagName)) {
            event.preventDefault();
          }
          if (index_js.isDisabled(this)) {
            return;
          }
          const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}`);
          const instance = component.getOrCreateInstance(target);
          instance[method]();
        });
      }, "enableDismissTrigger");
      exports2.enableDismissTrigger = enableDismissTrigger;
      Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    }));
  }
});
export default require_component_functions();
/*!
  * Bootstrap index.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
/*!
  * Bootstrap event-handler.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
/*!
  * Bootstrap selector-engine.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
/*!
  * Bootstrap component-functions.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL3NyYy91dGlsL2luZGV4LmpzIiwgIi4uLy4uLy4uL3NyYy9zcmMvZG9tL2V2ZW50LWhhbmRsZXIuanMiLCAiLi4vLi4vLi4vc3JjL3NyYy9kb20vc2VsZWN0b3ItZW5naW5lLmpzIiwgIi4uLy4uLy4uL3NyYy9zcmMvdXRpbC9jb21wb25lbnQtZnVuY3Rpb25zLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBCb290c3RyYXAgdXRpbC9pbmRleC5qc1xuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmNvbnN0IE1BWF9VSUQgPSAxXzAwMF8wMDBcbmNvbnN0IE1JTExJU0VDT05EU19NVUxUSVBMSUVSID0gMTAwMFxuY29uc3QgVFJBTlNJVElPTl9FTkQgPSAndHJhbnNpdGlvbmVuZCdcblxuLyoqXG4gKiBQcm9wZXJseSBlc2NhcGUgSURzIHNlbGVjdG9ycyB0byBoYW5kbGUgd2VpcmQgSURzXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmNvbnN0IHBhcnNlU2VsZWN0b3IgPSBzZWxlY3RvciA9PiB7XG4gIGlmIChzZWxlY3RvciAmJiB3aW5kb3cuQ1NTICYmIHdpbmRvdy5DU1MuZXNjYXBlKSB7XG4gICAgLy8gZG9jdW1lbnQucXVlcnlTZWxlY3RvciBuZWVkcyBlc2NhcGluZyB0byBoYW5kbGUgSURzIChodG1sNSspIGNvbnRhaW5pbmcgZm9yIGluc3RhbmNlIC9cbiAgICBzZWxlY3RvciA9IHNlbGVjdG9yLnJlcGxhY2UoLyMoW15cXHNcIiMnXSspL2csIChtYXRjaCwgaWQpID0+IGAjJHtDU1MuZXNjYXBlKGlkKX1gKVxuICB9XG5cbiAgcmV0dXJuIHNlbGVjdG9yXG59XG5cbi8vIFNob3V0LW91dCBBbmd1cyBDcm9sbCAoaHR0cHM6Ly9nb28uZ2wvcHh3UUdwKVxuY29uc3QgdG9UeXBlID0gb2JqZWN0ID0+IHtcbiAgaWYgKG9iamVjdCA9PT0gbnVsbCB8fCBvYmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBgJHtvYmplY3R9YFxuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpLm1hdGNoKC9cXHMoW2Etel0rKS9pKVsxXS50b0xvd2VyQ2FzZSgpXG59XG5cbi8qKlxuICogUHVibGljIFV0aWwgQVBJXG4gKi9cblxuY29uc3QgZ2V0VUlEID0gcHJlZml4ID0+IHtcbiAgZG8ge1xuICAgIHByZWZpeCArPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBNQVhfVUlEKVxuICB9IHdoaWxlIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcmVmaXgpKVxuXG4gIHJldHVybiBwcmVmaXhcbn1cblxuY29uc3QgZ2V0VHJhbnNpdGlvbkR1cmF0aW9uRnJvbUVsZW1lbnQgPSBlbGVtZW50ID0+IHtcbiAgaWYgKCFlbGVtZW50KSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuXG4gIC8vIEdldCB0cmFuc2l0aW9uLWR1cmF0aW9uIG9mIHRoZSBlbGVtZW50XG4gIGxldCB7IHRyYW5zaXRpb25EdXJhdGlvbiwgdHJhbnNpdGlvbkRlbGF5IH0gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KVxuXG4gIGNvbnN0IGZsb2F0VHJhbnNpdGlvbkR1cmF0aW9uID0gTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkR1cmF0aW9uKVxuICBjb25zdCBmbG9hdFRyYW5zaXRpb25EZWxheSA9IE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EZWxheSlcblxuICAvLyBSZXR1cm4gMCBpZiBlbGVtZW50IG9yIHRyYW5zaXRpb24gZHVyYXRpb24gaXMgbm90IGZvdW5kXG4gIGlmICghZmxvYXRUcmFuc2l0aW9uRHVyYXRpb24gJiYgIWZsb2F0VHJhbnNpdGlvbkRlbGF5KSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuXG4gIC8vIElmIG11bHRpcGxlIGR1cmF0aW9ucyBhcmUgZGVmaW5lZCwgdGFrZSB0aGUgZmlyc3RcbiAgdHJhbnNpdGlvbkR1cmF0aW9uID0gdHJhbnNpdGlvbkR1cmF0aW9uLnNwbGl0KCcsJylbMF1cbiAgdHJhbnNpdGlvbkRlbGF5ID0gdHJhbnNpdGlvbkRlbGF5LnNwbGl0KCcsJylbMF1cblxuICByZXR1cm4gKE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EdXJhdGlvbikgKyBOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRGVsYXkpKSAqIE1JTExJU0VDT05EU19NVUxUSVBMSUVSXG59XG5cbmNvbnN0IHRyaWdnZXJUcmFuc2l0aW9uRW5kID0gZWxlbWVudCA9PiB7XG4gIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoVFJBTlNJVElPTl9FTkQpKVxufVxuXG5jb25zdCBpc0VsZW1lbnQgPSBvYmplY3QgPT4ge1xuICBpZiAoIW9iamVjdCB8fCB0eXBlb2Ygb2JqZWN0ICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgaWYgKHR5cGVvZiBvYmplY3QuanF1ZXJ5ICE9PSAndW5kZWZpbmVkJykge1xuICAgIG9iamVjdCA9IG9iamVjdFswXVxuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiBvYmplY3Qubm9kZVR5cGUgIT09ICd1bmRlZmluZWQnXG59XG5cbmNvbnN0IGdldEVsZW1lbnQgPSBvYmplY3QgPT4ge1xuICAvLyBpdCdzIGEgalF1ZXJ5IG9iamVjdCBvciBhIG5vZGUgZWxlbWVudFxuICBpZiAoaXNFbGVtZW50KG9iamVjdCkpIHtcbiAgICByZXR1cm4gb2JqZWN0LmpxdWVyeSA/IG9iamVjdFswXSA6IG9iamVjdFxuICB9XG5cbiAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdzdHJpbmcnICYmIG9iamVjdC5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocGFyc2VTZWxlY3RvcihvYmplY3QpKVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cblxuY29uc3QgaXNWaXNpYmxlID0gZWxlbWVudCA9PiB7XG4gIGlmICghaXNFbGVtZW50KGVsZW1lbnQpIHx8IGVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGNvbnN0IGVsZW1lbnRJc1Zpc2libGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJ3Zpc2liaWxpdHknKSA9PT0gJ3Zpc2libGUnXG4gIC8vIEhhbmRsZSBgZGV0YWlsc2AgZWxlbWVudCBhcyBpdHMgY29udGVudCBtYXkgZmFsc2llIGFwcGVhciB2aXNpYmxlIHdoZW4gaXQgaXMgY2xvc2VkXG4gIGNvbnN0IGNsb3NlZERldGFpbHMgPSBlbGVtZW50LmNsb3Nlc3QoJ2RldGFpbHM6bm90KFtvcGVuXSknKVxuXG4gIGlmICghY2xvc2VkRGV0YWlscykge1xuICAgIHJldHVybiBlbGVtZW50SXNWaXNpYmxlXG4gIH1cblxuICBpZiAoY2xvc2VkRGV0YWlscyAhPT0gZWxlbWVudCkge1xuICAgIGNvbnN0IHN1bW1hcnkgPSBlbGVtZW50LmNsb3Nlc3QoJ3N1bW1hcnknKVxuICAgIGlmIChzdW1tYXJ5ICYmIHN1bW1hcnkucGFyZW50Tm9kZSAhPT0gY2xvc2VkRGV0YWlscykge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKHN1bW1hcnkgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50SXNWaXNpYmxlXG59XG5cbmNvbnN0IGlzRGlzYWJsZWQgPSBlbGVtZW50ID0+IHtcbiAgaWYgKCFlbGVtZW50IHx8IGVsZW1lbnQubm9kZVR5cGUgIT09IE5vZGUuRUxFTUVOVF9OT0RFKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnZGlzYWJsZWQnKSkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBpZiAodHlwZW9mIGVsZW1lbnQuZGlzYWJsZWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQuZGlzYWJsZWRcbiAgfVxuXG4gIHJldHVybiBlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSAmJiBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKSAhPT0gJ2ZhbHNlJ1xufVxuXG5jb25zdCBmaW5kU2hhZG93Um9vdCA9IGVsZW1lbnQgPT4ge1xuICBpZiAoIWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hdHRhY2hTaGFkb3cpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgLy8gQ2FuIGZpbmQgdGhlIHNoYWRvdyByb290IG90aGVyd2lzZSBpdCdsbCByZXR1cm4gdGhlIGRvY3VtZW50XG4gIGlmICh0eXBlb2YgZWxlbWVudC5nZXRSb290Tm9kZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNvbnN0IHJvb3QgPSBlbGVtZW50LmdldFJvb3ROb2RlKClcbiAgICByZXR1cm4gcm9vdCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QgPyByb290IDogbnVsbFxuICB9XG5cbiAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBTaGFkb3dSb290KSB7XG4gICAgcmV0dXJuIGVsZW1lbnRcbiAgfVxuXG4gIC8vIHdoZW4gd2UgZG9uJ3QgZmluZCBhIHNoYWRvdyByb290XG4gIGlmICghZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIHJldHVybiBmaW5kU2hhZG93Um9vdChlbGVtZW50LnBhcmVudE5vZGUpXG59XG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7fVxuXG4vKipcbiAqIFRyaWNrIHRvIHJlc3RhcnQgYW4gZWxlbWVudCdzIGFuaW1hdGlvblxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEByZXR1cm4gdm9pZFxuICpcbiAqIEBzZWUgaHR0cHM6Ly93d3cuaGFycnl0aGVvLmNvbS9ibG9nLzIwMjEvMDIvcmVzdGFydC1hLWNzcy1hbmltYXRpb24td2l0aC1qYXZhc2NyaXB0LyNyZXN0YXJ0aW5nLWEtY3NzLWFuaW1hdGlvblxuICovXG5jb25zdCByZWZsb3cgPSBlbGVtZW50ID0+IHtcbiAgZWxlbWVudC5vZmZzZXRIZWlnaHQgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcbn1cblxuY29uc3QgZ2V0alF1ZXJ5ID0gKCkgPT4ge1xuICBpZiAod2luZG93LmpRdWVyeSAmJiAhZG9jdW1lbnQuYm9keS5oYXNBdHRyaWJ1dGUoJ2RhdGEtYnMtbm8tanF1ZXJ5JykpIHtcbiAgICByZXR1cm4gd2luZG93LmpRdWVyeVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cblxuY29uc3QgRE9NQ29udGVudExvYWRlZENhbGxiYWNrcyA9IFtdXG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZCA9IGNhbGxiYWNrID0+IHtcbiAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdsb2FkaW5nJykge1xuICAgIC8vIGFkZCBsaXN0ZW5lciBvbiB0aGUgZmlyc3QgY2FsbCB3aGVuIHRoZSBkb2N1bWVudCBpcyBpbiBsb2FkaW5nIHN0YXRlXG4gICAgaWYgKCFET01Db250ZW50TG9hZGVkQ2FsbGJhY2tzLmxlbmd0aCkge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBjYWxsYmFjayBvZiBET01Db250ZW50TG9hZGVkQ2FsbGJhY2tzKSB7XG4gICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIERPTUNvbnRlbnRMb2FkZWRDYWxsYmFja3MucHVzaChjYWxsYmFjaylcbiAgfSBlbHNlIHtcbiAgICBjYWxsYmFjaygpXG4gIH1cbn1cblxuY29uc3QgaXNSVEwgPSAoKSA9PiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZGlyID09PSAncnRsJ1xuXG5jb25zdCBkZWZpbmVKUXVlcnlQbHVnaW4gPSBwbHVnaW4gPT4ge1xuICBvbkRPTUNvbnRlbnRMb2FkZWQoKCkgPT4ge1xuICAgIGNvbnN0ICQgPSBnZXRqUXVlcnkoKVxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICgkKSB7XG4gICAgICBjb25zdCBuYW1lID0gcGx1Z2luLk5BTUVcbiAgICAgIGNvbnN0IEpRVUVSWV9OT19DT05GTElDVCA9ICQuZm5bbmFtZV1cbiAgICAgICQuZm5bbmFtZV0gPSBwbHVnaW4ualF1ZXJ5SW50ZXJmYWNlXG4gICAgICAkLmZuW25hbWVdLkNvbnN0cnVjdG9yID0gcGx1Z2luXG4gICAgICAkLmZuW25hbWVdLm5vQ29uZmxpY3QgPSAoKSA9PiB7XG4gICAgICAgICQuZm5bbmFtZV0gPSBKUVVFUllfTk9fQ09ORkxJQ1RcbiAgICAgICAgcmV0dXJuIHBsdWdpbi5qUXVlcnlJbnRlcmZhY2VcbiAgICAgIH1cbiAgICB9XG4gIH0pXG59XG5cbmNvbnN0IGV4ZWN1dGUgPSAocG9zc2libGVDYWxsYmFjaywgYXJncyA9IFtdLCBkZWZhdWx0VmFsdWUgPSBwb3NzaWJsZUNhbGxiYWNrKSA9PiB7XG4gIHJldHVybiB0eXBlb2YgcG9zc2libGVDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyA/IHBvc3NpYmxlQ2FsbGJhY2suY2FsbCguLi5hcmdzKSA6IGRlZmF1bHRWYWx1ZVxufVxuXG5jb25zdCBleGVjdXRlQWZ0ZXJUcmFuc2l0aW9uID0gKGNhbGxiYWNrLCB0cmFuc2l0aW9uRWxlbWVudCwgd2FpdEZvclRyYW5zaXRpb24gPSB0cnVlKSA9PiB7XG4gIGlmICghd2FpdEZvclRyYW5zaXRpb24pIHtcbiAgICBleGVjdXRlKGNhbGxiYWNrKVxuICAgIHJldHVyblxuICB9XG5cbiAgY29uc3QgZHVyYXRpb25QYWRkaW5nID0gNVxuICBjb25zdCBlbXVsYXRlZER1cmF0aW9uID0gZ2V0VHJhbnNpdGlvbkR1cmF0aW9uRnJvbUVsZW1lbnQodHJhbnNpdGlvbkVsZW1lbnQpICsgZHVyYXRpb25QYWRkaW5nXG5cbiAgbGV0IGNhbGxlZCA9IGZhbHNlXG5cbiAgY29uc3QgaGFuZGxlciA9ICh7IHRhcmdldCB9KSA9PiB7XG4gICAgaWYgKHRhcmdldCAhPT0gdHJhbnNpdGlvbkVsZW1lbnQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNhbGxlZCA9IHRydWVcbiAgICB0cmFuc2l0aW9uRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFRSQU5TSVRJT05fRU5ELCBoYW5kbGVyKVxuICAgIGV4ZWN1dGUoY2FsbGJhY2spXG4gIH1cblxuICB0cmFuc2l0aW9uRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFRSQU5TSVRJT05fRU5ELCBoYW5kbGVyKVxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBpZiAoIWNhbGxlZCkge1xuICAgICAgdHJpZ2dlclRyYW5zaXRpb25FbmQodHJhbnNpdGlvbkVsZW1lbnQpXG4gICAgfVxuICB9LCBlbXVsYXRlZER1cmF0aW9uKVxufVxuXG4vKipcbiAqIFJldHVybiB0aGUgcHJldmlvdXMvbmV4dCBlbGVtZW50IG9mIGEgbGlzdC5cbiAqXG4gKiBAcGFyYW0ge2FycmF5fSBsaXN0ICAgIFRoZSBsaXN0IG9mIGVsZW1lbnRzXG4gKiBAcGFyYW0gYWN0aXZlRWxlbWVudCAgIFRoZSBhY3RpdmUgZWxlbWVudFxuICogQHBhcmFtIHNob3VsZEdldE5leHQgICBDaG9vc2UgdG8gZ2V0IG5leHQgb3IgcHJldmlvdXMgZWxlbWVudFxuICogQHBhcmFtIGlzQ3ljbGVBbGxvd2VkXG4gKiBAcmV0dXJuIHtFbGVtZW50fGVsZW19IFRoZSBwcm9wZXIgZWxlbWVudFxuICovXG5jb25zdCBnZXROZXh0QWN0aXZlRWxlbWVudCA9IChsaXN0LCBhY3RpdmVFbGVtZW50LCBzaG91bGRHZXROZXh0LCBpc0N5Y2xlQWxsb3dlZCkgPT4ge1xuICBjb25zdCBsaXN0TGVuZ3RoID0gbGlzdC5sZW5ndGhcbiAgbGV0IGluZGV4ID0gbGlzdC5pbmRleE9mKGFjdGl2ZUVsZW1lbnQpXG5cbiAgLy8gaWYgdGhlIGVsZW1lbnQgZG9lcyBub3QgZXhpc3QgaW4gdGhlIGxpc3QgcmV0dXJuIGFuIGVsZW1lbnRcbiAgLy8gZGVwZW5kaW5nIG9uIHRoZSBkaXJlY3Rpb24gYW5kIGlmIGN5Y2xlIGlzIGFsbG93ZWRcbiAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgIHJldHVybiAhc2hvdWxkR2V0TmV4dCAmJiBpc0N5Y2xlQWxsb3dlZCA/IGxpc3RbbGlzdExlbmd0aCAtIDFdIDogbGlzdFswXVxuICB9XG5cbiAgaW5kZXggKz0gc2hvdWxkR2V0TmV4dCA/IDEgOiAtMVxuXG4gIGlmIChpc0N5Y2xlQWxsb3dlZCkge1xuICAgIGluZGV4ID0gKGluZGV4ICsgbGlzdExlbmd0aCkgJSBsaXN0TGVuZ3RoXG4gIH1cblxuICByZXR1cm4gbGlzdFtNYXRoLm1heCgwLCBNYXRoLm1pbihpbmRleCwgbGlzdExlbmd0aCAtIDEpKV1cbn1cblxuZXhwb3J0IHtcbiAgZGVmaW5lSlF1ZXJ5UGx1Z2luLFxuICBleGVjdXRlLFxuICBleGVjdXRlQWZ0ZXJUcmFuc2l0aW9uLFxuICBmaW5kU2hhZG93Um9vdCxcbiAgZ2V0RWxlbWVudCxcbiAgZ2V0alF1ZXJ5LFxuICBnZXROZXh0QWN0aXZlRWxlbWVudCxcbiAgZ2V0VHJhbnNpdGlvbkR1cmF0aW9uRnJvbUVsZW1lbnQsXG4gIGdldFVJRCxcbiAgaXNEaXNhYmxlZCxcbiAgaXNFbGVtZW50LFxuICBpc1JUTCxcbiAgaXNWaXNpYmxlLFxuICBub29wLFxuICBvbkRPTUNvbnRlbnRMb2FkZWQsXG4gIHBhcnNlU2VsZWN0b3IsXG4gIHJlZmxvdyxcbiAgdHJpZ2dlclRyYW5zaXRpb25FbmQsXG4gIHRvVHlwZVxufVxuIiwgIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEJvb3RzdHJhcCBkb20vZXZlbnQtaGFuZGxlci5qc1xuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmltcG9ydCB7IGdldGpRdWVyeSB9IGZyb20gJy4uL3V0aWwvaW5kZXguanMnXG5cbi8qKlxuICogQ29uc3RhbnRzXG4gKi9cblxuY29uc3QgbmFtZXNwYWNlUmVnZXggPSAvW14uXSooPz1cXC4uKilcXC58LiovXG5jb25zdCBzdHJpcE5hbWVSZWdleCA9IC9cXC4uKi9cbmNvbnN0IHN0cmlwVWlkUmVnZXggPSAvOjpcXGQrJC9cbmNvbnN0IGV2ZW50UmVnaXN0cnkgPSB7fSAvLyBFdmVudHMgc3RvcmFnZVxubGV0IHVpZEV2ZW50ID0gMVxuY29uc3QgY3VzdG9tRXZlbnRzID0ge1xuICBtb3VzZWVudGVyOiAnbW91c2VvdmVyJyxcbiAgbW91c2VsZWF2ZTogJ21vdXNlb3V0J1xufVxuXG5jb25zdCBuYXRpdmVFdmVudHMgPSBuZXcgU2V0KFtcbiAgJ2NsaWNrJyxcbiAgJ2RibGNsaWNrJyxcbiAgJ21vdXNldXAnLFxuICAnbW91c2Vkb3duJyxcbiAgJ2NvbnRleHRtZW51JyxcbiAgJ21vdXNld2hlZWwnLFxuICAnRE9NTW91c2VTY3JvbGwnLFxuICAnbW91c2VvdmVyJyxcbiAgJ21vdXNlb3V0JyxcbiAgJ21vdXNlbW92ZScsXG4gICdzZWxlY3RzdGFydCcsXG4gICdzZWxlY3RlbmQnLFxuICAna2V5ZG93bicsXG4gICdrZXlwcmVzcycsXG4gICdrZXl1cCcsXG4gICdvcmllbnRhdGlvbmNoYW5nZScsXG4gICd0b3VjaHN0YXJ0JyxcbiAgJ3RvdWNobW92ZScsXG4gICd0b3VjaGVuZCcsXG4gICd0b3VjaGNhbmNlbCcsXG4gICdwb2ludGVyZG93bicsXG4gICdwb2ludGVybW92ZScsXG4gICdwb2ludGVydXAnLFxuICAncG9pbnRlcmxlYXZlJyxcbiAgJ3BvaW50ZXJjYW5jZWwnLFxuICAnZ2VzdHVyZXN0YXJ0JyxcbiAgJ2dlc3R1cmVjaGFuZ2UnLFxuICAnZ2VzdHVyZWVuZCcsXG4gICdmb2N1cycsXG4gICdibHVyJyxcbiAgJ2NoYW5nZScsXG4gICdyZXNldCcsXG4gICdzZWxlY3QnLFxuICAnc3VibWl0JyxcbiAgJ2ZvY3VzaW4nLFxuICAnZm9jdXNvdXQnLFxuICAnbG9hZCcsXG4gICd1bmxvYWQnLFxuICAnYmVmb3JldW5sb2FkJyxcbiAgJ3Jlc2l6ZScsXG4gICdtb3ZlJyxcbiAgJ0RPTUNvbnRlbnRMb2FkZWQnLFxuICAncmVhZHlzdGF0ZWNoYW5nZScsXG4gICdlcnJvcicsXG4gICdhYm9ydCcsXG4gICdzY3JvbGwnXG5dKVxuXG4vKipcbiAqIFByaXZhdGUgbWV0aG9kc1xuICovXG5cbmZ1bmN0aW9uIG1ha2VFdmVudFVpZChlbGVtZW50LCB1aWQpIHtcbiAgcmV0dXJuICh1aWQgJiYgYCR7dWlkfTo6JHt1aWRFdmVudCsrfWApIHx8IGVsZW1lbnQudWlkRXZlbnQgfHwgdWlkRXZlbnQrK1xufVxuXG5mdW5jdGlvbiBnZXRFbGVtZW50RXZlbnRzKGVsZW1lbnQpIHtcbiAgY29uc3QgdWlkID0gbWFrZUV2ZW50VWlkKGVsZW1lbnQpXG5cbiAgZWxlbWVudC51aWRFdmVudCA9IHVpZFxuICBldmVudFJlZ2lzdHJ5W3VpZF0gPSBldmVudFJlZ2lzdHJ5W3VpZF0gfHwge31cblxuICByZXR1cm4gZXZlbnRSZWdpc3RyeVt1aWRdXG59XG5cbmZ1bmN0aW9uIGJvb3RzdHJhcEhhbmRsZXIoZWxlbWVudCwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQpIHtcbiAgICBoeWRyYXRlT2JqKGV2ZW50LCB7IGRlbGVnYXRlVGFyZ2V0OiBlbGVtZW50IH0pXG5cbiAgICBpZiAoaGFuZGxlci5vbmVPZmYpIHtcbiAgICAgIEV2ZW50SGFuZGxlci5vZmYoZWxlbWVudCwgZXZlbnQudHlwZSwgZm4pXG4gICAgfVxuXG4gICAgcmV0dXJuIGZuLmFwcGx5KGVsZW1lbnQsIFtldmVudF0pXG4gIH1cbn1cblxuZnVuY3Rpb24gYm9vdHN0cmFwRGVsZWdhdGlvbkhhbmRsZXIoZWxlbWVudCwgc2VsZWN0b3IsIGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50KSB7XG4gICAgY29uc3QgZG9tRWxlbWVudHMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXG5cbiAgICBmb3IgKGxldCB7IHRhcmdldCB9ID0gZXZlbnQ7IHRhcmdldCAmJiB0YXJnZXQgIT09IHRoaXM7IHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlKSB7XG4gICAgICBmb3IgKGNvbnN0IGRvbUVsZW1lbnQgb2YgZG9tRWxlbWVudHMpIHtcbiAgICAgICAgaWYgKGRvbUVsZW1lbnQgIT09IHRhcmdldCkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICBoeWRyYXRlT2JqKGV2ZW50LCB7IGRlbGVnYXRlVGFyZ2V0OiB0YXJnZXQgfSlcblxuICAgICAgICBpZiAoaGFuZGxlci5vbmVPZmYpIHtcbiAgICAgICAgICBFdmVudEhhbmRsZXIub2ZmKGVsZW1lbnQsIGV2ZW50LnR5cGUsIHNlbGVjdG9yLCBmbilcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmbi5hcHBseSh0YXJnZXQsIFtldmVudF0pXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGZpbmRIYW5kbGVyKGV2ZW50cywgY2FsbGFibGUsIGRlbGVnYXRpb25TZWxlY3RvciA9IG51bGwpIHtcbiAgcmV0dXJuIE9iamVjdC52YWx1ZXMoZXZlbnRzKVxuICAgIC5maW5kKGV2ZW50ID0+IGV2ZW50LmNhbGxhYmxlID09PSBjYWxsYWJsZSAmJiBldmVudC5kZWxlZ2F0aW9uU2VsZWN0b3IgPT09IGRlbGVnYXRpb25TZWxlY3Rvcilcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplUGFyYW1ldGVycyhvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKSB7XG4gIGNvbnN0IGlzRGVsZWdhdGVkID0gdHlwZW9mIGhhbmRsZXIgPT09ICdzdHJpbmcnXG4gIC8vIFRPRE86IHRvb2x0aXAgcGFzc2VzIGBmYWxzZWAgaW5zdGVhZCBvZiBzZWxlY3Rvciwgc28gd2UgbmVlZCB0byBjaGVja1xuICBjb25zdCBjYWxsYWJsZSA9IGlzRGVsZWdhdGVkID8gZGVsZWdhdGlvbkZ1bmN0aW9uIDogKGhhbmRsZXIgfHwgZGVsZWdhdGlvbkZ1bmN0aW9uKVxuICBsZXQgdHlwZUV2ZW50ID0gZ2V0VHlwZUV2ZW50KG9yaWdpbmFsVHlwZUV2ZW50KVxuXG4gIGlmICghbmF0aXZlRXZlbnRzLmhhcyh0eXBlRXZlbnQpKSB7XG4gICAgdHlwZUV2ZW50ID0gb3JpZ2luYWxUeXBlRXZlbnRcbiAgfVxuXG4gIHJldHVybiBbaXNEZWxlZ2F0ZWQsIGNhbGxhYmxlLCB0eXBlRXZlbnRdXG59XG5cbmZ1bmN0aW9uIGFkZEhhbmRsZXIoZWxlbWVudCwgb3JpZ2luYWxUeXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbiwgb25lT2ZmKSB7XG4gIGlmICh0eXBlb2Ygb3JpZ2luYWxUeXBlRXZlbnQgIT09ICdzdHJpbmcnIHx8ICFlbGVtZW50KSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICBsZXQgW2lzRGVsZWdhdGVkLCBjYWxsYWJsZSwgdHlwZUV2ZW50XSA9IG5vcm1hbGl6ZVBhcmFtZXRlcnMob3JpZ2luYWxUeXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbilcblxuICAvLyBpbiBjYXNlIG9mIG1vdXNlZW50ZXIgb3IgbW91c2VsZWF2ZSB3cmFwIHRoZSBoYW5kbGVyIHdpdGhpbiBhIGZ1bmN0aW9uIHRoYXQgY2hlY2tzIGZvciBpdHMgRE9NIHBvc2l0aW9uXG4gIC8vIHRoaXMgcHJldmVudHMgdGhlIGhhbmRsZXIgZnJvbSBiZWluZyBkaXNwYXRjaGVkIHRoZSBzYW1lIHdheSBhcyBtb3VzZW92ZXIgb3IgbW91c2VvdXQgZG9lc1xuICBpZiAob3JpZ2luYWxUeXBlRXZlbnQgaW4gY3VzdG9tRXZlbnRzKSB7XG4gICAgY29uc3Qgd3JhcEZ1bmN0aW9uID0gZm4gPT4ge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAoIWV2ZW50LnJlbGF0ZWRUYXJnZXQgfHwgKGV2ZW50LnJlbGF0ZWRUYXJnZXQgIT09IGV2ZW50LmRlbGVnYXRlVGFyZ2V0ICYmICFldmVudC5kZWxlZ2F0ZVRhcmdldC5jb250YWlucyhldmVudC5yZWxhdGVkVGFyZ2V0KSkpIHtcbiAgICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNhbGxhYmxlID0gd3JhcEZ1bmN0aW9uKGNhbGxhYmxlKVxuICB9XG5cbiAgY29uc3QgZXZlbnRzID0gZ2V0RWxlbWVudEV2ZW50cyhlbGVtZW50KVxuICBjb25zdCBoYW5kbGVycyA9IGV2ZW50c1t0eXBlRXZlbnRdIHx8IChldmVudHNbdHlwZUV2ZW50XSA9IHt9KVxuICBjb25zdCBwcmV2aW91c0Z1bmN0aW9uID0gZmluZEhhbmRsZXIoaGFuZGxlcnMsIGNhbGxhYmxlLCBpc0RlbGVnYXRlZCA/IGhhbmRsZXIgOiBudWxsKVxuXG4gIGlmIChwcmV2aW91c0Z1bmN0aW9uKSB7XG4gICAgcHJldmlvdXNGdW5jdGlvbi5vbmVPZmYgPSBwcmV2aW91c0Z1bmN0aW9uLm9uZU9mZiAmJiBvbmVPZmZcblxuICAgIHJldHVyblxuICB9XG5cbiAgY29uc3QgdWlkID0gbWFrZUV2ZW50VWlkKGNhbGxhYmxlLCBvcmlnaW5hbFR5cGVFdmVudC5yZXBsYWNlKG5hbWVzcGFjZVJlZ2V4LCAnJykpXG4gIGNvbnN0IGZuID0gaXNEZWxlZ2F0ZWQgP1xuICAgIGJvb3RzdHJhcERlbGVnYXRpb25IYW5kbGVyKGVsZW1lbnQsIGhhbmRsZXIsIGNhbGxhYmxlKSA6XG4gICAgYm9vdHN0cmFwSGFuZGxlcihlbGVtZW50LCBjYWxsYWJsZSlcblxuICBmbi5kZWxlZ2F0aW9uU2VsZWN0b3IgPSBpc0RlbGVnYXRlZCA/IGhhbmRsZXIgOiBudWxsXG4gIGZuLmNhbGxhYmxlID0gY2FsbGFibGVcbiAgZm4ub25lT2ZmID0gb25lT2ZmXG4gIGZuLnVpZEV2ZW50ID0gdWlkXG4gIGhhbmRsZXJzW3VpZF0gPSBmblxuXG4gIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlRXZlbnQsIGZuLCBpc0RlbGVnYXRlZClcbn1cblxuZnVuY3Rpb24gcmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvblNlbGVjdG9yKSB7XG4gIGNvbnN0IGZuID0gZmluZEhhbmRsZXIoZXZlbnRzW3R5cGVFdmVudF0sIGhhbmRsZXIsIGRlbGVnYXRpb25TZWxlY3RvcilcblxuICBpZiAoIWZuKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZUV2ZW50LCBmbiwgQm9vbGVhbihkZWxlZ2F0aW9uU2VsZWN0b3IpKVxuICBkZWxldGUgZXZlbnRzW3R5cGVFdmVudF1bZm4udWlkRXZlbnRdXG59XG5cbmZ1bmN0aW9uIHJlbW92ZU5hbWVzcGFjZWRIYW5kbGVycyhlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgbmFtZXNwYWNlKSB7XG4gIGNvbnN0IHN0b3JlRWxlbWVudEV2ZW50ID0gZXZlbnRzW3R5cGVFdmVudF0gfHwge31cblxuICBmb3IgKGNvbnN0IFtoYW5kbGVyS2V5LCBldmVudF0gb2YgT2JqZWN0LmVudHJpZXMoc3RvcmVFbGVtZW50RXZlbnQpKSB7XG4gICAgaWYgKGhhbmRsZXJLZXkuaW5jbHVkZXMobmFtZXNwYWNlKSkge1xuICAgICAgcmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgZXZlbnQuY2FsbGFibGUsIGV2ZW50LmRlbGVnYXRpb25TZWxlY3RvcilcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VHlwZUV2ZW50KGV2ZW50KSB7XG4gIC8vIGFsbG93IHRvIGdldCB0aGUgbmF0aXZlIGV2ZW50cyBmcm9tIG5hbWVzcGFjZWQgZXZlbnRzICgnY2xpY2suYnMuYnV0dG9uJyAtLT4gJ2NsaWNrJylcbiAgZXZlbnQgPSBldmVudC5yZXBsYWNlKHN0cmlwTmFtZVJlZ2V4LCAnJylcbiAgcmV0dXJuIGN1c3RvbUV2ZW50c1tldmVudF0gfHwgZXZlbnRcbn1cblxuY29uc3QgRXZlbnRIYW5kbGVyID0ge1xuICBvbihlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKSB7XG4gICAgYWRkSGFuZGxlcihlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uLCBmYWxzZSlcbiAgfSxcblxuICBvbmUoZWxlbWVudCwgZXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbikge1xuICAgIGFkZEhhbmRsZXIoZWxlbWVudCwgZXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbiwgdHJ1ZSlcbiAgfSxcblxuICBvZmYoZWxlbWVudCwgb3JpZ2luYWxUeXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbikge1xuICAgIGlmICh0eXBlb2Ygb3JpZ2luYWxUeXBlRXZlbnQgIT09ICdzdHJpbmcnIHx8ICFlbGVtZW50KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBbaXNEZWxlZ2F0ZWQsIGNhbGxhYmxlLCB0eXBlRXZlbnRdID0gbm9ybWFsaXplUGFyYW1ldGVycyhvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKVxuICAgIGNvbnN0IGluTmFtZXNwYWNlID0gdHlwZUV2ZW50ICE9PSBvcmlnaW5hbFR5cGVFdmVudFxuICAgIGNvbnN0IGV2ZW50cyA9IGdldEVsZW1lbnRFdmVudHMoZWxlbWVudClcbiAgICBjb25zdCBzdG9yZUVsZW1lbnRFdmVudCA9IGV2ZW50c1t0eXBlRXZlbnRdIHx8IHt9XG4gICAgY29uc3QgaXNOYW1lc3BhY2UgPSBvcmlnaW5hbFR5cGVFdmVudC5zdGFydHNXaXRoKCcuJylcblxuICAgIGlmICh0eXBlb2YgY2FsbGFibGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAvLyBTaW1wbGVzdCBjYXNlOiBoYW5kbGVyIGlzIHBhc3NlZCwgcmVtb3ZlIHRoYXQgbGlzdGVuZXIgT05MWS5cbiAgICAgIGlmICghT2JqZWN0LmtleXMoc3RvcmVFbGVtZW50RXZlbnQpLmxlbmd0aCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgcmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgY2FsbGFibGUsIGlzRGVsZWdhdGVkID8gaGFuZGxlciA6IG51bGwpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoaXNOYW1lc3BhY2UpIHtcbiAgICAgIGZvciAoY29uc3QgZWxlbWVudEV2ZW50IG9mIE9iamVjdC5rZXlzKGV2ZW50cykpIHtcbiAgICAgICAgcmVtb3ZlTmFtZXNwYWNlZEhhbmRsZXJzKGVsZW1lbnQsIGV2ZW50cywgZWxlbWVudEV2ZW50LCBvcmlnaW5hbFR5cGVFdmVudC5zbGljZSgxKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IFtrZXlIYW5kbGVycywgZXZlbnRdIG9mIE9iamVjdC5lbnRyaWVzKHN0b3JlRWxlbWVudEV2ZW50KSkge1xuICAgICAgY29uc3QgaGFuZGxlcktleSA9IGtleUhhbmRsZXJzLnJlcGxhY2Uoc3RyaXBVaWRSZWdleCwgJycpXG5cbiAgICAgIGlmICghaW5OYW1lc3BhY2UgfHwgb3JpZ2luYWxUeXBlRXZlbnQuaW5jbHVkZXMoaGFuZGxlcktleSkpIHtcbiAgICAgICAgcmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgZXZlbnQuY2FsbGFibGUsIGV2ZW50LmRlbGVnYXRpb25TZWxlY3RvcilcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgdHJpZ2dlcihlbGVtZW50LCBldmVudCwgYXJncykge1xuICAgIGlmICh0eXBlb2YgZXZlbnQgIT09ICdzdHJpbmcnIHx8ICFlbGVtZW50KSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGNvbnN0ICQgPSBnZXRqUXVlcnkoKVxuICAgIGNvbnN0IHR5cGVFdmVudCA9IGdldFR5cGVFdmVudChldmVudClcbiAgICBjb25zdCBpbk5hbWVzcGFjZSA9IGV2ZW50ICE9PSB0eXBlRXZlbnRcblxuICAgIGxldCBqUXVlcnlFdmVudCA9IG51bGxcbiAgICBsZXQgYnViYmxlcyA9IHRydWVcbiAgICBsZXQgbmF0aXZlRGlzcGF0Y2ggPSB0cnVlXG4gICAgbGV0IGRlZmF1bHRQcmV2ZW50ZWQgPSBmYWxzZVxuXG4gICAgaWYgKGluTmFtZXNwYWNlICYmICQpIHtcbiAgICAgIGpRdWVyeUV2ZW50ID0gJC5FdmVudChldmVudCwgYXJncylcblxuICAgICAgJChlbGVtZW50KS50cmlnZ2VyKGpRdWVyeUV2ZW50KVxuICAgICAgYnViYmxlcyA9ICFqUXVlcnlFdmVudC5pc1Byb3BhZ2F0aW9uU3RvcHBlZCgpXG4gICAgICBuYXRpdmVEaXNwYXRjaCA9ICFqUXVlcnlFdmVudC5pc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCgpXG4gICAgICBkZWZhdWx0UHJldmVudGVkID0galF1ZXJ5RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKClcbiAgICB9XG5cbiAgICBjb25zdCBldnQgPSBoeWRyYXRlT2JqKG5ldyBFdmVudChldmVudCwgeyBidWJibGVzLCBjYW5jZWxhYmxlOiB0cnVlIH0pLCBhcmdzKVxuXG4gICAgaWYgKGRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfVxuXG4gICAgaWYgKG5hdGl2ZURpc3BhdGNoKSB7XG4gICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZ0KVxuICAgIH1cblxuICAgIGlmIChldnQuZGVmYXVsdFByZXZlbnRlZCAmJiBqUXVlcnlFdmVudCkge1xuICAgICAgalF1ZXJ5RXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIH1cblxuICAgIHJldHVybiBldnRcbiAgfVxufVxuXG5mdW5jdGlvbiBoeWRyYXRlT2JqKG9iaiwgbWV0YSA9IHt9KSB7XG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG1ldGEpKSB7XG4gICAgdHJ5IHtcbiAgICAgIG9ialtrZXldID0gdmFsdWVcbiAgICB9IGNhdGNoIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWVcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqXG59XG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50SGFuZGxlclxuIiwgIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEJvb3RzdHJhcCBkb20vc2VsZWN0b3ItZW5naW5lLmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuaW1wb3J0IHsgaXNEaXNhYmxlZCwgaXNWaXNpYmxlLCBwYXJzZVNlbGVjdG9yIH0gZnJvbSAnLi4vdXRpbC9pbmRleC5qcydcblxuY29uc3QgZ2V0U2VsZWN0b3IgPSBlbGVtZW50ID0+IHtcbiAgbGV0IHNlbGVjdG9yID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYnMtdGFyZ2V0JylcblxuICBpZiAoIXNlbGVjdG9yIHx8IHNlbGVjdG9yID09PSAnIycpIHtcbiAgICBsZXQgaHJlZkF0dHJpYnV0ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJylcblxuICAgIC8vIFRoZSBvbmx5IHZhbGlkIGNvbnRlbnQgdGhhdCBjb3VsZCBkb3VibGUgYXMgYSBzZWxlY3RvciBhcmUgSURzIG9yIGNsYXNzZXMsXG4gICAgLy8gc28gZXZlcnl0aGluZyBzdGFydGluZyB3aXRoIGAjYCBvciBgLmAuIElmIGEgXCJyZWFsXCIgVVJMIGlzIHVzZWQgYXMgdGhlIHNlbGVjdG9yLFxuICAgIC8vIGBkb2N1bWVudC5xdWVyeVNlbGVjdG9yYCB3aWxsIHJpZ2h0ZnVsbHkgY29tcGxhaW4gaXQgaXMgaW52YWxpZC5cbiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2lzc3Vlcy8zMjI3M1xuICAgIGlmICghaHJlZkF0dHJpYnV0ZSB8fCAoIWhyZWZBdHRyaWJ1dGUuaW5jbHVkZXMoJyMnKSAmJiAhaHJlZkF0dHJpYnV0ZS5zdGFydHNXaXRoKCcuJykpKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIC8vIEp1c3QgaW4gY2FzZSBzb21lIENNUyBwdXRzIG91dCBhIGZ1bGwgVVJMIHdpdGggdGhlIGFuY2hvciBhcHBlbmRlZFxuICAgIGlmIChocmVmQXR0cmlidXRlLmluY2x1ZGVzKCcjJykgJiYgIWhyZWZBdHRyaWJ1dGUuc3RhcnRzV2l0aCgnIycpKSB7XG4gICAgICBocmVmQXR0cmlidXRlID0gYCMke2hyZWZBdHRyaWJ1dGUuc3BsaXQoJyMnKVsxXX1gXG4gICAgfVxuXG4gICAgc2VsZWN0b3IgPSBocmVmQXR0cmlidXRlICYmIGhyZWZBdHRyaWJ1dGUgIT09ICcjJyA/IGhyZWZBdHRyaWJ1dGUudHJpbSgpIDogbnVsbFxuICB9XG5cbiAgcmV0dXJuIHNlbGVjdG9yID8gc2VsZWN0b3Iuc3BsaXQoJywnKS5tYXAoc2VsID0+IHBhcnNlU2VsZWN0b3Ioc2VsKSkuam9pbignLCcpIDogbnVsbFxufVxuXG5jb25zdCBTZWxlY3RvckVuZ2luZSA9IHtcbiAgZmluZChzZWxlY3RvciwgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuICAgIHJldHVybiBbXS5jb25jYXQoLi4uRWxlbWVudC5wcm90b3R5cGUucXVlcnlTZWxlY3RvckFsbC5jYWxsKGVsZW1lbnQsIHNlbGVjdG9yKSlcbiAgfSxcblxuICBmaW5kT25lKHNlbGVjdG9yLCBlbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgcmV0dXJuIEVsZW1lbnQucHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3IuY2FsbChlbGVtZW50LCBzZWxlY3RvcilcbiAgfSxcblxuICBjaGlsZHJlbihlbGVtZW50LCBzZWxlY3Rvcikge1xuICAgIHJldHVybiBbXS5jb25jYXQoLi4uZWxlbWVudC5jaGlsZHJlbikuZmlsdGVyKGNoaWxkID0+IGNoaWxkLm1hdGNoZXMoc2VsZWN0b3IpKVxuICB9LFxuXG4gIHBhcmVudHMoZWxlbWVudCwgc2VsZWN0b3IpIHtcbiAgICBjb25zdCBwYXJlbnRzID0gW11cbiAgICBsZXQgYW5jZXN0b3IgPSBlbGVtZW50LnBhcmVudE5vZGUuY2xvc2VzdChzZWxlY3RvcilcblxuICAgIHdoaWxlIChhbmNlc3Rvcikge1xuICAgICAgcGFyZW50cy5wdXNoKGFuY2VzdG9yKVxuICAgICAgYW5jZXN0b3IgPSBhbmNlc3Rvci5wYXJlbnROb2RlLmNsb3Nlc3Qoc2VsZWN0b3IpXG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmVudHNcbiAgfSxcblxuICBwcmV2KGVsZW1lbnQsIHNlbGVjdG9yKSB7XG4gICAgbGV0IHByZXZpb3VzID0gZWxlbWVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nXG5cbiAgICB3aGlsZSAocHJldmlvdXMpIHtcbiAgICAgIGlmIChwcmV2aW91cy5tYXRjaGVzKHNlbGVjdG9yKSkge1xuICAgICAgICByZXR1cm4gW3ByZXZpb3VzXVxuICAgICAgfVxuXG4gICAgICBwcmV2aW91cyA9IHByZXZpb3VzLnByZXZpb3VzRWxlbWVudFNpYmxpbmdcbiAgICB9XG5cbiAgICByZXR1cm4gW11cbiAgfSxcbiAgLy8gVE9ETzogdGhpcyBpcyBub3cgdW51c2VkOyByZW1vdmUgbGF0ZXIgYWxvbmcgd2l0aCBwcmV2KClcbiAgbmV4dChlbGVtZW50LCBzZWxlY3Rvcikge1xuICAgIGxldCBuZXh0ID0gZWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmdcblxuICAgIHdoaWxlIChuZXh0KSB7XG4gICAgICBpZiAobmV4dC5tYXRjaGVzKHNlbGVjdG9yKSkge1xuICAgICAgICByZXR1cm4gW25leHRdXG4gICAgICB9XG5cbiAgICAgIG5leHQgPSBuZXh0Lm5leHRFbGVtZW50U2libGluZ1xuICAgIH1cblxuICAgIHJldHVybiBbXVxuICB9LFxuXG4gIGZvY3VzYWJsZUNoaWxkcmVuKGVsZW1lbnQpIHtcbiAgICBjb25zdCBmb2N1c2FibGVzID0gW1xuICAgICAgJ2EnLFxuICAgICAgJ2J1dHRvbicsXG4gICAgICAnaW5wdXQnLFxuICAgICAgJ3RleHRhcmVhJyxcbiAgICAgICdzZWxlY3QnLFxuICAgICAgJ2RldGFpbHMnLFxuICAgICAgJ1t0YWJpbmRleF0nLFxuICAgICAgJ1tjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCJdJ1xuICAgIF0ubWFwKHNlbGVjdG9yID0+IGAke3NlbGVjdG9yfTpub3QoW3RhYmluZGV4Xj1cIi1cIl0pYCkuam9pbignLCcpXG5cbiAgICByZXR1cm4gdGhpcy5maW5kKGZvY3VzYWJsZXMsIGVsZW1lbnQpLmZpbHRlcihlbCA9PiAhaXNEaXNhYmxlZChlbCkgJiYgaXNWaXNpYmxlKGVsKSlcbiAgfSxcblxuICBnZXRTZWxlY3RvckZyb21FbGVtZW50KGVsZW1lbnQpIHtcbiAgICBjb25zdCBzZWxlY3RvciA9IGdldFNlbGVjdG9yKGVsZW1lbnQpXG5cbiAgICBpZiAoc2VsZWN0b3IpIHtcbiAgICAgIHJldHVybiBTZWxlY3RvckVuZ2luZS5maW5kT25lKHNlbGVjdG9yKSA/IHNlbGVjdG9yIDogbnVsbFxuICAgIH1cblxuICAgIHJldHVybiBudWxsXG4gIH0sXG5cbiAgZ2V0RWxlbWVudEZyb21TZWxlY3RvcihlbGVtZW50KSB7XG4gICAgY29uc3Qgc2VsZWN0b3IgPSBnZXRTZWxlY3RvcihlbGVtZW50KVxuXG4gICAgcmV0dXJuIHNlbGVjdG9yID8gU2VsZWN0b3JFbmdpbmUuZmluZE9uZShzZWxlY3RvcikgOiBudWxsXG4gIH0sXG5cbiAgZ2V0TXVsdGlwbGVFbGVtZW50c0Zyb21TZWxlY3RvcihlbGVtZW50KSB7XG4gICAgY29uc3Qgc2VsZWN0b3IgPSBnZXRTZWxlY3RvcihlbGVtZW50KVxuXG4gICAgcmV0dXJuIHNlbGVjdG9yID8gU2VsZWN0b3JFbmdpbmUuZmluZChzZWxlY3RvcikgOiBbXVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNlbGVjdG9yRW5naW5lXG4iLCAiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQm9vdHN0cmFwIHV0aWwvY29tcG9uZW50LWZ1bmN0aW9ucy5qc1xuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSAnLi4vZG9tL2V2ZW50LWhhbmRsZXIuanMnXG5pbXBvcnQgU2VsZWN0b3JFbmdpbmUgZnJvbSAnLi4vZG9tL3NlbGVjdG9yLWVuZ2luZS5qcydcbmltcG9ydCB7IGlzRGlzYWJsZWQgfSBmcm9tICcuL2luZGV4LmpzJ1xuXG5jb25zdCBlbmFibGVEaXNtaXNzVHJpZ2dlciA9IChjb21wb25lbnQsIG1ldGhvZCA9ICdoaWRlJykgPT4ge1xuICBjb25zdCBjbGlja0V2ZW50ID0gYGNsaWNrLmRpc21pc3Mke2NvbXBvbmVudC5FVkVOVF9LRVl9YFxuICBjb25zdCBuYW1lID0gY29tcG9uZW50Lk5BTUVcblxuICBFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIGNsaWNrRXZlbnQsIGBbZGF0YS1icy1kaXNtaXNzPVwiJHtuYW1lfVwiXWAsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmIChbJ0EnLCAnQVJFQSddLmluY2x1ZGVzKHRoaXMudGFnTmFtZSkpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICB9XG5cbiAgICBpZiAoaXNEaXNhYmxlZCh0aGlzKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgdGFyZ2V0ID0gU2VsZWN0b3JFbmdpbmUuZ2V0RWxlbWVudEZyb21TZWxlY3Rvcih0aGlzKSB8fCB0aGlzLmNsb3Nlc3QoYC4ke25hbWV9YClcbiAgICBjb25zdCBpbnN0YW5jZSA9IGNvbXBvbmVudC5nZXRPckNyZWF0ZUluc3RhbmNlKHRhcmdldClcblxuICAgIC8vIE1ldGhvZCBhcmd1bWVudCBpcyBsZWZ0LCBmb3IgQWxlcnQgYW5kIG9ubHksIGFzIGl0IGRvZXNuJ3QgaW1wbGVtZW50IHRoZSAnaGlkZScgbWV0aG9kXG4gICAgaW5zdGFuY2VbbWV0aG9kXSgpXG4gIH0pXG59XG5cbmV4cG9ydCB7XG4gIGVuYWJsZURpc21pc3NUcmlnZ2VyXG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7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QyxTQUFTO0FBQ3ZDLGdCQUFNQyxXQUFXRixZQUFZQyxPQUFPO0FBRXBDLGlCQUFPQyxXQUFXVyxlQUFlQyxLQUFLWixRQUFRLElBQUksQ0FBQTtRQUNwRDtNQUNGOzs7Ozs7Ozs7Ozs7O0FDaEhBLFlBQU00Qyx1QkFBdUJBLHdCQUFDQyxXQUFXQyxTQUFTLFdBQVc7QUFDM0QsY0FBTUMsYUFBYSxnQkFBZ0JGLFVBQVVHLFNBQVM7QUFDdEQsY0FBTUMsT0FBT0osVUFBVUs7QUFFdkJDLHFCQUFhQyxHQUFHQyxVQUFVTixZQUFZLHFCQUFxQkUsSUFBSSxNQUFNLFNBQVVLLE9BQU87QUFDcEYsY0FBSSxDQUFDLEtBQUssTUFBTSxFQUFFQyxTQUFTLEtBQUtDLE9BQU8sR0FBRztBQUN4Q0Ysa0JBQU1HLGVBQWM7VUFDdEI7QUFFQSxjQUFJQyxTQUFBQSxXQUFXLElBQUksR0FBRztBQUNwQjtVQUNGO0FBRUEsZ0JBQU1DLFNBQVNDLGVBQWVDLHVCQUF1QixJQUFJLEtBQUssS0FBS0MsUUFBUSxJQUFJYixJQUFJLEVBQUU7QUFDckYsZ0JBQU1jLFdBQVdsQixVQUFVbUIsb0JBQW9CTCxNQUFNO0FBR3JESSxtQkFBU2pCLE1BQU0sRUFBQztRQUNsQixDQUFDO01BQ0gsR0FuQjZCRjs7Ozs7OyIsCiAgIm5hbWVzIjogWyJNQVhfVUlEIiwgIk1JTExJU0VDT05EU19NVUxUSVBMSUVSIiwgIlRSQU5TSVRJT05fRU5EIiwgInBhcnNlU2VsZWN0b3IiLCAic2VsZWN0b3IiLCAid2luZG93IiwgIkNTUyIsICJlc2NhcGUiLCAicmVwbGFjZSIsICJtYXRjaCIsICJpZCIsICJ0b1R5cGUiLCAib2JqZWN0IiwgInVuZGVmaW5lZCIsICJPYmplY3QiLCAicHJvdG90eXBlIiwgInRvU3RyaW5nIiwgImNhbGwiLCAidG9Mb3dlckNhc2UiLCAiZ2V0VUlEIiwgInByZWZpeCIsICJNYXRoIiwgImZsb29yIiwgInJhbmRvbSIsICJkb2N1bWVudCIsICJnZXRFbGVtZW50QnlJZCIsICJnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCIsICJlbGVtZW50IiwgInRyYW5zaXRpb25EdXJhdGlvbiIsICJ0cmFuc2l0aW9uRGVsYXkiLCAiZ2V0Q29tcHV0ZWRTdHlsZSIsICJmbG9hdFRyYW5zaXRpb25EdXJhdGlvbiIsICJOdW1iZXIiLCAicGFyc2VGbG9hdCIsICJmbG9hdFRyYW5zaXRpb25EZWxheSIsICJzcGxpdCIsICJ0cmlnZ2VyVHJhbnNpdGlvbkVuZCIsICJkaXNwYXRjaEV2ZW50IiwgIkV2ZW50IiwgImlzRWxlbWVudCIsICJqcXVlcnkiLCAibm9kZVR5cGUiLCAiZ2V0RWxlbWVudCIsICJsZW5ndGgiLCAicXVlcnlTZWxlY3RvciIsICJpc1Zpc2libGUiLCAiZ2V0Q2xpZW50UmVjdHMiLCAiZWxlbWVudElzVmlzaWJsZSIsICJnZXRQcm9wZXJ0eVZhbHVlIiwgImNsb3NlZERldGFpbHMiLCAiY2xvc2VzdCIsICJzdW1tYXJ5IiwgInBhcmVudE5vZGUiLCAiaXNEaXNhYmxlZCIsICJOb2RlIiwgIkVMRU1FTlRfTk9ERSIsICJjbGFzc0xpc3QiLCAiY29udGFpbnMiLCAiZGlzYWJsZWQiLCAiaGFzQXR0cmlidXRlIiwgImdldEF0dHJpYnV0ZSIsICJmaW5kU2hhZG93Um9vdCIsICJkb2N1bWVudEVsZW1lbnQiLCAiYXR0YWNoU2hhZG93IiwgImdldFJvb3ROb2RlIiwgInJvb3QiLCAiU2hhZG93Um9vdCIsICJub29wIiwgInJlZmxvdyIsICJvZmZzZXRIZWlnaHQiLCAiZ2V0alF1ZXJ5IiwgImpRdWVyeSIsICJib2R5IiwgIkRPTUNvbnRlbnRMb2FkZWRDYWxsYmFja3MiLCAib25ET01Db250ZW50TG9hZGVkIiwgImNhbGxiYWNrIiwgInJlYWR5U3RhdGUiLCAiYWRkRXZlbnRMaXN0ZW5lciIsICJwdXNoIiwgImlzUlRMIiwgImRpciIsICJkZWZpbmVKUXVlcnlQbHVnaW4iLCAicGx1Z2luIiwgIiQiLCAibmFtZSIsICJOQU1FIiwgIkpRVUVSWV9OT19DT05GTElDVCIsICJmbiIsICJqUXVlcnlJbnRlcmZhY2UiLCAiQ29uc3RydWN0b3IiLCAibm9Db25mbGljdCIsICJleGVjdXRlIiwgInBvc3NpYmxlQ2FsbGJhY2siLCAiYXJncyIsICJkZWZhdWx0VmFsdWUiLCAiZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbiIsICJ0cmFuc2l0aW9uRWxlbWVudCIsICJ3YWl0Rm9yVHJhbnNpdGlvbiIsICJkdXJhdGlvblBhZGRpbmciLCAiZW11bGF0ZWREdXJhdGlvbiIsICJjYWxsZWQiLCAiaGFuZGxlciIsICJ0YXJnZXQiLCAicmVtb3ZlRXZlbnRMaXN0ZW5lciIsICJzZXRUaW1lb3V0IiwgImdldE5leHRBY3RpdmVFbGVtZW50IiwgImxpc3QiLCAiYWN0aXZlRWxlbWVudCIsICJzaG91bGRHZXROZXh0IiwgImlzQ3ljbGVBbGxvd2VkIiwgImxpc3RMZW5ndGgiLCAiaW5kZXgiLCAiaW5kZXhPZiIsICJtYXgiLCAibWluIiwgIm5hbWVzcGFjZVJlZ2V4IiwgInN0cmlwTmFtZVJlZ2V4IiwgInN0cmlwVWlkUmVnZXgiLCAiZXZlbnRSZWdpc3RyeSIsICJ1aWRFdmVudCIsICJjdXN0b21FdmVudHMiLCAibW91c2VlbnRlciIsICJtb3VzZWxlYXZlIiwgIm5hdGl2ZUV2ZW50cyIsICJTZXQiLCAibWFrZUV2ZW50VWlkIiwgImVsZW1lbnQiLCAidWlkIiwgImdldEVsZW1lbnRFdmVudHMiLCAiYm9vdHN0cmFwSGFuZGxlciIsICJmbiIsICJoYW5kbGVyIiwgImV2ZW50IiwgImh5ZHJhdGVPYmoiLCAiZGVsZWdhdGVUYXJnZXQiLCAib25lT2ZmIiwgIkV2ZW50SGFuZGxlciIsICJvZmYiLCAidHlwZSIsICJhcHBseSIsICJib290c3RyYXBEZWxlZ2F0aW9uSGFuZGxlciIsICJzZWxlY3RvciIsICJkb21FbGVtZW50cyIsICJxdWVyeVNlbGVjdG9yQWxsIiwgInRhcmdldCIsICJwYXJlbnROb2RlIiwgImRvbUVsZW1lbnQiLCAiZmluZEhhbmRsZXIiLCAiZXZlbnRzIiwgImNhbGxhYmxlIiwgImRlbGVnYXRpb25TZWxlY3RvciIsICJPYmplY3QiLCAidmFsdWVzIiwgImZpbmQiLCAibm9ybWFsaXplUGFyYW1ldGVycyIsICJvcmlnaW5hbFR5cGVFdmVudCIsICJkZWxlZ2F0aW9uRnVuY3Rpb24iLCAiaXNEZWxlZ2F0ZWQiLCAidHlwZUV2ZW50IiwgImdldFR5cGVFdmVudCIsICJoYXMiLCAiYWRkSGFuZGxlciIsICJ3cmFwRnVuY3Rpb24iLCAicmVsYXRlZFRhcmdldCIsICJjb250YWlucyIsICJjYWxsIiwgImhhbmRsZXJzIiwgInByZXZpb3VzRnVuY3Rpb24iLCAicmVwbGFjZSIsICJhZGRFdmVudExpc3RlbmVyIiwgInJlbW92ZUhhbmRsZXIiLCAicmVtb3ZlRXZlbnRMaXN0ZW5lciIsICJCb29sZWFuIiwgInJlbW92ZU5hbWVzcGFjZWRIYW5kbGVycyIsICJuYW1lc3BhY2UiLCAic3RvcmVFbGVtZW50RXZlbnQiLCAiaGFuZGxlcktleSIsICJlbnRyaWVzIiwgImluY2x1ZGVzIiwgIm9uIiwgIm9uZSIsICJpbk5hbWVzcGFjZSIsICJpc05hbWVzcGFjZSIsICJzdGFydHNXaXRoIiwgImtleXMiLCAibGVuZ3RoIiwgImVsZW1lbnRFdmVudCIsICJzbGljZSIsICJrZXlIYW5kbGVycyIsICJ0cmlnZ2VyIiwgImFyZ3MiLCAiJCIsICJnZXRqUXVlcnkiLCAialF1ZXJ5RXZlbnQiLCAiYnViYmxlcyIsICJuYXRpdmVEaXNwYXRjaCIsICJkZWZhdWx0UHJldmVudGVkIiwgIkV2ZW50IiwgImlzUHJvcGFnYXRpb25TdG9wcGVkIiwgImlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkIiwgImlzRGVmYXVsdFByZXZlbnRlZCIsICJldnQiLCAiY2FuY2VsYWJsZSIsICJwcmV2ZW50RGVmYXVsdCIsICJkaXNwYXRjaEV2ZW50IiwgIm9iaiIsICJtZXRhIiwgImtleSIsICJ2YWx1ZSIsICJfdW51c2VkIiwgImRlZmluZVByb3BlcnR5IiwgImNvbmZpZ3VyYWJsZSIsICJnZXQiLCAiZ2V0U2VsZWN0b3IiLCAiZWxlbWVudCIsICJzZWxlY3RvciIsICJnZXRBdHRyaWJ1dGUiLCAiaHJlZkF0dHJpYnV0ZSIsICJpbmNsdWRlcyIsICJzdGFydHNXaXRoIiwgInNwbGl0IiwgInRyaW0iLCAibWFwIiwgInNlbCIsICJwYXJzZVNlbGVjdG9yIiwgImpvaW4iLCAiU2VsZWN0b3JFbmdpbmUiLCAiZmluZCIsICJkb2N1bWVudCIsICJkb2N1bWVudEVsZW1lbnQiLCAiY29uY2F0IiwgIkVsZW1lbnQiLCAicHJvdG90eXBlIiwgInF1ZXJ5U2VsZWN0b3JBbGwiLCAiY2FsbCIsICJmaW5kT25lIiwgInF1ZXJ5U2VsZWN0b3IiLCAiY2hpbGRyZW4iLCAiZmlsdGVyIiwgImNoaWxkIiwgIm1hdGNoZXMiLCAicGFyZW50cyIsICJhbmNlc3RvciIsICJwYXJlbnROb2RlIiwgImNsb3Nlc3QiLCAicHVzaCIsICJwcmV2IiwgInByZXZpb3VzIiwgInByZXZpb3VzRWxlbWVudFNpYmxpbmciLCAibmV4dCIsICJuZXh0RWxlbWVudFNpYmxpbmciLCAiZm9jdXNhYmxlQ2hpbGRyZW4iLCAiZm9jdXNhYmxlcyIsICJlbCIsICJpc0Rpc2FibGVkIiwgImlzVmlzaWJsZSIsICJnZXRTZWxlY3RvckZyb21FbGVtZW50IiwgImdldEVsZW1lbnRGcm9tU2VsZWN0b3IiLCAiZ2V0TXVsdGlwbGVFbGVtZW50c0Zyb21TZWxlY3RvciIsICJlbmFibGVEaXNtaXNzVHJpZ2dlciIsICJjb21wb25lbnQiLCAibWV0aG9kIiwgImNsaWNrRXZlbnQiLCAiRVZFTlRfS0VZIiwgIm5hbWUiLCAiTkFNRSIsICJFdmVudEhhbmRsZXIiLCAib24iLCAiZG9jdW1lbnQiLCAiZXZlbnQiLCAiaW5jbHVkZXMiLCAidGFnTmFtZSIsICJwcmV2ZW50RGVmYXVsdCIsICJpc0Rpc2FibGVkIiwgInRhcmdldCIsICJTZWxlY3RvckVuZ2luZSIsICJnZXRFbGVtZW50RnJvbVNlbGVjdG9yIiwgImNsb3Nlc3QiLCAiaW5zdGFuY2UiLCAiZ2V0T3JDcmVhdGVJbnN0YW5jZSJdCn0K
