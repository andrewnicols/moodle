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

namespace core;

use core\dml\database_proxy;

/**
 * Enrolment query helpers.
 *
 * @package    core
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class enrolment {
    /**
     * Maximum course IDs per query, keeping both the filter and CASE expression under conservative bind limits.
     * @var int
     */
    private const MAX_COURSE_IDS_PER_QUERY = 400;

    /** @var int Maximum number of user IDs to include in one query. */
    private const MAX_USER_IDS_PER_QUERY = 100;

    /**
     * Constructor.
     *
     * @param database_proxy $db The database
     */
    public function __construct(
        /** @var database_proxy The database */
        protected database_proxy $db,
    ) {
    }

    /**
     * Find the first matching course for each user from an ordered list.
     *
     * The input course order is used to choose the first course in which each user is enrolled. The front-page
     * course is always considered last because all non-deleted users are treated as enrolled in it.
     *
     * @param int[] $courseids Course IDs in priority order
     * @param int[] $userids User IDs to check
     * @param bool $onlyactive Whether to consider only active enrolments
     * @return array<int, int> Map of user IDs to the first matching course ID
     */
    public function get_first_matching_course_for_users(
        array $courseids,
        array $userids,
        bool $onlyactive = false,
    ): array {
        $courseids = array_values(array_unique(array_map('intval', $courseids)));
        $userids = array_values(array_unique(array_map('intval', $userids)));
        if (!$courseids || !$userids) {
            return [];
        }

        $frontpageposition = array_search((int) SITEID, $courseids, true);
        if ($frontpageposition !== false) {
            // The front page matches every user, so keep it as a fallback after more specific course matches.
            array_splice($courseids, $frontpageposition, 1);
            $frontpageposition = count($courseids);
        } else {
            $frontpageposition = null;
        }

        $positionbycourseid = array_flip($courseids);
        $courseidsbyposition = $courseids;
        if ($frontpageposition !== null) {
            $courseidsbyposition[$frontpageposition] = (int) SITEID;
        }

        $coursechunks = $courseids
            ? array_chunk($courseids, self::MAX_COURSE_IDS_PER_QUERY)
            : [[]];
        $userchunks = array_chunk($userids, self::MAX_USER_IDS_PER_QUERY);
        $positionbyuserid = [];

        foreach ($coursechunks as $coursechunk) {
            foreach ($userchunks as $userchunk) {
                $batchpositions = $this->get_user_course_positions_for_batch(
                    $coursechunk,
                    $userchunk,
                    $positionbycourseid,
                    $frontpageposition,
                    $onlyactive,
                );
                foreach ($batchpositions as $userid => $position) {
                    if (!isset($positionbyuserid[$userid]) || $position < $positionbyuserid[$userid]) {
                        $positionbyuserid[$userid] = $position;
                    }
                }
            }
        }

        $coursebyuserid = [];
        foreach ($positionbyuserid as $userid => $position) {
            $coursebyuserid[$userid] = $courseidsbyposition[$position];
        }

        return $coursebyuserid;
    }

    /**
     * Get each user's earliest matching course position for one pair of input chunks.
     *
     * @param int[] $coursechunk Course IDs in priority order
     * @param int[] $userchunk User IDs to check
     * @param array Course positions indexed by ID
     * @param int|null $frontpageposition Front-page position, if present
     * @param bool $onlyactive Whether to consider only active enrolments
     * @return array<int, int> Map of user IDs to their earliest matching course position
     */
    private function get_user_course_positions_for_batch(
        array $coursechunk,
        array $userchunk,
        array $positionbycourseid,
        ?int $frontpageposition,
        bool $onlyactive,
    ): array {
        $params = [];
        $joins = '';
        $coursepositionexpression = ':frontpageposition';

        if ($coursechunk) {
            [$courseinsql, $courseparams] = $this->db->get_in_or_equal(
                $coursechunk,
                SQL_PARAMS_NAMED,
                'enrolledcourse',
            );
            $params = array_merge($params, $courseparams);

            $caseconditions = [];
            foreach ($coursechunk as $courseid) {
                $position = $positionbycourseid[$courseid];
                $parameter = "courseposition{$position}";
                $caseconditions[] = "WHEN :{$parameter} THEN {$position}";
                $params[$parameter] = $courseid;
            }
            $coursepositionexpression = 'MIN(CASE e.courseid ' . implode(' ', $caseconditions) . ' END)';

            $userenrolconditions = ['ue.userid = u.id'];
            $enrolconditions = [
                'e.id = ue.enrolid',
                "e.courseid {$courseinsql}",
            ];
            if ($onlyactive) {
                $now = round(time(), -2);
                $userenrolconditions[] = 'ue.status = :active';
                $userenrolconditions[] = 'ue.timestart < :now1';
                $userenrolconditions[] = '(ue.timeend = 0 OR ue.timeend > :now2)';
                $enrolconditions[] = 'e.status = :enabled';
                $params += [
                    'active' => ENROL_USER_ACTIVE,
                    'enabled' => ENROL_INSTANCE_ENABLED,
                    'now1' => $now,
                    'now2' => $now,
                ];
            }

            $jointype = $frontpageposition !== null ? 'LEFT JOIN' : 'JOIN';
            $joins = "
                {$jointype} {user_enrolments} ue ON " . implode(' AND ', $userenrolconditions) . "
                {$jointype} {enrol} e ON " . implode(' AND ', $enrolconditions);

            if ($frontpageposition !== null) {
                $coursepositionexpression = "COALESCE({$coursepositionexpression}, :frontpageposition)";
            }
        }

        if ($frontpageposition !== null) {
            $params['frontpageposition'] = $frontpageposition;
        }

        [$userinsql, $userparams] = $this->db->get_in_or_equal(
            $userchunk,
            SQL_PARAMS_NAMED,
            'enrolleduser',
        );
        $params = array_merge($params, $userparams);

        $records = $this->db->get_records_sql(
            "
                SELECT u.id AS userid, {$coursepositionexpression} AS courseposition
                  FROM {user} u
                  {$joins}
                 WHERE u.deleted = 0
                   AND u.id {$userinsql}
              GROUP BY u.id",
            $params,
        );

        $positionsbyuserid = [];
        foreach ($records as $record) {
            $positionsbyuserid[(int) $record->userid] = (int) $record->courseposition;
        }

        return $positionsbyuserid;
    }
}
