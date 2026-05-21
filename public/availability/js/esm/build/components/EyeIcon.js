var s=Object.defineProperty;var n=(e,t)=>s(e,"name",{value:t,configurable:!0});import{jsxDEV as i}from"react/jsx-dev-runtime";function c({visible:e,onToggle:t}){let o=e?"Displayed greyed-out if student does not meet this condition":"Completely hidden if student does not meet this condition";return i("button",{type:"button",className:"availability-eye btn btn-link p-1",title:o,"aria-label":o,"aria-pressed":e,onClick:()=>t(!e),children:i("i",{className:`bi ${e?"bi-eye":"bi-eye-slash"}`,"aria-hidden":"true"},void 0,!1,{fileName:"public/availability/js/esm/src/components/EyeIcon.tsx",lineNumber:50,columnNumber:13},this)},void 0,!1,{fileName:"public/availability/js/esm/src/components/EyeIcon.tsx",lineNumber:42,columnNumber:9},this)}n(c,"EyeIcon");export{c as EyeIcon};
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
