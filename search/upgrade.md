# API Changes for the `core_search` subsystem

## 3.10

- Search indexing now supports sending multiple documents to the server in a batch. This is implemented
  for the Solr search engine, where it significantly increases performance. For this to work, engines
  should implement add_document_batch() function and return true to supports_add_document_batch().
  There is also an additional parameter returned from add_documents() with the number of batches
  sent, which is used for the log display. Existing engines should continue to work unmodified.
- Search engines can now implement the optional has_alternate_configuration() function to indicate
  if they provide two different connection configurations (for use when moving between two search
  engines of the same type). The constructor should also accept a boolean value (true = alternate);
  passing this to the base class constructor will automatically switch in the alternate
  configuration settings, provided they begin with 'alternate'.

## 3.8

- Search indexing supports time limits to make the scheduled task run more neatly since 3.4. In order for
  this to work, search engine plugins will need to implement the 'stopat' parameter if they
  override the add_documents() function, and return an extra parameter from this function (see base
  class in engine.php). Unmodified plugins will not work anymore.
- New search engine functions delete_index_for_context and delete_index_for_course are called by
  the search manager to inform the search engine it can remove some documents from its index.
  (Otherwise, documents from delete courses are never removed unless you reindex.) It is optional
  for search engines to support these; if they don't implement them then behaviour is unchanged.

## 3.7

- Search areas now have categories and can optionally implement get_category_names method to
  display search results of the area in the required tab on the search results screen (if this
  feature is enabled).
- Added a new call back search_area_categories. Plugins can implement this method in lib.php and
  return a list of custom search area categories (\core_search\area_category) and associated with
  them search areas. This will bring additional custom tabs to the search results screen.
- Added \core_search\manager::clean_up_non_existing_area method to clean up removed or renamed
  search areas. To support that a new adhoc task core\task\clean_up_deleted_search_area_task
  added.
