import{getGlobalAbortSignal as q}from"./abort";import m from"@moodle/lms/core/config";import y from"@moodle/lms/core/pending";/**
 * The core/fetch module allows you to make web service requests to the Moodle REST API.
 *
 * Most methods are available both statically and via an instance method, for example
 * `Fetch.performGet()` and `(new Fetch()).performGet()`.
 *
 * The static perform methods perform immediate individual requests, whilst instance
 * methods are useful for batching requests.
 *
 * By default a Fetch instance will not automatically execute the batch, but it can be configured to do so
 * by passing a value for the `autoBatchTimeout` parameter.
 *
 * The batcher can be executed manually by calling the {@link Fetch#execute} method.
 *
 * Note: In cases where the batcher is executed with a single request the batch endpoint is _not_ used.
 *
 * A helper method, {@link Fetch.getBatcher}, exists to fetch a singleton instance of the class.
 * This singleton is configured to automatically execute batch requests.
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
 *
 * @example <caption>Perform a series of requests, automatically batching them</caption>
 * import Fetch from 'core/fetch';
 *
 * // Execute a single request containing three sub requests.
 * const batcher = Fetch.getBatcher();
 * const actions = await Promise.all([
 *     batcher.performGet('mod_example', 'animals', { params: { type: 'mammal' } }),
 *     batcher.performGet('mod_example', 'animals', { params: { type: 'reptile' } }),
 *     batcher.performDelete('mod_example', `animals/${pig.id}`),
 * ]);
 *
 * @example <caption>Perform a series of GET requests, manually batching them</caption>
 * import Fetch from 'core/fetch';
 *
 * const batcher = new Fetch();
 * const actions = Promise.all([
 *     batcher.performGet('mod_example', 'animals', { params: { type: 'mammal' } }),
 *     batcher.performGet('mod_example', 'animals', { params: { type: 'reptile' } }),
 *     batcher.performDelete('mod_example', `animals/${pig.id}`),
 * ]);
 *
 * batcher.execute();
 *
 * await actions;
 */class w{#s;#e;#t;#r;constructor(e){this.#s=e,this.#e=new Promise((t,s)=>{this.#t=t,this.#r=s})}get request(){return this.#s}get promise(){return this.#e}get reject(){return this.#r}handleResponse(e){e.ok?this.#t(e):this.#r(e)}}class g{static#s=null;static getBatcher(){return this.#s||(this.#s=new this(50)),this.#s}#e=new Map;#t=null;#r;#o;static async request(e,t,{cachekey:s=null,headers:r={},params:n={},body:o=null,method:a="GET"}={}){const l=new y(`Requesting ${e}/${t} with ${a}`),u=g.#a(g.#u(e),t,{headers:r,params:n,method:a,body:o,cachekey:s}),i=await fetch(u.request);return l.resolve(),u.handleResponse(i),u.promise}static async performGet(e,t,{cachekey:s=null,headers:r={},params:n={}}={}){return this.request(e,t,{cachekey:s,headers:r,params:n,method:"GET"})}static async performHead(e,t,{headers:s={},params:r={}}={}){return this.request(e,t,{headers:s,params:r,method:"HEAD"})}static async performPost(e,t,{headers:s={},body:r}){return this.request(e,t,{headers:s,body:r,method:"POST"})}static async performPut(e,t,{headers:s={},body:r}){return this.request(e,t,{headers:s,body:r,method:"PUT"})}static async performPatch(e,t,{headers:s={},body:r}){return this.request(e,t,{headers:s,body:r,method:"PATCH"})}static async performDelete(e,t,{headers:s={},params:r={},body:n=null}={}){return this.request(e,t,{headers:s,body:n,params:r,method:"DELETE"})}constructor(e=null){this.#o=e,this.#r=m.batchFetchRequests}async performGet(e,t,{cachekey:s=null,headers:r={},params:n={}}={}){return this.#n(e,t,{cachekey:s,headers:r,params:n,method:"GET"})}async performHead(e,t,{headers:s={},params:r={}}={}){return this.#n(e,t,{headers:s,params:r,method:"HEAD"})}async performPost(e,t,{headers:s={},body:r}){return this.#n(e,t,{headers:s,body:r,method:"POST"})}async performPut(e,t,{headers:s={},body:r}){return this.#n(e,t,{headers:s,body:r,method:"PUT"})}async performPatch(e,t,{headers:s={},body:r}){return this.#n(e,t,{headers:s,body:r,method:"PATCH"})}async performDelete(e,t,{headers:s={},params:r={},body:n=null}={}){return this.#n(e,t,{headers:s,body:n,params:r,method:"DELETE"})}async execute(){this.#t!==null&&(clearTimeout(this.#t),this.#t=null);const e=this.#e;if(this.#e=new Map,e.size===0)return;let t=0;for(const r of e.values())t+=r.size;if(t===1){const r=e.values().next().value;await this.#i(r);return}const s=new y(`core/fetch:execute:${t}`);for(const r of e.values())await this.#i(r);s.resolve()}async#i(e){if(e.size===1){const n=e.values().next().value,o=await fetch(n.request);n.handleResponse(o);return}const t=await fetch(await this.#d(e));if(!t.ok){for(const n of e.values())n.reject(t);return}const s=await this.#g(t),r=new Map;for(const n of s){const{id:o,response:a}=this.#h(n);r.set(o,a)}for(const[n,o]of e)r.has(n)?o.handleResponse(r.get(n)):o.reject(new Response(null,{status:502,statusText:`No response provided for request ${n} by provider`}))}static#u(e){return e.replace(/^core_/u,"")}#l(e,t){if(t===null){let s;do s=this.#p();while(this.#e.get(e)?.has(s));return s}if(this.#e.get(e)?.has(t))throw new Error(`Request with ID ${t} already exists.`);return t}async#n(e,t,{cachekey:s=null,headers:r={},params:n={},body:o=null,method:a="GET",id:l=null}){if(s!==null&&s>1&&!m.batchApiAssetRequests){if(l!==null)throw new Error("A request ID cannot be specified for a request which bypasses the batcher.");return g.request(e,t,{cachekey:s,headers:r,params:n,body:o,method:a})}let u=0;for(const d of this.#e.values())u+=d.size;u>=20&&this.execute();const i=new Headers(r),p=i.has("Authorization")?`authorization:${i.get("Authorization")}`:"cookie",c=this.#l(p,l),R=g.#a(g.#u(e),t,{cachekey:s,headers:r,params:n,method:a,body:o});return this.#e.has(p)||this.#e.set(p,new Map),this.#e.get(p)?.set(c,R),this.#r?this.#o!==null&&this.#c():this.execute(),R.promise}#c(){const e=this.#o;e!==null&&(this.#t||(this.#t=setTimeout(()=>{this.execute()},e)))}static#a(e,t,{cachekey:s=null,headers:r={},params:n={},body:o=null,method:a="GET"}){const l=["rest","v2"];s!==null&&s>1&&l.push(`cachekey:${s}`),l.push(e,t);const u=new URL(`${m.apibase}/${l.join("/").replaceAll("//","/")}`),i={method:a,headers:{...r,Accept:"application/json","Content-Type":"application/json",pageparent:m.traceId??""},signal:q()};for(const[p,c]of Object.entries(n))u.searchParams.append(p,c);return o!==null&&(o instanceof FormData?i.body=o:typeof o=="object"?i.body=JSON.stringify(o):i.body=o),new w(new Request(u,i))}async#d(e){const t=this.#p(),s=(i=!1)=>`--${t}${i?"--":""}\r
`,r=i=>[s(),`Content-Type: application/http\r
`,`Content-ID: ${i}\r
\r
`],n=await Promise.all([...e].map(async([i,{request:p}])=>{const c=[...r(i),`${p.method} ${p.url} HTTP/1.1\r
`];return p.headers.forEach((R,d)=>{d.toLowerCase()!=="authorization"&&d.toLowerCase()!=="content-id"&&c.push(`${d}: ${R}\r
`)}),p.body!==null?[...c,`\r
`,await p.text(),`\r
`]:[...c,`\r
\r
`]})),o=[];for(const{request:i}of e.values())o.push(`# Requesting ${i.method} ${i.url}\r
`);const a=[...o,...n.map(i=>i.join("")),s(!0)],l=new Headers({"Content-Type":`multipart/mixed;boundary=${t}`,Prefer:"odata.continue-on-error"}),u=e.values().next().value?.request.headers.get("Authorization");return u!=null&&l.set("Authorization",u),new Request(`${m.apibase}/$batch`,{body:a.join(""),method:"POST",headers:l,signal:q()})}#h(e){const t=e.indexOf(`\r
\r
`),s=e.slice(0,t),r=e.slice(t+4),n=r.indexOf(`\r
\r
`),o=r.slice(0,n),a=r.slice(n+4).replace(/\r\n$/u,""),l=a===""?null:a,u=s.split(`\r
`).find(h=>/^content-id:/iu.test(h))?.slice(11).trim()??"",i=o.split(`\r
`),p=i.shift()??"",R=/HTTP\/(?<protocol>[^ ]*) (?<status>\d{3}) (?<statusText>.*)$/u.exec(p),{status:d,statusText:x}=R?.groups??{status:void 0,statusText:void 0},P=i.filter(h=>h.includes(":")).map(h=>{const f=h.indexOf(":");return[h.slice(0,f).trim(),h.slice(f+1).trim()]});return{id:u,response:new Response(l,{status:Number(d),statusText:x,headers:new Headers(P)})}}async#g(e){const t=e.headers.get("Content-Type")??"";if(t.startsWith("multipart/mixed")){const[,s]=t.split(";").map(o=>o.trim()),r=s.replace("boundary=","").trim();return(await e.text()).split(new RegExp(`(?:--${r}(?:--)?(?:\r
)?)`,"gmu")).filter(o=>o.length>0)}throw new Error(`Unknown response type '${t}'`)}#p(){if(typeof crypto<"u"&&typeof crypto.randomUUID=="function")return crypto.randomUUID();let e=Date.now();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replaceAll(/[xy]/gu,s=>{const r=Math.trunc((e+Math.random()*16)%16);return e=Math.floor(e/16),(s==="x"?r:r%4+8).toString(16)})}}export{g as default};
