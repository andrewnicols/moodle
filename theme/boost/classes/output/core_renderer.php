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

namespace theme_boost\output;

use moodle_url;

defined('MOODLE_INTERNAL') || die;

/**
 * Renderers to align Moodle's HTML with that expected by Bootstrap
 *
 * @package    theme_boost
 * @copyright  2012 Bas Brands, www.basbrands.nl
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class core_renderer extends \core_renderer {

    public function edit_button(moodle_url $url) {
        $url->param('sesskey', sesskey());
        if ($this->page->user_is_editing()) {
            $url->param('edit', 'off');
            $editstring = get_string('turneditingoff');
        } else {
            $url->param('edit', 'on');
            $editstring = get_string('turneditingon');
        }
        $button = new \single_button($url, $editstring, 'post', ['class' => 'btn btn-primary']);
        return $this->render_single_button($button);
    }

    /**
     * Temporary renderer for the course index. This needs to be replaced with the real course index
     * once MDL-71209 is ready.
     *
     * @return String the course index html.
     */
    public function courseindex(): ?string {
        global $DB;
        $selected = optional_param(
                'section',
                null,
                PARAM_INT
        );
        $format = course_get_format($this->page->course);
        $course = $format->get_course();
        if (!$format->uses_sections()) {
            return null;
        }

        $sections = $format->get_sections();

        if (empty($sections)) {
            return null;
        }

        $context = \context_course::instance($course->id);

        $modinfo = get_fast_modinfo($course);

        $template = (object)[];

        $completioninfo = new \completion_info($course);

        if ($completioninfo->is_enabled()) {
            $template->completionon = 'completion';
        }

        $completionok = [
                COMPLETION_COMPLETE,
                COMPLETION_COMPLETE_PASS
        ];

        $thiscontext = \context::instance_by_id($this->page->context->id);

        $inactivity = false;
        $myactivityid = 0;

        if ($thiscontext->get_level_name() == get_string('activitymodule')) {
            // Uh-oh we are in a activity.
            $inactivity = true;
            if ($cm = $DB->get_record_sql(
                    "SELECT cm.*, md.name AS modname
                                           FROM {course_modules} cm
                                           JOIN {modules} md ON md.id = cm.module
                                           WHERE cm.id = ?",
                    [$thiscontext->instanceid]
            )) {
                $myactivityid = $cm->id;
            }
        }

        $template->inactivity = $inactivity;

        if (count($sections) > 1) {
            $template->hasprevnext = true;
            $template->hasnext = true;
            $template->hasprev = true;
        }

        $courseurl = new moodle_url(
                '/course/view.php',
                ['id' => $course->id]
        );

        $template->courseurl = $courseurl->out();

        $sectionnums = [];
        foreach ($sections as $section) {
            $sectionnums[] = $section->section;
        }
        foreach ($sections as $section) {
            $i = $section->section;
            if (!$section->uservisible) {
                continue;
            }

            if (!empty($section->name)) {
                $title = format_string(
                        $section->name,
                        true,
                        ['context' => $context]
                );
            } else {
                $summary = file_rewrite_pluginfile_urls(
                        $section->summary,
                        'pluginfile.php',
                        $context->id,
                        'course',
                        'section',
                        $section->id
                );
                $summary = format_text(
                        $summary,
                        $section->summaryformat,
                        [
                                'para' => false,
                                'context' => $context
                        ]
                );
                $title = $format->get_section_name($section);
            }

            $thissection = (object)[];
            $thissection->number = $i;
            $thissection->name = $title;
            $thissection->url = $format->get_view_url($section);
            $thissection->isactive = false;

            if ($i == $selected && !$inactivity) {
                $thissection->isactive = true;
            }

            $thissection->modules = [];
            if (!empty($modinfo->sections[$i])) {
                foreach ($modinfo->sections[$i] as $modnumber) {
                    $module = $modinfo->cms[$modnumber];
                    if ($module->modname == 'label') {
                        continue;
                    }
                    if (!$module->uservisible || !$module->visible || !$module->visibleoncoursepage) {
                        continue;
                    }
                    $thismod = (object)[];

                    if ($inactivity) {
                        if ($myactivityid == $module->id) {
                            $thissection->isactive = true;
                            $thismod->isactive = true;
                        } else {
                            $thismod->isactive = false;
                        }
                    } else {
                        $thismod->isactive = false;
                    }

                    $thismod->name = format_string(
                            $module->name,
                            true,
                            ['context' => $context]
                    );

                    $thismod->url = $module->url;
                    if ($module->modname == 'label') {
                        $thismod->url = '';
                        $thismod->label = 'true';
                    }
                    $hascompletion = $completioninfo->is_enabled($module);
                    if ($hascompletion) {
                        $thismod->completeclass = 'incomplete';
                    }
                    $completiondata = $completioninfo->get_data(
                            $module,
                            true
                    );
                    if (in_array(
                            $completiondata->completionstate,
                            $completionok
                    )) {
                        $thismod->completeclass = 'completed';
                    }
                    $thissection->modules[] = $thismod;
                }
                $thissection->hasmodules = (count($thissection->modules) > 0);
                $template->sections[] = $thissection;
            }
        }
        return $this->render_from_template('core_course/courseindex', $template);
    }

}
