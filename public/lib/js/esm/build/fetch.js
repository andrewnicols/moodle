import c from"@moodle/lms/core/config";import g from"@moodle/lms/core/pending";import{getGlobalAbortSignal as m}from"./abort";/**
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
 */class R{#e;#t;#s;#r;constructor(e){this.#e=e,this.#t=new Promise((s,t)=>{this.#s=s,this.#r=t})}get request(){return this.#e}get promise(){return this.#t}get reject(){return this.#r}handleResponse(e){e.ok?this.#s(e):this.#r(e.statusText)}}class h{#e=new Map;static#t=null;#s=null;#r=!1;#i=null;constructor(e=null){this.#i=e,this.#r=c.batchFetchRequests}static getBatcher(){return this.#t||(this.#t=new this(50)),this.#t}static async request(e,s,{cachekey:t=null,headers:r={},params:o={},body:n=null,method:i="GET"}={}){const a=new g(`Requesting ${e}/${s} with ${i}`),u=h.#u(h.#o(e),s,{headers:r,params:o,method:i,body:n,cachekey:t}),p=await fetch(u.request);return a.resolve(),u.handleResponse(p),u.promise}static performGet(e,s,{cachekey:t=null,headers:r={},params:o={}}={}){return this.request(e,s,{cachekey:t,headers:r,params:o,method:"GET"})}static performHead(e,s,{headers:t={},params:r={}}={}){return this.request(e,s,{headers:t,params:r,method:"HEAD"})}static performPost(e,s,{headers:t={},body:r}){return this.request(e,s,{headers:t,body:r,method:"POST"})}static performPut(e,s,{headers:t={},body:r}){return this.request(e,s,{headers:t,body:r,method:"PUT"})}static performPatch(e,s,{headers:t={},body:r}){return this.request(e,s,{headers:t,body:r,method:"PATCH"})}static performDelete(e,s,{headers:t={},params:r={},body:o=null}={}){return this.request(e,s,{headers:t,body:o,params:r,method:"DELETE"})}performGet(e,s,{cachekey:t=null,headers:r={},params:o={}}={}){return this.#n(e,s,{cachekey:t,headers:r,params:o,method:"GET"})}performHead(e,s,{headers:t={},params:r={}}={}){return this.#n(e,s,{headers:t,params:r,method:"HEAD"})}performPost(e,s,{headers:t={},body:r}){return this.#n(e,s,{headers:t,body:r,method:"POST"})}performPut(e,s,{headers:t={},body:r}){return this.#n(e,s,{headers:t,body:r,method:"PUT"})}performPatch(e,s,{headers:t={},body:r}){return this.#n(e,s,{headers:t,body:r,method:"PATCH"})}performDelete(e,s,{headers:t={},params:r={},body:o=null}={}){return this.#n(e,s,{headers:t,body:o,params:r,method:"DELETE"})}async execute(){const e=this.#e;if(this.#e=new Map,e.size===0)return;if(e.size===1){const n=e.values().next().value,i=await fetch(n.request);n.handleResponse(i);return}const s=new g(`core/fetch:execute:${e.size}`),t=await fetch(await this.#l(e));if(!t.ok){e.forEach(n=>n.reject(t.statusText)),s.resolve();return}const r=await this.#c(t),o=new Map;r.forEach(n=>{const i=this.#h(n),a=i.headers.get("Content-ID")??"";o.set(a,i)}),e.forEach((n,i)=>{o.has(i)?n.handleResponse(o.get(i)):n.reject(`Request failed. No response provided for request ${i} by provider`)}),s.resolve()}static#o(e){return e.replace(/^core_/,"")}#n(e,s,{cachekey:t=null,headers:r={},params:o={},body:n=null,method:i="GET",id:a=null}){if(t&&t>1&&!c.batchApiAssetRequests){if(a)throw new Error("A request ID cannot be specified for a request which bypasses the batcher.");return h.request(e,s,{cachekey:t,headers:r,params:o,body:n,method:i})}this.#e.size>=20&&this.execute();let u;if(a){if(this.#e.has(a))throw new Error(`Request with ID ${a} already exists.`);u=a}else do u=this.#a();while(this.#e.has(u));const p=h.#u(h.#o(e),s,{cachekey:t,headers:r,params:o,method:i,body:n});return this.#e.set(u,p),this.#r?this.#i&&this.#p():this.execute(),p.promise}#p(){this.#s&&clearTimeout(this.#s),this.#s=setTimeout(()=>this.execute(),this.#i)}static#u(e,s,{cachekey:t=null,headers:r={},params:o={},body:n=null,method:i="GET"}){const a=["rest","v2"];t&&t>1&&a.push(`cachekey:${t}`),a.push(e,s);const u=new URL(`${c.apibase}/${a.join("/").replaceAll("//","/")}`),p={method:i,headers:{...r,Accept:"application/json","Content-Type":"application/json",pageparent:c.traceId||""},signal:m()};return Object.entries(o).forEach(([l,d])=>{u.searchParams.append(l,d)}),n&&(n instanceof FormData?p.body=n:typeof n=="object"?p.body=JSON.stringify(n):p.body=n),new R(new Request(u,p))}async#l(e){const s=this.#a(),t=(i=!1)=>`--${s}${i?"--":""}\r
`,r=()=>[t(),`Content-Type: application/http\r
\r
`],o=await Promise.all([...e.entries()].map(async([i,{request:a}])=>{const u=[];return u.push(...r()),u.push(`${a.method} ${a.url}\r
`),u.push(`Content-Type: ${a.headers.get("Content-Type")}\r
`),u.push(`Content-ID: ${i}\r
`),a.body&&(u.push(`\r
`),u.push(await a.text())),u.push(`\r
`),u})),n=[...[...e.values()].map(({request:i})=>`# Requesting ${i.method} ${i.url}\r
`),...o.map(i=>i.join("")),t(!0)];return new Request(`${c.apibase}/$batch`,{body:n.join(""),method:"POST",headers:{"Content-Type":`multipart/mixed;boundary=${s}`},signal:m()})}#h(e){const[,s,...t]=e.split(`\r
\r
`).map(l=>l.trim()),r=t.length?t.join(`\r
\r
`).trim():null,o=s.split(`\r
`),i=(o.shift()??"").match(/HTTP\/(?<protocol>[^ ]*) (?<status>\d{3}) (?<statusText>.*)$/),{status:a,statusText:u}=i?.groups??{status:void 0,statusText:void 0},p=o.filter(l=>l.includes(":")).map(l=>{const d=l.indexOf(":");return[l.slice(0,d).trim(),l.slice(d+1).trim()]});return new Response(r,{status:Number(a),statusText:u,headers:new Headers(p)})}async#c(e){const s=e.headers.get("Content-Type")??"";if(s.startsWith("multipart/mixed")){const[,t]=s.split(";").map(n=>n.trim()),r=t.replace("boundary=","").trim();return(await e.text()).split(new RegExp(`(?:--${r}(?:--)?(?:\r
)?)`,"gm")).filter(n=>!!n.length)}throw new Error(`Unknown response type '${s}'`)}#a(){let e=new Date().getTime();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,t=>{const r=(e+Math.random()*16)%16|0;return e=Math.floor(e/16),(t==="x"?r:r&3|8).toString(16)})}}export{h as default};
