var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * The OAuth2 client's description, shown on the OAuth2 authorization pages.
 *
 * @module     core_auth/local/OAuth2/ClientDescription
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
function ClientDescription({ clientDescription }) {
  if (!clientDescription) {
    return null;
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "alert alert-primary d-flex align-items-center", role: "alert", children: [
    /* @__PURE__ */ jsxDEV("i", { className: "icon fa fa-info-circle", "aria-hidden": "true" }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/OAuth2/ClientDescription.tsx",
      lineNumber: 39,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { dangerouslySetInnerHTML: { __html: clientDescription } }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/OAuth2/ClientDescription.tsx",
      lineNumber: 41,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "public/auth/js/esm/src/local/OAuth2/ClientDescription.tsx",
    lineNumber: 38,
    columnNumber: 9
  }, this);
}
__name(ClientDescription, "ClientDescription");
export {
  ClientDescription as default
};
//# sourceMappingURL=ClientDescription.dev.js.map
