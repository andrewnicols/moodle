# API Changes for the `mod_feedback` plugin

## 4.0

- The following files and classes within them have been deprecated in favour of dynamic forms:
  - edit_form.php
  - use_templ_form.php
- The page delete_template.php has been removed as it is now handled within manage_templates.php

## 3.11

The $extradetails parameter in the constructor of the mod_feedback\output\summary class has been deprecated and is not used anymore.

## 3.8

- The following functions have been finally deprecated and can not be used anymore:
  - feedback_scale_used()
