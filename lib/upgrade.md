# API Changes for the `core` plugin

## 4.0

- To better detect wrong floats (like, for example, unformatted, using local-dependent separators ones) a number of
  gradebook functions now have stricter float type checking. All them will require now the "float" being passed to be
  a correct float value (numeric or string). Usually, that's achieved by using unformat_float() or
  PARAM_LOCALISEDFLOAT for all the user-entered grades before any processing on them. Functions affected are:
  - grade_format_gradevalue(), $value param (keeping it as optional/nullable).
  - grade_format_gradevalue_real(), $value param (keeping it as optional/nullable).
  - grade_format_gradevalue_percentage(), $value param (keeping it as optional/nullable).
  - grade_format_gradevalue_letter(), $value param (keeping it as optional/nullable).
  - grade_floats_different(), $f1 and $f2 params (keeping them as optional/nullable).
  - grade_floats_equal(), $f1 and $f2 params (keeping them as optional/nullable).
- The method action_menu->set_alignment() has been deprecated, please use action_menu->set_menu_left if you need a dropdown
  to align to the left of the dropdown button.
- The $OUTPUT->should_display_main_logo() function has been deprecated and should no longer be used.
- New method flexible_table::set_columnsattributes() has been introduced to add column attributes applied in every cell.
- New method flexible_table::get_row_cells_html() has been introduced, extracted from flexible_table::get_row_html
  so it can be overriden individually.
- Since Boxnet has been remove from core then boxnet_client() class has been removed from core too.
- New navigation classes to mimic the new navigation project. The existing navigation callbacks are still available and
  will be called. The following behaviour will be the new standard for nodes added via callbacks in Boost and Boost-based themes:
  - Module nodes added will be appended to the end and will appear within the More menu.
  - Course nodes added will also be appended and appear within the 'More' menu.
- The core/event events have been renamed and now fire native events, in addition to the legacy YUI and jQuery events.
  The following events have been renamed:
  - The BLOCK_CONTENT_UPDATED event has been replaced with a new native event in the `core_block/events` AMD module
    eventTypes.blockContentUpdated.
  - The EDITOR_CONTENT_RESTORED event has been replaced with a new native event in the `core_editor/events` AMD module
    eventTypes.editorContentRestored.
  - The FILTER_CONTENT_UPDATED event has been replaced with a new native event in the `core_filters/events` AMD module
    eventTypes.filterContentUpdated.
  - The FORM_FIELD_VALIDATION event has been replaced with a new native event in the `core_form/events` AMD module
    eventTypes.formFieldValidationFailed.
  - The FORM_SUBMIT_AJAX event has been replaced with a new native event in the `core_form/events` AMD module
    eventTypes.formSubmittedByJavascript.
- The block template now includues a block-instanceid data attribute.
- The core/event::getLegacyEvents() function has been deprecated and should no longer be used.
- Typo3 has now been removed. Use native mbstring or iconv functions.
- A new index has been added on mdl_user_preferences.name. This upgrade step might take some time on big sites.
- The completion_info function display_help_icon() which returned the 'Your progress' help icon has been deprecated and
  should no longer be used.
- The completion_info function print_help_icon() which has been deprecated since Moodle 2.0 should no longer be used.
- @babel/polyfill has been removed in favour of corejs@3.
- A new parameter $partialrebuild has been added to the rebuild_course_cache to invalidate the cache
  of the section or module only, not the whole course cache
- A new parameter $isbulkupdate has been added to the following functions:
  - grade_category::update()
  - grade_category::insert()
  - grade_grade::update()
  - grade_grade::insert()
  - grade_grade::notify_changed()
  - grade_item::insert()
  - grade_item::update()
  - grade_item::update_final_grade()
  - grade_item::update_raw_grade()
  - grade_object::update()
  - grade_object::insert()
  - grade_outcome::update()
  - grade_outcome::insert()
  - grade_scale::update()
  - grade_scale::insert()
  - grade_update()
  - completion_info::inform_grade_changed()
  - completion_info::update_state()
  - completion_info::internal_set_data()
    All functions except completion_info::internal_set_data() are only passing this parameter from very beginning of
    workflow (like grade report page where bulk grade update is possible) so this parameter is used in
    completion_info::internal_set_data() to decide if we need to mark completions instantly without waiting for cron.
- Following methods now return an int instead of bool:
  - completion_completion::_save()
  - completion_completion::mark_enrolled()
  - completion_completion::mark_inprogress()
  - completion_completion::mark_complete()
    which is needed to store id of completion record on successful update which is later beeing used by
    completion_info::internal_set_data() to reaggregate completions that have been marked for instant course completion.
- The following functions have been finally deprecated and can not be used anymore:
  - generate_uuid
- The YUI moodle-core-formchangechecker module has been deprecated and replaced with a new AMD module
  core_form/changechecker.
- New method \core_user::awaiting_action() has been introduced to check if the user is fully ready to use the site or
  whether there is an action (such as filling the missing profile field, changing password or agreeing to the site
  policy) needed.
- The signature of the get_name() function for grade_category and grade_item has been extended. The new parameter allows
  callers to get the name without escaped characters.
- The inplace_editable element constructor now accepts an optional pix_icon parameter to use as it's editing icon when
  rendered. The default icon for "select" types has also changed to a dropdown caret ("t/expanded").
- The inplace_editable Javascript module now emits native events, removing the jQuery dependency from calling code
  that wants to listen for the events. Backwards compatibility with existing code using jQuery is preserved.
- The function message_send() in messagelib.php now returns false if there is an error sending the message to the
  message processor (MDL-70046).
