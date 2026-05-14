var u=class o{static pending(t){M.util.js_pending(t)}static complete(t){M.util.js_complete(t)}constructor(t="pendingPromise"){let r,i,e=o.Promise((n,s)=>{r=n,i=s},t);return e.resolve=r,e.reject=i,e}static Promise(t,r="pendingPromise"){let i=new Promise((e,n)=>{o.pending(r),t(e,n)});return i.then(()=>{o.complete(r)}).catch(()=>{}),i}};var c=(o,t)=>{let r=!1,i=!1,e,n=function(...s){if(e=s,r){i=!0;return}o.apply(this,s),r=!0,setTimeout(()=>{let d=i;r=!1,i=!1,d&&n.apply(this,e)},t)};return n},l=new Map,a=(o,t,{pending:r=!1,cancel:i=!1}={})=>{let e=null,n=(...s)=>{r&&!l.has(n)&&l.set(n,new u("core/utils:debounce")),e!==null&&clearTimeout(e),e=setTimeout(async()=>{let d=l.get(n);l.delete(n),await o.apply(void 0,s),d?.resolve()},t)};return i&&(n.cancel=()=>{l.get(n)?.resolve(),e!==null&&clearTimeout(e)}),n},v=o=>o&&o!=="moodle"&&o!=="core"?o:"core",m={throttle:c,debounce:a,getNormalisedComponent:v};export{a as debounce,m as default,v as getNormalisedComponent,c as throttle};
/**
 * A helper used to inform Behat that an operation is in progress and that Behat must wait for it to complete.
 *
 * This is useful in cases where the user interface may be updated and take some time to change — for example
 * where applying a transition.
 *
 * This data is used by Behat, but may also be consumed by other locations too.
 *
 * By informing Behat that an action is about to happen, and then that it is complete, allows
 * Behat to wait for that completion and avoid random failures in automated testing.
 *
 * Note: It is recommended that a descriptive key be used to aid in debugging where possible, but this is optional.
 *
 * @module     core/pending
 * @copyright  2018 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      3.6
 */
/**
 * Utility functions.
 *
 * @module     core/utils
 * @copyright  2019 Ryan Wyllie <ryan@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      2.9
 */
