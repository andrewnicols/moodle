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

namespace core\api\repository;

use core\encryption;

/**
 * Repository for REST API Idempotency Keys.
 *
 * Captured responses are encrypted at rest using {@see encryption}, since they may contain the
 * full content of a sensitive API response (e.g. a newly-created resource, including any
 * personal data it contains).
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class idempotency_key_repository {
    /** @var string The record is for a request which is currently being processed. */
    public const STATE_PROCESSING = 'processing';

    /** @var string The record is for a request which has completed, and has a captured response. */
    public const STATE_COMPLETE = 'complete';

    /**
     * @var int Defense-in-depth limit on retained completed records per user, independent of the
     *          24-hour response retention TTL.
     */
    public const MAX_COMPLETE_RECORDS_PER_USER = 200;

    /** @var string The database table used to store Idempotency Key records. */
    protected const TABLE = 'api_idempotency_keys';

    /**
     * Constructor for the Idempotency Key Repository.
     *
     * @param \moodle_database $db The database connection.
     * @param \core\clock $clock The clock used for every timestamp this class writes.
     */
    public function __construct(
        protected readonly \moodle_database $db,
        protected readonly \core\clock $clock,
    ) {
    }

    /**
     * Find an existing record for the given key hash, if one exists.
     *
     * @param string $keyhash
     * @return \stdClass|null
     */
    public function find_by_keyhash(string $keyhash): ?\stdClass {
        return $this->db->get_record(self::TABLE, ['keyhash' => $keyhash]) ?: null;
    }

    /**
     * Attempt to claim a key hash for a new, in-flight, request.
     *
     * This relies on the `keyhash` unique key to safely handle the race between two concurrent
     * requests which both use the same Idempotency-Key: only one insert can succeed.
     *
     * @param string $keyhash
     * @param string $requesthash
     * @param int $userid
     * @param int $ttlseconds How long to retain the 'processing' record if it is never completed
     *                        (e.g. because the server crashed mid-request).
     * @return \stdClass|null The newly-created record, or null if another request has already
     *                        claimed this key hash (the caller should re-fetch with
     *                        {@see self::find_by_keyhash()}).
     */
    public function begin_processing(
        string $keyhash,
        string $requesthash,
        int $userid,
        int $ttlseconds,
    ): ?\stdClass {
        $now = $this->clock->time();

        $record = (object) [
            'userid' => $userid,
            'keyhash' => $keyhash,
            'requesthash' => $requesthash,
            'state' => self::STATE_PROCESSING,
            'timecreated' => $now,
            'timemodified' => $now,
            'timetoexpire' => $now + $ttlseconds,
        ];

        try {
            $record->id = $this->db->insert_record(self::TABLE, $record);
        } catch (\dml_write_exception $e) {
            // Most likely cause: a concurrent request already inserted a row for this keyhash and
            // tripped the unique key. Let the caller re-fetch and handle the existing record.
            return null;
        }

        return $record;
    }

    /**
     * Store the captured response against a record, marking it as complete.
     *
     * @param int $id
     * @param int $statuscode
     * @param array $headers PSR-7 style headers, as returned by ResponseInterface::getHeaders().
     * @param string $body
     * @param int $ttlseconds How long to retain the captured response for.
     */
    public function mark_complete(
        int $id,
        int $statuscode,
        array $headers,
        string $body,
        int $ttlseconds,
    ): void {
        $now = $this->clock->time();

        $payload = json_encode([
            'headers' => $headers,
            'body' => $body,
        ]);

        $this->db->update_record(self::TABLE, (object) [
            'id' => $id,
            'state' => self::STATE_COMPLETE,
            'statuscode' => $statuscode,
            'response' => encryption::encrypt($payload),
            'timemodified' => $now,
            'timetoexpire' => $now + $ttlseconds,
        ]);
    }

    /**
     * Decrypt and decode the captured response stored against a completed record.
     *
     * @param \stdClass $record A record as returned by {@see self::find_by_keyhash()}, with
     *                          state {@see self::STATE_COMPLETE}.
     * @return array{status: int, headers: array, body: string}
     */
    public function decode_response(\stdClass $record): array {
        $payload = json_decode(encryption::decrypt($record->response), true);

        return [
            'status' => (int) $record->statuscode,
            'headers' => $payload['headers'],
            'body' => $payload['body'],
        ];
    }

    /**
     * Delete a record, e.g. because the request it was tracking failed and should be retryable.
     *
     * @param int $id
     */
    public function delete(int $id): void {
        $this->db->delete_records(self::TABLE, ['id' => $id]);
    }

    /**
     * Delete all records which have passed their expiry time.
     *
     * @param int|null $before Timestamp to purge records expiring before. Defaults to now.
     * @return int The number of records deleted.
     */
    public function delete_expired(?int $before = null): int {
        $before ??= $this->clock->time();

        $count = $this->db->count_records_select(self::TABLE, 'timetoexpire < :before', ['before' => $before]);
        $this->db->delete_records_select(self::TABLE, 'timetoexpire < :before', ['before' => $before]);

        return $count;
    }

    /**
     * Delete oldest completed records for users who exceed the per-user retention quota.
     *
     * Processing records are intentionally ignored: they are short-lived, self-heal via their
     * own TTL, and deleting one while a request is still in-flight could orphan a later
     * {@see self::mark_complete()} call.
     *
     * @param int|null $maxperuser Maximum number of completed records to retain per user.
     *                             Defaults to {@see self::MAX_COMPLETE_RECORDS_PER_USER}.
     * @return int The number of records deleted.
     */
    public function enforce_user_quotas(?int $maxperuser = null): int {
        $maxperuser ??= self::MAX_COMPLETE_RECORDS_PER_USER;

        $offendingusers = $this->db->get_records_sql(
            "SELECT userid, COUNT(*) AS recordcount
               FROM {" . self::TABLE . "}
              WHERE state = :state
           GROUP BY userid
             HAVING COUNT(*) > :maxperuser",
            [
                'state' => self::STATE_COMPLETE,
                'maxperuser' => $maxperuser,
            ],
        );

        $deletedcount = 0;
        foreach ($offendingusers as $offendinguser) {
            $completerecords = $this->db->get_records(
                self::TABLE,
                [
                    'userid' => $offendinguser->userid,
                    'state' => self::STATE_COMPLETE,
                ],
                'timecreated ASC',
                'id',
            );
            $idstodelete = array_slice(array_keys($completerecords), 0, count($completerecords) - $maxperuser);

            if ($idstodelete === []) {
                continue;
            }

            $this->db->delete_records_list(self::TABLE, 'id', $idstodelete);
            $deletedcount += count($idstodelete);
        }

        return $deletedcount;
    }
}
