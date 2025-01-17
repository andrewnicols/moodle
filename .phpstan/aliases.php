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

define('CACHE_DISABLE_ALL', true);
define('MOODLE_INTERNAL', true);

$dirroot = dirname(__DIR__);
$dataroot = "{$dirroot}/.phpstan/dataroot";

global $CFG;
/** @var \stdClass */
$CFG = (object) [
    'admin' => 'admin',
    'cachedir' => sys_get_temp_dir(),
    'dirroot' => $dirroot,
    'dataroot' => $dataroot,
    'libdir' => $dirroot . '/lib',
    'wwwroot' => 'https://example.com',
    'debugdeveloper' => 1,
    'langlocalroot' => $dataroot ."/en_local",
    'langotherroot' => $dataroot ."/lang",
];

require_once($CFG->dirroot . '/lib/classes/component.php');
spl_autoload_register('core_component::classloader');
require_once($CFG->dirroot . '/vendor/autoload.php');

/** @var \moodle_database */
$DB;

/** @var \moodle_page */
$PAGE;

/** @var \core_renderer|\bootstrap_renderer */
$OUTPUT;

/** @var \stdClass */
$SESSION;

/** @var \stdClass */
$COURSE;

/** @var \stdClass */
$SITE;

define('SYSCONTEXTID', 1);

// Point pear include path to moodles lib/pear so that includes and requires will search there for files before anywhere else
// the problem is that we need specific version of quickforms and hacked excel files :-(.
ini_set('include_path', $CFG->libdir . '/pear' . PATH_SEPARATOR . ini_get('include_path'));

// Register our classloader.
\core\component::register_autoloader();

require_once($CFG->libdir . '/setuplib.php');        // Functions that MUST be loaded first.

// Load up standard libraries.
require_once($CFG->libdir . '/filterlib.php');       // Functions for filtering test as it is output.
require_once($CFG->libdir . '/ajax/ajaxlib.php');    // Functions for managing our use of JavaScript and YUI.
require_once($CFG->libdir . '/weblib.php');          // Functions relating to HTTP and content.
require_once($CFG->libdir . '/outputlib.php');       // Functions for generating output.
require_once($CFG->libdir . '/navigationlib.php');   // Class for generating Navigation structure.
require_once($CFG->libdir . '/dmllib.php');          // Database access.
require_once($CFG->libdir . '/datalib.php');         // Legacy lib with a big-mix of functions..
require_once($CFG->libdir . '/accesslib.php');       // Access control functions.
require_once($CFG->libdir . '/deprecatedlib.php');   // Deprecated functions included for backward compatibility.
require_once($CFG->libdir . '/moodlelib.php');       // Other general-purpose functions.
require_once($CFG->libdir . '/enrollib.php');        // Enrolment related functions.
require_once($CFG->libdir . '/pagelib.php');         // Library that defines the moodle_page class, used for $PAGE.
require_once($CFG->libdir . '/blocklib.php');        // Library for controlling blocks.
require_once($CFG->libdir . '/grouplib.php');        // Groups functions.
require_once($CFG->libdir . '/sessionlib.php');      // All session and cookie related stuff.
require_once($CFG->libdir . '/editorlib.php');       // All text editor related functions and classes.
require_once($CFG->libdir . '/messagelib.php');      // Messagelib functions.
require_once($CFG->libdir . '/modinfolib.php');      // Cached information on course-module instances.

// Load up other common classes.
require_once($CFG->libdir . "/adminlib.php");
require_once($CFG->libdir . "/authlib.php");
require_once($CFG->libdir . "/badgeslib.php");
require_once($CFG->libdir . "/clilib.php");
require_once($CFG->libdir . "/completionlib.php");
require_once($CFG->libdir . "/cronlib.php");
require_once($CFG->libdir . "/csslib.php");
require_once($CFG->libdir . "/customcheckslib.php");
require_once($CFG->libdir . "/ddllib.php");
require_once($CFG->libdir . "/dtllib.php");
require_once($CFG->libdir . "/editorlib.php");
require_once($CFG->libdir . "/environmentlib.php");
require_once($CFG->libdir . "/externallib.php");
require_once($CFG->libdir . "/filelib.php");
require_once($CFG->libdir . "/flickrlib.php");
require_once($CFG->libdir . "/formslib.php");
require_once($CFG->libdir . "/gdlib.php");
require_once($CFG->libdir . "/gradelib.php");
require_once($CFG->libdir . "/graphlib.php");
require_once($CFG->libdir . "/installlib.php");
require_once($CFG->libdir . "/jslib.php");
require_once($CFG->libdir . "/ldaplib.php");
require_once($CFG->libdir . "/licenselib.php");
require_once($CFG->libdir . "/listlib.php");
require_once($CFG->libdir . "/mathslib.php");
require_once($CFG->libdir . "/moodlelib.php");
require_once($CFG->libdir . "/myprofilelib.php");
require_once($CFG->libdir . "/navigationlib.php");
require_once($CFG->libdir . "/oauthlib.php");
require_once($CFG->libdir . "/outputlib.php");
require_once($CFG->libdir . "/pagelib.php");
require_once($CFG->libdir . "/pdflib.php");
require_once($CFG->libdir . "/phpminimumversionlib.php");
require_once($CFG->libdir . "/plagiarismlib.php");
require_once($CFG->libdir . "/portfoliolib.php");
require_once($CFG->libdir . "/questionlib.php");
require_once($CFG->libdir . "/resourcelib.php");
require_once($CFG->libdir . "/rsslib.php");
require_once($CFG->libdir . "/searchlib.php");
require_once($CFG->libdir . "/sessionlib.php");
require_once($CFG->libdir . "/setuplib.php");
require_once($CFG->libdir . "/soaplib.php");
require_once($CFG->libdir . "/statslib.php");
require_once($CFG->libdir . "/tablelib.php");
require_once($CFG->libdir . "/tokeniserlib.php");
require_once($CFG->libdir . "/upgradelib.php");
require_once($CFG->libdir . "/uploadlib.php");
require_once($CFG->libdir . "/wasmlib.php");
require_once($CFG->libdir . "/webdavlib.php");
require_once($CFG->libdir . "/weblib.php");
require_once($CFG->libdir . "/xsendfilelib.php");

require_once($CFG->dirroot . '/question/type/questionbase.php');

// \core_h5p\local\library\handler::register();
\h5plib_v127\local\library\handler::register();
