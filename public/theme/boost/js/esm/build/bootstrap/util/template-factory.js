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

// public/theme/boost/js/esm/src/bootstrap/util/sanitizer.js
var require_sanitizer = __commonJS({
  "public/theme/boost/js/esm/src/bootstrap/util/sanitizer.js"(exports, module) {
    "use strict";
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.Sanitizer = {}));
    })(exports, (function(exports2) {
      "use strict";
      const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
      const DefaultAllowlist = {
        // Global attributes allowed on any supplied element below.
        "*": ["class", "dir", "id", "lang", "role", ARIA_ATTRIBUTE_PATTERN],
        a: ["target", "href", "title", "rel"],
        area: [],
        b: [],
        br: [],
        col: [],
        code: [],
        dd: [],
        div: [],
        dl: [],
        dt: [],
        em: [],
        hr: [],
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        h6: [],
        i: [],
        img: ["src", "srcset", "alt", "title", "width", "height"],
        li: [],
        ol: [],
        p: [],
        pre: [],
        s: [],
        small: [],
        span: [],
        sub: [],
        sup: [],
        strong: [],
        u: [],
        ul: []
      };
      const uriAttributes = /* @__PURE__ */ new Set(["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"]);
      const SAFE_URL_PATTERN = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i;
      const allowedAttribute = /* @__PURE__ */ __name((attribute, allowedAttributeList) => {
        const attributeName = attribute.nodeName.toLowerCase();
        if (allowedAttributeList.includes(attributeName)) {
          if (uriAttributes.has(attributeName)) {
            return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue));
          }
          return true;
        }
        return allowedAttributeList.filter((attributeRegex) => attributeRegex instanceof RegExp).some((regex) => regex.test(attributeName));
      }, "allowedAttribute");
      function sanitizeHtml(unsafeHtml, allowList, sanitizeFunction) {
        if (!unsafeHtml.length) {
          return unsafeHtml;
        }
        if (sanitizeFunction && typeof sanitizeFunction === "function") {
          return sanitizeFunction(unsafeHtml);
        }
        const domParser = new window.DOMParser();
        const createdDocument = domParser.parseFromString(unsafeHtml, "text/html");
        const elements = [].concat(...createdDocument.body.querySelectorAll("*"));
        for (const element of elements) {
          const elementName = element.nodeName.toLowerCase();
          if (!Object.keys(allowList).includes(elementName)) {
            element.remove();
            continue;
          }
          const attributeList = [].concat(...element.attributes);
          const allowedAttributes = [].concat(allowList["*"] || [], allowList[elementName] || []);
          for (const attribute of attributeList) {
            if (!allowedAttribute(attribute, allowedAttributes)) {
              element.removeAttribute(attribute.nodeName);
            }
          }
        }
        return createdDocument.body.innerHTML;
      }
      __name(sanitizeHtml, "sanitizeHtml");
      exports2.DefaultAllowlist = DefaultAllowlist;
      exports2.sanitizeHtml = sanitizeHtml;
      Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    }));
  }
});

// public/theme/boost/js/esm/src/bootstrap/util/template-factory.js
var require_template_factory = __commonJS({
  "public/theme/boost/js/esm/src/bootstrap/util/template-factory.js"(exports, module) {
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_selector_engine(), require_config(), require_sanitizer(), require_util()) : typeof define === "function" && define.amd ? define(["../dom/selector-engine", "./config", "./sanitizer", "./index"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.TemplateFactory = factory(global.SelectorEngine, global.Config, global.Sanitizer, global.Index));
    })(exports, (function(SelectorEngine, Config, sanitizer_js, index_js) {
      "use strict";
      const NAME = "TemplateFactory";
      const Default = {
        allowList: sanitizer_js.DefaultAllowlist,
        content: {},
        // { selector : text ,  selector2 : text2 , }
        extraClass: "",
        html: false,
        sanitize: true,
        sanitizeFn: null,
        template: "<div></div>"
      };
      const DefaultType = {
        allowList: "object",
        content: "object",
        extraClass: "(string|function)",
        html: "boolean",
        sanitize: "boolean",
        sanitizeFn: "(null|function)",
        template: "string"
      };
      const DefaultContentType = {
        entry: "(string|element|function|null)",
        selector: "(string|element)"
      };
      class TemplateFactory extends Config {
        static {
          __name(this, "TemplateFactory");
        }
        constructor(config) {
          super();
          this._config = this._getConfig(config);
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
        getContent() {
          return Object.values(this._config.content).map((config) => this._resolvePossibleFunction(config)).filter(Boolean);
        }
        hasContent() {
          return this.getContent().length > 0;
        }
        changeContent(content) {
          this._checkContent(content);
          this._config.content = {
            ...this._config.content,
            ...content
          };
          return this;
        }
        toHtml() {
          const templateWrapper = document.createElement("div");
          templateWrapper.innerHTML = this._maybeSanitize(this._config.template);
          for (const [selector, text] of Object.entries(this._config.content)) {
            this._setContent(templateWrapper, text, selector);
          }
          const template = templateWrapper.children[0];
          const extraClass = this._resolvePossibleFunction(this._config.extraClass);
          if (extraClass) {
            template.classList.add(...extraClass.split(" "));
          }
          return template;
        }
        // Private
        _typeCheckConfig(config) {
          super._typeCheckConfig(config);
          this._checkContent(config.content);
        }
        _checkContent(arg) {
          for (const [selector, content] of Object.entries(arg)) {
            super._typeCheckConfig({
              selector,
              entry: content
            }, DefaultContentType);
          }
        }
        _setContent(template, content, selector) {
          const templateElement = SelectorEngine.findOne(selector, template);
          if (!templateElement) {
            return;
          }
          content = this._resolvePossibleFunction(content);
          if (!content) {
            templateElement.remove();
            return;
          }
          if (index_js.isElement(content)) {
            this._putElementInTemplate(index_js.getElement(content), templateElement);
            return;
          }
          if (this._config.html) {
            templateElement.innerHTML = this._maybeSanitize(content);
            return;
          }
          templateElement.textContent = content;
        }
        _maybeSanitize(arg) {
          return this._config.sanitize ? sanitizer_js.sanitizeHtml(arg, this._config.allowList, this._config.sanitizeFn) : arg;
        }
        _resolvePossibleFunction(arg) {
          return index_js.execute(arg, [void 0, this]);
        }
        _putElementInTemplate(element, templateElement) {
          if (this._config.html) {
            templateElement.innerHTML = "";
            templateElement.append(element);
            return;
          }
          templateElement.textContent = element.textContent;
        }
      }
      return TemplateFactory;
    }));
  }
});
export default require_template_factory();
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
  * Bootstrap sanitizer.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
