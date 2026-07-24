var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * Error and informational banners shown above the login form.
 *
 * The accompanying "move focus to the error / info message, then to the username field"
 * behaviour is handled by the parent {@link module:core_auth/LoginForm} component, since it
 * needs to coordinate with the login fields themselves.
 *
 * @module     core_auth/local/LoginForm/ErrorInfo
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
function ErrorInfo({ error, errorTitle, info }) {
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    error && /* @__PURE__ */ jsxDEV("div", { className: "alert alert-danger", id: "loginerrormessage", role: "alert", children: [
      errorTitle && /* @__PURE__ */ jsxDEV("strong", { className: "d-block mb-1", children: errorTitle }, void 0, false, {
        fileName: "public/auth/js/esm/src/local/LoginForm/ErrorInfo.tsx",
        lineNumber: 45,
        columnNumber: 36
      }, this),
      error
    ] }, void 0, true, {
      fileName: "public/auth/js/esm/src/local/LoginForm/ErrorInfo.tsx",
      lineNumber: 44,
      columnNumber: 17
    }, this),
    info && /* @__PURE__ */ jsxDEV("div", { className: "alert alert-info", id: "logininfomessage", role: "status", children: info }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/LoginForm/ErrorInfo.tsx",
      lineNumber: 50,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "public/auth/js/esm/src/local/LoginForm/ErrorInfo.tsx",
    lineNumber: 42,
    columnNumber: 9
  }, this);
}
__name(ErrorInfo, "ErrorInfo");
export {
  ErrorInfo as default
};
//# sourceMappingURL=ErrorInfo.dev.js.map
