import c from"@moodle/lms/core/pending";var a=(n,s)=>{let t=!1,i=!1,o,e=function(...u){if(o=u,t){i=!0;return}n.apply(this,u),t=!0,setTimeout(()=>{let l=i;t=!1,i=!1,l&&e.apply(this,o)},s)};return e},r=new Map,d=(n,s,{pending:t=!1,cancel:i=!1}={})=>{let o=null,e=(...u)=>{t&&!r.has(e)&&r.set(e,new c("core/utils:debounce")),o!==null&&clearTimeout(o),o=setTimeout(async()=>{let l=r.get(e);r.delete(e),await n.apply(void 0,u),l?.resolve()},s)};return i&&(e.cancel=()=>{r.get(e)?.resolve(),o!==null&&clearTimeout(o)}),e},p=n=>n&&n!=="moodle"&&n!=="core"?n:"core",g={throttle:a,debounce:d,getNormalisedComponent:p};export{d as debounce,g as default,p as getNormalisedComponent,a as throttle};
/**
 * Utility functions.
 *
 * @module     core/utils
 * @copyright  2019 Ryan Wyllie <ryan@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      2.9
 */
