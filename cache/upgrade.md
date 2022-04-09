# API Changes for the `core_cache` subsystem

## 4.0

- Cache stores may implement new optional function cache_store::get_last_io_bytes() to provide
  information about the size of data transferred (shown in footer if performance info enabled).
- The cache_store class now has functions cache_size_details(), store_total_size(), and
  estimate_stored_size(), related to size used by the cache. These can be overridden by a cache
  store to provide better information for the new cache usage admin page.
- New functions cache::set_versioned() and cache::get_versioned() can be used to ensure correct
  behaviour when using a multi-level cache with early cache levels stored locally. (Used when
  rebuilding modinfo.) There is also a new interface cache_data_source_versionable which can
  be implemented if you want to make a data source that supports versioning.

## 3.10

- The function supports_recursion() from the lock_factory interface has been deprecated including the related implementations.
- The function extend_lock() from the lock_factory interface has been deprecated without replacement including the related
  implementations.
- The function extend() from the lock class has been deprecated without replacement.
- The cache_factory class can now be overridden by an alternative cache config class, which can
  also now control the frontend display of the cache/admin.php page (see MDL-41492).

## 3.9

- The record_cache_hit/miss/set methods now take a cache_store instead of a cache_definition object

## 3.8

- The Redis cache store can now make use of the Zstandard compression algorithm (see MDL-66428).

## 3.7

- Upgraded MongoDB cache store to use the new lower level PHP-driver and MongoDB PHP Library.
- The mongodb extension has replaced the old mongo extension. The mongodb pecl extension >= 1.5 must be installed to use MongoDB
cache store.
