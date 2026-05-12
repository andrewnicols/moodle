var a=Object.defineProperty;var s=(r,t)=>a(r,"name",{value:t,configurable:!0});import{requireAsync as g}from"@moodle/lms/core/amd";var n=new Map,u=s((r,t="core",i)=>{let e=`${t}::${r}::${JSON.stringify(i)}`;return n.has(e)||n.set(e,g("core/str").then(o=>o.get_string(r,t,i))),n.get(e)},"getString"),p=s(()=>n.clear(),"resetStringCache"),P=s(async r=>{(await g("core/str")).cache_strings(r)},"cacheStrings");export{P as cacheStrings,u as getString,p as resetStringCache};
/**
 * ESM wrapper around the AMD core/str module for loading Moodle language strings.
 *
 * @module     core/String
 * @copyright  Meirza <meirza.arson@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=String.js.map