/*!
  * Bootstrap template-factory.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL3NyYy91dGlsL2luZGV4LmpzIiwgIi4uLy4uLy4uL3NyYy9zcmMvZG9tL3NlbGVjdG9yLWVuZ2luZS5qcyIsICIuLi8uLi8uLi9zcmMvc3JjL2RvbS9tYW5pcHVsYXRvci5qcyIsICIuLi8uLi8uLi9zcmMvc3JjL3V0aWwvY29uZmlnLmpzIiwgIi4uLy4uLy4uL3NyYy9zcmMvdXRpbC9zYW5pdGl6ZXIuanMiLCAiLi4vLi4vLi4vc3JjL3NyYy91dGlsL3RlbXBsYXRlLWZhY3RvcnkuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEJvb3RzdHJhcCB1dGlsL2luZGV4LmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuY29uc3QgTUFYX1VJRCA9IDFfMDAwXzAwMFxuY29uc3QgTUlMTElTRUNPTkRTX01VTFRJUExJRVIgPSAxMDAwXG5jb25zdCBUUkFOU0lUSU9OX0VORCA9ICd0cmFuc2l0aW9uZW5kJ1xuXG4vKipcbiAqIFByb3Blcmx5IGVzY2FwZSBJRHMgc2VsZWN0b3JzIHRvIGhhbmRsZSB3ZWlyZCBJRHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuY29uc3QgcGFyc2VTZWxlY3RvciA9IHNlbGVjdG9yID0+IHtcbiAgaWYgKHNlbGVjdG9yICYmIHdpbmRvdy5DU1MgJiYgd2luZG93LkNTUy5lc2NhcGUpIHtcbiAgICAvLyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yIG5lZWRzIGVzY2FwaW5nIHRvIGhhbmRsZSBJRHMgKGh0bWw1KykgY29udGFpbmluZyBmb3IgaW5zdGFuY2UgL1xuICAgIHNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgvIyhbXlxcc1wiIyddKykvZywgKG1hdGNoLCBpZCkgPT4gYCMke0NTUy5lc2NhcGUoaWQpfWApXG4gIH1cblxuICByZXR1cm4gc2VsZWN0b3Jcbn1cblxuLy8gU2hvdXQtb3V0IEFuZ3VzIENyb2xsIChodHRwczovL2dvby5nbC9weHdRR3ApXG5jb25zdCB0b1R5cGUgPSBvYmplY3QgPT4ge1xuICBpZiAob2JqZWN0ID09PSBudWxsIHx8IG9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGAke29iamVjdH1gXG4gIH1cblxuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkubWF0Y2goL1xccyhbYS16XSspL2kpWzFdLnRvTG93ZXJDYXNlKClcbn1cblxuLyoqXG4gKiBQdWJsaWMgVXRpbCBBUElcbiAqL1xuXG5jb25zdCBnZXRVSUQgPSBwcmVmaXggPT4ge1xuICBkbyB7XG4gICAgcHJlZml4ICs9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIE1BWF9VSUQpXG4gIH0gd2hpbGUgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHByZWZpeCkpXG5cbiAgcmV0dXJuIHByZWZpeFxufVxuXG5jb25zdCBnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCA9IGVsZW1lbnQgPT4ge1xuICBpZiAoIWVsZW1lbnQpIHtcbiAgICByZXR1cm4gMFxuICB9XG5cbiAgLy8gR2V0IHRyYW5zaXRpb24tZHVyYXRpb24gb2YgdGhlIGVsZW1lbnRcbiAgbGV0IHsgdHJhbnNpdGlvbkR1cmF0aW9uLCB0cmFuc2l0aW9uRGVsYXkgfSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpXG5cbiAgY29uc3QgZmxvYXRUcmFuc2l0aW9uRHVyYXRpb24gPSBOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRHVyYXRpb24pXG4gIGNvbnN0IGZsb2F0VHJhbnNpdGlvbkRlbGF5ID0gTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkRlbGF5KVxuXG4gIC8vIFJldHVybiAwIGlmIGVsZW1lbnQgb3IgdHJhbnNpdGlvbiBkdXJhdGlvbiBpcyBub3QgZm91bmRcbiAgaWYgKCFmbG9hdFRyYW5zaXRpb25EdXJhdGlvbiAmJiAhZmxvYXRUcmFuc2l0aW9uRGVsYXkpIHtcbiAgICByZXR1cm4gMFxuICB9XG5cbiAgLy8gSWYgbXVsdGlwbGUgZHVyYXRpb25zIGFyZSBkZWZpbmVkLCB0YWtlIHRoZSBmaXJzdFxuICB0cmFuc2l0aW9uRHVyYXRpb24gPSB0cmFuc2l0aW9uRHVyYXRpb24uc3BsaXQoJywnKVswXVxuICB0cmFuc2l0aW9uRGVsYXkgPSB0cmFuc2l0aW9uRGVsYXkuc3BsaXQoJywnKVswXVxuXG4gIHJldHVybiAoTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkR1cmF0aW9uKSArIE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EZWxheSkpICogTUlMTElTRUNPTkRTX01VTFRJUExJRVJcbn1cblxuY29uc3QgdHJpZ2dlclRyYW5zaXRpb25FbmQgPSBlbGVtZW50ID0+IHtcbiAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChUUkFOU0lUSU9OX0VORCkpXG59XG5cbmNvbnN0IGlzRWxlbWVudCA9IG9iamVjdCA9PiB7XG4gIGlmICghb2JqZWN0IHx8IHR5cGVvZiBvYmplY3QgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBpZiAodHlwZW9mIG9iamVjdC5qcXVlcnkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgb2JqZWN0ID0gb2JqZWN0WzBdXG4gIH1cblxuICByZXR1cm4gdHlwZW9mIG9iamVjdC5ub2RlVHlwZSAhPT0gJ3VuZGVmaW5lZCdcbn1cblxuY29uc3QgZ2V0RWxlbWVudCA9IG9iamVjdCA9PiB7XG4gIC8vIGl0J3MgYSBqUXVlcnkgb2JqZWN0IG9yIGEgbm9kZSBlbGVtZW50XG4gIGlmIChpc0VsZW1lbnQob2JqZWN0KSkge1xuICAgIHJldHVybiBvYmplY3QuanF1ZXJ5ID8gb2JqZWN0WzBdIDogb2JqZWN0XG4gIH1cblxuICBpZiAodHlwZW9mIG9iamVjdCA9PT0gJ3N0cmluZycgJiYgb2JqZWN0Lmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihwYXJzZVNlbGVjdG9yKG9iamVjdCkpXG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG5jb25zdCBpc1Zpc2libGUgPSBlbGVtZW50ID0+IHtcbiAgaWYgKCFpc0VsZW1lbnQoZWxlbWVudCkgfHwgZWxlbWVudC5nZXRDbGllbnRSZWN0cygpLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgY29uc3QgZWxlbWVudElzVmlzaWJsZSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZSgndmlzaWJpbGl0eScpID09PSAndmlzaWJsZSdcbiAgLy8gSGFuZGxlIGBkZXRhaWxzYCBlbGVtZW50IGFzIGl0cyBjb250ZW50IG1heSBmYWxzaWUgYXBwZWFyIHZpc2libGUgd2hlbiBpdCBpcyBjbG9zZWRcbiAgY29uc3QgY2xvc2VkRGV0YWlscyA9IGVsZW1lbnQuY2xvc2VzdCgnZGV0YWlsczpub3QoW29wZW5dKScpXG5cbiAgaWYgKCFjbG9zZWREZXRhaWxzKSB7XG4gICAgcmV0dXJuIGVsZW1lbnRJc1Zpc2libGVcbiAgfVxuXG4gIGlmIChjbG9zZWREZXRhaWxzICE9PSBlbGVtZW50KSB7XG4gICAgY29uc3Qgc3VtbWFyeSA9IGVsZW1lbnQuY2xvc2VzdCgnc3VtbWFyeScpXG4gICAgaWYgKHN1bW1hcnkgJiYgc3VtbWFyeS5wYXJlbnROb2RlICE9PSBjbG9zZWREZXRhaWxzKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoc3VtbWFyeSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnRJc1Zpc2libGVcbn1cblxuY29uc3QgaXNEaXNhYmxlZCA9IGVsZW1lbnQgPT4ge1xuICBpZiAoIWVsZW1lbnQgfHwgZWxlbWVudC5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXNhYmxlZCcpKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGlmICh0eXBlb2YgZWxlbWVudC5kaXNhYmxlZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZWxlbWVudC5kaXNhYmxlZFxuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpICE9PSAnZmFsc2UnXG59XG5cbmNvbnN0IGZpbmRTaGFkb3dSb290ID0gZWxlbWVudCA9PiB7XG4gIGlmICghZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmF0dGFjaFNoYWRvdykge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICAvLyBDYW4gZmluZCB0aGUgc2hhZG93IHJvb3Qgb3RoZXJ3aXNlIGl0J2xsIHJldHVybiB0aGUgZG9jdW1lbnRcbiAgaWYgKHR5cGVvZiBlbGVtZW50LmdldFJvb3ROb2RlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY29uc3Qgcm9vdCA9IGVsZW1lbnQuZ2V0Um9vdE5vZGUoKVxuICAgIHJldHVybiByb290IGluc3RhbmNlb2YgU2hhZG93Um9vdCA/IHJvb3QgOiBudWxsXG4gIH1cblxuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpIHtcbiAgICByZXR1cm4gZWxlbWVudFxuICB9XG5cbiAgLy8gd2hlbiB3ZSBkb24ndCBmaW5kIGEgc2hhZG93IHJvb3RcbiAgaWYgKCFlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgcmV0dXJuIGZpbmRTaGFkb3dSb290KGVsZW1lbnQucGFyZW50Tm9kZSlcbn1cblxuY29uc3Qgbm9vcCA9ICgpID0+IHt9XG5cbi8qKlxuICogVHJpY2sgdG8gcmVzdGFydCBhbiBlbGVtZW50J3MgYW5pbWF0aW9uXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHJldHVybiB2b2lkXG4gKlxuICogQHNlZSBodHRwczovL3d3dy5oYXJyeXRoZW8uY29tL2Jsb2cvMjAyMS8wMi9yZXN0YXJ0LWEtY3NzLWFuaW1hdGlvbi13aXRoLWphdmFzY3JpcHQvI3Jlc3RhcnRpbmctYS1jc3MtYW5pbWF0aW9uXG4gKi9cbmNvbnN0IHJlZmxvdyA9IGVsZW1lbnQgPT4ge1xuICBlbGVtZW50Lm9mZnNldEhlaWdodCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xufVxuXG5jb25zdCBnZXRqUXVlcnkgPSAoKSA9PiB7XG4gIGlmICh3aW5kb3cualF1ZXJ5ICYmICFkb2N1bWVudC5ib2R5Lmhhc0F0dHJpYnV0ZSgnZGF0YS1icy1uby1qcXVlcnknKSkge1xuICAgIHJldHVybiB3aW5kb3cualF1ZXJ5XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG5jb25zdCBET01Db250ZW50TG9hZGVkQ2FsbGJhY2tzID0gW11cblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkID0gY2FsbGJhY2sgPT4ge1xuICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2xvYWRpbmcnKSB7XG4gICAgLy8gYWRkIGxpc3RlbmVyIG9uIHRoZSBmaXJzdCBjYWxsIHdoZW4gdGhlIGRvY3VtZW50IGlzIGluIGxvYWRpbmcgc3RhdGVcbiAgICBpZiAoIURPTUNvbnRlbnRMb2FkZWRDYWxsYmFja3MubGVuZ3RoKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIERPTUNvbnRlbnRMb2FkZWRDYWxsYmFja3MpIHtcbiAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgRE9NQ29udGVudExvYWRlZENhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKVxuICB9IGVsc2Uge1xuICAgIGNhbGxiYWNrKClcbiAgfVxufVxuXG5jb25zdCBpc1JUTCA9ICgpID0+IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5kaXIgPT09ICdydGwnXG5cbmNvbnN0IGRlZmluZUpRdWVyeVBsdWdpbiA9IHBsdWdpbiA9PiB7XG4gIG9uRE9NQ29udGVudExvYWRlZCgoKSA9PiB7XG4gICAgY29uc3QgJCA9IGdldGpRdWVyeSgpXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCQpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBwbHVnaW4uTkFNRVxuICAgICAgY29uc3QgSlFVRVJZX05PX0NPTkZMSUNUID0gJC5mbltuYW1lXVxuICAgICAgJC5mbltuYW1lXSA9IHBsdWdpbi5qUXVlcnlJbnRlcmZhY2VcbiAgICAgICQuZm5bbmFtZV0uQ29uc3RydWN0b3IgPSBwbHVnaW5cbiAgICAgICQuZm5bbmFtZV0ubm9Db25mbGljdCA9ICgpID0+IHtcbiAgICAgICAgJC5mbltuYW1lXSA9IEpRVUVSWV9OT19DT05GTElDVFxuICAgICAgICByZXR1cm4gcGx1Z2luLmpRdWVyeUludGVyZmFjZVxuICAgICAgfVxuICAgIH1cbiAgfSlcbn1cblxuY29uc3QgZXhlY3V0ZSA9IChwb3NzaWJsZUNhbGxiYWNrLCBhcmdzID0gW10sIGRlZmF1bHRWYWx1ZSA9IHBvc3NpYmxlQ2FsbGJhY2spID0+IHtcbiAgcmV0dXJuIHR5cGVvZiBwb3NzaWJsZUNhbGxiYWNrID09PSAnZnVuY3Rpb24nID8gcG9zc2libGVDYWxsYmFjay5jYWxsKC4uLmFyZ3MpIDogZGVmYXVsdFZhbHVlXG59XG5cbmNvbnN0IGV4ZWN1dGVBZnRlclRyYW5zaXRpb24gPSAoY2FsbGJhY2ssIHRyYW5zaXRpb25FbGVtZW50LCB3YWl0Rm9yVHJhbnNpdGlvbiA9IHRydWUpID0+IHtcbiAgaWYgKCF3YWl0Rm9yVHJhbnNpdGlvbikge1xuICAgIGV4ZWN1dGUoY2FsbGJhY2spXG4gICAgcmV0dXJuXG4gIH1cblxuICBjb25zdCBkdXJhdGlvblBhZGRpbmcgPSA1XG4gIGNvbnN0IGVtdWxhdGVkRHVyYXRpb24gPSBnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCh0cmFuc2l0aW9uRWxlbWVudCkgKyBkdXJhdGlvblBhZGRpbmdcblxuICBsZXQgY2FsbGVkID0gZmFsc2VcblxuICBjb25zdCBoYW5kbGVyID0gKHsgdGFyZ2V0IH0pID0+IHtcbiAgICBpZiAodGFyZ2V0ICE9PSB0cmFuc2l0aW9uRWxlbWVudCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY2FsbGVkID0gdHJ1ZVxuICAgIHRyYW5zaXRpb25FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoVFJBTlNJVElPTl9FTkQsIGhhbmRsZXIpXG4gICAgZXhlY3V0ZShjYWxsYmFjaylcbiAgfVxuXG4gIHRyYW5zaXRpb25FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoVFJBTlNJVElPTl9FTkQsIGhhbmRsZXIpXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGlmICghY2FsbGVkKSB7XG4gICAgICB0cmlnZ2VyVHJhbnNpdGlvbkVuZCh0cmFuc2l0aW9uRWxlbWVudClcbiAgICB9XG4gIH0sIGVtdWxhdGVkRHVyYXRpb24pXG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBwcmV2aW91cy9uZXh0IGVsZW1lbnQgb2YgYSBsaXN0LlxuICpcbiAqIEBwYXJhbSB7YXJyYXl9IGxpc3QgICAgVGhlIGxpc3Qgb2YgZWxlbWVudHNcbiAqIEBwYXJhbSBhY3RpdmVFbGVtZW50ICAgVGhlIGFjdGl2ZSBlbGVtZW50XG4gKiBAcGFyYW0gc2hvdWxkR2V0TmV4dCAgIENob29zZSB0byBnZXQgbmV4dCBvciBwcmV2aW91cyBlbGVtZW50XG4gKiBAcGFyYW0gaXNDeWNsZUFsbG93ZWRcbiAqIEByZXR1cm4ge0VsZW1lbnR8ZWxlbX0gVGhlIHByb3BlciBlbGVtZW50XG4gKi9cbmNvbnN0IGdldE5leHRBY3RpdmVFbGVtZW50ID0gKGxpc3QsIGFjdGl2ZUVsZW1lbnQsIHNob3VsZEdldE5leHQsIGlzQ3ljbGVBbGxvd2VkKSA9PiB7XG4gIGNvbnN0IGxpc3RMZW5ndGggPSBsaXN0Lmxlbmd0aFxuICBsZXQgaW5kZXggPSBsaXN0LmluZGV4T2YoYWN0aXZlRWxlbWVudClcblxuICAvLyBpZiB0aGUgZWxlbWVudCBkb2VzIG5vdCBleGlzdCBpbiB0aGUgbGlzdCByZXR1cm4gYW4gZWxlbWVudFxuICAvLyBkZXBlbmRpbmcgb24gdGhlIGRpcmVjdGlvbiBhbmQgaWYgY3ljbGUgaXMgYWxsb3dlZFxuICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgcmV0dXJuICFzaG91bGRHZXROZXh0ICYmIGlzQ3ljbGVBbGxvd2VkID8gbGlzdFtsaXN0TGVuZ3RoIC0gMV0gOiBsaXN0WzBdXG4gIH1cblxuICBpbmRleCArPSBzaG91bGRHZXROZXh0ID8gMSA6IC0xXG5cbiAgaWYgKGlzQ3ljbGVBbGxvd2VkKSB7XG4gICAgaW5kZXggPSAoaW5kZXggKyBsaXN0TGVuZ3RoKSAlIGxpc3RMZW5ndGhcbiAgfVxuXG4gIHJldHVybiBsaXN0W01hdGgubWF4KDAsIE1hdGgubWluKGluZGV4LCBsaXN0TGVuZ3RoIC0gMSkpXVxufVxuXG5leHBvcnQge1xuICBkZWZpbmVKUXVlcnlQbHVnaW4sXG4gIGV4ZWN1dGUsXG4gIGV4ZWN1dGVBZnRlclRyYW5zaXRpb24sXG4gIGZpbmRTaGFkb3dSb290LFxuICBnZXRFbGVtZW50LFxuICBnZXRqUXVlcnksXG4gIGdldE5leHRBY3RpdmVFbGVtZW50LFxuICBnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCxcbiAgZ2V0VUlELFxuICBpc0Rpc2FibGVkLFxuICBpc0VsZW1lbnQsXG4gIGlzUlRMLFxuICBpc1Zpc2libGUsXG4gIG5vb3AsXG4gIG9uRE9NQ29udGVudExvYWRlZCxcbiAgcGFyc2VTZWxlY3RvcixcbiAgcmVmbG93LFxuICB0cmlnZ2VyVHJhbnNpdGlvbkVuZCxcbiAgdG9UeXBlXG59XG4iLCAiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQm9vdHN0cmFwIGRvbS9zZWxlY3Rvci1lbmdpbmUuanNcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFpbi9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5pbXBvcnQgeyBpc0Rpc2FibGVkLCBpc1Zpc2libGUsIHBhcnNlU2VsZWN0b3IgfSBmcm9tICcuLi91dGlsL2luZGV4LmpzJ1xuXG5jb25zdCBnZXRTZWxlY3RvciA9IGVsZW1lbnQgPT4ge1xuICBsZXQgc2VsZWN0b3IgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1icy10YXJnZXQnKVxuXG4gIGlmICghc2VsZWN0b3IgfHwgc2VsZWN0b3IgPT09ICcjJykge1xuICAgIGxldCBocmVmQXR0cmlidXRlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuXG4gICAgLy8gVGhlIG9ubHkgdmFsaWQgY29udGVudCB0aGF0IGNvdWxkIGRvdWJsZSBhcyBhIHNlbGVjdG9yIGFyZSBJRHMgb3IgY2xhc3NlcyxcbiAgICAvLyBzbyBldmVyeXRoaW5nIHN0YXJ0aW5nIHdpdGggYCNgIG9yIGAuYC4gSWYgYSBcInJlYWxcIiBVUkwgaXMgdXNlZCBhcyB0aGUgc2VsZWN0b3IsXG4gICAgLy8gYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JgIHdpbGwgcmlnaHRmdWxseSBjb21wbGFpbiBpdCBpcyBpbnZhbGlkLlxuICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvaXNzdWVzLzMyMjczXG4gICAgaWYgKCFocmVmQXR0cmlidXRlIHx8ICghaHJlZkF0dHJpYnV0ZS5pbmNsdWRlcygnIycpICYmICFocmVmQXR0cmlidXRlLnN0YXJ0c1dpdGgoJy4nKSkpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgLy8gSnVzdCBpbiBjYXNlIHNvbWUgQ01TIHB1dHMgb3V0IGEgZnVsbCBVUkwgd2l0aCB0aGUgYW5jaG9yIGFwcGVuZGVkXG4gICAgaWYgKGhyZWZBdHRyaWJ1dGUuaW5jbHVkZXMoJyMnKSAmJiAhaHJlZkF0dHJpYnV0ZS5zdGFydHNXaXRoKCcjJykpIHtcbiAgICAgIGhyZWZBdHRyaWJ1dGUgPSBgIyR7aHJlZkF0dHJpYnV0ZS5zcGxpdCgnIycpWzFdfWBcbiAgICB9XG5cbiAgICBzZWxlY3RvciA9IGhyZWZBdHRyaWJ1dGUgJiYgaHJlZkF0dHJpYnV0ZSAhPT0gJyMnID8gaHJlZkF0dHJpYnV0ZS50cmltKCkgOiBudWxsXG4gIH1cblxuICByZXR1cm4gc2VsZWN0b3IgPyBzZWxlY3Rvci5zcGxpdCgnLCcpLm1hcChzZWwgPT4gcGFyc2VTZWxlY3RvcihzZWwpKS5qb2luKCcsJykgOiBudWxsXG59XG5cbmNvbnN0IFNlbGVjdG9yRW5naW5lID0ge1xuICBmaW5kKHNlbGVjdG9yLCBlbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgcmV0dXJuIFtdLmNvbmNhdCguLi5FbGVtZW50LnByb3RvdHlwZS5xdWVyeVNlbGVjdG9yQWxsLmNhbGwoZWxlbWVudCwgc2VsZWN0b3IpKVxuICB9LFxuXG4gIGZpbmRPbmUoc2VsZWN0b3IsIGVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcbiAgICByZXR1cm4gRWxlbWVudC5wcm90b3R5cGUucXVlcnlTZWxlY3Rvci5jYWxsKGVsZW1lbnQsIHNlbGVjdG9yKVxuICB9LFxuXG4gIGNoaWxkcmVuKGVsZW1lbnQsIHNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIFtdLmNvbmNhdCguLi5lbGVtZW50LmNoaWxkcmVuKS5maWx0ZXIoY2hpbGQgPT4gY2hpbGQubWF0Y2hlcyhzZWxlY3RvcikpXG4gIH0sXG5cbiAgcGFyZW50cyhlbGVtZW50LCBzZWxlY3Rvcikge1xuICAgIGNvbnN0IHBhcmVudHMgPSBbXVxuICAgIGxldCBhbmNlc3RvciA9IGVsZW1lbnQucGFyZW50Tm9kZS5jbG9zZXN0KHNlbGVjdG9yKVxuXG4gICAgd2hpbGUgKGFuY2VzdG9yKSB7XG4gICAgICBwYXJlbnRzLnB1c2goYW5jZXN0b3IpXG4gICAgICBhbmNlc3RvciA9IGFuY2VzdG9yLnBhcmVudE5vZGUuY2xvc2VzdChzZWxlY3RvcilcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyZW50c1xuICB9LFxuXG4gIHByZXYoZWxlbWVudCwgc2VsZWN0b3IpIHtcbiAgICBsZXQgcHJldmlvdXMgPSBlbGVtZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmdcblxuICAgIHdoaWxlIChwcmV2aW91cykge1xuICAgICAgaWYgKHByZXZpb3VzLm1hdGNoZXMoc2VsZWN0b3IpKSB7XG4gICAgICAgIHJldHVybiBbcHJldmlvdXNdXG4gICAgICB9XG5cbiAgICAgIHByZXZpb3VzID0gcHJldmlvdXMucHJldmlvdXNFbGVtZW50U2libGluZ1xuICAgIH1cblxuICAgIHJldHVybiBbXVxuICB9LFxuICAvLyBUT0RPOiB0aGlzIGlzIG5vdyB1bnVzZWQ7IHJlbW92ZSBsYXRlciBhbG9uZyB3aXRoIHByZXYoKVxuICBuZXh0KGVsZW1lbnQsIHNlbGVjdG9yKSB7XG4gICAgbGV0IG5leHQgPSBlbGVtZW50Lm5leHRFbGVtZW50U2libGluZ1xuXG4gICAgd2hpbGUgKG5leHQpIHtcbiAgICAgIGlmIChuZXh0Lm1hdGNoZXMoc2VsZWN0b3IpKSB7XG4gICAgICAgIHJldHVybiBbbmV4dF1cbiAgICAgIH1cblxuICAgICAgbmV4dCA9IG5leHQubmV4dEVsZW1lbnRTaWJsaW5nXG4gICAgfVxuXG4gICAgcmV0dXJuIFtdXG4gIH0sXG5cbiAgZm9jdXNhYmxlQ2hpbGRyZW4oZWxlbWVudCkge1xuICAgIGNvbnN0IGZvY3VzYWJsZXMgPSBbXG4gICAgICAnYScsXG4gICAgICAnYnV0dG9uJyxcbiAgICAgICdpbnB1dCcsXG4gICAgICAndGV4dGFyZWEnLFxuICAgICAgJ3NlbGVjdCcsXG4gICAgICAnZGV0YWlscycsXG4gICAgICAnW3RhYmluZGV4XScsXG4gICAgICAnW2NvbnRlbnRlZGl0YWJsZT1cInRydWVcIl0nXG4gICAgXS5tYXAoc2VsZWN0b3IgPT4gYCR7c2VsZWN0b3J9Om5vdChbdGFiaW5kZXhePVwiLVwiXSlgKS5qb2luKCcsJylcblxuICAgIHJldHVybiB0aGlzLmZpbmQoZm9jdXNhYmxlcywgZWxlbWVudCkuZmlsdGVyKGVsID0+ICFpc0Rpc2FibGVkKGVsKSAmJiBpc1Zpc2libGUoZWwpKVxuICB9LFxuXG4gIGdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZWxlbWVudCkge1xuICAgIGNvbnN0IHNlbGVjdG9yID0gZ2V0U2VsZWN0b3IoZWxlbWVudClcblxuICAgIGlmIChzZWxlY3Rvcikge1xuICAgICAgcmV0dXJuIFNlbGVjdG9yRW5naW5lLmZpbmRPbmUoc2VsZWN0b3IpID8gc2VsZWN0b3IgOiBudWxsXG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGxcbiAgfSxcblxuICBnZXRFbGVtZW50RnJvbVNlbGVjdG9yKGVsZW1lbnQpIHtcbiAgICBjb25zdCBzZWxlY3RvciA9IGdldFNlbGVjdG9yKGVsZW1lbnQpXG5cbiAgICByZXR1cm4gc2VsZWN0b3IgPyBTZWxlY3RvckVuZ2luZS5maW5kT25lKHNlbGVjdG9yKSA6IG51bGxcbiAgfSxcblxuICBnZXRNdWx0aXBsZUVsZW1lbnRzRnJvbVNlbGVjdG9yKGVsZW1lbnQpIHtcbiAgICBjb25zdCBzZWxlY3RvciA9IGdldFNlbGVjdG9yKGVsZW1lbnQpXG5cbiAgICByZXR1cm4gc2VsZWN0b3IgPyBTZWxlY3RvckVuZ2luZS5maW5kKHNlbGVjdG9yKSA6IFtdXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0b3JFbmdpbmVcbiIsICIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBCb290c3RyYXAgZG9tL21hbmlwdWxhdG9yLmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuZnVuY3Rpb24gbm9ybWFsaXplRGF0YSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT09ICd0cnVlJykge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBpZiAodmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGlmICh2YWx1ZSA9PT0gTnVtYmVyKHZhbHVlKS50b1N0cmluZygpKSB7XG4gICAgcmV0dXJuIE51bWJlcih2YWx1ZSlcbiAgfVxuXG4gIGlmICh2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09ICdudWxsJykge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVEYXRhS2V5KGtleSkge1xuICByZXR1cm4ga2V5LnJlcGxhY2UoL1tBLVpdL2csIGNociA9PiBgLSR7Y2hyLnRvTG93ZXJDYXNlKCl9YClcbn1cblxuY29uc3QgTWFuaXB1bGF0b3IgPSB7XG4gIHNldERhdGFBdHRyaWJ1dGUoZWxlbWVudCwga2V5LCB2YWx1ZSkge1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGBkYXRhLWJzLSR7bm9ybWFsaXplRGF0YUtleShrZXkpfWAsIHZhbHVlKVxuICB9LFxuXG4gIHJlbW92ZURhdGFBdHRyaWJ1dGUoZWxlbWVudCwga2V5KSB7XG4gICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYGRhdGEtYnMtJHtub3JtYWxpemVEYXRhS2V5KGtleSl9YClcbiAgfSxcblxuICBnZXREYXRhQXR0cmlidXRlcyhlbGVtZW50KSB7XG4gICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICByZXR1cm4ge31cbiAgICB9XG5cbiAgICBjb25zdCBhdHRyaWJ1dGVzID0ge31cbiAgICBjb25zdCBic0tleXMgPSBPYmplY3Qua2V5cyhlbGVtZW50LmRhdGFzZXQpLmZpbHRlcihrZXkgPT4ga2V5LnN0YXJ0c1dpdGgoJ2JzJykgJiYgIWtleS5zdGFydHNXaXRoKCdic0NvbmZpZycpKVxuXG4gICAgZm9yIChjb25zdCBrZXkgb2YgYnNLZXlzKSB7XG4gICAgICBsZXQgcHVyZUtleSA9IGtleS5yZXBsYWNlKC9eYnMvLCAnJylcbiAgICAgIHB1cmVLZXkgPSBwdXJlS2V5LmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpICsgcHVyZUtleS5zbGljZSgxKVxuICAgICAgYXR0cmlidXRlc1twdXJlS2V5XSA9IG5vcm1hbGl6ZURhdGEoZWxlbWVudC5kYXRhc2V0W2tleV0pXG4gICAgfVxuXG4gICAgcmV0dXJuIGF0dHJpYnV0ZXNcbiAgfSxcblxuICBnZXREYXRhQXR0cmlidXRlKGVsZW1lbnQsIGtleSkge1xuICAgIHJldHVybiBub3JtYWxpemVEYXRhKGVsZW1lbnQuZ2V0QXR0cmlidXRlKGBkYXRhLWJzLSR7bm9ybWFsaXplRGF0YUtleShrZXkpfWApKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hbmlwdWxhdG9yXG4iLCAiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQm9vdHN0cmFwIHV0aWwvY29uZmlnLmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuaW1wb3J0IE1hbmlwdWxhdG9yIGZyb20gJy4uL2RvbS9tYW5pcHVsYXRvci5qcydcbmltcG9ydCB7IGlzRWxlbWVudCwgdG9UeXBlIH0gZnJvbSAnLi9pbmRleC5qcydcblxuLyoqXG4gKiBDbGFzcyBkZWZpbml0aW9uXG4gKi9cblxuY2xhc3MgQ29uZmlnIHtcbiAgLy8gR2V0dGVyc1xuICBzdGF0aWMgZ2V0IERlZmF1bHQoKSB7XG4gICAgcmV0dXJuIHt9XG4gIH1cblxuICBzdGF0aWMgZ2V0IERlZmF1bHRUeXBlKCkge1xuICAgIHJldHVybiB7fVxuICB9XG5cbiAgc3RhdGljIGdldCBOQU1FKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignWW91IGhhdmUgdG8gaW1wbGVtZW50IHRoZSBzdGF0aWMgbWV0aG9kIFwiTkFNRVwiLCBmb3IgZWFjaCBjb21wb25lbnQhJylcbiAgfVxuXG4gIF9nZXRDb25maWcoY29uZmlnKSB7XG4gICAgY29uZmlnID0gdGhpcy5fbWVyZ2VDb25maWdPYmooY29uZmlnKVxuICAgIGNvbmZpZyA9IHRoaXMuX2NvbmZpZ0FmdGVyTWVyZ2UoY29uZmlnKVxuICAgIHRoaXMuX3R5cGVDaGVja0NvbmZpZyhjb25maWcpXG4gICAgcmV0dXJuIGNvbmZpZ1xuICB9XG5cbiAgX2NvbmZpZ0FmdGVyTWVyZ2UoY29uZmlnKSB7XG4gICAgcmV0dXJuIGNvbmZpZ1xuICB9XG5cbiAgX21lcmdlQ29uZmlnT2JqKGNvbmZpZywgZWxlbWVudCkge1xuICAgIGNvbnN0IGpzb25Db25maWcgPSBpc0VsZW1lbnQoZWxlbWVudCkgPyBNYW5pcHVsYXRvci5nZXREYXRhQXR0cmlidXRlKGVsZW1lbnQsICdjb25maWcnKSA6IHt9IC8vIHRyeSB0byBwYXJzZVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRoaXMuY29uc3RydWN0b3IuRGVmYXVsdCxcbiAgICAgIC4uLih0eXBlb2YganNvbkNvbmZpZyA9PT0gJ29iamVjdCcgPyBqc29uQ29uZmlnIDoge30pLFxuICAgICAgLi4uKGlzRWxlbWVudChlbGVtZW50KSA/IE1hbmlwdWxhdG9yLmdldERhdGFBdHRyaWJ1dGVzKGVsZW1lbnQpIDoge30pLFxuICAgICAgLi4uKHR5cGVvZiBjb25maWcgPT09ICdvYmplY3QnID8gY29uZmlnIDoge30pXG4gICAgfVxuICB9XG5cbiAgX3R5cGVDaGVja0NvbmZpZyhjb25maWcsIGNvbmZpZ1R5cGVzID0gdGhpcy5jb25zdHJ1Y3Rvci5EZWZhdWx0VHlwZSkge1xuICAgIGZvciAoY29uc3QgW3Byb3BlcnR5LCBleHBlY3RlZFR5cGVzXSBvZiBPYmplY3QuZW50cmllcyhjb25maWdUeXBlcykpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29uZmlnW3Byb3BlcnR5XVxuICAgICAgY29uc3QgdmFsdWVUeXBlID0gaXNFbGVtZW50KHZhbHVlKSA/ICdlbGVtZW50JyA6IHRvVHlwZSh2YWx1ZSlcblxuICAgICAgaWYgKCFuZXcgUmVnRXhwKGV4cGVjdGVkVHlwZXMpLnRlc3QodmFsdWVUeXBlKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIGAke3RoaXMuY29uc3RydWN0b3IuTkFNRS50b1VwcGVyQ2FzZSgpfTogT3B0aW9uIFwiJHtwcm9wZXJ0eX1cIiBwcm92aWRlZCB0eXBlIFwiJHt2YWx1ZVR5cGV9XCIgYnV0IGV4cGVjdGVkIHR5cGUgXCIke2V4cGVjdGVkVHlwZXN9XCIuYFxuICAgICAgICApXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbmZpZ1xuIiwgIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEJvb3RzdHJhcCB1dGlsL3Nhbml0aXplci5qc1xuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8vIGpzLWRvY3Mtc3RhcnQgYWxsb3ctbGlzdFxuY29uc3QgQVJJQV9BVFRSSUJVVEVfUEFUVEVSTiA9IC9eYXJpYS1bXFx3LV0qJC9pXG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0QWxsb3dsaXN0ID0ge1xuICAvLyBHbG9iYWwgYXR0cmlidXRlcyBhbGxvd2VkIG9uIGFueSBzdXBwbGllZCBlbGVtZW50IGJlbG93LlxuICAnKic6IFsnY2xhc3MnLCAnZGlyJywgJ2lkJywgJ2xhbmcnLCAncm9sZScsIEFSSUFfQVRUUklCVVRFX1BBVFRFUk5dLFxuICBhOiBbJ3RhcmdldCcsICdocmVmJywgJ3RpdGxlJywgJ3JlbCddLFxuICBhcmVhOiBbXSxcbiAgYjogW10sXG4gIGJyOiBbXSxcbiAgY29sOiBbXSxcbiAgY29kZTogW10sXG4gIGRkOiBbXSxcbiAgZGl2OiBbXSxcbiAgZGw6IFtdLFxuICBkdDogW10sXG4gIGVtOiBbXSxcbiAgaHI6IFtdLFxuICBoMTogW10sXG4gIGgyOiBbXSxcbiAgaDM6IFtdLFxuICBoNDogW10sXG4gIGg1OiBbXSxcbiAgaDY6IFtdLFxuICBpOiBbXSxcbiAgaW1nOiBbJ3NyYycsICdzcmNzZXQnLCAnYWx0JywgJ3RpdGxlJywgJ3dpZHRoJywgJ2hlaWdodCddLFxuICBsaTogW10sXG4gIG9sOiBbXSxcbiAgcDogW10sXG4gIHByZTogW10sXG4gIHM6IFtdLFxuICBzbWFsbDogW10sXG4gIHNwYW46IFtdLFxuICBzdWI6IFtdLFxuICBzdXA6IFtdLFxuICBzdHJvbmc6IFtdLFxuICB1OiBbXSxcbiAgdWw6IFtdXG59XG4vLyBqcy1kb2NzLWVuZCBhbGxvdy1saXN0XG5cbmNvbnN0IHVyaUF0dHJpYnV0ZXMgPSBuZXcgU2V0KFtcbiAgJ2JhY2tncm91bmQnLFxuICAnY2l0ZScsXG4gICdocmVmJyxcbiAgJ2l0ZW10eXBlJyxcbiAgJ2xvbmdkZXNjJyxcbiAgJ3Bvc3RlcicsXG4gICdzcmMnLFxuICAneGxpbms6aHJlZidcbl0pXG5cbi8qKlxuICogQSBwYXR0ZXJuIHRoYXQgcmVjb2duaXplcyBVUkxzIHRoYXQgYXJlIHNhZmUgd3J0LiBYU1MgaW4gVVJMIG5hdmlnYXRpb25cbiAqIGNvbnRleHRzLlxuICpcbiAqIFNob3V0LW91dCB0byBBbmd1bGFyIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvYmxvYi8xNS4yLjgvcGFja2FnZXMvY29yZS9zcmMvc2FuaXRpemF0aW9uL3VybF9zYW5pdGl6ZXIudHMjTDM4XG4gKi9cbmNvbnN0IFNBRkVfVVJMX1BBVFRFUk4gPSAvXig/IWphdmFzY3JpcHQ6KSg/OlthLXowLTkrLi1dKzp8W14mOi8/I10qKD86Wy8/I118JCkpL2lcblxuY29uc3QgYWxsb3dlZEF0dHJpYnV0ZSA9IChhdHRyaWJ1dGUsIGFsbG93ZWRBdHRyaWJ1dGVMaXN0KSA9PiB7XG4gIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBhdHRyaWJ1dGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKVxuXG4gIGlmIChhbGxvd2VkQXR0cmlidXRlTGlzdC5pbmNsdWRlcyhhdHRyaWJ1dGVOYW1lKSkge1xuICAgIGlmICh1cmlBdHRyaWJ1dGVzLmhhcyhhdHRyaWJ1dGVOYW1lKSkge1xuICAgICAgcmV0dXJuIEJvb2xlYW4oU0FGRV9VUkxfUEFUVEVSTi50ZXN0KGF0dHJpYnV0ZS5ub2RlVmFsdWUpKVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICAvLyBDaGVjayBpZiBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB2YWxpZGF0ZXMgdGhlIGF0dHJpYnV0ZS5cbiAgcmV0dXJuIGFsbG93ZWRBdHRyaWJ1dGVMaXN0LmZpbHRlcihhdHRyaWJ1dGVSZWdleCA9PiBhdHRyaWJ1dGVSZWdleCBpbnN0YW5jZW9mIFJlZ0V4cClcbiAgICAuc29tZShyZWdleCA9PiByZWdleC50ZXN0KGF0dHJpYnV0ZU5hbWUpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVIdG1sKHVuc2FmZUh0bWwsIGFsbG93TGlzdCwgc2FuaXRpemVGdW5jdGlvbikge1xuICBpZiAoIXVuc2FmZUh0bWwubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHVuc2FmZUh0bWxcbiAgfVxuXG4gIGlmIChzYW5pdGl6ZUZ1bmN0aW9uICYmIHR5cGVvZiBzYW5pdGl6ZUZ1bmN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHNhbml0aXplRnVuY3Rpb24odW5zYWZlSHRtbClcbiAgfVxuXG4gIGNvbnN0IGRvbVBhcnNlciA9IG5ldyB3aW5kb3cuRE9NUGFyc2VyKClcbiAgY29uc3QgY3JlYXRlZERvY3VtZW50ID0gZG9tUGFyc2VyLnBhcnNlRnJvbVN0cmluZyh1bnNhZmVIdG1sLCAndGV4dC9odG1sJylcbiAgY29uc3QgZWxlbWVudHMgPSBbXS5jb25jYXQoLi4uY3JlYXRlZERvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvckFsbCgnKicpKVxuXG4gIGZvciAoY29uc3QgZWxlbWVudCBvZiBlbGVtZW50cykge1xuICAgIGNvbnN0IGVsZW1lbnROYW1lID0gZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXG5cbiAgICBpZiAoIU9iamVjdC5rZXlzKGFsbG93TGlzdCkuaW5jbHVkZXMoZWxlbWVudE5hbWUpKSB7XG4gICAgICBlbGVtZW50LnJlbW92ZSgpXG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIGNvbnN0IGF0dHJpYnV0ZUxpc3QgPSBbXS5jb25jYXQoLi4uZWxlbWVudC5hdHRyaWJ1dGVzKVxuICAgIGNvbnN0IGFsbG93ZWRBdHRyaWJ1dGVzID0gW10uY29uY2F0KGFsbG93TGlzdFsnKiddIHx8IFtdLCBhbGxvd0xpc3RbZWxlbWVudE5hbWVdIHx8IFtdKVxuXG4gICAgZm9yIChjb25zdCBhdHRyaWJ1dGUgb2YgYXR0cmlidXRlTGlzdCkge1xuICAgICAgaWYgKCFhbGxvd2VkQXR0cmlidXRlKGF0dHJpYnV0ZSwgYWxsb3dlZEF0dHJpYnV0ZXMpKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZS5ub2RlTmFtZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gY3JlYXRlZERvY3VtZW50LmJvZHkuaW5uZXJIVE1MXG59XG4iLCAiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQm9vdHN0cmFwIHV0aWwvdGVtcGxhdGUtZmFjdG9yeS5qc1xuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmltcG9ydCBTZWxlY3RvckVuZ2luZSBmcm9tICcuLi9kb20vc2VsZWN0b3ItZW5naW5lLmpzJ1xuaW1wb3J0IENvbmZpZyBmcm9tICcuL2NvbmZpZy5qcydcbmltcG9ydCB7IERlZmF1bHRBbGxvd2xpc3QsIHNhbml0aXplSHRtbCB9IGZyb20gJy4vc2FuaXRpemVyLmpzJ1xuaW1wb3J0IHsgZXhlY3V0ZSwgZ2V0RWxlbWVudCwgaXNFbGVtZW50IH0gZnJvbSAnLi9pbmRleC5qcydcblxuLyoqXG4gKiBDb25zdGFudHNcbiAqL1xuXG5jb25zdCBOQU1FID0gJ1RlbXBsYXRlRmFjdG9yeSdcblxuY29uc3QgRGVmYXVsdCA9IHtcbiAgYWxsb3dMaXN0OiBEZWZhdWx0QWxsb3dsaXN0LFxuICBjb250ZW50OiB7fSwgLy8geyBzZWxlY3RvciA6IHRleHQgLCAgc2VsZWN0b3IyIDogdGV4dDIgLCB9XG4gIGV4dHJhQ2xhc3M6ICcnLFxuICBodG1sOiBmYWxzZSxcbiAgc2FuaXRpemU6IHRydWUsXG4gIHNhbml0aXplRm46IG51bGwsXG4gIHRlbXBsYXRlOiAnPGRpdj48L2Rpdj4nXG59XG5cbmNvbnN0IERlZmF1bHRUeXBlID0ge1xuICBhbGxvd0xpc3Q6ICdvYmplY3QnLFxuICBjb250ZW50OiAnb2JqZWN0JyxcbiAgZXh0cmFDbGFzczogJyhzdHJpbmd8ZnVuY3Rpb24pJyxcbiAgaHRtbDogJ2Jvb2xlYW4nLFxuICBzYW5pdGl6ZTogJ2Jvb2xlYW4nLFxuICBzYW5pdGl6ZUZuOiAnKG51bGx8ZnVuY3Rpb24pJyxcbiAgdGVtcGxhdGU6ICdzdHJpbmcnXG59XG5cbmNvbnN0IERlZmF1bHRDb250ZW50VHlwZSA9IHtcbiAgZW50cnk6ICcoc3RyaW5nfGVsZW1lbnR8ZnVuY3Rpb258bnVsbCknLFxuICBzZWxlY3RvcjogJyhzdHJpbmd8ZWxlbWVudCknXG59XG5cbi8qKlxuICogQ2xhc3MgZGVmaW5pdGlvblxuICovXG5cbmNsYXNzIFRlbXBsYXRlRmFjdG9yeSBleHRlbmRzIENvbmZpZyB7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLl9jb25maWcgPSB0aGlzLl9nZXRDb25maWcoY29uZmlnKVxuICB9XG5cbiAgLy8gR2V0dGVyc1xuICBzdGF0aWMgZ2V0IERlZmF1bHQoKSB7XG4gICAgcmV0dXJuIERlZmF1bHRcbiAgfVxuXG4gIHN0YXRpYyBnZXQgRGVmYXVsdFR5cGUoKSB7XG4gICAgcmV0dXJuIERlZmF1bHRUeXBlXG4gIH1cblxuICBzdGF0aWMgZ2V0IE5BTUUoKSB7XG4gICAgcmV0dXJuIE5BTUVcbiAgfVxuXG4gIC8vIFB1YmxpY1xuICBnZXRDb250ZW50KCkge1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMuX2NvbmZpZy5jb250ZW50KVxuICAgICAgLm1hcChjb25maWcgPT4gdGhpcy5fcmVzb2x2ZVBvc3NpYmxlRnVuY3Rpb24oY29uZmlnKSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgfVxuXG4gIGhhc0NvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q29udGVudCgpLmxlbmd0aCA+IDBcbiAgfVxuXG4gIGNoYW5nZUNvbnRlbnQoY29udGVudCkge1xuICAgIHRoaXMuX2NoZWNrQ29udGVudChjb250ZW50KVxuICAgIHRoaXMuX2NvbmZpZy5jb250ZW50ID0geyAuLi50aGlzLl9jb25maWcuY29udGVudCwgLi4uY29udGVudCB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHRvSHRtbCgpIHtcbiAgICBjb25zdCB0ZW1wbGF0ZVdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRlbXBsYXRlV3JhcHBlci5pbm5lckhUTUwgPSB0aGlzLl9tYXliZVNhbml0aXplKHRoaXMuX2NvbmZpZy50ZW1wbGF0ZSlcblxuICAgIGZvciAoY29uc3QgW3NlbGVjdG9yLCB0ZXh0XSBvZiBPYmplY3QuZW50cmllcyh0aGlzLl9jb25maWcuY29udGVudCkpIHtcbiAgICAgIHRoaXMuX3NldENvbnRlbnQodGVtcGxhdGVXcmFwcGVyLCB0ZXh0LCBzZWxlY3RvcilcbiAgICB9XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHRlbXBsYXRlV3JhcHBlci5jaGlsZHJlblswXVxuICAgIGNvbnN0IGV4dHJhQ2xhc3MgPSB0aGlzLl9yZXNvbHZlUG9zc2libGVGdW5jdGlvbih0aGlzLl9jb25maWcuZXh0cmFDbGFzcylcblxuICAgIGlmIChleHRyYUNsYXNzKSB7XG4gICAgICB0ZW1wbGF0ZS5jbGFzc0xpc3QuYWRkKC4uLmV4dHJhQ2xhc3Muc3BsaXQoJyAnKSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGVtcGxhdGVcbiAgfVxuXG4gIC8vIFByaXZhdGVcbiAgX3R5cGVDaGVja0NvbmZpZyhjb25maWcpIHtcbiAgICBzdXBlci5fdHlwZUNoZWNrQ29uZmlnKGNvbmZpZylcbiAgICB0aGlzLl9jaGVja0NvbnRlbnQoY29uZmlnLmNvbnRlbnQpXG4gIH1cblxuICBfY2hlY2tDb250ZW50KGFyZykge1xuICAgIGZvciAoY29uc3QgW3NlbGVjdG9yLCBjb250ZW50XSBvZiBPYmplY3QuZW50cmllcyhhcmcpKSB7XG4gICAgICBzdXBlci5fdHlwZUNoZWNrQ29uZmlnKHsgc2VsZWN0b3IsIGVudHJ5OiBjb250ZW50IH0sIERlZmF1bHRDb250ZW50VHlwZSlcbiAgICB9XG4gIH1cblxuICBfc2V0Q29udGVudCh0ZW1wbGF0ZSwgY29udGVudCwgc2VsZWN0b3IpIHtcbiAgICBjb25zdCB0ZW1wbGF0ZUVsZW1lbnQgPSBTZWxlY3RvckVuZ2luZS5maW5kT25lKHNlbGVjdG9yLCB0ZW1wbGF0ZSlcblxuICAgIGlmICghdGVtcGxhdGVFbGVtZW50KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb250ZW50ID0gdGhpcy5fcmVzb2x2ZVBvc3NpYmxlRnVuY3Rpb24oY29udGVudClcblxuICAgIGlmICghY29udGVudCkge1xuICAgICAgdGVtcGxhdGVFbGVtZW50LnJlbW92ZSgpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoaXNFbGVtZW50KGNvbnRlbnQpKSB7XG4gICAgICB0aGlzLl9wdXRFbGVtZW50SW5UZW1wbGF0ZShnZXRFbGVtZW50KGNvbnRlbnQpLCB0ZW1wbGF0ZUVsZW1lbnQpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fY29uZmlnLmh0bWwpIHtcbiAgICAgIHRlbXBsYXRlRWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLl9tYXliZVNhbml0aXplKGNvbnRlbnQpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0ZW1wbGF0ZUVsZW1lbnQudGV4dENvbnRlbnQgPSBjb250ZW50XG4gIH1cblxuICBfbWF5YmVTYW5pdGl6ZShhcmcpIHtcbiAgICByZXR1cm4gdGhpcy5fY29uZmlnLnNhbml0aXplID8gc2FuaXRpemVIdG1sKGFyZywgdGhpcy5fY29uZmlnLmFsbG93TGlzdCwgdGhpcy5fY29uZmlnLnNhbml0aXplRm4pIDogYXJnXG4gIH1cblxuICBfcmVzb2x2ZVBvc3NpYmxlRnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGV4ZWN1dGUoYXJnLCBbdW5kZWZpbmVkLCB0aGlzXSlcbiAgfVxuXG4gIF9wdXRFbGVtZW50SW5UZW1wbGF0ZShlbGVtZW50LCB0ZW1wbGF0ZUVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5fY29uZmlnLmh0bWwpIHtcbiAgICAgIHRlbXBsYXRlRWxlbWVudC5pbm5lckhUTUwgPSAnJ1xuICAgICAgdGVtcGxhdGVFbGVtZW50LmFwcGVuZChlbGVtZW50KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGVtcGxhdGVFbGVtZW50LnRleHRDb250ZW50ID0gZWxlbWVudC50ZXh0Q29udGVudFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRlbXBsYXRlRmFjdG9yeVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7O0FBT0EsWUFBTUEsVUFBVTtBQUNoQixZQUFNQywwQkFBMEI7QUFDaEMsWUFBTUMsaUJBQWlCO0FBT3ZCLFlBQU1DLGdCQUFnQkMscUNBQVk7QUFDaEMsWUFBSUEsWUFBWUMsT0FBT0MsT0FBT0QsT0FBT0MsSUFBSUMsUUFBUTtBQUUvQ0gscUJBQVdBLFNBQVNJLFFBQVEsaUJBQWlCLENBQUNDLE9BQU9DLE9BQU8sSUFBSUosSUFBSUMsT0FBT0csRUFBRSxDQUFDLEVBQUU7UUFDbEY7QUFFQSxlQUFPTjtNQUNULEdBUHNCQTtBQVV0QixZQUFNTyxT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TztBQUUvQyxjQUFJLENBQUNBLFNBQVM7QUFDWjBDLDRCQUFnQkcsT0FBTTtBQUN0QjtVQUNGO0FBRUEsY0FBSUMsU0FBQUEsVUFBVTlDLE9BQU8sR0FBRztBQUN0QixpQkFBSytDLHNCQUFzQkMsU0FBQUEsV0FBV2hELE9BQU8sR0FBRzBDLGVBQWU7QUFDL0Q7VUFDRjtBQUVBLGNBQUksS0FBSzVCLFFBQVFaLE1BQU07QUFDckJ3Qyw0QkFBZ0JYLFlBQVksS0FBS0MsZUFBZWhDLE9BQU87QUFDdkQ7VUFDRjtBQUVBMEMsMEJBQWdCTyxjQUFjakQ7UUFDaEM7UUFFQWdDLGVBQWVTLEtBQUs7QUFDbEIsaUJBQU8sS0FBSzNCLFFBQVFYLFdBQVcrQyxhQUFBQSxhQUFhVCxLQUFLLEtBQUszQixRQUFRaEIsV0FBVyxLQUFLZ0IsUUFBUVYsVUFBVSxJQUFJcUM7UUFDdEc7UUFFQXJCLHlCQUF5QnFCLEtBQUs7QUFDNUIsaUJBQU9VLFNBQUFBLFFBQVFWLEtBQUssQ0FBQ1csUUFBVyxJQUFJLENBQUM7UUFDdkM7UUFFQUwsc0JBQXNCTSxTQUFTWCxpQkFBaUI7QUFDOUMsY0FBSSxLQUFLNUIsUUFBUVosTUFBTTtBQUNyQndDLDRCQUFnQlgsWUFBWTtBQUM1QlcsNEJBQWdCWSxPQUFPRCxPQUFPO0FBQzlCO1VBQ0Y7QUFFQVgsMEJBQWdCTyxjQUFjSSxRQUFRSjtRQUN4QztNQUNGOzs7OzsiLAogICJuYW1lcyI6IFsiTUFYX1VJRCIsICJNSUxMSVNFQ09ORFNfTVVMVElQTElFUiIsICJUUkFOU0lUSU9OX0VORCIsICJwYXJzZVNlbGVjdG9yIiwgInNlbGVjdG9yIiwgIndpbmRvdyIsICJDU1MiLCAiZXNjYXBlIiwgInJlcGxhY2UiLCAibWF0Y2giLCAiaWQiLCAidG9UeXBlIiwgIm9iamVjdCIsICJ1bmRlZmluZWQiLCAiT2JqZWN0IiwgInByb3RvdHlwZSIsICJ0b1N0cmluZyIsICJjYWxsIiwgInRvTG93ZXJDYXNlIiwgImdldFVJRCIsICJwcmVmaXgiLCAiTWF0aCIsICJmbG9vciIsICJyYW5kb20iLCAiZG9jdW1lbnQiLCAiZ2V0RWxlbWVudEJ5SWQiLCAiZ2V0VHJhbnNpdGlvbkR1cmF0aW9uRnJvbUVsZW1lbnQiLCAiZWxlbWVudCIsICJ0cmFuc2l0aW9uRHVyYXRpb24iLCAidHJhbnNpdGlvbkRlbGF5IiwgImdldENvbXB1dGVkU3R5bGUiLCAiZmxvYXRUcmFuc2l0aW9uRHVyYXRpb24iLCAiTnVtYmVyIiwgInBhcnNlRmxvYXQiLCAiZmxvYXRUcmFuc2l0aW9uRGVsYXkiLCAic3BsaXQiLCAidHJpZ2dlclRyYW5zaXRpb25FbmQiLCAiZGlzcGF0Y2hFdmVudCIsICJFdmVudCIsICJpc0VsZW1lbnQiLCAianF1ZXJ5IiwgIm5vZGVUeXBlIiwgImdldEVsZW1lbnQiLCAibGVuZ3RoIiwgInF1ZXJ5U2VsZWN0b3IiLCAiaXNWaXNpYmxlIiwgImdldENsaWVudFJlY3RzIiwgImVsZW1lbnRJc1Zpc2libGUiLCAiZ2V0UHJvcGVydHlWYWx1ZSIsICJjbG9zZWREZXRhaWxzIiwgImNsb3Nlc3QiLCAic3VtbWFyeSIsICJwYXJlbnROb2RlIiwgImlzRGlzYWJsZWQiLCAiTm9kZSIsICJFTEVNRU5UX05PREUiLCAiY2xhc3NMaXN0IiwgImNvbnRhaW5zIiwgImRpc2FibGVkIiwgImhhc0F0dHJpYnV0ZSIsICJnZXRBdHRyaWJ1dGUiLCAiZmluZFNoYWRvd1Jvb3QiLCAiZG9jdW1lbnRFbGVtZW50IiwgImF0dGFjaFNoYWRvdyIsICJnZXRSb290Tm9kZSIsICJyb290IiwgIlNoYWRvd1Jvb3QiLCAibm9vcCIsICJyZWZsb3ciLCAib2Zmc2V0SGVpZ2h0IiwgImdldGpRdWVyeSIsICJqUXVlcnkiLCAiYm9keSIsICJET01Db250ZW50TG9hZGVkQ2FsbGJhY2tzIiwgIm9uRE9NQ29udGVudExvYWRlZCIsICJjYWxsYmFjayIsICJyZWFkeVN0YXRlIiwgImFkZEV2ZW50TGlzdGVuZXIiLCAicHVzaCIsICJpc1JUTCIsICJkaXIiLCAiZGVmaW5lSlF1ZXJ5UGx1Z2luIiwgInBsdWdpbiIsICIkIiwgIm5hbWUiLCAiTkFNRSIsICJKUVVFUllfTk9fQ09ORkxJQ1QiLCAiZm4iLCAialF1ZXJ5SW50ZXJmYWNlIiwgIkNvbnN0cnVjdG9yIiwgIm5vQ29uZmxpY3QiLCAiZXhlY3V0ZSIsICJwb3NzaWJsZUNhbGxiYWNrIiwgImFyZ3MiLCAiZGVmYXVsdFZhbHVlIiwgImV4ZWN1dGVBZnRlclRyYW5zaXRpb24iLCAidHJhbnNpdGlvbkVsZW1lbnQiLCAid2FpdEZvclRyYW5zaXRpb24iLCAiZHVyYXRpb25QYWRkaW5nIiwgImVtdWxhdGVkRHVyYXRpb24iLCAiY2FsbGVkIiwgImhhbmRsZXIiLCAidGFyZ2V0IiwgInJlbW92ZUV2ZW50TGlzdGVuZXIiLCAic2V0VGltZW91dCIsICJnZXROZXh0QWN0aXZlRWxlbWVudCIsICJsaXN0IiwgImFjdGl2ZUVsZW1lbnQiLCAic2hvdWxkR2V0TmV4dCIsICJpc0N5Y2xlQWxsb3dlZCIsICJsaXN0TGVuZ3RoIiwgImluZGV4IiwgImluZGV4T2YiLCAibWF4IiwgIm1pbiIsICJnZXRTZWxlY3RvciIsICJlbGVtZW50IiwgInNlbGVjdG9yIiwgImdldEF0dHJpYnV0ZSIsICJocmVmQXR0cmlidXRlIiwgImluY2x1ZGVzIiwgInN0YXJ0c1dpdGgiLCAic3BsaXQiLCAidHJpbSIsICJtYXAiLCAic2VsIiwgInBhcnNlU2VsZWN0b3IiLCAiam9pbiIsICJTZWxlY3RvckVuZ2luZSIsICJmaW5kIiwgImRvY3VtZW50IiwgImRvY3VtZW50RWxlbWVudCIsICJjb25jYXQiLCAiRWxlbWVudCIsICJwcm90b3R5cGUiLCAicXVlcnlTZWxlY3RvckFsbCIsICJjYWxsIiwgImZpbmRPbmUiLCAicXVlcnlTZWxlY3RvciIsICJjaGlsZHJlbiIsICJmaWx0ZXIiLCAiY2hpbGQiLCAibWF0Y2hlcyIsICJwYXJlbnRzIiwgImFuY2VzdG9yIiwgInBhcmVudE5vZGUiLCAiY2xvc2VzdCIsICJwdXNoIiwgInByZXYiLCAicHJldmlvdXMiLCAicHJldmlvdXNFbGVtZW50U2libGluZyIsICJuZXh0IiwgIm5leHRFbGVtZW50U2libGluZyIsICJmb2N1c2FibGVDaGlsZHJlbiIsICJmb2N1c2FibGVzIiwgImVsIiwgImlzRGlzYWJsZWQiLCAiaXNWaXNpYmxlIiwgImdldFNlbGVjdG9yRnJvbUVsZW1lbnQiLCAiZ2V0RWxlbWVudEZyb21TZWxlY3RvciIsICJnZXRNdWx0aXBsZUVsZW1lbnRzRnJvbVNlbGVjdG9yIiwgIm5vcm1hbGl6ZURhdGEiLCAidmFsdWUiLCAiTnVtYmVyIiwgInRvU3RyaW5nIiwgIkpTT04iLCAicGFyc2UiLCAiZGVjb2RlVVJJQ29tcG9uZW50IiwgIl91bnVzZWQiLCAibm9ybWFsaXplRGF0YUtleSIsICJrZXkiLCAicmVwbGFjZSIsICJjaHIiLCAidG9Mb3dlckNhc2UiLCAiTWFuaXB1bGF0b3IiLCAic2V0RGF0YUF0dHJpYnV0ZSIsICJlbGVtZW50IiwgInNldEF0dHJpYnV0ZSIsICJyZW1vdmVEYXRhQXR0cmlidXRlIiwgInJlbW92ZUF0dHJpYnV0ZSIsICJnZXREYXRhQXR0cmlidXRlcyIsICJhdHRyaWJ1dGVzIiwgImJzS2V5cyIsICJPYmplY3QiLCAia2V5cyIsICJkYXRhc2V0IiwgImZpbHRlciIsICJzdGFydHNXaXRoIiwgInB1cmVLZXkiLCAiY2hhckF0IiwgInNsaWNlIiwgImdldERhdGFBdHRyaWJ1dGUiLCAiZ2V0QXR0cmlidXRlIiwgIkNvbmZpZyIsICJEZWZhdWx0IiwgIkRlZmF1bHRUeXBlIiwgIk5BTUUiLCAiRXJyb3IiLCAiX2dldENvbmZpZyIsICJjb25maWciLCAiX21lcmdlQ29uZmlnT2JqIiwgIl9jb25maWdBZnRlck1lcmdlIiwgIl90eXBlQ2hlY2tDb25maWciLCAiZWxlbWVudCIsICJqc29uQ29uZmlnIiwgImlzRWxlbWVudCIsICJNYW5pcHVsYXRvciIsICJnZXREYXRhQXR0cmlidXRlIiwgImNvbnN0cnVjdG9yIiwgImdldERhdGFBdHRyaWJ1dGVzIiwgImNvbmZpZ1R5cGVzIiwgInByb3BlcnR5IiwgImV4cGVjdGVkVHlwZXMiLCAiT2JqZWN0IiwgImVudHJpZXMiLCAidmFsdWUiLCAidmFsdWVUeXBlIiwgInRvVHlwZSIsICJSZWdFeHAiLCAidGVzdCIsICJUeXBlRXJyb3IiLCAidG9VcHBlckNhc2UiLCAiQVJJQV9BVFRSSUJVVEVfUEFUVEVSTiIsICJEZWZhdWx0QWxsb3dsaXN0IiwgImEiLCAiYXJlYSIsICJiIiwgImJyIiwgImNvbCIsICJjb2RlIiwgImRkIiwgImRpdiIsICJkbCIsICJkdCIsICJlbSIsICJociIsICJoMSIsICJoMiIsICJoMyIsICJoNCIsICJoNSIsICJoNiIsICJpIiwgImltZyIsICJsaSIsICJvbCIsICJwIiwgInByZSIsICJzIiwgInNtYWxsIiwgInNwYW4iLCAic3ViIiwgInN1cCIsICJzdHJvbmciLCAidSIsICJ1bCIsICJ1cmlBdHRyaWJ1dGVzIiwgIlNldCIsICJTQUZFX1VSTF9QQVRURVJOIiwgImFsbG93ZWRBdHRyaWJ1dGUiLCAiYXR0cmlidXRlIiwgImFsbG93ZWRBdHRyaWJ1dGVMaXN0IiwgImF0dHJpYnV0ZU5hbWUiLCAibm9kZU5hbWUiLCAidG9Mb3dlckNhc2UiLCAiaW5jbHVkZXMiLCAiaGFzIiwgIkJvb2xlYW4iLCAidGVzdCIsICJub2RlVmFsdWUiLCAiZmlsdGVyIiwgImF0dHJpYnV0ZVJlZ2V4IiwgIlJlZ0V4cCIsICJzb21lIiwgInJlZ2V4IiwgInNhbml0aXplSHRtbCIsICJ1bnNhZmVIdG1sIiwgImFsbG93TGlzdCIsICJzYW5pdGl6ZUZ1bmN0aW9uIiwgImxlbmd0aCIsICJkb21QYXJzZXIiLCAid2luZG93IiwgIkRPTVBhcnNlciIsICJjcmVhdGVkRG9jdW1lbnQiLCAicGFyc2VGcm9tU3RyaW5nIiwgImVsZW1lbnRzIiwgImNvbmNhdCIsICJib2R5IiwgInF1ZXJ5U2VsZWN0b3JBbGwiLCAiZWxlbWVudCIsICJlbGVtZW50TmFtZSIsICJPYmplY3QiLCAia2V5cyIsICJyZW1vdmUiLCAiYXR0cmlidXRlTGlzdCIsICJhdHRyaWJ1dGVzIiwgImFsbG93ZWRBdHRyaWJ1dGVzIiwgInJlbW92ZUF0dHJpYnV0ZSIsICJpbm5lckhUTUwiLCAiTkFNRSIsICJEZWZhdWx0IiwgImFsbG93TGlzdCIsICJEZWZhdWx0QWxsb3dsaXN0IiwgImNvbnRlbnQiLCAiZXh0cmFDbGFzcyIsICJodG1sIiwgInNhbml0aXplIiwgInNhbml0aXplRm4iLCAidGVtcGxhdGUiLCAiRGVmYXVsdFR5cGUiLCAiRGVmYXVsdENvbnRlbnRUeXBlIiwgImVudHJ5IiwgInNlbGVjdG9yIiwgIlRlbXBsYXRlRmFjdG9yeSIsICJDb25maWciLCAiY29uc3RydWN0b3IiLCAiY29uZmlnIiwgIl9jb25maWciLCAiX2dldENvbmZpZyIsICJnZXRDb250ZW50IiwgIk9iamVjdCIsICJ2YWx1ZXMiLCAibWFwIiwgIl9yZXNvbHZlUG9zc2libGVGdW5jdGlvbiIsICJmaWx0ZXIiLCAiQm9vbGVhbiIsICJoYXNDb250ZW50IiwgImxlbmd0aCIsICJjaGFuZ2VDb250ZW50IiwgIl9jaGVja0NvbnRlbnQiLCAidG9IdG1sIiwgInRlbXBsYXRlV3JhcHBlciIsICJkb2N1bWVudCIsICJjcmVhdGVFbGVtZW50IiwgImlubmVySFRNTCIsICJfbWF5YmVTYW5pdGl6ZSIsICJ0ZXh0IiwgImVudHJpZXMiLCAiX3NldENvbnRlbnQiLCAiY2hpbGRyZW4iLCAiY2xhc3NMaXN0IiwgImFkZCIsICJzcGxpdCIsICJfdHlwZUNoZWNrQ29uZmlnIiwgImFyZyIsICJ0ZW1wbGF0ZUVsZW1lbnQiLCAiU2VsZWN0b3JFbmdpbmUiLCAiZmluZE9uZSIsICJyZW1vdmUiLCAiaXNFbGVtZW50IiwgIl9wdXRFbGVtZW50SW5UZW1wbGF0ZSIsICJnZXRFbGVtZW50IiwgInRleHRDb250ZW50IiwgInNhbml0aXplSHRtbCIsICJleGVjdXRlIiwgInVuZGVmaW5lZCIsICJlbGVtZW50IiwgImFwcGVuZCJdCn0K
