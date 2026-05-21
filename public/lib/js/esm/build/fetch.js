var q=Object.defineProperty;var R=(a,e)=>q(a,"name",{value:e,configurable:!0});import d from"@moodle/lms/core/config";import f from"@moodle/lms/core/pending";var g=class{static{R(this,"RequestWrapper")}#e;#s;#t;#r;constructor(e){this.#e=e,this.#s=new Promise((t,s)=>{this.#t=t,this.#r=s})}get request(){return this.#e}get promise(){return this.#s}handleResponse(e){e.ok?this.#t(e):this.#r(e.statusText)}},l=class a{static{R(this,"Fetch")}static async request(e,t,{cachekey:s=null,headers:r={},params:i={},body:n=null,method:c="GET"}={}){let p=new f(`Requesting ${e}/${t} with ${c}`),o=a.#s(a.#e(e),t,{headers:r,params:i,method:c,body:n,cachekey:s}),u=await fetch(o.request);return p.resolve(),o.handleResponse(u),o.promise}static performGet(e,t,{cachekey:s=null,headers:r={},params:i={}}={}){return this.request(e,t,{cachekey:s,headers:r,params:i,method:"GET"})}static performHead(e,t,{headers:s={},params:r={}}={}){return this.request(e,t,{headers:s,params:r,method:"HEAD"})}static performPost(e,t,{headers:s={},body:r}){return this.request(e,t,{headers:s,body:r,method:"POST"})}static performPut(e,t,{headers:s={},body:r}){return this.request(e,t,{headers:s,body:r,method:"PUT"})}static performPatch(e,t,{headers:s={},body:r}){return this.request(e,t,{headers:s,body:r,method:"PATCH"})}static performDelete(e,t,{headers:s={},params:r={},body:i=null}={}){return this.request(e,t,{headers:s,body:i,params:r,method:"DELETE"})}static#e(e){return e.replace(/^core_/,"")}static#s(e,t,{cachekey:s=null,headers:r={},params:i={},body:n=null,method:c="GET"}){let p=["rest","v2"];s&&s>1&&p.push(`cachekey:${s}`),p.push(e,t);let o=new URL(`${d.apibase}/${p.join("/").replaceAll("//","/")}`),u={method:c,headers:{...r,Accept:"application/json","Content-Type":"application/json",pageparent:d.traceId||""}};return Object.entries(i).forEach(([m,h])=>{o.searchParams.append(m,h)}),n&&(n instanceof FormData?u.body=n:typeof n=="object"?u.body=JSON.stringify(n):u.body=n),new g(new Request(o,u))}};export{l as default};
/**
 * The core/fetch module allows you to make web service requests to the Moodle REST API.
 *
 * @module     core/fetch
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @example <caption>Perform a single GET request</caption>
 * import Fetch from 'core/fetch';
 *
 * const result = Fetch.performGet('mod_example', 'animals', { params: { type: 'mammal' } });
 *
 * result.then((response) => {
 *    // Do something with the Response object.
 * })
 * .catch((error) => {
 *     // Handle the error
 * });
 */
//# sourceMappingURL=fetch.js.map
