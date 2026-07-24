var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * Signup instructions and call-to-action link, shown below the login form.
 *
 * @module     core_auth/local/LoginForm/SignupInstructions
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import String from "@moodle/lms/core/String";
function SignupInstructions({
  canSignup,
  signupInstructions,
  signupUrl
}) {
  if (canSignup) {
    return /* @__PURE__ */ jsxDEV("div", { className: "text-center small mb-3", children: [
      signupInstructions && /* @__PURE__ */ jsxDEV(
        "span",
        {
          className: "text-muted me-1",
          dangerouslySetInnerHTML: { __html: signupInstructions }
        },
        void 0,
        false,
        {
          fileName: "public/auth/js/esm/src/local/LoginForm/SignupInstructions.tsx",
          lineNumber: 46,
          columnNumber: 21
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("a", { href: signupUrl, children: /* @__PURE__ */ jsxDEV(String, { identifier: "loginstartsignup", component: "core" }, void 0, false, {
        fileName: "public/auth/js/esm/src/local/LoginForm/SignupInstructions.tsx",
        lineNumber: 52,
        columnNumber: 37
      }, this) }, void 0, false, {
        fileName: "public/auth/js/esm/src/local/LoginForm/SignupInstructions.tsx",
        lineNumber: 52,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "public/auth/js/esm/src/local/LoginForm/SignupInstructions.tsx",
      lineNumber: 44,
      columnNumber: 13
    }, this);
  }
  if (signupInstructions) {
    return /* @__PURE__ */ jsxDEV(
      "p",
      {
        className: "small mb-3",
        dangerouslySetInnerHTML: { __html: signupInstructions }
      },
      void 0,
      false,
      {
        fileName: "public/auth/js/esm/src/local/LoginForm/SignupInstructions.tsx",
        lineNumber: 59,
        columnNumber: 13
      },
      this
    );
  }
  return null;
}
__name(SignupInstructions, "SignupInstructions");
export {
  SignupInstructions as default
};
//# sourceMappingURL=SignupInstructions.dev.js.map
