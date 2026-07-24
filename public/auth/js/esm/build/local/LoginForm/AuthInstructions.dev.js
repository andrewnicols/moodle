var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * Custom auth instructions, shown on small screens only (the left panel covers this on
 * larger screens).
 *
 * @module     core_auth/local/LoginForm/AuthInstructions
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
function AuthInstructions({ authInstructions }) {
  if (!authInstructions) {
    return null;
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "d-lg-none small mb-3", children: /* @__PURE__ */ jsxDEV("div", { dangerouslySetInnerHTML: { __html: authInstructions } }, void 0, false, {
    fileName: "public/auth/js/esm/src/local/LoginForm/AuthInstructions.tsx",
    lineNumber: 40,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "public/auth/js/esm/src/local/LoginForm/AuthInstructions.tsx",
    lineNumber: 38,
    columnNumber: 9
  }, this);
}
__name(AuthInstructions, "AuthInstructions");
export {
  AuthInstructions as default
};
//# sourceMappingURL=AuthInstructions.dev.js.map
