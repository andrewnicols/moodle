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

use admin_settingdependency;
use context_system;
use core_admin\local\settings\linkable_settings_page;
use core_admin\setting;
use core_text;
use moodle_url;
use stdClass;

/**
 * Used to group a number of admin_setting objects into a page and add them to the admin tree.
 *
 * @package   core
 * @copyright 2022 Andrew Lyons <andrew@nicols.co.uk>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class settingpage implements part_of_admin_tree, linkable_settings_page {

    /** @var string An internal name for this external page. Must be unique amongst ALL part_of_admin_tree objects */
    public $name;

    /** @var string The displayed name for this external page. Usually obtained through get_string(). */
    public $visiblename;

    /** @var mixed An array of admin_setting objects that are part of this setting page. */
    public $settings;

    /** @var admin_settingdependency[] list of settings to hide when certain conditions are met */
    protected $dependencies = [];

    /** @var array The role capability/permission a user must have to access this external page. */
    public $req_capability;

    /** @var object The context in which capability/permission should be checked, default is site context. */
    public $context;

    /** @var bool hidden in admin tree block. */
    public $hidden;

    /** @var mixed string of paths or array of strings of paths */
    public $path;

    /** @var array list of visible names of page parents */
    public $visiblepath;

    /**
     * see admin_settingpage for details of this function
     *
     * @param string $name The internal name for this external page. Must be unique amongst ALL part_of_admin_tree objects.
     * @param string $visiblename The displayed name for this external page. Usually obtained through get_string().
     * @param mixed $req_capability The role capability/permission a user must have to access this external page. Defaults to 'moodle/site:config'.
     * @param boolean $hidden Is this external page hidden in admin tree block? Default false.
     * @param stdClass $context The context the page relates to. Not sure what happens
     *      if you specify something other than system or front page. Defaults to system.
     */
    public function __construct($name, $visiblename, $req_capability='moodle/site:config', $hidden=false, $context=NULL) {
        $this->settings    = new stdClass();
        $this->name        = $name;
        $this->visiblename = $visiblename;
        if (is_array($req_capability)) {
            $this->req_capability = $req_capability;
        } else {
            $this->req_capability = array($req_capability);
        }
        $this->hidden      = $hidden;
        $this->context     = $context;
    }

    /**
     * Get the URL to view this page.
     *
     * @return moodle_url
     */
    public function get_settings_page_url(): moodle_url {
        return new moodle_url(
            '/admin/settings.php',
            [
                'section' => $this->name,
            ]
        );
    }

    /**
     * see category
     *
     * @param string $name
     * @param bool $findpath
     * @return mixed Object (this) if name ==  this->name, else returns null
     */
    public function locate($name, $findpath=false) {
        if ($this->name == $name) {
            if ($findpath) {
                $this->visiblepath = array($this->visiblename);
                $this->path        = array($this->name);
            }
            return $this;
        } else {
            $return = NULL;
            return $return;
        }
    }

    /**
     * Search string in settings page.
     *
     * @param string $query
     * @return array
     */
    public function search($query) {
        $found = array();

        foreach ($this->settings as $setting) {
            if ($setting->is_related($query)) {
                $found[] = $setting;
            }
        }

        if ($found) {
            $result = new stdClass();
            $result->page     = $this;
            $result->settings = $found;
            return array($this->name => $result);
        }

        $found = false;
        if (strpos(strtolower($this->name), $query) !== false) {
            $found = true;
        } else if (strpos(core_text::strtolower($this->visiblename), $query) !== false) {
                $found = true;
            }
        if ($found) {
            $result = new stdClass();
            $result->page     = $this;
            $result->settings = array();
            return array($this->name => $result);
        } else {
            return array();
        }
    }

    /**
     * This function always returns false, required by interface
     *
     * @param string $name
     * @return bool Always false
     */
    public function prune($name) {
        return false;
    }

    /**
     * adds an admin_setting to this settingpage
     *
     * not the same as add for category. adds an admin_setting to this settingpage. settings appear (on the settingpage) in the order in which they're added
     * n.b. each admin_setting in an settingpage must have a unique internal name
     *
     * @param object $setting is the admin_setting object you want to add
     * @return bool true if successful, false if not
     */
    public function add($setting) {
        if (!($setting instanceof setting)) {
            debugging('error - not a setting instance');
            return false;
        }

        $name = $setting->name;
        if ($setting->plugin) {
            $name = $setting->plugin . $name;
        }
        $this->settings->{$name} = $setting;
        return true;
    }

    /**
     * Hide the named setting if the specified condition is matched.
     *
     * @param string $settingname
     * @param string $dependenton
     * @param string $condition
     * @param string $value
     */
    public function hide_if($settingname, $dependenton, $condition = 'notchecked', $value = '1') {
        $this->dependencies[] = new admin_settingdependency($settingname, $dependenton, $condition, $value);

        // Reformat the dependency name to the plugin | name format used in the display.
        $dependenton = str_replace('/', ' | ', $dependenton);

        // Let the setting know, so it can be displayed underneath.
        $findname = str_replace('/', '', $settingname);
        foreach ($this->settings as $name => $setting) {
            if ($name === $findname) {
                $setting->add_dependent_on($dependenton);
            }
        }
    }

    /**
     * see externalpage
     *
     * @return bool Returns true for yes false for no
     */
    public function check_access() {
        global $CFG;
        $context = empty($this->context) ? context_system::instance() : $this->context;
        foreach($this->req_capability as $cap) {
            if (has_capability($cap, $context)) {
                return true;
            }
        }
        return false;
    }

    /**
     * outputs this page as html in a table (suitable for inclusion in an admin pagetype)
     * @return string Returns an XHTML string
     */
    public function output_html() {
        $adminroot = admin_get_root();
        $return = '<fieldset>'."\n".'<div class="clearer"><!-- --></div>'."\n";
        foreach($this->settings as $setting) {
            $fullname = $setting->get_full_name();
            if (array_key_exists($fullname, $adminroot->errors)) {
                $data = $adminroot->errors[$fullname]->data;
            } else {
                $data = $setting->get_setting();
                // do not use defaults if settings not available - upgrade settings handles the defaults!
            }
            $return .= $setting->output_html($data);
        }
        $return .= '</fieldset>';
        return $return;
    }

    /**
     * Is this settings page hidden in admin tree block?
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
        foreach($this->settings as $setting) {
            if (empty($setting->nosave)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Should any of the settings on this page be shown / hidden based on conditions?
     * @return bool
     */
    public function has_dependencies() {
        return (bool)$this->dependencies;
    }

    /**
     * Format the setting show/hide conditions ready to initialise the page javascript
     * @return array
     */
    public function get_dependencies_for_javascript() {
        if (!$this->has_dependencies()) {
            return [];
        }
        return admin_settingdependency::prepare_for_javascript($this->dependencies);
    }
}
