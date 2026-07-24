import{jsx as e}from"react/jsx-runtime";/**
 * A maintenance mode banner shown above the login form.
 *
 * @module     core_auth/local/LoginForm/Maintenance
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function t({maintenance:n}){return n?e("div",{className:"alert alert-danger login-maintenance",children:e("div",{dangerouslySetInnerHTML:{__html:n}})}):null}export{t as default};
