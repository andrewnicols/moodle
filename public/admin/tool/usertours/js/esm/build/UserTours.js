var C=Object.defineProperty;var l=(n,e)=>C(n,"name",{value:e,configurable:!0});import{useState as i,useEffect as c}from"react";import{getString as E}from"@moodle/lms/core/String";import M from"./TourComponent.js";import{fetchTour as p,resetTourState as L}from"./useTourApi.js";import{loadFilterModules as y}from"./loadFilters.js";import{Fragment as S,jsxDEV as a}from"react/jsx-dev-runtime";function F(n,e){return e.length===0?n[0]??null:n.find(r=>e.some(t=>t&&t.filterMatches?t.filterMatches(r):!0))??null}l(F,"findMatchingTour");function v(){return document.querySelector(".tool_usertours-resettourcontainer")??document.querySelector(".logininfo")??document.querySelector("footer")??document.body}l(v,"getResetContainer");var I=l(({onClick:n})=>(c(()=>{let e=v(),r=document.createElement("div");r.className="usertour";let t=document.createElement("a");return t.id="resetpagetour",t.href="#",r.appendChild(t),e.appendChild(r),E("resettouronpage","tool_usertours").then(u=>{t.textContent=u}),()=>{r.remove()}},[]),c(()=>{let e=l(r=>{r.target.closest("#resetpagetour")&&(r.preventDefault(),n())},"handler");return document.addEventListener("click",e),()=>document.removeEventListener("click",e)},[n]),null),"ResetLink"),g=l(({tourDetails:n,filterNames:e})=>{let[r,t]=i(null),[u,d]=i(null),[f,m]=i(!1),[T,h]=i([]);return c(()=>{if(e.length===0){m(!0);return}y(e).then(o=>{h(o),m(!0)})},[e]),c(()=>{if(!f)return;let o=F(n,T);o&&(d(o.tourId),o.startTour!==!1&&p(o.tourId).then(s=>{s&&t(s)}))},[f,n,T]),a(S,{children:[u!==null&&a(I,{onClick:l(async()=>{if(u===null)return;t(null);let o=await L(u);if(o){d(o);let s=await p(o);s&&t(s)}},"handleReset")},void 0,!1,{fileName:"public/admin/tool/usertours/js/esm/src/UserTours.tsx",lineNumber:185,columnNumber:17}),r&&u!==null&&a(M,{tourConfig:r,tourId:u},void 0,!1,{fileName:"public/admin/tool/usertours/js/esm/src/UserTours.tsx",lineNumber:188,columnNumber:17})]},void 0,!0,{fileName:"public/admin/tool/usertours/js/esm/src/UserTours.tsx",lineNumber:183,columnNumber:9})},"UserTours");g.displayName="UserTours";var D=g;export{D as default};
/**
 * Top-level User Tours orchestrator component.
 *
 * Replaces the AMD-side init logic: loads client-side filters, finds the
 * first matching tour, fetches its configuration from the server, and
 * renders the Tour component. Also renders the "Reset user tour on this
 * page" link and handles tour reset.
 *
 * @module     tool_usertours/UserTours
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=UserTours.js.map
