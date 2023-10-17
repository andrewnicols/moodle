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
 * Administration settings definitions for the quiz module.
 *
 * @package   mod_quiz
 * @copyright 2010 Petr Skoda
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

use mod_quiz\admin\review_setting;

defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot . '/mod/quiz/lib.php');

// First get a list of quiz reports with there own settings pages. If there none,
// we use a simpler overall menu structure.
$reports = core_component::get_plugin_list_with_file('quiz', 'settings.php', false);
$reportsbyname = [];
foreach ($reports as $report => $reportdir) {
    $strreportname = get_string($report . 'report', 'quiz_'.$report);
    $reportsbyname[$strreportname] = $report;
}
core_collator::ksort($reportsbyname);

// First get a list of quiz reports with there own settings pages. If there none,
// we use a simpler overall menu structure.
$rules = core_component::get_plugin_list_with_file('quizaccess', 'settings.php', false);
$rulesbyname = [];
foreach ($rules as $rule => $ruledir) {
    $strrulename = get_string('pluginname', 'quizaccess_' . $rule);
    $rulesbyname[$strrulename] = $rule;
}
core_collator::ksort($rulesbyname);

// Create the quiz settings page.
if (empty($reportsbyname) && empty($rulesbyname)) {
    $pagetitle = get_string('modulename', 'mod_quiz');
} else {
    $pagetitle = get_string('generalsettings', 'core_admin');
}
$quizsettings = new admin_settingpage('modsettingquiz', $pagetitle, 'moodle/site:config');

