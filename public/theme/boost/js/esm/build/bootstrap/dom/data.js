var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// public/theme/boost/js/esm/src/bootstrap/dom/data.js
var require_data = __commonJS({
  "public/theme/boost/js/esm/src/bootstrap/dom/data.js"(exports, module) {
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Data = factory());
    })(exports, (function() {
      "use strict";
      const elementMap = /* @__PURE__ */ new Map();
      const data = {
        set(element, key, instance) {
          if (!elementMap.has(element)) {
            elementMap.set(element, /* @__PURE__ */ new Map());
          }
          const instanceMap = elementMap.get(element);
          if (!instanceMap.has(key) && instanceMap.size !== 0) {
            console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
            return;
          }
          instanceMap.set(key, instance);
        },
        get(element, key) {
          if (elementMap.has(element)) {
            return elementMap.get(element).get(key) || null;
          }
          return null;
        },
        remove(element, key) {
          if (!elementMap.has(element)) {
            return;
          }
          const instanceMap = elementMap.get(element);
          instanceMap.delete(key);
          if (instanceMap.size === 0) {
            elementMap.delete(element);
          }
        }
      };
      return data;
    }));
  }
});
export default require_data();
/*!
  * Bootstrap data.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL3NyYy9kb20vZGF0YS5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQm9vdHN0cmFwIGRvbS9kYXRhLmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBDb25zdGFudHNcbiAqL1xuXG5jb25zdCBlbGVtZW50TWFwID0gbmV3IE1hcCgpXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgc2V0KGVsZW1lbnQsIGtleSwgaW5zdGFuY2UpIHtcbiAgICBpZiAoIWVsZW1lbnRNYXAuaGFzKGVsZW1lbnQpKSB7XG4gICAgICBlbGVtZW50TWFwLnNldChlbGVtZW50LCBuZXcgTWFwKCkpXG4gICAgfVxuXG4gICAgY29uc3QgaW5zdGFuY2VNYXAgPSBlbGVtZW50TWFwLmdldChlbGVtZW50KVxuXG4gICAgLy8gbWFrZSBpdCBjbGVhciB3ZSBvbmx5IHdhbnQgb25lIGluc3RhbmNlIHBlciBlbGVtZW50XG4gICAgLy8gY2FuIGJlIHJlbW92ZWQgbGF0ZXIgd2hlbiBtdWx0aXBsZSBrZXkvaW5zdGFuY2VzIGFyZSBmaW5lIHRvIGJlIHVzZWRcbiAgICBpZiAoIWluc3RhbmNlTWFwLmhhcyhrZXkpICYmIGluc3RhbmNlTWFwLnNpemUgIT09IDApIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLmVycm9yKGBCb290c3RyYXAgZG9lc24ndCBhbGxvdyBtb3JlIHRoYW4gb25lIGluc3RhbmNlIHBlciBlbGVtZW50LiBCb3VuZCBpbnN0YW5jZTogJHtBcnJheS5mcm9tKGluc3RhbmNlTWFwLmtleXMoKSlbMF19LmApXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpbnN0YW5jZU1hcC5zZXQoa2V5LCBpbnN0YW5jZSlcbiAgfSxcblxuICBnZXQoZWxlbWVudCwga2V5KSB7XG4gICAgaWYgKGVsZW1lbnRNYXAuaGFzKGVsZW1lbnQpKSB7XG4gICAgICByZXR1cm4gZWxlbWVudE1hcC5nZXQoZWxlbWVudCkuZ2V0KGtleSkgfHwgbnVsbFxuICAgIH1cblxuICAgIHJldHVybiBudWxsXG4gIH0sXG5cbiAgcmVtb3ZlKGVsZW1lbnQsIGtleSkge1xuICAgIGlmICghZWxlbWVudE1hcC5oYXMoZWxlbWVudCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGluc3RhbmNlTWFwID0gZWxlbWVudE1hcC5nZXQoZWxlbWVudClcblxuICAgIGluc3RhbmNlTWFwLmRlbGV0ZShrZXkpXG5cbiAgICAvLyBmcmVlIHVwIGVsZW1lbnQgcmVmZXJlbmNlcyBpZiB0aGVyZSBhcmUgbm8gaW5zdGFuY2VzIGxlZnQgZm9yIGFuIGVsZW1lbnRcbiAgICBpZiAoaW5zdGFuY2VNYXAuc2l6ZSA9PT0gMCkge1xuICAgICAgZWxlbWVudE1hcC5kZWxldGUoZWxlbWVudClcbiAgICB9XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7OztBQVdBLFlBQU1BLGFBQWEsb0JBQUlDLElBQUc7QUFFMUIsWUFBQSxPQUFlO1FBQ2JDLElBQUlDLFNBQVNDLEtBQUtDLFVBQVU7QUFDMUIsY0FBSSxDQUFDTCxXQUFXTSxJQUFJSCxPQUFPLEdBQUc7QUFDNUJILHVCQUFXRSxJQUFJQyxTQUFTLG9CQUFJRixJQUFHLENBQUU7VUFDbkM7QUFFQSxnQkFBTU0sY0FBY1AsV0FBV1EsSUFBSUwsT0FBTztBQUkxQyxjQUFJLENBQUNJLFlBQVlELElBQUlGLEdBQUcsS0FBS0csWUFBWUUsU0FBUyxHQUFHO0FBRW5EQyxvQkFBUUMsTUFBTSwrRUFBK0VDLE1BQU1DLEtBQUtOLFlBQVlPLEtBQUksQ0FBRSxFQUFFLENBQUMsQ0FBQyxHQUFHO0FBQ2pJO1VBQ0Y7QUFFQVAsc0JBQVlMLElBQUlFLEtBQUtDLFFBQVE7UUFDL0I7UUFFQUcsSUFBSUwsU0FBU0MsS0FBSztBQUNoQixjQUFJSixXQUFXTSxJQUFJSCxPQUFPLEdBQUc7QUFDM0IsbUJBQU9ILFdBQVdRLElBQUlMLE9BQU8sRUFBRUssSUFBSUosR0FBRyxLQUFLO1VBQzdDO0FBRUEsaUJBQU87UUFDVDtRQUVBVyxPQUFPWixTQUFTQyxLQUFLO0FBQ25CLGNBQUksQ0FBQ0osV0FBV00sSUFBSUgsT0FBTyxHQUFHO0FBQzVCO1VBQ0Y7QUFFQSxnQkFBTUksY0FBY1AsV0FBV1EsSUFBSUwsT0FBTztBQUUxQ0ksc0JBQVlTLE9BQU9aLEdBQUc7QUFHdEIsY0FBSUcsWUFBWUUsU0FBUyxHQUFHO0FBQzFCVCx1QkFBV2dCLE9BQU9iLE9BQU87VUFDM0I7UUFDRjtNQUNGOzs7OzsiLAogICJuYW1lcyI6IFsiZWxlbWVudE1hcCIsICJNYXAiLCAic2V0IiwgImVsZW1lbnQiLCAia2V5IiwgImluc3RhbmNlIiwgImhhcyIsICJpbnN0YW5jZU1hcCIsICJnZXQiLCAic2l6ZSIsICJjb25zb2xlIiwgImVycm9yIiwgIkFycmF5IiwgImZyb20iLCAia2V5cyIsICJyZW1vdmUiLCAiZGVsZXRlIl0KfQo=
