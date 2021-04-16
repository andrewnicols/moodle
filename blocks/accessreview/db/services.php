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
 * @package     block_accessreview
 * @author      Max Larkin <max@brickfieldlabs.ie>
 * @copyright   2020 Brickfield Education Labs <max@brickfieldlabs.ie>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$functions = [
    'block_accessreview_set_toggle_preference' => [
        'classname'   => 'block_accessreview_external',
        'methodname'  => 'set_toggle_preference',
        'classpath'   => 'block/accessreview/classes/external.php',
        'description' => 'Sets the heatmap toggle preference.',
        'type'        => 'read',
        'ajax'        => true
    ],
    'block_accessreview_get_module_data' => [
        'classname'   => 'block_accessreview_external',
        'methodname'  => 'get_module_data',
        'classpath'   => 'block/accessreview/classes/external.php',
        'description' => 'Gets error data for course modules.',
        'type'        => 'read',
        'ajax'        => true
    ],
    'block_accessreview_get_section_data' => [
        'classname'   => 'block_accessreview_external',
        'methodname'  => 'get_section_data',
        'classpath'   => 'block/accessreview/classes/external.php',
        'description' => 'Gets error data for course sections.',
        'type'        => 'read',
        'ajax'        => true
    ]
];

$services = [
    'block_accessreview' => [
        'functions' => [
            'block_accessreview_set_toggle_preference',
            'block_accessreview_get_module_data',
            'block_accessreview_get_section_data'
        ],
        'restrictedusers' => 0,
        'enabled' => 1,
    ]
];