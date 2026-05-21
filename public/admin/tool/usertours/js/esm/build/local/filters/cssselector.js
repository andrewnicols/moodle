import o from"./base.js";var t=class extends o{filterMatches(r){let e=r.filtervalues.cssselector;return e?.[0]?(window.console.log("Checking CSS selector filter:",e[0]),!!document.querySelector(e[0])):!0}},i=new t;export{i as default};
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
