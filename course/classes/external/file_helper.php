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

namespace core_course\external;

use cm_info;
use coding_exception;
use context;
use context_course;
use context_module;
use completion_info;
use core_courseformat\base as course_format;
use core_files\archive_writer;
use course_modinfo;
use dml_exception;
use moodle_exception;
use section_info;
use stdClass;

/**
 * Helper for external service file management within a course.
 *
 * @package    core_course
 * @copyright  2022 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class file_helper {

    /** @var stdClass|null The course id to fetch files for */
    protected ?stdClass $course = null;

    /** @var context|null The context for this course */
    protected ?context $context = null;

    /** @var bool Whether the user can update the course */
    protected bool $canupdatecourse = false;

    /** @var bool Whether to include modules or not */
    protected bool $includemodules = true;

    /** @var bool Whether to include contents or not */
    protected bool $includecontents = true;

    /** @var bool Whether to include stealth modules or not */
    protected bool $includestealthmodules = true;

    /** @var course_format|null The course format object */
    protected course_format|null $format = null;

    /** @var int The last section number */
    protected int $lastsectionnumber = 1;

    /** @var course_modinfo|null The course modinfo object */
    protected course_modinfo|null $modinfo = null;

    /** @var \section_info[] The section data */
    protected array $sections = [];

    /** @var completion_info|null The completion info for this course */
    protected completion_info|null $completioninfo = null;

    /** @var stdClass[] The modinfo section data */
    protected array $modinfosections = [];

    /** @var string|null An activity name to filter on */
    protected string|null $activitynamefilter = null;

    /** @var int|null An Course Module ID to filter on */
    protected int|null $cmidfilter = null;

    /** @var int|null An Module Instance ID to filter on */
    protected int|null $modidfilter = null;

    /**
     * Fetch the file helper for the specified course.
     *
     * @param stdClass $course
     */
    public function __construct(stdClass $course) {
        global $CFG, $PAGE;

        require_once("{$CFG->libdir}/externallib.php");

        $this->course = $course;
        $this->context = context_course::instance($course->id, IGNORE_MISSING);
        $this->canupdatecourse = has_capability('moodle/course:update', $this->context);
        $this->courseformat = \core_courseformat\base::instance($this->course);
        $this->modinfo = get_fast_modinfo($course);
        $this->sections = $this->modinfo->get_section_info_all();
        $this->completioninfo = new completion_info($this->course);
        $this->lastsectionnumber = $this->courseformat->get_last_section_number();
        $this->modinfosections = $this->modinfo->get_sections();

        $PAGE->set_context($this->context);
    }

    /**
     * Set whether to include module information.
     *
     * @param bool $include Whether to include module information
     */
    public function set_include_modules(bool $include): void {
        $this->includemodules = $include;
    }

    /**
     * Whether module content should be returned or not.
     *
     * @return bool
     */
    protected function include_modules(): bool {
        return $this->includemodules;
    }

    /**
     * Set whether to include module content.
     *
     * Note: This setting is dependent on the include_modules setting.
     *
     * @param bool $include Whether to include module information
     */
    public function set_include_contents(bool $include): void {
        $this->includecontents = $include;
    }

    /**
     * Whether the module content should be returned or not.
     *
     * @return bool
     */
    protected function include_contents(): bool {
        return $this->includecontents;
    }

    /**
     * Set whether to include stealth modules.
     *
     * Note: This setting is dependent on the include_modules setting.
     *
     * @param bool $include Whether to include module information
     */
    public function set_include_stealth_modules(bool $include): void {
        $this->includestealthmodules = $include;
    }

    /**
     * Whether stealth modules should be included or not.
     *
     * @return bool
     */
    protected function include_stealth_modules(): bool {
        return $this->includestealthmodules;
    }

    /**
     * Set an activity name filter, or use null to clear the current filter.
     *
     * @param null|string $activity
     */
    public function set_activity_name_filter(?string $activity): void {
        $this->activitynamefilter = $activity;
    }

    /**
     * Get the activity name to filter on.
     *
     * @return null|string 
     */
    public function get_activity_name_filter(): ?string {
        return $this->activitynamefilter;
    }

    /**
     * Set the Course Module ID filter.
     *
     * @param null|int $cmid
     */
    public function set_cmid_filter(?int $cmid): void {
        $this->cmidfilter = $cmid;
    }

    /**
     * Get the Course Module ID to filter on
     *
     * @return null|int
     */
    public function get_cmid_filter(): ?int {
        return $this->cmidfilter;
    }

    /**
     * Set the Course Module ID filter.
     *
     * @param null|int $id
     */
    public function set_modid_filter(?int $id): void {
        $this->modidfilter = $id;
    }

    /**
     * Get the Course Module ID to filter on
     *
     * @return null|int
     */
    public function get_modid_filter(): ?int {
        return $this->modidfilter;
    }

    /**
     * Check whether the user can fetch any content for this course.
     *
     * @return bool
     */
    protected function can_fetch_any(): bool {
        if ($this->course->visible) {
            // The course is visible.
            return true;
        }

        if (has_capability('moodle/course:viewhiddencourses', $this->context)) {
            // The course is not visible, but the user can view hidden courses.
            return true;
        }

        if (has_capability('moodle/course:update', $this->context)) {
            // The user can update the course.
            return true;
        }

        return false;
    }

    /**
     * Perform final data processing of the returned course content.
     *
     * @param array $coursecontents The course contents
     * @param array $stealthmodules THe list of stealth modules
     * @return array The processed course contents
     */
    protected function process_fileinfo(array $coursecontents, array $stealthmodules): array {
        // Now that we have iterated over all the sections and activities, check the visibility.
        // We didn't this before to be able to retrieve stealth activities.
        foreach ($coursecontents as $sectionnumber => $sectioncontents) {
            $section = $this->sections[$sectionnumber];

            if (!$this->courseformat->is_section_visible($section)) {
                unset($coursecontents[$sectionnumber]);
                continue;
            }

            // Remove section and modules information if the section is not visible for the user.
            if (!$section->uservisible) {
                $coursecontents[$sectionnumber]['modules'] = [];
                // Remove summary information if the section is completely hidden only,
                // even if the section is not user visible, the summary is always displayed among the availability information.
                if (!$section->visible) {
                    $coursecontents[$sectionnumber]['summary'] = '';
                }
            }
        }

        // Include stealth modules in special section (without any info).
        if (!empty($stealthmodules)) {
            $coursecontents[] = [
                'id' => -1,
                'name' => '',
                'summary' => '',
                'summaryformat' => FORMAT_MOODLE,
                'modules' => $stealthmodules,
            ];
        }

        return $coursecontents;
    }

    /**
     * Get the streamable zip for the specified fileinfo data.
     *
     * @param array $fileinfo
     * @return archive_writer&\core_files\local\archive_writer\stream_writer_interface
     */
    protected function get_streamable_zip_for_fileinfo(array $fileinfo): archive_writer {
        $zipwriter = \core_files\archive_writer::get_stream_writer(
            "coursecontent_{$this->course->id}.zip",
            archive_writer::ZIP_WRITER
        );
        foreach (array_values($fileinfo) as $section) {
            foreach ($section['modules'] as $module) {
                foreach ($module['contents'] ?? [] as $content) {
                    if (!empty($content['storedfile'])) {
                        $file = $content['storedfile'];
                        $filepathinzip = "{$module['id']}/" . $file->get_filepath() . $file->get_filename();
                        $zipwriter->add_file_from_stored_file($filepathinzip, $file);
                    }
                }
            }
        }
        return $zipwriter;
    }

    /**
     * Get the file info for the specified section.
     *
     * @param int $sectionid
     * @return array
     */
    public function get_fileinfo_for_section_id(int $sectionid): array {
        if (!$this->can_fetch_any()) {
            // The user cannot fetch course content for this course.
            // Return an empty array instead.
            return [];
        }

        foreach ($this->sections as $key => $section) {
            if ($section->id === $sectionid) {
                [
                    'sectionvalues' => $sectionvalues,
                    'stealthmodules' => $stealthmodules,
                ] = $this->fetch_course_section_file_info($section);
                $coursecontents = [
                    $key => $sectionvalues,
                ];

                return $this->process_fileinfo($coursecontents, $stealthmodules);
            }
        }

        // Nothing found to export.
        return [];
    }

    /**
     * Get the streamable zip for the specified section id.
     *
     * @param int $sectionid
     * @return archive_writer
     */
    public function get_streamable_zip_for_section_id(int $sectionid): archive_writer {
        $fileinfo = $this->get_fileinfo_for_section_id($sectionid);
        return $this->get_streamable_zip_for_fileinfo($fileinfo);
    }

    /**
     * Get the file info for the specified section.
     *
     * @param int $sectionid
     * @return array
     */
    public function get_fileinfo_for_section_number(int $section): array {
        if (!$this->can_fetch_any()) {
            // The user cannot fetch course content for this course.
            // Return an empty array instead.
            return [];
        }

        foreach ($this->sections as $key => $section) {
            if ($key === $section) {
                [
                    'sectionvalues' => $sectionvalues,
                    'stealthmodules' => $stealthmodules,
                ] = $this->fetch_course_section_file_info($section);
                $coursecontents = [
                    $key => $sectionvalues,
                ];

                return $this->process_fileinfo($coursecontents, $stealthmodules);
            }
        }

        // Nothing found to export.
        return [];
    }

    /**
     * Get the streamable zip for the specified section number.
     *
     * @param int $sectionid
     * @return archive_writer
     */
    public function get_streamable_zip_for_section_number(int $sectionid): archive_writer {
        $fileinfo = $this->get_fileinfo_for_section_number($sectionid);
        return $this->get_streamable_zip_for_fileinfo($fileinfo);
    }

    /**
     * Get the file info for the whole course.
     *
     * @return array
     */
    public function fetch_course_file_info(): array {
        if (!$this->can_fetch_any()) {
            // The user cannot fetch course content for this course.
            // Return an empty array instead.
            return [];
        }

        // Retrieve sections.
        $allstealthmodules = [];
        $coursecontents = [];
        foreach ($this->sections as $key => $section) {
            [
                'sectionvalues' => $sectionvalues,
                'stealthmodules' => $stealthmodules,
            ] = $this->fetch_course_section_file_info($section);
            $coursecontents[$key] = $sectionvalues;
            $allstealthmodules = array_merge($allstealthmodules, $stealthmodules);
        }

        return $this->process_fileinfo($coursecontents, $allstealthmodules);
    }

    /**
     * Get the streamable zip for the whole course.
     *
     * @return archive_writer
     */
    public function get_streamable_zip_for_course(): archive_writer {
        $fileinfo = $this->fetch_course_file_info();
        return $this->get_streamable_zip_for_fileinfo($fileinfo);
    }

    /**
     * Fetch the course section information.
     *
     * @param section_info $section 
     * @return array 
     * @throws coding_exception 
     * @throws dml_exception 
     * @throws moodle_exception 
     */
    protected function fetch_course_section_file_info(section_info $section): array {
        global $USER;

        $sectionvalues = $this->get_section_info($section);
        $stealthmodules = [];

        if (!$this->include_modules()) {
            return [
                'sectionvalues' => $sectionvalues,
                'stealthmodules' => $stealthmodules,
            ];
        }

        if (empty($this->modinfosections[$section->section])) {
            return [
                'sectionvalues' => $sectionvalues,
                'stealthmodules' => $stealthmodules,
            ];
        }

        $sectioncontents = [];

        // For each module of the section.
        foreach ($this->modinfosections[$section->section] as $cmid) {
            $cm = $this->modinfo->cms[$cmid];

            // Stop here if the module is not visible to the user on the course main page:
            // The user can't access the module and the user can't view the module on the course page.
            if (!$cm->uservisible && !$cm->is_visible_on_course_page()) {
                continue;
            }

            // Filter by module name and id.
            $modfound = false;
            if ($activityname = $this->get_activity_name_filter()) {
                if ($cm->modname != $activityname) {
                    continue;
                } else if ($modidfilter = $this->get_modid_filter()) {
                    if ($cm->instance != $modifilter) {
                        // The filter does not match.
                        continue;
                    } else {
                        // Note that if we are only filtering by modname we don't break the loop.
                        $modfound = true;
                    }
                }
            } else if ($cmidfilter = $this->get_cmid_filter()) {
                if ($cm->id != $cmidfilter) {
                    continue;
                } else {
                    $modfound = true;
                }
            }

            $cminfo = cm_info::create($cm);
            $activitydates = \core\activity_dates::get_dates_for_module($cminfo, $USER->id);
            $module = $this->get_module_info($cm, $activitydates);
            if ($this->include_stealth_modules() && !$section->uservisible && $cm->is_stealth()) {
                $stealthmodules[] = $module;
            } else {
                $sectioncontents[] = $module;
            }

            if ($modfound) {
                break;
            }
        }

        $sectionvalues['modules'] = $sectioncontents;

        return [
            'sectionvalues' => $sectionvalues,
            'stealthmodules' => $stealthmodules,
        ];
    }

    /**
     * Get the base section info for the specified section.
     *
     * @param section_info $section
     * @return array
     */
    protected function get_section_info(section_info $section): array {
        $sectioninfo = [
            'id' => $section->id,
            'name' => get_section_name($this->course, $section),
            'visible' => $section->visible,
            'section' => $section->section,
            'hiddenbynumsections' => $section->section > $this->lastsectionnumber ? 1 : 0,
            'uservisible' => $section->uservisible,
            'modules' => [],
            'contents' => [],
        ];

        $options = (object) ['noclean' => true];
        [
            $sectioninfo['summary'],
            $sectioninfo['summaryformat'],
        ] = external_format_text(
            $section->summary,
            $section->summaryformat,
            $this->context->id,
            'course',
            'section',
            $section->id,
            $options,
        );

        if (!empty($section->availableinfo)) {
            $sectioninfo['availabilityinfo'] = \core_availability\info::format_info($section->availableinfo, $this->course);
        }

        return $sectioninfo;
    }

    /**
     * Get the module info for the specified module.
     * @param cm_info $cm
     * @param mixed $activitydates
     * @return array The module information
     */
    protected function get_module_info(cm_info $cm, $activitydates): array {
        global $CFG, $PAGE, $USER;

        $modcontext = context_module::instance($cm->id);

        // Common info (for people being able to see the module or availability dates).
        $module = [
            'id' => $cm->id,
            'name' => external_format_string($cm->name, $modcontext->id),
            'instance' => $cm->instance,
            'contextid' => $modcontext->id,
            'modname' => (string) $cm->modname,
            'modplural' => (string) $cm->modplural,
            'modicon' => $cm->get_icon_url()->out(false),
            'indent' => $cm->indent,
            'onclick' => $cm->onclick,
            'afterlink' => $cm->afterlink,
            'customdata' => json_encode($cm->customdata),
            'completion' => $cm->completion,
            'downloadcontent' => $cm->downloadcontent,
            'noviewlink' => plugin_supports('mod', $cm->modname, FEATURE_NO_VIEW_LINK, false),
            'dates' => $activitydates,

            // User that can view hidden module should know about the visibility.
            'visible' => $cm->visible,
            'visibleoncoursepage' => $cm->visibleoncoursepage,
            'uservisible' => $cm->uservisible,
        ];

        // Check module completion.
        $completion = $this->completioninfo->is_enabled($cm);
        if ($completion != COMPLETION_DISABLED) {
            $exporter = new \core_completion\external\completion_info_exporter($this->course, $cm, $USER->id);
            $renderer = $PAGE->get_renderer('core');
            $modulecompletiondata = (array)$exporter->export($renderer);
            $module['completiondata'] = $modulecompletiondata;
        }

        if (!empty($cm->showdescription) || $module['noviewlink']) {
            // We want to use the external format. However get_formatted_content() format is always FORMAT_HTML.
            $options = ['noclean' => true];
            [
                $module['description'],
            ] = external_format_text(
                $cm->content,
                FORMAT_HTML,
                $modcontext->id,
                $cm->modname,
                'intro',
                $cm->id,
                $options
            );
        }

        if ($cm->url) {
            // Not all activities have a URL (for example, mod_label).
            $module['url'] = $cm->url->out(false);
        }

        $canviewhidden = has_capability('moodle/course:viewhiddenactivities', $modcontext);
        $canupdatecourse = has_capability('moodle/course:update', $modcontext);

        if (!empty($cm->availableinfo)) {
            $module['availabilityinfo'] = \core_availability\info::format_info($cm->availableinfo, $this->course);
        }

        // Availability date (also send to user who can see hidden module).
        if ($CFG->enableavailability && ($canviewhidden || $canupdatecourse)) {
            $module['availability'] = $cm->availability;
        }

        return $this->get_module_contents($cm, $module);
    }

    /**
     * Get the module content.
     *
     * This is usually the list of files in the module.
     *
     * @param cm_info $cm
     * @param array $module The module data without the content info.
     * @return array The module data with the content info.
     */
    protected function get_module_contents(cm_info $cm, array $module): array {
        global $CFG;

        // Return contents only if the user can access to the module.
        if (!$cm->uservisible) {
            return $module;
        }
        $baseurl = 'webservice/pluginfile.php';

        // Call $modulename_export_contents (each module callback take care about checking the capabilities).
        require_once("{$CFG->dirroot}/mod/{$cm->modname}/lib.php");
        $getcontentfunction = "{$cm->modname}_export_contents";
        if (function_exists($getcontentfunction)) {
            $contents = $getcontentfunction($cm, $baseurl);
            $module['contentsinfo'] = [
                'filescount' => count($contents),
                'filessize' => 0,
                'maxfilesize' => 0,
                'lastmodified' => 0,
                'mimetypes' => [],
            ];
            foreach ($contents as $content) {
                // Check repository file (only main file).
                if (!isset($module['contentsinfo']['repositorytype'])) {
                    $module['contentsinfo']['repositorytype'] = $content['repositorytype'] ?? '';
                }
                if (isset($content['filesize'])) {
                    $module['contentsinfo']['filessize'] += $content['filesize'];
                    if ($content['filesize'] > $module['contentsinfo']['maxfilesize']) {
                        $module['contentsinfo']['maxfilesize'] = $content['filesize'];
                    }
                }

                $showlastmodified = isset($content['timemodified']);
                $showlastmodified = $showlastmodified && ($content['timemodified'] > $module['contentsinfo']['lastmodified']);
                if ($showlastmodified) {
                    $module['contentsinfo']['lastmodified'] = $content['timemodified'];
                }
                if (isset($content['mimetype'])) {
                    $module['contentsinfo']['mimetypes'][$content['mimetype']] = $content['mimetype'];
                }
            }

            if ($this->include_contents()) {
                $module['contents'] = $contents;
            }
        }

        return $module;
    }
}
