import{useState as m,useEffect as a}from"react";import{AvailabilityPlugin as g}from"@moodle/lms/core_availability/types";import{jsx as p,jsxs as c}from"react/jsx-runtime";var d=({json:n,onChange:e,onValidate:r,initParams:s})=>{let l=s[0]??[],[t,u]=m(()=>n.id!==void 0?String(n.id):"choose");return a(()=>{t==="choose"?r(["availability_grouping:error_selectgrouping"]):(r([]),e({type:"grouping",id:Number(t)}))},[t]),c("select",{value:t,onChange:o=>u(o.target.value),className:"form-select mx-1",children:[p("option",{value:"choose",children:M.util.get_string("choosedots","moodle")}),l.map(o=>p("option",{value:String(o.id),children:o.name},o.id))]})},i=class extends g{getComponent(){return d}fillValue(e){return{type:"grouping",id:Number(e.id)}}validate(e){return e.id?[]:["availability_grouping:error_selectgrouping"]}};export{i as default};
/**
 * Availability condition: Grouping membership.
 *
 * @module     availability_grouping/form
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=form.js.map
