var f=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var d=f((o,r)=>{(function(e,t){typeof o=="object"&&typeof r<"u"?r.exports=t():typeof define=="function"&&define.amd?define(t):(e=typeof globalThis<"u"?globalThis:e||self,e.Data=t())})(o,(function(){"use strict";let e=new Map;return{set(n,s,i){e.has(n)||e.set(n,new Map);let a=e.get(n);if(!a.has(s)&&a.size!==0){console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(a.keys())[0]}.`);return}a.set(s,i)},get(n,s){return e.has(n)&&e.get(n).get(s)||null},remove(n,s){if(!e.has(n))return;let i=e.get(n);i.delete(s),i.size===0&&e.delete(n)}}}))});export default d();
/*!
  * Bootstrap data.js v5.3.3 (https://getbootstrap.com/)
  * Copyright 2011-2024 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
