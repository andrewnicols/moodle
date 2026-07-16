import{jsx as e}from"react/jsx-runtime";/**
 * The current user's picture and name, shown on the OAuth2 authorization pages.
 *
 * @module     core_auth/local/OAuth2/UserInfo
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function t({userPictureHtml:r}){return e("div",{className:"p-1 mt-2 mb-2 w-100 d-flex flex-row",children:e("div",{className:"picture",children:e("div",{dangerouslySetInnerHTML:{__html:r}})})})}export{t as default};
