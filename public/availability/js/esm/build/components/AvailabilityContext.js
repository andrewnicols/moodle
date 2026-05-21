import{createContext as b,useContext as T,useReducer as s}from"react";import{addChild as y,removeChild as A,updateChild as o,setOperator as v,setChildVisibility as c,addNestedSet as h}from"../tree.js";import{jsx as E}from"react/jsx-runtime";var p=b(null);function x(){let i=T(p);if(!i)throw new Error("useAvailability must be used within an AvailabilityProvider");return i}function r(i,e,t){if(e.length===0)return t(i);let[a,...n]=e,l=i.c[a];if(!l||!("op"in l)||!("c"in l))return i;let u=r(l,n,t);return o(i,a,u)}function m(i,e){switch(e.type){case"SET_TREE":return e.tree;case"SET_OPERATOR":return r(i,e.path,t=>v(t,e.op));case"ADD_CONDITION":return r(i,e.path,t=>y(t,e.condition,e.show??!0));case"REMOVE_CONDITION":return r(i,e.path,t=>A(t,e.index));case"UPDATE_CONDITION":return r(i,e.path,t=>o(t,e.index,e.condition));case"SET_VISIBILITY":return r(i,e.path,t=>c(t,e.index,e.show));case"ADD_NESTED_SET":return r(i,e.path,t=>h(t,e.op??"&"));default:return i}}function C({plugins:i,initialTree:e,courseId:t,cmId:a,sectionId:n,children:l}){let[u,d]=s(m,e);return E(p,{value:{plugins:i,tree:u,dispatch:d,courseId:t,cmId:a,sectionId:n},children:l})}export{C as AvailabilityProvider,m as treeReducer,x as useAvailability};
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
