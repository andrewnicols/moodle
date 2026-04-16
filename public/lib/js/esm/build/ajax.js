import{requireAsync as m}from"@moodle/lms/core/amd";function d(e){return typeof e=="object"&&e!==null&&"message"in e&&"errorcode"in e}var i=null;function s(){return i||(i=m("core/ajax")),i}function u(e){return new Promise((o,n)=>{e.then(o,n)})}async function x(e,o=!0,n=!0,r=!1){let a=await s(),[t]=a.call([e],o,n,r);return u(t)}async function j(e,o=!0,n=!0,r=!1){let t=(await s()).call(e,o,n,r).map(l=>u(l));return Promise.all(t)}export{j as fetchMany,x as fetchOne,d as isMoodleAjaxError};
/**
 * ESM wrapper for the core/ajax AMD module.
 *
 * @module     core/ajax
 * @copyright  Meirza <meirza.arson@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
