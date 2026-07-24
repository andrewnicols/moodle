var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * The list of identity provider (e.g. OAuth2) login buttons.
 *
 * @module     core_auth/local/LoginForm/IdentityProviders
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import String from "@moodle/lms/core/String";
function IdentityProviders({
  canLoginAsGuest,
  identityProviders
}) {
  const hasIdentityProviders = identityProviders.length > 0;
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    (hasIdentityProviders || canLoginAsGuest) && /* @__PURE__ */ jsxDEV("div", { className: "login-separator my-5", children: /* @__PURE__ */ jsxDEV(String, { identifier: "loginseparatoror", component: "core" }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/LoginForm/IdentityProviders.tsx",
      lineNumber: 54,
      columnNumber: 55
    }, this) }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/LoginForm/IdentityProviders.tsx",
      lineNumber: 54,
      columnNumber: 17
    }, this),
    hasIdentityProviders && /* @__PURE__ */ jsxDEV("div", { className: "login-identityproviders", children: identityProviders.map((provider) => /* @__PURE__ */ jsxDEV(
      "a",
      {
        className: "btn login-identityprovider-btn btn-outline-secondary mb-3",
        href: provider.url,
        children: [
          provider.iconurl && /* @__PURE__ */ jsxDEV("img", { src: provider.iconurl, alt: "", width: "24", height: "24" }, void 0, false, {
            fileName: "public/auth/js/esm/src/local/LoginForm/IdentityProviders.tsx",
            lineNumber: 65,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ jsxDEV(String, { identifier: "loginwith", component: "core", params: provider.name, children: provider.name }, void 0, false, {
            fileName: "public/auth/js/esm/src/local/LoginForm/IdentityProviders.tsx",
            lineNumber: 67,
            columnNumber: 29
          }, this)
        ]
      },
      provider.url,
      true,
      {
        fileName: "public/auth/js/esm/src/local/LoginForm/IdentityProviders.tsx",
        lineNumber: 59,
        columnNumber: 25
      },
      this
    )) }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/LoginForm/IdentityProviders.tsx",
      lineNumber: 57,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "public/auth/js/esm/src/local/LoginForm/IdentityProviders.tsx",
    lineNumber: 52,
    columnNumber: 9
  }, this);
}
__name(IdentityProviders, "IdentityProviders");
export {
  IdentityProviders as default
};
//# sourceMappingURL=IdentityProviders.dev.js.map
