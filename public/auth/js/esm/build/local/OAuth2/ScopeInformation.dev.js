var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * The list of scopes requested by an OAuth2 client, and the information the user needs
 * to decide whether to trust that client.
 *
 * @module     core_auth/local/OAuth2/ScopeInformation
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useState } from "react";
import String from "@moodle/lms/core/String";
import { getString } from "@moodle/lms/core/stringUtils";
function ScopeInformation({
  clientName,
  siteName,
  requestedScopes,
  profileUrl,
  clientPrivacyUrl,
  clientTermsUrl
}) {
  const [reviewPoliciesHtml, setReviewPoliciesHtml] = useState("");
  const [moodleAccountHtml, setMoodleAccountHtml] = useState("");
  useEffect(() => {
    if (clientPrivacyUrl && clientTermsUrl) {
      getString("oauth2:confirmscopes:reviewpolicies", "core", {
        clientname: clientName,
        clientprivacypolicy: clientPrivacyUrl,
        clienttermsofservice: clientTermsUrl
      }).then(setReviewPoliciesHtml);
    }
  }, [clientName, clientPrivacyUrl, clientTermsUrl]);
  useEffect(() => {
    getString("oauth2:confirmscopes:moodleaccount", "core", {
      clientname: clientName,
      profilelink: profileUrl,
      sitename: siteName
    }).then(setMoodleAccountHtml);
  }, [clientName, profileUrl, siteName]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("h2", { className: "h4", children: /* @__PURE__ */ jsxDEV(String, { identifier: "oauth2:confirmscopes:beforelist", component: "core", params: { clientname: clientName } }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/OAuth2/ScopeInformation.tsx",
      lineNumber: 85,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/OAuth2/ScopeInformation.tsx",
      lineNumber: 84,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("ul", { children: requestedScopes.map((scope) => /* @__PURE__ */ jsxDEV("li", { children: scope.description }, scope.identifier, false, {
      fileName: "public/auth/js/esm/src/local/OAuth2/ScopeInformation.tsx",
      lineNumber: 90,
      columnNumber: 21
    }, this)) }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/OAuth2/ScopeInformation.tsx",
      lineNumber: 88,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("h2", { className: "h4", children: /* @__PURE__ */ jsxDEV(
      String,
      {
        identifier: "oauth2:confirmscopes:makesureyoutrust",
        component: "core",
        params: { clientname: clientName }
      },
      void 0,
      false,
      {
        fileName: "public/auth/js/esm/src/local/OAuth2/ScopeInformation.tsx",
        lineNumber: 95,
        columnNumber: 17
      },
      this
    ) }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/OAuth2/ScopeInformation.tsx",
      lineNumber: 94,
      columnNumber: 13
    }, this),
    clientPrivacyUrl && clientTermsUrl && // The string contains trusted links to the client's own privacy policy/terms.
    /* @__PURE__ */ jsxDEV("div", { dangerouslySetInnerHTML: { __html: reviewPoliciesHtml } }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/OAuth2/ScopeInformation.tsx",
      lineNumber: 104,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("div", { dangerouslySetInnerHTML: { __html: moodleAccountHtml } }, void 0, false, {
      fileName: "public/auth/js/esm/src/local/OAuth2/ScopeInformation.tsx",
      lineNumber: 108,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "public/auth/js/esm/src/local/OAuth2/ScopeInformation.tsx",
    lineNumber: 83,
    columnNumber: 9
  }, this);
}
__name(ScopeInformation, "ScopeInformation");
export {
  ScopeInformation as default
};
//# sourceMappingURL=ScopeInformation.dev.js.map
