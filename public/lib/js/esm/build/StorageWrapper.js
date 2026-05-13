var o=M.cfg,e=o,g=o.jsrev!==-1;var i=class n{#t;#r;#s;#e;#n;constructor(t){this.#t=t,this.#r=this.#o();let r=`${e.wwwroot}/${e.jsrev}`;this.#s=`${n.hashString(r)}/`,this.#e=`${n.hashString(e.wwwroot)}/jsrev`,this.#n=`${n.hashString(e.wwwroot)}/currentlogin`,this.#g()}#o(){if(e.jsrev===-1||typeof this.#t>"u")return!1;let t="test";try{return this.#t===null?!1:(this.#t.setItem(t,"1"),this.#t.removeItem(t),!0)}catch{return!1}}#i(t){return this.#s+t}#g(){if(!this.#r)return;let t=this.#t.getItem(this.#e);if(t===null?this.#t.setItem(this.#e,String(e.jsrev)):String(e.jsrev)!==t&&(this.#t.clear(),this.#t.setItem(this.#e,String(e.jsrev))),e.currentlogin!==null){let r=this.#t.getItem(this.#n);r!==null&&r!==String(e.currentlogin)&&(this.#t.clear(),this.#t.setItem(this.#e,String(e.jsrev))),this.#t.setItem(this.#n,String(e.currentlogin))}}static hashString(t){let r=0;for(let s=0;s<t.length;s++)r=(r<<5)-r+t.charCodeAt(s),r|=0;return r}get(t){return this.#r?this.#t.getItem(this.#i(t)):null}set(t,r){if(!this.#r)return!1;try{this.#t.setItem(this.#i(t),r)}catch{return!1}return!0}clean(){this.#t.clear()}};export{i as default};
/**
 * Typed access to the Moodle page configuration (`M.cfg`).
 *
 * This module exposes the same `M.cfg` object that is injected into every Moodle page
 * by the server-side renderer, but with a full TypeScript interface so that consuming
 * modules get autocompletion and compile-time type safety.
 *
 * The default export is the live `M.cfg` object — mutations made by tests or other code
 * are immediately visible to every consumer.
 *
 * @module     core/config
 * @copyright  2015 Damyon Wiese <damyon@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      2.9
 */
/**
 * Wrap an instance of the browser's local or session storage to handle
 * cache expiry, key namespacing and other helpful things.
 *
 * @module     core/storagewrapper
 * @copyright  2017 Ryan Wyllie <ryan@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
