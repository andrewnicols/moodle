import{isAvailabilityPlugin as g}from"./types.js";async function y(t){let i=new Map,l=await Promise.allSettled(t.map(async n=>c(n)));for(let n of l)n.status==="fulfilled"&&n.value&&i.set(n.value.name,n.value);return i}async function c(t){let{name:i,modulePath:l,allowAdd:n,displayMode:r,initParams:u}=t;try{let a=(await import(l)).default;if(!a)return window.console.warn(`[core_availability/registry] Plugin "${i}" (${l}) has no default export. Skipping.`),s(t);let e=typeof a=="function"?new a:a;return g(e)?{name:i,allowAdd:n,displayMode:r,initParams:u,plugin:e}:(window.console.warn(`[core_availability/registry] Plugin "${i}" does not extend AvailabilityPlugin. Attempting legacy adapter fallback.`),s(t))}catch(o){return window.console.warn(`[core_availability/registry] Failed to import plugin "${i}" from "${l}". Attempting legacy adapter fallback.`,o),s(t)}}async function s(t){let{name:i,allowAdd:l,displayMode:n,initParams:r}=t,o=window.M?.["availability_"+i]?.form;if(!o)return window.console.warn(`[core_availability/registry] No ESM module or legacy YUI plugin found for "${i}". Skipping.`),null;try{let{LegacyPluginAdapter:a}=await import("@moodle/lms/core_availability/legacy_adapter"),e=new a(i,o,r);return{name:i,allowAdd:l,displayMode:n,initParams:r,plugin:e}}catch(a){return window.console.error(`[core_availability/registry] Failed to load legacy adapter for "${i}".`,a),null}}export{y as loadPlugins};
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
