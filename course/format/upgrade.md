# API Changes for the `core_courseformat` system and plugintype

## 4.0

- New core_courseformat\base::uses_course_index() to define whether the course format uses course index or not.
- New core_courseformat\base::supports_components() to specify if the format is compatible with reactive components.
- New core_courseformat\base::uses_indentation() to specify if the format is compatible with activity indentation.
- New core_courseformat\base::get_course_display() if the course uses COURSE_DISPLAY_SINGLEPAGE or COURSE_DISPLAY_MULTIPAGE layout.

## 3.10

- Added the missing callback supports_ajax() to format_social.

## 3.9

- The following functions, previously used (exclusively) by upgrade steps are not available anymore because of the upgrade cleanup performed for this version. See MDL-65809 for more info:
  - format_topics_upgrade_remove_numsections()
  - format_topics_upgrade_hide_extra_sections()
  - format_topics_upgrade_add_empty_sections()
  - format_weeks_upgrade_remove_numsections()
  - format_weeks_upgrade_hide_extra_sections()
  - format_weeks_upgrade_add_empty_sections()
- The non-ajax controls to add resources and activities are now rendered only when needed, such as when the user
  preference is set, or when the theme sets $THEME->enablecourseajaxtheme to false. Formats which directly access
  the '.section_add_menus' element or its children should be updated accordingly.

- section_header() now needs to include 'data-sectionid' => $section->section in the .section li to ensure correct section
  selection for the Activity Chooser.

## 3.8

- The following functions have been finally deprecated and can not be used anymore:
  - section_edit_controls()
