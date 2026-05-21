import r from"./StorageWrapper.js";var o=new r(window.localStorage),n=t=>o.get(t),s=(t,e)=>o.set(t,e),a=()=>o.clean(),l={get:n,set:s,clean:a};export{a as clean,l as default,n as get,s as set};
/**
 * Simple API for set/get to localStorage, with cacherev expiration.
 *
 * @module     core/localstorage
 * @copyright  2015 Damyon Wiese <damyon@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      2.9
 */
//# sourceMappingURL=LocalStorage.js.map