- Moodle 4.0 has major changes to the question bank. Therefore, there are major changes in questionlib.php
  and the core_question database tables. These are documented in detail in question/upgrade.txt.
- The postgres driver now wraps calls to pg_field_type() and caches them in databasemeta to save an invisible internal
  DB call on every request.
- The default type of 'core/toast' messages has been changed to 'information' (callers can still explicitely set the type)
- As the message_jabber notification plugin has been moved to the plugins database, the XMPPHP library (aka Jabber) has been
completely removed from Moodle core too.
- The SWF media player has been completely removed (The Flash Player was deprecated in 2017 and officially discontinued
  on 31 December 2020).
- The display_size function has been improved to add new optional parameters (decimal places,
  fixed units), to always include a non-breaking space between the number and unit, and to use
  consistent rounding (always 1 decimal place by default).
- The persistent method get() now returns the correct type for each property defined in the persistent class.
- The persistent method from_record() now only attempts to load record properties defined in the persistent class.
- New persistent set_many() helper for setting multiple properties in single method call.
- Require pass grade criteria is now part of core.
  Refer to upgrade.php to see transitioning from similar plugin criteria to core
  Refer to completion/upgrade.txt for additional information.
- The method enable_plugin() has been added to the core_plugininfo\base class and it has been implemented by all the plugininfo
classes extending it. When possible, the enable_plugin() method will store these changes into the config_log table, to let admins
check when and who has enabled/disabled plugins.
- Final deprecation: The following functions along with associated tests have been removed:
  - core_grades_external::get_grades
  - core_grades_external::get_grade_item
  - report_insights_context_insights
- \core\session\manager::init_empty_session() has a new optional parameter $newsid to indicate whether this is a new user session
- New html_table attribute "$responsive" which defaults to true. When set to true, tables created via html_writer::table() will be enclosed
  in a .table-responsive div container which will allow the table to be scrolled horizontally with ease, especially when the table is rendered in smaller viewports.
  Set to false to prevent the table from being enclosed in the responsive container.
- Two new helper functions have been added to lib/datalib.php, for safely preparing SQL ORDER BY statements where user
  interactions define sort parameters (see the respective docblocks for full details and examples):
  -get_safe_orderby() - where a single sort parameter is required.
  -get_safe_orderby_multiple() - where multiple sort parameters are required.
- Added the cleanstr mustache template helper to clean strings after loading them from language packs.
- The following behat functions have been modified to work with the new navigation
  - i_add_the_block
  - the_add_block_selector_should_contain_block
  - the_add_block_selector_should_contain_block
  - go_to_the_current_course_activity_completion_report
  - i_navigate_to_course_participants
  - i_go_to_advanced_grading_page
  - i_navigate_to_in_the_course_gradebook
  - should_exist_in_current_page_administration
  - should_not_exist_in_current_page_administration
  - go_to_main_course_page
  - select_on_administration_page
  - find_header_administration_menu
  - select_from_administration_menu
  - i_edit_the_lesson
  - i_add_a_question_filling_the_form_with
- The following behat step has been deprecated
  - i_select_from_flat_navigation_drawer
- The type for the "message" field in the external_warnings() structure has been changed from PARAM_TEXT to PARAM_RAW
- A new parameter $displayoptions has been added to the core_renderer::confirm() to allow better customization for confirming page
such as the title and strings for continue and cancel buttons.
- The method get_enabled_plugin($pluginname) has been added to the core_plugininfo\base class. It has a default implementation for
all the plugininfo classes and it can be overwritten when required (like it has been done with filter). This method returns the
current value for a pluginname depending on its status (enabled, disabled, other...).
- Unit Test coverage defaults have been updated to include some sensible defaults.
  The default values now include:
  - /classes/
  - /tests/generator/
  - /externallib.php
  - /lib.php
  - /locallib.php
  - /renderer.php
  - /rsslib.php
    This default applies both when there is no supplied coverage.php file, and is used to supplement any existing coverage configuration file if one is found.
- New method get_unaddable_by_theme_block_types() has been added to block_manager class. It uses the 'unaddableblocks' theme setting
value to get the list of blocks that won't be displayed for a theme.
- Loggedin / Loggedoff component settings on notification preferences have been merged to a single enabled switch:
  MESSAGE_DEFAULT_LOGGEDIN and MESSAGE_DEFAULT_LOGGEDOFF are now deprecated, so plugins should be updated if db/messages.php is present and replace
  MESSAGE_DEFAULT_LOGGEDIN + MESSAGE_DEFAULT_LOGGEDOFF to MESSAGE_DEFAULT_ENABLED. Backward compatibility will take any of both settings as enabled.
  MESSAGE_DEFAULT_PERMITTED also deprecated.
  core_message_get_user_notification_preferences and core_message_get_user_message_preferences Webservice are now returning enabled boolean on
  components > notifications > processors. loggedin and loggedoff are deprecated but present for backward compatibility.
- A new parameter $strength of type int is added to method search_for_active_node. This parameter would help us to search for the active nodes based on the
  $strength passed to it.
- A new method get_page() has been added to the settings_navigation class. This method can be used to obtain the
  moodle_page object associated to the settings navigation.
- A new interface, `core\output\named_templatable` has been created to allow renderable classes to define a
  `get_template_name(\renderer_base): string` function which will inform the default render() function with a template
  name.
