# API Changes for the `mod_forum` plugin

## 4.0

- The forum_count_replies() function has been removed from core.
- The mod_forum_get_forum_discussion_posts web service has been removed from core.
- Final deprecations of the following functions:
  - forum_make_mail_text
  - forum_make_mail_html
  - forum_make_mail_post
  - forum_cron_minimise_user_record
  - forum_cron
  - forum_print_discussion
  - forum_post_nesting_cache
  - forum_should_start_post_nesting
  - forum_should_end_post_nesting
  - forum_print_post_start
  - forum_print_post_end
  - forum_print_post
  - forum_print_posts_flat
  - forum_print_posts_threaded
  - forum_print_posts_nested
  - forum_print_latest_discussions
  - forum_get_user_grades
- The method forum_update_subscriptions_button() has been deprecated as it is no longer used.
  The 'Manage subscribers' button has been replaced with tertiary navigation.

## 3.11

- The get_forum_discussions_paginated web service has been deprecated in favour of get_forum_discussions.
- The forum post exporter now includes a "timemodified" field for each post, which is included in several WS methods:
  - mod_forum_get_discussion_posts
  - get_discussion_posts_by_userid
  - get_discussion_post
  - add_discussion_post

## 3.10

- Changes in external function mod_forum_external::get_discussion_posts_by_userid
  Now returns the posts of a given user checking the current user capabilities ($USER, the user who is requesting the posts).
  Previously, it returned the posts checking the capabilities of the user that created the posts.

## 3.8

- The following functions have been finally deprecated and can not be used anymore:
  - forum_scale_used()
- In order for the forum summary report to calculate word count and character count data, those details are now stored
  for each post in the database when posts are created or updated. For posts that existed prior to a Moodle 3.8 upgrade, these
  are calculated by the refresh_forum_post_counts ad-hoc task in chunks of 5000 posts by default. Site admins are able to modify this
  default, by setting $CFG->forumpostcountchunksize to the required integer value.

## 3.7

  - Changed the forum discussion rendering to use templates rather than print functions.
  - Added new forum entities, factories, exporters, renderers, and vaults in the local namespace to better encapsulate the forum data.
  - Deprecated all of the forum_print_* functions in lib.php.
  - The forum_print_latest_discussions function has been deprecated and will not be replaced.
  - The get_forum_discussion_posts web service has been deprecated in favour of get_discussion_posts.
  - The forum_count_replies function has been deprecated in favour of get_reply_count_for_post_id_in_discussion_id in
    the Post vault.
  - External function get_forums_by_courses now returns two additional fields "duedate" and "cutoffdate" containing the due date and the cutoff date for posting to the forums respectively.
  - External function get_forum_discussion_posts now returns an additional field "tags" returning the post tags.
  - New external function mod_forum_external::get_forum_discussions returns a list of forum discussions optionally sorted and paginated.
    Use mod_forum_external::get_forum_discussions instead.
  - External function mod_forum_external::add_discussion_post() has a new 'messageformat' param to be able to handle other formats different from FORMAT_HTML (that continues being the default one). Also a new 'topreferredformat' option enables the automatic conversion between any format and the preferred format (given the editor preference) before contents are saved.
