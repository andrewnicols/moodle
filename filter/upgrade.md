# API Changes for the `core_filters` system and plugintype

## 4.0

- The Word censorship (filter_censor) filter has been completely removed from core. It has been moved to the plugins database
repository, so it can still be installed as a third-party plugin.

## 3.9

- The following functions, previously used (exclusively) by upgrade steps are not available anymore because of the upgrade cleanup performed for this version. See MDL-65809 for more info:
  - filter_mathjaxloader_upgrade_cdn_cloudflare()
  - filter_mathjaxloader_upgrade_mathjaxconfig_equal()
