var s=Object.defineProperty;var l=(o,e)=>s(o,"name",{value:e,configurable:!0});import i from"./base.js";var r=class extends i{static{l(this,"CssSelectorFilter")}filterMatches(e){let t=e.filtervalues.cssselector;return t?.[0]?(window.console.log("Checking CSS selector filter:",t[0]),!!document.querySelector(t[0])):!0}},a=new r;export{a as default};
/**
 * CSS selector client-side filter.
 *
 * Checks whether a CSS selector configured on the tour matches an element
 * on the current page. If no selector is configured, the filter passes.
 *
 * @module     tool_usertours/local/filters/cssselector
 * @copyright  2020 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=cssselector.js.map
