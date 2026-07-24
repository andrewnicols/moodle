var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * The username/password login form fields.
 *
 * @module     core_auth/local/LoginForm/LoginFields
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useRef, useState } from "react";
import { Button } from "@moodlehq/design-system";
import String from "@moodle/lms/core/String";
import { getStrings } from "@moodle/lms/core/stringUtils";
import { requireAsync, requireManyAsync } from "@moodle/lms/core/amd";
function LoginFields({
  actionUrl,
  username,
  canLoginByEmail,
  loginToken,
  forgotPasswordUrl,
  recaptchaHtml,
  togglePassword,
  smallScreensOnly,
  hasError,
  autoFocusForm
}) {
  const anchorRef = useRef(null);
  const [strings, setStrings] = useState(null);
  useEffect(() => {
    getStrings([
      { key: canLoginByEmail ? "loginenterusernameoremail" : "enterusername", component: "core" },
      { key: "loginenterpassword", component: "core" },
      { key: "login", component: "core" }
    ]).then(([
      usernamePlaceholder,
      passwordPlaceholder,
      login
    ]) => {
      setStrings({ usernamePlaceholder, passwordPlaceholder, login });
      return;
    });
  }, [canLoginByEmail]);
  useEffect(() => {
    if (anchorRef.current) {
      anchorRef.current.value = location.hash;
    }
  }, []);
  useEffect(() => {
    requireAsync("core_form/submit").then((submit) => {
      submit.init("loginbtn");
      return;
    });
  }, []);
  useEffect(() => {
    if (hasError || !autoFocusForm) {
      return void 0;
    }
    let formEvents = null;
    const autoFocus = /* @__PURE__ */ __name(() => {
      const userNameField = document.getElementById("username");
      const passwordField = document.getElementById("password");
      if (userNameField && userNameField.value.length === 0) {
        userNameField.focus();
      } else {
        passwordField?.focus();
      }
    }, "autoFocus");
    requireAsync("core_form/events").then((events) => {
      formEvents = events;
      autoFocus();
      window.addEventListener(events.eventTypes.fieldStructureChanged, autoFocus);
      return;
    });
    return () => {
      if (formEvents) {
        window.removeEventListener(formEvents.eventTypes.fieldStructureChanged, autoFocus);
      }
    };
  }, [hasError, autoFocusForm]);
  useEffect(() => {
    if (!togglePassword) {
      return;
    }
    requireManyAsync(["core/togglesensitive"]).then(([toggleSensitive]) => {
      toggleSensitive.init(
        "password",
        smallScreensOnly
      );
      return;
    });
  }, [togglePassword, smallScreensOnly]);
  return /* @__PURE__ */ jsxDEV("form", { className: "login-form", action: actionUrl, method: "post", id: "login", children: [
    /* @__PURE__ */ jsxDEV("input", { ref: anchorRef, id: "anchor", type: "hidden", name: "anchor", defaultValue: "" }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/LoginForm/LoginFields.tsx",
      lineNumber: 157,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: "logintoken", value: loginToken }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/LoginForm/LoginFields.tsx",
      lineNumber: 158,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "login-form-username mb-3", children: [
      /* @__PURE__ */ jsxDEV("label", { htmlFor: "username", className: "form-label", children: /* @__PURE__ */ jsxDEV(String, { identifier: canLoginByEmail ? "usernameemail" : "username", component: "core" }, void 0, false, {
        fileName: "public/auth/js/esm/src/local/LoginForm/LoginFields.tsx",
        lineNumber: 161,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "public/auth/js/esm/src/local/LoginForm/LoginFields.tsx",
        lineNumber: 160,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV(
        "input",
        {
          type: "text",
          name: "username",
          id: "username",
          className: "form-control",
          defaultValue: username,
          placeholder: strings?.usernamePlaceholder ?? "",
          autoComplete: "username"
        },
        void 0,
        false,
        {
          fileName: "public/auth/js/esm/src/local/LoginForm/LoginFields.tsx",
          lineNumber: 163,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, true, {
      fileName: "public/auth/js/esm/src/local/LoginForm/LoginFields.tsx",
      lineNumber: 159,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "login-form-password mb-3", children: [
      /* @__PURE__ */ jsxDEV("label", { htmlFor: "password", className: "form-label", children: /* @__PURE__ */ jsxDEV(String, { identifier: "password", component: "core" }, void 0, false, {
        fileName: "public/auth/js/esm/src/local/LoginForm/LoginFields.tsx",
        lineNumber: 175,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "public/auth/js/esm/src/local/LoginForm/LoginFields.tsx",
        lineNumber: 174,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV(
        "input",
        {
          type: "password",
          name: "password",
          id: "password",
          defaultValue: "",
          className: "form-control",
          placeholder: strings?.passwordPlaceholder ?? "",
          autoComplete: "current-password"
        },
        void 0,
        false,
        {
          fileName: "public/auth/js/esm/src/local/LoginForm/LoginFields.tsx",
          lineNumber: 177,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, true, {
      fileName: "public/auth/js/esm/src/local/LoginForm/LoginFields.tsx",
      lineNumber: 173,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "text-end mb-3", children: /* @__PURE__ */ jsxDEV("a", { href: forgotPasswordUrl, children: /* @__PURE__ */ jsxDEV(String, { identifier: "loginforgotpassword", component: "core" }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/LoginForm/LoginFields.tsx",
      lineNumber: 188,
      columnNumber: 45
    }, this) }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/LoginForm/LoginFields.tsx",
      lineNumber: 188,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/LoginForm/LoginFields.tsx",
      lineNumber: 187,
      columnNumber: 13
    }, this),
    recaptchaHtml && /* @__PURE__ */ jsxDEV("div", { className: "login-form-recaptcha mb-3", children: /* @__PURE__ */ jsxDEV("div", { dangerouslySetInnerHTML: { __html: recaptchaHtml } }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/LoginForm/LoginFields.tsx",
      lineNumber: 193,
      columnNumber: 21
    }, this) }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/LoginForm/LoginFields.tsx",
      lineNumber: 191,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "login-form-submit mb-3", children: /* @__PURE__ */ jsxDEV(
      Button,
      {
        type: "submit",
        id: "loginbtn",
        variant: "primary",
        className: "w-100",
        label: strings?.login ?? "",
        size: "lg"
      },
      void 0,
      false,
      {
        fileName: "public/auth/js/esm/src/local/LoginForm/LoginFields.tsx",
        lineNumber: 197,
        columnNumber: 17
      },
      this
    ) }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/LoginForm/LoginFields.tsx",
      lineNumber: 196,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "public/auth/js/esm/src/local/LoginForm/LoginFields.tsx",
    lineNumber: 156,
    columnNumber: 9
  }, this);
}
__name(LoginFields, "LoginFields");
export {
  LoginFields as default
};
//# sourceMappingURL=LoginFields.dev.js.map
