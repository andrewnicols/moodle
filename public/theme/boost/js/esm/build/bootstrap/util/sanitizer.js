var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// public/theme/boost/js/esm/src/bootstrap/util/sanitizer.js
var require_sanitizer = __commonJS({
  "public/theme/boost/js/esm/src/bootstrap/util/sanitizer.js"(exports, module) {
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
export default require_sanitizer();
/*!
  * Bootstrap sanitizer.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL3NyYy91dGlsL3Nhbml0aXplci5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQm9vdHN0cmFwIHV0aWwvc2FuaXRpemVyLmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLy8ganMtZG9jcy1zdGFydCBhbGxvdy1saXN0XG5jb25zdCBBUklBX0FUVFJJQlVURV9QQVRURVJOID0gL15hcmlhLVtcXHctXSokL2lcblxuZXhwb3J0IGNvbnN0IERlZmF1bHRBbGxvd2xpc3QgPSB7XG4gIC8vIEdsb2JhbCBhdHRyaWJ1dGVzIGFsbG93ZWQgb24gYW55IHN1cHBsaWVkIGVsZW1lbnQgYmVsb3cuXG4gICcqJzogWydjbGFzcycsICdkaXInLCAnaWQnLCAnbGFuZycsICdyb2xlJywgQVJJQV9BVFRSSUJVVEVfUEFUVEVSTl0sXG4gIGE6IFsndGFyZ2V0JywgJ2hyZWYnLCAndGl0bGUnLCAncmVsJ10sXG4gIGFyZWE6IFtdLFxuICBiOiBbXSxcbiAgYnI6IFtdLFxuICBjb2w6IFtdLFxuICBjb2RlOiBbXSxcbiAgZGQ6IFtdLFxuICBkaXY6IFtdLFxuICBkbDogW10sXG4gIGR0OiBbXSxcbiAgZW06IFtdLFxuICBocjogW10sXG4gIGgxOiBbXSxcbiAgaDI6IFtdLFxuICBoMzogW10sXG4gIGg0OiBbXSxcbiAgaDU6IFtdLFxuICBoNjogW10sXG4gIGk6IFtdLFxuICBpbWc6IFsnc3JjJywgJ3NyY3NldCcsICdhbHQnLCAndGl0bGUnLCAnd2lkdGgnLCAnaGVpZ2h0J10sXG4gIGxpOiBbXSxcbiAgb2w6IFtdLFxuICBwOiBbXSxcbiAgcHJlOiBbXSxcbiAgczogW10sXG4gIHNtYWxsOiBbXSxcbiAgc3BhbjogW10sXG4gIHN1YjogW10sXG4gIHN1cDogW10sXG4gIHN0cm9uZzogW10sXG4gIHU6IFtdLFxuICB1bDogW11cbn1cbi8vIGpzLWRvY3MtZW5kIGFsbG93LWxpc3RcblxuY29uc3QgdXJpQXR0cmlidXRlcyA9IG5ldyBTZXQoW1xuICAnYmFja2dyb3VuZCcsXG4gICdjaXRlJyxcbiAgJ2hyZWYnLFxuICAnaXRlbXR5cGUnLFxuICAnbG9uZ2Rlc2MnLFxuICAncG9zdGVyJyxcbiAgJ3NyYycsXG4gICd4bGluazpocmVmJ1xuXSlcblxuLyoqXG4gKiBBIHBhdHRlcm4gdGhhdCByZWNvZ25pemVzIFVSTHMgdGhhdCBhcmUgc2FmZSB3cnQuIFhTUyBpbiBVUkwgbmF2aWdhdGlvblxuICogY29udGV4dHMuXG4gKlxuICogU2hvdXQtb3V0IHRvIEFuZ3VsYXIgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9ibG9iLzE1LjIuOC9wYWNrYWdlcy9jb3JlL3NyYy9zYW5pdGl6YXRpb24vdXJsX3Nhbml0aXplci50cyNMMzhcbiAqL1xuY29uc3QgU0FGRV9VUkxfUEFUVEVSTiA9IC9eKD8hamF2YXNjcmlwdDopKD86W2EtejAtOSsuLV0rOnxbXiY6Lz8jXSooPzpbLz8jXXwkKSkvaVxuXG5jb25zdCBhbGxvd2VkQXR0cmlidXRlID0gKGF0dHJpYnV0ZSwgYWxsb3dlZEF0dHJpYnV0ZUxpc3QpID0+IHtcbiAgY29uc3QgYXR0cmlidXRlTmFtZSA9IGF0dHJpYnV0ZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXG5cbiAgaWYgKGFsbG93ZWRBdHRyaWJ1dGVMaXN0LmluY2x1ZGVzKGF0dHJpYnV0ZU5hbWUpKSB7XG4gICAgaWYgKHVyaUF0dHJpYnV0ZXMuaGFzKGF0dHJpYnV0ZU5hbWUpKSB7XG4gICAgICByZXR1cm4gQm9vbGVhbihTQUZFX1VSTF9QQVRURVJOLnRlc3QoYXR0cmlidXRlLm5vZGVWYWx1ZSkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIC8vIENoZWNrIGlmIGEgcmVndWxhciBleHByZXNzaW9uIHZhbGlkYXRlcyB0aGUgYXR0cmlidXRlLlxuICByZXR1cm4gYWxsb3dlZEF0dHJpYnV0ZUxpc3QuZmlsdGVyKGF0dHJpYnV0ZVJlZ2V4ID0+IGF0dHJpYnV0ZVJlZ2V4IGluc3RhbmNlb2YgUmVnRXhwKVxuICAgIC5zb21lKHJlZ2V4ID0+IHJlZ2V4LnRlc3QoYXR0cmlidXRlTmFtZSkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZUh0bWwodW5zYWZlSHRtbCwgYWxsb3dMaXN0LCBzYW5pdGl6ZUZ1bmN0aW9uKSB7XG4gIGlmICghdW5zYWZlSHRtbC5sZW5ndGgpIHtcbiAgICByZXR1cm4gdW5zYWZlSHRtbFxuICB9XG5cbiAgaWYgKHNhbml0aXplRnVuY3Rpb24gJiYgdHlwZW9mIHNhbml0aXplRnVuY3Rpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gc2FuaXRpemVGdW5jdGlvbih1bnNhZmVIdG1sKVxuICB9XG5cbiAgY29uc3QgZG9tUGFyc2VyID0gbmV3IHdpbmRvdy5ET01QYXJzZXIoKVxuICBjb25zdCBjcmVhdGVkRG9jdW1lbnQgPSBkb21QYXJzZXIucGFyc2VGcm9tU3RyaW5nKHVuc2FmZUh0bWwsICd0ZXh0L2h0bWwnKVxuICBjb25zdCBlbGVtZW50cyA9IFtdLmNvbmNhdCguLi5jcmVhdGVkRG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yQWxsKCcqJykpXG5cbiAgZm9yIChjb25zdCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgY29uc3QgZWxlbWVudE5hbWUgPSBlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKClcblxuICAgIGlmICghT2JqZWN0LmtleXMoYWxsb3dMaXN0KS5pbmNsdWRlcyhlbGVtZW50TmFtZSkpIHtcbiAgICAgIGVsZW1lbnQucmVtb3ZlKClcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgY29uc3QgYXR0cmlidXRlTGlzdCA9IFtdLmNvbmNhdCguLi5lbGVtZW50LmF0dHJpYnV0ZXMpXG4gICAgY29uc3QgYWxsb3dlZEF0dHJpYnV0ZXMgPSBbXS5jb25jYXQoYWxsb3dMaXN0WycqJ10gfHwgW10sIGFsbG93TGlzdFtlbGVtZW50TmFtZV0gfHwgW10pXG5cbiAgICBmb3IgKGNvbnN0IGF0dHJpYnV0ZSBvZiBhdHRyaWJ1dGVMaXN0KSB7XG4gICAgICBpZiAoIWFsbG93ZWRBdHRyaWJ1dGUoYXR0cmlidXRlLCBhbGxvd2VkQXR0cmlidXRlcykpIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlLm5vZGVOYW1lKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjcmVhdGVkRG9jdW1lbnQuYm9keS5pbm5lckhUTUxcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7O0FBUUEsWUFBTUEseUJBQXlCO0FBRXhCLFlBQU1DLG1CQUFtQjs7UUFFOUIsS0FBSyxDQUFDLFNBQVMsT0FBTyxNQUFNLFFBQVEsUUFBUUQsc0JBQXNCO1FBQ2xFRSxHQUFHLENBQUMsVUFBVSxRQUFRLFNBQVMsS0FBSztRQUNwQ0MsTUFBTSxDQUFBO1FBQ05DLEdBQUcsQ0FBQTtRQUNIQyxJQUFJLENBQUE7UUFDSkMsS0FBSyxDQUFBO1FBQ0xDLE1BQU0sQ0FBQTtRQUNOQyxJQUFJLENBQUE7UUFDSkMsS0FBSyxDQUFBO1FBQ0xDLElBQUksQ0FBQTtRQUNKQyxJQUFJLENBQUE7UUFDSkMsSUFBSSxDQUFBO1FBQ0pDLElBQUksQ0FBQTtRQUNKQyxJQUFJLENBQUE7UUFDSkMsSUFBSSxDQUFBO1FBQ0pDLElBQUksQ0FBQTtRQUNKQyxJQUFJLENBQUE7UUFDSkMsSUFBSSxDQUFBO1FBQ0pDLElBQUksQ0FBQTtRQUNKQyxHQUFHLENBQUE7UUFDSEMsS0FBSyxDQUFDLE9BQU8sVUFBVSxPQUFPLFNBQVMsU0FBUyxRQUFRO1FBQ3hEQyxJQUFJLENBQUE7UUFDSkMsSUFBSSxDQUFBO1FBQ0pDLEdBQUcsQ0FBQTtRQUNIQyxLQUFLLENBQUE7UUFDTEMsR0FBRyxDQUFBO1FBQ0hDLE9BQU8sQ0FBQTtRQUNQQyxNQUFNLENBQUE7UUFDTkMsS0FBSyxDQUFBO1FBQ0xDLEtBQUssQ0FBQTtRQUNMQyxRQUFRLENBQUE7UUFDUkMsR0FBRyxDQUFBO1FBQ0hDLElBQUksQ0FBQTtNQUNOO0FBR0EsWUFBTUMsZ0JBQWdCLG9CQUFJQyxJQUFJLENBQzVCLGNBQ0EsUUFDQSxRQUNBLFlBQ0EsWUFDQSxVQUNBLE9BQ0EsWUFBWSxDQUNiO0FBUUQsWUFBTUMsbUJBQW1CO0FBRXpCLFlBQU1DLG1CQUFtQkEsd0JBQUNDLFdBQVdDLHlCQUF5QjtBQUM1RCxjQUFNQyxnQkFBZ0JGLFVBQVVHLFNBQVNDLFlBQVc7QUFFcEQsWUFBSUgscUJBQXFCSSxTQUFTSCxhQUFhLEdBQUc7QUFDaEQsY0FBSU4sY0FBY1UsSUFBSUosYUFBYSxHQUFHO0FBQ3BDLG1CQUFPSyxRQUFRVCxpQkFBaUJVLEtBQUtSLFVBQVVTLFNBQVMsQ0FBQztVQUMzRDtBQUVBLGlCQUFPO1FBQ1Q7QUFHQSxlQUFPUixxQkFBcUJTLE9BQU9DLG9CQUFrQkEsMEJBQTBCQyxNQUFNLEVBQ2xGQyxLQUFLQyxXQUFTQSxNQUFNTixLQUFLTixhQUFhLENBQUM7TUFDNUMsR0FkeUJIO0FBZ0JsQixlQUFTZ0IsYUFBYUMsWUFBWUMsV0FBV0Msa0JBQWtCO0FBQ3BFLFlBQUksQ0FBQ0YsV0FBV0csUUFBUTtBQUN0QixpQkFBT0g7UUFDVDtBQUVBLFlBQUlFLG9CQUFvQixPQUFPQSxxQkFBcUIsWUFBWTtBQUM5RCxpQkFBT0EsaUJBQWlCRixVQUFVO1FBQ3BDO0FBRUEsY0FBTUksWUFBWSxJQUFJQyxPQUFPQyxVQUFTO0FBQ3RDLGNBQU1DLGtCQUFrQkgsVUFBVUksZ0JBQWdCUixZQUFZLFdBQVc7QUFDekUsY0FBTVMsV0FBVyxDQUFBLEVBQUdDLE9BQU8sR0FBR0gsZ0JBQWdCSSxLQUFLQyxpQkFBaUIsR0FBRyxDQUFDO0FBRXhFLG1CQUFXQyxXQUFXSixVQUFVO0FBQzlCLGdCQUFNSyxjQUFjRCxRQUFRMUIsU0FBU0MsWUFBVztBQUVoRCxjQUFJLENBQUMyQixPQUFPQyxLQUFLZixTQUFTLEVBQUVaLFNBQVN5QixXQUFXLEdBQUc7QUFDakRELG9CQUFRSSxPQUFNO0FBQ2Q7VUFDRjtBQUVBLGdCQUFNQyxnQkFBZ0IsQ0FBQSxFQUFHUixPQUFPLEdBQUdHLFFBQVFNLFVBQVU7QUFDckQsZ0JBQU1DLG9CQUFvQixDQUFBLEVBQUdWLE9BQU9ULFVBQVUsR0FBRyxLQUFLLENBQUEsR0FBSUEsVUFBVWEsV0FBVyxLQUFLLENBQUEsQ0FBRTtBQUV0RixxQkFBVzlCLGFBQWFrQyxlQUFlO0FBQ3JDLGdCQUFJLENBQUNuQyxpQkFBaUJDLFdBQVdvQyxpQkFBaUIsR0FBRztBQUNuRFAsc0JBQVFRLGdCQUFnQnJDLFVBQVVHLFFBQVE7WUFDNUM7VUFDRjtRQUNGO0FBRUEsZUFBT29CLGdCQUFnQkksS0FBS1c7TUFDOUI7QUFoQ2dCdkI7Ozs7Ozs7IiwKICAibmFtZXMiOiBbIkFSSUFfQVRUUklCVVRFX1BBVFRFUk4iLCAiRGVmYXVsdEFsbG93bGlzdCIsICJhIiwgImFyZWEiLCAiYiIsICJiciIsICJjb2wiLCAiY29kZSIsICJkZCIsICJkaXYiLCAiZGwiLCAiZHQiLCAiZW0iLCAiaHIiLCAiaDEiLCAiaDIiLCAiaDMiLCAiaDQiLCAiaDUiLCAiaDYiLCAiaSIsICJpbWciLCAibGkiLCAib2wiLCAicCIsICJwcmUiLCAicyIsICJzbWFsbCIsICJzcGFuIiwgInN1YiIsICJzdXAiLCAic3Ryb25nIiwgInUiLCAidWwiLCAidXJpQXR0cmlidXRlcyIsICJTZXQiLCAiU0FGRV9VUkxfUEFUVEVSTiIsICJhbGxvd2VkQXR0cmlidXRlIiwgImF0dHJpYnV0ZSIsICJhbGxvd2VkQXR0cmlidXRlTGlzdCIsICJhdHRyaWJ1dGVOYW1lIiwgIm5vZGVOYW1lIiwgInRvTG93ZXJDYXNlIiwgImluY2x1ZGVzIiwgImhhcyIsICJCb29sZWFuIiwgInRlc3QiLCAibm9kZVZhbHVlIiwgImZpbHRlciIsICJhdHRyaWJ1dGVSZWdleCIsICJSZWdFeHAiLCAic29tZSIsICJyZWdleCIsICJzYW5pdGl6ZUh0bWwiLCAidW5zYWZlSHRtbCIsICJhbGxvd0xpc3QiLCAic2FuaXRpemVGdW5jdGlvbiIsICJsZW5ndGgiLCAiZG9tUGFyc2VyIiwgIndpbmRvdyIsICJET01QYXJzZXIiLCAiY3JlYXRlZERvY3VtZW50IiwgInBhcnNlRnJvbVN0cmluZyIsICJlbGVtZW50cyIsICJjb25jYXQiLCAiYm9keSIsICJxdWVyeVNlbGVjdG9yQWxsIiwgImVsZW1lbnQiLCAiZWxlbWVudE5hbWUiLCAiT2JqZWN0IiwgImtleXMiLCAicmVtb3ZlIiwgImF0dHJpYnV0ZUxpc3QiLCAiYXR0cmlidXRlcyIsICJhbGxvd2VkQXR0cmlidXRlcyIsICJyZW1vdmVBdHRyaWJ1dGUiLCAiaW5uZXJIVE1MIl0KfQo=
