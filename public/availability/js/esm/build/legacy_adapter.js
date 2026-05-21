var v=Object.defineProperty;var c=(t,n)=>v(t,"name",{value:n,configurable:!0});import{useRef as a,useEffect as E,useCallback as f}from"react";import{AvailabilityPlugin as L}from"./types.js";import{jsxDEV as N}from"react/jsx-dev-runtime";function w(t,n){let r=c(({json:u,onChange:d,onValidate:p})=>{let o=a(null),s=a(null),g=a(!1);E(()=>{if(g.current||!o.current)return;g.current=!0;let e=n.getNode(u);s.current=e;let i=e.getDOMNode?e.getDOMNode():e;i instanceof HTMLElement&&o.current.appendChild(i);let l=c(()=>{m(),C()},"handleChange");return o.current.addEventListener("input",l),o.current.addEventListener("change",l),()=>{o.current?.removeEventListener("input",l),o.current?.removeEventListener("change",l)}},[]);let m=f(()=>{if(!s.current)return;let e={type:t};try{n.fillValue(e,s.current),d(e)}catch(i){window.console.warn(`[legacy_adapter] fillValue failed for "${t}":`,i)}},[d]),C=f(()=>{if(!s.current||!n.fillErrors)return;let e=[];try{n.fillErrors(e,s.current),p(e)}catch(i){window.console.warn(`[legacy_adapter] fillErrors failed for "${t}":`,i)}},[p]);return N("div",{ref:o,className:"availability-legacy-plugin","data-legacy-plugin":t},void 0,!1,{fileName:"public/availability/js/esm/src/legacy_adapter.tsx",lineNumber:116,columnNumber:13},this)},"LegacyComponent");return r.displayName=`LegacyPlugin(${t})`,r}c(w,"createLegacyComponent");var y=class extends L{static{c(this,"LegacyPluginAdapter")}#n;#t;#e;constructor(n,r,u){super(),this.#n=n,this.#t=r,this.#e=w(n,r),r.initInner&&r.initInner(...u)}getComponent(){return this.#e}fillValue(n){return{type:this.#n,...n}}validate(n){return[]}focusAfterAdd(n){n.querySelector("input:not([disabled]), select:not([disabled])")?.focus()}};export{y as LegacyPluginAdapter};
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
