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

// public/theme/boost/js/esm/src/bootstrap/util/config.js
var require_config = __commonJS({
  "public/theme/boost/js/esm/src/bootstrap/util/config.js"(exports, module) {
    "use strict";
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_manipulator(), require_util()) : typeof define === "function" && define.amd ? define(["../dom/manipulator", "./index"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Config = factory(global.Manipulator, global.Index));
    })(exports, (function(Manipulator, index_js) {
      "use strict";
      class Config {
        static {
          __name(this, "Config");
        }
        // Getters
        static get Default() {
          return {};
        }
        static get DefaultType() {
          return {};
        }
        static get NAME() {
          throw new Error('You have to implement the static method "NAME", for each component!');
        }
        _getConfig(config) {
          config = this._mergeConfigObj(config);
          config = this._configAfterMerge(config);
          this._typeCheckConfig(config);
          return config;
        }
        _configAfterMerge(config) {
          return config;
        }
        _mergeConfigObj(config, element) {
          const jsonConfig = index_js.isElement(element) ? Manipulator.getDataAttribute(element, "config") : {};
          return {
            ...this.constructor.Default,
            ...typeof jsonConfig === "object" ? jsonConfig : {},
            ...index_js.isElement(element) ? Manipulator.getDataAttributes(element) : {},
            ...typeof config === "object" ? config : {}
          };
        }
        _typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
          for (const [property, expectedTypes] of Object.entries(configTypes)) {
            const value = config[property];
            const valueType = index_js.isElement(value) ? "element" : index_js.toType(value);
            if (!new RegExp(expectedTypes).test(valueType)) {
              throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
            }
          }
        }
      }
      return Config;
    }));
  }
});

// public/theme/boost/js/esm/src/bootstrap/util/swipe.js
var require_swipe = __commonJS({
  "public/theme/boost/js/esm/src/bootstrap/util/swipe.js"(exports, module) {
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_event_handler(), require_config(), require_util()) : typeof define === "function" && define.amd ? define(["../dom/event-handler", "./config", "./index"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Swipe = factory(global.EventHandler, global.Config, global.Index));
    })(exports, (function(EventHandler, Config, index_js) {
      "use strict";
      const NAME = "swipe";
      const EVENT_KEY = ".bs.swipe";
      const EVENT_TOUCHSTART = `touchstart${EVENT_KEY}`;
      const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY}`;
      const EVENT_TOUCHEND = `touchend${EVENT_KEY}`;
      const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY}`;
      const EVENT_POINTERUP = `pointerup${EVENT_KEY}`;
      const POINTER_TYPE_TOUCH = "touch";
      const POINTER_TYPE_PEN = "pen";
      const CLASS_NAME_POINTER_EVENT = "pointer-event";
      const SWIPE_THRESHOLD = 40;
      const Default = {
        endCallback: null,
        leftCallback: null,
        rightCallback: null
      };
      const DefaultType = {
        endCallback: "(function|null)",
        leftCallback: "(function|null)",
        rightCallback: "(function|null)"
      };
      class Swipe extends Config {
        static {
          __name(this, "Swipe");
        }
        constructor(element, config) {
          super();
          this._element = element;
          if (!element || !Swipe.isSupported()) {
            return;
          }
          this._config = this._getConfig(config);
          this._deltaX = 0;
          this._supportPointerEvents = Boolean(window.PointerEvent);
          this._initEvents();
        }
        // Getters
        static get Default() {
          return Default;
        }
        static get DefaultType() {
          return DefaultType;
        }
        static get NAME() {
          return NAME;
        }
        // Public
        dispose() {
          EventHandler.off(this._element, EVENT_KEY);
        }
        // Private
        _start(event) {
          if (!this._supportPointerEvents) {
            this._deltaX = event.touches[0].clientX;
            return;
          }
          if (this._eventIsPointerPenTouch(event)) {
            this._deltaX = event.clientX;
          }
        }
        _end(event) {
          if (this._eventIsPointerPenTouch(event)) {
            this._deltaX = event.clientX - this._deltaX;
          }
          this._handleSwipe();
          index_js.execute(this._config.endCallback);
        }
        _move(event) {
          this._deltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this._deltaX;
        }
        _handleSwipe() {
          const absDeltaX = Math.abs(this._deltaX);
          if (absDeltaX <= SWIPE_THRESHOLD) {
            return;
          }
          const direction = absDeltaX / this._deltaX;
          this._deltaX = 0;
          if (!direction) {
            return;
          }
          index_js.execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback);
        }
        _initEvents() {
          if (this._supportPointerEvents) {
            EventHandler.on(this._element, EVENT_POINTERDOWN, (event) => this._start(event));
            EventHandler.on(this._element, EVENT_POINTERUP, (event) => this._end(event));
            this._element.classList.add(CLASS_NAME_POINTER_EVENT);
          } else {
            EventHandler.on(this._element, EVENT_TOUCHSTART, (event) => this._start(event));
            EventHandler.on(this._element, EVENT_TOUCHMOVE, (event) => this._move(event));
            EventHandler.on(this._element, EVENT_TOUCHEND, (event) => this._end(event));
          }
        }
        _eventIsPointerPenTouch(event) {
          return this._supportPointerEvents && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
        }
        // Static
        static isSupported() {
          return "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0;
        }
      }
      return Swipe;
    }));
  }
});
export default require_swipe();
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
  * Bootstrap manipulator.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
