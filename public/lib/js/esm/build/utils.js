import c from"./pending.js";var d=(n,s)=>{let t=!1,i=!1,o,e=function(...r){if(o=r,t){i=!0;return}n.apply(this,r),t=!0,setTimeout(()=>{let l=i;t=!1,i=!1,l&&e.apply(this,o)},s)};return e},u=new Map,a=(n,s,{pending:t=!1,cancel:i=!1}={})=>{let o=null,e=(...r)=>{t&&!u.has(e)&&u.set(e,new c("core/utils:debounce")),o!==null&&clearTimeout(o),o=setTimeout(async()=>{let l=u.get(e);u.delete(e),await n.apply(void 0,r),l?.resolve()},s)};return i&&(e.cancel=()=>{u.get(e)?.resolve(),o!==null&&clearTimeout(o)}),e},p=n=>n&&n!=="moodle"&&n!=="core"?n:"core",T={throttle:d,debounce:a,getNormalisedComponent:p};export{a as debounce,T as default,p as getNormalisedComponent,d as throttle};
/**
 * Utility functions.
 *
 * @module     core/utils
 * @copyright  2019 Ryan Wyllie <ryan@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      2.9
 */
//# sourceMappingURL=utils.js.map
