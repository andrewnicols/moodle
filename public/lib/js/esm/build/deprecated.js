var f=Object.defineProperty;var l=(e,r)=>f(e,"name",{value:r,configurable:!0});import a from"@moodle/lms/core/config";import{requireAsync as h}from"@moodle/lms/core/amd";var d=l((e,r,s,o,i,t)=>{let n=[];return n.push("Deprecation: "),r?n.push(r):n.push(`${e} has been deprecated`),o!==null&&n.push(` since ${o}`),n.push("."),i&&n.push(` ${i}`),s&&n.push(` Please use ${s} instead.`),t&&n.push(` See ${t} for more information.`),n.join("")},"getMessage"),m=l((e,r,s,o,i,t)=>{let n=[];if(n.push("<h2>Deprecation</h2>"),r?n.push(`<p>${r}`):n.push(`<p><code>${e}</code> is deprecated`),o!==null&&n.push(` since ${o}`),n.push(".</p>"),i&&n.push(`<p>${i}</p>`),s&&n.push(`<p>Please use <code>${s}</code> instead.</p>`),t){let u=`https://moodle.atlassian.net/browse/${t}`;n.push(`<p>See <a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a> for more information.</p>`)}return n.join("")},"getHTMLMessage"),$=l(e=>(a.deprecationignorelist||[]).includes(e),"isIgnored"),b=l(()=>!!(a.developerdebug||document.querySelector("body.behat-site")),"canEmit");function w(e,{alternativeNotice:r=null,replacement:s=null,since:o=null,reason:i=null,mdl:t=null,final:n=!1,emit:u=!0}={}){if(s===null&&i===null&&t===null)throw new Error("You must provide at least one of replacement, reason or mdl when marking something as deprecated.");let p=d(e,r,s,o,i,t);if((n||b())&&(n||u&&!$(e))){let g=m(e,r,s,o,i,t);h("core/notification").then(c=>c.alert("Deprecation Warning",g))}if(n)throw new Error(p);console.error(p)}l(w,"emitDeprecation");export{w as default};
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
