import{Fragment as a,jsx as l,jsxs as t}from"react/jsx-runtime";/**
 * Error and informational banners shown above the login form.
 *
 * The accompanying "move focus to the error / info message, then to the username field"
 * behaviour is handled by the parent {@link module:core_auth/LoginForm} component, since it
 * needs to coordinate with the login fields themselves.
 *
 * @module     core_auth/local/LoginForm/ErrorInfo
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function n({error:r,errorTitle:e,info:o}){return t(a,{children:[r&&t("div",{className:"alert alert-danger",id:"loginerrormessage",role:"alert",children:[e&&l("strong",{className:"d-block mb-1",children:e}),r]}),o&&l("div",{className:"alert alert-info",id:"logininfomessage",role:"status",children:o})]})}export{n as default};
