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

namespace core\task;

use core\api\repository\idempotency_key_repository;

/**
 * Scheduled task to purge expired REST API Idempotency Key records and enforce per-user quotas.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class api_idempotency_key_cleanup_task extends scheduled_task {
    /**
     * Constructor for the API Idempotency Key cleanup task.
     *
     * @param idempotency_key_repository $repository The repository used to purge expired records
     *                                               and enforce per-user quotas.
     */
    public function __construct(
        protected readonly idempotency_key_repository $repository,
    ) {
    }

    #[\Override]
    public function get_name(): string {
        return get_string('taskapiidempotencykeycleanup', 'admin');
    }

    #[\Override]
    public function execute(): void {
        $deleted = $this->repository->delete_expired();
        $quotaevicted = $this->repository->enforce_user_quotas();

        mtrace("Deleted {$deleted} expired API Idempotency Key record(s).");
        mtrace("Deleted {$quotaevicted} API Idempotency Key record(s) exceeding the per-user quota.");
    }
}
