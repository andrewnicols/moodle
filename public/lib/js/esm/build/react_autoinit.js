import m from"react";import{createRoot as f}from"react-dom/client";var r="[data-react-component]",s="reactMounted",o="reactMounting",c=new WeakMap,E=()=>document.readyState==="loading"?new Promise(t=>document.addEventListener("DOMContentLoaded",t,{once:!0})):Promise.resolve(),w=t=>{let e=t.getAttribute("data-react-props");if(!e)return{};try{return JSON.parse(e)}catch(n){return window.console.error("[react_autoinit] invalid JSON",e,n),{}}},M=async t=>{if(!t)return null;if(!t.startsWith("@moodle/lms/"))return window.console.error("[react_autoinit] Invalid component format, expected @moodle/lms/<component>/<path>:",t),null;try{return await import(t)}catch(e){return window.console.error(`[react_autoinit] Failed to import: ${t}`,e),null}},d=async t=>{if(t.dataset[s]||t.dataset[o])return;t.dataset[o]="1";let e=t.getAttribute("data-react-component");if(!e){delete t.dataset[o];return}let n=await M(e);if(!n){window.console.warn("[react_autoinit] Component not found:",e),delete t.dataset[o];return}let i=n.default;if(!i){window.console.warn("[react_autoinit] Module has no default export:",e),delete t.dataset[o];return}try{let a=f(t);a.render(m.createElement(i,w(t))),c.set(t,()=>a.unmount()),t.dataset[s]="1"}catch(a){window.console.error("[react_autoinit] Mount failed:",e,a)}finally{delete t.dataset[o]}},l=t=>{let e=c.get(t);if(e){try{e()}catch(n){window.console.error("[react_autoinit] Error unmounting:",n)}c.delete(t)}delete t.dataset[s],delete t.dataset[o]},p=t=>{for(let e of t.querySelectorAll(r))d(e)},h=t=>{t instanceof Element&&(t.matches?.(r)&&d(t),t.querySelectorAll?.(r).forEach(d))},L=t=>{t instanceof Element&&(t.matches?.(r)&&l(t),t.querySelectorAll?.(r).forEach(l))},y=()=>{let t=new MutationObserver(e=>{e.forEach(n=>{n.addedNodes?.forEach(h),n.removedNodes?.forEach(L)})});return t.observe(document.documentElement,{childList:!0,subtree:!0}),t},u=null,v=async()=>{await E(),u||(u=y()),p(document)};v();
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
