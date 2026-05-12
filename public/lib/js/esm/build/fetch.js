import d from"@moodle/lms/core/config";import f from"@moodle/lms/core/pending";var g=class{#e;#t;#s;#r;constructor(e){this.#e=e,this.#t=new Promise((t,s)=>{this.#s=t,this.#r=s})}get request(){return this.#e}get promise(){return this.#t}get reject(){return this.#r}handleResponse(e){e.ok?this.#s(e):this.#r(e.statusText)}},p=class h{#e=new Map;static#t=null;#s=null;#r=!1;#i=null;constructor(e=null){this.#i=e,this.#r=!!d.batchFetchRequests}static getBatcher(){return this.#t||(this.#t=new this(50)),this.#t}static async request(e,t,{cachekey:s=null,headers:r={},params:n={},body:i=null,method:o="GET"}={}){let u=new f(`Requesting ${e}/${t} with ${o}`),a=h.#a(h.#o(e),t,{headers:r,params:n,method:o,body:i,cachekey:s}),c=await fetch(a.request);return u.resolve(),a.handleResponse(c),a.promise}static performGet(e,t,{cachekey:s=null,headers:r={},params:n={}}={}){return this.request(e,t,{cachekey:s,headers:r,params:n,method:"GET"})}static performHead(e,t,{headers:s={},params:r={}}={}){return this.request(e,t,{headers:s,params:r,method:"HEAD"})}static performPost(e,t,{headers:s={},body:r}){return this.request(e,t,{headers:s,body:r,method:"POST"})}static performPut(e,t,{headers:s={},body:r}){return this.request(e,t,{headers:s,body:r,method:"PUT"})}static performPatch(e,t,{headers:s={},body:r}){return this.request(e,t,{headers:s,body:r,method:"PATCH"})}static performDelete(e,t,{headers:s={},params:r={},body:n=null}={}){return this.request(e,t,{headers:s,body:n,params:r,method:"DELETE"})}performGet(e,t,{cachekey:s=null,headers:r={},params:n={}}={}){return this.#n(e,t,{cachekey:s,headers:r,params:n,method:"GET"})}performHead(e,t,{headers:s={},params:r={}}={}){return this.#n(e,t,{headers:s,params:r,method:"HEAD"})}performPost(e,t,{headers:s={},body:r}){return this.#n(e,t,{headers:s,body:r,method:"POST"})}performPut(e,t,{headers:s={},body:r}){return this.#n(e,t,{headers:s,body:r,method:"PUT"})}performPatch(e,t,{headers:s={},body:r}){return this.#n(e,t,{headers:s,body:r,method:"PATCH"})}performDelete(e,t,{headers:s={},params:r={},body:n=null}={}){return this.#n(e,t,{headers:s,body:n,params:r,method:"DELETE"})}async execute(){let e=this.#e;if(this.#e=new Map,e.size===0)return;if(e.size===1){let n=e.values().next().value,i=await fetch(n.request);n.handleResponse(i);return}let t=await fetch(await this.#c(e));if(!t.ok){e.forEach(n=>n.reject(t.statusText));return}let s=await this.#l(t),r=new Map;s.forEach(n=>{let i=this.#h(n),o=i.headers.get("Content-ID");o&&r.set(o,i)}),e.forEach((n,i)=>{r.has(i)?n.handleResponse(r.get(i)):n.reject(`Request failed. No response provided for request ${i} by provider`)})}static#o(e){return e.replace(/^core_/,"")}#n(e,t,{headers:s={},params:r={},body:n=null,method:i="GET",cachekey:o=null}={}){this.#e.size>20&&this.execute();let u;do u=h.#u();while(this.#e.has(u));let a=h.#a(h.#o(e),t,{headers:s,params:r,method:i,body:n,cachekey:o});return this.#e.set(u,a),this.#r?this.#i&&this.#p():this.execute(),a.promise}#p(){this.#s&&clearTimeout(this.#s),this.#s=setTimeout(()=>this.execute(),this.#i)}static#a(e,t,{cachekey:s=null,headers:r={},params:n={},body:i=null,method:o="GET"}){let u=["rest","v2"];s&&s>1&&u.push(`cachekey:${s}`),u.push(e,t);let a=new URL(`${d.apibase}/${u.join("/").replaceAll("//","/")}`),c={method:o,headers:{...r,Accept:"application/json","Content-Type":"application/json"}};return Object.entries(n).forEach(([l,m])=>{a.searchParams.append(l,m)}),i&&(i instanceof FormData?c.body=i:typeof i=="object"?c.body=JSON.stringify(i):c.body=i),new g(new Request(a,c))}async#c(e){let t=h.#u(),s=o=>`--${t}${o?"--":""}
`,r=()=>[s(!1),`Content-Type: application/http

`],n=await Promise.all(Array.from(e.entries()).map(async([o,{request:u}])=>{let a=[];return a.push(...r()),a.push(`${u.method} ${u.url}
`),a.push(`Content-Type: ${u.headers.get("Content-Type")}
`),a.push(`Content-ID: ${o}
`),u.body&&(a.push(`
`),a.push(await u.text())),a.push(`
`),a})),i=[...Array.from(e.values()).map(o=>`# Requesting ${o.request.method} ${o.request.url}
`),...n.map(o=>o.join("")),s(!0)];return new Request(`${d.apibase}/$batch`,{body:i.join(""),method:"POST",headers:{"Content-Type":`multipart/mixed;boundary=${t}`}})}#h(e){let t=e.split(`

`).map(l=>l.trim());t.shift(),t.pop(),t.push(null);let[s,r]=t,n=s.split(`
`),o=n.shift().match(/HTTP\/(?<protocol>[^ ]*) (?<status>\d{3}) (?<statusText>.*)$/),u=Number(o?.groups?.status??500),a=o?.groups?.statusText??"Internal Server Error",c=n.map(l=>{let[m,...R]=l.split(":");return[m.trim(),R.join(":").trim()]});return new Response(r,{status:u,statusText:a,headers:new Headers(c)})}async#l(e){let t=e.headers.get("Content-Type")??"";if(t.startsWith("multipart/mixed")){let[,s]=t.split(";").map(i=>i.trim()),r=s.replace("boundary=","").trim();return(await e.text()).split(new RegExp(`(?:--${r}(?:--)?
?)`,"gm")).filter(i=>!!i.length)}else if(t==="application/json")return e.json();throw new Error(`Unknown response type '${t}'`)}static#u(){let e=new Date().getTime();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,t=>{let s=(e+Math.random()*16)%16|0;return e=Math.floor(e/16),(t==="x"?s:s&3|8).toString(16)})}},P=p.request.bind(p),y=p.performGet.bind(p),T=p.performHead.bind(p),b=p.performPost.bind(p),w=p.performPut.bind(p),O=p.performPatch.bind(p),E=p.performDelete.bind(p);export{p as default,E as performDelete,y as performGet,T as performHead,O as performPatch,b as performPost,w as performPut,P as request};
/**
 * The core/fetch module allows you to make web service requests to the Moodle REST API.
 *
 * Most methods are available both statically and via an instance method, for example
 * `Fetch.performGet()` and `(new Fetch()).performGet()`.
 *
 * The static perform methods perform immediate individual requests, whilst instance
 * methods are useful for batching requests.
 *
 * By default the Fetch instance will not automatically execute the batch, but it can be configured to do so
 * by passing a value for the `autoBatchTimeout` parameter.
 *
 * The batcher can be executed manually by calling the {@link Fetch.execute} method.
 *
 * Note: In cases where the batcher is executed with a single request the batch endpoint is _not_ used.
 *
 * A helper method, {@link Fetch.getBatcher}, exists to fetch a singleton instance
 * of the class. This singleton is configured to automatically execute batch requests.
 *
 * @module     core/fetch
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
