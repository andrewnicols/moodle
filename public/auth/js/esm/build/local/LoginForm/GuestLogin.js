import{useEffect as n,useState as u}from"react";import{Button as l}from"@moodlehq/design-system";import{getString as m}from"@moodle/lms/core/stringUtils";import{requireAsync as g}from"@moodle/lms/core/amd";import{jsx as t,jsxs as p}from"react/jsx-runtime";/**
 * The "Log in as a guest" button and form.
 *
 * @module     core_auth/local/LoginForm/GuestLogin
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function f({canLoginAsGuest:e,actionUrl:i,loginToken:o}){const[r,a]=u("");return n(()=>{e&&m("loginasguest").then(a)},[e]),n(()=>{e&&g("core_form/submit").then(s=>{s.init("loginguestbtn")})},[e]),e?p("form",{action:i,method:"post",id:"guestlogin",className:"mb-4",children:[t("input",{type:"hidden",name:"logintoken",value:o}),t("input",{type:"hidden",name:"username",value:"guest"}),t("input",{type:"hidden",name:"password",value:"guest"}),t(l,{type:"submit",id:"loginguestbtn",variant:"outline-secondary",className:"w-100",startIcon:t("i",{className:"fa fa-user me-2","aria-hidden":"true"}),label:r,size:"lg"})]}):null}export{f as default};
