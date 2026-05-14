import r from"./config.js";var i=class n{#t;#e;#s;#r;constructor(t){this.#t=t,this.#e=this.#n();let e=`${r.wwwroot}/${r.jsrev}`;this.#s=`${n.hashString(e)}/`,this.#r=`${n.hashString(r.wwwroot)}/jsrev`,this.#h()}#n(){if(r.jsrev===-1||typeof this.#t>"u")return!1;let t="test";try{return this.#t===null?!1:(this.#t.setItem(t,"1"),this.#t.removeItem(t),!0)}catch{return!1}}#i(t){return this.#s+t}#h(){if(!this.#e)return;let t=this.#t.getItem(this.#r);if(t===null){this.#t.setItem(this.#r,String(r.jsrev));return}String(r.jsrev)!==t&&(this.#t.clear(),this.#t.setItem(this.#r,String(r.jsrev)))}static hashString(t){let e=0;for(let s=0;s<t.length;s++)e=(e<<5)-e+t.charCodeAt(s),e|=0;return e}get(t){return this.#e?this.#t.getItem(this.#i(t)):null}set(t,e){if(!this.#e)return!1;try{this.#t.setItem(this.#i(t),e)}catch{return!1}return!0}clean(){this.#t.clear()}};export{i as default};
/**
 * Wrap an instance of the browser's local or session storage to handle
 * cache expiry, key namespacing and other helpful things.
 *
 * @module     core/storagewrapper
 * @copyright  2017 Ryan Wyllie <ryan@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=StorageWrapper.js.map
