var c=Object.defineProperty;var s=(n,i)=>c(n,"name",{value:i,configurable:!0});import{AvailabilityPlugin as d}from"./types.js";async function f(n){let i=new Map,l=await Promise.allSettled(n.map(async t=>y(t)));for(let t of l)t.status==="fulfilled"&&t.value&&i.set(t.value.name,t.value);return i}s(f,"loadPlugins");async function y(n){let{name:i,modulePath:l,allowAdd:t,displayMode:r,initParams:g}=n;try{let a=(await import(l)).default;if(!a)return window.console.warn(`[core_availability/registry] Plugin "${i}" (${l}) has no default export. Skipping.`),u(n);let e=typeof a=="function"?new a:a;return e instanceof d?{name:i,allowAdd:t,displayMode:r,initParams:g,plugin:e}:(window.console.warn(`[core_availability/registry] Plugin "${i}" does not extend AvailabilityPlugin. Attempting legacy adapter fallback.`),u(n))}catch(o){return window.console.warn(`[core_availability/registry] Failed to import plugin "${i}" from "${l}". Attempting legacy adapter fallback.`,o),u(n)}}s(y,"loadSinglePlugin");async function u(n){let{name:i,allowAdd:l,displayMode:t,initParams:r}=n,o=window.M?.["availability_"+i]?.form;if(!o)return window.console.warn(`[core_availability/registry] No ESM module or legacy YUI plugin found for "${i}". Skipping.`),null;try{let{LegacyPluginAdapter:a}=await import("@moodle/lms/core_availability/legacy_adapter"),e=new a(i,o,r);return{name:i,allowAdd:l,displayMode:t,initParams:r,plugin:e}}catch(a){return window.console.error(`[core_availability/registry] Failed to load legacy adapter for "${i}".`,a),null}}s(u,"tryLegacyAdapter");export{f as loadPlugins};
/**
 * Plugin registry and dynamic loader for availability condition plugins.
 *
 * Dynamically imports ESM modules for each enabled availability plugin,
 * validates they export a proper {@link AvailabilityPlugin} subclass, and
 * falls back to the legacy YUI adapter for plugins that haven't migrated.
 *
 * @module     core_availability/registry
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=registry.js.map
