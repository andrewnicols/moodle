# API Changes for the `mod_lti` plugin

## 3.10

- Select Content supports multiple, allowing a tool to return more than one link at a time.
  Parameter multiple in function lti_build_content_item_selection_request() is now set to true.
- Deprecated unused function after external function, 'get_tool_proxies()', was refactored:
  - serialise_tool_proxy()

## 3.8

- The following functions have been finally deprecated and can not be used anymore:
  - lti_scale_used()

## 3.7

- Deprecated functions to add support for LTI 1 tools to access services:
  - mod_lti\local\ltiservice\service_base->check_tool_proxy()
  - mod_lti\local\ltiservice\service_base->check_type()
  - mod_lti\local\ltiservice\resource_base->check_tool_proxy()
  - mod_lti\local\ltiservice\resource_base->check_type()
  - mod_lti_edit_types_form->get_lti_advantage_services()
    replaced by:
  - mod_lti\local\ltiservice\service_base->check_tool()
  - mod_lti\local\ltiservice\resource_base->check_tool()
  - mod_lti_edit_types_form->get_lti_services()
- Deprecated unused function:
  - mod_lti\local\ltiservice\service_base->get_configuration_parameter_names()
- Deprecated functions to simplify implementation of LTI scopes for accessing services:
  - mod_lti\local\ltiservice\resource_base->get_permissions()
  - ltiservice_gradebookservices\local\resources\lineitem\get_permissions()
  - ltiservice_gradebookservices\local\resources\lineitems\get_permissions()
  - ltiservice_gradebookservices\local\resources\results\get_permissions()
  - ltiservice_gradebookservices\local\resources\scores\get_permissions()
  - ltiservice_memberships\local\resources\contextmemberships\get_permissions()
    replaced by:
  - mod_lti\local\ltiservice\service_base->get_permitted_scopes()
  - ltiservice_gradebookservices\local\service\gradebookservices->get_permitted_scopes()
  - ltiservice_memberships\local\service\memberships\->get_permitted_scopes()
- Deprecated function to remove definition as static:
  - ltiservice_memberships\local\service\memberships\get_users_json()
    replaced by:
  - ltiservice_memberships\local\service\memberships\get_members_json()
