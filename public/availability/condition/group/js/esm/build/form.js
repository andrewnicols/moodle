import{useState as d,useEffect as a}from"react";import{AvailabilityPlugin as m}from"@moodle/lms/core_availability/types";import{jsx as r,jsxs as g}from"react/jsx-runtime";var c=({json:i,onChange:o,onValidate:n,initParams:s})=>{let u=s[0]??[],[t,l]=d(()=>i.id!==void 0?String(i.id):"choose");return a(()=>{if(t==="choose")n(["availability_group:error_selectgroup"]);else{n([]);let e={type:"group"};t!=="any"&&(e.id=Number(t)),o(e)}},[t]),g("select",{value:t,onChange:e=>l(e.target.value),className:"form-select mx-1",children:[r("option",{value:"choose",children:M.util.get_string("choosedots","moodle")}),r("option",{value:"any",children:M.util.get_string("anygroup","availability_group")}),u.map(e=>r("option",{value:String(e.id),children:e.name},e.id))]})},p=class extends m{getComponent(){return c}fillValue(o){let n={type:"group"};return o.id!==void 0&&(n.id=o.id),n}validate(o){return o.id===void 0&&o.type==="group"?[]:[]}};export{p as default};
/**
 * Availability condition: Group membership.
 *
 * @module     availability_group/form
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=form.js.map
