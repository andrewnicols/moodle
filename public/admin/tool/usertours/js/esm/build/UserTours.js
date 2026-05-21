import{useState as s,useEffect as i}from"react";import{getString as h}from"@moodle/lms/core/String";import C from"./TourComponent.js";import{fetchTour as m,resetTourState as E}from"./useTourApi.js";import{loadFilterModules as M}from"./loadFilters.js";import{Fragment as v,jsx as T,jsxs as I}from"react/jsx-runtime";function L(o,r){return r.length===0?o[0]??null:o.find(t=>r.some(e=>e&&e.filterMatches?e.filterMatches(t):!0))??null}function y(){return document.querySelector(".tool_usertours-resettourcontainer")??document.querySelector(".logininfo")??document.querySelector("footer")??document.body}var F=({onClick:o})=>(i(()=>{let r=y(),t=document.createElement("div");t.className="usertour";let e=document.createElement("a");return e.id="resetpagetour",e.href="#",t.appendChild(e),r.appendChild(t),h("resettouronpage","tool_usertours").then(u=>{e.textContent=u}),()=>{t.remove()}},[]),i(()=>{let r=t=>{t.target.closest("#resetpagetour")&&(t.preventDefault(),o())};return document.addEventListener("click",r),()=>document.removeEventListener("click",r)},[o]),null),p=({tourDetails:o,filterNames:r})=>{let[t,e]=s(null),[u,c]=s(null),[d,a]=s(!1),[f,g]=s([]);return i(()=>{if(r.length===0){a(!0);return}M(r).then(n=>{g(n),a(!0)})},[r]),i(()=>{if(!d)return;let n=L(o,f);n&&(c(n.tourId),n.startTour!==!1&&m(n.tourId).then(l=>{l&&e(l)}))},[d,o,f]),I(v,{children:[u!==null&&T(F,{onClick:async()=>{if(u===null)return;e(null);let n=await E(u);if(n){c(n);let l=await m(n);l&&e(l)}}}),t&&u!==null&&T(C,{tourConfig:t,tourId:u})]})};p.displayName="UserTours";var w=p;export{w as default};
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
