import{useEffect as p,useState as t}from"react";import{Button as o}from"@moodlehq/design-system";import{getString as a}from"@moodle/lms/core/stringUtils";import{jsx as e,jsxs as n}from"react/jsx-runtime";/**
 * The "Continue" / "Cancel" form shown at the bottom of the OAuth2 confirm scopes page.
 *
 * @module     core_auth/local/OAuth2/ConfirmScopesForm
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function u({actionUrl:r,sesskey:s}){const[m,i]=t(""),[c,l]=t("");return p(()=>{a("continue","core").then(i),a("cancel","core").then(l)},[]),n("form",{method:"post",action:r,children:[e("input",{type:"hidden",name:"sesskey",value:s}),n("div",{className:"login-form-submit mb-3 mt-3",children:[e(o,{type:"submit",size:"lg",name:"approve",value:"1",variant:"secondary",className:"w-100 mb-3",label:m}),e(o,{type:"submit",size:"lg",name:"approve",value:"0",variant:"primary",className:"w-100 mb-3",label:c})]})]})}export{u as default};
