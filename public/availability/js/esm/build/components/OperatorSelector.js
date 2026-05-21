var p=Object.defineProperty;var a=(t,r)=>p(t,"name",{value:r,configurable:!0});import{jsxDEV as o}from"react/jsx-dev-runtime";var s={"&":"must match all","|":"must match any","!&":"must not match all","!|":"must not match any"};function i({value:t,onChange:r,disabled:l}){return o("select",{className:"availability-operator-select form-select",value:t,disabled:l,onChange:e=>r(e.target.value),"aria-label":"Restriction combination type",children:Object.entries(s).map(([e,n])=>o("option",{value:e,children:n},e,!1,{fileName:"public/availability/js/esm/src/components/OperatorSelector.tsx",lineNumber:55,columnNumber:17},this))},void 0,!1,{fileName:"public/availability/js/esm/src/components/OperatorSelector.tsx",lineNumber:47,columnNumber:9},this)}a(i,"OperatorSelector");export{i as OperatorSelector};
/**
 * Operator selector component for availability condition lists.
 *
 * Renders a dropdown allowing the user to choose how sibling conditions
 * are combined (AND, OR, NOT-AND, NOT-OR).
 *
 * @module     core_availability/components/OperatorSelector
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=OperatorSelector.js.map
