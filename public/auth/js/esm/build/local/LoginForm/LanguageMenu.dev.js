var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * The language selector menu.
 *
 * The menu itself is a `core/action_menu`, which is rendered server-side and passed through
 * as pre-rendered HTML — converting `core/action_menu` to React is out of scope here.
 *
 * @module     core_auth/local/LoginForm/LanguageMenu
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
function LanguageMenu({ languageMenuHtml }) {
  if (!languageMenuHtml) {
    return null;
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "login-languagemenu d-flex justify-content-center my-5", children: /* @__PURE__ */ jsxDEV("div", { dangerouslySetInnerHTML: { __html: languageMenuHtml } }, void 0, false, {
    fileName: "public/auth/js/esm/src/local/LoginForm/LanguageMenu.tsx",
    lineNumber: 42,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "public/auth/js/esm/src/local/LoginForm/LanguageMenu.tsx",
    lineNumber: 40,
    columnNumber: 9
  }, this);
}
__name(LanguageMenu, "LanguageMenu");
export {
  LanguageMenu as default
};
//# sourceMappingURL=LanguageMenu.dev.js.map
