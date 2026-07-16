var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * The OAuth2 "confirm scopes" page, asking the user to approve or reject the access
 * requested by an OAuth2 client.
 *
 * @module     core_auth/ConfirmScopesPage
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
import ClientDescription from "@moodle/lms/core_auth/local/OAuth2/ClientDescription";
import ScopeInformation from "@moodle/lms/core_auth/local/OAuth2/ScopeInformation";
import ConfirmScopesForm from "@moodle/lms/core_auth/local/OAuth2/ConfirmScopesForm";
function ConfirmScopesPage({
  logoUrl,
  siteName,
  maintenance,
  error,
  errorTitle,
  info,
  clientName,
  clientDescription,
  clientPrivacyUrl,
  clientTermsUrl,
  userPictureHtml,
  userProfileUrl,
  requestedScopes,
  actionUrl,
  sesskey,
  languageMenuHtml
}) {
  return /* @__PURE__ */ jsxDEV("div", { className: "login_form", children: [
    /* @__PURE__ */ jsxDEV(Logo, { logoUrl, siteName }, void 0, false, {
      fileName: "public/auth/js/esm/src/ConfirmScopesPage.tsx",
      lineNumber: 94,
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
        fileName: "public/auth/js/esm/src/ConfirmScopesPage.tsx",
        lineNumber: 97,
        columnNumber: 17
      },
      this
    ) }, void 0, false, {
      fileName: "public/auth/js/esm/src/ConfirmScopesPage.tsx",
      lineNumber: 96,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(UserInfo, { userPictureHtml }, void 0, false, {
      fileName: "public/auth/js/esm/src/ConfirmScopesPage.tsx",
      lineNumber: 104,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(ClientDescription, { clientDescription }, void 0, false, {
      fileName: "public/auth/js/esm/src/ConfirmScopesPage.tsx",
      lineNumber: 105,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(Maintenance, { maintenance }, void 0, false, {
      fileName: "public/auth/js/esm/src/ConfirmScopesPage.tsx",
      lineNumber: 106,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(ErrorInfo, { error, errorTitle, info }, void 0, false, {
      fileName: "public/auth/js/esm/src/ConfirmScopesPage.tsx",
      lineNumber: 107,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(
      ScopeInformation,
      {
        clientName,
        siteName,
        requestedScopes,
        profileUrl: userProfileUrl,
        clientPrivacyUrl,
        clientTermsUrl
      },
      void 0,
      false,
      {
        fileName: "public/auth/js/esm/src/ConfirmScopesPage.tsx",
        lineNumber: 108,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(ConfirmScopesForm, { actionUrl, sesskey }, void 0, false, {
      fileName: "public/auth/js/esm/src/ConfirmScopesPage.tsx",
      lineNumber: 116,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(LanguageMenu, { languageMenuHtml }, void 0, false, {
      fileName: "public/auth/js/esm/src/ConfirmScopesPage.tsx",
      lineNumber: 117,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(CookiesNotice, {}, void 0, false, {
      fileName: "public/auth/js/esm/src/ConfirmScopesPage.tsx",
      lineNumber: 118,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "public/auth/js/esm/src/ConfirmScopesPage.tsx",
    lineNumber: 93,
    columnNumber: 9
  }, this);
}
__name(ConfirmScopesPage, "ConfirmScopesPage");
export {
  ConfirmScopesPage as default
};
//# sourceMappingURL=ConfirmScopesPage.dev.js.map
