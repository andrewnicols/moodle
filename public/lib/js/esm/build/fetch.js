import c from"@moodle/lms/core/config";import m from"@moodle/lms/core/pending";import{getGlobalAbortSignal as g}from"./abort";/**
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
 */class R{#e;#t;#s;#r;constructor(e){this.#e=e,this.#t=new Promise((s,t)=>{this.#s=s,this.#r=t})}get request(){return this.#e}get promise(){return this.#t}get reject(){return this.#r}handleResponse(e){e.ok?this.#s(e):this.#r(e.statusText)}}class l{#e=new Map;static#t=null;#s=null;#r=!1;#i=null;constructor(e=null){this.#i=e,this.#r=c.batchFetchRequests}static getBatcher(){return this.#t||(this.#t=new this(50)),this.#t}static async request(e,s,{cachekey:t=null,headers:r={},params:n={},body:i=null,method:u="GET"}={}){const a=new m(`Requesting ${e}/${s} with ${u}`),o=l.#u(l.#o(e),s,{headers:r,params:n,method:u,body:i,cachekey:t}),p=await fetch(o.request);return a.resolve(),o.handleResponse(p),o.promise}static performGet(e,s,{cachekey:t=null,headers:r={},params:n={}}={}){return this.request(e,s,{cachekey:t,headers:r,params:n,method:"GET"})}static performHead(e,s,{headers:t={},params:r={}}={}){return this.request(e,s,{headers:t,params:r,method:"HEAD"})}static performPost(e,s,{headers:t={},body:r}){return this.request(e,s,{headers:t,body:r,method:"POST"})}static performPut(e,s,{headers:t={},body:r}){return this.request(e,s,{headers:t,body:r,method:"PUT"})}static performPatch(e,s,{headers:t={},body:r}){return this.request(e,s,{headers:t,body:r,method:"PATCH"})}static performDelete(e,s,{headers:t={},params:r={},body:n=null}={}){return this.request(e,s,{headers:t,body:n,params:r,method:"DELETE"})}performGet(e,s,{cachekey:t=null,headers:r={},params:n={}}={}){return this.#n(e,s,{cachekey:t,headers:r,params:n,method:"GET"})}performHead(e,s,{headers:t={},params:r={}}={}){return this.#n(e,s,{headers:t,params:r,method:"HEAD"})}performPost(e,s,{headers:t={},body:r}){return this.#n(e,s,{headers:t,body:r,method:"POST"})}performPut(e,s,{headers:t={},body:r}){return this.#n(e,s,{headers:t,body:r,method:"PUT"})}performPatch(e,s,{headers:t={},body:r}){return this.#n(e,s,{headers:t,body:r,method:"PATCH"})}performDelete(e,s,{headers:t={},params:r={},body:n=null}={}){return this.#n(e,s,{headers:t,body:n,params:r,method:"DELETE"})}async execute(){const e=this.#e;if(this.#e=new Map,e.size===0)return;if(e.size===1){const n=e.values().next().value,i=await fetch(n.request);n.handleResponse(i);return}const s=await fetch(await this.#h(e));if(!s.ok){e.forEach(n=>n.reject(s.statusText));return}const t=await this.#c(s),r=new Map;t.forEach(n=>{const i=this.#l(n),u=i.headers.get("Content-ID")??"";r.set(u,i)}),e.forEach((n,i)=>{r.has(i)?n.handleResponse(r.get(i)):n.reject(`Request failed. No response provided for request ${i} by provider`)})}static#o(e){return e.replace(/^core_/,"")}#n(e,s,{cachekey:t=null,headers:r={},params:n={},body:i=null,method:u="GET",id:a=null}){if(t&&t>1&&!c.batchApiAssetRequests){if(a)throw new Error("A request ID cannot be specified for a request which bypasses the batcher.");return l.request(e,s,{cachekey:t,headers:r,params:n,body:i,method:u})}this.#e.size>20&&this.execute();let o;if(a){if(this.#e.has(a))throw new Error(`Request with ID ${a} already exists.`);o=a}else do o=this.#a();while(this.#e.has(o));const p=l.#u(l.#o(e),s,{cachekey:t,headers:r,params:n,method:u,body:i});return this.#e.set(o,p),this.#r?this.#i&&this.#p():this.execute(),p.promise}#p(){this.#s&&clearTimeout(this.#s),this.#s=setTimeout(()=>this.execute(),this.#i)}static#u(e,s,{cachekey:t=null,headers:r={},params:n={},body:i=null,method:u="GET"}){const a=["rest","v2"];t&&t>1&&a.push(`cachekey:${t}`),a.push(e,s);const o=new URL(`${c.apibase}/${a.join("/").replaceAll("//","/")}`),p={method:u,headers:{...r,Accept:"application/json","Content-Type":"application/json",pageparent:c.traceId||""},signal:g()};return Object.entries(n).forEach(([h,d])=>{o.searchParams.append(h,d)}),i&&(i instanceof FormData?p.body=i:typeof i=="object"?p.body=JSON.stringify(i):p.body=i),new R(new Request(o,p))}async#h(e){const s=this.#a(),t=(u=!1)=>`--${s}${u?"--":""}\r
`,r=()=>[t(),`Content-Type: application/http\r
\r
`],n=await Promise.all([...e.entries()].map(async([u,{request:a}])=>{const o=[];return o.push(...r()),o.push(`${a.method} ${a.url}\r
`),o.push(`Content-Type: ${a.headers.get("Content-Type")}\r
`),o.push(`Content-ID: ${u}\r
`),a.body&&(o.push(`\r
`),o.push(await a.text())),o.push(`\r
`),o})),i=[...[...e.values()].map(({request:u})=>`# Requesting ${u.method} ${u.url}\r
`),...n.map(u=>u.join("")),t(!0)];return new Request(`${c.apibase}/$batch`,{body:i.join(""),method:"POST",headers:{"Content-Type":`multipart/mixed;boundary=${s}`},signal:g()})}#l(e){const[,s,...t]=e.split(`\r
\r
`).map(h=>h.trim()),r=t.length?t.join(`\r
\r
`).trim():null,n=s.split(`\r
`),u=(n.shift()??"").match(/HTTP\/(?<protocol>[^ ]*) (?<status>\d{3}) (?<statusText>.*)$/),{status:a,statusText:o}=u?.groups??{status:void 0,statusText:void 0},p=n.filter(h=>h.includes(":")).map(h=>{const d=h.indexOf(":");return[h.slice(0,d).trim(),h.slice(d+1).trim()]});return new Response(r,{status:Number(a),statusText:o,headers:new Headers(p)})}async#c(e){const s=e.headers.get("Content-Type")??"";if(s.startsWith("multipart/mixed")){const[,t]=s.split(";").map(i=>i.trim()),r=t.replace("boundary=","").trim();return(await e.text()).split(new RegExp(`(?:--${r}(?:--)?(?:\r
)?)`,"gm")).filter(i=>!!i.length)}throw new Error(`Unknown response type '${s}'`)}#a(){let e=new Date().getTime();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,t=>{const r=(e+Math.random()*16)%16|0;return e=Math.floor(e/16),(t==="x"?r:r&3|8).toString(16)})}}export{l as default};
