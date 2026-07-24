var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * The "Log in as a guest" button and form.
 *
 * @module     core_auth/local/LoginForm/GuestLogin
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useState } from "react";
import { Button } from "@moodlehq/design-system";
import { getString } from "@moodle/lms/core/stringUtils";
import { requireAsync } from "@moodle/lms/core/amd";
function GuestLogin({
  canLoginAsGuest,
  actionUrl,
  loginToken
}) {
  const [label, setLabel] = useState("");
  useEffect(() => {
    if (canLoginAsGuest) {
      getString("loginasguest").then(setLabel);
    }
  }, [canLoginAsGuest]);
  useEffect(() => {
    if (!canLoginAsGuest) {
      return;
    }
    requireAsync("core_form/submit").then((submit) => {
      submit.init("loginguestbtn");
      return;
    });
  }, [canLoginAsGuest]);
  if (!canLoginAsGuest) {
    return null;
  }
  return /* @__PURE__ */ jsxDEV("form", { action: actionUrl, method: "post", id: "guestlogin", className: "mb-4", children: [
    /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: "logintoken", value: loginToken }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/LoginForm/GuestLogin.tsx",
      lineNumber: 70,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: "username", value: "guest" }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/LoginForm/GuestLogin.tsx",
      lineNumber: 71,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: "password", value: "guest" }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/LoginForm/GuestLogin.tsx",
      lineNumber: 72,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(
      Button,
      {
        type: "submit",
        id: "loginguestbtn",
        variant: "outline-secondary",
        className: "w-100",
        startIcon: /* @__PURE__ */ jsxDEV("i", { className: "fa fa-user me-2", "aria-hidden": "true" }, void 0, false, {
          fileName: "public/auth/js/esm/src/local/LoginForm/GuestLogin.tsx",
          lineNumber: 78,
          columnNumber: 28
        }, this),
        label,
        size: "lg"
      },
      void 0,
      false,
      {
        fileName: "public/auth/js/esm/src/local/LoginForm/GuestLogin.tsx",
        lineNumber: 73,
        columnNumber: 13
      },
      this
    )
  ] }, void 0, true, {
    fileName: "public/auth/js/esm/src/local/LoginForm/GuestLogin.tsx",
    lineNumber: 69,
    columnNumber: 9
  }, this);
}
__name(GuestLogin, "GuestLogin");
export {
  GuestLogin as default
};
//# sourceMappingURL=GuestLogin.dev.js.map
