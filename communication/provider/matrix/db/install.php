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
 * Upgrade script for communication_matrix.
 *
 * @package   communication_matrix
 * @copyright 2023 Stevani Andolo <stevani.andolo@moodle.com>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

declare(strict_types=1);

/**
 * Perform the post-install procedures.
 */
function xmldb_communication_matrix_install() {
    // Use an ad-hoc task to create new Communication category with its field for matrix user id.
    $testsrunning = false;
    if (defined('PHPUNIT_TEST') || PHPUNIT_TEST || defined('BEHAT_SITE_RUNNING') ||
            defined('BEHAT_TEST') || defined('BEHAT_UTIL')) {
        $testsrunning = true;
    }

    if ($testsrunning === false) {
        $postinstall = new \communication_matrix\task\post_install();
        core\task\manager::queue_adhoc_task($postinstall);
    }
}
