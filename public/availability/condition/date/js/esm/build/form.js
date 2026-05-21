import{useState as f,useEffect as y,useRef as T,useCallback as S}from"react";import{AvailabilityPlugin as D}from"@moodle/lms/core_availability/types";import{jsx as m,jsxs as C}from"react/jsx-runtime";function E(o){let e=c=>{let l=o.querySelector(`select[name="x[${c}]"]`);return l?Number(l.value):0},n=e("year"),r=e("month")-1,i=e("day"),a=e("hour"),t=e("minute"),s=new Date(Date.UTC(n,r,i,a,t,0));return Math.floor(s.getTime()/1e3)}function _(o,e){let n=new Date(e*1e3),r=(i,a)=>{let t=o.querySelector(`select[name="x[${i}]"]`);t&&(t.value=String(a))};r("year",n.getUTCFullYear()),r("month",n.getUTCMonth()+1),r("day",n.getUTCDate()),r("hour",n.getUTCHours()),r("minute",n.getUTCMinutes())}var H=({json:o,onChange:e,onValidate:n,initParams:r})=>{let i=r[0]??"",a=r[1]??0,t=T(null),[s,c]=f(()=>o.d??">="),[l,b]=f(()=>o.t??a),d=T(!1);y(()=>{if(t.current&&i&&!d.current){d.current=!0,t.current.innerHTML=i,o.t&&_(t.current,o.t);let u=t.current.querySelectorAll("select"),v=()=>{t.current&&b(E(t.current))};u.forEach(h=>h.addEventListener("change",v))}},[i]);let g=S(()=>{n([]),e({type:"date",d:s,t:l})},[s,l,e,n]);return y(()=>{g()},[g]),C("span",{className:"d-inline-flex align-items-center gap-1",children:[C("select",{value:s,onChange:u=>c(u.target.value),className:"form-select mx-1",style:{width:"auto"},children:[m("option",{value:">=",children:M.util.get_string("direction_from","availability_date")}),m("option",{value:"<",children:M.util.get_string("direction_until","availability_date")})]}),m("span",{ref:t,className:"availability-date-selects"})]})},p=class extends D{getComponent(){return H}fillValue(e){return{type:"date",d:e.d??">=",t:Number(e.t)||0}}validate(e){return[]}};export{p as default};
/**
 * Availability condition: Date restriction.
 *
 * The date condition uses server-rendered HTML for the date/time selectors
 * (to support calendar types and timezones), which is passed via initParams.
 *
 * @module     availability_date/form
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=form.js.map
