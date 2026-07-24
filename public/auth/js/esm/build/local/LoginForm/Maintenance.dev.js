var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * A maintenance mode banner shown above the login form.
 *
 * @module     core_auth/local/LoginForm/Maintenance
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
function Maintenance({ maintenance }) {
  if (!maintenance) {
    return null;
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "alert alert-danger login-maintenance", children: /* @__PURE__ */ jsxDEV("div", { dangerouslySetInnerHTML: { __html: maintenance } }, void 0, false, {
    fileName: "public/auth/js/esm/src/local/LoginForm/Maintenance.tsx",
    lineNumber: 39,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "public/auth/js/esm/src/local/LoginForm/Maintenance.tsx",
    lineNumber: 37,
    columnNumber: 9
  }, this);
}
__name(Maintenance, "Maintenance");
export {
  Maintenance as default
};
//# sourceMappingURL=Maintenance.dev.js.map
