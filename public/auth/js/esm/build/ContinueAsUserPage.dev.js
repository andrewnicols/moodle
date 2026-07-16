var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * The OAuth2 "continue as this user" page, shown when a user visiting the OAuth2 login page
 * is already logged in.
 *
 * @module     core_auth/ContinueAsUserPage
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import String from "@moodle/lms/core/String";
import Logo from "@moodle/lms/core_auth/local/LoginForm/Logo";
import Maintenance from "@moodle/lms/core_auth/local/LoginForm/Maintenance";
import ErrorInfo from "@moodle/lms/core_auth/local/LoginForm/ErrorInfo";
import LanguageMenu from "@moodle/lms/core_auth/local/LoginForm/LanguageMenu";
import CookiesNotice from "@moodle/lms/core_auth/local/LoginForm/CookiesNotice";
import UserInfo from "@moodle/lms/core_auth/local/OAuth2/UserInfo";
import ContinueForm from "@moodle/lms/core_auth/local/OAuth2/ContinueForm";
function ContinueAsUserPage({
  logoUrl,
  siteName,
  maintenance,
  error,
  errorTitle,
  info,
  clientName,
  userPictureHtml,
  userFullName,
  actionUrl,
  logoutUrl,
  sesskey,
  languageMenuHtml
}) {
  return /* @__PURE__ */ jsxDEV("div", { className: "loginform", children: [
    /* @__PURE__ */ jsxDEV(Logo, { logoUrl, siteName }, void 0, false, {
      fileName: "public/auth/js/esm/src/ContinueAsUserPage.tsx",
      lineNumber: 84,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("h2", { children: /* @__PURE__ */ jsxDEV(
      String,
      {
        identifier: "oauth2:confirmscopes:clientaccesstitle",
        component: "core",
        params: { clientname: clientName, sitename: siteName }
      },
      void 0,
      false,
      {
        fileName: "public/auth/js/esm/src/ContinueAsUserPage.tsx",
        lineNumber: 87,
        columnNumber: 17
      },
      this
    ) }, void 0, false, {
      fileName: "public/auth/js/esm/src/ContinueAsUserPage.tsx",
      lineNumber: 86,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(UserInfo, { userPictureHtml }, void 0, false, {
      fileName: "public/auth/js/esm/src/ContinueAsUserPage.tsx",
      lineNumber: 94,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(Maintenance, { maintenance }, void 0, false, {
      fileName: "public/auth/js/esm/src/ContinueAsUserPage.tsx",
      lineNumber: 95,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(ErrorInfo, { error, errorTitle, info }, void 0, false, {
      fileName: "public/auth/js/esm/src/ContinueAsUserPage.tsx",
      lineNumber: 96,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("p", { children: /* @__PURE__ */ jsxDEV(String, { identifier: "oauth2:continueasuserinfo", component: "core", params: userFullName }, void 0, false, {
      fileName: "public/auth/js/esm/src/ContinueAsUserPage.tsx",
      lineNumber: 99,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "public/auth/js/esm/src/ContinueAsUserPage.tsx",
      lineNumber: 98,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(ContinueForm, { actionUrl, logoutUrl, sesskey, fullName: userFullName }, void 0, false, {
      fileName: "public/auth/js/esm/src/ContinueAsUserPage.tsx",
      lineNumber: 102,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(LanguageMenu, { languageMenuHtml }, void 0, false, {
      fileName: "public/auth/js/esm/src/ContinueAsUserPage.tsx",
      lineNumber: 103,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(CookiesNotice, {}, void 0, false, {
      fileName: "public/auth/js/esm/src/ContinueAsUserPage.tsx",
      lineNumber: 104,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "public/auth/js/esm/src/ContinueAsUserPage.tsx",
    lineNumber: 83,
    columnNumber: 9
  }, this);
}
__name(ContinueAsUserPage, "ContinueAsUserPage");
export {
  ContinueAsUserPage as default
};
//# sourceMappingURL=ContinueAsUserPage.dev.js.map
