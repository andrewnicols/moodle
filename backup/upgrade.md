# API Changes for `backup/*`

## 4.0

- Backup UI labels now accept empty/whitespace-only contents.

## 3.11

- New setting called "Include permission overrides" has been implemented. The default
  settings is OFF for import, and ON for restore.

## 3.10

- Local plugins can now hook into a backup and restore process of grade items by
  using define_grade_item_plugin_structure method (See MDL-69418).
