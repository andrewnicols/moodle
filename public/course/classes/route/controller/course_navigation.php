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

namespace core_course\route\controller;

use core\router\route;
use core\router\require_login;
use core_course\cm_info;
use core_course\modinfo;
use core_course\section_info;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Class course_navigation
 *
 * @package    core_course
 * @copyright  2025 Ferran Recio <ferran@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class course_navigation {
    use \core\router\route_controller;

    /**
     * Go to the next element of the course.
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param \stdClass $cm
     * @return ResponseInterface
     */
    #[route(
        path: '/cm/{cm}/next',
        pathtypes: [
            new \core\router\parameters\path_module(),
        ],
        requirelogin: new require_login(
            requirelogin: true,
            courseattributename: 'course',
        ),
    )]
    public function cm_next_element(
        ServerRequestInterface $request,
        ResponseInterface $response,
        \stdClass $cm,
    ): ResponseInterface {
        // The pathinfo module returns a stdClass and not a cm_info, so we need to
        // get the cm_info instance from the course modinfo.
        $coursemodinfo  = modinfo::instance($cm->course);
        $cm = $coursemodinfo->get_cm($cm->id);
        $modinfo = $cm->get_modinfo();

        $allcms = $this->get_all_cms($modinfo);
        $cmindex = array_search($cm, $allcms, true);

        if ($cmindex === false) {
            return $this->page_not_found($request, $response);
        }
        $cmcount = count($allcms);
        // Search for the next CM that has got an URL, skipping the ones that don't have it (like labels).
        $cmindex++;
        while ($cmindex < $cmcount) {
            $nextcm = $allcms[$cmindex] ?? null;
            if (!empty($nextcm) && !empty($nextcm->get_url())) {
                break;
            }
            $cmindex++;
        }
        if (empty($nextcm) || empty($nextcm->get_url())) {
            return $this->page_not_found($request, $response);
        }
        return $this->redirect($response, $nextcm->get_url());
    }

    /**
     * Get all course modules in the course in order, including also activities inside sub-sections.
     *
     * @param \core_course\modinfo $modinfo
     * @return cm_info[]
     */
    private function get_all_cms(modinfo $modinfo): array {
        $cms = [];
        $sections = $modinfo->get_section_info_all();
        foreach ($sections as $section) {
            if ($section->is_delegated()) {
                continue;
            }
            $cms = array_merge(
                $cms,
                $this->get_all_section_cms($modinfo, $section),
            );
        }
        return $cms;
    }

    /**
     * Get all course modules in a section in order, including also activities inside sub-sections.
     *
     * @param modinfo $modinfo
     * @param section_info $section
     * @return cm_info[]
     */
    private function get_all_section_cms(modinfo $modinfo, section_info $section): array {
        $sectioncms = [];
        foreach ($section->get_sequence_cm_infos() as $cm) {
            $delegatedsection = $cm->get_delegated_section_info();
            if ($delegatedsection) {
                $sectioncms = array_merge(
                    $sectioncms,
                    $this->get_all_section_cms($modinfo, $delegatedsection),
                );
            } else {
                $sectioncms[] = $cm;
            }
        }
        return $sectioncms;
    }
}
