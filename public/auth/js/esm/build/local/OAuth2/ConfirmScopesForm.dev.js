var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * The "Continue" / "Cancel" form shown at the bottom of the OAuth2 confirm scopes page.
 *
 * @module     core_auth/local/OAuth2/ConfirmScopesForm
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useState } from "react";
import { Button } from "@moodlehq/design-system";
import { getString } from "@moodle/lms/core/stringUtils";
function ConfirmScopesForm({ actionUrl, sesskey }) {
  const [continueLabel, setContinueLabel] = useState("");
  const [cancelLabel, setCancelLabel] = useState("");
  useEffect(() => {
    getString("continue", "core").then(setContinueLabel);
    getString("cancel", "core").then(setCancelLabel);
  }, []);
  return /* @__PURE__ */ jsxDEV("form", { method: "post", action: actionUrl, children: [
    /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: "sesskey", value: sesskey }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/OAuth2/ConfirmScopesForm.tsx",
      lineNumber: 47,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "login-form-submit mb-3 mt-3", children: [
      /* @__PURE__ */ jsxDEV(
        Button,
        {
          type: "submit",
          size: "lg",
          name: "approve",
          value: "1",
          variant: "secondary",
          className: "w-100 mb-3",
          label: continueLabel
        },
        void 0,
        false,
        {
          fileName: "public/auth/js/esm/src/local/OAuth2/ConfirmScopesForm.tsx",
          lineNumber: 49,
          columnNumber: 17
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        Button,
        {
          type: "submit",
          size: "lg",
          name: "approve",
          value: "0",
          variant: "primary",
          className: "w-100 mb-3",
          label: cancelLabel
        },
        void 0,
        false,
        {
          fileName: "public/auth/js/esm/src/local/OAuth2/ConfirmScopesForm.tsx",
          lineNumber: 58,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, true, {
      fileName: "public/auth/js/esm/src/local/OAuth2/ConfirmScopesForm.tsx",
      lineNumber: 48,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "public/auth/js/esm/src/local/OAuth2/ConfirmScopesForm.tsx",
    lineNumber: 46,
    columnNumber: 9
  }, this);
}
__name(ConfirmScopesForm, "ConfirmScopesForm");
export {
  ConfirmScopesForm as default
};
//# sourceMappingURL=ConfirmScopesForm.dev.js.map
