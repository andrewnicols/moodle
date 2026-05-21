var i=Object.defineProperty;var e=(o,t)=>i(o,"name",{value:t,configurable:!0});async function s(o){return(await Promise.all(o.map(r=>import(r)))).map(r=>r.default??r)}e(s,"loadFilterModules");export{s as loadFilterModules};
/**
 * Dynamic loader for client-side tour filter modules.
 *
 * Uses the browser import map to resolve ESM specifiers provided by the
 * PHP layer at runtime.
 *
 * @module     tool_usertours/loadFilters
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=loadFilters.js.map
