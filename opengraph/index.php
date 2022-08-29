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

/**
 * OpenGraph Image Loader.
 *
 * @package    core
 * @copyright  2022 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// Disable moodle specific debug messages and any errors in output.
// define('NO_DEBUG_DISPLAY', true);

// We need just the values from config.php and minlib.php.
define('ABORT_AFTER_CONFIG', true);

// This stops immediately at the beginning of lib/setup.php.
require('../config.php');

new class() {
    /** @var string The candidate file for the cache file */
    protected $candidatefile;

    /** @var int The revision requested */
    protected $rev;

    /** @var string The language code */
    protected $language;

    /** @var int The contextid */
    protected $contextid;

    /** @var string The mimetype to send */
    protected $mimetype = 'image/png';

    /** @var bool Whether Moodle is fully loaded or not */
    protected $fullyloaded = false;

    public function __construct() {
        $this->parse_file_information_from_url();
        $this->serve_file();
    }

    /**
     * Parse the file information from the URL.
     */
    protected function parse_file_information_from_url(): void {
        global $CFG;

        // The URL format is /[contextid]/[language]/[revision]
        // The revision is an integer with negative values meaning the file is not cached.
        $foundargs = $this->get_args([
            'revision' => 'INT',
            'contextid' => 'INT',
            'language' => 'SAFEDIR',
        ], [
            'revision',
            'contextid',
            'language',
        ]);

        $this->rev = $foundargs['revision'];
        $this->contextid = $foundargs['contextid'];
        $this->language = $foundargs['language'];

        $filepathhash = sha1(json_encode($foundargs));
        $this->candidatefile = "{$CFG->localcachedir}/opengraph/{$this->rev}/{$filepathhash}";
    }

    protected function get_args(array $possibleargs, array $required, array $optional = []): array {
        xdebug_break();
        $returnargs = [];
        if ($slashargument = min_get_slash_argument()) {
            $slashargument = ltrim($slashargument, '/');
            if (substr_count($slashargument, '/') < count($required) - 1) {
                $this->send_not_found();
            }

            $foundargs = explode('/', $slashargument, count($possibleargs));
            $index = 0;
            foreach ($possibleargs as $name => $cleanmethod) {
                $foundargs[$index];
                if (!isset($foundargs[$index])) {
                    if (array_key_exists($name, $required)) {
                        $this->send_not_found();
                    } else {
                        $returnargs[$name] = array_key_exists($name, $optional) ? $optional[$name] : null;
                    }
                } else {
                    $returnargs[$name] = min_clean_param($foundargs[$index], $cleanmethod);
                }
                $index++;
            }
        } else {
            foreach ($possibleargs as $name => $cleanmethod) {
                $returnargs[$name] = min_optional_param(
                    $name,
                    array_key_exists($name, $optional) ? $optional[$name] : null,
                    $cleanmethod
                );
                if (array_key_exists($name, $required) && $returnargs[$name] === null) {
                    $this->send_not_found();
                }
            }
        }

        return $returnargs;
    }

    /**
     * Serve the requested file from the most appropriate location, caching if possible.
     */
    public function serve_file(): void {
        // Attempt to send the cached file.
        if ($this->rev > 0) {
            if ($this->is_candidate_file_available()) {
                // The send_cached_file_if_available function will exit if successful.
                // In theory the file could become unavailable after checking that the file exists.
                // Whilst this is unlikely, fall back to caching the content below.
                $this->send_cached_file_if_available();
            }

            // The file isn't cached yet.
            // Store it in the cache and serve it.
            $this->store_filepath_file();
            $this->send_cached();
        } else {
            // If the revision is less than 0, then do not cache anything.
            // Moodle is configured to not cache javascript or css.
            $this->send_uncached_from_component();
        }
    }

    /**
     * Load the full Moodle Framework.
     */
    protected function load_full_moodle(): void {
        global $CFG, $DB, $SESSION, $OUTPUT, $PAGE;

        if ($this->is_full_moodle_loaded()) {
            return;
        }

        // Ok, now we need to start normal moodle script, we need to load all libs and $DB.
        define('ABORT_AFTER_CONFIG_CANCEL', true);

        // Session not used here.
        define('NO_MOODLE_COOKIES', true);

        // Ignore upgrade check.
        define('NO_UPGRADE_CHECK', true);

        require("{$CFG->dirroot}/lib/setup.php");
        $this->fullyloaded = true;
    }


    /**
     * Check whether Moodle is fully loaded.
     *
     * @return bool
     */
    public function is_full_moodle_loaded(): bool {
        return $this->fullyloaded;
    }

    /**
     * Load the file content from the dirroot.
     *
     * @return string
     */
    protected function load_content_from_component(): string {
        // We need to load the full moodle API to load the full file content.
        $this->load_full_moodle();

        $context = \context::instance_by_id($this->contextid);

        return $this->load_data_for_context($context);
    }

    protected function load_data_for_context(\context $context): string {
        // Get info from the contextid.
        $component = $context->get_component_name();

        // Check whether an OpenGraph Class exists for this component.
        $classname = "\\{$component}\\opengraph";

        if (class_exists($classname) && is_a($classname, '\\core\\opengraph_base', true)) {
            $opengraph = new $classname($context);
            return $opengraph->get_content($this->mimetype);
        }

        // There should always be a parent until the system context, at which point there must be a system instance.
        if ($parent = $context->get_parent_context()) {
            return $this->load_data_for_context($parent);
        }

        throw new \coding_exception('Unable to load context data');
    }

    /**
     * Send the file content from the dirroot.
     *
     * If the file is not found, send the 404 response instead.
     */
    protected function send_uncached_from_component(): void {
        $content = $this->load_content_from_component();
        if ($content) {
            $this->send_uncached_content($content);
        }

        $this->send_not_found();
    }

    /**
     * Check whether the candidate file exists.
     *
     * @return bool
     */
    protected function is_candidate_file_available(): bool {
        return file_exists($this->candidatefile);
    }

    /**
     * Send the candidate file.
     */
    protected function send_cached_file_if_available(): void {
        global $_SERVER;

        if (file_exists($this->candidatefile)) {
            // The candidate file exists so will be sent regardless.

            if (!empty($_SERVER['HTTP_IF_NONE_MATCH']) || !empty($_SERVER['HTTP_IF_MODIFIED_SINCE'])) {
                // The browser sent headers to check if the file has changed.
                // We do not actually need to verify the eTag value or compare modification headers because our files
                // never change in cache. When changes are made we increment the revision counter.
                $this->send_unmodified_headers(filemtime($this->candidatefile));
            }

            // No modification headers were sent so simply serve the file from cache.
            $this->send_cached($this->candidatefile);
        }
    }

    /**
     * Store the file content in the candidate file.
     */
    protected function store_filepath_file(): void {
        global $CFG;

        clearstatcache();
        if (!file_exists(dirname($this->candidatefile))) {
            @mkdir(dirname($this->candidatefile), $CFG->directorypermissions, true);
        }

        // Prevent serving of incomplete file from concurrent request,
        // the rename() should be more atomic than fwrite().
        ignore_user_abort(true);

        $filename = $this->candidatefile;
        if ($fp = fopen($filename . '.tmp', 'xb')) {
            $content = $this->load_content_from_component();
            fwrite($fp, $content);
            fclose($fp);
            rename($filename . '.tmp', $filename);
            @chmod($filename, $CFG->filepermissions);
            @unlink($filename . '.tmp'); // Just in case anything fails.
        }

        ignore_user_abort(false);
        if (connection_aborted()) {
            die;
        }
    }

    /**
     * Get the eTag for the candidate file.
     *
     * This is a unique hash based on the file arguments.
     * It does not need to consider the file content because we use a cache busting URL.
     *
     * @return string The eTag content
     */
    protected function get_etag(): string {
        $etag = [
            $this->rev,
            $this->contextid,
            $this->language,
        ];

        return sha1(implode('/', $etag));
    }

    /**
     * Send the candidate file, with aggressive cachign headers.
     *
     * This includdes eTags, a last-modified, and expiry approximately 90 days in the future.
     */
    protected function send_cached(): void {
        $path = $this->candidatefile;

        // 90 days only - based on Moodle point release cadence being every 3 months.
        $lifetime = 60 * 60 * 24 * 90;

        header('Etag: "' . $this->get_etag() . '"');
        header('Content-Disposition: inline; filename="filepath.php"');
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s', filemtime($path)) . ' GMT');
        header('Expires: ' . gmdate('D, d M Y H:i:s', time() + $lifetime) . ' GMT');
        header('Pragma: ');
        header('Cache-Control: public, max-age=' . $lifetime . ', immutable');
        header('Accept-Ranges: none');
        header("Content-Type: {$this->mimetype}; charset=utf-8");
        if (!min_enable_zlib_compression()) {
            header('Content-Length: ' . filesize($path));
        }

        readfile($path);
        die;
    }

    /**
     * Sends the content directly without caching it.
     *
     * No aggressive caching is used, and the expiry is set to the current time.
     *
     * @param string $content The image data to serve
     */
    protected function send_uncached_content(string $content): void {
        header('Content-Disposition: inline; filename=".php"');
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s', time()) . ' GMT');
        header('Expires: ' . gmdate('D, d M Y H:i:s', time()) . ' GMT');
        header('Pragma: ');
        header('Accept-Ranges: none');
        header("Content-Type: {$this->mimetype}; charset=utf-8");

        echo $content;
        die;
    }

    /**
     * Send headers to indicate that the file has not been modified at all
     *
     * @param int $lastmodified
     */
    protected function send_unmodified_headers(int $lastmodified): void {
        // 90 days only - based on Moodle point release cadence being every 3 months.
        $lifetime = 60 * 60 * 24 * 90;
        header('HTTP/1.1 304 Not Modified');
        header('Expires: ' . gmdate('D, d M Y H:i:s', time() + $lifetime) . ' GMT');
        header('Cache-Control: public, max-age=' . $lifetime);
        header("Content-Type: {$this->mimetype}; charset=utf-8");
        header('Etag: "' . $this->get_etag() . '"');
        if ($lastmodified) {
            header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $lastmodified) . ' GMT');
        }
        die;
    }

    /**
     * Sends a 404 message to indicate that the content was not found.
     */
    protected function send_not_found(): void {
        // TODO Replace with sending the system context data.
        header('HTTP/1.0 404 not found');
        die('TinyMCE file was not found, sorry.');
    }
};
