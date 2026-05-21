var m=Object.defineProperty;var n=(i,e)=>m(i,"name",{value:e,configurable:!0});import{useEffect as a,useRef as b}from"react";import{serialiseTree as c}from"../tree.js";import{AvailabilityProvider as p,useAvailability as v}from"./AvailabilityContext.js";import{ConditionList as d}from"./ConditionList.js";import{jsxDEV as t}from"react/jsx-dev-runtime";function f({textareaEl:i}){let{tree:e}=v();return a(()=>{let r=c(e);i.value=r,i.dispatchEvent(new Event("change",{bubbles:!0}))},[e,i]),t("div",{className:"availability-field",children:t(d,{tree:e,path:[],isRoot:!0},void 0,!1,{fileName:"public/availability/js/esm/src/components/AvailabilityForm.tsx",lineNumber:56,columnNumber:13},this)},void 0,!1,{fileName:"public/availability/js/esm/src/components/AvailabilityForm.tsx",lineNumber:55,columnNumber:9},this)}n(f,"AvailabilityFormInner");function P({plugins:i,initialTree:e,textareaEl:r,courseId:o,cmId:s,sectionId:u}){let l=b(!1);return a(()=>{l.current||(r.setAttribute("aria-hidden","true"),r.style.display="none",l.current=!0)},[r]),t(p,{plugins:i,initialTree:e,courseId:o,cmId:s,sectionId:u,children:t(f,{textareaEl:r},void 0,!1,{fileName:"public/availability/js/esm/src/components/AvailabilityForm.tsx",lineNumber:104,columnNumber:13},this)},void 0,!1,{fileName:"public/availability/js/esm/src/components/AvailabilityForm.tsx",lineNumber:97,columnNumber:9},this)}n(P,"AvailabilityForm");export{P as AvailabilityForm};
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
