import{useRef as u,useEffect as C,useCallback as g}from"react";import{AvailabilityPlugin as v}from"./types.js";import{jsx as L}from"react/jsx-runtime";function E(o,n){let t=({json:l,onChange:a,onValidate:d})=>{let r=u(null),s=u(null),p=u(!1);C(()=>{if(p.current||!r.current)return;p.current=!0;let e=n.getNode(l);s.current=e;let i=e.getDOMNode?e.getDOMNode():e;i instanceof HTMLElement&&r.current.appendChild(i);let c=()=>{y(),m()};return r.current.addEventListener("input",c),r.current.addEventListener("change",c),()=>{r.current?.removeEventListener("input",c),r.current?.removeEventListener("change",c)}},[]);let y=g(()=>{if(!s.current)return;let e={type:o};try{n.fillValue(e,s.current),a(e)}catch(i){window.console.warn(`[legacy_adapter] fillValue failed for "${o}":`,i)}},[a]),m=g(()=>{if(!s.current||!n.fillErrors)return;let e=[];try{n.fillErrors(e,s.current),d(e)}catch(i){window.console.warn(`[legacy_adapter] fillErrors failed for "${o}":`,i)}},[d]);return L("div",{ref:r,className:"availability-legacy-plugin","data-legacy-plugin":o})};return t.displayName=`LegacyPlugin(${o})`,t}var f=class extends v{#n;#t;#e;constructor(n,t,l){super(),this.#n=n,this.#t=t,this.#e=E(n,t),t.initInner&&t.initInner(...l)}getComponent(){return this.#e}fillValue(n){return{type:this.#n,...n}}validate(n){return[]}focusAfterAdd(n){n.querySelector("input:not([disabled]), select:not([disabled])")?.focus()}};export{f as LegacyPluginAdapter};
/**
 * Legacy YUI plugin adapter.
 *
 * Wraps a YUI-based availability condition plugin (one that implements
 * `M.availability_<name>.form`) as a React component, allowing third-party
 * plugins that haven't migrated to ESM/React to continue working inside the
 * new availability form.
 *
 * @module     core_availability/legacy_adapter
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=legacy_adapter.js.map
