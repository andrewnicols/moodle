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

namespace core\behat;

/**
 * TODO describe file config
 *
 * @package    core
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

class config extends \core\config {
    /**
     * Reset the configuration based on the site configuration.
     *
     * @param \core\config $originalconfig
     * @return \core\config
     */
    public static function reset_config_from_config(\core\config $originalconfig): \core\config {
        $cleanconfigdata = self::get_clean_config($originalconfig);

        // Now we can begin switching config->X for config->behat_X.
        $cleanconfigdata->wwwroot = $originalconfig->behat_wwwroot;
        $cleanconfigdata->prefix = $originalconfig->behat_prefix;
        $cleanconfigdata->dataroot = $originalconfig->behat_dataroot;

        // And we do the same with the optional ones.
        $allowedconfigoverride = ['dbname', 'dbuser', 'dbpass', 'dbhost'];
        foreach ($allowedconfigoverride as $config) {
            $behatconfig = 'behat_' . $config;
            if (!isset($originalconfig->$behatconfig)) {
                continue;
            }
            $cleanconfigdata->$config = $originalconfig->$behatconfig;
        }

        return static::from_object($cleanconfigdata);
    }

    /**
     * Get a clean copy of the Moodle config for Behat.
     *
     * @param \core\config $originalconfig
     * @return \stdClass
     */
    private static function get_clean_config(\core\config $originalconfig): \stdClass {
        $cleanconfigdata = new \stdClass();

        $allowed = array_flip(array(
            'wwwroot',
            'dataroot',
            'root',
            'dirroot',
            'admin',
            'directorypermissions',
            'filepermissions',
            'umaskpermissions',
            'dbtype',
            'dblibrary',
            'dbhost',
            'dbname',
            'dbuser',
            'dbpass',
            'prefix',
            'dboptions',
            'proxyhost',
            'proxyport',
            'proxytype',
            'proxyuser',
            'proxypassword',
            'proxybypass',
            'pathtogs',
            'pathtophp',
            'pathtodu',
            'aspellpath',
            'pathtodot',
            'skiplangupgrade',
            'altcacheconfigpath',
            'pathtounoconv',
            'alternative_file_system_class',
            'pathtopython',
            'routerconfigured',
        ));

        // Add extra allowed settings.
        if (!empty($originalconfig->behat_extraallowedsettings)) {
            $allowed = array_merge($allowed, array_flip($originalconfig->behat_extraallowedsettings));
        }

        // Also allowing behat_ prefixed attributes.
        foreach ($originalconfig as $key => $value) {
            if (isset($allowed[$key]) || strpos($key, 'behat_') === 0) {
                $cleanconfigdata->$key = $value;
            }
        }

        // Allow email catcher settings.
        if (defined('TEST_EMAILCATCHER_MAIL_SERVER')) {
            $cleanconfigdata->noemailever = false;
            $cleanconfigdata->smtphosts = TEST_EMAILCATCHER_MAIL_SERVER;
        }

        return $cleanconfigdata;
    }
}
