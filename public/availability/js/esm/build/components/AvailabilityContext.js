var T=Object.defineProperty;var a=(i,e)=>T(i,"name",{value:e,configurable:!0});import{createContext as s,useContext as y,useReducer as A}from"react";import{addChild as c,removeChild as v,updateChild as p,setOperator as h,setChildVisibility as m,addNestedSet as E}from"../tree.js";import{jsxDEV as O}from"react/jsx-dev-runtime";var b=s(null);function R(){let i=y(b);if(!i)throw new Error("useAvailability must be used within an AvailabilityProvider");return i}a(R,"useAvailability");function r(i,e,t){if(e.length===0)return t(i);let[n,...u]=e,l=i.c[n];if(!l||!("op"in l)||!("c"in l))return i;let o=r(l,u,t);return p(i,n,o)}a(r,"updateAtPath");function I(i,e){switch(e.type){case"SET_TREE":return e.tree;case"SET_OPERATOR":return r(i,e.path,t=>h(t,e.op));case"ADD_CONDITION":return r(i,e.path,t=>c(t,e.condition,e.show??!0));case"REMOVE_CONDITION":return r(i,e.path,t=>v(t,e.index));case"UPDATE_CONDITION":return r(i,e.path,t=>p(t,e.index,e.condition));case"SET_VISIBILITY":return r(i,e.path,t=>m(t,e.index,e.show));case"ADD_NESTED_SET":return r(i,e.path,t=>E(t,e.op??"&"));default:return i}}a(I,"treeReducer");function P({plugins:i,initialTree:e,courseId:t,cmId:n,sectionId:u,children:l}){let[o,d]=A(I,e);return O(b,{value:{plugins:i,tree:o,dispatch:d,courseId:t,cmId:n,sectionId:u},children:l},void 0,!1,{fileName:"public/availability/js/esm/src/components/AvailabilityContext.tsx",lineNumber:172,columnNumber:12},this)}a(P,"AvailabilityProvider");export{P as AvailabilityProvider,I as treeReducer,R as useAvailability};
/**
 * React context for the availability conditions form.
 *
 * Provides the plugin registry, course/section/module context, and a dispatch
 * function for tree mutations to all descendant components.
 *
 * @module     core_availability/components/AvailabilityContext
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=AvailabilityContext.js.map
