import{useEffect as l,useRef as u}from"react";import{serialiseTree as m}from"../tree.js";import{AvailabilityProvider as b,useAvailability as v}from"./AvailabilityContext.js";import{ConditionList as c}from"./ConditionList.js";import{jsx as t}from"react/jsx-runtime";function d({textareaEl:e}){let{tree:r}=v();return l(()=>{let i=m(r);e.value=i,e.dispatchEvent(new Event("change",{bubbles:!0}))},[r,e]),t("div",{className:"availability-field",children:t(c,{tree:r,path:[],isRoot:!0})})}function I({plugins:e,initialTree:r,textareaEl:i,courseId:a,cmId:o,sectionId:s}){let n=u(!1);return l(()=>{n.current||(i.setAttribute("aria-hidden","true"),i.style.display="none",n.current=!0)},[i]),t(b,{plugins:e,initialTree:r,courseId:a,cmId:o,sectionId:s,children:t(d,{textareaEl:i})})}export{I as AvailabilityForm};
/**
 * Top-level availability form component.
 *
 * Reads the availability JSON from the hidden textarea, renders the tree
 * of conditions, and writes the updated JSON back on every change.
 *
 * @module     core_availability/components/AvailabilityForm
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=AvailabilityForm.js.map
