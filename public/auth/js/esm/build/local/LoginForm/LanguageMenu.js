import{jsx as n}from"react/jsx-runtime";/**
 * The language selector menu.
 *
 * The menu itself is a `core/action_menu`, which is rendered server-side and passed through
 * as pre-rendered HTML — converting `core/action_menu` to React is out of scope here.
 *
 * @module     core_auth/local/LoginForm/LanguageMenu
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function t({languageMenuHtml:e}){return e?n("div",{className:"login-languagemenu d-flex justify-content-center my-5",children:n("div",{dangerouslySetInnerHTML:{__html:e}})}):null}export{t as default};
