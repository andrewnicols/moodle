# API Changes for the `tool_mobile` plugin

This files describes changes in tool_mobile code.

## 4.0

- The function tool_mobile\api::get_qrlogin_key() now requires as parameter an object with all the mobile plugin settings.
- The tool_mobile_external::get_config external function now returns the tool_mobile_autologinmintimebetweenreq setting.
- External function tool_mobile::get_config now returns the enabledashboard setting.

## 3.7

- New external function tool_mobile::tool_mobile_call_external_function allows calling multiple external functions and returns all responses.
- External function tool_mobile::get_autologin_key now only works if the request comes from the Moodle mobile or desktop app.
  This increases confidence that requests did originate from the mobile app, decreasing the likelihood of an XSS attack.
  If you want to use this functionality, please override the Web Service via the override_webservice_execution callback although
  this is not recommended or encouraged.
