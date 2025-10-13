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
 * Install Composer Dependencies from the web interface.
 *
 * @package    core_admin
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

use core\composer;
use core\url;

define('NO_OUTPUT_BUFFERING', true);
require_once('../config.php');
require_once("{$CFG->libdir}/adminlib.php");

admin_externalpage_setup('composer');

require_admin();
$context = context_system::instance();

$installcomposer = optional_param('installcomposer', 0, PARAM_BOOL);
$upgradecomposer = optional_param('upgradecomposer', 0, PARAM_BOOL);
$installdependencies = optional_param('installdependencies', 0, PARAM_BOOL);

if ($installcomposer || $upgradecomposer || $installdependencies) {
    require_sesskey();
}

$phpbinary = get_config('phpbinary');

if (empty($phpbinary)) {
    redirect(
        '/../admin/settings.php?section=php',
        get_string('phpbinarynotconfigured', 'admin'),
    );
}

$PAGE->set_url(new \core\url('/admin/composerinstall.php'));
$PAGE->set_context($context);
$PAGE->set_heading($SITE->fullname);
$PAGE->set_title(get_string('composermanage', 'admin'));

$composer = new composer();

if ($installcomposer) {
    if (!$composer->is_runnable()) {
        redirect(
            new url('/admin/composerinstall.php'),
            get_string('composernotrunnable', 'admin'),
            null,
            \core\notification::ERROR,
        );
    } else if ($composer->is_composer_installed()) {
        redirect(
            new url('/admin/composerinstall.php'),
            get_string('composeralreadyinstalled', 'admin'),
            null,
            \core\notification::ERROR,
        );
    }
} else if ($upgradecomposer) {
    if (!$composer->is_runnable()) {
        redirect(
            new url('/admin/composerinstall.php'),
            get_string('composernotrunnable', 'admin'),
            null,
            \core\notification::ERROR,
        );
    } else if (!$composer->is_composer_installed()) {
        redirect(
            new url('/admin/composerinstall.php'),
            get_string('composernotinstalled', 'admin'),
            null,
            \core\notification::ERROR,
        );
    }
} else if ($installdependencies) {
    if (!$composer->is_runnable()) {
        redirect(
            new url('/admin/composerinstall.php'),
            get_string('composernotrunnable', 'admin'),
            null,
            \core\notification::ERROR,
        );
    } else if (!$composer->is_composer_installed()) {
        redirect(
            new url('/admin/composerinstall.php'),
            get_string('composernotinstalled', 'admin'),
            null,
            \core\notification::ERROR,
        );
    }
}

echo $OUTPUT->header();
echo $OUTPUT->heading(get_string('composermanage', 'admin'));

if ($installcomposer) {
    echo $OUTPUT->select_element_for_append();

    try {
        $composer->install_composer();
        echo $OUTPUT->notification(get_string('composerinstalled', 'admin'), \core\output\notification::NOTIFY_SUCCESS);
    } catch (Exception $e) {
        \core\notification::error(get_string('composerinstallerror', 'admin', $e->getMessage()));
    }
}

if ($upgradecomposer) {
    echo $OUTPUT->select_element_for_append();

    try {
        $composer->upgrade_composer();
        echo $OUTPUT->notification(get_string('composerupgraded', 'admin'), \core\output\notification::NOTIFY_SUCCESS);
    } catch (Exception $e) {
        \core\notification::error(get_string('composerupgradeerror', 'admin', $e->getMessage()));
    }
}

if ($installdependencies) {
    echo $OUTPUT->select_element_for_append();

    try {
        $composer->install_dependencies();
        echo $OUTPUT->notification(
            get_string('composerdependenciesinstalled', 'admin'),
            \core\output\notification::NOTIFY_SUCCESS,
        );
    } catch (Exception $e) {
        \core\notification::error(get_string('composerdependenciesinstallerror', 'admin', $e->getMessage()));
    }
}

// Display status of Composer.
if ($composer->is_composer_installed()) {
    echo "Composer is installed<br>\n";
} else {
    echo "Composer is not installed<br>\n";
}

// Display status of Dependencies.
if ($composer->is_up_to_date()) {
    echo "Composer dependencies are up-to-date<br>\n";
} else {
    echo "Composer are not up-to-date<br>\n";
}

if ($composer->are_dev_dependencies_installed()) {
    echo "Composer development dependencies are installed<br>\n";
} else {
    echo "Composer development dependencies are not installed<br>\n";
}

if ($composer->is_runnable()) {
    if ($composer->is_composer_installed()) {
        // Support upgrade and installing dependneices.
        echo $OUTPUT->single_button(
            new url('/admin/composerinstall.php', ['upgradecomposer' => 1]),
            get_string('composerupgrade', 'admin'),
            'post',
        );

        echo $OUTPUT->single_button(
            new url('/admin/composerinstall.php', ['installdependencies' => 1]),
            get_string('composerinstalldependencies', 'admin'),
            'post',
        );
    } else {
        // Support installing composer.
        echo $OUTPUT->single_button(
            new url('/admin/composerinstall.php', ['installcomposer' => 1]),
            get_string('composerinstall', 'admin'),
            'post',
        );
    }
}

echo $OUTPUT->footer();
