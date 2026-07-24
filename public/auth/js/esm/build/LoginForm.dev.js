var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * The main login form, shown in the right-hand panel of the split-screen login layout.
 *
 * @module     core_auth/LoginForm
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect } from "react";
import String from "@moodle/lms/core/String";
import Pending from "@moodle/lms/core/pending";
import Logo from "@moodle/lms/core_auth/local/LoginForm/Logo";
import Maintenance from "@moodle/lms/core_auth/local/LoginForm/Maintenance";
import ErrorInfo from "@moodle/lms/core_auth/local/LoginForm/ErrorInfo";
import LoginFields from "@moodle/lms/core_auth/local/LoginForm/LoginFields";
import AuthInstructions from "@moodle/lms/core_auth/local/LoginForm/AuthInstructions";
import SignupInstructions from "@moodle/lms/core_auth/local/LoginForm/SignupInstructions";
import IdentityProviders from "@moodle/lms/core_auth/local/LoginForm/IdentityProviders";
import GuestLogin from "@moodle/lms/core_auth/local/LoginForm/GuestLogin";
import LanguageMenu from "@moodle/lms/core_auth/local/LoginForm/LanguageMenu";
import CookiesNotice from "@moodle/lms/core_auth/local/LoginForm/CookiesNotice";
function LoginForm({
  logoUrl,
  siteName,
  maintenance,
  showLoginForm,
  authInstructions,
  error,
  errorTitle,
  info,
  actionUrl,
  username,
  canLoginByEmail,
  loginToken,
  forgotPasswordUrl,
  recaptchaHtml,
  togglePassword,
  smallScreensOnly,
  autoFocusForm,
  canSignup,
  signupInstructions,
  signupUrl,
  canLoginAsGuest,
  identityProviders,
  languageMenuHtml
}) {
  useEffect(() => {
    const errorMessageDiv = document.getElementById("loginerrormessage");
    const infoMessageDiv = document.getElementById("logininfomessage");
    if (!errorMessageDiv && !infoMessageDiv) {
      return void 0;
    }
    const pendingJs = new Pending("login-move-focus");
    const timeoutId = window.setTimeout(() => {
      if (errorMessageDiv) {
        errorMessageDiv.innerHTML += "&nbsp;";
        document.getElementById("username")?.focus();
      }
      if (infoMessageDiv) {
        infoMessageDiv.innerHTML += "&nbsp;";
      }
      pendingJs.resolve();
    }, 500);
    return () => window.clearTimeout(timeoutId);
  }, [error, info]);
  return /* @__PURE__ */ jsxDEV("div", { className: "loginform", children: [
    /* @__PURE__ */ jsxDEV(Logo, { logoUrl, siteName }, void 0, false, {
      fileName: "public/auth/js/esm/src/LoginForm.tsx",
      lineNumber: 134,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("h1", { className: "h2", children: /* @__PURE__ */ jsxDEV(String, { identifier: "loginwelcomeback", component: "core" }, void 0, false, {
      fileName: "public/auth/js/esm/src/LoginForm.tsx",
      lineNumber: 135,
      columnNumber: 32
    }, this) }, void 0, false, {
      fileName: "public/auth/js/esm/src/LoginForm.tsx",
      lineNumber: 135,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("p", { className: "text-muted mb-4", children: /* @__PURE__ */ jsxDEV(String, { identifier: "loginto", component: "core", params: siteName }, void 0, false, {
      fileName: "public/auth/js/esm/src/LoginForm.tsx",
      lineNumber: 136,
      columnNumber: 44
    }, this) }, void 0, false, {
      fileName: "public/auth/js/esm/src/LoginForm.tsx",
      lineNumber: 136,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(Maintenance, { maintenance }, void 0, false, {
      fileName: "public/auth/js/esm/src/LoginForm.tsx",
      lineNumber: 137,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(ErrorInfo, { error, errorTitle, info }, void 0, false, {
      fileName: "public/auth/js/esm/src/LoginForm.tsx",
      lineNumber: 138,
      columnNumber: 13
    }, this),
    showLoginForm && /* @__PURE__ */ jsxDEV(
      LoginFields,
      {
        actionUrl,
        username,
        canLoginByEmail,
        loginToken,
        forgotPasswordUrl,
        recaptchaHtml,
        togglePassword,
        smallScreensOnly,
        hasError: Boolean(error),
        autoFocusForm
      },
      void 0,
      false,
      {
        fileName: "public/auth/js/esm/src/LoginForm.tsx",
        lineNumber: 140,
        columnNumber: 17
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(AuthInstructions, { authInstructions }, void 0, false, {
      fileName: "public/auth/js/esm/src/LoginForm.tsx",
      lineNumber: 153,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(SignupInstructions, { canSignup, signupInstructions, signupUrl }, void 0, false, {
      fileName: "public/auth/js/esm/src/LoginForm.tsx",
      lineNumber: 154,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(IdentityProviders, { canLoginAsGuest, identityProviders }, void 0, false, {
      fileName: "public/auth/js/esm/src/LoginForm.tsx",
      lineNumber: 155,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(GuestLogin, { canLoginAsGuest, actionUrl, loginToken }, void 0, false, {
      fileName: "public/auth/js/esm/src/LoginForm.tsx",
      lineNumber: 156,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(LanguageMenu, { languageMenuHtml }, void 0, false, {
      fileName: "public/auth/js/esm/src/LoginForm.tsx",
      lineNumber: 157,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(CookiesNotice, {}, void 0, false, {
      fileName: "public/auth/js/esm/src/LoginForm.tsx",
      lineNumber: 158,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "public/auth/js/esm/src/LoginForm.tsx",
    lineNumber: 133,
    columnNumber: 9
  }, this);
}
__name(LoginForm, "LoginForm");
export {
  LoginForm as default
};
//# sourceMappingURL=LoginForm.dev.js.map
