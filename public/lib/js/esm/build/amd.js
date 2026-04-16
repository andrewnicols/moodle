var u=(n=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(n,{get:(r,e)=>(typeof require<"u"?require:r)[e]}):n)(function(n){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+n+'" is not supported')});function s(n){return new Promise((r,e)=>{u([n],o=>r(o),e)})}function t(n){return new Promise((r,e)=>{u(n,(...o)=>r(o),e)})}export{s as requireAsync,t as requireManyAsync};
/**
 * Promise-based AMD module loader.
 *
 * @module     core/amd
 * @copyright  Meirza <meirza.arson@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
