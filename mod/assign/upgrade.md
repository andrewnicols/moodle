# API Changes for the `mod_assign` plugin

## 4.0

- The method \assign::grading_disabled() now has optional $gradinginfo parameter to improve performance
- Renderer (renderer.php) has been moved from mod root to classes/output/ to be more PSR compliant.
- Class assign_header has been moved from renderable.php to classes/ouput/assign_header.php
- Class assign_submion_status has been moved from renderable.php to classes/ouput/assign_submion_status.php
- The external functions mod_assign_external::list_participants and mod_assign_external::get_participant now return a new field
  "submissionstatus" indicating the submission status (new, draft, reopened or submitted). Empty when not submitted.

## 3.9

- The following functions, previously used (exclusively) by upgrade steps are not available anymore because of the upgrade cleanup performed for this version. See MDL-65809 for more info:
  - get_assignments_with_rescaled_null_grades()

## 3.8

- The allow_image_conversion method has been added to the submissionplugins. It determines whether the submission plugin
  allows image conversion or not. By default conversion is not allowed (except when overwritten in the submission plugin)
- Webservice function mod_assign_get_submission_status, return value 'warnofungroupedusers', changed from PARAM_BOOL to PARAM_ALPHA. See the description for possible values.
- The following functions have been finally deprecated and can not be used anymore:
  - assign_scale_used()

## 3.7

- Submissions plugins should implement the "remove" function to remove data when "Remove submission" is used.