if ($ADMIN->fulltree) {
    // Introductory explanation that all the settings are defaults for the add quiz form.
    $quizsettings->add(new admin_setting_heading('quizintro', '', get_string('configintro', 'mod_quiz')));

    // Time limit.
    $setting = new admin_setting_configduration('quiz/timelimit',
            get_string('timelimit', 'mod_quiz'), get_string('configtimelimitsec', 'mod_quiz'),
            '0', 60);
    $setting->set_advanced_flag_options(admin_setting_flag::ENABLED, false);
    $setting->set_locked_flag_options(admin_setting_flag::ENABLED, false);
    $quizsettings->add($setting);

    // Delay to notify graded attempts.
    $quizsettings->add(new admin_setting_configduration('quiz/notifyattemptgradeddelay',
        get_string('attemptgradeddelay', 'mod_quiz'), get_string('attemptgradeddelay_desc', 'mod_quiz'), 5 * HOURSECS, HOURSECS));

    // What to do with overdue attempts.
    $setting = new \mod_quiz\admin\overdue_handling_setting('quiz/overduehandling',
            get_string('overduehandling', 'mod_quiz'), get_string('overduehandling_desc', 'mod_quiz'),
            ['value' => 'autosubmit', 'adv' => false], null);
    $setting->set_locked_flag_options(admin_setting_flag::ENABLED, false);
    $quizsettings->add($setting);

    // Grace period time.
    $setting = new admin_setting_configduration('quiz/graceperiod',
            get_string('graceperiod', 'mod_quiz'), get_string('graceperiod_desc', 'mod_quiz'),
            '86400');
    $setting->set_advanced_flag_options(admin_setting_flag::ENABLED, false);
    $setting->set_locked_flag_options(admin_setting_flag::ENABLED, false);
    $quizsettings->add($setting);

    // Minimum grace period used behind the scenes.
    $quizsettings->add(new admin_setting_configduration('quiz/graceperiodmin',
            get_string('graceperiodmin', 'mod_quiz'), get_string('graceperiodmin_desc', 'mod_quiz'),
            60, 1));

    // Number of attempts.
    $options = [get_string('unlimited')];
    for ($i = 1; $i <= QUIZ_MAX_ATTEMPT_OPTION; $i++) {
        $options[$i] = $i;
    }
    $setting = new admin_setting_configselect('quiz/attempts',
            get_string('attemptsallowed', 'mod_quiz'), get_string('configattemptsallowed', 'mod_quiz'),
            0, $options);
    $setting->set_advanced_flag_options(admin_setting_flag::ENABLED, false);
    $setting->set_locked_flag_options(admin_setting_flag::ENABLED, false);
    $quizsettings->add($setting);

    // Grading method.
    $setting = new \mod_quiz\admin\grade_method_setting('quiz/grademethod',
            get_string('grademethod', 'mod_quiz'), get_string('configgrademethod', 'mod_quiz'),
            ['value' => QUIZ_GRADEHIGHEST, 'adv' => false], null);
    $setting->set_locked_flag_options(admin_setting_flag::ENABLED, false);
    $quizsettings->add($setting);

    // Maximum grade.
    $setting = new admin_setting_configtext('quiz/maximumgrade',
            get_string('maximumgrade'), get_string('configmaximumgrade', 'mod_quiz'), 10, PARAM_INT);
    $setting->set_locked_flag_options(admin_setting_flag::ENABLED, false);
    $quizsettings->add($setting);

    // Questions per page.
    $perpage = [];
    $perpage[0] = get_string('never');
    $perpage[1] = get_string('aftereachquestion', 'mod_quiz');
    for ($i = 2; $i <= QUIZ_MAX_QPP_OPTION; ++$i) {
        $perpage[$i] = get_string('afternquestions', 'mod_quiz', $i);
    }
    $setting = new admin_setting_configselect('quiz/questionsperpage',
            get_string('newpageevery', 'mod_quiz'), get_string('confignewpageevery', 'mod_quiz'),
            1, $perpage);
    $setting->set_advanced_flag_options(admin_setting_flag::ENABLED, false);
    $setting->set_locked_flag_options(admin_setting_flag::ENABLED, false);
    $quizsettings->add($setting);

    // Navigation method.
    $setting = new admin_setting_configselect('quiz/navmethod',
            get_string('navmethod', 'mod_quiz'), get_string('confignavmethod', 'mod_quiz'),
            QUIZ_NAVMETHOD_FREE, quiz_get_navigation_options());
    $setting->set_advanced_flag_options(admin_setting_flag::ENABLED, true);
    $setting->set_locked_flag_options(admin_setting_flag::ENABLED, false);
    $quizsettings->add($setting);

    // Shuffle within questions.
    $setting = new admin_setting_configcheckbox('quiz/shuffleanswers',
            get_string('shufflewithin', 'mod_quiz'), get_string('configshufflewithin', 'mod_quiz'),
            1);
    $setting->set_advanced_flag_options(admin_setting_flag::ENABLED, false);
    $setting->set_locked_flag_options(admin_setting_flag::ENABLED, false);
    $quizsettings->add($setting);

    // Preferred behaviour.
    $setting = new admin_setting_question_behaviour('quiz/preferredbehaviour',
            get_string('howquestionsbehave', 'core_question'), get_string('howquestionsbehave_desc', 'mod_quiz'),
            'deferredfeedback');
    $setting->set_locked_flag_options(admin_setting_flag::ENABLED, false);
    $quizsettings->add($setting);

    // Can redo completed questions.
    $setting = new admin_setting_configselect('quiz/canredoquestions',
            get_string('canredoquestions', 'mod_quiz'), get_string('canredoquestions_desc', 'mod_quiz'),
            0,
            [0 => get_string('no'), 1 => get_string('canredoquestionsyes', 'mod_quiz')]);
    $setting->set_advanced_flag_options(admin_setting_flag::ENABLED, true);
    $setting->set_locked_flag_options(admin_setting_flag::ENABLED, false);
    $quizsettings->add($setting);

    // Each attempt builds on last.
    $setting = new admin_setting_configcheckbox('quiz/attemptonlast',
            get_string('eachattemptbuildsonthelast', 'mod_quiz'),
            get_string('configeachattemptbuildsonthelast', 'mod_quiz'),
            0);
    $setting->set_advanced_flag_options(admin_setting_flag::ENABLED, true);
    $setting->set_locked_flag_options(admin_setting_flag::ENABLED, false);
    $quizsettings->add($setting);

    // Review options.
    $quizsettings->add(new admin_setting_heading('reviewheading',
            get_string('reviewoptionsheading', 'mod_quiz'), ''));
    foreach (review_setting::fields() as $field => $name) {
        $default = review_setting::all_on();
        $forceduring = null;
        if ($field == 'attempt') {
            $forceduring = true;
        } else if ($field == 'overallfeedback') {
            $default = $default ^ review_setting::DURING;
            $forceduring = false;
        }
        $quizsettings->add(new review_setting('quiz/review' . $field,
                $name, '', $default, $forceduring));
    }

    // Show the user's picture.
    $setting = new \mod_quiz\admin\user_image_setting('quiz/showuserpicture',
            get_string('showuserpicture', 'mod_quiz'), get_string('configshowuserpicture', 'mod_quiz'),
            ['value' => 0, 'adv' => false], null);
    $setting->set_locked_flag_options(admin_setting_flag::ENABLED, false);
    $quizsettings->add($setting);

    // Decimal places for overall grades.
    $options = [];
    for ($i = 0; $i <= QUIZ_MAX_DECIMAL_OPTION; $i++) {
        $options[$i] = $i;
    }
    $setting = new admin_setting_configselect('quiz/decimalpoints',
            get_string('decimalplaces', 'mod_quiz'), get_string('configdecimalplaces', 'mod_quiz'),
            2, $options);
    $setting->set_advanced_flag_options(admin_setting_flag::ENABLED, false);
    $setting->set_locked_flag_options(admin_setting_flag::ENABLED, false);
    $quizsettings->add($setting);

    // Decimal places for question grades.
    $options = [-1 => get_string('sameasoverall', 'mod_quiz')];
    for ($i = 0; $i <= QUIZ_MAX_Q_DECIMAL_OPTION; $i++) {
        $options[$i] = $i;
    }
    $setting = new admin_setting_configselect('quiz/questiondecimalpoints',
            get_string('decimalplacesquestion', 'mod_quiz'),
            get_string('configdecimalplacesquestion', 'mod_quiz'),
            -1, $options);
    $setting->set_advanced_flag_options(admin_setting_flag::ENABLED, false);
    $setting->set_locked_flag_options(admin_setting_flag::ENABLED, false);
    $quizsettings->add($setting);

    // Show blocks during quiz attempts.
    $setting = new admin_setting_configcheckbox('quiz/showblocks',
            get_string('showblocks', 'mod_quiz'), get_string('configshowblocks', 'mod_quiz'),
            0);
    $setting->set_advanced_flag_options(admin_setting_flag::ENABLED, true);
    $setting->set_locked_flag_options(admin_setting_flag::ENABLED, false);
    $quizsettings->add($setting);

    // Password.
    $setting = new admin_setting_configpasswordunmask('quiz/quizpassword',
            get_string('requirepassword', 'mod_quiz'), get_string('configrequirepassword', 'mod_quiz'),
            '');
    $setting->set_advanced_flag_options(admin_setting_flag::ENABLED, false);
    $setting->set_required_flag_options(admin_setting_flag::ENABLED, false);
    $setting->set_locked_flag_options(admin_setting_flag::ENABLED, false);
    $quizsettings->add($setting);

    // IP restrictions.
    $setting = new admin_setting_configtext('quiz/subnet',
            get_string('requiresubnet', 'mod_quiz'), get_string('configrequiresubnet', 'mod_quiz'),
            '', PARAM_TEXT);
    $setting->set_advanced_flag_options(admin_setting_flag::ENABLED, true);
    $setting->set_locked_flag_options(admin_setting_flag::ENABLED, false);
    $quizsettings->add($setting);

    // Enforced delay between attempts.
    $setting = new admin_setting_configduration('quiz/delay1',
            get_string('delay1st2nd', 'mod_quiz'), get_string('configdelay1st2nd', 'mod_quiz'),
            0, 60);
    $setting->set_advanced_flag_options(admin_setting_flag::ENABLED, true);
    $setting->set_locked_flag_options(admin_setting_flag::ENABLED, false);
    $quizsettings->add($setting);
    $setting = new admin_setting_configduration('quiz/delay2',
            get_string('delaylater', 'mod_quiz'), get_string('configdelaylater', 'mod_quiz'),
            0, 60);
    $setting->set_advanced_flag_options(admin_setting_flag::ENABLED, true);
    $setting->set_locked_flag_options(admin_setting_flag::ENABLED, false);
    $quizsettings->add($setting);

    // Browser security.
    $setting = new \mod_quiz\admin\browser_security_setting('quiz/browsersecurity',
            get_string('showinsecurepopup', 'mod_quiz'), get_string('configpopup', 'mod_quiz'),
            ['value' => '-', 'adv' => true], null);
    $setting->set_locked_flag_options(admin_setting_flag::ENABLED, false);
    $quizsettings->add($setting);

    $quizsettings->add(new admin_setting_configtext('quiz/initialnumfeedbacks',
            get_string('initialnumfeedbacks', 'mod_quiz'), get_string('initialnumfeedbacks_desc', 'mod_quiz'),
            2, PARAM_INT, 5));

    // Allow user to specify if setting outcomes is an advanced setting.
    if (!empty($CFG->enableoutcomes)) {
        $quizsettings->add(new admin_setting_configcheckbox('quiz/outcomes_adv',
            get_string('outcomesadvanced', 'mod_quiz'), get_string('configoutcomesadvanced', 'mod_quiz'),
            '0'));
    }

    // Autosave frequency.
    $quizsettings->add(new admin_setting_configduration('quiz/autosaveperiod',
            get_string('autosaveperiod', 'mod_quiz'), get_string('autosaveperiod_desc', 'mod_quiz'), 60, 1));
}

