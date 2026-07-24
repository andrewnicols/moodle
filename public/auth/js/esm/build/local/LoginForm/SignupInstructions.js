import i from"@moodle/lms/core/String";import{jsx as r,jsxs as a}from"react/jsx-runtime";/**
 * Signup instructions and call-to-action link, shown below the login form.
 *
 * @module     core_auth/local/LoginForm/SignupInstructions
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function s({canSignup:t,signupInstructions:e,signupUrl:n}){return t?a("div",{className:"text-center small mb-3",children:[e&&r("span",{className:"text-muted me-1",dangerouslySetInnerHTML:{__html:e}}),r("a",{href:n,children:r(i,{identifier:"loginstartsignup",component:"core"})})]}):e?r("p",{className:"small mb-3",dangerouslySetInnerHTML:{__html:e}}):null}export{s as default};
