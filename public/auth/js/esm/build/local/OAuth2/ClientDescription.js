import{jsx as i,jsxs as t}from"react/jsx-runtime";/**
 * The OAuth2 client's description, shown on the OAuth2 authorization pages.
 *
 * @module     core_auth/local/OAuth2/ClientDescription
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function r({clientDescription:e}){return e?t("div",{className:"alert alert-primary d-flex align-items-center",role:"alert",children:[i("i",{className:"icon fa fa-info-circle","aria-hidden":"true"}),i("div",{dangerouslySetInnerHTML:{__html:e}})]}):null}export{r as default};