- The parameter $modinfo of the get_data method in completion_info class has been deprecated and is not used anymore.
- A new method, get_default_home_page(), has been added to moodlelib to get the default home page to display if current one is not
defined or can't be applied.
- A new language_menu renderable is created to handle collecting available languages and generating the menu for use in different situations
- New primary navigation classes to mimic the primary nav. Consists of the views/primary.php and output/primary.php. The
  base nodes are added within the views/primary.php while output/primary.php is a renderable that combines the primary
  view and the lang, user and any custom menu items.
  - The language menu now resides within the user menu.
- New primary and secondary magic getters/setters included in pagelib.php that also initialises the objects
- All secondary navigation nodes have a predefined ordering within the relevant context and are defined as a
  mapping construct within core\navigation\views\secondary. Secondary navigation ordering can be overridden by
  generating a custom secondary class within a plugin's {plugin}\local\views namespace. This is only applicable to the
  following plugin types and is automatically loaded:
  - Module - refer to mod_assign\local\views\secondary for examples and magic_get_secondarynav for calling code
  - Block - refer to core_block\local\views\secondary for examples and blocklib::get_secondarynav for calling code
    - Additionally a custom secondary object may be set using the convenient setters in pagelib.php.
    - Secondary nav nodes can be forced into the 'More' menu using the 'set_force_into_more_menu'. It is advisable to set
      this in the existing nav callbacks when generating the nodes. Alternately, the corresponding
      'get_default_{admin/course/module}_more_menu_nodes functions in secondary can be overridded to provide a custom set
      of node keys to push into the more menu
    - The secondary navigation can be omitted from a theme/page by setting $PAGE->set_secondary_navigation(false). e.g. admin/search.php and in classic.
    - Within a single activity course format, the course and module level secondary navigation options are displayed within
      dropdowns in the secondary navigation bar
  - New function 'get_overflow_menu_data' introduced in core\navigation\views\secondary to get additional/custom sub navigation
    to be displayed as a url_select for tertiary navigation.
- It is required that the action provided to navigation_node::create be of type moodle_url/action_link. Non conformance
  results in a debugging message being thrown.
- New page lib config '_navigationoverflow' and associated getters/setters to toggle whether the overflow menu is displayed
- New functions to explicitly set what tabs should be highlighted on the primary and secondary navigation
- Breadcrumbs modified to follow standards defined here https://www.nngroup.com/articles/breadcrumbs/
  - New navbar class in boost to follow the standards defined above.
- Settings cog have been removed and replaced with either secondary and tertiary navigation components
- New activity_header class to handle display of common content for plugins.
  - Handles display of the activity name, completion information and description.
  - New pagelib.php magic getters to fetch activity_header
  - New theme level config to govern display of the activity name $THEME->activityheaderconfig['notitle']
    - Default for boost is to show no activity title.
  - New page layout level option to handle display within activity header. Options should be defined
    within 'activityheader' and accept the following array keys:
    - notitle
    - nocompletion
    - nodescription
  - Convenient functions to set the parameters in the header OR hide them altogether.
- Category navigations has been updated with a preference of tertiary navigation components over buttons within the page
  content and/or context header actions
- A new 'My courses' page has been introduced which houses the course overview block
- Default blocks for dashboard has been updated. The page will now have the following in the corresponding region:
  - Calendar, Timeline - Center
  - Recently accessed courses - Side bar/blocks drawer
- Flat navigation classes have been marked for deprecation with the introduction of primary and secondary navigation concepts.
- A new method, force_lock_all_blocks(), has been added to the moodle_page class to allow pages to force the value of
  user_can_edit_blocks() to return false where necessary. This makes it possible to remove block editing on a page
  from ALL users, including admins, where required on pages with multi region layouts exist, such as "My courses".

## 3.11.4

- A new option dontforcesvgdownload has been added to the $options parameter of the send_file() function.
  Note: This option overrides the forced download of directly accessed SVGs, so should only be used where the calling method is
  rendering SVGs directly for content created using XSS risk flagged capabilities (such as creating a SCORM activity).
  This is also not necessary where SVGs are already being safely loaded into <img> tags by Moodle (eg within forum posts).

## 3.11.2

- For security reasons, filelib has been updated so all requests now use emulated redirects.
  For this reason, manually disabling emulateredirects will no longer have any effect (and will generate a debugging message).

## 3.11

