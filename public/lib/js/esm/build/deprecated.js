import p from"@moodle/lms/core/config";import{requireAsync as c}from"@moodle/lms/core/amd";var f=(r,s,t,o,i,e)=>{let n=[];return n.push("Deprecation: "),s?n.push(s):n.push(`${r} has been deprecated`),o!==null&&n.push(` since ${o}`),n.push("."),i&&n.push(` ${i}`),t&&n.push(` Please use ${t} instead.`),e&&n.push(` See ${e} for more information.`),n.join("")},h=(r,s,t,o,i,e)=>{let n=[];if(n.push("<h2>Deprecation</h2>"),s?n.push(`<p>${s}`):n.push(`<p><code>${r}</code> is deprecated`),o!==null&&n.push(` since ${o}`),n.push(".</p>"),i&&n.push(`<p>${i}</p>`),t&&n.push(`<p>Please use <code>${t}</code> instead.</p>`),e){let l=`https://moodle.atlassian.net/browse/${e}`;n.push(`<p>See <a href="${l}" target="_blank" rel="noopener noreferrer">${e}</a> for more information.</p>`)}return n.join("")},d=r=>(p.deprecationignorelist||[]).includes(r),m=()=>!!(p.developerdebug||document.querySelector("body.behat-site"));function $(r,{alternativeNotice:s=null,replacement:t=null,since:o=null,reason:i=null,mdl:e=null,final:n=!1,emit:l=!0}={}){if(t===null&&i===null&&e===null)throw new Error("You must provide at least one of replacement, reason or mdl when marking something as deprecated.");let u=f(r,s,t,o,i,e);if((n||m())&&(n||l&&!d(r))){let a=h(r,s,t,o,i,e);c("core/notification").then(g=>g.alert("Deprecation Warning",a))}if(n)throw new Error(u);console.error(u)}export{$ as default};
/**
 * The core/deprecated module allows you to mark things as deprecated and warn appropriately.
 *
 * It emits a console error for non-final deprecations, or throws an Error for final ones.
 * When developer debugging is enabled (or running under Behat), a toast notification is
 * also displayed via core/notification.
 *
 * @module     core/deprecated
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @example
 * import emitDeprecation from '@moodle/lms/core/deprecated';
 *
 * emitDeprecation('myFunction', {
 *     replacement: 'myNewFunction',
 *     since: '5.0',
 *     mdl: 'MDL-12345',
 * });
 */
//# sourceMappingURL=deprecated.js.map