/*!
  * Bootstrap config.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
/*!
  * Bootstrap swipe.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL3NyYy91dGlsL2luZGV4LmpzIiwgIi4uLy4uLy4uL3NyYy9zcmMvZG9tL2V2ZW50LWhhbmRsZXIuanMiLCAiLi4vLi4vLi4vc3JjL3NyYy9kb20vbWFuaXB1bGF0b3IuanMiLCAiLi4vLi4vLi4vc3JjL3NyYy91dGlsL2NvbmZpZy5qcyIsICIuLi8uLi8uLi9zcmMvc3JjL3V0aWwvc3dpcGUuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEJvb3RzdHJhcCB1dGlsL2luZGV4LmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuY29uc3QgTUFYX1VJRCA9IDFfMDAwXzAwMFxuY29uc3QgTUlMTElTRUNPTkRTX01VTFRJUExJRVIgPSAxMDAwXG5jb25zdCBUUkFOU0lUSU9OX0VORCA9ICd0cmFuc2l0aW9uZW5kJ1xuXG4vKipcbiAqIFByb3Blcmx5IGVzY2FwZSBJRHMgc2VsZWN0b3JzIHRvIGhhbmRsZSB3ZWlyZCBJRHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuY29uc3QgcGFyc2VTZWxlY3RvciA9IHNlbGVjdG9yID0+IHtcbiAgaWYgKHNlbGVjdG9yICYmIHdpbmRvdy5DU1MgJiYgd2luZG93LkNTUy5lc2NhcGUpIHtcbiAgICAvLyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yIG5lZWRzIGVzY2FwaW5nIHRvIGhhbmRsZSBJRHMgKGh0bWw1KykgY29udGFpbmluZyBmb3IgaW5zdGFuY2UgL1xuICAgIHNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgvIyhbXlxcc1wiIyddKykvZywgKG1hdGNoLCBpZCkgPT4gYCMke0NTUy5lc2NhcGUoaWQpfWApXG4gIH1cblxuICByZXR1cm4gc2VsZWN0b3Jcbn1cblxuLy8gU2hvdXQtb3V0IEFuZ3VzIENyb2xsIChodHRwczovL2dvby5nbC9weHdRR3ApXG5jb25zdCB0b1R5cGUgPSBvYmplY3QgPT4ge1xuICBpZiAob2JqZWN0ID09PSBudWxsIHx8IG9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGAke29iamVjdH1gXG4gIH1cblxuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkubWF0Y2goL1xccyhbYS16XSspL2kpWzFdLnRvTG93ZXJDYXNlKClcbn1cblxuLyoqXG4gKiBQdWJsaWMgVXRpbCBBUElcbiAqL1xuXG5jb25zdCBnZXRVSUQgPSBwcmVmaXggPT4ge1xuICBkbyB7XG4gICAgcHJlZml4ICs9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIE1BWF9VSUQpXG4gIH0gd2hpbGUgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHByZWZpeCkpXG5cbiAgcmV0dXJuIHByZWZpeFxufVxuXG5jb25zdCBnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCA9IGVsZW1lbnQgPT4ge1xuICBpZiAoIWVsZW1lbnQpIHtcbiAgICByZXR1cm4gMFxuICB9XG5cbiAgLy8gR2V0IHRyYW5zaXRpb24tZHVyYXRpb24gb2YgdGhlIGVsZW1lbnRcbiAgbGV0IHsgdHJhbnNpdGlvbkR1cmF0aW9uLCB0cmFuc2l0aW9uRGVsYXkgfSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpXG5cbiAgY29uc3QgZmxvYXRUcmFuc2l0aW9uRHVyYXRpb24gPSBOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRHVyYXRpb24pXG4gIGNvbnN0IGZsb2F0VHJhbnNpdGlvbkRlbGF5ID0gTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkRlbGF5KVxuXG4gIC8vIFJldHVybiAwIGlmIGVsZW1lbnQgb3IgdHJhbnNpdGlvbiBkdXJhdGlvbiBpcyBub3QgZm91bmRcbiAgaWYgKCFmbG9hdFRyYW5zaXRpb25EdXJhdGlvbiAmJiAhZmxvYXRUcmFuc2l0aW9uRGVsYXkpIHtcbiAgICByZXR1cm4gMFxuICB9XG5cbiAgLy8gSWYgbXVsdGlwbGUgZHVyYXRpb25zIGFyZSBkZWZpbmVkLCB0YWtlIHRoZSBmaXJzdFxuICB0cmFuc2l0aW9uRHVyYXRpb24gPSB0cmFuc2l0aW9uRHVyYXRpb24uc3BsaXQoJywnKVswXVxuICB0cmFuc2l0aW9uRGVsYXkgPSB0cmFuc2l0aW9uRGVsYXkuc3BsaXQoJywnKVswXVxuXG4gIHJldHVybiAoTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkR1cmF0aW9uKSArIE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EZWxheSkpICogTUlMTElTRUNPTkRTX01VTFRJUExJRVJcbn1cblxuY29uc3QgdHJpZ2dlclRyYW5zaXRpb25FbmQgPSBlbGVtZW50ID0+IHtcbiAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChUUkFOU0lUSU9OX0VORCkpXG59XG5cbmNvbnN0IGlzRWxlbWVudCA9IG9iamVjdCA9PiB7XG4gIGlmICghb2JqZWN0IHx8IHR5cGVvZiBvYmplY3QgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBpZiAodHlwZW9mIG9iamVjdC5qcXVlcnkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgb2JqZWN0ID0gb2JqZWN0WzBdXG4gIH1cblxuICByZXR1cm4gdHlwZW9mIG9iamVjdC5ub2RlVHlwZSAhPT0gJ3VuZGVmaW5lZCdcbn1cblxuY29uc3QgZ2V0RWxlbWVudCA9IG9iamVjdCA9PiB7XG4gIC8vIGl0J3MgYSBqUXVlcnkgb2JqZWN0IG9yIGEgbm9kZSBlbGVtZW50XG4gIGlmIChpc0VsZW1lbnQob2JqZWN0KSkge1xuICAgIHJldHVybiBvYmplY3QuanF1ZXJ5ID8gb2JqZWN0WzBdIDogb2JqZWN0XG4gIH1cblxuICBpZiAodHlwZW9mIG9iamVjdCA9PT0gJ3N0cmluZycgJiYgb2JqZWN0Lmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihwYXJzZVNlbGVjdG9yKG9iamVjdCkpXG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG5jb25zdCBpc1Zpc2libGUgPSBlbGVtZW50ID0+IHtcbiAgaWYgKCFpc0VsZW1lbnQoZWxlbWVudCkgfHwgZWxlbWVudC5nZXRDbGllbnRSZWN0cygpLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgY29uc3QgZWxlbWVudElzVmlzaWJsZSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZSgndmlzaWJpbGl0eScpID09PSAndmlzaWJsZSdcbiAgLy8gSGFuZGxlIGBkZXRhaWxzYCBlbGVtZW50IGFzIGl0cyBjb250ZW50IG1heSBmYWxzaWUgYXBwZWFyIHZpc2libGUgd2hlbiBpdCBpcyBjbG9zZWRcbiAgY29uc3QgY2xvc2VkRGV0YWlscyA9IGVsZW1lbnQuY2xvc2VzdCgnZGV0YWlsczpub3QoW29wZW5dKScpXG5cbiAgaWYgKCFjbG9zZWREZXRhaWxzKSB7XG4gICAgcmV0dXJuIGVsZW1lbnRJc1Zpc2libGVcbiAgfVxuXG4gIGlmIChjbG9zZWREZXRhaWxzICE9PSBlbGVtZW50KSB7XG4gICAgY29uc3Qgc3VtbWFyeSA9IGVsZW1lbnQuY2xvc2VzdCgnc3VtbWFyeScpXG4gICAgaWYgKHN1bW1hcnkgJiYgc3VtbWFyeS5wYXJlbnROb2RlICE9PSBjbG9zZWREZXRhaWxzKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoc3VtbWFyeSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnRJc1Zpc2libGVcbn1cblxuY29uc3QgaXNEaXNhYmxlZCA9IGVsZW1lbnQgPT4ge1xuICBpZiAoIWVsZW1lbnQgfHwgZWxlbWVudC5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXNhYmxlZCcpKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGlmICh0eXBlb2YgZWxlbWVudC5kaXNhYmxlZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZWxlbWVudC5kaXNhYmxlZFxuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpICE9PSAnZmFsc2UnXG59XG5cbmNvbnN0IGZpbmRTaGFkb3dSb290ID0gZWxlbWVudCA9PiB7XG4gIGlmICghZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmF0dGFjaFNoYWRvdykge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICAvLyBDYW4gZmluZCB0aGUgc2hhZG93IHJvb3Qgb3RoZXJ3aXNlIGl0J2xsIHJldHVybiB0aGUgZG9jdW1lbnRcbiAgaWYgKHR5cGVvZiBlbGVtZW50LmdldFJvb3ROb2RlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY29uc3Qgcm9vdCA9IGVsZW1lbnQuZ2V0Um9vdE5vZGUoKVxuICAgIHJldHVybiByb290IGluc3RhbmNlb2YgU2hhZG93Um9vdCA/IHJvb3QgOiBudWxsXG4gIH1cblxuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpIHtcbiAgICByZXR1cm4gZWxlbWVudFxuICB9XG5cbiAgLy8gd2hlbiB3ZSBkb24ndCBmaW5kIGEgc2hhZG93IHJvb3RcbiAgaWYgKCFlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgcmV0dXJuIGZpbmRTaGFkb3dSb290KGVsZW1lbnQucGFyZW50Tm9kZSlcbn1cblxuY29uc3Qgbm9vcCA9ICgpID0+IHt9XG5cbi8qKlxuICogVHJpY2sgdG8gcmVzdGFydCBhbiBlbGVtZW50J3MgYW5pbWF0aW9uXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHJldHVybiB2b2lkXG4gKlxuICogQHNlZSBodHRwczovL3d3dy5oYXJyeXRoZW8uY29tL2Jsb2cvMjAyMS8wMi9yZXN0YXJ0LWEtY3NzLWFuaW1hdGlvbi13aXRoLWphdmFzY3JpcHQvI3Jlc3RhcnRpbmctYS1jc3MtYW5pbWF0aW9uXG4gKi9cbmNvbnN0IHJlZmxvdyA9IGVsZW1lbnQgPT4ge1xuICBlbGVtZW50Lm9mZnNldEhlaWdodCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xufVxuXG5jb25zdCBnZXRqUXVlcnkgPSAoKSA9PiB7XG4gIGlmICh3aW5kb3cualF1ZXJ5ICYmICFkb2N1bWVudC5ib2R5Lmhhc0F0dHJpYnV0ZSgnZGF0YS1icy1uby1qcXVlcnknKSkge1xuICAgIHJldHVybiB3aW5kb3cualF1ZXJ5XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG5jb25zdCBET01Db250ZW50TG9hZGVkQ2FsbGJhY2tzID0gW11cblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkID0gY2FsbGJhY2sgPT4ge1xuICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2xvYWRpbmcnKSB7XG4gICAgLy8gYWRkIGxpc3RlbmVyIG9uIHRoZSBmaXJzdCBjYWxsIHdoZW4gdGhlIGRvY3VtZW50IGlzIGluIGxvYWRpbmcgc3RhdGVcbiAgICBpZiAoIURPTUNvbnRlbnRMb2FkZWRDYWxsYmFja3MubGVuZ3RoKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIERPTUNvbnRlbnRMb2FkZWRDYWxsYmFja3MpIHtcbiAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgRE9NQ29udGVudExvYWRlZENhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKVxuICB9IGVsc2Uge1xuICAgIGNhbGxiYWNrKClcbiAgfVxufVxuXG5jb25zdCBpc1JUTCA9ICgpID0+IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5kaXIgPT09ICdydGwnXG5cbmNvbnN0IGRlZmluZUpRdWVyeVBsdWdpbiA9IHBsdWdpbiA9PiB7XG4gIG9uRE9NQ29udGVudExvYWRlZCgoKSA9PiB7XG4gICAgY29uc3QgJCA9IGdldGpRdWVyeSgpXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCQpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBwbHVnaW4uTkFNRVxuICAgICAgY29uc3QgSlFVRVJZX05PX0NPTkZMSUNUID0gJC5mbltuYW1lXVxuICAgICAgJC5mbltuYW1lXSA9IHBsdWdpbi5qUXVlcnlJbnRlcmZhY2VcbiAgICAgICQuZm5bbmFtZV0uQ29uc3RydWN0b3IgPSBwbHVnaW5cbiAgICAgICQuZm5bbmFtZV0ubm9Db25mbGljdCA9ICgpID0+IHtcbiAgICAgICAgJC5mbltuYW1lXSA9IEpRVUVSWV9OT19DT05GTElDVFxuICAgICAgICByZXR1cm4gcGx1Z2luLmpRdWVyeUludGVyZmFjZVxuICAgICAgfVxuICAgIH1cbiAgfSlcbn1cblxuY29uc3QgZXhlY3V0ZSA9IChwb3NzaWJsZUNhbGxiYWNrLCBhcmdzID0gW10sIGRlZmF1bHRWYWx1ZSA9IHBvc3NpYmxlQ2FsbGJhY2spID0+IHtcbiAgcmV0dXJuIHR5cGVvZiBwb3NzaWJsZUNhbGxiYWNrID09PSAnZnVuY3Rpb24nID8gcG9zc2libGVDYWxsYmFjay5jYWxsKC4uLmFyZ3MpIDogZGVmYXVsdFZhbHVlXG59XG5cbmNvbnN0IGV4ZWN1dGVBZnRlclRyYW5zaXRpb24gPSAoY2FsbGJhY2ssIHRyYW5zaXRpb25FbGVtZW50LCB3YWl0Rm9yVHJhbnNpdGlvbiA9IHRydWUpID0+IHtcbiAgaWYgKCF3YWl0Rm9yVHJhbnNpdGlvbikge1xuICAgIGV4ZWN1dGUoY2FsbGJhY2spXG4gICAgcmV0dXJuXG4gIH1cblxuICBjb25zdCBkdXJhdGlvblBhZGRpbmcgPSA1XG4gIGNvbnN0IGVtdWxhdGVkRHVyYXRpb24gPSBnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCh0cmFuc2l0aW9uRWxlbWVudCkgKyBkdXJhdGlvblBhZGRpbmdcblxuICBsZXQgY2FsbGVkID0gZmFsc2VcblxuICBjb25zdCBoYW5kbGVyID0gKHsgdGFyZ2V0IH0pID0+IHtcbiAgICBpZiAodGFyZ2V0ICE9PSB0cmFuc2l0aW9uRWxlbWVudCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY2FsbGVkID0gdHJ1ZVxuICAgIHRyYW5zaXRpb25FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoVFJBTlNJVElPTl9FTkQsIGhhbmRsZXIpXG4gICAgZXhlY3V0ZShjYWxsYmFjaylcbiAgfVxuXG4gIHRyYW5zaXRpb25FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoVFJBTlNJVElPTl9FTkQsIGhhbmRsZXIpXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGlmICghY2FsbGVkKSB7XG4gICAgICB0cmlnZ2VyVHJhbnNpdGlvbkVuZCh0cmFuc2l0aW9uRWxlbWVudClcbiAgICB9XG4gIH0sIGVtdWxhdGVkRHVyYXRpb24pXG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBwcmV2aW91cy9uZXh0IGVsZW1lbnQgb2YgYSBsaXN0LlxuICpcbiAqIEBwYXJhbSB7YXJyYXl9IGxpc3QgICAgVGhlIGxpc3Qgb2YgZWxlbWVudHNcbiAqIEBwYXJhbSBhY3RpdmVFbGVtZW50ICAgVGhlIGFjdGl2ZSBlbGVtZW50XG4gKiBAcGFyYW0gc2hvdWxkR2V0TmV4dCAgIENob29zZSB0byBnZXQgbmV4dCBvciBwcmV2aW91cyBlbGVtZW50XG4gKiBAcGFyYW0gaXNDeWNsZUFsbG93ZWRcbiAqIEByZXR1cm4ge0VsZW1lbnR8ZWxlbX0gVGhlIHByb3BlciBlbGVtZW50XG4gKi9cbmNvbnN0IGdldE5leHRBY3RpdmVFbGVtZW50ID0gKGxpc3QsIGFjdGl2ZUVsZW1lbnQsIHNob3VsZEdldE5leHQsIGlzQ3ljbGVBbGxvd2VkKSA9PiB7XG4gIGNvbnN0IGxpc3RMZW5ndGggPSBsaXN0Lmxlbmd0aFxuICBsZXQgaW5kZXggPSBsaXN0LmluZGV4T2YoYWN0aXZlRWxlbWVudClcblxuICAvLyBpZiB0aGUgZWxlbWVudCBkb2VzIG5vdCBleGlzdCBpbiB0aGUgbGlzdCByZXR1cm4gYW4gZWxlbWVudFxuICAvLyBkZXBlbmRpbmcgb24gdGhlIGRpcmVjdGlvbiBhbmQgaWYgY3ljbGUgaXMgYWxsb3dlZFxuICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgcmV0dXJuICFzaG91bGRHZXROZXh0ICYmIGlzQ3ljbGVBbGxvd2VkID8gbGlzdFtsaXN0TGVuZ3RoIC0gMV0gOiBsaXN0WzBdXG4gIH1cblxuICBpbmRleCArPSBzaG91bGRHZXROZXh0ID8gMSA6IC0xXG5cbiAgaWYgKGlzQ3ljbGVBbGxvd2VkKSB7XG4gICAgaW5kZXggPSAoaW5kZXggKyBsaXN0TGVuZ3RoKSAlIGxpc3RMZW5ndGhcbiAgfVxuXG4gIHJldHVybiBsaXN0W01hdGgubWF4KDAsIE1hdGgubWluKGluZGV4LCBsaXN0TGVuZ3RoIC0gMSkpXVxufVxuXG5leHBvcnQge1xuICBkZWZpbmVKUXVlcnlQbHVnaW4sXG4gIGV4ZWN1dGUsXG4gIGV4ZWN1dGVBZnRlclRyYW5zaXRpb24sXG4gIGZpbmRTaGFkb3dSb290LFxuICBnZXRFbGVtZW50LFxuICBnZXRqUXVlcnksXG4gIGdldE5leHRBY3RpdmVFbGVtZW50LFxuICBnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCxcbiAgZ2V0VUlELFxuICBpc0Rpc2FibGVkLFxuICBpc0VsZW1lbnQsXG4gIGlzUlRMLFxuICBpc1Zpc2libGUsXG4gIG5vb3AsXG4gIG9uRE9NQ29udGVudExvYWRlZCxcbiAgcGFyc2VTZWxlY3RvcixcbiAgcmVmbG93LFxuICB0cmlnZ2VyVHJhbnNpdGlvbkVuZCxcbiAgdG9UeXBlXG59XG4iLCAiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQm9vdHN0cmFwIGRvbS9ldmVudC1oYW5kbGVyLmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuaW1wb3J0IHsgZ2V0alF1ZXJ5IH0gZnJvbSAnLi4vdXRpbC9pbmRleC5qcydcblxuLyoqXG4gKiBDb25zdGFudHNcbiAqL1xuXG5jb25zdCBuYW1lc3BhY2VSZWdleCA9IC9bXi5dKig/PVxcLi4qKVxcLnwuKi9cbmNvbnN0IHN0cmlwTmFtZVJlZ2V4ID0gL1xcLi4qL1xuY29uc3Qgc3RyaXBVaWRSZWdleCA9IC86OlxcZCskL1xuY29uc3QgZXZlbnRSZWdpc3RyeSA9IHt9IC8vIEV2ZW50cyBzdG9yYWdlXG5sZXQgdWlkRXZlbnQgPSAxXG5jb25zdCBjdXN0b21FdmVudHMgPSB7XG4gIG1vdXNlZW50ZXI6ICdtb3VzZW92ZXInLFxuICBtb3VzZWxlYXZlOiAnbW91c2VvdXQnXG59XG5cbmNvbnN0IG5hdGl2ZUV2ZW50cyA9IG5ldyBTZXQoW1xuICAnY2xpY2snLFxuICAnZGJsY2xpY2snLFxuICAnbW91c2V1cCcsXG4gICdtb3VzZWRvd24nLFxuICAnY29udGV4dG1lbnUnLFxuICAnbW91c2V3aGVlbCcsXG4gICdET01Nb3VzZVNjcm9sbCcsXG4gICdtb3VzZW92ZXInLFxuICAnbW91c2VvdXQnLFxuICAnbW91c2Vtb3ZlJyxcbiAgJ3NlbGVjdHN0YXJ0JyxcbiAgJ3NlbGVjdGVuZCcsXG4gICdrZXlkb3duJyxcbiAgJ2tleXByZXNzJyxcbiAgJ2tleXVwJyxcbiAgJ29yaWVudGF0aW9uY2hhbmdlJyxcbiAgJ3RvdWNoc3RhcnQnLFxuICAndG91Y2htb3ZlJyxcbiAgJ3RvdWNoZW5kJyxcbiAgJ3RvdWNoY2FuY2VsJyxcbiAgJ3BvaW50ZXJkb3duJyxcbiAgJ3BvaW50ZXJtb3ZlJyxcbiAgJ3BvaW50ZXJ1cCcsXG4gICdwb2ludGVybGVhdmUnLFxuICAncG9pbnRlcmNhbmNlbCcsXG4gICdnZXN0dXJlc3RhcnQnLFxuICAnZ2VzdHVyZWNoYW5nZScsXG4gICdnZXN0dXJlZW5kJyxcbiAgJ2ZvY3VzJyxcbiAgJ2JsdXInLFxuICAnY2hhbmdlJyxcbiAgJ3Jlc2V0JyxcbiAgJ3NlbGVjdCcsXG4gICdzdWJtaXQnLFxuICAnZm9jdXNpbicsXG4gICdmb2N1c291dCcsXG4gICdsb2FkJyxcbiAgJ3VubG9hZCcsXG4gICdiZWZvcmV1bmxvYWQnLFxuICAncmVzaXplJyxcbiAgJ21vdmUnLFxuICAnRE9NQ29udGVudExvYWRlZCcsXG4gICdyZWFkeXN0YXRlY2hhbmdlJyxcbiAgJ2Vycm9yJyxcbiAgJ2Fib3J0JyxcbiAgJ3Njcm9sbCdcbl0pXG5cbi8qKlxuICogUHJpdmF0ZSBtZXRob2RzXG4gKi9cblxuZnVuY3Rpb24gbWFrZUV2ZW50VWlkKGVsZW1lbnQsIHVpZCkge1xuICByZXR1cm4gKHVpZCAmJiBgJHt1aWR9Ojoke3VpZEV2ZW50Kyt9YCkgfHwgZWxlbWVudC51aWRFdmVudCB8fCB1aWRFdmVudCsrXG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnRFdmVudHMoZWxlbWVudCkge1xuICBjb25zdCB1aWQgPSBtYWtlRXZlbnRVaWQoZWxlbWVudClcblxuICBlbGVtZW50LnVpZEV2ZW50ID0gdWlkXG4gIGV2ZW50UmVnaXN0cnlbdWlkXSA9IGV2ZW50UmVnaXN0cnlbdWlkXSB8fCB7fVxuXG4gIHJldHVybiBldmVudFJlZ2lzdHJ5W3VpZF1cbn1cblxuZnVuY3Rpb24gYm9vdHN0cmFwSGFuZGxlcihlbGVtZW50LCBmbikge1xuICByZXR1cm4gZnVuY3Rpb24gaGFuZGxlcihldmVudCkge1xuICAgIGh5ZHJhdGVPYmooZXZlbnQsIHsgZGVsZWdhdGVUYXJnZXQ6IGVsZW1lbnQgfSlcblxuICAgIGlmIChoYW5kbGVyLm9uZU9mZikge1xuICAgICAgRXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCBldmVudC50eXBlLCBmbilcbiAgICB9XG5cbiAgICByZXR1cm4gZm4uYXBwbHkoZWxlbWVudCwgW2V2ZW50XSlcbiAgfVxufVxuXG5mdW5jdGlvbiBib290c3RyYXBEZWxlZ2F0aW9uSGFuZGxlcihlbGVtZW50LCBzZWxlY3RvciwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQpIHtcbiAgICBjb25zdCBkb21FbGVtZW50cyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcilcblxuICAgIGZvciAobGV0IHsgdGFyZ2V0IH0gPSBldmVudDsgdGFyZ2V0ICYmIHRhcmdldCAhPT0gdGhpczsgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGUpIHtcbiAgICAgIGZvciAoY29uc3QgZG9tRWxlbWVudCBvZiBkb21FbGVtZW50cykge1xuICAgICAgICBpZiAoZG9tRWxlbWVudCAhPT0gdGFyZ2V0KSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIGh5ZHJhdGVPYmooZXZlbnQsIHsgZGVsZWdhdGVUYXJnZXQ6IHRhcmdldCB9KVxuXG4gICAgICAgIGlmIChoYW5kbGVyLm9uZU9mZikge1xuICAgICAgICAgIEV2ZW50SGFuZGxlci5vZmYoZWxlbWVudCwgZXZlbnQudHlwZSwgc2VsZWN0b3IsIGZuKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRhcmdldCwgW2V2ZW50XSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZEhhbmRsZXIoZXZlbnRzLCBjYWxsYWJsZSwgZGVsZWdhdGlvblNlbGVjdG9yID0gbnVsbCkge1xuICByZXR1cm4gT2JqZWN0LnZhbHVlcyhldmVudHMpXG4gICAgLmZpbmQoZXZlbnQgPT4gZXZlbnQuY2FsbGFibGUgPT09IGNhbGxhYmxlICYmIGV2ZW50LmRlbGVnYXRpb25TZWxlY3RvciA9PT0gZGVsZWdhdGlvblNlbGVjdG9yKVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVQYXJhbWV0ZXJzKG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcbiAgY29uc3QgaXNEZWxlZ2F0ZWQgPSB0eXBlb2YgaGFuZGxlciA9PT0gJ3N0cmluZydcbiAgLy8gVE9ETzogdG9vbHRpcCBwYXNzZXMgYGZhbHNlYCBpbnN0ZWFkIG9mIHNlbGVjdG9yLCBzbyB3ZSBuZWVkIHRvIGNoZWNrXG4gIGNvbnN0IGNhbGxhYmxlID0gaXNEZWxlZ2F0ZWQgPyBkZWxlZ2F0aW9uRnVuY3Rpb24gOiAoaGFuZGxlciB8fCBkZWxlZ2F0aW9uRnVuY3Rpb24pXG4gIGxldCB0eXBlRXZlbnQgPSBnZXRUeXBlRXZlbnQob3JpZ2luYWxUeXBlRXZlbnQpXG5cbiAgaWYgKCFuYXRpdmVFdmVudHMuaGFzKHR5cGVFdmVudCkpIHtcbiAgICB0eXBlRXZlbnQgPSBvcmlnaW5hbFR5cGVFdmVudFxuICB9XG5cbiAgcmV0dXJuIFtpc0RlbGVnYXRlZCwgY2FsbGFibGUsIHR5cGVFdmVudF1cbn1cblxuZnVuY3Rpb24gYWRkSGFuZGxlcihlbGVtZW50LCBvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uLCBvbmVPZmYpIHtcbiAgaWYgKHR5cGVvZiBvcmlnaW5hbFR5cGVFdmVudCAhPT0gJ3N0cmluZycgfHwgIWVsZW1lbnQpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGxldCBbaXNEZWxlZ2F0ZWQsIGNhbGxhYmxlLCB0eXBlRXZlbnRdID0gbm9ybWFsaXplUGFyYW1ldGVycyhvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKVxuXG4gIC8vIGluIGNhc2Ugb2YgbW91c2VlbnRlciBvciBtb3VzZWxlYXZlIHdyYXAgdGhlIGhhbmRsZXIgd2l0aGluIGEgZnVuY3Rpb24gdGhhdCBjaGVja3MgZm9yIGl0cyBET00gcG9zaXRpb25cbiAgLy8gdGhpcyBwcmV2ZW50cyB0aGUgaGFuZGxlciBmcm9tIGJlaW5nIGRpc3BhdGNoZWQgdGhlIHNhbWUgd2F5IGFzIG1vdXNlb3ZlciBvciBtb3VzZW91dCBkb2VzXG4gIGlmIChvcmlnaW5hbFR5cGVFdmVudCBpbiBjdXN0b21FdmVudHMpIHtcbiAgICBjb25zdCB3cmFwRnVuY3Rpb24gPSBmbiA9PiB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmICghZXZlbnQucmVsYXRlZFRhcmdldCB8fCAoZXZlbnQucmVsYXRlZFRhcmdldCAhPT0gZXZlbnQuZGVsZWdhdGVUYXJnZXQgJiYgIWV2ZW50LmRlbGVnYXRlVGFyZ2V0LmNvbnRhaW5zKGV2ZW50LnJlbGF0ZWRUYXJnZXQpKSkge1xuICAgICAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGV2ZW50KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2FsbGFibGUgPSB3cmFwRnVuY3Rpb24oY2FsbGFibGUpXG4gIH1cblxuICBjb25zdCBldmVudHMgPSBnZXRFbGVtZW50RXZlbnRzKGVsZW1lbnQpXG4gIGNvbnN0IGhhbmRsZXJzID0gZXZlbnRzW3R5cGVFdmVudF0gfHwgKGV2ZW50c1t0eXBlRXZlbnRdID0ge30pXG4gIGNvbnN0IHByZXZpb3VzRnVuY3Rpb24gPSBmaW5kSGFuZGxlcihoYW5kbGVycywgY2FsbGFibGUsIGlzRGVsZWdhdGVkID8gaGFuZGxlciA6IG51bGwpXG5cbiAgaWYgKHByZXZpb3VzRnVuY3Rpb24pIHtcbiAgICBwcmV2aW91c0Z1bmN0aW9uLm9uZU9mZiA9IHByZXZpb3VzRnVuY3Rpb24ub25lT2ZmICYmIG9uZU9mZlxuXG4gICAgcmV0dXJuXG4gIH1cblxuICBjb25zdCB1aWQgPSBtYWtlRXZlbnRVaWQoY2FsbGFibGUsIG9yaWdpbmFsVHlwZUV2ZW50LnJlcGxhY2UobmFtZXNwYWNlUmVnZXgsICcnKSlcbiAgY29uc3QgZm4gPSBpc0RlbGVnYXRlZCA/XG4gICAgYm9vdHN0cmFwRGVsZWdhdGlvbkhhbmRsZXIoZWxlbWVudCwgaGFuZGxlciwgY2FsbGFibGUpIDpcbiAgICBib290c3RyYXBIYW5kbGVyKGVsZW1lbnQsIGNhbGxhYmxlKVxuXG4gIGZuLmRlbGVnYXRpb25TZWxlY3RvciA9IGlzRGVsZWdhdGVkID8gaGFuZGxlciA6IG51bGxcbiAgZm4uY2FsbGFibGUgPSBjYWxsYWJsZVxuICBmbi5vbmVPZmYgPSBvbmVPZmZcbiAgZm4udWlkRXZlbnQgPSB1aWRcbiAgaGFuZGxlcnNbdWlkXSA9IGZuXG5cbiAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGVFdmVudCwgZm4sIGlzRGVsZWdhdGVkKVxufVxuXG5mdW5jdGlvbiByZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uU2VsZWN0b3IpIHtcbiAgY29uc3QgZm4gPSBmaW5kSGFuZGxlcihldmVudHNbdHlwZUV2ZW50XSwgaGFuZGxlciwgZGVsZWdhdGlvblNlbGVjdG9yKVxuXG4gIGlmICghZm4pIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlRXZlbnQsIGZuLCBCb29sZWFuKGRlbGVnYXRpb25TZWxlY3RvcikpXG4gIGRlbGV0ZSBldmVudHNbdHlwZUV2ZW50XVtmbi51aWRFdmVudF1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlTmFtZXNwYWNlZEhhbmRsZXJzKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBuYW1lc3BhY2UpIHtcbiAgY29uc3Qgc3RvcmVFbGVtZW50RXZlbnQgPSBldmVudHNbdHlwZUV2ZW50XSB8fCB7fVxuXG4gIGZvciAoY29uc3QgW2hhbmRsZXJLZXksIGV2ZW50XSBvZiBPYmplY3QuZW50cmllcyhzdG9yZUVsZW1lbnRFdmVudCkpIHtcbiAgICBpZiAoaGFuZGxlcktleS5pbmNsdWRlcyhuYW1lc3BhY2UpKSB7XG4gICAgICByZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBldmVudC5jYWxsYWJsZSwgZXZlbnQuZGVsZWdhdGlvblNlbGVjdG9yKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRUeXBlRXZlbnQoZXZlbnQpIHtcbiAgLy8gYWxsb3cgdG8gZ2V0IHRoZSBuYXRpdmUgZXZlbnRzIGZyb20gbmFtZXNwYWNlZCBldmVudHMgKCdjbGljay5icy5idXR0b24nIC0tPiAnY2xpY2snKVxuICBldmVudCA9IGV2ZW50LnJlcGxhY2Uoc3RyaXBOYW1lUmVnZXgsICcnKVxuICByZXR1cm4gY3VzdG9tRXZlbnRzW2V2ZW50XSB8fCBldmVudFxufVxuXG5jb25zdCBFdmVudEhhbmRsZXIgPSB7XG4gIG9uKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcbiAgICBhZGRIYW5kbGVyKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24sIGZhbHNlKVxuICB9LFxuXG4gIG9uZShlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKSB7XG4gICAgYWRkSGFuZGxlcihlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uLCB0cnVlKVxuICB9LFxuXG4gIG9mZihlbGVtZW50LCBvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKSB7XG4gICAgaWYgKHR5cGVvZiBvcmlnaW5hbFR5cGVFdmVudCAhPT0gJ3N0cmluZycgfHwgIWVsZW1lbnQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IFtpc0RlbGVnYXRlZCwgY2FsbGFibGUsIHR5cGVFdmVudF0gPSBub3JtYWxpemVQYXJhbWV0ZXJzKG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pXG4gICAgY29uc3QgaW5OYW1lc3BhY2UgPSB0eXBlRXZlbnQgIT09IG9yaWdpbmFsVHlwZUV2ZW50XG4gICAgY29uc3QgZXZlbnRzID0gZ2V0RWxlbWVudEV2ZW50cyhlbGVtZW50KVxuICAgIGNvbnN0IHN0b3JlRWxlbWVudEV2ZW50ID0gZXZlbnRzW3R5cGVFdmVudF0gfHwge31cbiAgICBjb25zdCBpc05hbWVzcGFjZSA9IG9yaWdpbmFsVHlwZUV2ZW50LnN0YXJ0c1dpdGgoJy4nKVxuXG4gICAgaWYgKHR5cGVvZiBjYWxsYWJsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIC8vIFNpbXBsZXN0IGNhc2U6IGhhbmRsZXIgaXMgcGFzc2VkLCByZW1vdmUgdGhhdCBsaXN0ZW5lciBPTkxZLlxuICAgICAgaWYgKCFPYmplY3Qua2V5cyhzdG9yZUVsZW1lbnRFdmVudCkubGVuZ3RoKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICByZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBjYWxsYWJsZSwgaXNEZWxlZ2F0ZWQgPyBoYW5kbGVyIDogbnVsbClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChpc05hbWVzcGFjZSkge1xuICAgICAgZm9yIChjb25zdCBlbGVtZW50RXZlbnQgb2YgT2JqZWN0LmtleXMoZXZlbnRzKSkge1xuICAgICAgICByZW1vdmVOYW1lc3BhY2VkSGFuZGxlcnMoZWxlbWVudCwgZXZlbnRzLCBlbGVtZW50RXZlbnQsIG9yaWdpbmFsVHlwZUV2ZW50LnNsaWNlKDEpKVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgW2tleUhhbmRsZXJzLCBldmVudF0gb2YgT2JqZWN0LmVudHJpZXMoc3RvcmVFbGVtZW50RXZlbnQpKSB7XG4gICAgICBjb25zdCBoYW5kbGVyS2V5ID0ga2V5SGFuZGxlcnMucmVwbGFjZShzdHJpcFVpZFJlZ2V4LCAnJylcblxuICAgICAgaWYgKCFpbk5hbWVzcGFjZSB8fCBvcmlnaW5hbFR5cGVFdmVudC5pbmNsdWRlcyhoYW5kbGVyS2V5KSkge1xuICAgICAgICByZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBldmVudC5jYWxsYWJsZSwgZXZlbnQuZGVsZWdhdGlvblNlbGVjdG9yKVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICB0cmlnZ2VyKGVsZW1lbnQsIGV2ZW50LCBhcmdzKSB7XG4gICAgaWYgKHR5cGVvZiBldmVudCAhPT0gJ3N0cmluZycgfHwgIWVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgY29uc3QgJCA9IGdldGpRdWVyeSgpXG4gICAgY29uc3QgdHlwZUV2ZW50ID0gZ2V0VHlwZUV2ZW50KGV2ZW50KVxuICAgIGNvbnN0IGluTmFtZXNwYWNlID0gZXZlbnQgIT09IHR5cGVFdmVudFxuXG4gICAgbGV0IGpRdWVyeUV2ZW50ID0gbnVsbFxuICAgIGxldCBidWJibGVzID0gdHJ1ZVxuICAgIGxldCBuYXRpdmVEaXNwYXRjaCA9IHRydWVcbiAgICBsZXQgZGVmYXVsdFByZXZlbnRlZCA9IGZhbHNlXG5cbiAgICBpZiAoaW5OYW1lc3BhY2UgJiYgJCkge1xuICAgICAgalF1ZXJ5RXZlbnQgPSAkLkV2ZW50KGV2ZW50LCBhcmdzKVxuXG4gICAgICAkKGVsZW1lbnQpLnRyaWdnZXIoalF1ZXJ5RXZlbnQpXG4gICAgICBidWJibGVzID0gIWpRdWVyeUV2ZW50LmlzUHJvcGFnYXRpb25TdG9wcGVkKClcbiAgICAgIG5hdGl2ZURpc3BhdGNoID0gIWpRdWVyeUV2ZW50LmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkKClcbiAgICAgIGRlZmF1bHRQcmV2ZW50ZWQgPSBqUXVlcnlFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKVxuICAgIH1cblxuICAgIGNvbnN0IGV2dCA9IGh5ZHJhdGVPYmoobmV3IEV2ZW50KGV2ZW50LCB7IGJ1YmJsZXMsIGNhbmNlbGFibGU6IHRydWUgfSksIGFyZ3MpXG5cbiAgICBpZiAoZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICB9XG5cbiAgICBpZiAobmF0aXZlRGlzcGF0Y2gpIHtcbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldnQpXG4gICAgfVxuXG4gICAgaWYgKGV2dC5kZWZhdWx0UHJldmVudGVkICYmIGpRdWVyeUV2ZW50KSB7XG4gICAgICBqUXVlcnlFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfVxuXG4gICAgcmV0dXJuIGV2dFxuICB9XG59XG5cbmZ1bmN0aW9uIGh5ZHJhdGVPYmoob2JqLCBtZXRhID0ge30pIHtcbiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMobWV0YSkpIHtcbiAgICB0cnkge1xuICAgICAgb2JqW2tleV0gPSB2YWx1ZVxuICAgIH0gY2F0Y2gge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmpcbn1cblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRIYW5kbGVyXG4iLCAiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQm9vdHN0cmFwIGRvbS9tYW5pcHVsYXRvci5qc1xuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZURhdGEodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSAndHJ1ZScpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBpZiAodmFsdWUgPT09IE51bWJlcih2YWx1ZSkudG9TdHJpbmcoKSkge1xuICAgIHJldHVybiBOdW1iZXIodmFsdWUpXG4gIH1cblxuICBpZiAodmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSAnbnVsbCcpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIHRyeSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSlcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplRGF0YUtleShrZXkpIHtcbiAgcmV0dXJuIGtleS5yZXBsYWNlKC9bQS1aXS9nLCBjaHIgPT4gYC0ke2Noci50b0xvd2VyQ2FzZSgpfWApXG59XG5cbmNvbnN0IE1hbmlwdWxhdG9yID0ge1xuICBzZXREYXRhQXR0cmlidXRlKGVsZW1lbnQsIGtleSwgdmFsdWUpIHtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShgZGF0YS1icy0ke25vcm1hbGl6ZURhdGFLZXkoa2V5KX1gLCB2YWx1ZSlcbiAgfSxcblxuICByZW1vdmVEYXRhQXR0cmlidXRlKGVsZW1lbnQsIGtleSkge1xuICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGBkYXRhLWJzLSR7bm9ybWFsaXplRGF0YUtleShrZXkpfWApXG4gIH0sXG5cbiAgZ2V0RGF0YUF0dHJpYnV0ZXMoZWxlbWVudCkge1xuICAgIGlmICghZWxlbWVudCkge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuXG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHt9XG4gICAgY29uc3QgYnNLZXlzID0gT2JqZWN0LmtleXMoZWxlbWVudC5kYXRhc2V0KS5maWx0ZXIoa2V5ID0+IGtleS5zdGFydHNXaXRoKCdicycpICYmICFrZXkuc3RhcnRzV2l0aCgnYnNDb25maWcnKSlcblxuICAgIGZvciAoY29uc3Qga2V5IG9mIGJzS2V5cykge1xuICAgICAgbGV0IHB1cmVLZXkgPSBrZXkucmVwbGFjZSgvXmJzLywgJycpXG4gICAgICBwdXJlS2V5ID0gcHVyZUtleS5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIHB1cmVLZXkuc2xpY2UoMSlcbiAgICAgIGF0dHJpYnV0ZXNbcHVyZUtleV0gPSBub3JtYWxpemVEYXRhKGVsZW1lbnQuZGF0YXNldFtrZXldKVxuICAgIH1cblxuICAgIHJldHVybiBhdHRyaWJ1dGVzXG4gIH0sXG5cbiAgZ2V0RGF0YUF0dHJpYnV0ZShlbGVtZW50LCBrZXkpIHtcbiAgICByZXR1cm4gbm9ybWFsaXplRGF0YShlbGVtZW50LmdldEF0dHJpYnV0ZShgZGF0YS1icy0ke25vcm1hbGl6ZURhdGFLZXkoa2V5KX1gKSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYW5pcHVsYXRvclxuIiwgIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEJvb3RzdHJhcCB1dGlsL2NvbmZpZy5qc1xuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmltcG9ydCBNYW5pcHVsYXRvciBmcm9tICcuLi9kb20vbWFuaXB1bGF0b3IuanMnXG5pbXBvcnQgeyBpc0VsZW1lbnQsIHRvVHlwZSB9IGZyb20gJy4vaW5kZXguanMnXG5cbi8qKlxuICogQ2xhc3MgZGVmaW5pdGlvblxuICovXG5cbmNsYXNzIENvbmZpZyB7XG4gIC8vIEdldHRlcnNcbiAgc3RhdGljIGdldCBEZWZhdWx0KCkge1xuICAgIHJldHVybiB7fVxuICB9XG5cbiAgc3RhdGljIGdldCBEZWZhdWx0VHlwZSgpIHtcbiAgICByZXR1cm4ge31cbiAgfVxuXG4gIHN0YXRpYyBnZXQgTkFNRSgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBoYXZlIHRvIGltcGxlbWVudCB0aGUgc3RhdGljIG1ldGhvZCBcIk5BTUVcIiwgZm9yIGVhY2ggY29tcG9uZW50IScpXG4gIH1cblxuICBfZ2V0Q29uZmlnKGNvbmZpZykge1xuICAgIGNvbmZpZyA9IHRoaXMuX21lcmdlQ29uZmlnT2JqKGNvbmZpZylcbiAgICBjb25maWcgPSB0aGlzLl9jb25maWdBZnRlck1lcmdlKGNvbmZpZylcbiAgICB0aGlzLl90eXBlQ2hlY2tDb25maWcoY29uZmlnKVxuICAgIHJldHVybiBjb25maWdcbiAgfVxuXG4gIF9jb25maWdBZnRlck1lcmdlKGNvbmZpZykge1xuICAgIHJldHVybiBjb25maWdcbiAgfVxuXG4gIF9tZXJnZUNvbmZpZ09iaihjb25maWcsIGVsZW1lbnQpIHtcbiAgICBjb25zdCBqc29uQ29uZmlnID0gaXNFbGVtZW50KGVsZW1lbnQpID8gTWFuaXB1bGF0b3IuZ2V0RGF0YUF0dHJpYnV0ZShlbGVtZW50LCAnY29uZmlnJykgOiB7fSAvLyB0cnkgdG8gcGFyc2VcblxuICAgIHJldHVybiB7XG4gICAgICAuLi50aGlzLmNvbnN0cnVjdG9yLkRlZmF1bHQsXG4gICAgICAuLi4odHlwZW9mIGpzb25Db25maWcgPT09ICdvYmplY3QnID8ganNvbkNvbmZpZyA6IHt9KSxcbiAgICAgIC4uLihpc0VsZW1lbnQoZWxlbWVudCkgPyBNYW5pcHVsYXRvci5nZXREYXRhQXR0cmlidXRlcyhlbGVtZW50KSA6IHt9KSxcbiAgICAgIC4uLih0eXBlb2YgY29uZmlnID09PSAnb2JqZWN0JyA/IGNvbmZpZyA6IHt9KVxuICAgIH1cbiAgfVxuXG4gIF90eXBlQ2hlY2tDb25maWcoY29uZmlnLCBjb25maWdUeXBlcyA9IHRoaXMuY29uc3RydWN0b3IuRGVmYXVsdFR5cGUpIHtcbiAgICBmb3IgKGNvbnN0IFtwcm9wZXJ0eSwgZXhwZWN0ZWRUeXBlc10gb2YgT2JqZWN0LmVudHJpZXMoY29uZmlnVHlwZXMpKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbmZpZ1twcm9wZXJ0eV1cbiAgICAgIGNvbnN0IHZhbHVlVHlwZSA9IGlzRWxlbWVudCh2YWx1ZSkgPyAnZWxlbWVudCcgOiB0b1R5cGUodmFsdWUpXG5cbiAgICAgIGlmICghbmV3IFJlZ0V4cChleHBlY3RlZFR5cGVzKS50ZXN0KHZhbHVlVHlwZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBgJHt0aGlzLmNvbnN0cnVjdG9yLk5BTUUudG9VcHBlckNhc2UoKX06IE9wdGlvbiBcIiR7cHJvcGVydHl9XCIgcHJvdmlkZWQgdHlwZSBcIiR7dmFsdWVUeXBlfVwiIGJ1dCBleHBlY3RlZCB0eXBlIFwiJHtleHBlY3RlZFR5cGVzfVwiLmBcbiAgICAgICAgKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb25maWdcbiIsICIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBCb290c3RyYXAgdXRpbC9zd2lwZS5qc1xuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSAnLi4vZG9tL2V2ZW50LWhhbmRsZXIuanMnXG5pbXBvcnQgQ29uZmlnIGZyb20gJy4vY29uZmlnLmpzJ1xuaW1wb3J0IHsgZXhlY3V0ZSB9IGZyb20gJy4vaW5kZXguanMnXG5cbi8qKlxuICogQ29uc3RhbnRzXG4gKi9cblxuY29uc3QgTkFNRSA9ICdzd2lwZSdcbmNvbnN0IEVWRU5UX0tFWSA9ICcuYnMuc3dpcGUnXG5jb25zdCBFVkVOVF9UT1VDSFNUQVJUID0gYHRvdWNoc3RhcnQke0VWRU5UX0tFWX1gXG5jb25zdCBFVkVOVF9UT1VDSE1PVkUgPSBgdG91Y2htb3ZlJHtFVkVOVF9LRVl9YFxuY29uc3QgRVZFTlRfVE9VQ0hFTkQgPSBgdG91Y2hlbmQke0VWRU5UX0tFWX1gXG5jb25zdCBFVkVOVF9QT0lOVEVSRE9XTiA9IGBwb2ludGVyZG93biR7RVZFTlRfS0VZfWBcbmNvbnN0IEVWRU5UX1BPSU5URVJVUCA9IGBwb2ludGVydXAke0VWRU5UX0tFWX1gXG5jb25zdCBQT0lOVEVSX1RZUEVfVE9VQ0ggPSAndG91Y2gnXG5jb25zdCBQT0lOVEVSX1RZUEVfUEVOID0gJ3BlbidcbmNvbnN0IENMQVNTX05BTUVfUE9JTlRFUl9FVkVOVCA9ICdwb2ludGVyLWV2ZW50J1xuY29uc3QgU1dJUEVfVEhSRVNIT0xEID0gNDBcblxuY29uc3QgRGVmYXVsdCA9IHtcbiAgZW5kQ2FsbGJhY2s6IG51bGwsXG4gIGxlZnRDYWxsYmFjazogbnVsbCxcbiAgcmlnaHRDYWxsYmFjazogbnVsbFxufVxuXG5jb25zdCBEZWZhdWx0VHlwZSA9IHtcbiAgZW5kQ2FsbGJhY2s6ICcoZnVuY3Rpb258bnVsbCknLFxuICBsZWZ0Q2FsbGJhY2s6ICcoZnVuY3Rpb258bnVsbCknLFxuICByaWdodENhbGxiYWNrOiAnKGZ1bmN0aW9ufG51bGwpJ1xufVxuXG4vKipcbiAqIENsYXNzIGRlZmluaXRpb25cbiAqL1xuXG5jbGFzcyBTd2lwZSBleHRlbmRzIENvbmZpZyB7XG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGNvbmZpZykge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLl9lbGVtZW50ID0gZWxlbWVudFxuXG4gICAgaWYgKCFlbGVtZW50IHx8ICFTd2lwZS5pc1N1cHBvcnRlZCgpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLl9jb25maWcgPSB0aGlzLl9nZXRDb25maWcoY29uZmlnKVxuICAgIHRoaXMuX2RlbHRhWCA9IDBcbiAgICB0aGlzLl9zdXBwb3J0UG9pbnRlckV2ZW50cyA9IEJvb2xlYW4od2luZG93LlBvaW50ZXJFdmVudClcbiAgICB0aGlzLl9pbml0RXZlbnRzKClcbiAgfVxuXG4gIC8vIEdldHRlcnNcbiAgc3RhdGljIGdldCBEZWZhdWx0KCkge1xuICAgIHJldHVybiBEZWZhdWx0XG4gIH1cblxuICBzdGF0aWMgZ2V0IERlZmF1bHRUeXBlKCkge1xuICAgIHJldHVybiBEZWZhdWx0VHlwZVxuICB9XG5cbiAgc3RhdGljIGdldCBOQU1FKCkge1xuICAgIHJldHVybiBOQU1FXG4gIH1cblxuICAvLyBQdWJsaWNcbiAgZGlzcG9zZSgpIHtcbiAgICBFdmVudEhhbmRsZXIub2ZmKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWSlcbiAgfVxuXG4gIC8vIFByaXZhdGVcbiAgX3N0YXJ0KGV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLl9zdXBwb3J0UG9pbnRlckV2ZW50cykge1xuICAgICAgdGhpcy5fZGVsdGFYID0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRYXG5cbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudElzUG9pbnRlclBlblRvdWNoKGV2ZW50KSkge1xuICAgICAgdGhpcy5fZGVsdGFYID0gZXZlbnQuY2xpZW50WFxuICAgIH1cbiAgfVxuXG4gIF9lbmQoZXZlbnQpIHtcbiAgICBpZiAodGhpcy5fZXZlbnRJc1BvaW50ZXJQZW5Ub3VjaChldmVudCkpIHtcbiAgICAgIHRoaXMuX2RlbHRhWCA9IGV2ZW50LmNsaWVudFggLSB0aGlzLl9kZWx0YVhcbiAgICB9XG5cbiAgICB0aGlzLl9oYW5kbGVTd2lwZSgpXG4gICAgZXhlY3V0ZSh0aGlzLl9jb25maWcuZW5kQ2FsbGJhY2spXG4gIH1cblxuICBfbW92ZShldmVudCkge1xuICAgIHRoaXMuX2RlbHRhWCA9IGV2ZW50LnRvdWNoZXMgJiYgZXZlbnQudG91Y2hlcy5sZW5ndGggPiAxID9cbiAgICAgIDAgOlxuICAgICAgZXZlbnQudG91Y2hlc1swXS5jbGllbnRYIC0gdGhpcy5fZGVsdGFYXG4gIH1cblxuICBfaGFuZGxlU3dpcGUoKSB7XG4gICAgY29uc3QgYWJzRGVsdGFYID0gTWF0aC5hYnModGhpcy5fZGVsdGFYKVxuXG4gICAgaWYgKGFic0RlbHRhWCA8PSBTV0lQRV9USFJFU0hPTEQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGRpcmVjdGlvbiA9IGFic0RlbHRhWCAvIHRoaXMuX2RlbHRhWFxuXG4gICAgdGhpcy5fZGVsdGFYID0gMFxuXG4gICAgaWYgKCFkaXJlY3Rpb24pIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGV4ZWN1dGUoZGlyZWN0aW9uID4gMCA/IHRoaXMuX2NvbmZpZy5yaWdodENhbGxiYWNrIDogdGhpcy5fY29uZmlnLmxlZnRDYWxsYmFjaylcbiAgfVxuXG4gIF9pbml0RXZlbnRzKCkge1xuICAgIGlmICh0aGlzLl9zdXBwb3J0UG9pbnRlckV2ZW50cykge1xuICAgICAgRXZlbnRIYW5kbGVyLm9uKHRoaXMuX2VsZW1lbnQsIEVWRU5UX1BPSU5URVJET1dOLCBldmVudCA9PiB0aGlzLl9zdGFydChldmVudCkpXG4gICAgICBFdmVudEhhbmRsZXIub24odGhpcy5fZWxlbWVudCwgRVZFTlRfUE9JTlRFUlVQLCBldmVudCA9PiB0aGlzLl9lbmQoZXZlbnQpKVxuXG4gICAgICB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9QT0lOVEVSX0VWRU5UKVxuICAgIH0gZWxzZSB7XG4gICAgICBFdmVudEhhbmRsZXIub24odGhpcy5fZWxlbWVudCwgRVZFTlRfVE9VQ0hTVEFSVCwgZXZlbnQgPT4gdGhpcy5fc3RhcnQoZXZlbnQpKVxuICAgICAgRXZlbnRIYW5kbGVyLm9uKHRoaXMuX2VsZW1lbnQsIEVWRU5UX1RPVUNITU9WRSwgZXZlbnQgPT4gdGhpcy5fbW92ZShldmVudCkpXG4gICAgICBFdmVudEhhbmRsZXIub24odGhpcy5fZWxlbWVudCwgRVZFTlRfVE9VQ0hFTkQsIGV2ZW50ID0+IHRoaXMuX2VuZChldmVudCkpXG4gICAgfVxuICB9XG5cbiAgX2V2ZW50SXNQb2ludGVyUGVuVG91Y2goZXZlbnQpIHtcbiAgICByZXR1cm4gdGhpcy5fc3VwcG9ydFBvaW50ZXJFdmVudHMgJiYgKGV2ZW50LnBvaW50ZXJUeXBlID09PSBQT0lOVEVSX1RZUEVfUEVOIHx8IGV2ZW50LnBvaW50ZXJUeXBlID09PSBQT0lOVEVSX1RZUEVfVE9VQ0gpXG4gIH1cblxuICAvLyBTdGF0aWNcbiAgc3RhdGljIGlzU3VwcG9ydGVkKCkge1xuICAgIHJldHVybiAnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgfHwgbmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzID4gMFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFN3aXBlXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7QUFPQSxZQUFNQSxVQUFVO0FBQ2hCLFlBQU1DLDBCQUEwQjtBQUNoQyxZQUFNQyxpQkFBaUI7QUFPdkIsWUFBTUMsZ0JBQWdCQyxxQ0FBWTtBQUNoQyxZQUFJQSxZQUFZQyxPQUFPQyxPQUFPRCxPQUFPQyxJQUFJQyxRQUFRO0FBRS9DSCxxQkFBV0EsU0FBU0ksUUFBUSxpQkFBaUIsQ0FBQ0MsT0FBT0MsT0FBTyxJQUFJSixJQUFJQyxPQUFPRyxFQUFFLENBQUMsRUFBRTtRQUNsRjtBQUVBLGVBQU9OO01BQ1QsR0FQc0JBO0FBVXRCLFlBQU1PLFNBQVNDLG1DQUFV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Z0IsR0FBRyxLQUFLM0IsVUFBVWpCLGdCQUFnQitCLFdBQVMsS0FBS0ksS0FBS0osS0FBSyxDQUFDO1VBQzFFO1FBQ0Y7UUFFQUcsd0JBQXdCSCxPQUFPO0FBQzdCLGlCQUFPLEtBQUtULDBCQUEwQlMsTUFBTWdCLGdCQUFnQjNDLG9CQUFvQjJCLE1BQU1nQixnQkFBZ0I1QztRQUN4Rzs7UUFHQSxPQUFPZSxjQUFjO0FBQ25CLGlCQUFPLGtCQUFrQjhCLFNBQVNDLG1CQUFtQkMsVUFBVUMsaUJBQWlCO1FBQ2xGO01BQ0Y7Ozs7OyIsCiAgIm5hbWVzIjogWyJNQVhfVUlEIiwgIk1JTExJU0VDT05EU19NVUxUSVBMSUVSIiwgIlRSQU5TSVRJT05fRU5EIiwgInBhcnNlU2VsZWN0b3IiLCAic2VsZWN0b3IiLCAid2luZG93IiwgIkNTUyIsICJlc2NhcGUiLCAicmVwbGFjZSIsICJtYXRjaCIsICJpZCIsICJ0b1R5cGUiLCAib2JqZWN0IiwgInVuZGVmaW5lZCIsICJPYmplY3QiLCAicHJvdG90eXBlIiwgInRvU3RyaW5nIiwgImNhbGwiLCAidG9Mb3dlckNhc2UiLCAiZ2V0VUlEIiwgInByZWZpeCIsICJNYXRoIiwgImZsb29yIiwgInJhbmRvbSIsICJkb2N1bWVudCIsICJnZXRFbGVtZW50QnlJZCIsICJnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCIsICJlbGVtZW50IiwgInRyYW5zaXRpb25EdXJhdGlvbiIsICJ0cmFuc2l0aW9uRGVsYXkiLCAiZ2V0Q29tcHV0ZWRTdHlsZSIsICJmbG9hdFRyYW5zaXRpb25EdXJhdGlvbiIsICJOdW1iZXIiLCAicGFyc2VGbG9hdCIsICJmbG9hdFRyYW5zaXRpb25EZWxheSIsICJzcGxpdCIsICJ0cmlnZ2VyVHJhbnNpdGlvbkVuZCIsICJkaXNwYXRjaEV2ZW50IiwgIkV2ZW50IiwgImlzRWxlbWVudCIsICJqcXVlcnkiLCAibm9kZVR5cGUiLCAiZ2V0RWxlbWVudCIsICJsZW5ndGgiLCAicXVlcnlTZWxlY3RvciIsICJpc1Zpc2libGUiLCAiZ2V0Q2xpZW50UmVjdHMiLCAiZWxlbWVudElzVmlzaWJsZSIsICJnZXRQcm9wZXJ0eVZhbHVlIiwgImNsb3NlZERldGFpbHMiLCAiY2xvc2VzdCIsICJzdW1tYXJ5IiwgInBhcmVudE5vZGUiLCAiaXNEaXNhYmxlZCIsICJOb2RlIiwgIkVMRU1FTlRfTk9ERSIsICJjbGFzc0xpc3QiLCAiY29udGFpbnMiLCAiZGlzYWJsZWQiLCAiaGFzQXR0cmlidXRlIiwgImdldEF0dHJpYnV0ZSIsICJmaW5kU2hhZG93Um9vdCIsICJkb2N1bWVudEVsZW1lbnQiLCAiYXR0YWNoU2hhZG93IiwgImdldFJvb3ROb2RlIiwgInJvb3QiLCAiU2hhZG93Um9vdCIsICJub29wIiwgInJlZmxvdyIsICJvZmZzZXRIZWlnaHQiLCAiZ2V0alF1ZXJ5IiwgImpRdWVyeSIsICJib2R5IiwgIkRPTUNvbnRlbnRMb2FkZWRDYWxsYmFja3MiLCAib25ET01Db250ZW50TG9hZGVkIiwgImNhbGxiYWNrIiwgInJlYWR5U3RhdGUiLCAiYWRkRXZlbnRMaXN0ZW5lciIsICJwdXNoIiwgImlzUlRMIiwgImRpciIsICJkZWZpbmVKUXVlcnlQbHVnaW4iLCAicGx1Z2luIiwgIiQiLCAibmFtZSIsICJOQU1FIiwgIkpRVUVSWV9OT19DT05GTElDVCIsICJmbiIsICJqUXVlcnlJbnRlcmZhY2UiLCAiQ29uc3RydWN0b3IiLCAibm9Db25mbGljdCIsICJleGVjdXRlIiwgInBvc3NpYmxlQ2FsbGJhY2siLCAiYXJncyIsICJkZWZhdWx0VmFsdWUiLCAiZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbiIsICJ0cmFuc2l0aW9uRWxlbWVudCIsICJ3YWl0Rm9yVHJhbnNpdGlvbiIsICJkdXJhdGlvblBhZGRpbmciLCAiZW11bGF0ZWREdXJhdGlvbiIsICJjYWxsZWQiLCAiaGFuZGxlciIsICJ0YXJnZXQiLCAicmVtb3ZlRXZlbnRMaXN0ZW5lciIsICJzZXRUaW1lb3V0IiwgImdldE5leHRBY3RpdmVFbGVtZW50IiwgImxpc3QiLCAiYWN0aXZlRWxlbWVudCIsICJzaG91bGRHZXROZXh0IiwgImlzQ3ljbGVBbGxvd2VkIiwgImxpc3RMZW5ndGgiLCAiaW5kZXgiLCAiaW5kZXhPZiIsICJtYXgiLCAibWluIiwgIm5hbWVzcGFjZVJlZ2V4IiwgInN0cmlwTmFtZVJlZ2V4IiwgInN0cmlwVWlkUmVnZXgiLCAiZXZlbnRSZWdpc3RyeSIsICJ1aWRFdmVudCIsICJjdXN0b21FdmVudHMiLCAibW91c2VlbnRlciIsICJtb3VzZWxlYXZlIiwgIm5hdGl2ZUV2ZW50cyIsICJTZXQiLCAibWFrZUV2ZW50VWlkIiwgImVsZW1lbnQiLCAidWlkIiwgImdldEVsZW1lbnRFdmVudHMiLCAiYm9vdHN0cmFwSGFuZGxlciIsICJmbiIsICJoYW5kbGVyIiwgImV2ZW50IiwgImh5ZHJhdGVPYmoiLCAiZGVsZWdhdGVUYXJnZXQiLCAib25lT2ZmIiwgIkV2ZW50SGFuZGxlciIsICJvZmYiLCAidHlwZSIsICJhcHBseSIsICJib290c3RyYXBEZWxlZ2F0aW9uSGFuZGxlciIsICJzZWxlY3RvciIsICJkb21FbGVtZW50cyIsICJxdWVyeVNlbGVjdG9yQWxsIiwgInRhcmdldCIsICJwYXJlbnROb2RlIiwgImRvbUVsZW1lbnQiLCAiZmluZEhhbmRsZXIiLCAiZXZlbnRzIiwgImNhbGxhYmxlIiwgImRlbGVnYXRpb25TZWxlY3RvciIsICJPYmplY3QiLCAidmFsdWVzIiwgImZpbmQiLCAibm9ybWFsaXplUGFyYW1ldGVycyIsICJvcmlnaW5hbFR5cGVFdmVudCIsICJkZWxlZ2F0aW9uRnVuY3Rpb24iLCAiaXNEZWxlZ2F0ZWQiLCAidHlwZUV2ZW50IiwgImdldFR5cGVFdmVudCIsICJoYXMiLCAiYWRkSGFuZGxlciIsICJ3cmFwRnVuY3Rpb24iLCAicmVsYXRlZFRhcmdldCIsICJjb250YWlucyIsICJjYWxsIiwgImhhbmRsZXJzIiwgInByZXZpb3VzRnVuY3Rpb24iLCAicmVwbGFjZSIsICJhZGRFdmVudExpc3RlbmVyIiwgInJlbW92ZUhhbmRsZXIiLCAicmVtb3ZlRXZlbnRMaXN0ZW5lciIsICJCb29sZWFuIiwgInJlbW92ZU5hbWVzcGFjZWRIYW5kbGVycyIsICJuYW1lc3BhY2UiLCAic3RvcmVFbGVtZW50RXZlbnQiLCAiaGFuZGxlcktleSIsICJlbnRyaWVzIiwgImluY2x1ZGVzIiwgIm9uIiwgIm9uZSIsICJpbk5hbWVzcGFjZSIsICJpc05hbWVzcGFjZSIsICJzdGFydHNXaXRoIiwgImtleXMiLCAibGVuZ3RoIiwgImVsZW1lbnRFdmVudCIsICJzbGljZSIsICJrZXlIYW5kbGVycyIsICJ0cmlnZ2VyIiwgImFyZ3MiLCAiJCIsICJnZXRqUXVlcnkiLCAialF1ZXJ5RXZlbnQiLCAiYnViYmxlcyIsICJuYXRpdmVEaXNwYXRjaCIsICJkZWZhdWx0UHJldmVudGVkIiwgIkV2ZW50IiwgImlzUHJvcGFnYXRpb25TdG9wcGVkIiwgImlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkIiwgImlzRGVmYXVsdFByZXZlbnRlZCIsICJldnQiLCAiY2FuY2VsYWJsZSIsICJwcmV2ZW50RGVmYXVsdCIsICJkaXNwYXRjaEV2ZW50IiwgIm9iaiIsICJtZXRhIiwgImtleSIsICJ2YWx1ZSIsICJfdW51c2VkIiwgImRlZmluZVByb3BlcnR5IiwgImNvbmZpZ3VyYWJsZSIsICJnZXQiLCAibm9ybWFsaXplRGF0YSIsICJ2YWx1ZSIsICJOdW1iZXIiLCAidG9TdHJpbmciLCAiSlNPTiIsICJwYXJzZSIsICJkZWNvZGVVUklDb21wb25lbnQiLCAiX3VudXNlZCIsICJub3JtYWxpemVEYXRhS2V5IiwgImtleSIsICJyZXBsYWNlIiwgImNociIsICJ0b0xvd2VyQ2FzZSIsICJNYW5pcHVsYXRvciIsICJzZXREYXRhQXR0cmlidXRlIiwgImVsZW1lbnQiLCAic2V0QXR0cmlidXRlIiwgInJlbW92ZURhdGFBdHRyaWJ1dGUiLCAicmVtb3ZlQXR0cmlidXRlIiwgImdldERhdGFBdHRyaWJ1dGVzIiwgImF0dHJpYnV0ZXMiLCAiYnNLZXlzIiwgIk9iamVjdCIsICJrZXlzIiwgImRhdGFzZXQiLCAiZmlsdGVyIiwgInN0YXJ0c1dpdGgiLCAicHVyZUtleSIsICJjaGFyQXQiLCAic2xpY2UiLCAiZ2V0RGF0YUF0dHJpYnV0ZSIsICJnZXRBdHRyaWJ1dGUiLCAiQ29uZmlnIiwgIkRlZmF1bHQiLCAiRGVmYXVsdFR5cGUiLCAiTkFNRSIsICJFcnJvciIsICJfZ2V0Q29uZmlnIiwgImNvbmZpZyIsICJfbWVyZ2VDb25maWdPYmoiLCAiX2NvbmZpZ0FmdGVyTWVyZ2UiLCAiX3R5cGVDaGVja0NvbmZpZyIsICJlbGVtZW50IiwgImpzb25Db25maWciLCAiaXNFbGVtZW50IiwgIk1hbmlwdWxhdG9yIiwgImdldERhdGFBdHRyaWJ1dGUiLCAiY29uc3RydWN0b3IiLCAiZ2V0RGF0YUF0dHJpYnV0ZXMiLCAiY29uZmlnVHlwZXMiLCAicHJvcGVydHkiLCAiZXhwZWN0ZWRUeXBlcyIsICJPYmplY3QiLCAiZW50cmllcyIsICJ2YWx1ZSIsICJ2YWx1ZVR5cGUiLCAidG9UeXBlIiwgIlJlZ0V4cCIsICJ0ZXN0IiwgIlR5cGVFcnJvciIsICJ0b1VwcGVyQ2FzZSIsICJOQU1FIiwgIkVWRU5UX0tFWSIsICJFVkVOVF9UT1VDSFNUQVJUIiwgIkVWRU5UX1RPVUNITU9WRSIsICJFVkVOVF9UT1VDSEVORCIsICJFVkVOVF9QT0lOVEVSRE9XTiIsICJFVkVOVF9QT0lOVEVSVVAiLCAiUE9JTlRFUl9UWVBFX1RPVUNIIiwgIlBPSU5URVJfVFlQRV9QRU4iLCAiQ0xBU1NfTkFNRV9QT0lOVEVSX0VWRU5UIiwgIlNXSVBFX1RIUkVTSE9MRCIsICJEZWZhdWx0IiwgImVuZENhbGxiYWNrIiwgImxlZnRDYWxsYmFjayIsICJyaWdodENhbGxiYWNrIiwgIkRlZmF1bHRUeXBlIiwgIlN3aXBlIiwgIkNvbmZpZyIsICJjb25zdHJ1Y3RvciIsICJlbGVtZW50IiwgImNvbmZpZyIsICJfZWxlbWVudCIsICJpc1N1cHBvcnRlZCIsICJfY29uZmlnIiwgIl9nZXRDb25maWciLCAiX2RlbHRhWCIsICJfc3VwcG9ydFBvaW50ZXJFdmVudHMiLCAiQm9vbGVhbiIsICJ3aW5kb3ciLCAiUG9pbnRlckV2ZW50IiwgIl9pbml0RXZlbnRzIiwgImRpc3Bvc2UiLCAiRXZlbnRIYW5kbGVyIiwgIm9mZiIsICJfc3RhcnQiLCAiZXZlbnQiLCAidG91Y2hlcyIsICJjbGllbnRYIiwgIl9ldmVudElzUG9pbnRlclBlblRvdWNoIiwgIl9lbmQiLCAiX2hhbmRsZVN3aXBlIiwgImV4ZWN1dGUiLCAiX21vdmUiLCAibGVuZ3RoIiwgImFic0RlbHRhWCIsICJNYXRoIiwgImFicyIsICJkaXJlY3Rpb24iLCAib24iLCAiY2xhc3NMaXN0IiwgImFkZCIsICJwb2ludGVyVHlwZSIsICJkb2N1bWVudCIsICJkb2N1bWVudEVsZW1lbnQiLCAibmF2aWdhdG9yIiwgIm1heFRvdWNoUG9pbnRzIl0KfQo=
