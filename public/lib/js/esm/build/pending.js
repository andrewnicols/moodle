var d=Object.defineProperty;var l=(s,e)=>d(s,"name",{value:e,configurable:!0});var n=class s{static{l(this,"Pending")}#e;static pending(e){M.util.js_pending(e)}static complete(e){M.util.js_complete(e)}constructor(e="pendingPromise"){let i,t;this.#e=s.Promise((o,r)=>{i=o,t=r},e),this.resolve=i,this.reject=t}then(e,i){return this.#e.then(e,i)}catch(e){return this.#e.catch(e)}static Promise(e,i="pendingPromise"){let t=new Promise((o,r)=>{s.pending(i),e(o,r)});return t.then(()=>{s.complete(i)}).catch(()=>{}),t}};export{n as default};
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
//# sourceMappingURL=pending.js.map
