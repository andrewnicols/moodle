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

namespace core_admin\local\tree;

use context;
use context_system;
use core_admin\local\settings\linkable_settings_page;
use core_text;
use moodle_url;

/**
 * Links external PHP pages into the admin tree.
 *
 * See detailed usage example at the top of this document (adminlib.php)
 *
 * @package   core
 * @copyright 2022 Andrew Lyons <andrew@nicols.co.uk>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class externalpage implements part_of_admin_tree, linkable_settings_page {

    /** @var string An internal name for this external page. Must be unique amongst ALL part_of_admin_tree objects */
    public $name;

    /** @var string The displayed name for this external page. Usually obtained through get_string(). */
    public $visiblename;

    /** @var string The external URL that we should link to when someone requests this external page. */
    public $url;

    /** @var array The role capability/permission a user must have to access this external page. */
    public $req_capability;

    /** @var object The context in which capability/permission should be checked, default is site context. */
    public $context;

    /** @var bool hidden in admin tree block. */
    public $hidden;

    /** @var mixed either string or array of string */
    public $path;

    /** @var array list of visible names of page parents */
    public $visiblepath;

    /**
     * Constructor for adding an external page into the admin tree.
     *
     * @param string $name The internal name for this external page. Must be unique amongst ALL part_of_admin_tree objects.
     * @param string $visiblename The displayed name for this external page. Usually obtained through get_string().
     * @param string $url The external URL that we should link to when someone requests this external page.
     * @param mixed $reqcapability The role capability/permission a user must have to access this external page.
     *                              Defaults to 'moodle/site:config'.
     * @param boolean $hidden Is this external page hidden in admin tree block? Default false.
     * @param context $context The context the page relates to. Not sure what happens
     *      if you specify something other than system or front page. Defaults to system.
     */
    public function __construct(
        $name,
        $visiblename,
        $url,
        $reqcapability = 'moodle/site:config',
        $hidden = false,
        context $context = null
    ) {
        $this->name        = $name;
        $this->visiblename = $visiblename;
        $this->url         = $url;
        if (is_array($reqcapability)) {
            $this->req_capability = $reqcapability;
        } else {
            $this->req_capability = [$reqcapability];
        }
        $this->hidden = $hidden;
        $this->context = $context;
    }

    /**
     * Get the URL to view this settings page.
     *
     * @return moodle_url
     */
    public function get_settings_page_url(): moodle_url {
        return new moodle_url($this->url);
    }

    /**
     * Returns a reference to the part_of_admin_tree object with internal name $name.
     *
     * @param string $name The internal name of the object we want.
     * @param bool $findpath defaults to false
     * @return mixed A reference to the object with internal name $name if found, otherwise a reference to NULL.
     */
    public function locate($name, $findpath = false) {
        if ($this->name == $name) {
            if ($findpath) {
                $this->visiblepath = [$this->visiblename];
                $this->path        = [$this->name];
            }
            return $this;
        } else {
            $return = null;
            return $return;
        }
    }

    /**
     * This function always returns false, required function by interface
     *
     * @param string $name
     * @return false
     */
    public function prune($name) {
        return false;
    }

    /**
     * Search using query
     *
     * @param string $query
     * @return mixed array-object structure of found settings and pages
     */
    public function search($query) {
        $found = false;
        if (strpos(strtolower($this->name), $query) !== false) {
            $found = true;
        } else if (strpos(core_text::strtolower($this->visiblename), $query) !== false) {
                $found = true;
        }
        if ($found) {
            return [
                $this->name => (object) [
                    'page' => $this,
                    'settings' => [],
                ],
            ];
        } else {
            return [];
        }
    }

    /**
     * Determines if the current user has access to this external page based on $this->req_capability.
     *
     * @return bool True if user has access, false otherwise.
     */
    public function check_access() {
        $context = empty($this->context) ? context_system::instance() : $this->context;
        foreach ($this->req_capability as $cap) {
            if (has_capability($cap, $context)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Is this external page hidden in admin tree block?
     *
     * @return bool True if hidden
     */
    public function is_hidden() {
        return $this->hidden;
    }

    /**
     * Show we display Save button at the page bottom?
     * @return bool
     */
    public function show_save() {
        return false;
    }
}
