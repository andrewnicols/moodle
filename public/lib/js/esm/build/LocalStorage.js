var n=Object.defineProperty;var o=(t,e)=>n(t,"name",{value:e,configurable:!0});import s from"./StorageWrapper.js";var r=new s(window.localStorage),a=o(t=>r.get(t),"get"),g=o((t,e)=>r.set(t,e),"set"),l=o(()=>r.clean(),"clean"),p={get:a,set:g,clean:l};export{l as clean,p as default,a as get,g as set};
/**
 * Simple API for set/get to localStorage, with cacherev expiration.
 *
 * @module     core/localstorage
 * @copyright  2015 Damyon Wiese <damyon@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      2.9
 */
//# sourceMappingURL=LocalStorage.js.map
