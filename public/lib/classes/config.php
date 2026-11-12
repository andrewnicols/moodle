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

namespace core;

/**
 * Configuration class for Moodle.
 * 
 * This is a lightweight wrapper around the old `$CFG` stdClass variable which allows for
 * a more centralised management, documentation, and deprecation of configuration values.
 *
 * Note: This class must be entirely self-sufficient. It must not rely upon any other class,
 * external library, or autoloader.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class config extends \stdClass {
    /** @var string The database type */
    public string $dbtype = 'pgsql' {
        set (string $value) {
            $this->dbtype = strtolower($value);
        }
    }

    /** @var string The database library */
    public string $dblibrary = 'native' {
        set (string $value) {
            if ($value !== 'native') {
                throw new \InvalidArgumentException('Invalid database library');
            }
            $this->dblibrary = strtolower($value);
        }
    }

    /** @var string The database host */
    public string $dbhost = 'localhost';

    /** @var string The database username */
    public string $dbuser;

    /** @var string The database password */
    public string $dbpass;

    /** @var string The table prefix for the database */
    public string $prefix = '';

    /** @var string The root directory of the Moodle installation */
    public string $root;

    /** @var string The directory root of the Moodle installation */
    public string $dirroot;

    /** @var string The www root of the Moodle installation */
    public string $wwwroot;

    /** @var string The data root of the Moodle installation */
    public string $dataroot;

    /** @var string The library directory of the Moodle installation */
    public string $libdir;

    /** @var int File permissions on created directories in the $CFG->dataroot */
    public int $directorypermissions = 02777;

    /** @var int File permissions on created files in the $CFG->dataroot */
    public int $filepermissions;

    /** @var int The umask permissions for the Moodle installation */
    public int $umaskpermissions;

    /** @var string The location of the tempdir */
    public string $tempdir;

    /** @var string The location of the backup temp directory */
    public string $backuptempdir;

    /** @var string The location of the cache directory */
    public string $cachedir;

    /** @var string The location of the local cache directory */
    public string $localcachedir;
    
    /** @var string The location of the local request directory */
    public string $localrequestdir;

    /** @var string The location of the language other root directory */
    public string $langotherroot;

    /** @var bool Whether the router is properly configured */
    public bool $routerconfigured = false;

    /** @var int The threshold runtime for tasks before a warning is issued. */
    public int $taskruntimewarn = 12 * 60 * 60;

    /** @var int The threshold runtime for tasks before an error is issued. */
    public int $taskruntimeerror = 24 * 60 * 60;

    /**
     * @var string The admin directory of the Moodle installation.
     *
     * @deprecated
     */
    public string $admin = 'admin' {
        get {
            $this->inform_deprecation('admin');
            return $this->admin;
        }
    }

    /**
     * Summary of httpswwwroot
     *
     * @var string
     * @deprecated Since Moodle 3.4
     */
    public string $httpswwwroot;

    /**
     * Create a new instance of the config class from a stdClass implementation.
     *
     * @param \stdClass $original
     * @return config
     */
    public static function from_object(\stdClass $original): self {
        $config = new self();
        $rc = new \ReflectionClass($config);
        $props = $rc->getProperties();

        foreach ($original as $key => $value) {
            if ($rc->hasProperty($key)) {
                $prop = $rc->getProperty($key);
                if ($prop->isReadOnly() && isset($config->{$key})) {
                    // TODO: Skip these or error? They shouldn't really be in config I guess?
                    continue;
                }
            }
            $config->$key = $value;
        }

        // Fill default values.
        $config->set_default_directory_values();
        return $config;
    }

    /**
     * Constructor for the config class.
     */
    private function __construct() {
    }

    /**
     * Set the default values for directories.
     */
    protected function set_default_directory_values(): void {
        // Calculate some root and directory root of the Moodle installation.
        // These are forced values and cannot be changed.
        $this->dirroot = dirname(__FILE__, 3);
        $this->root = dirname($this->dirroot);
        $this->libdir = $this->dirroot . '/lib';

        // The rest are defaults.
        // Beacuse they build on other settings they cannot have defaults in the class.
        if (!isset($this->filepermissions)) {
            // Strip the execute flags from the directory permissions.
            $this->filepermissions = ($this->directorypermissions & 0666);
        }

        if (!isset($this->umaskpermissions)) {
            // The default umask because it's rarely provided to `mkdir` and `chmod`.
            $this->umaskpermissions = (($this->directorypermissions & 0777) ^ 0777);
        }

        // Allow overriding of tempdir but be backwards compatible.
        if (!isset($this->tempdir)) {
            $this->tempdir = $this->dataroot . DIRECTORY_SEPARATOR . "temp";
        }

        // Allow overriding of backuptempdir but be backwards compatible.
        if (!isset($this->backuptempdir)) {
            $this->backuptempdir = "{$this->tempdir}/backup";
        }

        // Allow overriding of cachedir but be backwards compatible.
        if (!isset($this->cachedir)) {
            $this->cachedir = "{$this->dataroot}/cache";
        }

        // Allow overriding of localcachedir.
        if (!isset($this->localcachedir)) {
            $this->localcachedir = "{$this->dataroot}/localcache";
        }

        // Allow overriding of localrequestdir.
        if (!isset($this->localrequestdir)) {
            $this->localrequestdir = sys_get_temp_dir() . '/requestdir';
        }

        // Location of all languages except core English pack.
        if (!isset($this->langotherroot)) {
            $this->langotherroot = "{$this->dataroot}/lang";
        }

        // Location of local lang pack customisations (dirs with _local suffix).
        if (!isset($this->langlocalroot)) {
            $this->langlocalroot = "{$this->dataroot}/lang";
        }
    }

    /**
     * Validate and normalise core paths.
     */
    public function validate_paths(): void {
        // Normalise dataroot - we do not want any symbolic links, trailing / or any other weirdness there
        if (!isset($this->dataroot)) {
            if (isset($_SERVER['REMOTE_ADDR'])) {
                header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error ');
            }
            echo ('Fatal error: $CFG->dataroot is not specified in config.php! Exiting.' . "\n");
            exit(1);
        }
        $this->dataroot = realpath($this->dataroot);
        if ($this->dataroot === false) {
            if (isset($_SERVER['REMOTE_ADDR'])) {
                header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error ');
            }
            echo ('Fatal error: $CFG->dataroot is not configured properly, directory does not exist or is not accessible! Exiting.' . "\n");
            exit(1);
        } else if (!is_writable($this->dataroot)) {
            if (isset($_SERVER['REMOTE_ADDR'])) {
                header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error ');
            }
            echo ('Fatal error: $CFG->dataroot is not writable, admin has to fix directory permissions! Exiting.' . "\n");
            exit(1);
        }

        // wwwroot is mandatory
        if (!isset($this->wwwroot) || $this->wwwroot === 'http://example.com/moodle') {
            if (isset($_SERVER['REMOTE_ADDR'])) {
                header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error ');
            }
            echo ('Fatal error: $CFG->wwwroot is not configured! Exiting.' . "\n");
            exit(1);
        }

        // The current directory in PHP version 4.3.0 and above isn't necessarily the
        // directory of the script when run from the command line. The require_once()
        // would fail, so we'll have to chdir()
        if (!isset($_SERVER['REMOTE_ADDR']) && isset($_SERVER['argv'][0])) {
            // do it only once - skip the second time when continuing after prevous abort
            if (!defined('ABORT_AFTER_CONFIG') and !defined('ABORT_AFTER_CONFIG_CANCEL')) {
                chdir(dirname($_SERVER['argv'][0]));
            }
        }
    }

    /**
     * Inform that the specified value is deprecated.
     *
     * @param string $property The name of the deprecated property.
     * @param bool $final Whether the property is final and should not be used anymore.
     * @param null|string $version The version since which the property is deprecated.
     * @param null|string $detail Additional details about the deprecation.
     */
    private function inform_deprecation(
        string $property,
        bool $final = false,
        ?string $version = null,
        ?string $detail = null,
    ): void {
        $message = $message ?? "The property '$property' is deprecated.";
        if ($version !== null) {
            $message .= " Since version $version.";
        }
        if ($detail !== null) {
            $message .= " $detail";
        }

        if ($final) {
            trigger_error($message, E_USER_DEPRECATED);
        }

        // Add the stacktrace to the error log.
        // error_log(print_r(debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS), true), E_USER_DEPRECATED);
        // error_log($message, E_USER_DEPRECATED);
    }
}
