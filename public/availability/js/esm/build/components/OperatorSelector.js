import{jsx as t}from"react/jsx-runtime";var n={"&":"must match all","|":"must match any","!&":"must not match all","!|":"must not match any"};function p({value:r,onChange:a,disabled:o}){return t("select",{className:"availability-operator-select form-select",value:r,disabled:o,onChange:e=>a(e.target.value),"aria-label":"Restriction combination type",children:Object.entries(n).map(([e,l])=>t("option",{value:e,children:l},e))})}export{p as OperatorSelector};
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
