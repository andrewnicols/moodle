import{useEffect as L,useState as v}from"react";import{jsx as C}from"react/jsx-runtime";var x=10,c=10;function m(o){let $=window.innerWidth,a=window.innerHeight,u=o.getBoundingClientRect(),p=window.scrollY,e=o.offsetWidth+x*2,d=o.offsetHeight+x*2,n=u.left+window.scrollX-x,t=u.top+p-x,y=o.closest('[data-usertour="scroller"]');if(y){let w=y.getBoundingClientRect().top+p,f=Math.max(Math.ceil(w-t),0);t+=f,d-=f}let i={x1:n+e-c,y1:t+d,x2:n+e,y2:t+d-c},r={x1:n+e,y1:t+c,x2:n+e-c,y2:t},s={x1:n+c,y1:t,x2:n,y2:t+c},l={x1:n,y1:t+d-c,x2:n+c,y2:t+d};return`path('M 0 0 L ${$} 0 L ${$} ${a} L 0 ${a} L 0 ${t+d} L ${i.x1} ${i.y1} C ${i.x1} ${i.y1} ${i.x2} ${i.y1} ${i.x2} ${i.y2} L ${r.x1} ${r.y1} C ${r.x1} ${r.y1} ${r.x1} ${r.y2} ${r.x2} ${r.y2} L ${s.x1} ${s.y1} C ${s.x1} ${s.y1} ${s.x2} ${s.y1} ${s.x2} ${s.y2} L ${l.x1} ${l.y1} C ${l.x1} ${l.y1} ${l.x1} ${l.y2} ${l.x2} ${l.y2} L 0 ${t+d} Z')`}var h=({targetElement:o,visible:$,onClick:a})=>{let[u,p]=v(void 0);return L(()=>{if(!$||!o){p(void 0);return}let e=()=>{p(m(o))};return e(),window.addEventListener("scroll",e,{passive:!0}),window.addEventListener("resize",e,{passive:!0}),()=>{window.removeEventListener("scroll",e),window.removeEventListener("resize",e)}},[$,o]),$?C("div",{"data-flexitour":"backdrop",onClick:a,style:{position:"fixed",top:0,right:0,bottom:0,left:0,clipPath:u}}):null};h.displayName="TourBackdrop";var T=h;export{T as default};
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
