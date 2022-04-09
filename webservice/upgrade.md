# API Changes for the `core_webservice` system and plugintype

This information is intended for authors of webservices, not people writing webservice clients.

## 4.0

- User access related exceptions have been changed to use the moodle_exception class instead of the generic webservice_access_exception,
  the main reason for this change is to allow clients to implement some code logic against an access error.

## 3.11

- The method webservice::get_user_capabilities() is deprecated now without a replacement. It has been used
  internally only to populate the list of missing capabilities. That functionality has been improved so that
  it no longer needs this standalone method.

## 3.10

- The class externallib_advanced_testcase, used in unit tests, has a new function called "configure_filters" to easily configure filters for external functions testing.

## 3.8

- Ajax calls can now specify a cache key. This allows for better caching capabilities on servers. If a cache key
  is passed and the web service call does not require the user to be logged in we will attempt to use GET for the
  request. This allows for things like proxy caching on URLs. The cache key must be changed if we do not want to
  retrieve what has been cached and want to perform the request again.
- External function core_webservice_external::get_site_info() now returns the user private access key "userprivateaccesskey".
  This key could be used for fetching files via the tokenpluginfile.php script instead webservice/pluginfile.php to avoid
  multiple GET requests that include the WS token as a visible parameter.
- External function core_webservice_external::get_site_info() now returns a new field "userissiteadmin" indicating if
  the current user is a site administrator.

## 3.7

- External function core_webservice_external::get_site_info() now returns the current site theme (for the user).
