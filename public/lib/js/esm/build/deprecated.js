var f=Object.defineProperty;var l=(e,r)=>f(e,"name",{value:r,configurable:!0});import a from"@moodle/lms/core/config";import{requireAsync as h}from"@moodle/lms/core/amd";var d=l((e,r,t,o,i,s)=>{let n=[];return n.push("Deprecation: "),r?n.push(r):n.push(`${e} has been deprecated`),o!==null&&n.push(` since ${o}`),n.push("."),i&&n.push(` ${i}`),t&&n.push(` Please use ${t} instead.`),s&&n.push(` See ${s} for more information.`),n.join("")},"getMessage"),m=l((e,r,t,o,i,s)=>{let n=[];if(n.push("<h2>Deprecation</h2>"),r?n.push(`<p>${r}`):n.push(`<p><code>${e}</code> is deprecated`),o!==null&&n.push(` since ${o}`),n.push(".</p>"),i&&n.push(`<p>${i}</p>`),t&&n.push(`<p>Please use <code>${t}</code> instead.</p>`),s){let u=`https://moodle.atlassian.net/browse/${s}`;n.push(`<p>See <a href="${u}" target="_blank" rel="noopener noreferrer">${s}</a> for more information.</p>`)}return n.join("")},"getHTMLMessage"),$=l(e=>(a.deprecationignorelist||[]).includes(e),"isIgnored"),b=l(()=>!!(a.developerdebug||document.querySelector("body.behat-site")),"canEmit");function w(e,{alternativeNotice:r=null,replacement:t=null,since:o=null,reason:i=null,mdl:s=null,final:n=!1,emit:u=!0}={}){if(t===null&&i===null&&s===null)throw new Error("You must provide at least one of replacement, reason or mdl when marking something as deprecated.");let p=d(e,r,t,o,i,s);if((n||b())&&(n||u&&!$(e))){let g=m(e,r,t,o,i,s);h("core/notification").then(c=>c.alert("Deprecation Warning",g))}if(n)throw new Error(p);console.error(p)}l(w,"emitDeprecation");export{w as default};
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
