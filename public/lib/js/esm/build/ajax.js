import{requireAsync as u}from"@moodle/lms/core/amd";function l(e){return typeof e=="object"&&e!==null&&"message"in e&&"errorcode"in e}var a=await u("core/ajax");function s(e){return new Promise((n,o)=>{e.then(n,o)})}function c(e,n=!0,o=!0,r=!1){let[t]=a.call([e],n,o,r);return s(t)}function m(e,n=!0,o=!0,r=!1){return Promise.all(a.call(e,n,o,r).map(t=>s(t)))}export{m as fetchMany,c as fetchOne,l as isMoodleAjaxError};
/**
 * ESM wrapper for the core/ajax AMD module.
 *
 * @module     core/ajax
 * @copyright  Meirza <meirza.arson@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
