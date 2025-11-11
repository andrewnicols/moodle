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

namespace core\api;

/**
 * API Token Entity used to represent a Scoped API token.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class api_token_entity {
    public const STATUS_REVOKED = 0;
    public const STATUS_ACTIVE = 1;

    protected int $id;
    protected int $status;
    protected int $expiry = null;
    protected string $name;
    protected string $description;
    protected string $scopes;

    private function __construct() {
    }

    public static function from_record(
        \stdClass $tokenrecord,
    ): self {
        $token = new self();
        $token->id = $tokenrecord->id;
        $token->name = $tokenrecord->name;
        $token->description = $tokenrecord->description;
        $token->scopes = $tokenrecord->scopes;
        $token->status = $tokenrecord->status;
        $token->expiry = $tokenrecord->expiry;

        return $token;
    }

    public function is_active(): bool {
        if ($this->status !== self::STATUS_ACTIVE) {
            return false;
        }

        if ($this->expiry && $this->expiry < time()) {
            return false;
        }

        return true;
    }

    public function is_revoked(): bool {
        return $this->status === self::STATUS_REVOKED;
    }

    public function revoke(): void {
        global $DB;

        $this->status = self::STATUS_REVOKED;

        $DB->set_field('rest_api_tokens', 'status', $this->status, ['id' => $this->id]);
    }
}
