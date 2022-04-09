# API Changes for the `core_repository` system and plugintype

## 4.0

- The repository_boxnet has been completely removed.
- The repository_picasa has been completely removed (Picasa is discontinued since 2016).
- The skydrive repository has been completely removed from core. It has been moved to the plugins database repository, so
it can still be installed as a third-party plugin.
- Methods can_import_skydrive_files() and import_skydrive_files have been deprecated from repository_onedrive. The feature For
importing files from repository_skydrive to repository_onedrive will be completely removed in Moodle 4.4.

## 3.11

- The Google Drive repository now includes a new rest API function 'shared_drives_list', which can be used to fetch
  a list of existing shared drives.
- The Google Drive repository now supports browsing and searching for content from shared drives.
- The method build_breadcrumb() in repository/googledocs/lib.php has been deprecated, please use get_navigation()
  from the googledocs repository content classes instead.
- The method build_node_path() in repository/googledocs/lib.php has been deprecated, please use
  \repository_googledocs\helper::build_node_path() instead.
- The method explode_node_path() in repository/googledocs/lib.php has been deprecated, please use
  \repository_googledocs\helper::explode_node_path() instead.
- The function query() in repository/googledocs/lib.php is deprecated, please use get_content_nodes() from the
  googledocs repository content classes instead.
