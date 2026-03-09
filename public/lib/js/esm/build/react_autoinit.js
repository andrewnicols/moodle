import l from"react";import{createRoot as m}from"react-dom/client";var o="[data-react-component]",a="reactMounted",c=new WeakMap,f=()=>document.readyState==="loading"?new Promise(t=>document.addEventListener("DOMContentLoaded",t,{once:!0})):Promise.resolve(),w=t=>{let e=t.getAttribute("data-react-props");if(!e)return{};try{return JSON.parse(e)}catch(n){return window.console.error("[react_autoinit] invalid JSON",e,n),{}}},E=async t=>{if(!t)return null;if(!t.startsWith("@moodle/lms/"))return window.console.error("[react_autoinit] Invalid component format, expected @moodle/lms/<component>/<path>:",t),null;try{return await import(t)}catch(e){return window.console.error(`[react_autoinit] Failed to import: ${t}`,e),null}},s=async t=>{if(t.dataset[a])return;let e=t.getAttribute("data-react-component");if(!e)return;let n=await E(e);if(!n){window.console.warn("[react_autoinit] Component not found:",e);return}let i=n.default;if(!i){window.console.warn("[react_autoinit] Module has no default export:",e);return}try{let r=m(t);r.render(l.createElement(i,w(t))),c.set(t,()=>r.unmount()),t.dataset[a]="1"}catch(r){window.console.error("[react_autoinit] Mount failed:",e,r)}},u=t=>{let e=c.get(t);if(e){try{e()}catch(n){window.console.error("[react_autoinit] Error unmounting:",n)}c.delete(t)}delete t.dataset[a]},p=async t=>{for(let e of t.querySelectorAll(o))await s(e)},h=t=>{t instanceof Element&&(t.matches?.(o)&&s(t),t.querySelectorAll?.(o).forEach(s))},y=t=>{t instanceof Element&&(t.matches?.(o)&&u(t),t.querySelectorAll?.(o).forEach(u))},M=()=>{let t=new MutationObserver(e=>{e.forEach(n=>{n.addedNodes?.forEach(h),n.removedNodes?.forEach(y)})});return t.observe(document.documentElement,{childList:!0,subtree:!0}),t},d=null,v=async()=>{await f(),await p(document),d||(d=M())};v();
/**
 * Auto-init shim for Mustache React helper components.
 *
 * Scans the DOM for elements with the `data-react-component` attribute and
 * mounts the matching React component into each one. A MutationObserver watches
 * for dynamically injected content (AJAX, fragments) so components are mounted
 * and unmounted automatically without any additional initialiser call.
 *
 * The expected DOM contract is:
 * ```html
 *   <div
 *     data-react-component="@mod_book/viewer"
 *     data-react-props='{"title":"My Book"}'
 *   ></div>
 * ```
 *
 * @module     core/react_autoinit
 * @copyright  Meirza <meirza.arson@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
