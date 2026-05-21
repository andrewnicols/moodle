var s=Object.defineProperty;var o=(t,e)=>s(t,"name",{value:e,configurable:!0});import n from"./StorageWrapper.js";var r=new n(window.sessionStorage),g=o(t=>r.get(t),"get"),i=o((t,e)=>r.set(t,e),"set"),l={get:g,set:i};export{l as default,g as get,i as set};
/**
 * Simple API for set/get to sessionStorage, with cacherev expiration.
 *
 * Session storage will only persist for as long as the browser window stays open.
 *
 * @module     core/sessionstorage
 * @copyright  2017 Ryan Wyllie <ryan@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=SessionStorage.js.map
