var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * The "Continue as this user" / "Change user" form shown on the OAuth2 "continue as" page.
 *
 * @module     core_auth/local/OAuth2/ContinueForm
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useState } from "react";
import { Button } from "@moodlehq/design-system";
import { getString } from "@moodle/lms/core/stringUtils";
function ContinueForm({ actionUrl, logoutUrl, sesskey, fullName }) {
  const [continueLabel, setContinueLabel] = useState("");
  const [changeUserLabel, setChangeUserLabel] = useState("");
  useEffect(() => {
    getString("oauth2:contineasuser", "core", fullName).then(setContinueLabel);
    getString("oauth2:contineasuser:changeuser", "core").then(setChangeUserLabel);
  }, [fullName]);
  return /* @__PURE__ */ jsxDEV("div", { className: "d-flex d-inline p-2", children: [
    /* @__PURE__ */ jsxDEV("form", { method: "post", action: actionUrl, className: "w-50 m-1", children: [
      /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: "sesskey", value: sesskey }, void 0, false, {
        fileName: "public/auth/js/esm/src/local/OAuth2/ContinueForm.tsx",
        lineNumber: 52,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: "currentuser", value: "1" }, void 0, false, {
        fileName: "public/auth/js/esm/src/local/OAuth2/ContinueForm.tsx",
        lineNumber: 53,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV(
        Button,
        {
          type: "submit",
          size: "lg",
          name: "approve",
          value: "1",
          variant: "primary",
          className: "w-100",
          label: continueLabel
        },
        void 0,
        false,
        {
          fileName: "public/auth/js/esm/src/local/OAuth2/ContinueForm.tsx",
          lineNumber: 54,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, true, {
      fileName: "public/auth/js/esm/src/local/OAuth2/ContinueForm.tsx",
      lineNumber: 51,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("form", { method: "post", action: logoutUrl, className: "w-50 m-1", children: [
      /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: "sesskey", value: sesskey }, void 0, false, {
        fileName: "public/auth/js/esm/src/local/OAuth2/ContinueForm.tsx",
        lineNumber: 66,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: "currentuser", value: "1" }, void 0, false, {
        fileName: "public/auth/js/esm/src/local/OAuth2/ContinueForm.tsx",
        lineNumber: 67,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV(
        Button,
        {
          type: "submit",
          size: "lg",
          name: "approve",
          value: "1",
          variant: "primary",
          className: "w-100",
          label: changeUserLabel
        },
        void 0,
        false,
        {
          fileName: "public/auth/js/esm/src/local/OAuth2/ContinueForm.tsx",
          lineNumber: 68,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, true, {
      fileName: "public/auth/js/esm/src/local/OAuth2/ContinueForm.tsx",
      lineNumber: 65,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "public/auth/js/esm/src/local/OAuth2/ContinueForm.tsx",
    lineNumber: 50,
    columnNumber: 9
  }, this);
}
__name(ContinueForm, "ContinueForm");
export {
  ContinueForm as default
};
//# sourceMappingURL=ContinueForm.dev.js.map
