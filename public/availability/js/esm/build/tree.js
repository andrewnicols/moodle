function c(i){return"op"in i&&"c"in i}function u(i){return"type"in i&&!("op"in i)}function p(i){if(!i||!i.trim())return null;try{let e=JSON.parse(i);return e&&typeof e=="object"&&"op"in e&&"c"in e?e:null}catch{return null}}function y(i){return JSON.stringify(i)}function n(i="&"){return{op:i,c:[],showc:[]}}function o(i,e,t=!0){return{...i,c:[...i.c,e],showc:[...i.showc??[],t]}}function b(i,e){let t=i.c.filter((l,a)=>a!==e),r=i.showc?.filter((l,a)=>a!==e);return{...i,c:t,showc:r}}function s(i,e,t){let r=i.c.map((l,a)=>a===e?t:l);return{...i,c:r}}function T(i,e){return{...i,op:e}}function v(i,e,t){let r=[...i.showc??i.c.map(()=>!0)];return r[e]=t,{...i,showc:r}}function A(i,e="&"){return o(i,n(e),!0)}export{o as addChild,A as addNestedSet,n as createEmptyTree,u as isCondition,c as isTree,p as parseTree,b as removeChild,y as serialiseTree,v as setChildVisibility,T as setOperator,s as updateChild};
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
