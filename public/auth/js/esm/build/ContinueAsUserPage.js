import o from"@moodle/lms/core/String";import U from"@moodle/lms/core_auth/local/LoginForm/Logo";import P from"@moodle/lms/core_auth/local/LoginForm/Maintenance";import d from"@moodle/lms/core_auth/local/LoginForm/ErrorInfo";import C from"@moodle/lms/core_auth/local/LoginForm/LanguageMenu";import N from"@moodle/lms/core_auth/local/LoginForm/CookiesNotice";import h from"@moodle/lms/core_auth/local/OAuth2/UserInfo";import H from"@moodle/lms/core_auth/local/OAuth2/ContinueForm";import{jsx as r,jsxs as k}from"react/jsx-runtime";/**
 * The OAuth2 "continue as this user" page, shown when a user visiting the OAuth2 login page
 * is already logged in.
 *
 * @module     core_auth/ContinueAsUserPage
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function M({logoUrl:t,siteName:e,maintenance:i,error:s,errorTitle:l,info:a,clientName:m,userPictureHtml:g,userFullName:n,actionUrl:u,logoutUrl:c,sesskey:f,languageMenuHtml:p}){return k("div",{className:"loginform",children:[r(U,{logoUrl:t,siteName:e}),r("h2",{children:r(o,{identifier:"oauth2:confirmscopes:clientaccesstitle",component:"core",params:{clientname:m,sitename:e}})}),r(h,{userPictureHtml:g}),r(P,{maintenance:i}),r(d,{error:s,errorTitle:l,info:a}),r("p",{children:r(o,{identifier:"oauth2:continueasuserinfo",component:"core",params:n})}),r(H,{actionUrl:u,logoutUrl:c,sesskey:f,fullName:n}),r(C,{languageMenuHtml:p}),r(N,{})]})}export{M as default};
