import{Suspense as I,use as k}from"react";import{requireAsync as C}from"@moodle/lms/core/amd";var v=M.cfg,o=v,_=v.jsrev!==-1;var m=class r{#e;#r;#s;#t;#n;constructor(e){this.#e=e,this.#r=this.#o();let t=`${o.wwwroot}/${o.jsrev}`;this.#s=`${r.hashString(t)}/`,this.#t=`${r.hashString(o.wwwroot)}/jsrev`,this.#n=`${r.hashString(o.wwwroot)}/currentlogin`,this.#g()}#o(){if(o.jsrev===-1||typeof this.#e>"u")return!1;let e="test";try{return this.#e===null?!1:(this.#e.setItem(e,"1"),this.#e.removeItem(e),!0)}catch{return!1}}#i(e){return this.#s+e}#g(){if(!this.#r)return;let e=this.#e.getItem(this.#t);if(e===null?this.#e.setItem(this.#t,String(o.jsrev)):String(o.jsrev)!==e&&(this.#e.clear(),this.#e.setItem(this.#t,String(o.jsrev))),o.currentlogin!==null){let t=this.#e.getItem(this.#n);t!==null&&t!==String(o.currentlogin)&&(this.#e.clear(),this.#e.setItem(this.#t,String(o.jsrev))),this.#e.setItem(this.#n,String(o.currentlogin))}}static hashString(e){let t=0;for(let n=0;n<e.length;n++)t=(t<<5)-t+e.charCodeAt(n),t|=0;return t}get(e){return this.#r?this.#e.getItem(this.#i(e)):null}set(e,t){if(!this.#r)return!1;try{this.#e.setItem(this.#i(e),t)}catch{return!1}return!0}clean(){this.#e.clear()}};var b=new m(window.localStorage),y=r=>b.get(r),p=(r,e)=>b.set(r,e);import{Fragment as A,jsx as f}from"react/jsx-runtime";var c=new Map,h=new Map,x=(r,e,t)=>`core_str/${r}/${e}/${t}`,P=r=>{let e=new Array(r.length),t=[];for(let n=0;n<r.length;n++){let{key:i,component:s="core",param:l=null,lang:u=o.language}=r[n],g=x(i,s,u);if(M.str[s]?.[i]!==void 0){let a=Promise.resolve(M.util.get_string(i,s,l));c.set(g,a),e[n]=a;continue}let d=y(g);if(d!==null){M.str[s]||(M.str[s]={}),M.str[s][i]=d;let a=Promise.resolve(M.util.get_string(i,s,l));c.set(g,a),e[n]=a;continue}if(c.has(g)){e[n]=c.get(g).then(()=>M.util.get_string(i,s,l));continue}let S=new Promise((a,w)=>{t.push({request:{methodname:"core_get_string",args:{stringid:i,stringparams:[],component:s,lang:u}},resolve:a,reject:w})});c.set(g,S),e[n]=S.then(a=>(M.str[s]||(M.str[s]={}),M.str[s][i]=a,p(g,a),M.util.get_string(i,s,l)))}if(t.length>0){let n=t.map(i=>i.request);C("core/ajax").then(i=>(i.call(n,!0,!1,!1,0,o.langrev).forEach((l,u)=>{l.then(g=>t[u].resolve(g),g=>t[u].reject(g))}),i),i=>{t.forEach(s=>s.reject(i))})}return e},z=r=>Promise.all(P(r)),O=r=>{for(let{key:e,component:t="core",value:n,lang:i=o.language}of r){let s=x(e,t,i);M.str[t]||(M.str[t]={}),e in M.str[t]||(M.str[t][e]=n),p(s,n),c.has(s)||c.set(s,Promise.resolve(n))}},$=(r,e="core",t)=>{let n=`${e}::${r}::${JSON.stringify(t)}`;return h.has(n)||h.set(n,P([{key:r,component:e,param:t}])[0]),h.get(n)},V=()=>{h.clear(),c.clear()};function R({identifier:r,component:e,params:t}){return f(A,{children:k($(r,e,t))})}function q({children:r,identifier:e,component:t="core",params:n}){return f(I,{fallback:r??`${e}, ${t}`,children:f(R,{identifier:e,component:t,params:n})})}var B=q;export{O as cacheStrings,B as default,P as getRequestedStrings,$ as getString,z as getStrings,V as resetStringCache};
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
/**
 * Simple API for set/get to localStorage, with cacherev expiration.
 *
 * @module     core/localstorage
 * @copyright  2015 Damyon Wiese <damyon@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      2.9
 */
