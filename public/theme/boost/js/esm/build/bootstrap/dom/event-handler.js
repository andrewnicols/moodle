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
export default require_event_handler();
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL3NyYy91dGlsL2luZGV4LmpzIiwgIi4uLy4uLy4uL3NyYy9zcmMvZG9tL2V2ZW50LWhhbmRsZXIuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEJvb3RzdHJhcCB1dGlsL2luZGV4LmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuY29uc3QgTUFYX1VJRCA9IDFfMDAwXzAwMFxuY29uc3QgTUlMTElTRUNPTkRTX01VTFRJUExJRVIgPSAxMDAwXG5jb25zdCBUUkFOU0lUSU9OX0VORCA9ICd0cmFuc2l0aW9uZW5kJ1xuXG4vKipcbiAqIFByb3Blcmx5IGVzY2FwZSBJRHMgc2VsZWN0b3JzIHRvIGhhbmRsZSB3ZWlyZCBJRHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuY29uc3QgcGFyc2VTZWxlY3RvciA9IHNlbGVjdG9yID0+IHtcbiAgaWYgKHNlbGVjdG9yICYmIHdpbmRvdy5DU1MgJiYgd2luZG93LkNTUy5lc2NhcGUpIHtcbiAgICAvLyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yIG5lZWRzIGVzY2FwaW5nIHRvIGhhbmRsZSBJRHMgKGh0bWw1KykgY29udGFpbmluZyBmb3IgaW5zdGFuY2UgL1xuICAgIHNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgvIyhbXlxcc1wiIyddKykvZywgKG1hdGNoLCBpZCkgPT4gYCMke0NTUy5lc2NhcGUoaWQpfWApXG4gIH1cblxuICByZXR1cm4gc2VsZWN0b3Jcbn1cblxuLy8gU2hvdXQtb3V0IEFuZ3VzIENyb2xsIChodHRwczovL2dvby5nbC9weHdRR3ApXG5jb25zdCB0b1R5cGUgPSBvYmplY3QgPT4ge1xuICBpZiAob2JqZWN0ID09PSBudWxsIHx8IG9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGAke29iamVjdH1gXG4gIH1cblxuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkubWF0Y2goL1xccyhbYS16XSspL2kpWzFdLnRvTG93ZXJDYXNlKClcbn1cblxuLyoqXG4gKiBQdWJsaWMgVXRpbCBBUElcbiAqL1xuXG5jb25zdCBnZXRVSUQgPSBwcmVmaXggPT4ge1xuICBkbyB7XG4gICAgcHJlZml4ICs9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIE1BWF9VSUQpXG4gIH0gd2hpbGUgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHByZWZpeCkpXG5cbiAgcmV0dXJuIHByZWZpeFxufVxuXG5jb25zdCBnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCA9IGVsZW1lbnQgPT4ge1xuICBpZiAoIWVsZW1lbnQpIHtcbiAgICByZXR1cm4gMFxuICB9XG5cbiAgLy8gR2V0IHRyYW5zaXRpb24tZHVyYXRpb24gb2YgdGhlIGVsZW1lbnRcbiAgbGV0IHsgdHJhbnNpdGlvbkR1cmF0aW9uLCB0cmFuc2l0aW9uRGVsYXkgfSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpXG5cbiAgY29uc3QgZmxvYXRUcmFuc2l0aW9uRHVyYXRpb24gPSBOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRHVyYXRpb24pXG4gIGNvbnN0IGZsb2F0VHJhbnNpdGlvbkRlbGF5ID0gTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkRlbGF5KVxuXG4gIC8vIFJldHVybiAwIGlmIGVsZW1lbnQgb3IgdHJhbnNpdGlvbiBkdXJhdGlvbiBpcyBub3QgZm91bmRcbiAgaWYgKCFmbG9hdFRyYW5zaXRpb25EdXJhdGlvbiAmJiAhZmxvYXRUcmFuc2l0aW9uRGVsYXkpIHtcbiAgICByZXR1cm4gMFxuICB9XG5cbiAgLy8gSWYgbXVsdGlwbGUgZHVyYXRpb25zIGFyZSBkZWZpbmVkLCB0YWtlIHRoZSBmaXJzdFxuICB0cmFuc2l0aW9uRHVyYXRpb24gPSB0cmFuc2l0aW9uRHVyYXRpb24uc3BsaXQoJywnKVswXVxuICB0cmFuc2l0aW9uRGVsYXkgPSB0cmFuc2l0aW9uRGVsYXkuc3BsaXQoJywnKVswXVxuXG4gIHJldHVybiAoTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkR1cmF0aW9uKSArIE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EZWxheSkpICogTUlMTElTRUNPTkRTX01VTFRJUExJRVJcbn1cblxuY29uc3QgdHJpZ2dlclRyYW5zaXRpb25FbmQgPSBlbGVtZW50ID0+IHtcbiAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChUUkFOU0lUSU9OX0VORCkpXG59XG5cbmNvbnN0IGlzRWxlbWVudCA9IG9iamVjdCA9PiB7XG4gIGlmICghb2JqZWN0IHx8IHR5cGVvZiBvYmplY3QgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBpZiAodHlwZW9mIG9iamVjdC5qcXVlcnkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgb2JqZWN0ID0gb2JqZWN0WzBdXG4gIH1cblxuICByZXR1cm4gdHlwZW9mIG9iamVjdC5ub2RlVHlwZSAhPT0gJ3VuZGVmaW5lZCdcbn1cblxuY29uc3QgZ2V0RWxlbWVudCA9IG9iamVjdCA9PiB7XG4gIC8vIGl0J3MgYSBqUXVlcnkgb2JqZWN0IG9yIGEgbm9kZSBlbGVtZW50XG4gIGlmIChpc0VsZW1lbnQob2JqZWN0KSkge1xuICAgIHJldHVybiBvYmplY3QuanF1ZXJ5ID8gb2JqZWN0WzBdIDogb2JqZWN0XG4gIH1cblxuICBpZiAodHlwZW9mIG9iamVjdCA9PT0gJ3N0cmluZycgJiYgb2JqZWN0Lmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihwYXJzZVNlbGVjdG9yKG9iamVjdCkpXG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG5jb25zdCBpc1Zpc2libGUgPSBlbGVtZW50ID0+IHtcbiAgaWYgKCFpc0VsZW1lbnQoZWxlbWVudCkgfHwgZWxlbWVudC5nZXRDbGllbnRSZWN0cygpLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgY29uc3QgZWxlbWVudElzVmlzaWJsZSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZSgndmlzaWJpbGl0eScpID09PSAndmlzaWJsZSdcbiAgLy8gSGFuZGxlIGBkZXRhaWxzYCBlbGVtZW50IGFzIGl0cyBjb250ZW50IG1heSBmYWxzaWUgYXBwZWFyIHZpc2libGUgd2hlbiBpdCBpcyBjbG9zZWRcbiAgY29uc3QgY2xvc2VkRGV0YWlscyA9IGVsZW1lbnQuY2xvc2VzdCgnZGV0YWlsczpub3QoW29wZW5dKScpXG5cbiAgaWYgKCFjbG9zZWREZXRhaWxzKSB7XG4gICAgcmV0dXJuIGVsZW1lbnRJc1Zpc2libGVcbiAgfVxuXG4gIGlmIChjbG9zZWREZXRhaWxzICE9PSBlbGVtZW50KSB7XG4gICAgY29uc3Qgc3VtbWFyeSA9IGVsZW1lbnQuY2xvc2VzdCgnc3VtbWFyeScpXG4gICAgaWYgKHN1bW1hcnkgJiYgc3VtbWFyeS5wYXJlbnROb2RlICE9PSBjbG9zZWREZXRhaWxzKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoc3VtbWFyeSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnRJc1Zpc2libGVcbn1cblxuY29uc3QgaXNEaXNhYmxlZCA9IGVsZW1lbnQgPT4ge1xuICBpZiAoIWVsZW1lbnQgfHwgZWxlbWVudC5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXNhYmxlZCcpKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGlmICh0eXBlb2YgZWxlbWVudC5kaXNhYmxlZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZWxlbWVudC5kaXNhYmxlZFxuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpICE9PSAnZmFsc2UnXG59XG5cbmNvbnN0IGZpbmRTaGFkb3dSb290ID0gZWxlbWVudCA9PiB7XG4gIGlmICghZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmF0dGFjaFNoYWRvdykge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICAvLyBDYW4gZmluZCB0aGUgc2hhZG93IHJvb3Qgb3RoZXJ3aXNlIGl0J2xsIHJldHVybiB0aGUgZG9jdW1lbnRcbiAgaWYgKHR5cGVvZiBlbGVtZW50LmdldFJvb3ROb2RlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY29uc3Qgcm9vdCA9IGVsZW1lbnQuZ2V0Um9vdE5vZGUoKVxuICAgIHJldHVybiByb290IGluc3RhbmNlb2YgU2hhZG93Um9vdCA/IHJvb3QgOiBudWxsXG4gIH1cblxuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpIHtcbiAgICByZXR1cm4gZWxlbWVudFxuICB9XG5cbiAgLy8gd2hlbiB3ZSBkb24ndCBmaW5kIGEgc2hhZG93IHJvb3RcbiAgaWYgKCFlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgcmV0dXJuIGZpbmRTaGFkb3dSb290KGVsZW1lbnQucGFyZW50Tm9kZSlcbn1cblxuY29uc3Qgbm9vcCA9ICgpID0+IHt9XG5cbi8qKlxuICogVHJpY2sgdG8gcmVzdGFydCBhbiBlbGVtZW50J3MgYW5pbWF0aW9uXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHJldHVybiB2b2lkXG4gKlxuICogQHNlZSBodHRwczovL3d3dy5oYXJyeXRoZW8uY29tL2Jsb2cvMjAyMS8wMi9yZXN0YXJ0LWEtY3NzLWFuaW1hdGlvbi13aXRoLWphdmFzY3JpcHQvI3Jlc3RhcnRpbmctYS1jc3MtYW5pbWF0aW9uXG4gKi9cbmNvbnN0IHJlZmxvdyA9IGVsZW1lbnQgPT4ge1xuICBlbGVtZW50Lm9mZnNldEhlaWdodCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xufVxuXG5jb25zdCBnZXRqUXVlcnkgPSAoKSA9PiB7XG4gIGlmICh3aW5kb3cualF1ZXJ5ICYmICFkb2N1bWVudC5ib2R5Lmhhc0F0dHJpYnV0ZSgnZGF0YS1icy1uby1qcXVlcnknKSkge1xuICAgIHJldHVybiB3aW5kb3cualF1ZXJ5XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG5jb25zdCBET01Db250ZW50TG9hZGVkQ2FsbGJhY2tzID0gW11cblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkID0gY2FsbGJhY2sgPT4ge1xuICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2xvYWRpbmcnKSB7XG4gICAgLy8gYWRkIGxpc3RlbmVyIG9uIHRoZSBmaXJzdCBjYWxsIHdoZW4gdGhlIGRvY3VtZW50IGlzIGluIGxvYWRpbmcgc3RhdGVcbiAgICBpZiAoIURPTUNvbnRlbnRMb2FkZWRDYWxsYmFja3MubGVuZ3RoKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIERPTUNvbnRlbnRMb2FkZWRDYWxsYmFja3MpIHtcbiAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgRE9NQ29udGVudExvYWRlZENhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKVxuICB9IGVsc2Uge1xuICAgIGNhbGxiYWNrKClcbiAgfVxufVxuXG5jb25zdCBpc1JUTCA9ICgpID0+IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5kaXIgPT09ICdydGwnXG5cbmNvbnN0IGRlZmluZUpRdWVyeVBsdWdpbiA9IHBsdWdpbiA9PiB7XG4gIG9uRE9NQ29udGVudExvYWRlZCgoKSA9PiB7XG4gICAgY29uc3QgJCA9IGdldGpRdWVyeSgpXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCQpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBwbHVnaW4uTkFNRVxuICAgICAgY29uc3QgSlFVRVJZX05PX0NPTkZMSUNUID0gJC5mbltuYW1lXVxuICAgICAgJC5mbltuYW1lXSA9IHBsdWdpbi5qUXVlcnlJbnRlcmZhY2VcbiAgICAgICQuZm5bbmFtZV0uQ29uc3RydWN0b3IgPSBwbHVnaW5cbiAgICAgICQuZm5bbmFtZV0ubm9Db25mbGljdCA9ICgpID0+IHtcbiAgICAgICAgJC5mbltuYW1lXSA9IEpRVUVSWV9OT19DT05GTElDVFxuICAgICAgICByZXR1cm4gcGx1Z2luLmpRdWVyeUludGVyZmFjZVxuICAgICAgfVxuICAgIH1cbiAgfSlcbn1cblxuY29uc3QgZXhlY3V0ZSA9IChwb3NzaWJsZUNhbGxiYWNrLCBhcmdzID0gW10sIGRlZmF1bHRWYWx1ZSA9IHBvc3NpYmxlQ2FsbGJhY2spID0+IHtcbiAgcmV0dXJuIHR5cGVvZiBwb3NzaWJsZUNhbGxiYWNrID09PSAnZnVuY3Rpb24nID8gcG9zc2libGVDYWxsYmFjay5jYWxsKC4uLmFyZ3MpIDogZGVmYXVsdFZhbHVlXG59XG5cbmNvbnN0IGV4ZWN1dGVBZnRlclRyYW5zaXRpb24gPSAoY2FsbGJhY2ssIHRyYW5zaXRpb25FbGVtZW50LCB3YWl0Rm9yVHJhbnNpdGlvbiA9IHRydWUpID0+IHtcbiAgaWYgKCF3YWl0Rm9yVHJhbnNpdGlvbikge1xuICAgIGV4ZWN1dGUoY2FsbGJhY2spXG4gICAgcmV0dXJuXG4gIH1cblxuICBjb25zdCBkdXJhdGlvblBhZGRpbmcgPSA1XG4gIGNvbnN0IGVtdWxhdGVkRHVyYXRpb24gPSBnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCh0cmFuc2l0aW9uRWxlbWVudCkgKyBkdXJhdGlvblBhZGRpbmdcblxuICBsZXQgY2FsbGVkID0gZmFsc2VcblxuICBjb25zdCBoYW5kbGVyID0gKHsgdGFyZ2V0IH0pID0+IHtcbiAgICBpZiAodGFyZ2V0ICE9PSB0cmFuc2l0aW9uRWxlbWVudCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY2FsbGVkID0gdHJ1ZVxuICAgIHRyYW5zaXRpb25FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoVFJBTlNJVElPTl9FTkQsIGhhbmRsZXIpXG4gICAgZXhlY3V0ZShjYWxsYmFjaylcbiAgfVxuXG4gIHRyYW5zaXRpb25FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoVFJBTlNJVElPTl9FTkQsIGhhbmRsZXIpXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGlmICghY2FsbGVkKSB7XG4gICAgICB0cmlnZ2VyVHJhbnNpdGlvbkVuZCh0cmFuc2l0aW9uRWxlbWVudClcbiAgICB9XG4gIH0sIGVtdWxhdGVkRHVyYXRpb24pXG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBwcmV2aW91cy9uZXh0IGVsZW1lbnQgb2YgYSBsaXN0LlxuICpcbiAqIEBwYXJhbSB7YXJyYXl9IGxpc3QgICAgVGhlIGxpc3Qgb2YgZWxlbWVudHNcbiAqIEBwYXJhbSBhY3RpdmVFbGVtZW50ICAgVGhlIGFjdGl2ZSBlbGVtZW50XG4gKiBAcGFyYW0gc2hvdWxkR2V0TmV4dCAgIENob29zZSB0byBnZXQgbmV4dCBvciBwcmV2aW91cyBlbGVtZW50XG4gKiBAcGFyYW0gaXNDeWNsZUFsbG93ZWRcbiAqIEByZXR1cm4ge0VsZW1lbnR8ZWxlbX0gVGhlIHByb3BlciBlbGVtZW50XG4gKi9cbmNvbnN0IGdldE5leHRBY3RpdmVFbGVtZW50ID0gKGxpc3QsIGFjdGl2ZUVsZW1lbnQsIHNob3VsZEdldE5leHQsIGlzQ3ljbGVBbGxvd2VkKSA9PiB7XG4gIGNvbnN0IGxpc3RMZW5ndGggPSBsaXN0Lmxlbmd0aFxuICBsZXQgaW5kZXggPSBsaXN0LmluZGV4T2YoYWN0aXZlRWxlbWVudClcblxuICAvLyBpZiB0aGUgZWxlbWVudCBkb2VzIG5vdCBleGlzdCBpbiB0aGUgbGlzdCByZXR1cm4gYW4gZWxlbWVudFxuICAvLyBkZXBlbmRpbmcgb24gdGhlIGRpcmVjdGlvbiBhbmQgaWYgY3ljbGUgaXMgYWxsb3dlZFxuICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgcmV0dXJuICFzaG91bGRHZXROZXh0ICYmIGlzQ3ljbGVBbGxvd2VkID8gbGlzdFtsaXN0TGVuZ3RoIC0gMV0gOiBsaXN0WzBdXG4gIH1cblxuICBpbmRleCArPSBzaG91bGRHZXROZXh0ID8gMSA6IC0xXG5cbiAgaWYgKGlzQ3ljbGVBbGxvd2VkKSB7XG4gICAgaW5kZXggPSAoaW5kZXggKyBsaXN0TGVuZ3RoKSAlIGxpc3RMZW5ndGhcbiAgfVxuXG4gIHJldHVybiBsaXN0W01hdGgubWF4KDAsIE1hdGgubWluKGluZGV4LCBsaXN0TGVuZ3RoIC0gMSkpXVxufVxuXG5leHBvcnQge1xuICBkZWZpbmVKUXVlcnlQbHVnaW4sXG4gIGV4ZWN1dGUsXG4gIGV4ZWN1dGVBZnRlclRyYW5zaXRpb24sXG4gIGZpbmRTaGFkb3dSb290LFxuICBnZXRFbGVtZW50LFxuICBnZXRqUXVlcnksXG4gIGdldE5leHRBY3RpdmVFbGVtZW50LFxuICBnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCxcbiAgZ2V0VUlELFxuICBpc0Rpc2FibGVkLFxuICBpc0VsZW1lbnQsXG4gIGlzUlRMLFxuICBpc1Zpc2libGUsXG4gIG5vb3AsXG4gIG9uRE9NQ29udGVudExvYWRlZCxcbiAgcGFyc2VTZWxlY3RvcixcbiAgcmVmbG93LFxuICB0cmlnZ2VyVHJhbnNpdGlvbkVuZCxcbiAgdG9UeXBlXG59XG4iLCAiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQm9vdHN0cmFwIGRvbS9ldmVudC1oYW5kbGVyLmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuaW1wb3J0IHsgZ2V0alF1ZXJ5IH0gZnJvbSAnLi4vdXRpbC9pbmRleC5qcydcblxuLyoqXG4gKiBDb25zdGFudHNcbiAqL1xuXG5jb25zdCBuYW1lc3BhY2VSZWdleCA9IC9bXi5dKig/PVxcLi4qKVxcLnwuKi9cbmNvbnN0IHN0cmlwTmFtZVJlZ2V4ID0gL1xcLi4qL1xuY29uc3Qgc3RyaXBVaWRSZWdleCA9IC86OlxcZCskL1xuY29uc3QgZXZlbnRSZWdpc3RyeSA9IHt9IC8vIEV2ZW50cyBzdG9yYWdlXG5sZXQgdWlkRXZlbnQgPSAxXG5jb25zdCBjdXN0b21FdmVudHMgPSB7XG4gIG1vdXNlZW50ZXI6ICdtb3VzZW92ZXInLFxuICBtb3VzZWxlYXZlOiAnbW91c2VvdXQnXG59XG5cbmNvbnN0IG5hdGl2ZUV2ZW50cyA9IG5ldyBTZXQoW1xuICAnY2xpY2snLFxuICAnZGJsY2xpY2snLFxuICAnbW91c2V1cCcsXG4gICdtb3VzZWRvd24nLFxuICAnY29udGV4dG1lbnUnLFxuICAnbW91c2V3aGVlbCcsXG4gICdET01Nb3VzZVNjcm9sbCcsXG4gICdtb3VzZW92ZXInLFxuICAnbW91c2VvdXQnLFxuICAnbW91c2Vtb3ZlJyxcbiAgJ3NlbGVjdHN0YXJ0JyxcbiAgJ3NlbGVjdGVuZCcsXG4gICdrZXlkb3duJyxcbiAgJ2tleXByZXNzJyxcbiAgJ2tleXVwJyxcbiAgJ29yaWVudGF0aW9uY2hhbmdlJyxcbiAgJ3RvdWNoc3RhcnQnLFxuICAndG91Y2htb3ZlJyxcbiAgJ3RvdWNoZW5kJyxcbiAgJ3RvdWNoY2FuY2VsJyxcbiAgJ3BvaW50ZXJkb3duJyxcbiAgJ3BvaW50ZXJtb3ZlJyxcbiAgJ3BvaW50ZXJ1cCcsXG4gICdwb2ludGVybGVhdmUnLFxuICAncG9pbnRlcmNhbmNlbCcsXG4gICdnZXN0dXJlc3RhcnQnLFxuICAnZ2VzdHVyZWNoYW5nZScsXG4gICdnZXN0dXJlZW5kJyxcbiAgJ2ZvY3VzJyxcbiAgJ2JsdXInLFxuICAnY2hhbmdlJyxcbiAgJ3Jlc2V0JyxcbiAgJ3NlbGVjdCcsXG4gICdzdWJtaXQnLFxuICAnZm9jdXNpbicsXG4gICdmb2N1c291dCcsXG4gICdsb2FkJyxcbiAgJ3VubG9hZCcsXG4gICdiZWZvcmV1bmxvYWQnLFxuICAncmVzaXplJyxcbiAgJ21vdmUnLFxuICAnRE9NQ29udGVudExvYWRlZCcsXG4gICdyZWFkeXN0YXRlY2hhbmdlJyxcbiAgJ2Vycm9yJyxcbiAgJ2Fib3J0JyxcbiAgJ3Njcm9sbCdcbl0pXG5cbi8qKlxuICogUHJpdmF0ZSBtZXRob2RzXG4gKi9cblxuZnVuY3Rpb24gbWFrZUV2ZW50VWlkKGVsZW1lbnQsIHVpZCkge1xuICByZXR1cm4gKHVpZCAmJiBgJHt1aWR9Ojoke3VpZEV2ZW50Kyt9YCkgfHwgZWxlbWVudC51aWRFdmVudCB8fCB1aWRFdmVudCsrXG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnRFdmVudHMoZWxlbWVudCkge1xuICBjb25zdCB1aWQgPSBtYWtlRXZlbnRVaWQoZWxlbWVudClcblxuICBlbGVtZW50LnVpZEV2ZW50ID0gdWlkXG4gIGV2ZW50UmVnaXN0cnlbdWlkXSA9IGV2ZW50UmVnaXN0cnlbdWlkXSB8fCB7fVxuXG4gIHJldHVybiBldmVudFJlZ2lzdHJ5W3VpZF1cbn1cblxuZnVuY3Rpb24gYm9vdHN0cmFwSGFuZGxlcihlbGVtZW50LCBmbikge1xuICByZXR1cm4gZnVuY3Rpb24gaGFuZGxlcihldmVudCkge1xuICAgIGh5ZHJhdGVPYmooZXZlbnQsIHsgZGVsZWdhdGVUYXJnZXQ6IGVsZW1lbnQgfSlcblxuICAgIGlmIChoYW5kbGVyLm9uZU9mZikge1xuICAgICAgRXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCBldmVudC50eXBlLCBmbilcbiAgICB9XG5cbiAgICByZXR1cm4gZm4uYXBwbHkoZWxlbWVudCwgW2V2ZW50XSlcbiAgfVxufVxuXG5mdW5jdGlvbiBib290c3RyYXBEZWxlZ2F0aW9uSGFuZGxlcihlbGVtZW50LCBzZWxlY3RvciwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQpIHtcbiAgICBjb25zdCBkb21FbGVtZW50cyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcilcblxuICAgIGZvciAobGV0IHsgdGFyZ2V0IH0gPSBldmVudDsgdGFyZ2V0ICYmIHRhcmdldCAhPT0gdGhpczsgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGUpIHtcbiAgICAgIGZvciAoY29uc3QgZG9tRWxlbWVudCBvZiBkb21FbGVtZW50cykge1xuICAgICAgICBpZiAoZG9tRWxlbWVudCAhPT0gdGFyZ2V0KSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIGh5ZHJhdGVPYmooZXZlbnQsIHsgZGVsZWdhdGVUYXJnZXQ6IHRhcmdldCB9KVxuXG4gICAgICAgIGlmIChoYW5kbGVyLm9uZU9mZikge1xuICAgICAgICAgIEV2ZW50SGFuZGxlci5vZmYoZWxlbWVudCwgZXZlbnQudHlwZSwgc2VsZWN0b3IsIGZuKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRhcmdldCwgW2V2ZW50XSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZEhhbmRsZXIoZXZlbnRzLCBjYWxsYWJsZSwgZGVsZWdhdGlvblNlbGVjdG9yID0gbnVsbCkge1xuICByZXR1cm4gT2JqZWN0LnZhbHVlcyhldmVudHMpXG4gICAgLmZpbmQoZXZlbnQgPT4gZXZlbnQuY2FsbGFibGUgPT09IGNhbGxhYmxlICYmIGV2ZW50LmRlbGVnYXRpb25TZWxlY3RvciA9PT0gZGVsZWdhdGlvblNlbGVjdG9yKVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVQYXJhbWV0ZXJzKG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcbiAgY29uc3QgaXNEZWxlZ2F0ZWQgPSB0eXBlb2YgaGFuZGxlciA9PT0gJ3N0cmluZydcbiAgLy8gVE9ETzogdG9vbHRpcCBwYXNzZXMgYGZhbHNlYCBpbnN0ZWFkIG9mIHNlbGVjdG9yLCBzbyB3ZSBuZWVkIHRvIGNoZWNrXG4gIGNvbnN0IGNhbGxhYmxlID0gaXNEZWxlZ2F0ZWQgPyBkZWxlZ2F0aW9uRnVuY3Rpb24gOiAoaGFuZGxlciB8fCBkZWxlZ2F0aW9uRnVuY3Rpb24pXG4gIGxldCB0eXBlRXZlbnQgPSBnZXRUeXBlRXZlbnQob3JpZ2luYWxUeXBlRXZlbnQpXG5cbiAgaWYgKCFuYXRpdmVFdmVudHMuaGFzKHR5cGVFdmVudCkpIHtcbiAgICB0eXBlRXZlbnQgPSBvcmlnaW5hbFR5cGVFdmVudFxuICB9XG5cbiAgcmV0dXJuIFtpc0RlbGVnYXRlZCwgY2FsbGFibGUsIHR5cGVFdmVudF1cbn1cblxuZnVuY3Rpb24gYWRkSGFuZGxlcihlbGVtZW50LCBvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uLCBvbmVPZmYpIHtcbiAgaWYgKHR5cGVvZiBvcmlnaW5hbFR5cGVFdmVudCAhPT0gJ3N0cmluZycgfHwgIWVsZW1lbnQpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGxldCBbaXNEZWxlZ2F0ZWQsIGNhbGxhYmxlLCB0eXBlRXZlbnRdID0gbm9ybWFsaXplUGFyYW1ldGVycyhvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKVxuXG4gIC8vIGluIGNhc2Ugb2YgbW91c2VlbnRlciBvciBtb3VzZWxlYXZlIHdyYXAgdGhlIGhhbmRsZXIgd2l0aGluIGEgZnVuY3Rpb24gdGhhdCBjaGVja3MgZm9yIGl0cyBET00gcG9zaXRpb25cbiAgLy8gdGhpcyBwcmV2ZW50cyB0aGUgaGFuZGxlciBmcm9tIGJlaW5nIGRpc3BhdGNoZWQgdGhlIHNhbWUgd2F5IGFzIG1vdXNlb3ZlciBvciBtb3VzZW91dCBkb2VzXG4gIGlmIChvcmlnaW5hbFR5cGVFdmVudCBpbiBjdXN0b21FdmVudHMpIHtcbiAgICBjb25zdCB3cmFwRnVuY3Rpb24gPSBmbiA9PiB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmICghZXZlbnQucmVsYXRlZFRhcmdldCB8fCAoZXZlbnQucmVsYXRlZFRhcmdldCAhPT0gZXZlbnQuZGVsZWdhdGVUYXJnZXQgJiYgIWV2ZW50LmRlbGVnYXRlVGFyZ2V0LmNvbnRhaW5zKGV2ZW50LnJlbGF0ZWRUYXJnZXQpKSkge1xuICAgICAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGV2ZW50KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2FsbGFibGUgPSB3cmFwRnVuY3Rpb24oY2FsbGFibGUpXG4gIH1cblxuICBjb25zdCBldmVudHMgPSBnZXRFbGVtZW50RXZlbnRzKGVsZW1lbnQpXG4gIGNvbnN0IGhhbmRsZXJzID0gZXZlbnRzW3R5cGVFdmVudF0gfHwgKGV2ZW50c1t0eXBlRXZlbnRdID0ge30pXG4gIGNvbnN0IHByZXZpb3VzRnVuY3Rpb24gPSBmaW5kSGFuZGxlcihoYW5kbGVycywgY2FsbGFibGUsIGlzRGVsZWdhdGVkID8gaGFuZGxlciA6IG51bGwpXG5cbiAgaWYgKHByZXZpb3VzRnVuY3Rpb24pIHtcbiAgICBwcmV2aW91c0Z1bmN0aW9uLm9uZU9mZiA9IHByZXZpb3VzRnVuY3Rpb24ub25lT2ZmICYmIG9uZU9mZlxuXG4gICAgcmV0dXJuXG4gIH1cblxuICBjb25zdCB1aWQgPSBtYWtlRXZlbnRVaWQoY2FsbGFibGUsIG9yaWdpbmFsVHlwZUV2ZW50LnJlcGxhY2UobmFtZXNwYWNlUmVnZXgsICcnKSlcbiAgY29uc3QgZm4gPSBpc0RlbGVnYXRlZCA/XG4gICAgYm9vdHN0cmFwRGVsZWdhdGlvbkhhbmRsZXIoZWxlbWVudCwgaGFuZGxlciwgY2FsbGFibGUpIDpcbiAgICBib290c3RyYXBIYW5kbGVyKGVsZW1lbnQsIGNhbGxhYmxlKVxuXG4gIGZuLmRlbGVnYXRpb25TZWxlY3RvciA9IGlzRGVsZWdhdGVkID8gaGFuZGxlciA6IG51bGxcbiAgZm4uY2FsbGFibGUgPSBjYWxsYWJsZVxuICBmbi5vbmVPZmYgPSBvbmVPZmZcbiAgZm4udWlkRXZlbnQgPSB1aWRcbiAgaGFuZGxlcnNbdWlkXSA9IGZuXG5cbiAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGVFdmVudCwgZm4sIGlzRGVsZWdhdGVkKVxufVxuXG5mdW5jdGlvbiByZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uU2VsZWN0b3IpIHtcbiAgY29uc3QgZm4gPSBmaW5kSGFuZGxlcihldmVudHNbdHlwZUV2ZW50XSwgaGFuZGxlciwgZGVsZWdhdGlvblNlbGVjdG9yKVxuXG4gIGlmICghZm4pIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlRXZlbnQsIGZuLCBCb29sZWFuKGRlbGVnYXRpb25TZWxlY3RvcikpXG4gIGRlbGV0ZSBldmVudHNbdHlwZUV2ZW50XVtmbi51aWRFdmVudF1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlTmFtZXNwYWNlZEhhbmRsZXJzKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBuYW1lc3BhY2UpIHtcbiAgY29uc3Qgc3RvcmVFbGVtZW50RXZlbnQgPSBldmVudHNbdHlwZUV2ZW50XSB8fCB7fVxuXG4gIGZvciAoY29uc3QgW2hhbmRsZXJLZXksIGV2ZW50XSBvZiBPYmplY3QuZW50cmllcyhzdG9yZUVsZW1lbnRFdmVudCkpIHtcbiAgICBpZiAoaGFuZGxlcktleS5pbmNsdWRlcyhuYW1lc3BhY2UpKSB7XG4gICAgICByZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBldmVudC5jYWxsYWJsZSwgZXZlbnQuZGVsZWdhdGlvblNlbGVjdG9yKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRUeXBlRXZlbnQoZXZlbnQpIHtcbiAgLy8gYWxsb3cgdG8gZ2V0IHRoZSBuYXRpdmUgZXZlbnRzIGZyb20gbmFtZXNwYWNlZCBldmVudHMgKCdjbGljay5icy5idXR0b24nIC0tPiAnY2xpY2snKVxuICBldmVudCA9IGV2ZW50LnJlcGxhY2Uoc3RyaXBOYW1lUmVnZXgsICcnKVxuICByZXR1cm4gY3VzdG9tRXZlbnRzW2V2ZW50XSB8fCBldmVudFxufVxuXG5jb25zdCBFdmVudEhhbmRsZXIgPSB7XG4gIG9uKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcbiAgICBhZGRIYW5kbGVyKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24sIGZhbHNlKVxuICB9LFxuXG4gIG9uZShlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKSB7XG4gICAgYWRkSGFuZGxlcihlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uLCB0cnVlKVxuICB9LFxuXG4gIG9mZihlbGVtZW50LCBvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKSB7XG4gICAgaWYgKHR5cGVvZiBvcmlnaW5hbFR5cGVFdmVudCAhPT0gJ3N0cmluZycgfHwgIWVsZW1lbnQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IFtpc0RlbGVnYXRlZCwgY2FsbGFibGUsIHR5cGVFdmVudF0gPSBub3JtYWxpemVQYXJhbWV0ZXJzKG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pXG4gICAgY29uc3QgaW5OYW1lc3BhY2UgPSB0eXBlRXZlbnQgIT09IG9yaWdpbmFsVHlwZUV2ZW50XG4gICAgY29uc3QgZXZlbnRzID0gZ2V0RWxlbWVudEV2ZW50cyhlbGVtZW50KVxuICAgIGNvbnN0IHN0b3JlRWxlbWVudEV2ZW50ID0gZXZlbnRzW3R5cGVFdmVudF0gfHwge31cbiAgICBjb25zdCBpc05hbWVzcGFjZSA9IG9yaWdpbmFsVHlwZUV2ZW50LnN0YXJ0c1dpdGgoJy4nKVxuXG4gICAgaWYgKHR5cGVvZiBjYWxsYWJsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIC8vIFNpbXBsZXN0IGNhc2U6IGhhbmRsZXIgaXMgcGFzc2VkLCByZW1vdmUgdGhhdCBsaXN0ZW5lciBPTkxZLlxuICAgICAgaWYgKCFPYmplY3Qua2V5cyhzdG9yZUVsZW1lbnRFdmVudCkubGVuZ3RoKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICByZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBjYWxsYWJsZSwgaXNEZWxlZ2F0ZWQgPyBoYW5kbGVyIDogbnVsbClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChpc05hbWVzcGFjZSkge1xuICAgICAgZm9yIChjb25zdCBlbGVtZW50RXZlbnQgb2YgT2JqZWN0LmtleXMoZXZlbnRzKSkge1xuICAgICAgICByZW1vdmVOYW1lc3BhY2VkSGFuZGxlcnMoZWxlbWVudCwgZXZlbnRzLCBlbGVtZW50RXZlbnQsIG9yaWdpbmFsVHlwZUV2ZW50LnNsaWNlKDEpKVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgW2tleUhhbmRsZXJzLCBldmVudF0gb2YgT2JqZWN0LmVudHJpZXMoc3RvcmVFbGVtZW50RXZlbnQpKSB7XG4gICAgICBjb25zdCBoYW5kbGVyS2V5ID0ga2V5SGFuZGxlcnMucmVwbGFjZShzdHJpcFVpZFJlZ2V4LCAnJylcblxuICAgICAgaWYgKCFpbk5hbWVzcGFjZSB8fCBvcmlnaW5hbFR5cGVFdmVudC5pbmNsdWRlcyhoYW5kbGVyS2V5KSkge1xuICAgICAgICByZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBldmVudC5jYWxsYWJsZSwgZXZlbnQuZGVsZWdhdGlvblNlbGVjdG9yKVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICB0cmlnZ2VyKGVsZW1lbnQsIGV2ZW50LCBhcmdzKSB7XG4gICAgaWYgKHR5cGVvZiBldmVudCAhPT0gJ3N0cmluZycgfHwgIWVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgY29uc3QgJCA9IGdldGpRdWVyeSgpXG4gICAgY29uc3QgdHlwZUV2ZW50ID0gZ2V0VHlwZUV2ZW50KGV2ZW50KVxuICAgIGNvbnN0IGluTmFtZXNwYWNlID0gZXZlbnQgIT09IHR5cGVFdmVudFxuXG4gICAgbGV0IGpRdWVyeUV2ZW50ID0gbnVsbFxuICAgIGxldCBidWJibGVzID0gdHJ1ZVxuICAgIGxldCBuYXRpdmVEaXNwYXRjaCA9IHRydWVcbiAgICBsZXQgZGVmYXVsdFByZXZlbnRlZCA9IGZhbHNlXG5cbiAgICBpZiAoaW5OYW1lc3BhY2UgJiYgJCkge1xuICAgICAgalF1ZXJ5RXZlbnQgPSAkLkV2ZW50KGV2ZW50LCBhcmdzKVxuXG4gICAgICAkKGVsZW1lbnQpLnRyaWdnZXIoalF1ZXJ5RXZlbnQpXG4gICAgICBidWJibGVzID0gIWpRdWVyeUV2ZW50LmlzUHJvcGFnYXRpb25TdG9wcGVkKClcbiAgICAgIG5hdGl2ZURpc3BhdGNoID0gIWpRdWVyeUV2ZW50LmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkKClcbiAgICAgIGRlZmF1bHRQcmV2ZW50ZWQgPSBqUXVlcnlFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKVxuICAgIH1cblxuICAgIGNvbnN0IGV2dCA9IGh5ZHJhdGVPYmoobmV3IEV2ZW50KGV2ZW50LCB7IGJ1YmJsZXMsIGNhbmNlbGFibGU6IHRydWUgfSksIGFyZ3MpXG5cbiAgICBpZiAoZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICB9XG5cbiAgICBpZiAobmF0aXZlRGlzcGF0Y2gpIHtcbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldnQpXG4gICAgfVxuXG4gICAgaWYgKGV2dC5kZWZhdWx0UHJldmVudGVkICYmIGpRdWVyeUV2ZW50KSB7XG4gICAgICBqUXVlcnlFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfVxuXG4gICAgcmV0dXJuIGV2dFxuICB9XG59XG5cbmZ1bmN0aW9uIGh5ZHJhdGVPYmoob2JqLCBtZXRhID0ge30pIHtcbiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMobWV0YSkpIHtcbiAgICB0cnkge1xuICAgICAgb2JqW2tleV0gPSB2YWx1ZVxuICAgIH0gY2F0Y2gge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmpcbn1cblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRIYW5kbGVyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7QUFPQSxZQUFNQSxVQUFVO0FBQ2hCLFlBQU1DLDBCQUEwQjtBQUNoQyxZQUFNQyxpQkFBaUI7QUFPdkIsWUFBTUMsZ0JBQWdCQyxxQ0FBWTtBQUNoQyxZQUFJQSxZQUFZQyxPQUFPQyxPQUFPRCxPQUFPQyxJQUFJQyxRQUFRO0FBRS9DSCxxQkFBV0EsU0FBU0ksUUFBUSxpQkFBaUIsQ0FBQ0MsT0FBT0MsT0FBTyxJQUFJSixJQUFJQyxPQUFPRyxFQUFFLENBQUMsRUFBRTtRQUNsRjtBQUVBLGVBQU9OO01BQ1QsR0FQc0JBO0FBVXRCLFlBQU1PLFNBQVNDLG1DQUFVO0FBQ3ZCLFlBQUlBLFdBQVcsUUFBUUEsV0FBV0MsUUFBVztBQUMzQyxpQkFB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QVk7V0FBTSxHQUFHWixJQUFJO0FBRTVFLGNBQUlNLGtCQUFrQjtBQUNwQkssZ0JBQUlFLGVBQWM7VUFDcEI7QUFFQSxjQUFJUixnQkFBZ0I7QUFDbEJyRSxvQkFBUThFLGNBQWNILEdBQUc7VUFDM0I7QUFFQSxjQUFJQSxJQUFJTCxvQkFBb0JILGFBQWE7QUFDdkNBLHdCQUFZVSxlQUFjO1VBQzVCO0FBRUEsaUJBQU9GO1FBQ1Q7TUFDRjtBQUVBLGVBQVNwRSxXQUFXd0UsS0FBS0MsT0FBTyxDQUFBLEdBQUk7QUFDbEMsbUJBQVcsQ0FBQ0MsS0FBS0MsS0FBSyxLQUFLekQsT0FBTzBCLFFBQVE2QixJQUFJLEdBQUc7QUFDL0MsY0FBSTtBQUNGRCxnQkFBSUUsR0FBRyxJQUFJQztVQUNiLFNBQUVDLFNBQU07QUFDTjFELG1CQUFPMkQsZUFBZUwsS0FBS0UsS0FBSztjQUM5QkksY0FBYztjQUNkQyxNQUFNO0FBQ0osdUJBQU9KO2NBQ1Q7WUFDRixDQUFDO1VBQ0g7UUFDRjtBQUVBLGVBQU9IO01BQ1Q7QUFmU3hFOzs7OzsiLAogICJuYW1lcyI6IFsiTUFYX1VJRCIsICJNSUxMSVNFQ09ORFNfTVVMVElQTElFUiIsICJUUkFOU0lUSU9OX0VORCIsICJwYXJzZVNlbGVjdG9yIiwgInNlbGVjdG9yIiwgIndpbmRvdyIsICJDU1MiLCAiZXNjYXBlIiwgInJlcGxhY2UiLCAibWF0Y2giLCAiaWQiLCAidG9UeXBlIiwgIm9iamVjdCIsICJ1bmRlZmluZWQiLCAiT2JqZWN0IiwgInByb3RvdHlwZSIsICJ0b1N0cmluZyIsICJjYWxsIiwgInRvTG93ZXJDYXNlIiwgImdldFVJRCIsICJwcmVmaXgiLCAiTWF0aCIsICJmbG9vciIsICJyYW5kb20iLCAiZG9jdW1lbnQiLCAiZ2V0RWxlbWVudEJ5SWQiLCAiZ2V0VHJhbnNpdGlvbkR1cmF0aW9uRnJvbUVsZW1lbnQiLCAiZWxlbWVudCIsICJ0cmFuc2l0aW9uRHVyYXRpb24iLCAidHJhbnNpdGlvbkRlbGF5IiwgImdldENvbXB1dGVkU3R5bGUiLCAiZmxvYXRUcmFuc2l0aW9uRHVyYXRpb24iLCAiTnVtYmVyIiwgInBhcnNlRmxvYXQiLCAiZmxvYXRUcmFuc2l0aW9uRGVsYXkiLCAic3BsaXQiLCAidHJpZ2dlclRyYW5zaXRpb25FbmQiLCAiZGlzcGF0Y2hFdmVudCIsICJFdmVudCIsICJpc0VsZW1lbnQiLCAianF1ZXJ5IiwgIm5vZGVUeXBlIiwgImdldEVsZW1lbnQiLCAibGVuZ3RoIiwgInF1ZXJ5U2VsZWN0b3IiLCAiaXNWaXNpYmxlIiwgImdldENsaWVudFJlY3RzIiwgImVsZW1lbnRJc1Zpc2libGUiLCAiZ2V0UHJvcGVydHlWYWx1ZSIsICJjbG9zZWREZXRhaWxzIiwgImNsb3Nlc3QiLCAic3VtbWFyeSIsICJwYXJlbnROb2RlIiwgImlzRGlzYWJsZWQiLCAiTm9kZSIsICJFTEVNRU5UX05PREUiLCAiY2xhc3NMaXN0IiwgImNvbnRhaW5zIiwgImRpc2FibGVkIiwgImhhc0F0dHJpYnV0ZSIsICJnZXRBdHRyaWJ1dGUiLCAiZmluZFNoYWRvd1Jvb3QiLCAiZG9jdW1lbnRFbGVtZW50IiwgImF0dGFjaFNoYWRvdyIsICJnZXRSb290Tm9kZSIsICJyb290IiwgIlNoYWRvd1Jvb3QiLCAibm9vcCIsICJyZWZsb3ciLCAib2Zmc2V0SGVpZ2h0IiwgImdldGpRdWVyeSIsICJqUXVlcnkiLCAiYm9keSIsICJET01Db250ZW50TG9hZGVkQ2FsbGJhY2tzIiwgIm9uRE9NQ29udGVudExvYWRlZCIsICJjYWxsYmFjayIsICJyZWFkeVN0YXRlIiwgImFkZEV2ZW50TGlzdGVuZXIiLCAicHVzaCIsICJpc1JUTCIsICJkaXIiLCAiZGVmaW5lSlF1ZXJ5UGx1Z2luIiwgInBsdWdpbiIsICIkIiwgIm5hbWUiLCAiTkFNRSIsICJKUVVFUllfTk9fQ09ORkxJQ1QiLCAiZm4iLCAialF1ZXJ5SW50ZXJmYWNlIiwgIkNvbnN0cnVjdG9yIiwgIm5vQ29uZmxpY3QiLCAiZXhlY3V0ZSIsICJwb3NzaWJsZUNhbGxiYWNrIiwgImFyZ3MiLCAiZGVmYXVsdFZhbHVlIiwgImV4ZWN1dGVBZnRlclRyYW5zaXRpb24iLCAidHJhbnNpdGlvbkVsZW1lbnQiLCAid2FpdEZvclRyYW5zaXRpb24iLCAiZHVyYXRpb25QYWRkaW5nIiwgImVtdWxhdGVkRHVyYXRpb24iLCAiY2FsbGVkIiwgImhhbmRsZXIiLCAidGFyZ2V0IiwgInJlbW92ZUV2ZW50TGlzdGVuZXIiLCAic2V0VGltZW91dCIsICJnZXROZXh0QWN0aXZlRWxlbWVudCIsICJsaXN0IiwgImFjdGl2ZUVsZW1lbnQiLCAic2hvdWxkR2V0TmV4dCIsICJpc0N5Y2xlQWxsb3dlZCIsICJsaXN0TGVuZ3RoIiwgImluZGV4IiwgImluZGV4T2YiLCAibWF4IiwgIm1pbiIsICJuYW1lc3BhY2VSZWdleCIsICJzdHJpcE5hbWVSZWdleCIsICJzdHJpcFVpZFJlZ2V4IiwgImV2ZW50UmVnaXN0cnkiLCAidWlkRXZlbnQiLCAiY3VzdG9tRXZlbnRzIiwgIm1vdXNlZW50ZXIiLCAibW91c2VsZWF2ZSIsICJuYXRpdmVFdmVudHMiLCAiU2V0IiwgIm1ha2VFdmVudFVpZCIsICJlbGVtZW50IiwgInVpZCIsICJnZXRFbGVtZW50RXZlbnRzIiwgImJvb3RzdHJhcEhhbmRsZXIiLCAiZm4iLCAiaGFuZGxlciIsICJldmVudCIsICJoeWRyYXRlT2JqIiwgImRlbGVnYXRlVGFyZ2V0IiwgIm9uZU9mZiIsICJFdmVudEhhbmRsZXIiLCAib2ZmIiwgInR5cGUiLCAiYXBwbHkiLCAiYm9vdHN0cmFwRGVsZWdhdGlvbkhhbmRsZXIiLCAic2VsZWN0b3IiLCAiZG9tRWxlbWVudHMiLCAicXVlcnlTZWxlY3RvckFsbCIsICJ0YXJnZXQiLCAicGFyZW50Tm9kZSIsICJkb21FbGVtZW50IiwgImZpbmRIYW5kbGVyIiwgImV2ZW50cyIsICJjYWxsYWJsZSIsICJkZWxlZ2F0aW9uU2VsZWN0b3IiLCAiT2JqZWN0IiwgInZhbHVlcyIsICJmaW5kIiwgIm5vcm1hbGl6ZVBhcmFtZXRlcnMiLCAib3JpZ2luYWxUeXBlRXZlbnQiLCAiZGVsZWdhdGlvbkZ1bmN0aW9uIiwgImlzRGVsZWdhdGVkIiwgInR5cGVFdmVudCIsICJnZXRUeXBlRXZlbnQiLCAiaGFzIiwgImFkZEhhbmRsZXIiLCAid3JhcEZ1bmN0aW9uIiwgInJlbGF0ZWRUYXJnZXQiLCAiY29udGFpbnMiLCAiY2FsbCIsICJoYW5kbGVycyIsICJwcmV2aW91c0Z1bmN0aW9uIiwgInJlcGxhY2UiLCAiYWRkRXZlbnRMaXN0ZW5lciIsICJyZW1vdmVIYW5kbGVyIiwgInJlbW92ZUV2ZW50TGlzdGVuZXIiLCAiQm9vbGVhbiIsICJyZW1vdmVOYW1lc3BhY2VkSGFuZGxlcnMiLCAibmFtZXNwYWNlIiwgInN0b3JlRWxlbWVudEV2ZW50IiwgImhhbmRsZXJLZXkiLCAiZW50cmllcyIsICJpbmNsdWRlcyIsICJvbiIsICJvbmUiLCAiaW5OYW1lc3BhY2UiLCAiaXNOYW1lc3BhY2UiLCAic3RhcnRzV2l0aCIsICJrZXlzIiwgImxlbmd0aCIsICJlbGVtZW50RXZlbnQiLCAic2xpY2UiLCAia2V5SGFuZGxlcnMiLCAidHJpZ2dlciIsICJhcmdzIiwgIiQiLCAiZ2V0alF1ZXJ5IiwgImpRdWVyeUV2ZW50IiwgImJ1YmJsZXMiLCAibmF0aXZlRGlzcGF0Y2giLCAiZGVmYXVsdFByZXZlbnRlZCIsICJFdmVudCIsICJpc1Byb3BhZ2F0aW9uU3RvcHBlZCIsICJpc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCIsICJpc0RlZmF1bHRQcmV2ZW50ZWQiLCAiZXZ0IiwgImNhbmNlbGFibGUiLCAicHJldmVudERlZmF1bHQiLCAiZGlzcGF0Y2hFdmVudCIsICJvYmoiLCAibWV0YSIsICJrZXkiLCAidmFsdWUiLCAiX3VudXNlZCIsICJkZWZpbmVQcm9wZXJ0eSIsICJjb25maWd1cmFibGUiLCAiZ2V0Il0KfQo=
