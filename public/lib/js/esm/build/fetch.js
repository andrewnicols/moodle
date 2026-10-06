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
 */class R{#e;#t;#s;#r;constructor(e){this.#e=e,this.#t=new Promise((t,s)=>{this.#s=t,this.#r=s})}get request(){return this.#e}get promise(){return this.#t}get reject(){return this.#r}handleResponse(e){e.ok?this.#s(e):this.#r(e.statusText)}}class l{#e=new Map;static#t=null;#s=null;#r=!1;#i=null;constructor(e=null){this.#i=e,this.#r=c.batchFetchRequests}static getBatcher(){return this.#t||(this.#t=new this(50)),this.#t}static async request(e,t,{cachekey:s=null,headers:r={},params:n={},body:i=null,method:a="GET"}={}){const u=new m(`Requesting ${e}/${t} with ${a}`),o=l.#a(l.#o(e),t,{headers:r,params:n,method:a,body:i,cachekey:s}),p=await fetch(o.request);return u.resolve(),o.handleResponse(p),o.promise}static performGet(e,t,{cachekey:s=null,headers:r={},params:n={}}={}){return this.request(e,t,{cachekey:s,headers:r,params:n,method:"GET"})}static performHead(e,t,{headers:s={},params:r={}}={}){return this.request(e,t,{headers:s,params:r,method:"HEAD"})}static performPost(e,t,{headers:s={},body:r}){return this.request(e,t,{headers:s,body:r,method:"POST"})}static performPut(e,t,{headers:s={},body:r}){return this.request(e,t,{headers:s,body:r,method:"PUT"})}static performPatch(e,t,{headers:s={},body:r}){return this.request(e,t,{headers:s,body:r,method:"PATCH"})}static performDelete(e,t,{headers:s={},params:r={},body:n=null}={}){return this.request(e,t,{headers:s,body:n,params:r,method:"DELETE"})}performGet(e,t,{cachekey:s=null,headers:r={},params:n={}}={}){return this.#n(e,t,{cachekey:s,headers:r,params:n,method:"GET"})}performHead(e,t,{headers:s={},params:r={}}={}){return this.#n(e,t,{headers:s,params:r,method:"HEAD"})}performPost(e,t,{headers:s={},body:r}){return this.#n(e,t,{headers:s,body:r,method:"POST"})}performPut(e,t,{headers:s={},body:r}){return this.#n(e,t,{headers:s,body:r,method:"PUT"})}performPatch(e,t,{headers:s={},body:r}){return this.#n(e,t,{headers:s,body:r,method:"PATCH"})}performDelete(e,t,{headers:s={},params:r={},body:n=null}={}){return this.#n(e,t,{headers:s,body:n,params:r,method:"DELETE"})}async execute(){const e=this.#e;if(this.#e=new Map,e.size===0)return;if(e.size===1){const n=e.values().next().value,i=await fetch(n.request);n.handleResponse(i);return}const t=await fetch(await this.#h(e));if(!t.ok){e.forEach(n=>n.reject(t.statusText));return}const s=await this.#c(t),r=new Map;s.forEach(n=>{const i=this.#l(n),a=i.headers.get("Content-ID")??"";r.set(a,i)}),e.forEach((n,i)=>{r.has(i)?n.handleResponse(r.get(i)):n.reject(`Request failed. No response provided for request ${i} by provider`)})}static#o(e){return e.replace(/^core_/,"")}#n(e,t,{cachekey:s=null,headers:r={},params:n={},body:i=null,method:a="GET",id:u=null}){this.#e.size>20&&this.execute();let o;if(u){if(this.#e.has(u))throw new Error(`Request with ID ${u} already exists.`);o=u}else do o=this.#u();while(this.#e.has(o));const p=l.#a(l.#o(e),t,{cachekey:s,headers:r,params:n,method:a,body:i});return this.#e.set(o,p),this.#r?this.#i&&this.#p():this.execute(),p.promise}#p(){this.#s&&clearTimeout(this.#s),this.#s=setTimeout(()=>this.execute(),this.#i)}static#a(e,t,{cachekey:s=null,headers:r={},params:n={},body:i=null,method:a="GET"}){const u=["rest","v2"];s&&s>1&&u.push(`cachekey:${s}`),u.push(e,t);const o=new URL(`${c.apibase}/${u.join("/").replaceAll("//","/")}`),p={method:a,headers:{...r,Accept:"application/json","Content-Type":"application/json",pageparent:c.traceId||""},signal:g()};return Object.entries(n).forEach(([h,d])=>{o.searchParams.append(h,d)}),i&&(i instanceof FormData?p.body=i:typeof i=="object"?p.body=JSON.stringify(i):p.body=i),new R(new Request(o,p))}async#h(e){const t=this.#u(),s=(a=!1)=>`--${t}${a?"--":""}
`,r=()=>[s(),`Content-Type: application/http

`],n=await Promise.all([...e.entries()].map(async([a,{request:u}])=>{const o=[];return o.push(...r()),o.push(`${u.method} ${u.url}
`),o.push(`Content-Type: ${u.headers.get("Content-Type")}
`),o.push(`Content-ID: ${a}
`),u.body&&(o.push(`
`),o.push(await u.text())),o.push(`
`),o})),i=[...[...e.values()].map(({request:a})=>`# Requesting ${a.method} ${a.url}
`),...n.map(a=>a.join("")),s(!0)];return new Request(`${c.apibase}/$batch`,{body:i.join(""),method:"POST",headers:{"Content-Type":`multipart/mixed;boundary=${t}`},signal:g()})}#l(e){const[,t,...s]=e.split(`

`).map(h=>h.trim()),r=s.length?s.join(`

`).trim():null,n=t.split(`
`),a=(n.shift()??"").match(/HTTP\/(?<protocol>[^ ]*) (?<status>\d{3}) (?<statusText>.*)$/),{status:u,statusText:o}=a?.groups??{status:void 0,statusText:void 0},p=n.filter(h=>h.length>0).map(h=>h.split(":",2).map(d=>d.trim()));return new Response(r,{status:Number(u),statusText:o,headers:new Headers(p)})}async#c(e){const t=e.headers.get("Content-Type")??"";if(t.startsWith("multipart/mixed")){const[,s]=t.split(";").map(i=>i.trim()),r=s.replace("boundary=","").trim();return(await e.text()).split(new RegExp(`(?:--${r}(?:--)?
?)`,"gm")).filter(i=>!!i.length)}else if(t==="application/json")return await e.json();throw new Error(`Unknown response type '${t}'`)}#u(){let e=new Date().getTime();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,s=>{const r=(e+Math.random()*16)%16|0;return e=Math.floor(e/16),(s==="x"?r:r&3|8).toString(16)})}}export{l as default};