- PHPUnit has been upgraded to 9.5 (see MDL-71036 for details).
  That comes with a few changes:
  - Breaking: All the changes that were deprecated with PHPUnit 8.5
    are now removed (see the 3.10 section below).
  - Breaking: assertContains() now performs stricter comparison (like assertSame()
    does). New assertContainsEquals() has been created to provide the old
    behavior.
  - Deprecation: A number of file-related assertions have been deprecated, will
    be removed with PHPUnit 10. Alternatives for all them have been created:
    - assertNotIsReadable()         -> assertIsNotReadable()
    - assertNotIsWritable()         -> assertIsNotWritable()
    - assertDirectoryNotExists()    -> assertDirectoryDoesNotExist()
    - assertDirectoryNotIsReadable()-> assertDirectoryIsNotReadable()
    - assertDirectoryNotIsWritable()-> assertDirectoryIsNotWritable()
    - assertFileNotExists()         -> assertFileDoesNotExist()
    - assertFileNotIsReadable()     -> assertFileIsNotReadable()
    - assertFileNotIsWritable()     -> assertFileIsNotWritable()
    - Deprecation: Regexp-related assertions have been deprecated, will be
      removed with PHPUnit 10. Alternatives for all them have been created:
    - assertRegExp()     -> assertMatchesRegularExpression()
    - assertNotRegExp()  -> assertDoesNotMatchRegularExpression()
    - Deprecation: The expectException() for Notice, Warning, Deprecation and
      Error is deprecated, will be removed with PHPUnit 10. New expectations
      have been created to better define the expectation:
    - expectDeprecation() for E_DEPRECATED and E_USER_DEPRECATED.
    - expectNotice() for E_NOTICE, E_USER_NOTICE, and E_STRICT.
    - expectWarning() for E_WARNING and E_USER_WARNING.
    - expectError() for everything else.
    - Deprecation: The Mock->at() matcher has been deprecated and will be
      removed with PHPUnit 10. Switch to better, more deterministic and clearer
      matchers is recommended (->once(), ->exactly(), ->never()...).
    - Deprecation: The Mock->setMethods() method has been *silently* deprecated
      and will be removed in the future. Change uses to the new Mock->onlyMethods()
      alternative. Also, it doesn't accept "null" anymore, new default must
      be [] (empty array).
    - Mostly internal: With the raise to PHP 7.3 as lower version supported,
      various internal bits perform now stricter type checking in params and
      return values. If your tests have own-created comparators, assertions...
      they may need to be adjusted.
    - Mostly internal: The phpunit.xml schema has changed, basically removing
      the old <filter> section and replacing it with a new, less confusing
      <coverage> section. Also the elements within them have been changed:
    - <whitelist> has been replaced by <include>.
    - <exclude> is not a child of <whitelist> anymore, but of <coverage>.
      Note that this only will affect if you've custom phpunit.xml files
      instead of using the automatically generated ones by Moodle.
    - Deprecation: Related to the previous point, the $whitelistxxx properties
      used by the coverage.php files have been deprecated (will continue
      working until Moodle 4.3) to follow the same pattern:
    - whitelistfolders -> includelistfolders
    - whitelistfiles   -> includelistfiles
    - Internal: Custom autoloaders are deprecated and will be removed with
      PHPUnit 10. Hence we have removed our one already.
      Note that it was not useful since PHPUnit 8.5, where the ability
      to run tests by class name was removed.
    - Warning: Because of some new restrictions about how test files and
      test classes must be named (that Moodle haven't followed ever) it's not
      possible to run individual test files any more. Use any of the alternative
      execution methods (filter, suite, config) to specify which tests
      you want to run. This will be hopefully fixed in MDL-71049
      once it has been agreed which the best way to proceed is.
  - The horde library has been updated to version 5.2.23.
- New optional parameter $extracontent for print_collapsible_region_start(). This allows developers to add interactive HTML elements
  (e.g. a help icon) after the collapsible region's toggle link.
- Final deprecation i_dock_block() in behat_deprecated.php
- Final deprecation of get_courses_page. Function has been removed and core_course_category::get_courses() should be
  used instead.
- New encryption API in \core\encryption allows secure encryption and decryption of data. By
  default the key is stored in moodledata but admins can configure a different, more secure
  location in config.php if required. To get the best possible security for this feature, we
  recommend enabling the Sodium PHP extension.
  The OpenSSL alternative for this API, used when Sodium is not available, is considered deprecated
  at all effects, and will be removed in Moodle 4.2. See MDL-71421 for more information.
- Behat timeout constants behat_base::TIMEOUT, EXTENDED_TIMEOUT, and REDUCED_TIMEOUT, which were deprecated in 3.7, have been removed.
- \core_table\local\filter\filterset::JOINTYPE_DEFAULT is being changed from 1 (ANY) to 2 (ALL). Filterset implementations
  can override the default filterset join type by overriding \core_table\local\filter\filterset::get_join_type() instead.
- HTMLPurifier has been upgraded to the latest version - 4.13.0
- Markdown lib has been upgraded to the latest version - 1.9.0
- The minify lib has been upgraded to 1.3.63 and pathconvertor to 1.1.3
- A new optional parameter `$sort` has been added to all `$context->get_capabilities()` methods to be able to define order of
  returned capability array.
- Spout has been upgraded to the latest version - 3.1.0
- emoji-data has been upgraded to 6.0.0.
- The final deprecation of /message/defaultoutputs.php file and admin_page_defaultmessageoutputs.
  All their settings moved to admin/message.php (see MDL-64495). Please use admin_page_managemessageoutputs class instead.
- Behat now supports date selection from the date form element. Examples:
  - I set the field "<field_string>" to "##15 March 2021##"
  - I set the field "<field_string>" to "##first day of January last year##"
- Behat now supports date and time selection from the datetime form element. Examples:
  - I set the field "<field_string>" to "##15 March 2021 08:15##"
  - I set the field "<field_string>" to "##first day of January last year noon##"
- New DML driver method `$DB->sql_group_concat` for performing group concatenation of a field within a SQL query
- Added new class, AMD modules and WS that allow displaying forms in modal popups or load and submit in AJAX requests.
  See https://docs.moodle.org/dev/Modal_and_AJAX_forms for more details.
- New base class for defining an activity's custom completion requirements: \core_completion\activity_custom_completion.
  Activity module plugins that define custom completion conditions should implement a mod_[modname]\completion\custom_completion
  subclass and the following methods:
  - get_state(): Provides the completion state for a given custom completion rule.
  - get_defined_custom_rules(): Returns an array of the activity module's custom completion rules.
    e.g. ['completionsubmit']
  - get_custom_rule_descriptions(): Returns an associative array with values containing the user-facing textual description
    of the custom completion rules (which serve as the keys to these values).
    e.g. ['completionsubmit' => 'Must submit']
  - get_sort_order(): Returns an array listing the order the activity module's completion rules should be displayed to the user,
    including both custom completion and relevant core completion rules
    e.g. ['completionview', 'completionsubmit', 'completionusegrade']
- Admin setting admin_setting_configmulticheckbox now supports lazy-loading the options list by
  supplying a callback function instead of an array of options.
- A new core API class \core_user\fields provides ways to get lists of user fields, and SQL related to
  those fields. This replaces existing functions get_extra_user_fields(), get_extra_user_fields_sql(),
  get_user_field_name(), get_all_user_name_fields(), and user_picture::fields(), which have all been
  deprecated.
- Allow plugins to augment the curl security helper via callback. The plugin's function has to be defined as
  plugintype_pluginname_curl_security_helper in pluginname/lib.php file and the function should return a plugin's security
  helper instance.
- The behat transformation 'string time to timestamp' no longer supports datetime format. If provided, the format must
  be strftime compatible. Example:
  - I should see "##tomorrow noon##%A, %d %B %Y, %I:%M %p##"
- External functions implementation classes should use 'execute' as the method name, in which case the
  'methodname' property should not be specified in db/services.php file.
- The core_grades_create_gradecategory webservice has been deprecated in favour of core_grades_create_gradecategories, which is
  functionally identical but allows for parallel gradecategory creations by supplying a data array to the webservice.
- The signature of the get_context_name() function in the abstract class context and all extending classes (such as context_course)
  has been extended. The new parameter allows the to get the name without escaped characters.
- The signature of the question_category_options() has been extended. The new parameter allows the to get the categories name
  in the returned array without escaped characters.
- The \core\hub\site_registration_form::add_select_with_email() method has been deprecated in favour of
  \core\hub\site_registration_form::add_checkbox_with_email().

## 3.10

- PHPUnit has been upgraded to 8.5. That comes with a few changes:
  - Breaking change: All the "template methods" (setUp(), tearDown()...) now require to return void. This implies
    that the minimum version of PHP able to run tests will be PHP 7.1
  - A good number of assertions have been deprecated with this version
    and will be removed in a future one. In core all cases have been removed
    (so it's deprecation-warnings free). It's recommended to perform the
    switch to their new counterparts ASAP:
    - assertInternalType() has been deprecated. Use the assertIsXXX() methods instead.
    - assertArraySubset() has been deprecated. Use looping + assertArrayHasKey() or similar.
    - @expectedExceptionXXX annotations have been deprecated. Use the expectExceptionXXX()
      methods instead (and put them exactly before the line that is expected to throw the exception).
    - assertAttributeXXX() have been deprecated. If testing public attributes use normal assertions. If
      testing non-public attributes... you're doing something wrong :-)
    - assertContains() to find substrings on strings has been deprecated. Use assertStringContainsString() instead.
      (note that there are "IgnoringCase()" variants to perform case-insensitive matching.
    - assertEquals() extra params have been deprecated and new assertions for them created:
    - delta => use assertEqualsWithDelta()
    - canonicalize => use assertEqualsCanonicalizing()
    - ignoreCase => use assertEqualsIgnoringCase()
    - maxDepth => removed without replacement.
    - The custom printer that was used to show how to rerun a failure has been removed, it was old and "hacky"
      solution, for more information about how to run tests, see the docs, there are plenty of options.
    - phpunit/dbunit is not available any more and it has been replaced by a lightweight phpunit_dataset class, able to
      load XML/CSV and PHP arrays, send the to database and return rows to calling code (in tests). That implies the
      follwoing changes in the advanced_testcase class:
    - createFlatXMLDataSet() has been removed. No uses in core, uses can switch to createXMLDataSet() (read below).
    - createXMLDataSet() has been deprecated. Use dataset_from_files() instead.
    - createCsvDataSet() has been deprecated. Use dataset_from_files() instead.
    - createArrayDataSet() has been deprecated. This method was using the phpunit_ArrayDataSet class
      that has been also removed from core. Use dataset_from_array() instead.
    - loadDataSet() has been deprecated. Use phpunit_dataset->to_database() instead.
    - All the previous uses of phpunit/dbunit methods like Dataset:getRows(), Dataset::getRowCount()
      must be replaced by the new phpunit_dataset->get_rows() method.
  - Retains the source course id when a course is copied from another course on the same site.
- Added function setScrollable in core/modal. This function can be used to set the modal's body to be scrollable or not
  when the modal's height exceeds the browser's height. This is also supported in core/modal_factory through the
  'scrollable' config parameter which can be set to either true or false. If not explicitly defined, the default value
  of 'scrollable' is true.
- The `$CFG->behat_retart_browser_after` configuration setting has been removed.
  The browser session is now restarted between all tests.
- add_to_log() has been through final deprecation, please rewrite your code to the new events API.
- The following functions have been finally deprecated and can not be used anymore:
  - print_textarea
  - calendar_get_all_allowed_types
  - groups_get_all_groups_for_courses
  - events_get_cached
  - events_uninstall
  - events_cleanup
  - events_dequeue
  - events_get_handlers
  - get_roles_on_exact_context
  - get_roles_with_assignment_on_context
  - message_add_contact
  - message_remove_contact
  - message_unblock_contact
  - message_block_contact
  - message_get_contact
- The following renamed classes have been completely removed:
  - course_in_list (now: core_course_list_element)
  - coursecat (now: core_course_category)
- The form element 'htmleditor', which was deprecated in 3.6, has been removed.
- The `core_output_load_fontawesome_icon_map` web service has been deprecated and replaced by
  `core_output_load_fontawesome_icon_system_map` which takes the name of the theme to generate the icon system map for.
- A new parameter `$rolenamedisplay` has been added to `get_viewable_roles()` and `get_switchable_roles` to define how role names
  should be returned.
- The class coursecat_sortable_records has been removed.
- Admin setting admin_setting_configselect now supports lazy-loading the options list by supplying
  a callback function instead of an array of options.
- Admin setting admin_setting_configselect now supports validating the selection by supplying a
  callback function.
- The task system has new functions adhoc_task_starting() and scheduled_task_starting() which must
  be called before executing a task, and a new function \core\task\manager::get_running_tasks()
  returns information about currently-running tasks.
- New library function rename_to_unused_name() to rename a file within its current location.
- Constant \core_h5p\file_storage::EDITOR_FILEAREA has been deprecated
  because it's not required any more.
- The ZipStream-PHP library has been added to Moodle core in /lib/zipstream.
- The php-enum library has been added to Moodle core in /lib/php-enum.
- The http-message library has been added to Moodle core in /lib/http-message.
- Methods `filetypes_util::is_whitelisted()` and `filetypes_util::get_not_whitelisted()` have been deprecated and
  renamed to `is_listed()` and `get_not_listed()` respectively.
- Method `mustache_helper_collection::strip_blacklisted_helpers()` has been deprecated and renamed to
  `strip_disallowed_helpers()`.
- A new admin externalpage type `\core_admin\local\externalpage\accesscallback` for use in plugin settings is available that allows
  a callback to be provided to determine whether page can be accessed.
- New setting $CFG->localrequestdir overrides which defaults to sys_get_temp_dir()
- Function redirect() now emits a line of backtrace into the X-Redirect-By header when debugging is on
- New DML function $DB->delete_records_subquery() to delete records based on a subquery in a way
  that will work across databases.
- Add support for email DKIM signatures via $CFG->emaildkimselector

## 3.9

- Following function has been deprecated, please use \core\task\manager::run_from_cli().
  - cron_run_single_task()
- Following class has been deprecated, please use \core\task\manager.
  - \tool_task\run_from_cli
- Following CLI scripts has been deprecated:
  - admin/tool/task/cli/schedule_task.php please use admin/cli/scheduled_task.php
  - admin/tool/task/cli/adhoc_task.php please use admin/cli/adhoc_task.php
- Old Safe Exam Browser quiz access rule (quizaccess_safebrowser) replaced by new Safe Exam Browser access rule (quizaccess_seb).
  Experimental setting enablesafebrowserintegration was deleted.
- New CFPropertyList library has been added to Moodle core in /lib/plist.
- behat_data_generators::the_following_exist() has been removed, please use
  behat_data_generators::the_following_entities_exist() instead. See MDL-67691 for more info.
- admin/tool/task/cli/adhoc_task.php now observers the concurrency limits.
  If you want to get the previous (unlimited) behavior, use the --ignorelimits switch).
- Removed the following deprecated functions:
  - question_add_tops
  - question_is_only_toplevel_category_in_context
- format_float() now accepts a special value (-1) as the $decimalpoints parameter
  which means auto-detecting number of decimal points.
- plagiarism_save_form_elements() has been deprecated. Please use {plugin name}_coursemodule_edit_post_actions() instead.
- plagiarism_get_form_elements_module() has been deprecated. Please use {plugin name}_coursemodule_standard_elements() instead.
- Changed default sessiontimeout to 8 hours to cover most normal working days
- Plugins can now explicitly declare supported and incompatible Moodle versions in version.php
  - $plugin->supported = [37,39];
    supported takes an array of ascending numbers, that correspond to a range of branch numbers of supported versions, inclusive.
    Moodle versions that are outside of this range will produce a message notifying at install time, but will allow for installation.
  - $plugin->incompatible = 36;
    incompatible takes a single int corresponding to the first incompatible branch. Any Moodle versions including and
    above this will be prevented from installing the plugin, and a message will be given when attempting installation.
- Added the <component>_bulk_user_actions() callback which returns a list of custom action_links objects
- Add 'required' admin flag for mod forms allows elements to be toggled between being required or not in admin settings.
  - In mod settings, along with lock, advanced flags, the required flag can now be set with $setting->set_required_flag_options().
    The name of the admin setting must be exactly the same as the mod_form element.
  - Currently supported by:
    - mod_assign
    - mod_quiz
  - Added a native MySQL / MariaDB lock implementation
- The database drivers (moodle_database and subclasses) don't need to implement get_columns() anymore.
  They have to implement fetch_columns instead.
- Added function cleanup_after_drop to the database_manager class to take care of all the cleanups that need to be done after a table is dropped.
- The 'xxxx_check_password_policy' callback now only fires if $CFG->passwordpolicy is true
- grade_item::update_final_grade() can now take an optional parameter to set the grade->timemodified. If not present the current time will carry on being used.
- lib/outputrequirementslib::get_jsrev now is public, it can be called from other classes.
- H5P libraries have been moved from /lib/h5p to h5p/h5plib as an h5plib plugintype.
- mdn-polyfills has been renamed to polyfills. The reason there is no polyfill from the MDN is
  because there is no example polyfills on the MDN for this functionality.
- AJAX pages can be called without requiring a session lock if they set READ_ONLY_SESSION to true, eg.
  define('READ_ONLY_SESSION', true); Note - this also requires $CFG->enable_read_only_sessions to be set to true.
- External functions can be called without requiring a session lock if they define 'readonlysession' => true in
  db/services.php. Note - this also requires $CFG->enable_read_only_sessions to be set to true.
- database_manager::check_database_schema() now checks for missing and extra indexes.
- Implement a more direct xsendfile_file() method for an alternative_file_system_class
- A new `dynamic` table interface has been defined, which allows any `flexible_table` to be converted into a table which
  is updatable via ajax calls. See MDL-68495 and `\core_table\dynamic` for further information.
- The core/notification module has been updated to use AMD modals for its confirmation and alert dialogues.
  The confirmation dialogue no longer has a configurable "No" button as per similar changes in MDL-59759.
  This set of confirmation modals was unintentionally missed from that deprecation process.
- The download_as_dataformat() method has been deprecated. Please use \core\dataformat::download_data() instead
- The following functions have been updated to support passing in an array of group IDs (but still support passing in a single ID):
  - groups_get_members_join()
  - groups_get_members_ids_sql()
- Additional parameters were added to core_get_user_dates:
  - type: specifies the calendar type. Optional, defaults to Gregorian.
  - fixday: Whether to remove leading zero for day. Optional, defaults to 1.
  - fixhour: Whether to remove leading zero for hour. Optional, defaults to 1.
- Legacy cron has been deprecated and will be removed in Moodle 4.1. This includes the functions:
  - cron_execute_plugin_type()
  - cron_bc_hack_plugin_functions()
    Please, use the Task API instead: https://docs.moodle.org/dev/Task_API
- Introduce new hooks for plugin developers:
  - <component>_can_course_category_delete($category)
  - <component>_can_course_category_delete_move($category, $newcategory)
    These hooks allow plugin developers greater control over category deletion. Plugin can return false in those
    functions if category deletion or deletion with content move to the new parent category is not permitted.
    Both $category and $newcategory params are instances of core_course_category class.
  - <component>_pre_course_category_delete_move($category, $newcategory)
    This hook is expanding functionality of existing <component>_pre_course_category_delete hook and allow plugin developers
    to execute code prior to category deletion when its content is moved to another category.
    Both $category and $newcategory params are instances of core_course_category class.
  - <component>_get_course_category_contents($category)
    This hook allow plugin developers to add information that is displayed on category deletion form. Function should
    return string, which will be added to the list of category contents shown on the form. $category param is an instance
    of core_course_category class.
- Data generator create_user in both unittests and behat now validates user fields and triggers user_created event

## 3.8

- Add CLI option to notify all cron tasks to stop: admin/cli/cron.php --stop
- The rotate_image function has been added to the stored_file class (MDL-63349)
- The yui checknet module is removed. Call \core\session\manager::keepalive instead.
- The generate_uuid() function has been deprecated. Please use \core\uuid::generate() instead.
- Remove lib/pear/auth/RADIUS.php (MDL-65746)
- Core components are now defined in /lib/components.json instead of coded into /lib/classes/component.php
- Subplugins should now be defined using /db/subplugins.json instead of /db/subplugins.php
- The following functions have been finally deprecated and can not be used anymore:
  - allow_override()
  - allow_assign()
  - allow_switch()
  - https_required()
  - verify_https_required()
- Remove duplicate font-awesome SCSS, Please see /theme/boost/scss/fontawesome for usage (MDL-65936)
- Remove lib/pear/Crypt/CHAP.php (MDL-65747)
- New output component available: \core\output\checkbox_toggleall
  - This allows developers to easily output groups of checkboxes that can be toggled by master controls in the form of a checkbox or
    a button. Action elements which perform actions on the selected checkboxes can also be enabled/disabled depending on whether
    at least a single checkbox item is selected or not.
- Final deprecation (removal) of the core/modal_confirm dialogue.
- Upgrade scssphp to v1.0.2, This involves renaming classes from Leafo => ScssPhp as the repo has changed.
- Implement supports_xsendfile() method and allow support for xsendfile in alternative_file_system_class
  independently of local files (MDL-66304).
- The methods get_local_path_from_storedfile and get_remote_path_from_storedfile in lib/filestore/file_system.php
  are now public. If you are overriding these then you will need to change your methods to public in your class.
- It is now possible to use sub-directories for AMD modules.
  The standard rules for Level 2 namespaces also apply to AMD modules.
  The sub-directory used must be either an valid component, or placed inside a 'local' directory to ensure that it does not conflict with other components.

    The following are all valid module names and locations in your plugin:
mod_forum/view: mod/forum/amd/src/view.js
mod_forum/local/views/post: mod/forum/amd/src/local/views/post
mod_forum/form/checkbox-toggle: mod/forum/amd/src/form/checkbox-toggle.js

    The following are all invalid module names and locations in your plugin:
mod_forum/views/post: mod/forum/amd/src/views/post
- The 'xxxx_check_password_policy' method now has an extra parameter: $user. It contains the user object to perform password
validation against and defaults to null (so, no user needed) if not provided.
- It is now possible to use sub-directories when creating mustache templates.
  The standard rules for Level 2 namespaces also apply to templates.
  The sub-directory used must be either an valid component, or placed inside a 'local' directory to ensure that it does not conflict with other components.

    The following are all valid template names and locations in your plugin:
mod_forum/forum_post: mod/forum/templates/forum_post.mustache
mod_forum/local/post/user: mod/forum/templates/local/post/user.mustache
mod_forum/form/checkbox_toggle: mod/forum/templates/form/checkbox_toggle.mustache

    The following are _invalid_ template names and locations:
mod_forum/post/user: mod/forum/templates/local/post/user.mustache
- Following behat steps have been removed from core:
  - I go to "<gradepath_string>" in the course gradebook
- A new admin setting widget 'core_admin\local\settings\filesize' is added.
- Core capabilities 'moodle/community:add' and 'moodle/community:download' have been removed from core as part of Moodle.net sunsetting.
- As part of Moodle.net sunsetting process the following hub api functions have been deprecated:
  - get_courses
  - unregister_courses
  - register_course
  - add_screenshot
  - download_course_backup
  - upload_course_backup
- A new setting 'Cache templates' was added (see MDL-66367). This setting determines if templates are cached or not.
  This setting can be set via the UI or by defining $CFG->cachetemplates in your config.php file. It is a boolean
  and should be set to either false or true. Developers will probably want to set this to false.
- The core_enrol_edit_user_enrolment webservice has been deprecated. Please use core_enrol_submit_user_enrolment_form instead.
- \single_button constructor has a new attributes param to add attributes to the button HTML tag.
- Improved url matching behaviour for profiled urls and excluded urls
- Attempting to use xsendfile via the 3rd param of readstring_accel() is now ignored.
- New H5P libraries have been added to Moodle core in /lib/h5p.
- New H5P core subsystem have been added.
- Introduced new callback for plugin developers '<component>_get_path_from_pluginfile($filearea, $args)': This will return
the itemid and filepath for the filearea and path defined in $args. It has been added in order to get the correct itemid and
filepath because some components, such as mod_page or mod_resource, add the revision to the URL where the itemid should be placed
(to prevent caching problems), but then they don't store it in database.
- New utility function \core_form\util::form_download_complete should be called if your code sends
  a file with Content-Disposition: Attachment in response to a Moodle form submit button (to ensure
  that disabled submit buttons get re-enabled in that case). It is automatically called by the
  filelib.php send_xx functions.
- If you have a form which sends a file in response to a Moodle form submit button, but you cannot
  call the above function because the file is sent by a third party library, then you should add
  the attribute data-double-submit-protection="off" to your form.

## 3.7

- Nodes in the navigation api can have labels for each group. See set/get_collectionlabel().
- The method core_user::is_real_user() now returns false for userid = 0 parameter
- 'mform1' dependencies (in themes, js...) will stop working because a randomly generated string has been added to the id
attribute on forms to avoid collisions in forms loaded in AJAX requests.
- A new method to allow queueing or rescheduling of an existing scheduled task was added. This allows an existing task
  to be updated or queued as required. This new functionality can be found in \core\task\manager::reschedule_or_queue_adhoc_task.
- Icons are displayed for screen readers unless they have empty alt text (aria-hidden). Do not provide an icon with alt text immediately beside an element with exactly the same text.
- admin_settingpage has a new function hide_if(), modeled after the same functionality in the forms library. This allows admin settings to be dynamically hidden based on the values of other settings.
- The \core_rating provider's get_sql_join function now accepts an optional $innerjoin parameter.
  It is recommended that privacy providers using this function call rewrite any long query into a number of separate
  calls to add_from_sql for improved performance, and that the new argument is used.
  This will allow queries to remain backwards-compatible with older versions of Moodle but will have significantly better performance in version supporting the innerjoin parameter.
- /message/defaultoutputs.php file and admin_page_defaultmessageoutputs class have been deprecated
  and all their settings moved to admin/message.php (see MDL-64495). Please use admin_page_managemessageoutputs class instead.
- A new parameter $lang has been added to mustache_template_source_loader->load_with_dependencies() method
  so it is possible for Mustache to request string in a specific language.
- Behat timeout constants behat_base::TIMEOUT, EXTENDED_TIMEOUT, and REDUCED_TIMEOUT have been
  deprecated. Please instead use the functions behat_base::get_timeout(), get_extended_timeout(),
  and get_reduced_timeout(). These allow for timeouts to be increased by a setting in config.php.
- The $draftitemid parameter of file_save_draft_area_files() function now supports the constant IGNORE_FILE_MERGE:
  When the parameter is set to that constant, the function won't process file merging, keeping the original state of the file area.
  Notice also than when $text is set, pluginfile rewrite won't be processed so the text will not be modified.
- Introduced new callback for plugin developers '<component>_pre_processor_message_send($procname, $proceventdata)':
  This will allow any plugin to manipulate messages or notifications before they are sent by a processor (email, mobile...)
- New capability 'moodle/category:viewcourselist' in category context that controls whether user is able to browse list of courses
  in this category. To work with list of courses use API methods in core_course_category and also 'course' form element.
- It is possible to pass additional conditions to get_courses_search();
  core_course_category::search_courses() now allows to search only among courses with completion enabled.
- Add support for a new xxx_after_require_login callback
- A new conversation type has been created for self-conversations. During the upgrading process:
  - Firstly, the existing self-conversations will be starred and migrated to the new type, removing the duplicated members in the
    message_conversation_members table.
  - Secondly, the legacy self conversations will be migrated from the legacy 'message_read' table. They will be created using the
    new conversation type and will be favourited.
  - Finally, the self-conversations for all remaining users without them will be created and starred.
Besides, from now, a self-conversation will be created and starred by default to all the new users (even when $CFG->messaging
is disabled).
- New optional parameter $throwexception for \get_complete_user_data(). If true, an exception will be thrown when there's no
  matching record found or when there are multiple records found for the given field value. If false, it will simply return false.
  Defaults to false when not set.
- Exposed submit button to allow custom styling (via customclassoverride variable) which can override btn-primary/btn-secondary classes
- `$includetoken` parameter type has been changed. Now supports:
  boolean: False indicates to not include the token, true indicates to generate a token for the current user ($USER).
  integer: Indicates to generate a token for the user whose id is the integer value.
- The following functions have been updated to support the new usage:
  - make_pluginfile_url
  - file_rewrite_pluginfile_urls
- New mform element 'float' handles localised floating point numbers.
