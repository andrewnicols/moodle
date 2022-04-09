# API Changes for the `core_admin` subsystem

## 3.11

- New admin setting admin_setting_encryptedpassword allows passwords in admin settings to be
  encrypted (with the new \core\encryption API) so that even the admin cannot read them.
- Web services administration has been moved from Plugins into the Server category. If you have
  Behat tests containing steps like `Given I navigate to "Plugins > Web services > ..."`, you will
  want to replace them with `Given I navigate to "Server > Web services > ..."`.

## 3.9

- The following functions, previously used (exclusively) by upgrade steps are not available anymore because of the upgrade cleanup performed for this version. See MDL-65809 for more info:
  - upgrade_fix_block_instance_configuration()
  - upgrade_theme_is_from_family()
  - upgrade_find_theme_location()
  - linkcoursesectionsupgradescriptwasrun setting
  - upgrade_block_positions()

## 3.8

- Admin setting "Open to Google" (opentogoogle) has been renamed to the more generic "Open to search engines" (opentowebcrawlers).
  This is a more accurate representation of what is being set and the config string has also been moved and updated to reflect this.

## 3.7

- Admin setting "Allow blocks to use the dock" (allowblockstodock) has been removed & stings deprecated.
  Docking of blocks is no longer supported within the core themes (Boost, Classic).
  Please see MDL-64506 for further details.
