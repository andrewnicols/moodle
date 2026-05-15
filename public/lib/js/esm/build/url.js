var i=M.cfg,r=i,l=i.jsrev!==-1;var m=(e,n)=>{let t=r.wwwroot+e;return n.charAt(0)!=="/"&&(n=`/${n}`),r.slasharguments?t+=n:t+=`?file=${encodeURIComponent(n)}`,t},c=(e,n={},t=!1)=>{if(e.indexOf("http:")===0||e.indexOf("https:")===0||e.indexOf("://")>=0)throw new Error("relativeUrl function does not accept absolute urls");e.charAt(0)!=="/"&&(e=`/${e}`),r.admin!=="admin"&&(e=e.replace(/^\/admin\//,`/${r.admin}/`));let o={...n};t&&(o.sesskey=r.sesskey);let s=new URLSearchParams(Object.entries(o).map(([u,g])=>[u,String(g)])).toString();return s!==""?`${r.wwwroot}${e}?${s}`:r.wwwroot+e},a=(e,n)=>M.util.image_url(e,n),b={fileUrl:m,relativeUrl:c,imageUrl:a};export{b as default,m as fileUrl,a as imageUrl,c as relativeUrl};
/**
 * Typed access to the Moodle page configuration (`M.cfg`).
 *
 * This module exposes the same `M.cfg` object that is injected into every Moodle page
 * by the server-side renderer, but with a full TypeScript interface so that consuming
 * modules get autocompletion and compile-time type safety.
 *
 * The default export is the live `M.cfg` object — mutations made by tests or other code
 * are immediately visible to every consumer.
 *
 * @module     core/config
 * @copyright  2015 Damyon Wiese <damyon@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      2.9
 */
/**
 * URL utility functions.
 *
 * @module     core/url
 * @copyright  2015 Damyon Wiese <damyon@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      2.9
 */
