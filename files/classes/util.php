<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

namespace core_files;

use core\exception\coding_exception;
use core\exception\invalid_dataroot_permissions;

/**
 * File and directory utilities.
 *
 * @package    core_files
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class util {
    /**
     * Get a per-request storage directory in the tempdir.
     *
     * The directory is automatically cleaned up during the shutdown handler.
     *
     * @param   bool    $exceptiononerror throw exception if error encountered
     * @param   bool    $forcecreate Force creation of a new parent directory
     * @return  string  Returns full path to directory if successful, false if not; may throw exception
     */
    public static function get_request_storage_directory(
        bool $exceptiononerror = true,
        bool $forcecreate = false,
    ): string|false {
        global $CFG;

        static $requestdir = null;

        $writabledirectoryexists = ($requestdir !== null);
        $writabledirectoryexists = $writabledirectoryexists && file_exists($requestdir);
        $writabledirectoryexists = $writabledirectoryexists && is_dir($requestdir);
        $writabledirectoryexists = $writabledirectoryexists && is_writable($requestdir);
        $createnewdirectory = $forcecreate || !$writabledirectoryexists;

        if ($createnewdirectory) {
            // Let's add the first chars of siteidentifier only. This is to help separate
            // paths on systems which host multiple moodles. We don't use the full id
            // as Windows and old PHP don't like very long paths. See MDL-69975.
            $basedir = "{$CFG->localrequestdir}/" . substr($CFG->siteidentifier, 0, 4);

            self::make_writable_directory($basedir);
            self::protect_directory($basedir);

            if ($dir = self::make_unique_writable_directory($basedir, $exceptiononerror)) {
                // Register a shutdown handler to remove the directory.
                \core_shutdown_manager::register_function('remove_dir', [$dir]);
            }

            $requestdir = $dir;
        }

        return $requestdir;
    }

    /**
     * Create a per-request directory and make sure it is writable.
     * This can only be used during the current request and will be tidied away
     * automatically afterwards.
     *
     * A new, unique directory is always created within a shared base request directory.
     *
     * In some exceptional cases an alternative base directory may be required. This can be accomplished using the
     * $forcecreate parameter. Typically this will only be requried where the file may be required during a shutdown handler
     * which may or may not be registered after a previous request directory has been created.
     *
     * @param   bool    $exceptiononerror throw exception if error encountered
     * @param   bool    $forcecreate Force creation of a new parent directory
     * @return  string|false  The full path to directory if successful, false if not; may throw exception
     */
    public static function make_request_directory(
        bool $exceptiononerror = true,
        bool $forcecreate = false,
    ): string|false {
        $basedir = self::get_request_storage_directory($exceptiononerror, $forcecreate);
        return self::make_unique_writable_directory($basedir, $exceptiononerror);
    }

    /**
     * Get the full path of a directory under $CFG->backuptempdir.
     *
     * @param string $directory  the relative path of the directory under $CFG->backuptempdir
     * @return string|false Returns full path to directory given a valid string; otherwise, false.
     */
    public static function get_backup_temp_directory(string $directory): bool|string {
        global $CFG;
        if (($directory === null) || ($directory === false)) {
            return false;
        }
        return "$CFG->backuptempdir/$directory";
    }

    /**
     * Create a directory under $CFG->backuptempdir and make sure it is writable.
     *
     * Do not use for storing generic temp files - see make_temp_directory() instead for this purpose.
     *
     * Backup temporary files must be on a shared storage.
     *
     * @param string $directory  the relative path of the directory to be created under $CFG->backuptempdir
     * @param bool $exceptiononerror throw exception if error encountered
     * @return string|false Returns full path to directory if successful, false if not; may throw exception
     */
    public static function make_backup_temp_directory(
        string $directory,
        bool $exceptiononerror = true,
    ): string|false {
        global $CFG;
        if ($CFG->backuptempdir !== "$CFG->tempdir/backup") {
            self::check_dir_exists($CFG->backuptempdir, true, true);
            self::protect_directory($CFG->backuptempdir);
        } else {
            self::protect_directory($CFG->tempdir);
        }
        return self::make_writable_directory("$CFG->backuptempdir/$directory", $exceptiononerror);
    }

    /**
     * Create a directory under tempdir and make sure it is writable.
     *
     * Where possible, please use make_request_directory() and limit the scope
     * of your data to the current HTTP request.
     *
     * Do not use for storing cache files - see make_cache_directory(), and
     * make_localcache_directory() instead for this purpose.
     *
     * Temporary files must be on a shared storage, and heavy usage is
     * discouraged due to the performance impact upon clustered environments.
     *
     * @param string $directory  the full path of the directory to be created under $CFG->tempdir
     * @param bool $exceptiononerror throw exception if error encountered
     * @return string|false Returns full path to directory if successful, false if not; may throw exception
     */
    public static function make_temp_directory($directory, $exceptiononerror = true) {
        global $CFG;
        if ($CFG->tempdir !== "$CFG->dataroot/temp") {
            self::check_dir_exists($CFG->tempdir, true, true);
            self::protect_directory($CFG->tempdir);
        } else {
            self::protect_directory($CFG->dataroot);
        }
        return self::make_writable_directory("$CFG->tempdir/$directory", $exceptiononerror);
    }

    /**
     * Create a directory under cachedir and make sure it is writable.
     *
     * Note: this cache directory is shared by all cluster nodes.
     *
     * @param string $directory  the full path of the directory to be created under $CFG->cachedir
     * @param bool $exceptiononerror throw exception if error encountered
     * @return string|false Returns full path to directory if successful, false if not; may throw exception
     */
    public static function make_cache_directory(
        string $directory,
        bool $exceptiononerror = true,
    ): string|false {
        global $CFG;
        if ($CFG->cachedir !== "$CFG->dataroot/cache") {
            self::check_dir_exists($CFG->cachedir, true, true);
            self::protect_directory($CFG->cachedir);
        } else {
            self::protect_directory($CFG->dataroot);
        }
        return self::make_writable_directory("$CFG->cachedir/$directory", $exceptiononerror);
    }

    /**
     * Create a directory under localcachedir and make sure it is writable.
     * The files in this directory MUST NOT change, use revisions or content hashes to
     * work around this limitation - this means you can only add new files here.
     *
     * The content of this directory gets purged automatically on all cluster nodes
     * after calling purge_all_caches() before new data is written to this directory.
     *
     * Note: this local cache directory does not need to be shared by cluster nodes.
     *
     * @param string $directory the relative path of the directory to be created under $CFG->localcachedir
     * @param bool $exceptiononerror throw exception if error encountered
     * @return string|false Returns full path to directory if successful, false if not; may throw exception
     */
    public static function make_localcache_directory(
        string $directory,
        bool $exceptiononerror = true,
    ): string|false {
        global $CFG;

        self::make_writable_directory($CFG->localcachedir, $exceptiononerror);

        if ($CFG->localcachedir !== "$CFG->dataroot/localcache") {
            self::protect_directory($CFG->localcachedir);
        } else {
            self::protect_directory($CFG->dataroot);
        }

        if (!isset($CFG->localcachedirpurged)) {
            $CFG->localcachedirpurged = 0;
        }
        $timestampfile = "$CFG->localcachedir/.lastpurged";

        if (!file_exists($timestampfile)) {
            touch($timestampfile);
            @chmod($timestampfile, $CFG->filepermissions);

        } else if (filemtime($timestampfile) <  $CFG->localcachedirpurged) {
            // This means our local cached dir was not purged yet.
            remove_dir($CFG->localcachedir, true);
            if ($CFG->localcachedir !== "$CFG->dataroot/localcache") {
                self::protect_directory($CFG->localcachedir);
            }
            touch($timestampfile);
            @chmod($timestampfile, $CFG->filepermissions);
            clearstatcache();

            // Then prewarm the local boostrap.php file as well.
            initialise_local_config_cache();
        }

        if ($directory === '') {
            return $CFG->localcachedir;
        }

        return self::make_writable_directory("$CFG->localcachedir/$directory", $exceptiononerror);
    }

    /**
     * Create a new unique directory within the specified directory.
     *
     * @param string $basedir The directory to create your new unique directory within.
     * @param bool $exceptiononerror throw exception if error encountered
     * @return string|false The created directory
     * @throws invalid_dataroot_permissions
     */
    public static function make_unique_writable_directory(
        string $basedir,
        bool $exceptiononerror = true,
    ): string|false {
        if (!is_dir($basedir) || !is_writable($basedir)) {
            // The basedir is not writable. We will not be able to create the child directory.
            return self::throw_or_fail(
                new invalid_dataroot_permissions("{$basedir} is not writable. Unable to create a unique directory within it."),
                $exceptiononerror,
            );
        }

        do {
            // Let's use uniqid() because it's "unique enough" (microtime based). The loop does handle repetitions.
            // Windows and old PHP don't like very long paths, so try to keep this shorter. See MDL-69975.
            $uniquedir = $basedir . DIRECTORY_SEPARATOR . uniqid();
        } while (
            // Ensure that basedir is still writable - if we do not check, we could get stuck in a loop here.
            is_writable($basedir) &&

            // Make the new unique directory. If the directory already exists, it will return false.
            !self::make_writable_directory($uniquedir, $exceptiononerror) &&

            // Ensure that the directory now exists
            file_exists($uniquedir) && is_dir($uniquedir)
        );

        // Check that the directory was correctly created.
        if (!file_exists($uniquedir) || !is_dir($uniquedir) || !is_writable($uniquedir)) {
            return self::throw_or_fail(
                new invalid_dataroot_permissions('Unique directory creation failed.'),
                $exceptiononerror,
            );
        }

        return $uniquedir;
    }

    /**
     * Create a directory and make sure it is writable.
     *
     * @private
     * @param string $dir  the full path of the directory to be created
     * @param bool $exceptiononerror throw exception if error encountered
     * @return string|false Returns full path to directory if successful, false if not; may throw exception
     */
    public static function make_writable_directory(
        string $dir,
        bool $exceptiononerror = true,
    ): string|false {
        global $CFG;

        if (file_exists($dir) && !is_dir($dir)) {
            return self::throw_or_fail(
                new coding_exception("{$dir} directory can not be created, file with the same name already exists."),
                $exceptiononerror,
                true,
            );
        }

        umask($CFG->umaskpermissions);

        if (!file_exists($dir)) {
            if (!@mkdir($dir, $CFG->directorypermissions, true)) {
                clearstatcache();
                // There might be a race condition when creating directory.
                if (!is_dir($dir)) {
                    return self::throw_or_fail(
                        new invalid_dataroot_permissions("{$dir} can not be created, check permissions."),
                        $exceptiononerror,
                        true,
                    );
                }
            }
        }

        if (!is_writable($dir)) {
            return self::throw_or_fail(
                new invalid_dataroot_permissions($dir.' is not writable, check permissions.'),
                $exceptiononerror,
                true,
            );
        }

        return $dir;
    }

    /**
     * Create a directory under dataroot and make sure it is writable.
     * Do not use for temporary and cache files - see make_temp_directory() and make_cache_directory().
     *
     * @param string $directory  the full path of the directory to be created under $CFG->dataroot
     * @param bool $exceptiononerror throw exception if error encountered
     * @return string|false Returns full path to directory if successful, false if not; may throw exception
     */
    public static function make_upload_directory(
        string $directory,
        bool $exceptiononerror = true,
    ): string|false {
        global $CFG;

        if (strpos($directory, 'temp/') === 0 || $directory === 'temp') {
            debugging('Use make_temp_directory() for creation of temporary directory and $CFG->tempdir to get the location.');

        } else if (strpos($directory, 'cache/') === 0 || $directory === 'cache') {
            debugging('Use make_cache_directory() for creation of cache directory and $CFG->cachedir to get the location.');

        } else if (strpos($directory, 'localcache/') === 0 || $directory === 'localcache') {
            debugging('Use make_localcache_directory() for creation of local cache directory and $CFG->localcachedir to get the location.');
        }

        self::protect_directory($CFG->dataroot);
        return self::make_writable_directory("$CFG->dataroot/$directory", $exceptiononerror);
    }

    /**
     * Function to check if a directory exists and by default create it if not exists.
     *
     * Previously this was accepting paths only from dataroot, but we now allow
     * files outside of dataroot if you supply custom paths for some settings in config.php.
     * This function does not verify that the directory is writable.
     *
     * NOTE: this function uses current file stat cache,
     *       please use clearstatcache() before this if you expect that the
     *       directories may have been removed recently from a different request.
     *
     * @param string $dir absolute directory path
     * @param boolean $create directory if does not exist
     * @param boolean $recursive create directory recursively
     * @return boolean true if directory exists or created, false otherwise
     */
    public static function check_dir_exists(
        string $dir,
        bool $create = true,
        bool $recursive = true,
    ): bool {
        global $CFG;

        umask($CFG->umaskpermissions);

        if (is_dir($dir)) {
            return true;
        }

        if (!$create) {
            return false;
        }

        return mkdir($dir, $CFG->directorypermissions, $recursive);
    }

    /**
     * Protect a directory from web access.
     * Could be extended in the future to support other mechanisms (e.g. other webservers).
     *
     * @param string $dir  the full path of the directory to be protected
     */
    private static function protect_directory($dir): void {
        global $CFG;

        // Make sure a .htaccess file is here, JUST IN CASE the files area is in the open and .htaccess is supported.
        if (!file_exists("$dir/.htaccess")) {
            if ($handle = fopen("$dir/.htaccess", 'w')) { // For safety,
                @fwrite($handle, "deny from all\r\nAllowOverride None\r\nNote: this file is broken intentionally, we do not want anybody to undo it in subdirectory!\r\n");
                @fclose($handle);
                @chmod("$dir/.htaccess", $CFG->filepermissions);
            }
        }
    }

    /**
     * Throw an Exception, or return false.
     * @param \Exception $exception
     * @param bool $exceptiononerror
     * @param bool $debuggingonerror
     * @return bool
     * @throws \Exception
     */
    private static function throw_or_fail(
        \Exception $exception,
        bool $exceptiononerror = true,
        bool $debuggingonerror = false,
    ): false {
        if ($exceptiononerror) {
            throw $exception;
        } else {
            if ($debuggingonerror) {
                debugging($exception->getMessage(), DEBUG_DEVELOPER);
            }
            return false;
        }
    }
}
