import{useState as o,useEffect as v}from"react";import{loadPlugins as g}from"./registry.js";import{parseTree as f,createEmptyTree as b}from"./tree.js";import{AvailabilityForm as E}from"./components/AvailabilityForm.js";import{jsx as l,jsxs as A}from"react/jsx-runtime";var s=({plugins:a,textareaId:e,courseId:d,cmId:u,sectionId:m})=>{let[r,y]=o(null),[n,p]=o(null);v(()=>{g(a).then(t=>{y(t)}).catch(t=>{window.console.error("[core_availability/form] Failed to load plugins:",t),p("Failed to load availability condition plugins.")})},[a]);let i=document.getElementById(e);if(!i)return A("div",{className:"alert alert-danger",children:["Availability textarea not found: #",e]});let c=f(i.value)??b();return n?l("div",{className:"alert alert-danger",children:n}):r?l(E,{plugins:r,initialTree:c,textareaEl:i,courseId:d,cmId:u??null,sectionId:m??null}):l("div",{className:"availability-loading",children:"Loading availability conditions..."})};s.displayName="AvailabilityFormEntry";var x=s;export{x as default};
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
