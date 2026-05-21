import{useCallback as m,useState as b}from"react";import{isTree as A}from"../tree.js";import{useAvailability as C}from"./AvailabilityContext.js";import{OperatorSelector as D}from"./OperatorSelector.js";import{ConditionItem as h}from"./ConditionItem.js";import{DeleteButton as O}from"./DeleteButton.js";import{jsx as i,jsxs as r}from"react/jsx-runtime";function S({tree:a,path:t,isRoot:l}){let{plugins:s,dispatch:n}=C(),[d,u]=b(null),y=m(e=>{n({type:"SET_OPERATOR",path:t,op:e})},[n,t]),v=m(e=>{let o={type:e,creating:!0},c=s.get(e),N=c?!c.displayMode:!0;n({type:"ADD_CONDITION",path:t,condition:o,show:N}),u(a.c.length)},[n,t,a.c.length,s]),g=m(()=>{n({type:"ADD_NESTED_SET",path:t})},[n,t]),f=m(()=>{if(t.length>0){let e=t.slice(0,-1),o=t[t.length-1];n({type:"REMOVE_CONDITION",path:e,index:o})}},[n,t]),p=Array.from(s.values()).filter(e=>e.allowAdd);return r("div",{className:`availability-list ${l?"availability-list-root":"availability-childlist"}`,role:"group","aria-label":"Condition group",children:[r("div",{className:"availability-header d-flex align-items-center gap-2 mb-2",children:[i("span",{className:"availability-connector",children:"Student"}),i(D,{value:a.op,onChange:y,disabled:a.c.length<=1}),!l&&i(O,{onDelete:f,label:"Delete condition group"})]}),r("div",{className:"availability-children ps-3",children:[a.c.length===0&&i("div",{className:"availability-none text-muted px-3 mb-2",children:"No conditions added yet."}),a.c.map((e,o)=>{let c=a.showc?.[o]??!0;return A(e)?i(S,{tree:e,path:[...t,o]},`nested-${o}`):i(h,{condition:e,path:t,index:o,visible:c,isNew:d===o},`item-${o}`)})]}),r("div",{className:"availability-buttons d-flex gap-2 mt-2",children:[p.length>0&&i(w,{plugins:p,onAdd:v}),i("button",{type:"button",className:"btn btn-sm btn-outline-secondary",onClick:g,children:"Add condition group"})]})]})}function w({plugins:a,onAdd:t}){let[l,s]=b(""),n=()=>{l&&(t(l),s(""))};return r("div",{className:"availability-add d-flex gap-1",children:[r("select",{className:"form-select form-select-sm",value:l,onChange:d=>s(d.target.value),"aria-label":"Condition type to add",children:[i("option",{value:"",children:"Add restriction..."}),a.map(d=>i("option",{value:d.name,children:d.name},d.name))]}),i("button",{type:"button",className:"btn btn-sm btn-primary",onClick:n,disabled:!l,children:"Add"})]})}export{S as ConditionList};
/**
 * Condition list component.
 *
 * Renders a group of conditions combined with a boolean operator, plus
 * controls for adding new conditions and nested sets.
 *
 * Supports arbitrary nesting — a list may contain both leaf conditions
 * and nested sub-lists.
 *
 * @module     core_availability/components/ConditionList
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=ConditionList.js.map
