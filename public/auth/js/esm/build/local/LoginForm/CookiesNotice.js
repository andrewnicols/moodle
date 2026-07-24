import{Button as a}from"@moodlehq/design-system";import{useEffect as i,useState as l}from"react";import{getString as n}from"@moodle/lms/core/stringUtils";import{jsx as t}from"react/jsx-runtime";/**
 * The "Cookies must be enabled" notice, which opens a help modal when clicked.
 *
 * The modal itself is opened by a global delegated click handler for `data-modal`
 * attributes (see `core/utility`), so no additional JavaScript is required here.
 *
 * @module     core_auth/local/LoginForm/CookiesNotice
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function c(){const[e,o]=l("");return i(()=>{n("cookiesnotice").then(o)},[]),t("div",{className:"login-cookiesnotice text-center",children:t(a,{type:"submit",variant:"ghost",label:e,"data-modal":"alert","data-modal-title-str":JSON.stringify(["cookiesenabled","core"]),"data-modal-content-str":JSON.stringify(["cookiesenabled_help_html","core"])})})}export{c as default};
