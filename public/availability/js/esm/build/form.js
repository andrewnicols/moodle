var v=Object.defineProperty;var o=(i,t)=>v(i,"name",{value:t,configurable:!0});import{useState as s,useEffect as f}from"react";import{loadPlugins as b}from"./registry.js";import{parseTree as E,createEmptyTree as A}from"./tree.js";import{AvailabilityForm as F}from"./components/AvailabilityForm.js";import{jsxDEV as l}from"react/jsx-dev-runtime";var u=o(({plugins:i,textareaId:t,courseId:d,cmId:m,sectionId:y})=>{let[r,p]=s(null),[n,c]=s(null);f(()=>{b(i).then(e=>{p(e)}).catch(e=>{window.console.error("[core_availability/form] Failed to load plugins:",e),c("Failed to load availability condition plugins.")})},[i]);let a=document.getElementById(t);if(!a)return l("div",{className:"alert alert-danger",children:["Availability textarea not found: #",t]},void 0,!0,{fileName:"public/availability/js/esm/src/form.tsx",lineNumber:58,columnNumber:16});let g=E(a.value)??A();return n?l("div",{className:"alert alert-danger",children:n},void 0,!1,{fileName:"public/availability/js/esm/src/form.tsx",lineNumber:65,columnNumber:16}):r?l(F,{plugins:r,initialTree:g,textareaEl:a,courseId:d,cmId:m??null,sectionId:y??null},void 0,!1,{fileName:"public/availability/js/esm/src/form.tsx",lineNumber:73,columnNumber:9}):l("div",{className:"availability-loading",children:"Loading availability conditions..."},void 0,!1,{fileName:"public/availability/js/esm/src/form.tsx",lineNumber:69,columnNumber:16})},"AvailabilityFormEntry");u.displayName="AvailabilityFormEntry";var h=u;export{h as default};
/**
 * Entry point for the availability conditions React form.
 *
 * This is the default export used by the `react_autoinit` system. PHP
 * renders a `<div data-react-component="@moodle/lms/core_availability/form">`
 * element with props containing the plugin descriptors and form metadata.
 *
 * @module     core_availability/form
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=form.js.map
