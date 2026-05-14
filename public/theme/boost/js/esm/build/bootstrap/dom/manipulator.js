var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// public/theme/boost/js/esm/src/bootstrap/dom/manipulator.js
var require_manipulator = __commonJS({
  "public/theme/boost/js/esm/src/bootstrap/dom/manipulator.js"(exports, module) {
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
export default require_manipulator();
/*!
  * Bootstrap manipulator.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL3NyYy9kb20vbWFuaXB1bGF0b3IuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEJvb3RzdHJhcCBkb20vbWFuaXB1bGF0b3IuanNcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFpbi9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5mdW5jdGlvbiBub3JtYWxpemVEYXRhKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PT0gJ3RydWUnKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgaWYgKHZhbHVlID09PSBOdW1iZXIodmFsdWUpLnRvU3RyaW5nKCkpIHtcbiAgICByZXR1cm4gTnVtYmVyKHZhbHVlKVxuICB9XG5cbiAgaWYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJ251bGwnKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cblxuICB0cnkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpXG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiB2YWx1ZVxuICB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZURhdGFLZXkoa2V5KSB7XG4gIHJldHVybiBrZXkucmVwbGFjZSgvW0EtWl0vZywgY2hyID0+IGAtJHtjaHIudG9Mb3dlckNhc2UoKX1gKVxufVxuXG5jb25zdCBNYW5pcHVsYXRvciA9IHtcbiAgc2V0RGF0YUF0dHJpYnV0ZShlbGVtZW50LCBrZXksIHZhbHVlKSB7XG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYGRhdGEtYnMtJHtub3JtYWxpemVEYXRhS2V5KGtleSl9YCwgdmFsdWUpXG4gIH0sXG5cbiAgcmVtb3ZlRGF0YUF0dHJpYnV0ZShlbGVtZW50LCBrZXkpIHtcbiAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShgZGF0YS1icy0ke25vcm1hbGl6ZURhdGFLZXkoa2V5KX1gKVxuICB9LFxuXG4gIGdldERhdGFBdHRyaWJ1dGVzKGVsZW1lbnQpIHtcbiAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgIHJldHVybiB7fVxuICAgIH1cblxuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSB7fVxuICAgIGNvbnN0IGJzS2V5cyA9IE9iamVjdC5rZXlzKGVsZW1lbnQuZGF0YXNldCkuZmlsdGVyKGtleSA9PiBrZXkuc3RhcnRzV2l0aCgnYnMnKSAmJiAha2V5LnN0YXJ0c1dpdGgoJ2JzQ29uZmlnJykpXG5cbiAgICBmb3IgKGNvbnN0IGtleSBvZiBic0tleXMpIHtcbiAgICAgIGxldCBwdXJlS2V5ID0ga2V5LnJlcGxhY2UoL15icy8sICcnKVxuICAgICAgcHVyZUtleSA9IHB1cmVLZXkuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyBwdXJlS2V5LnNsaWNlKDEpXG4gICAgICBhdHRyaWJ1dGVzW3B1cmVLZXldID0gbm9ybWFsaXplRGF0YShlbGVtZW50LmRhdGFzZXRba2V5XSlcbiAgICB9XG5cbiAgICByZXR1cm4gYXR0cmlidXRlc1xuICB9LFxuXG4gIGdldERhdGFBdHRyaWJ1dGUoZWxlbWVudCwga2V5KSB7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZURhdGEoZWxlbWVudC5nZXRBdHRyaWJ1dGUoYGRhdGEtYnMtJHtub3JtYWxpemVEYXRhS2V5KGtleSl9YCkpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFuaXB1bGF0b3JcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7O0FBT0EsZUFBU0EsY0FBY0MsT0FBTztBQUM1QixZQUFJQSxVQUFVLFFBQVE7QUFDcEIsaUJBQU87UUFDVDtBQUVBLFlBQUlBLFVBQVUsU0FBUztBQUNyQixpQkFBTztRQUNUO0FBRUEsWUFBSUEsVUFBVUMsT0FBT0QsS0FBSyxFQUFFRSxTQUFRLEdBQUk7QUFDdEMsaUJBQU9ELE9BQU9ELEtBQUs7UUFDckI7QUFFQSxZQUFJQSxVQUFVLE1BQU1BLFVBQVUsUUFBUTtBQUNwQyxpQkFBTztRQUNUO0FBRUEsWUFBSSxPQUFPQSxVQUFVLFVBQVU7QUFDN0IsaUJBQU9BO1FBQ1Q7QUFFQSxZQUFJO0FBQ0YsaUJBQU9HLEtBQUtDLE1BQU1DLG1CQUFtQkwsS0FBSyxDQUFDO1FBQzdDLFNBQUVNLFNBQU07QUFDTixpQkFBT047UUFDVDtNQUNGO0FBMUJTRDtBQTRCVCxlQUFTUSxpQkFBaUJDLEtBQUs7QUFDN0IsZUFBT0EsSUFBSUMsUUFBUSxVQUFVQyxTQUFPLElBQUlBLElBQUlDLFlBQVcsQ0FBRSxFQUFFO01BQzdEO0FBRlNKO0FBSVQsWUFBTUssY0FBYztRQUNsQkMsaUJBQWlCQyxTQUFTTixLQUFLUixPQUFPO0FBQ3BDYyxrQkFBUUMsYUFBYSxXQUFXUixpQkFBaUJDLEdBQUcsQ0FBQyxJQUFJUixLQUFLO1FBQ2hFO1FBRUFnQixvQkFBb0JGLFNBQVNOLEtBQUs7QUFDaENNLGtCQUFRRyxnQkFBZ0IsV0FBV1YsaUJBQWlCQyxHQUFHLENBQUMsRUFBRTtRQUM1RDtRQUVBVSxrQkFBa0JKLFNBQVM7QUFDekIsY0FBSSxDQUFDQSxTQUFTO0FBQ1osbUJBQU8sQ0FBQTtVQUNUO0FBRUEsZ0JBQU1LLGFBQWEsQ0FBQTtBQUNuQixnQkFBTUMsU0FBU0MsT0FBT0MsS0FBS1IsUUFBUVMsT0FBTyxFQUFFQyxPQUFPaEIsU0FBT0EsSUFBSWlCLFdBQVcsSUFBSSxLQUFLLENBQUNqQixJQUFJaUIsV0FBVyxVQUFVLENBQUM7QUFFN0cscUJBQVdqQixPQUFPWSxRQUFRO0FBQ3hCLGdCQUFJTSxVQUFVbEIsSUFBSUMsUUFBUSxPQUFPLEVBQUU7QUFDbkNpQixzQkFBVUEsUUFBUUMsT0FBTyxDQUFDLEVBQUVoQixZQUFXLElBQUtlLFFBQVFFLE1BQU0sQ0FBQztBQUMzRFQsdUJBQVdPLE9BQU8sSUFBSTNCLGNBQWNlLFFBQVFTLFFBQVFmLEdBQUcsQ0FBQztVQUMxRDtBQUVBLGlCQUFPVztRQUNUO1FBRUFVLGlCQUFpQmYsU0FBU04sS0FBSztBQUM3QixpQkFBT1QsY0FBY2UsUUFBUWdCLGFBQWEsV0FBV3ZCLGlCQUFpQkMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUMvRTtNQUNGOzs7OzsiLAogICJuYW1lcyI6IFsibm9ybWFsaXplRGF0YSIsICJ2YWx1ZSIsICJOdW1iZXIiLCAidG9TdHJpbmciLCAiSlNPTiIsICJwYXJzZSIsICJkZWNvZGVVUklDb21wb25lbnQiLCAiX3VudXNlZCIsICJub3JtYWxpemVEYXRhS2V5IiwgImtleSIsICJyZXBsYWNlIiwgImNociIsICJ0b0xvd2VyQ2FzZSIsICJNYW5pcHVsYXRvciIsICJzZXREYXRhQXR0cmlidXRlIiwgImVsZW1lbnQiLCAic2V0QXR0cmlidXRlIiwgInJlbW92ZURhdGFBdHRyaWJ1dGUiLCAicmVtb3ZlQXR0cmlidXRlIiwgImdldERhdGFBdHRyaWJ1dGVzIiwgImF0dHJpYnV0ZXMiLCAiYnNLZXlzIiwgIk9iamVjdCIsICJrZXlzIiwgImRhdGFzZXQiLCAiZmlsdGVyIiwgInN0YXJ0c1dpdGgiLCAicHVyZUtleSIsICJjaGFyQXQiLCAic2xpY2UiLCAiZ2V0RGF0YUF0dHJpYnV0ZSIsICJnZXRBdHRyaWJ1dGUiXQp9Cg==
