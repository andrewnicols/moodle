var d=Object.defineProperty;var t=(e,i)=>d(e,"name",{value:i,configurable:!0});import a from"./pending.js";var p=t((e,i)=>{let r=!1,u=!1,o,n=t(function(...s){if(o=s,r){u=!0;return}e.apply(this,s),r=!0,setTimeout(()=>{let c=u;r=!1,u=!1,c&&n.apply(this,o)},i)},"run");return n},"throttle"),l=new Map,f=t((e,i,{pending:r=!1,cancel:u=!1}={})=>{let o=null,n=t((...s)=>{r&&!l.has(n)&&l.set(n,new a("core/utils:debounce")),o!==null&&clearTimeout(o),o=setTimeout(async()=>{let c=l.get(n);l.delete(n),await e.apply(void 0,s),c?.resolve()},i)},"returnedFunction");return u&&(n.cancel=()=>{l.get(n)?.resolve(),o!==null&&clearTimeout(o)}),n},"debounce"),T=t(e=>e&&e!=="moodle"&&e!=="core"?e:"core","getNormalisedComponent"),b={throttle:p,debounce:f,getNormalisedComponent:T};export{f as debounce,b as default,T as getNormalisedComponent,p as throttle};
/**
 * Utility functions.
 *
 * @module     core/utils
 * @copyright  2019 Ryan Wyllie <ryan@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      2.9
 */
//# sourceMappingURL=utils.js.map
