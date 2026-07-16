import{useEffect as d,useState as r}from"react";import{Button as o}from"@moodlehq/design-system";import{getString as s}from"@moodle/lms/core/stringUtils";import{jsx as e,jsxs as t}from"react/jsx-runtime";/**
 * The "Continue as this user" / "Change user" form shown on the OAuth2 "continue as" page.
 *
 * @module     core_auth/local/OAuth2/ContinueForm
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function f({actionUrl:i,logoutUrl:m,sesskey:n,fullName:a}){const[u,l]=r(""),[p,c]=r("");return d(()=>{s("oauth2:contineasuser","core",a).then(l),s("oauth2:contineasuser:changeuser","core").then(c)},[a]),t("div",{className:"d-flex d-inline p-2",children:[t("form",{method:"post",action:i,className:"w-50 m-1",children:[e("input",{type:"hidden",name:"sesskey",value:n}),e("input",{type:"hidden",name:"currentuser",value:"1"}),e(o,{type:"submit",size:"lg",name:"approve",value:"1",variant:"primary",className:"w-100",label:u})]}),t("form",{method:"post",action:m,className:"w-50 m-1",children:[e("input",{type:"hidden",name:"sesskey",value:n}),e("input",{type:"hidden",name:"currentuser",value:"1"}),e(o,{type:"submit",size:"lg",name:"approve",value:"1",variant:"primary",className:"w-100",label:p})]})]})}export{f as default};
