var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// public/lib/js/esm/src/example.tsx
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import Fetch from "@moodle/lms/core/fetch";
import String from "@moodle/lms/core/String";
var getUserPreferences = /* @__PURE__ */ __name((name = null, userid = 0) => {
  const endpoint = ["current", "preferences"];
  if (name) {
    endpoint.push(name);
  }
  return Fetch.performGet("core_user", endpoint.join("/")).then((response) => response.json());
}, "getUserPreferences");
function Example() {
  return /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV("div", { id: "example", children: [
    /* @__PURE__ */ jsxDEV(String, { identifier: "activityclipboard" }, void 0, false, {
      fileName: "public/lib/js/esm/src/example.tsx",
      lineNumber: 41,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV(String, { identifier: "activityclipboard", params: "Here!!!" }, void 0, false, {
      fileName: "public/lib/js/esm/src/example.tsx",
      lineNumber: 42,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV(String, { identifier: "allowstealthmodules_help", children: "Some help content would go here." }, void 0, false, {
      fileName: "public/lib/js/esm/src/example.tsx",
      lineNumber: 43,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "public/lib/js/esm/src/example.tsx",
    lineNumber: 40,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "public/lib/js/esm/src/example.tsx",
    lineNumber: 39,
    columnNumber: 9
  }, this);
}
__name(Example, "Example");
export {
  Example as default,
  getUserPreferences
};
/**
 * ESM wrapper for the core/ajax AMD module.
 *
 * @module     core/ajax
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL2V4YW1wbGUudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBNb29kbGUgLSBodHRwOi8vbW9vZGxlLm9yZy9cbi8vXG4vLyBNb29kbGUgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuLy9cbi8vIE1vb2RsZSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4vL1xuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggTW9vZGxlLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4vKipcbiAqIEVTTSB3cmFwcGVyIGZvciB0aGUgY29yZS9hamF4IEFNRCBtb2R1bGUuXG4gKlxuICogQG1vZHVsZSAgICAgY29yZS9hamF4XG4gKiBAY29weXJpZ2h0ICBBbmRyZXcgTHlvbnMgPGFuZHJld0BuaWNvbHMuY28udWs+XG4gKiBAbGljZW5zZSAgICBodHRwOi8vd3d3LmdudS5vcmcvY29weWxlZnQvZ3BsLmh0bWwgR05VIEdQTCB2MyBvciBsYXRlclxuICovXG5cbmltcG9ydCBGZXRjaCBmcm9tICdAbW9vZGxlL2xtcy9jb3JlL2ZldGNoJztcbmltcG9ydCBTdHJpbmcgZnJvbSAnQG1vb2RsZS9sbXMvY29yZS9TdHJpbmcnO1xuXG5leHBvcnQgY29uc3QgZ2V0VXNlclByZWZlcmVuY2VzID0gKG5hbWU6IHN0cmluZ3xudWxsID0gbnVsbCwgdXNlcmlkOiBudW1iZXIgPSAwKSA9PiB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBbJ2N1cnJlbnQnLCAncHJlZmVyZW5jZXMnXTtcblxuICAgIGlmIChuYW1lKSB7XG4gICAgICAgIGVuZHBvaW50LnB1c2gobmFtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIEZldGNoLnBlcmZvcm1HZXQoJ2NvcmVfdXNlcicsIGVuZHBvaW50LmpvaW4oJy8nKSkudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBFeGFtcGxlKCkge1xuICAgIHJldHVybiAoXG4gICAgICAgIDw+XG4gICAgICAgICAgICA8ZGl2IGlkPVwiZXhhbXBsZVwiPlxuICAgICAgICAgICAgICAgIDxTdHJpbmcgaWRlbnRpZmllcj17XCJhY3Rpdml0eWNsaXBib2FyZFwifT48L1N0cmluZz5cbiAgICAgICAgICAgICAgICA8U3RyaW5nIGlkZW50aWZpZXI9e1wiYWN0aXZpdHljbGlwYm9hcmRcIn0gcGFyYW1zPXtcIkhlcmUhISFcIn0+PC9TdHJpbmc+XG4gICAgICAgICAgICAgICAgPFN0cmluZyBpZGVudGlmaWVyPXtcImFsbG93c3RlYWx0aG1vZHVsZXNfaGVscFwifT5cbiAgICAgICAgICAgICAgICAgICAgU29tZSBoZWxwIGNvbnRlbnQgd291bGQgZ28gaGVyZS5cbiAgICAgICAgICAgICAgICA8L1N0cmluZz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8Lz5cbiAgICApO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7OztBQXNDUSxtQkFFUSxjQUZSO0FBZlIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sWUFBWTtBQUVaLElBQU0scUJBQXFCLHdCQUFDLE9BQW9CLE1BQU0sU0FBaUIsTUFBTTtBQUNoRixRQUFNLFdBQVcsQ0FBQyxXQUFXLGFBQWE7QUFFMUMsTUFBSSxNQUFNO0FBQ04sYUFBUyxLQUFLLElBQUk7QUFBQSxFQUN0QjtBQUVBLFNBQU8sTUFBTSxXQUFXLGFBQWEsU0FBUyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxhQUFhLFNBQVMsS0FBSyxDQUFDO0FBQy9GLEdBUmtDO0FBVW5CLFNBQVIsVUFBMkI7QUFDOUIsU0FDSSxtQ0FDSSxpQ0FBQyxTQUFJLElBQUcsV0FDSjtBQUFBLDJCQUFDLFVBQU8sWUFBWSx1QkFBcEI7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUF5QztBQUFBLElBQ3pDLHVCQUFDLFVBQU8sWUFBWSxxQkFBcUIsUUFBUSxhQUFqRDtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQTREO0FBQUEsSUFDNUQsdUJBQUMsVUFBTyxZQUFZLDRCQUE0QixnREFBaEQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUVBO0FBQUEsT0FMSjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBTUEsS0FQSjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBUUE7QUFFUjtBQVp3QjsiLAogICJuYW1lcyI6IFtdCn0K