// Now, depending on whether any reports have their own settings page, add
// the quiz setting page to the appropriate place in the tree.
if (empty($reportsbyname) && empty($rulesbyname)) {
    $ADMIN->add('modsettings', $quizsettings);
} else {
    $ADMIN->add('modsettings', new admin_category('modsettingsquizcat',
            get_string('modulename', 'mod_quiz'), $module->is_enabled() === false));
    $ADMIN->add('modsettingsquizcat', $quizsettings);

    // Add settings pages for the quiz report subplugins.
    foreach ($reportsbyname as $strreportname => $report) {
        $reportname = $report;

        $settings = new admin_settingpage('modsettingsquizcat'.$reportname,
                $strreportname, 'moodle/site:config', $module->is_enabled() === false);
        include($CFG->dirroot . "/mod/quiz/report/$reportname/settings.php");
        if (!empty($settings)) {
            $ADMIN->add('modsettingsquizcat', $settings);
        }
    }

    // Add settings pages for the quiz access rule subplugins.
    foreach ($rulesbyname as $strrulename => $rule) {
        $settings = new admin_settingpage('modsettingsquizcat' . $rule,
                $strrulename, 'moodle/site:config', $module->is_enabled() === false);
        include($CFG->dirroot . "/mod/quiz/accessrule/$rule/settings.php");
        if (!empty($settings)) {
            $ADMIN->add('modsettingsquizcat', $settings);
        }
    }
}

$settings = null; // We do not want standard settings link.
