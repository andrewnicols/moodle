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

namespace core_user\local;

use core\router\pagination_request;
use core\user;
use stdClass;

/**
 * Query a page of the users which the current user is allowed to see.
 *
 * @package    core_user
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class visible_users {
    /**
     * The API sort fields, and the SQL expressions they sort on.
     *
     * Only fields which are visible to anyone who can see the user at all are sortable. Sorting by a field which
     * may be hidden (such as email) would let a caller infer its value.
     *
     * @var string[]
     */
    public const SORT_COLUMNS = [
        'firstname' => 'u.firstname',
        'lastname' => 'u.lastname',
    ];

    /**
     * The order applied after any requested sort, and used when none is requested.
     *
     * The id is only a final tie-breaker so that pages are stable. It is not meaningful to sort by.
     */
    private const DEFAULT_ORDER = 'u.lastname ASC, u.firstname ASC, u.id ASC';

    /**
     * Get one page of the users visible to the current user.
     *
     * Visibility follows {@see user::search()}: anyone with moodle/user:viewdetails at system level can see every
     * user, otherwise only users enrolled in a course where the current user has that capability, and themselves.
     *
     * @param pagination_request $pagination
     * @param string $search An optional search term, matched against names and visible identity fields
     * @return array{users: stdClass[], total: int}
     */
    public static function get_page(pagination_request $pagination, string $search = ''): array {
        global $DB, $USER;

        $systemcontext = \core\context\system::instance();

        $conditions = ['u.deleted = 0', 'u.id <> :guestid'];
        $params = ['guestid' => guest_user()->id];

        if (!has_capability('moodle/user:viewdetails', $systemcontext)) {
            [$enrolledsql, $enrolledparams] = user::get_enrolled_sql_on_courses_with_capability('moodle/user:viewdetails');
            if ($enrolledsql) {
                $conditions[] = "(u.id IN ({$enrolledsql}) OR u.id = :selfid)";
                $params = array_merge($params, $enrolledparams);
            } else {
                $conditions[] = 'u.id = :selfid';
            }
            $params['selfid'] = $USER->id;
        }

        if ($search !== '') {
            $searchsql = user::get_users_search_sql($systemcontext, $search);
            $conditions[] = $searchsql['where'];
            $params = array_merge($params, $searchsql['params']);
        }

        $where = implode(' AND ', $conditions);

        $total = $DB->count_records_sql("SELECT COUNT(1) FROM {user} u WHERE {$where}", $params);

        $order = $pagination->get_order_by(self::SORT_COLUMNS);
        $order = $order ? "{$order}, " . self::DEFAULT_ORDER : self::DEFAULT_ORDER;

        $users = $DB->get_records_sql(
            "SELECT u.* FROM {user} u WHERE {$where} ORDER BY {$order}",
            $params,
            $pagination->get_offset(),
            $pagination->get_limit(),
        );

        return [
            'users' => array_values($users),
            'total' => $total,
        ];
    }

    /**
     * Get the courses in which the current user can view the details of enrolled users.
     *
     * Users who are only visible because of a course-level capability cannot be described without a course context.
     *
     * @return stdClass[]
     */
    public static function get_courses_with_viewdetails(): array {
        $courses = get_user_capability_course('moodle/user:viewdetails', null, true, '', 'id');

        return $courses ? array_values($courses) : [];
    }
}
