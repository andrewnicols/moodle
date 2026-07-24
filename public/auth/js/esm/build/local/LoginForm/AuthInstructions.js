import{jsx as n}from"react/jsx-runtime";/**
 * Custom auth instructions, shown on small screens only (the left panel covers this on
 * larger screens).
 *
 * @module     core_auth/local/LoginForm/AuthInstructions
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function e({authInstructions:t}){return t?n("div",{className:"d-lg-none small mb-3",children:n("div",{dangerouslySetInnerHTML:{__html:t}})}):null}export{e as default};
