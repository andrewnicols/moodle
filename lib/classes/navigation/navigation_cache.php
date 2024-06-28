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

namespace core\navigation;

use core_shutdown_manager;
use stdClass;

/**
 * The cache class used by global navigation and settings navigation.
 *
 * It is basically an easy access point to session with a bit of smarts to make
 * sure that the information that is cached is valid still.
 *
 * Example use:
 * <code php>
 * if (!$cache->viewdiscussion()) {
 *     // Code to do stuff and produce cachable content
 *     $cache->viewdiscussion = has_capability('mod/forum:viewdiscussion', $coursecontext);
 * }
 * $content = $cache->viewdiscussion;
 * </code>
 *
 * @package   core
 * @category  navigation
 * @copyright 2009 Sam Hemelryk
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class navigation_cache {
    /** @var int represents the time created */
    protected $creation;
    /** @var array An array of session keys */
    protected $session;
    /**
     * The string to use to segregate this particular cache. It can either be
     * unique to start a fresh cache or if you want to share a cache then make
     * it the string used in the original cache.
     * @var string
     */
    protected $area;
    /** @var int a time that the information will time out */
    protected $timeout;
    /** @var stdClass The current context */
    protected $currentcontext;
    /** @var int cache time information */
    const CACHETIME = 0;
    /** @var int cache user id */
    const CACHEUSERID = 1;
    /** @var int cache value */
    const CACHEVALUE = 2;
    /** @var null|array An array of navigation cache areas to expire on shutdown */
    public static $volatilecaches;

    /**
     * Contructor for the cache. Requires two arguments
     *
     * @param string $area The string to use to segregate this particular cache
     *                it can either be unique to start a fresh cache or if you want
     *                to share a cache then make it the string used in the original
     *                cache
     * @param int $timeout The number of seconds to time the information out after
     */
    public function __construct($area, $timeout = 1800) {
        $this->creation = time();
        $this->area = $area;
        $this->timeout = time() - $timeout;
        if (rand(0, 100) === 0) {
            $this->garbage_collection();
        }
    }

    /**
     * Used to set up the cache within the SESSION.
     *
     * This is called for each access and ensure that we don't put anything into the session before
     * it is required.
     */
    protected function ensure_session_cache_initialised() {
        global $SESSION;
        if (empty($this->session)) {
            if (!isset($SESSION->navcache)) {
                $SESSION->navcache = new stdClass();
            }
            if (!isset($SESSION->navcache->{$this->area})) {
                $SESSION->navcache->{$this->area} = [];
            }
            $this->session = &$SESSION->navcache->{$this->area}; // pointer to array, =& is correct here
        }
    }

    /**
     * Magic Method to retrieve something by simply calling using = cache->key
     *
     * @param mixed $key The identifier for the information you want out again
     * @return void|mixed Either void or what ever was put in
     */
    public function __get($key) {
        if (!$this->cached($key)) {
            return;
        }
        $information = $this->session[$key][self::CACHEVALUE];
        return unserialize($information);
    }

    /**
     * Magic method that simply uses {@link set();} to store something in the cache
     *
     * @param string|int $key
     * @param mixed $information
     */
    public function __set($key, $information) {
        $this->set($key, $information);
    }

    /**
     * Sets some information against the cache (session) for later retrieval
     *
     * @param string|int $key
     * @param mixed $information
     */
    public function set($key, $information) {
        global $USER;
        $this->ensure_session_cache_initialised();
        $information = serialize($information);
        $this->session[$key] = [self::CACHETIME => time(), self::CACHEUSERID => $USER->id, self::CACHEVALUE => $information];
    }
    /**
     * Check the existence of the identifier in the cache
     *
     * @param string|int $key
     * @return bool
     */
    public function cached($key) {
        global $USER;
        $this->ensure_session_cache_initialised();

        if (!array_key_exists($key, $this->session)) {
            return false;
        }
        if (!is_array($this->session[$key])) {
            return false;
        }

        if ($this->session[$key][self::CACHEUSERID] != $USER->id) {
            return false;
        }

        if ($this->session[$key][self::CACHETIME] < $this->timeout) {
            return false;
        }

        return true;
    }
    /**
     * Compare something to it's equivilant in the cache
     *
     * @param string $key
     * @param mixed $value
     * @param bool $serialise Whether to serialise the value before comparison
     *              this should only be set to false if the value is already
     *              serialised
     * @return bool If the value is the same false if it is not set or doesn't match
     */
    public function compare($key, $value, $serialise = true) {
        if ($this->cached($key)) {
            if ($serialise) {
                $value = serialize($value);
            }
            if ($this->session[$key][self::CACHEVALUE] === $value) {
                return true;
            }
        }
        return false;
    }
    /**
     * Wipes the entire cache, good to force regeneration
     */
    public function clear() {
        global $SESSION;
        unset($SESSION->navcache);
        $this->session = null;
    }
    /**
     * Checks all cache entries and removes any that have expired, good ole cleanup
     */
    protected function garbage_collection() {
        if (empty($this->session)) {
            return true;
        }
        foreach ($this->session as $key => $cachedinfo) {
            if (is_array($cachedinfo) && $cachedinfo[self::CACHETIME] < $this->timeout) {
                unset($this->session[$key]);
            }
        }
    }

    /**
     * Marks the cache as being volatile (likely to change)
     *
     * Any caches marked as volatile will be destroyed at the on shutdown by
     * {@link node::destroy_volatile_caches()} which is registered
     * as a shutdown function if any caches are marked as volatile.
     *
     * @param bool $setting True to destroy the cache false not too
     */
    public function volatile($setting = true) {
        if (self::$volatilecaches === null) {
            self::$volatilecaches = [];
            core_shutdown_manager::register_function(['navigation_cache', 'destroy_volatile_caches']);
        }

        if ($setting) {
            self::$volatilecaches[$this->area] = $this->area;
        } else if (array_key_exists($this->area, self::$volatilecaches)) {
            unset(self::$volatilecaches[$this->area]);
        }
    }

    /**
     * Destroys all caches marked as volatile
     *
     * This function is static and works in conjunction with the static volatilecaches
     * property of navigation cache.
     * Because this function is static it manually resets the cached areas back to an
     * empty array.
     */
    public static function destroy_volatile_caches() {
        global $SESSION;
        if (is_array(self::$volatilecaches) && count(self::$volatilecaches) > 0) {
            foreach (self::$volatilecaches as $area) {
                $SESSION->navcache->{$area} = [];
            }
        } else {
            $SESSION->navcache = new stdClass();
        }
    }
}

// Alias this class to the old name.
// This file will be autoloaded by the legacyclasses autoload system.
// In future all uses of this class will be corrected and the legacy references will be removed.
class_alias(navigation_cache::class, \navigation_cache::class);
