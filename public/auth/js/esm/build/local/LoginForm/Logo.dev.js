var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * The site logo shown above the login form.
 *
 * @module     core_auth/local/LoginForm/Logo
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
function Logo({ logoUrl, siteName }) {
  if (!logoUrl) {
    return null;
  }
  return /* @__PURE__ */ jsxDEV("div", { id: "loginlogo", className: "d-flex justify-content-center mb-4", children: /* @__PURE__ */ jsxDEV("img", { id: "logoimage", src: logoUrl, className: "img-fluid", alt: siteName }, void 0, false, {
    fileName: "public/auth/js/esm/src/local/LoginForm/Logo.tsx",
    lineNumber: 40,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "public/auth/js/esm/src/local/LoginForm/Logo.tsx",
    lineNumber: 39,
    columnNumber: 9
  }, this);
}
__name(Logo, "Logo");
export {
  Logo as default
};
//# sourceMappingURL=Logo.dev.js.map
