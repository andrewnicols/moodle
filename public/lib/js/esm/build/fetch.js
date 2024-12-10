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
 */class x{#e;#t;#s;#r;constructor(e){this.#e=e,this.#t=new Promise((t,s)=>{this.#s=t,this.#r=s})}get request(){return this.#e}get promise(){return this.#t}get reject(){return this.#r}handleResponse(e){e.ok?this.#s(e):this.#r(e.statusText)}}class l{#e=new Map;static#t=null;#s=null;#r=!1;#i=null;constructor(e=null){this.#i=e,this.#r=g.batchFetchRequests}static getBatcher(){return this.#t||(this.#t=new this(50)),this.#t}static async request(e,t,{cachekey:s=null,headers:r={},params:n={},body:i=null,method:o="GET"}={}){const a=new R(`Requesting ${e}/${t} with ${o}`),u=l.#u(l.#a(e),t,{headers:r,params:n,method:o,body:i,cachekey:s}),c=await fetch(u.request);return a.resolve(),u.handleResponse(c),u.promise}static performGet(e,t,{cachekey:s=null,headers:r={},params:n={}}={}){return this.request(e,t,{cachekey:s,headers:r,params:n,method:"GET"})}static performHead(e,t,{headers:s={},params:r={}}={}){return this.request(e,t,{headers:s,params:r,method:"HEAD"})}static performPost(e,t,{headers:s={},body:r}){return this.request(e,t,{headers:s,body:r,method:"POST"})}static performPut(e,t,{headers:s={},body:r}){return this.request(e,t,{headers:s,body:r,method:"PUT"})}static performPatch(e,t,{headers:s={},body:r}){return this.request(e,t,{headers:s,body:r,method:"PATCH"})}static performDelete(e,t,{headers:s={},params:r={},body:n=null}={}){return this.request(e,t,{headers:s,body:n,params:r,method:"DELETE"})}performGet(e,t,{cachekey:s=null,headers:r={},params:n={}}={}){return this.#n(e,t,{cachekey:s,headers:r,params:n,method:"GET"})}performHead(e,t,{headers:s={},params:r={}}={}){return this.#n(e,t,{headers:s,params:r,method:"HEAD"})}performPost(e,t,{headers:s={},body:r}){return this.#n(e,t,{headers:s,body:r,method:"POST"})}performPut(e,t,{headers:s={},body:r}){return this.#n(e,t,{headers:s,body:r,method:"PUT"})}performPatch(e,t,{headers:s={},body:r}){return this.#n(e,t,{headers:s,body:r,method:"PATCH"})}performDelete(e,t,{headers:s={},params:r={},body:n=null}={}){return this.#n(e,t,{headers:s,body:n,params:r,method:"DELETE"})}async execute(){const e=this.#e;if(this.#e=new Map,e.size===0)return;const t=[...e.values()].reduce((r,n)=>r+n.size,0);if(t===1){const r=e.values().next().value;await this.#o(r);return}const s=new R(`core/fetch:execute:${t}`);for(const r of e.values())await this.#o(r);s.resolve()}async#o(e){if(e.size===1){const n=e.values().next().value,i=await fetch(n.request);n.handleResponse(i);return}const t=await fetch(await this.#h(e));if(!t.ok){e.forEach(n=>n.reject(t.statusText));return}const s=await this.#g(t),r=new Map;s.forEach(n=>{const i=this.#l(n),o=i.headers.get("Content-ID")??"";r.set(o,i)}),e.forEach((n,i)=>{r.has(i)?n.handleResponse(r.get(i)):n.reject(`Request failed. No response provided for request ${i} by provider`)})}static#a(e){return e.replace(/^core_/,"")}#n(e,t,{cachekey:s=null,headers:r={},params:n={},body:i=null,method:o="GET",id:a=null}){if(s&&s>1&&!g.batchApiAssetRequests){if(a)throw new Error("A request ID cannot be specified for a request which bypasses the batcher.");return l.request(e,t,{cachekey:s,headers:r,params:n,body:i,method:o})}[...this.#e.values()].reduce((f,q)=>f+q.size,0)>=20&&this.execute();const c=new Headers(r),p=c.has("Authorization")?`authorization:${c.get("Authorization")}`:"cookie";let h;if(a){if(this.#e.get(p)?.has(a))throw new Error(`Request with ID ${a} already exists.`);h=a}else do h=this.#p();while(this.#e.get(p)?.has(h));const d=l.#u(l.#a(e),t,{cachekey:s,headers:r,params:n,method:o,body:i});return this.#e.has(p)||this.#e.set(p,new Map),this.#e.get(p)?.set(h,d),this.#r?this.#i&&this.#c():this.execute(),d.promise}#c(){this.#s&&clearTimeout(this.#s),this.#s=setTimeout(()=>this.execute(),this.#i)}static#u(e,t,{cachekey:s=null,headers:r={},params:n={},body:i=null,method:o="GET"}){const a=["rest","v2"];s&&s>1&&a.push(`cachekey:${s}`),a.push(e,t);const u=new URL(`${g.apibase}/${a.join("/").replaceAll("//","/")}`),c={method:o,headers:{...r,Accept:"application/json","Content-Type":"application/json",pageparent:g.traceId||""},signal:m()};return Object.entries(n).forEach(([p,h])=>{u.searchParams.append(p,h)}),i&&(i instanceof FormData?c.body=i:typeof i=="object"?c.body=JSON.stringify(i):c.body=i),new x(new Request(u,c))}async#h(e){const t=this.#p(),s=(o=!1)=>`--${t}${o?"--":""}\r
`,r=()=>[s(),`Content-Type: application/http\r
\r
`],n=await Promise.all([...e.entries()].map(async([o,{request:a}])=>{const u=[];return u.push(...r()),u.push(`${a.method} ${a.url}\r
`),u.push(`Content-Type: ${a.headers.get("Content-Type")}\r
`),u.push(`Content-ID: ${o}\r
`),a.headers.forEach((c,p)=>{p.toLowerCase()!=="content-type"&&p.toLowerCase()!=="content-id"&&u.push(`${p}: ${c}\r
`)}),a.body&&(u.push(`\r
`),u.push(await a.text())),u.push(`\r
`),u})),i=[...[...e.values()].map(({request:o})=>`# Requesting ${o.method} ${o.url}\r
`),...n.map(o=>o.join("")),s(!0)];return new Request(`${g.apibase}/$batch`,{body:i.join(""),method:"POST",headers:{"Content-Type":`multipart/mixed;boundary=${t}`},signal:m()})}#l(e){const[,t,...s]=e.split(`\r
\r
`).map(p=>p.trim()),r=s.length?s.join(`\r
\r
`).trim():null,n=t.split(`\r
`),o=(n.shift()??"").match(/HTTP\/(?<protocol>[^ ]*) (?<status>\d{3}) (?<statusText>.*)$/),{status:a,statusText:u}=o?.groups??{status:void 0,statusText:void 0},c=n.filter(p=>p.includes(":")).map(p=>{const h=p.indexOf(":");return[p.slice(0,h).trim(),p.slice(h+1).trim()]});return new Response(r,{status:Number(a),statusText:u,headers:new Headers(c)})}async#g(e){const t=e.headers.get("Content-Type")??"";if(t.startsWith("multipart/mixed")){const[,s]=t.split(";").map(i=>i.trim()),r=s.replace("boundary=","").trim();return(await e.text()).split(new RegExp(`(?:--${r}(?:--)?(?:\r
)?)`,"gm")).filter(i=>!!i.length)}throw new Error(`Unknown response type '${t}'`)}#p(){let e=new Date().getTime();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,s=>{const r=(e+Math.random()*16)%16|0;return e=Math.floor(e/16),(s==="x"?r:r&3|8).toString(16)})}}export{l as default};
