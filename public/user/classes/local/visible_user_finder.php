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

use core\current_user;
use core\dml\database_proxy;
use core\router\pagination_request;
use core\user;
use stdClass;

/**
 * Find the users which a viewing user is allowed to see.
 *
 * @package    core_user
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class visible_user_finder {
    /**
     * Constructor.
     *
     * @param database_proxy $db The database
     * @param current_user $currentuser The user who is looking for other users
     */
    public function __construct(
        /** @var database_proxy The database */
        protected database_proxy $db,
        /** @var current_user The user who is looking for other users */
        protected current_user $currentuser,
    ) {
    }

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
     * @param bool $onlyself Limit the results to the current user
     * @return array{users: stdClass[], total: int|null, hasmore: bool}
     */
    public function get_page(
        pagination_request $pagination,
        string $search = '',
        bool $onlyself = false,
    ): array {
        $systemcontext = \core\context\system::instance();

        $conditions = ['u.deleted = 0', 'u.id <> :guestid'];
        $params = ['guestid' => guest_user()->id];

        if ($onlyself) {
            $conditions[] = 'u.id = :selfid';
            $params['selfid'] = $this->currentuser->get_id();
        } else if (!$this->currentuser->has_capability('moodle/user:viewdetails', $systemcontext)) {
            [$enrolledsql, $enrolledparams] = user::get_enrolled_sql_on_courses_with_capability('moodle/user:viewdetails');
            if ($enrolledsql) {
                $conditions[] = "(u.id IN ({$enrolledsql}) OR u.id = :selfid)";
                $params = array_merge($params, $enrolledparams);
            } else {
                $conditions[] = 'u.id = :selfid';
            }
            $params['selfid'] = $this->currentuser->get_id();
        }

        if ($search !== '') {
            $searchsql = user::get_users_search_sql($systemcontext, $search);
            $conditions[] = $searchsql['where'];
            $params = array_merge($params, $searchsql['params']);
        }

        $where = implode(' AND ', $conditions);

        $order = $pagination->get_order_by(self::SORT_COLUMNS);
        $order = $order ? "{$order}, " . self::DEFAULT_ORDER : self::DEFAULT_ORDER;

        $users = array_values($this->db->get_records_sql(
            "SELECT u.* FROM {user} u WHERE {$where} ORDER BY {$order}",
            $params,
            $pagination->get_offset(),
            $pagination->get_limit() + 1,
        ));
        $hasmore = count($users) > $pagination->get_limit();
        if ($hasmore) {
            array_pop($users);
        }

        return [
            'users' => $users,
            'total' => null,
            'hasmore' => $hasmore,
        ];
    }

    /**
     * Get the courses in which the current user can view the details of enrolled users.
     *
     * Users who are only visible because of a course-level capability cannot be described without a course context.
     *
     * @return stdClass[]
     */
    public function get_courses_with_viewdetails(): array {
        $courses = get_user_capability_course('moodle/user:viewdetails', $this->currentuser->get_id(), true, '', 'id');

        return $courses ? array_values($courses) : [];
    }
}
