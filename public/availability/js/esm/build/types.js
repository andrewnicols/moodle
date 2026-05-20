var i=Symbol.for("core_availability/AvailabilityPlugin");function a(n){return typeof n=="object"&&n!==null&&n[i]===!0}var o;o=i;var t=class{constructor(){this[o]=!0}validate(e){return[]}focusAfterAdd(e){e.querySelector("input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])")?.focus()}getInitialState(e){return{...e}}};export{i as AVAILABILITY_PLUGIN_BRAND,t as AvailabilityPlugin,a as isAvailabilityPlugin};
/**
 * Shared types for the availability conditions React components.
 *
 * @module     core_availability/types
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=types.js.map
