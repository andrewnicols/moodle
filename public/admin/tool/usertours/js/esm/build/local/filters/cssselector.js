var e=class{};var r=class extends e{filterMatches(l){let t=l.filtervalues.cssselector;return t?.[0]?(window.console.log("Checking CSS selector filter:",t[0]),!!document.querySelector(t[0])):!0}},i=new r;export{i as default};
/**
 * Base class for client-side user tour filters.
 *
 * Each client-side filter must extend this class and implement the
 * {@link filterMatches} method. Filter modules are loaded dynamically
 * by the UserTours orchestrator via ESM import map specifiers provided
 * by the PHP layer.
 *
 * @module     tool_usertours/local/filters/base
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
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
