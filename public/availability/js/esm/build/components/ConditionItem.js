import{useState as D,useCallback as r,useRef as E,useEffect as O}from"react";import{useAvailability as T}from"./AvailabilityContext.js";import{EyeIcon as P}from"./EyeIcon.js";import{DeleteButton as g}from"./DeleteButton.js";import{jsx as t,jsxs as s}from"react/jsx-runtime";function w({condition:l,path:i,index:n,visible:v,isNew:c}){let{plugins:u,dispatch:o}=T(),[d,y]=D([]),m=E(null),a=u.get(l.type);O(()=>{c&&m.current&&a&&a.plugin.focusAfterAdd(m.current)},[c,a]);let f=r(e=>{o({type:"UPDATE_CONDITION",path:i,index:n,condition:e})},[o,i,n]),b=r(e=>{y(e)},[]),p=r(()=>{o({type:"REMOVE_CONDITION",path:i,index:n})},[o,i,n]),C=r(e=>{o({type:"SET_VISIBILITY",path:i,index:n,show:e})},[o,i,n]);if(!a)return s("div",{className:"availability-item availability-item-unknown alert alert-warning",role:"alert",children:[s("span",{children:["Unknown condition type: ",t("code",{children:l.type})]}),t(g,{onDelete:p})]});let I=a.plugin.getComponent();return s("div",{className:"availability-item d-flex align-items-start gap-2 mb-2",ref:m,"data-condition-type":l.type,children:[t(P,{visible:v,onToggle:C}),s("div",{className:"availability-item-content flex-grow-1",children:[t(I,{json:l,onChange:f,onValidate:b,initParams:a.initParams}),d.length>0&&t("div",{className:"availability-errors mt-1",role:"alert","aria-live":"polite",children:d.map((e,N)=>t("div",{className:"text-danger small",children:e},N))})]}),t(g,{onDelete:p})]})}export{w as ConditionItem};
/**
 * Single condition item component.
 *
 * Wraps a plugin's React component and provides eye icon, delete button,
 * and error display. Handles graceful failure if a plugin is not found.
 *
 * @module     core_availability/components/ConditionItem
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=ConditionItem.js.map
