var m=Object.defineProperty;var x=(e,n)=>m(e,"name",{value:n,configurable:!0});import{useEffect as v,useState as C}from"react";import{jsxDEV as R}from"react/jsx-dev-runtime";var y=10,d=10;function g(e){let n=window.innerWidth,a=window.innerHeight,u=e.getBoundingClientRect(),p=window.scrollY,o=e.offsetWidth+y*2,$=e.offsetHeight+y*2,i=u.left+window.scrollX-y,t=u.top+p-y,f=e.closest('[data-usertour="scroller"]');if(f){let L=f.getBoundingClientRect().top+p,h=Math.max(Math.ceil(L-t),0);t+=h,$-=h}let r={x1:i+o-d,y1:t+$,x2:i+o,y2:t+$-d},s={x1:i+o,y1:t+d,x2:i+o-d,y2:t},l={x1:i+d,y1:t,x2:i,y2:t+d},c={x1:i,y1:t+$-d,x2:i+d,y2:t+$};return`path('M 0 0 L ${n} 0 L ${n} ${a} L 0 ${a} L 0 ${t+$} L ${r.x1} ${r.y1} C ${r.x1} ${r.y1} ${r.x2} ${r.y1} ${r.x2} ${r.y2} L ${s.x1} ${s.y1} C ${s.x1} ${s.y1} ${s.x1} ${s.y2} ${s.x2} ${s.y2} L ${l.x1} ${l.y1} C ${l.x1} ${l.y1} ${l.x2} ${l.y1} ${l.x2} ${l.y2} L ${c.x1} ${c.y1} C ${c.x1} ${c.y1} ${c.x1} ${c.y2} ${c.x2} ${c.y2} L 0 ${t+$} Z')`}x(g,"buildClipPath");var w=x(({targetElement:e,visible:n,onClick:a})=>{let[u,p]=C(void 0);return v(()=>{if(!n||!e){p(void 0);return}let o=x(()=>{p(g(e))},"updateClipPath");return o(),window.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",o,{passive:!0}),()=>{window.removeEventListener("scroll",o),window.removeEventListener("resize",o)}},[n,e]),n?R("div",{"data-flexitour":"backdrop",onClick:a,style:{position:"fixed",top:0,right:0,bottom:0,left:0,clipPath:u}},void 0,!1,{fileName:"public/admin/tool/usertours/js/esm/src/TourBackdrop.tsx",lineNumber:143,columnNumber:9}):null},"TourBackdrop");w.displayName="TourBackdrop";var B=w;export{B as default};
/**
 * TourBackdrop component for User Tours.
 *
 * Renders a full-viewport overlay with a clip-path cutout that highlights
 * the target element of the current tour step. The cutout has rounded corners
 * drawn with cubic Bézier curves to match the original implementation.
 *
 * @module     tool_usertours/TourBackdrop
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=TourBackdrop.js.map
