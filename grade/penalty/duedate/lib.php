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
 * Strings for component 'gradepenalty_duedate', language 'en'.
 *
 * @package   gradepenalty_duedate
 * @copyright 2024 Catalyst IT Australia Pty Ltd
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/** Minimum late for value */

use core_grades\local\penalty\manager;

define('GRADEPENALTY_DUEDATE_OVERDUEBY_MIN', 1);

/** Maximum late for value */
define('GRADEPENALTY_DUEDATE_OVERDUEBY_MAX', YEARSECS);

/** Minimum penalty value */
define('GRADEPENALTY_DUEDATE_PENALTY_MIN', 0);

/** Maximum penalty value */
define('GRADEPENALTY_DUEDATE_PENALTY_MAX', 100);

/**
 * Extend the course navigation with a penalty rule settings.
 *
 * @param navigation_node $navigation The settings navigation object
 * @param stdClass $course The course
 * @param context $context Course context
 * @return void
 */
function gradepenalty_duedate_extend_navigation_course(navigation_node $navigation, stdClass $course, context $context) {
    // Get plugin info of this plugin.
    $penaltyplugins = core_plugin_manager::instance()->get_plugins_of_type('gradepenalty');

    // Return if the plugin is not enabled.
    if (!$penaltyplugins['duedate']->is_enabled()) {
        return;
    }

    if (has_capability('gradepenalty/duedate:manage', $context)) {
        $url = new moodle_url('/grade/penalty/duedate/manage_penalty_rule.php', ['contextid' => $context->id]);

        $settingsnode = navigation_node::create(get_string('penaltyrule', 'gradepenalty_duedate'),
            $url, navigation_node::TYPE_SETTING,
            null, 'penaltyrule', new pix_icon('i/settings', ''));
        $navigation->add_node($settingsnode);
    }
}

/**
 * Extend the module navigation with a penalty rule settings.
 *
 * @param navigation_node $navigation The settings navigation object
 * @param cm_info $cm The course module
 * @return void
 */
function gradepenalty_duedate_extend_navigation_module(navigation_node $navigation, cm_info $cm) {
    // Get plugin info of this plugin.
    $penaltyplugins = core_plugin_manager::instance()->get_plugins_of_type('gradepenalty');

    // Return if the plugin is not enabled.
    if (!$penaltyplugins['duedate']->is_enabled()) {
        return;
    }

    // Return if the module is not enabled.
    if (!manager::is_penalty_enabled_for_module($cm->modname)) {
        return;
    }

    $context = context_module::instance($cm->id);

    if (has_capability('gradepenalty/duedate:manage', $context)) {
        $url = new moodle_url('/grade/penalty/duedate/manage_penalty_rule.php', ['contextid' => $context->id]);

        $settingsnode = navigation_node::create(get_string('penaltyrule', 'gradepenalty_duedate'),
            $url, navigation_node::TYPE_SETTING,
            null, 'penaltyrule', new pix_icon('i/settings', ''));
        $navigation->add_node($settingsnode);
    }
}

/**
 * Load penalty rule form.
 *
 * @param array $args parameters to load the form
 * @return string html and js of the form
 */
function gradepenalty_duedate_output_fragment_penalty_rule_form(array $args) {
    $context = $args['context'];

    $params = [
        'contextid' => $context->id,
        'action' => new moodle_url('/grade/penalty/duedate/manage_penalty_rule.php', ['contextid' => $context->id]),
        'penaltyrules' => json_decode($args['penaltyrules'], true),
        'finalpenaltyrule' => $args['finalpenaltyrule'],
    ];

    // Load edit penalty form.
    $form = new gradepenalty_duedate\output\form\edit_penalty_form($params['action'], $params);

    // Return html and js.
    return $form->render();
}
