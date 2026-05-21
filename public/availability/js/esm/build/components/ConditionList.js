import{useCallback as m,useState as u}from"react";import{Button as v}from"@moodlehq/design-system";import{isTree as N}from"../tree.js";import{useAvailability as D}from"./AvailabilityContext.js";import{OperatorSelector as h}from"./OperatorSelector.js";import{ConditionItem as O}from"./ConditionItem.js";import{DeleteButton as S}from"./DeleteButton.js";import{jsx as t,jsxs as r}from"react/jsx-runtime";function w({tree:a,path:e,isRoot:l}){let{plugins:s,dispatch:o}=D(),[d,y]=u(null),b=m(i=>{o({type:"SET_OPERATOR",path:e,op:i})},[o,e]),g=m(i=>{let n={type:i,creating:!0},c=s.get(i),C=c?!c.displayMode:!0;o({type:"ADD_CONDITION",path:e,condition:n,show:C}),y(a.c.length)},[o,e,a.c.length,s]),f=m(()=>{o({type:"ADD_NESTED_SET",path:e})},[o,e]),A=m(()=>{if(e.length>0){let i=e.slice(0,-1),n=e[e.length-1];o({type:"REMOVE_CONDITION",path:i,index:n})}},[o,e]),p=Array.from(s.values()).filter(i=>i.allowAdd);return r("div",{className:`availability-list ${l?"availability-list-root":"availability-childlist"}`,role:"group","aria-label":"Condition group",children:[r("div",{className:"availability-header d-flex align-items-center gap-2 mb-2",children:[t("span",{className:"availability-connector",children:"Student"}),t(h,{value:a.op,onChange:b,disabled:a.c.length<=1}),!l&&t(S,{onDelete:A,label:"Delete condition group"})]}),r("div",{className:"availability-children ps-3",children:[a.c.length===0&&t("div",{className:"availability-none text-muted px-3 mb-2",children:"No conditions added yet."}),a.c.map((i,n)=>{let c=a.showc?.[n]??!0;return N(i)?t(w,{tree:i,path:[...e,n]},`nested-${n}`):t(O,{condition:i,path:e,index:n,visible:c,isNew:d===n},`item-${n}`)})]}),r("div",{className:"availability-buttons d-flex gap-2 mt-2",children:[p.length>0&&t(T,{plugins:p,onAdd:g}),t(v,{variant:"outline-secondary",size:"sm",label:"Add condition group",onClick:f})]})]})}function T({plugins:a,onAdd:e}){let[l,s]=u(""),o=()=>{l&&(e(l),s(""))};return r("div",{className:"availability-add d-flex gap-1",children:[r("select",{className:"form-select form-select-sm",value:l,onChange:d=>s(d.target.value),"aria-label":"Condition type to add",children:[t("option",{value:"",children:"Add restriction..."}),a.map(d=>t("option",{value:d.name,children:d.name},d.name))]}),t(v,{variant:"primary",size:"sm",label:"Add",onClick:o,disabled:!l})]})}export{w as ConditionList};
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
