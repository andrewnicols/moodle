import r from"@moodle/lms/core/String";import{Fragment as d,jsx as e,jsxs as o}from"react/jsx-runtime";/**
 * The list of identity provider (e.g. OAuth2) login buttons.
 *
 * @module     core_auth/local/LoginForm/IdentityProviders
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function s({canLoginAsGuest:a,identityProviders:i}){const n=i.length>0;return o(d,{children:[(n||a)&&e("div",{className:"login-separator my-5",children:e(r,{identifier:"loginseparatoror",component:"core"})}),n&&e("div",{className:"login-identityproviders",children:i.map(t=>o("a",{className:"btn login-identityprovider-btn btn-outline-secondary mb-3",href:t.url,children:[t.iconurl&&e("img",{src:t.iconurl,alt:"",width:"24",height:"24"}),e(r,{identifier:"loginwith",component:"core",params:t.name,children:t.name})]},t.url))})]})}export{s as default};
