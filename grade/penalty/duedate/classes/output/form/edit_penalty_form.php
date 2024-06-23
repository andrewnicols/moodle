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

namespace gradepenalty_duedate\output\form;

defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir . '/formslib.php');
require_once(__DIR__ . '/../../../lib.php');

use action_menu_link;
use core\output\action_menu;
use core\output\html_writer;
use core\output\pix_icon;
use gradepenalty_duedate\penalty_rule;
use moodle_url;
use moodleform;

/**
 * Form to set up the penalty rules for the gradepenalty_duedate plugin.
 *
 * @package   gradepenalty_duedate
 * @copyright 2024 Catalyst IT Australia Pty Ltd
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class edit_penalty_form extends moodleform {
    /** @var int contextid context id where the penalty rules are edited */
    protected $contextid = 0;

    /**
     * Define the form.
     *
     * @return void
     */
    public function definition() {
        global $PAGE;
        $mform = $this->_form;

        // Hidden context id, value is stored in $mform.
        $this->contextid = $this->_customdata['contextid'] ?? 1;
        $mform->addElement('hidden', 'contextid');
        $mform->setType('contextid', PARAM_INT);
        $mform->setDefault('contextid', $this->contextid);

        // Edit mode.
        $mform->addElement('hidden', 'edit', 1);
        $mform->setType('edit', PARAM_INT);

        // Get existing penalty rules, clone from parent context if not found.
        $finalpenaltyrule = $this->_customdata['finalpenaltyrule'] ?? null;
        if (!is_null($finalpenaltyrule)) {
            $repeatedrules = $this->_customdata['penaltyrules'];
        } else {
            $existingrules = penalty_rule::get_rules($this->contextid);

            if (!empty($existingrules)) {
                // Clone from parent context.
                // Extract the final rule.
                $finalpenaltyrule = array_pop($existingrules);
                // We need the penalty value only.
                $finalpenaltyrule = $finalpenaltyrule->get('penalty');

                // Other rules, turn to array so that we can use them in form repeat element.
                $repeatedrules = [];
                foreach ($existingrules as $rule) {
                    $repeatedrules[] = [
                        'overdueby' => $rule->get('overdueby'),
                        'penalty' => $rule->get('penalty'),
                    ];
                }
            }
        }

        // Rule group repeater. Show default of 5 rules if there is no rule.
        $repeatcount = !is_null($finalpenaltyrule) ? count($repeatedrules) : 0;
        $elements = [];
        $options = [];

        // Overdue.
        $elements[] = $mform->createElement('static', '', '', get_string('overdueby_label', 'gradepenalty_duedate'));
        $elements[] = $mform->createElement('static', '', '', '&le;');
        $elements[] = $mform->createElement('duration', 'overdueby',
            get_string('overdueby_label', 'gradepenalty_duedate'),
            ['optional' => false, 'defaultunit' => DAYSECS]);
        $options['overdueby']['type'] = PARAM_INT;
        $options['overdueby']['default'] = DAYSECS;

        // Penalty.
        $elements[] = $mform->createElement('static', '', '', get_string('penalty_label', 'gradepenalty_duedate'));
        $elements[] = $mform->createElement('text', 'penalty',
            get_string('penalty_label', 'gradepenalty_duedate'), 'maxlength="5" size="5"');
        $options['penalty']['type'] = PARAM_FLOAT;
        $options['penalty']['default'] = 1;
        $percenttext = html_writer::start_tag('span', ['class' => 'percent mr-6']);
        $percenttext .= get_string('percentshort', 'core_grades');
        $percenttext .= html_writer::end_tag('span');
        $elements[] = $mform->createElement('static', '', '', $percenttext);

        // Action menu.
        $output = $PAGE->get_renderer('core');
        $menu = new action_menu();
        $menu->set_kebab_trigger();
        // Add insert item.
        $menu->add(new action_menu_link(
            new \moodle_url('#'),
            new pix_icon('t/add', ''),
            get_string('insertrule', 'gradepenalty_duedate'),
            false,
            ['class' => 'insertbelow']
        ));
        // Add delete item.
        $menu->add(new action_menu_link(
            new \moodle_url('#'),
            new pix_icon('i/trash', ''),
            get_string('delete'),
            false,
            ['class' => 'deleterulebuttons text-danger']
        ));
        $actionmenu = $output->render($menu);
        $elements[] = $mform->createElement('static', 'name1', 'name2', $actionmenu);

        // Put them in a group.
        $group = $mform->createElement('group', 'rulegroup',
            get_string('penaltyrule_group', 'gradepenalty_duedate'), $elements, ['&nbsp;'], false);

        // Create repeatable elements.
        $this->repeat_elements([$group], $repeatcount, $options, 'rulegroupcount', 'addrules', 0);

        // We don't need "addrules" button.
        $mform->removeElement('addrules');

        // Final rule input.
        $mform->addElement('text', 'finalpenaltyrule', get_string('finalpenaltyrule', 'gradepenalty_duedate'), ['size' => 3]);
        $mform->setType('finalpenaltyrule', PARAM_FLOAT);
        $mform->setDefault('finalpenaltyrule', 0);
        $mform->addHelpButton('finalpenaltyrule', 'finalpenaltyrule', 'gradepenalty_duedate');

        // Set data.
        if (!is_null($finalpenaltyrule)) {
            $data = [];
            $data['finalpenaltyrule'] = $finalpenaltyrule;
            foreach ($repeatedrules as $rulenumber => $rule) {
                $data['overdueby[' . $rulenumber . ']'] = $rule['overdueby'];
                $data['penalty[' . $rulenumber . ']'] = $rule['penalty'];
            }
            $this->set_data($data);
        }

        // Add submit and cancel buttons.
        $this->add_action_buttons();

        // Add javascript to handle the repeater.
        $PAGE->requires->js_call_amd('gradepenalty_duedate/edit_penalty_form', 'init');
    }

    /**
     * Validate the form data.
     *
     * @param array $data form data
     * @param array $files form files
     * @return array of errors
     */
    public function validation($data, $files) {
        $errors = parent::validation($data, $files);

        // Skip if there is no data.
        if (empty($data['overdueby'])) {
            return $errors;
        }

        // The late for and penalty values must be in ascending order.
        $overduebylowerbound = GRADEPENALTY_DUEDATE_OVERDUEBY_MIN - 1;
        $overduebyupperbound = GRADEPENALTY_DUEDATE_OVERDUEBY_MAX + 1;
        $penaltylowerbound = GRADEPENALTY_DUEDATE_PENALTY_MIN - 1;
        $penaltyupperbound = GRADEPENALTY_DUEDATE_PENALTY_MAX + 1;

        // Go to each group.
        foreach ($data['overdueby'] as $rulenumber => $overdueby) {
            $rulegroupid = 'rulegroup[' . $rulenumber . ']';

            // Skip validation if user did not change default overdue value. We will remove those rules later.
            if ($overdueby < GRADEPENALTY_DUEDATE_OVERDUEBY_MIN) {
                continue;
            }

            // Validate overdue field.
            if ($overdueby <= $overduebylowerbound) {
                if ($overduebylowerbound == GRADEPENALTY_DUEDATE_OVERDUEBY_MIN - 1) {
                    // Minimum value of overdue field.
                    $errormessage = get_string('error_overdueby_minvalue', 'gradepenalty_duedate',
                        format_time(GRADEPENALTY_DUEDATE_OVERDUEBY_MIN));
                } else {
                    // Must be greater than the previous overdue value.
                    $errormessage = get_string('error_overdueby_abovevalue', 'gradepenalty_duedate',
                        format_time($overduebylowerbound));
                }
                $errors[$rulegroupid] = $errormessage;
            } else if ($overdueby >= $overduebyupperbound) {
                // Validate max value of overdue.
                $errors[$rulegroupid] = get_string('error_overdueby_maxvalue', 'gradepenalty_duedate',
                    format_time(GRADEPENALTY_DUEDATE_OVERDUEBY_MAX));
            } else {
                $overduebylowerbound = $overdueby;
            }

            // Validate penalty.
            $penalty = $data['penalty'][$rulenumber];
            if ($penalty <= $penaltylowerbound) {
                if ($penaltylowerbound == GRADEPENALTY_DUEDATE_PENALTY_MIN - 1) {
                    // Minimum value a penalty can have.
                    $errormessage = get_string('error_penalty_minvalue', 'gradepenalty_duedate',
                        format_float(GRADEPENALTY_DUEDATE_PENALTY_MIN));
                } else {
                    // Must be greater than the previous penalty.
                    $errormessage = get_string('error_penalty_abovevalue', 'gradepenalty_duedate',
                        format_float($penaltylowerbound));
                }

                if (isset($errors[$rulegroupid])) {
                    // Append to existing error message.
                    $errors[$rulegroupid] .= ' ' . $errormessage;
                } else {
                    // Create new error message.
                    $errors[$rulegroupid] = $errormessage;
                }
            } else if ($penalty >= $penaltyupperbound) {
                // Validate max value of penalty.
                $errors[$rulegroupid] = get_string('error_penalty_maxvalue', 'gradepenalty_duedate',
                    format_float(GRADEPENALTY_DUEDATE_PENALTY_MAX));
            } else {
                $penaltylowerbound = $penalty;
            }
        }

        // Check the penalty of the final rule. It must be greater than the last rule.
        $finalpenalty = $data['finalpenaltyrule'];
        if ($finalpenalty <= $penaltylowerbound) {
            $errors['finalpenaltyrule'] = get_string('error_penalty_abovevalue', 'gradepenalty_duedate',
                format_float($penaltylowerbound));
        } else if ($finalpenalty >= $penaltyupperbound) {
            $errors['finalpenaltyrule'] = get_string('error_penalty_maxvalue', 'gradepenalty_duedate',
                format_float(GRADEPENALTY_DUEDATE_PENALTY_MAX));
        }

        return $errors;
    }

    /**
     * Save the form data.
     *
     * @param object $data form data
     * @return void
     */
    public function save_data($data) {
        // Get penalty rules.
        $rules = penalty_rule::get_records(['contextid' => $this->contextid], 'sortorder', 'ASC');

        // There could be deleted rules, so we will reindex the array.
        $newdata = [];
        if (isset($data->overdueby)) {
            foreach ($data->overdueby as $rulenumber => $overdueby) {
                // Remove the invalid default rule that we skipped validating.
                if ($overdueby >= GRADEPENALTY_DUEDATE_OVERDUEBY_MIN) {
                    $newdata[$overdueby] = $data->penalty[$rulenumber];
                }
            }
            // Sort by overdueby.
            ksort($newdata);
        }

        // Update or create new rules.
        $numofrulesinrepeater = count($newdata);
        $overdueby = array_keys($newdata);
        $penalty = array_values($newdata);
        for ($i = 0; $i < $numofrulesinrepeater; $i++) {
            // Create new rule if it does not exist.
            $rule = $rules[$i] ?? new penalty_rule();

            // Set the values.
            $rule->set('contextid', $this->contextid);
            $rule->set('sortorder', $i);
            $rule->set('overdueby', $overdueby[$i]);
            $rule->set('penalty', $penalty[$i]);

            // Save the rule.
            $rule->save();
        }

        // Save the final rule.
        // Check if the final rule exists.
        $finalrule = $rules[$numofrulesinrepeater] ?? new penalty_rule();
        $finalrule->set('contextid', $this->contextid);
        $finalrule->set('sortorder', $numofrulesinrepeater);
        if (!empty($overdueby)) {
            // We can set to any date/time that greater than the last rule in the repeater.
            $finalrule->set('overdueby', end($overdueby) + DAYSECS);
        } else {
            $finalrule->set('overdueby', GRADEPENALTY_DUEDATE_OVERDUEBY_MIN);
        }
        $finalrule->set('penalty', $data->finalpenaltyrule);
        $finalrule->save();

        // Number of updated rules. Plus one, due to final rule.
        $numofupdatedrules = $numofrulesinrepeater + 1;

        // Delete rules if there are more rules than the form data.
        if (count($rules) > $numofupdatedrules) {
            for ($i = $numofupdatedrules; $i < count($rules); $i++) {
                $rules[$i]->delete();
            }
        }
    }
}
