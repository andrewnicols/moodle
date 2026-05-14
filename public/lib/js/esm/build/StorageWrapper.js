import r from"./config.js";var n=class s{#t;#r;#i;#e;#s;constructor(t){this.#t=t,this.#r=this.#h();let e=`${r.wwwroot}/${r.jsrev}`;this.#i=`${s.hashString(e)}/`,this.#e=`${s.hashString(r.wwwroot)}/jsrev`,this.#s=`${s.hashString(r.wwwroot)}/currentlogin`,this.#o()}#h(){if(r.jsrev===-1||typeof this.#t>"u")return!1;let t="test";try{return this.#t===null?!1:(this.#t.setItem(t,"1"),this.#t.removeItem(t),!0)}catch{return!1}}#n(t){return this.#i+t}#o(){if(!this.#r)return;let t=this.#t.getItem(this.#e);if(t===null?this.#t.setItem(this.#e,String(r.jsrev)):String(r.jsrev)!==t&&(this.#t.clear(),this.#t.setItem(this.#e,String(r.jsrev))),r.currentlogin!==null){let e=this.#t.getItem(this.#s);e!==null&&e!==String(r.currentlogin)&&(this.#t.clear(),this.#t.setItem(this.#e,String(r.jsrev))),this.#t.setItem(this.#s,String(r.currentlogin))}}static hashString(t){let e=0;for(let i=0;i<t.length;i++)e=(e<<5)-e+t.charCodeAt(i),e|=0;return e}get(t){return this.#r?this.#t.getItem(this.#n(t)):null}set(t,e){if(!this.#r)return!1;try{this.#t.setItem(this.#n(t),e)}catch{return!1}return!0}clean(){this.#t.clear()}};export{n as default};
/**
 * Wrap an instance of the browser's local or session storage to handle
 * cache expiry, key namespacing and other helpful things.
 *
 * @module     core/storagewrapper
 * @copyright  2017 Ryan Wyllie <ryan@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=StorageWrapper.js.map
