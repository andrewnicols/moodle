import{useEffect as c,useState as m}from"react";import p from"@moodle/lms/core/String";import{getString as a}from"@moodle/lms/core/stringUtils";import{Fragment as S,jsx as e,jsxs as H}from"react/jsx-runtime";/**
 * The list of scopes requested by an OAuth2 client, and the information the user needs
 * to decide whether to trust that client.
 *
 * @module     core_auth/local/OAuth2/ScopeInformation
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function g({clientName:o,siteName:n,requestedScopes:f,profileUrl:r,clientPrivacyUrl:t,clientTermsUrl:i}){const[l,u]=m(""),[d,h]=m("");return c(()=>{t&&i&&a("oauth2:confirmscopes:reviewpolicies","core",{clientname:o,clientprivacypolicy:t,clienttermsofservice:i}).then(u)},[o,t,i]),c(()=>{a("oauth2:confirmscopes:moodleaccount","core",{clientname:o,profilelink:r,sitename:n}).then(h)},[o,r,n]),H(S,{children:[e("h2",{className:"h4",children:e(p,{identifier:"oauth2:confirmscopes:beforelist",component:"core",params:{clientname:o}})}),e("ul",{children:f.map(s=>e("li",{children:s.description},s.identifier))}),e("h2",{className:"h4",children:e(p,{identifier:"oauth2:confirmscopes:makesureyoutrust",component:"core",params:{clientname:o}})}),t&&i&&e("div",{dangerouslySetInnerHTML:{__html:l}}),e("div",{dangerouslySetInnerHTML:{__html:d}})]})}export{g as default};
