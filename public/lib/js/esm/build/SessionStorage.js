import r from"./StorageWrapper.js";var e=new r(window.sessionStorage),s=t=>e.get(t),n=(t,o)=>e.set(t,o),i={get:s,set:n};export{i as default,s as get,n as set};
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
