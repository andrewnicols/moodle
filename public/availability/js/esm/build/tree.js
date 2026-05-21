var o=Object.defineProperty;var t=(i,e)=>o(i,"name",{value:e,configurable:!0});function y(i){return"op"in i&&"c"in i}t(y,"isTree");function b(i){return"type"in i&&!("op"in i)}t(b,"isCondition");function s(i){if(!i||!i.trim())return null;try{let e=JSON.parse(i);return e&&typeof e=="object"&&"op"in e&&"c"in e?e:null}catch{return null}}t(s,"parseTree");function T(i){return JSON.stringify(i)}t(T,"serialiseTree");function c(i="&"){return{op:i,c:[],showc:[]}}t(c,"createEmptyTree");function u(i,e,r=!0){return{...i,c:[...i.c,e],showc:[...i.showc??[],r]}}t(u,"addChild");function v(i,e){let r=i.c.filter((n,l)=>l!==e),a=i.showc?.filter((n,l)=>l!==e);return{...i,c:r,showc:a}}t(v,"removeChild");function A(i,e,r){let a=i.c.map((n,l)=>l===e?r:n);return{...i,c:a}}t(A,"updateChild");function d(i,e){return{...i,op:e}}t(d,"setOperator");function f(i,e,r){let a=[...i.showc??i.c.map(()=>!0)];return a[e]=r,{...i,showc:a}}t(f,"setChildVisibility");function h(i,e="&"){return u(i,c(e),!0)}t(h,"addNestedSet");export{u as addChild,h as addNestedSet,c as createEmptyTree,b as isCondition,y as isTree,s as parseTree,v as removeChild,T as serialiseTree,f as setChildVisibility,d as setOperator,A as updateChild};
/**
 * Tree data model for availability conditions.
 *
 * Provides type guards and pure helper functions for manipulating the
 * availability condition tree. The tree format matches the existing JSON
 * schema stored in course_modules.availability / course_sections.availability.
 *
 * This module has NO React dependency — it is a pure data layer.
 *
 * @module     core_availability/tree
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=tree.js.map
