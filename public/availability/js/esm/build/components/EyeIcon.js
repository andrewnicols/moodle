import{jsx as o}from"react/jsx-runtime";function s({visible:e,onToggle:n}){let t=e?"Displayed greyed-out if student does not meet this condition":"Completely hidden if student does not meet this condition";return o("button",{type:"button",className:"availability-eye btn btn-link p-1",title:t,"aria-label":t,"aria-pressed":e,onClick:()=>n(!e),children:o("i",{className:`bi ${e?"bi-eye":"bi-eye-slash"}`,"aria-hidden":"true"})})}export{s as EyeIcon};
/**
 * Eye icon (visibility toggle) for availability conditions.
 *
 * Toggles whether a condition is shown greyed out or completely hidden
 * when the student does not meet the requirement.
 *
 * @module     core_availability/components/EyeIcon
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=EyeIcon.js.map
