# API Changes for the `core_message` subsystem

## 4.0

The following functions have been finally deprecated and can not be used anymore:
- can_post_message()
  - get_individual_conversations_between_users()
- The message_jabber notification has been completely removed from core. It has been moved to the plugins database repository, so
it can still be installed as a third-party plugin.
- The type of the parameter $read in the function message_get_messages has changed from boolean to integer. It now accepts either MESSAGE_GET_UNREAD, MESSAGE_GET_READ or MESSAGE_GET_READ_AND_UNREAD.

## 3.11.2

- The `message_page_type_list` method was previouly deprecated, however it was still
  used so has been recreated in message/lib.php

## 3.10

- The following methods have been deprecated and should not be used any more:
  - message_count_unread_messages()
  - get_non_contacts_with_unread_message_count()
  - get_contacts_with_unread_message_count()

- The following functions have been finally deprecated and can not be used anymore::
  - search_users_in_course()
  - search_users()
  - get_contacts()
  - get_messages()
  - get_most_recent_message()
  - get_profile()
  - get_messages()
  - create_messages()
  - get_conversations_legacy_formatter()
  - create_contacts()
  - block_contacts()
  - unblock_contacts()
  - data_for_messagearea_search_users_in_course()
  - data_for_messagearea_search_users()
  - message_search_users()
  - data_for_messagearea_conversations()
  - data_for_messagearea_contacts()
  - data_for_messagearea_messages()
  - get_conversation_messages()
  - data_for_messagearea_get_most_recent_message()
  - data_for_messagearea_get_profile()
  - mark_all_messages_as_read()
  - delete_conversation()

## 3.9

- Removed the following deprecated functions:
  - message_move_userfrom_unread2read
  - message_get_blocked_users
  - message_get_contacts
  - message_mark_message_read
  - message_can_delete_message
  - message_delete_message
  - mark_all_read_for_user()
- Message processors can implement the following methods which will be executed as part of the messaging cleanup task:
  - cleanup_all_notifications
  - cleanup_read_notifications

## 3.8

- The following methods have been deprecated and should not be used any more:
  - \core_message\api::get_individual_conversations_between_users()
  - \core_message\api::can_post_message()

## 3.7

- The message/index.php page used to support viewing another user's messages (if you had the right capabilities) by
  altering the URL and adding the parameters 'user1' and 'user2'. There were only some very rare occurrences where you
  could access a URL generated with these parameters (eg. log report). It was decided to stop supporting this
  functionality and remove all the legacy code (see MDL-63915).
  Note - It's still possible to view another user's messages if you have the right capabilities and are able to
  'log-in as' them.
- A new parameter 'mergeself' has been added to the methods \core_message\api::get_conversations() and
  core_message_external::get_conversations(), to decide whether the self-conversations should be included or not when the
  private ones are requested, to display them together.
- A new 'customdata' field for both messages and notifications has been added. This new field can store any custom data
  serialised using json_encode().
  This new field can be used for storing any data not fitting in the current message structure. For example, it will be used
  to store additional information for the "Mobile notifications" processor.
  Existing external functions: core_message_get_messages and message_popup_get_popup_notifications has been udated to return the
  new field.
- External function core_message_get_messages now returns the component and eventtype.
