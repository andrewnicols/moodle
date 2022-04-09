# API Changes for the `core_auth` system and plugintype

## 3.9

- The following functions, previously used (exclusively) by upgrade steps are not available anymore because of the upgrade cleanup performed for this version. See MDL-65809 for more info:
  - upgrade_fix_config_auth_plugin_names()
  - upgrade_fix_config_auth_plugin_defaults()

## 3.7

- get_password_change_info() method is added to the base class and returns an array containing the subject and body of the message
  to the user that contains instructions on how to change their password. Authentication plugins can override this method if needed.
