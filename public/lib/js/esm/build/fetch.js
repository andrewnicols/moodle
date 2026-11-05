import g from"@moodle/lms/core/config";import R from"@moodle/lms/core/pending";import{getGlobalAbortSignal as m}from"./abort";/**
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
 */class x{#e;#s;#t;#r;constructor(e){this.#e=e,this.#s=new Promise((t,s)=>{this.#t=t,this.#r=s})}get request(){return this.#e}get promise(){return this.#s}get reject(){return this.#r}handleResponse(e){e.ok?this.#t(e):this.#r(e.statusText)}}class l{#e=new Map;static#s=null;#t=null;#r=!1;#i=null;constructor(e=null){this.#i=e,this.#r=g.batchFetchRequests}static getBatcher(){return this.#s||(this.#s=new this(50)),this.#s}static async request(e,t,{cachekey:s=null,headers:r={},params:n={},body:i=null,method:o="GET"}={}){const u=new R(`Requesting ${e}/${t} with ${o}`),a=l.#a(l.#u(e),t,{headers:r,params:n,method:o,body:i,cachekey:s}),h=await fetch(a.request);return u.resolve(),a.handleResponse(h),a.promise}static performGet(e,t,{cachekey:s=null,headers:r={},params:n={}}={}){return this.request(e,t,{cachekey:s,headers:r,params:n,method:"GET"})}static performHead(e,t,{headers:s={},params:r={}}={}){return this.request(e,t,{headers:s,params:r,method:"HEAD"})}static performPost(e,t,{headers:s={},body:r}){return this.request(e,t,{headers:s,body:r,method:"POST"})}static performPut(e,t,{headers:s={},body:r}){return this.request(e,t,{headers:s,body:r,method:"PUT"})}static performPatch(e,t,{headers:s={},body:r}){return this.request(e,t,{headers:s,body:r,method:"PATCH"})}static performDelete(e,t,{headers:s={},params:r={},body:n=null}={}){return this.request(e,t,{headers:s,body:n,params:r,method:"DELETE"})}performGet(e,t,{cachekey:s=null,headers:r={},params:n={}}={}){return this.#n(e,t,{cachekey:s,headers:r,params:n,method:"GET"})}performHead(e,t,{headers:s={},params:r={}}={}){return this.#n(e,t,{headers:s,params:r,method:"HEAD"})}performPost(e,t,{headers:s={},body:r}){return this.#n(e,t,{headers:s,body:r,method:"POST"})}performPut(e,t,{headers:s={},body:r}){return this.#n(e,t,{headers:s,body:r,method:"PUT"})}performPatch(e,t,{headers:s={},body:r}){return this.#n(e,t,{headers:s,body:r,method:"PATCH"})}performDelete(e,t,{headers:s={},params:r={},body:n=null}={}){return this.#n(e,t,{headers:s,body:n,params:r,method:"DELETE"})}async execute(){this.#t!==null&&(clearTimeout(this.#t),this.#t=null);const e=this.#e;if(this.#e=new Map,e.size===0)return;const t=[...e.values()].reduce((r,n)=>r+n.size,0);if(t===1){const r=e.values().next().value;await this.#o(r);return}const s=new R(`core/fetch:execute:${t}`);for(const r of e.values())await this.#o(r);s.resolve()}async#o(e){if(e.size===1){const n=e.values().next().value,i=await fetch(n.request);n.handleResponse(i);return}const t=await fetch(await this.#c(e));if(!t.ok){e.forEach(n=>n.reject(t.statusText));return}const s=await this.#g(t),r=new Map;s.forEach(n=>{const i=this.#l(n),o=i.headers.get("Content-ID")??"";r.set(o,i)}),e.forEach((n,i)=>{r.has(i)?n.handleResponse(r.get(i)):n.reject(`Request failed. No response provided for request ${i} by provider`)})}static#u(e){return e.replace(/^core_/,"")}#n(e,t,{cachekey:s=null,headers:r={},params:n={},body:i=null,method:o="GET",id:u=null}){if(s&&s>1&&!g.batchApiAssetRequests){if(u)throw new Error("A request ID cannot be specified for a request which bypasses the batcher.");return l.request(e,t,{cachekey:s,headers:r,params:n,body:i,method:o})}[...this.#e.values()].reduce((f,q)=>f+q.size,0)>=20&&this.execute();const h=new Headers(r),p=h.has("Authorization")?`authorization:${h.get("Authorization")}`:"cookie";let c;if(u){if(this.#e.get(p)?.has(u))throw new Error(`Request with ID ${u} already exists.`);c=u}else do c=this.#p();while(this.#e.get(p)?.has(c));const d=l.#a(l.#u(e),t,{cachekey:s,headers:r,params:n,method:o,body:i});return this.#e.has(p)||this.#e.set(p,new Map),this.#e.get(p)?.set(c,d),this.#r?this.#i&&this.#h():this.execute(),d.promise}#h(){this.#t||(this.#t=setTimeout(()=>this.execute(),this.#i))}static#a(e,t,{cachekey:s=null,headers:r={},params:n={},body:i=null,method:o="GET"}){const u=["rest","v2"];s&&s>1&&u.push(`cachekey:${s}`),u.push(e,t);const a=new URL(`${g.apibase}/${u.join("/").replaceAll("//","/")}`),h={method:o,headers:{...r,Accept:"application/json","Content-Type":"application/json",pageparent:g.traceId||""},signal:m()};return Object.entries(n).forEach(([p,c])=>{a.searchParams.append(p,c)}),i&&(i instanceof FormData?h.body=i:typeof i=="object"?h.body=JSON.stringify(i):h.body=i),new x(new Request(a,h))}async#c(e){const t=this.#p(),s=(o=!1)=>`--${t}${o?"--":""}\r
`,r=()=>[s(),`Content-Type: application/http\r
\r
`],n=await Promise.all([...e.entries()].map(async([o,{request:u}])=>{const a=[];return a.push(...r()),a.push(`${u.method} ${u.url}\r
`),a.push(`Content-Type: ${u.headers.get("Content-Type")}\r
`),a.push(`Content-ID: ${o}\r
`),u.headers.forEach((h,p)=>{p.toLowerCase()!=="content-type"&&p.toLowerCase()!=="content-id"&&a.push(`${p}: ${h}\r
`)}),u.body&&(a.push(`\r
`),a.push(await u.text())),a.push(`\r
`),a})),i=[...[...e.values()].map(({request:o})=>`# Requesting ${o.method} ${o.url}\r
`),...n.map(o=>o.join("")),s(!0)];return new Request(`${g.apibase}/$batch`,{body:i.join(""),method:"POST",headers:{"Content-Type":`multipart/mixed;boundary=${t}`},signal:m()})}#l(e){const[,t,...s]=e.split(`\r
\r
`).map(p=>p.trim()),r=s.length?s.join(`\r
\r
`).trim():null,n=t.split(`\r
`),o=(n.shift()??"").match(/HTTP\/(?<protocol>[^ ]*) (?<status>\d{3}) (?<statusText>.*)$/),{status:u,statusText:a}=o?.groups??{status:void 0,statusText:void 0},h=n.filter(p=>p.includes(":")).map(p=>{const c=p.indexOf(":");return[p.slice(0,c).trim(),p.slice(c+1).trim()]});return new Response(r,{status:Number(u),statusText:a,headers:new Headers(h)})}async#g(e){const t=e.headers.get("Content-Type")??"";if(t.startsWith("multipart/mixed")){const[,s]=t.split(";").map(i=>i.trim()),r=s.replace("boundary=","").trim();return(await e.text()).split(new RegExp(`(?:--${r}(?:--)?(?:\r
)?)`,"gm")).filter(i=>!!i.length)}throw new Error(`Unknown response type '${t}'`)}#p(){let e=new Date().getTime();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,s=>{const r=(e+Math.random()*16)%16|0;return e=Math.floor(e/16),(s==="x"?r:r&3|8).toString(16)})}}export{l as default};
