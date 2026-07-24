var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * The "Cookies must be enabled" notice, which opens a help modal when clicked.
 *
 * The modal itself is opened by a global delegated click handler for `data-modal`
 * attributes (see `core/utility`), so no additional JavaScript is required here.
 *
 * @module     core_auth/local/LoginForm/CookiesNotice
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { Button } from "@moodlehq/design-system";
import { useEffect, useState } from "react";
import { getString } from "@moodle/lms/core/stringUtils";
function CookiesNotice() {
  const [label, setLabel] = useState("");
  useEffect(() => {
    getString("cookiesnotice").then(setLabel);
  }, []);
  return /* @__PURE__ */ jsxDEV("div", { className: "login-cookiesnotice text-center", children: /* @__PURE__ */ jsxDEV(
    Button,
    {
      type: "submit",
      variant: "ghost",
      label,
      "data-modal": "alert",
      "data-modal-title-str": JSON.stringify(["cookiesenabled", "core"]),
      "data-modal-content-str": JSON.stringify(["cookiesenabled_help_html", "core"])
    },
    void 0,
    false,
    {
      fileName: "public/auth/js/esm/src/local/LoginForm/CookiesNotice.tsx",
      lineNumber: 40,
      columnNumber: 13
    },
    this
  ) }, void 0, false, {
    fileName: "public/auth/js/esm/src/local/LoginForm/CookiesNotice.tsx",
    lineNumber: 39,
    columnNumber: 9
  }, this);
}
__name(CookiesNotice, "CookiesNotice");
export {
  CookiesNotice as default
};
//# sourceMappingURL=CookiesNotice.dev.js.map
