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

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use core\api\entity\api_token_entity;
use core\api\token_manager;

/**
 * Tests for {@see api_token_repository}.
 *
 * @package    core
 * @copyright  2026 Mihail Geshoski <mihailgesoski@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(api_token_repository::class)]
final class api_token_repository_test extends \advanced_testcase {
    /**
     * Test token creation.
     */
    public function test_create_token(): void {
        global $DB;

        $this->resetAfterTest();

        $user = $this->getDataGenerator()->create_user();
        $repository = new api_token_repository();

        $token = $repository->create_token(
            'Token 1',
            'secret',
            $user->id,
            ['scope'],
            'A description',
            1700000000
        );

        $this->assertInstanceOf(api_token_entity::class, $token);

        $record = $DB->get_record('rest_api_tokens', ['id' => $token->get_id()], '*', MUST_EXIST);

        $this->assertEquals('Token 1', $record->name);
        $this->assertEquals($user->id, $record->userid);
        $this->assertEquals('scope', $record->scopes);
        $this->assertEquals('A description', $record->description);
        $this->assertEquals(1700000000, $record->expirytime);
        $this->assertEquals(api_token_entity::REVOKED_NO, $record->revoked);

        // The token stored in the database is a hashed version of the secret combined with a checksum of
        // the scopes and expiry time. The secret + checksum is pre-hashed with SHA-256 before being passed
        // to password_hash(), so that it fits within bcrypt's 72-byte input limit.
        $checksum = implode(' ', ['scope']) . '|' . (1700000000 ?? '');
        $this->assertTrue(password_verify(hash('sha256', 'secret' . $checksum), $record->token));
    }

    /**
     * Scopes are sorted before being stored, and before being folded into the secret checksum, so that the
     * order in which callers supply them cannot change the resulting hash.
     */
    public function test_create_token_sorts_scopes(): void {
        global $DB;

        $this->resetAfterTest();

        $user = $this->getDataGenerator()->create_user();
        $repository = new api_token_repository();

        $token = $repository->create_token(
            'Token 1',
            'secret',
            $user->id,
            ['zeta', 'alpha', 'mid'],
            null,
            1700000000
        );

        $record = $DB->get_record('rest_api_tokens', ['id' => $token->get_id()], '*', MUST_EXIST);

        // The scopes are stored sorted alphabetically, regardless of the order supplied.
        $this->assertEquals('alpha mid zeta', $record->scopes);

        // The checksum embedded in the hash is calculated from the sorted scopes, and the secret + checksum
        // is pre-hashed with SHA-256 before being passed to password_hash().
        $checksum = 'alpha mid zeta' . '|' . 1700000000;
        $this->assertTrue(password_verify(hash('sha256', 'secret' . $checksum), $record->token));
    }

    /**
     * Creating a token with the same secret and scopes, but supplied in a different order, produces the same
     * checksum, so the order the caller passes scopes in does not weaken or otherwise affect validation.
     */
    public function test_create_token_scope_order_does_not_affect_validation(): void {
        $this->resetAfterTest();

        $user = $this->getDataGenerator()->create_user();
        $repository = new api_token_repository();

        $token = $repository->create_token(
            'Token',
            'secret',
            $user->id,
            ['zeta', 'alpha', 'mid'],
        );

        // Validation still succeeds because the checksum is calculated from the sorted scopes, both at
        // creation time and at validation time.
        $validated = $repository->validate_token($token->get_id(), 'secret');
        $this->assertEquals($token->get_id(), $validated->get_id());
    }

    /**
     * If the scopes stored against a token are tampered with directly in the database, the checksum embedded
     * in the hashed secret no longer matches, so the token fails validation. This prevents an attacker with
     * database access from silently escalating the privileges of an existing token.
     */
    public function test_validate_token_fails_if_scopes_tampered(): void {
        global $DB;

        $this->resetAfterTest();

        $user = $this->getDataGenerator()->create_user();
        $repository = new api_token_repository();

        $token = $repository->create_token('Token', 'secret', $user->id, ['scope']);

        // Tamper with the stored scopes, granting an extra scope that was never part of the checksum.
        $DB->set_field('rest_api_tokens', 'scopes', 'scope extrascope', ['id' => $token->get_id()]);

        $this->expectException(\core\exception\invalid_api_token_exception::class);
        $repository->validate_token($token->get_id(), 'secret');
    }

    /**
     * Real secrets are 64 bytes long (see {@see token_manager::SECRET_LENGTH}), which leaves very little
     * headroom under bcrypt's 72-byte input limit for the scopes/expirytime checksum appended to them.
     * Without pre-hashing the secret+checksum (see {@see api_token_repository::prehash_secret()}), bcrypt
     * would silently truncate the checksum, so tampering with scopes/expirytime beyond the first ~8 bytes
     * of the checksum would go undetected. This test uses a realistically-sized secret and enough scopes
     * to overflow the 72-byte limit, confirming that tampering is still detected.
     */
    public function test_validate_token_fails_if_scopes_tampered_with_long_secret_and_scopes(): void {
        global $DB;

        $this->resetAfterTest();

        $user = $this->getDataGenerator()->create_user();
        $repository = new api_token_repository();

        // A realistically-sized secret, as generated by token_manager::SECRET_LENGTH.
        $secret = bin2hex(random_bytes(32));

        // Enough scopes that the secret + checksum comfortably exceeds bcrypt's 72-byte limit.
        $scopes = ['course:view', 'course:update', 'user:view', 'user:update', 'mod:quiz:attempt'];

        $token = $repository->create_token('Token', $secret, $user->id, $scopes);

        // Tamper with a scope character far beyond byte 72 of the secret + checksum, which a naive
        // bcrypt-only hash would silently ignore.
        $tamperedscopes = implode(' ', $scopes) . ' extrascope';
        $DB->set_field('rest_api_tokens', 'scopes', $tamperedscopes, ['id' => $token->get_id()]);

        $this->expectException(\core\exception\invalid_api_token_exception::class);
        $repository->validate_token($token->get_id(), $secret);
    }

    /**
     * If the expiry time stored against a token is tampered with directly in the database, the checksum
     * embedded in the hashed secret no longer matches, so the token fails validation. This prevents an
     * attacker with database access from silently extending the lifetime of an existing token.
     */
    public function test_validate_token_fails_if_expirytime_tampered(): void {
        global $DB;

        $this->resetAfterTest();

        $user = $this->getDataGenerator()->create_user();
        $repository = new api_token_repository();

        $token = $repository->create_token('Token', 'secret', $user->id, ['scope'], null, time() + 3600);

        // Tamper with the stored expiry time, extending the lifetime of the token.
        $DB->set_field('rest_api_tokens', 'expirytime', time() + 999999, ['id' => $token->get_id()]);

        // The token is rejected as invalid (not merely expired), because the checksum mismatch is detected
        // before the expiry is even considered.
        $this->expectException(\core\exception\invalid_api_token_exception::class);
        $repository->validate_token($token->get_id(), 'secret');
    }

    /**
     * A token created with no expiry has a stable checksum representation for the missing expiry, and
     * therefore validates correctly.
     */
    public function test_validate_token_with_no_expiry_succeeds(): void {
        $this->resetAfterTest();

        $user = $this->getDataGenerator()->create_user();
        $repository = new api_token_repository();

        $token = $repository->create_token('Token', 'secret', $user->id, ['scope'], null, null);

        $validated = $repository->validate_token($token->get_id(), 'secret');
        $this->assertEquals($token->get_id(), $validated->get_id());
    }

    /**
     * Test getting a token by ID.
     */
    public function test_get_by_id(): void {
        $this->resetAfterTest();

        $user = $this->getDataGenerator()->create_user();
        $repository = new api_token_repository();

        // Create a new token and obtain its ID.
        $tokenid = $repository->create_token(
            'Test',
            'secret',
            $user->id,
            ['scope']
        )->get_id();

        $token = $repository->get_by_id($tokenid);

        $this->assertEquals($tokenid, $token->get_id());
        $this->assertEquals('Test', $token->get_name());
        $this->assertEquals($user->id, $token->get_userid());
        $this->assertEquals(['scope'], $token->get_scopes());
    }

    /**
     * Test missing record exceptions.
     */
    public function test_get_missing_throws(): void {
        $repository = new api_token_repository();

        $this->expectException(\dml_missing_record_exception::class);
        $repository->get_by_id(999999);
    }

    /**
     * Test token update.
     */
    public function test_update_token(): void {
        $this->resetAfterTest();

        $user = $this->getDataGenerator()->create_user();
        $repository = new api_token_repository();

        $token = $repository->create_token(
            'Original Name',
            'secret',
            $user->id,
            ['scope'],
            'Original Description',
            1700000000
        );

        $updates = [
            'name' => 'Updated Name',
            'token' => 'updatedsecrethash',
            'userid' => 99999,
            'description' => 'Updated Description',
            'scopes' => 'updatedscope',
            'expirytime' => 1800000000,
        ];

        $repository->update_token($token->get_id(), $updates);

        $updatedtoken = $repository->get_by_id($token->get_id());

        // Verify allowed updates successfully persisted.
        $this->assertEquals('Updated Name', $updatedtoken->get_name());
        $this->assertEquals('Updated Description', $updatedtoken->get_description());
        $this->assertEquals(['updatedscope'], $updatedtoken->get_scopes());
        $this->assertEquals(1800000000, $updatedtoken->get_expirytime());
        // Verify that protected fields were NOT modified.
        // The user ID should not have changed.
        $this->assertEquals($user->id, $updatedtoken->get_userid());
        // The token hash should not have changed.
        $this->assertNotEquals('updatedsecrethash', $updatedtoken->get_token());
    }

    /**
     * Test revoking a token.
     */
    public function test_revoke_token(): void {
        $this->resetAfterTest();

        $user = $this->getDataGenerator()->create_user();
        $repository = new api_token_repository();

        $token = $repository->create_token('Test', 'secret', $user->id, ['scope']);
        $this->assertFalse($token->is_revoked());

        $repository->revoke_token($token->get_id());

        $updatedtoken = $repository->get_by_id($token->get_id());
        $this->assertTrue($updatedtoken->is_revoked());
    }

    /**
     * Test deleting a token.
     */
    public function test_delete_token(): void {
        $this->resetAfterTest();

        $user = $this->getDataGenerator()->create_user();
        $repository = new api_token_repository();

        $token = $repository->create_token('Test', 'secret', $user->id, ['scope']);

        $repository->delete_token($token->get_id());

        $this->expectException(\dml_missing_record_exception::class);
        $repository->get_by_id($token->get_id());
    }

    /**
     * Test token validation.
     *
     * @param bool $revoked
     * @param int|null $expirytime
     * @param string $checksecret
     * @param string|null $expectedexception
     */
    #[DataProvider('validate_token_provider')]
    public function test_validate_token(
        bool $revoked,
        ?int $expirytime,
        string $checksecret,
        ?string $expectedexception
    ): void {
        $this->resetAfterTest();

        $user = $this->getDataGenerator()->create_user();
        $repository = new api_token_repository();

        $token = $repository->create_token(
            'Test',
            'correctsecret',
            $user->id,
            ['scope'],
            null,
            $expirytime
        );

        if ($revoked) {
            $repository->revoke_token($token->get_id());
        }

        if ($expectedexception) {
            $this->expectException($expectedexception);
        }

        $validatedtoken = $repository->validate_token($token->get_id(), $checksecret);

        if (!$expectedexception) { // The token should be valid.
            $this->assertEquals($token->get_id(), $validatedtoken->get_id());
        }
    }

    /**
     * Data provider for token validation tests.
     */
    public static function validate_token_provider(): array {
        return [
            'valid token' => [
                false,
                time() + 3600,
                'correctsecret',
                null,
            ],
            'invalid secret' => [
                false,
                time() + 3600,
                'wrongsecret',
                \core\exception\invalid_api_token_exception::class,
            ],
            'expired token' => [
                false,
                time() - 3600,
                'correctsecret',
                \core\exception\expired_api_token_exception::class,
            ],
            'revoked token' => [
                true,
                time() + 3600,
                'correctsecret',
                \core\exception\revoked_api_token_exception::class,
            ],
        ];
    }

    /**
     * Build a token string in the same shape {@see token_manager::issue_token} hands out.
     *
     * @param int $tokenid The token ID.
     * @param string $secret The raw secret.
     * @return string
     */
    private function build_token_string(int $tokenid, string $secret): string {
        return rtrim(
            token_manager::TOKEN_PREFIX . base64_encode("{$tokenid}/{$secret}"),
            '=',
        );
    }

    /**
     * Test that a well-formed, active token resolves back to its entity.
     */
    public function test_get_from_token_valid(): void {
        $this->resetAfterTest();

        $user = $this->getDataGenerator()->create_user();
        $repository = new api_token_repository();

        $token = $repository->create_token('Test', 'correctsecret', $user->id, ['scope']);
        $tokenstring = $this->build_token_string($token->get_id(), 'correctsecret');

        $resolved = $repository->get_from_token($tokenstring);

        $this->assertEquals($token->get_id(), $resolved->get_id());
        $this->assertEquals($user->id, $resolved->get_userid());
    }

    /**
     * A token missing the expected prefix is rejected before it is even decoded.
     */
    public function test_get_from_token_missing_prefix_throws(): void {
        $this->resetAfterTest();

        $repository = new api_token_repository();

        $this->expectException(\core\exception\invalid_api_token_exception::class);
        $repository->get_from_token(base64_encode('1/somesecret'));
    }

    /**
     * A token whose ID does not correspond to any stored record is rejected.
     */
    public function test_get_from_token_missing_record_throws(): void {
        $this->resetAfterTest();

        $repository = new api_token_repository();

        $this->expectException(\dml_missing_record_exception::class);
        $repository->get_from_token($this->build_token_string(999999, 'somesecret'));
    }

    /**
     * A token whose secret does not match the stored hash is rejected.
     */
    public function test_get_from_token_wrong_secret_throws(): void {
        $this->resetAfterTest();

        $user = $this->getDataGenerator()->create_user();
        $repository = new api_token_repository();

        $token = $repository->create_token('Test', 'correctsecret', $user->id, ['scope']);
        $tokenstring = $this->build_token_string($token->get_id(), 'wrongsecret');

        $this->expectException(\core\exception\invalid_api_token_exception::class);
        $repository->get_from_token($tokenstring);
    }

    /**
     * An expired token is rejected even though the secret is correct.
     */
    public function test_get_from_token_expired_throws(): void {
        $this->resetAfterTest();

        $user = $this->getDataGenerator()->create_user();
        $repository = new api_token_repository();

        $token = $repository->create_token('Test', 'correctsecret', $user->id, ['scope'], null, time() - 3600);
        $tokenstring = $this->build_token_string($token->get_id(), 'correctsecret');

        $this->expectException(\core\exception\expired_api_token_exception::class);
        $repository->get_from_token($tokenstring);
    }

    /**
     * A revoked token is rejected even though the secret is correct.
     */
    public function test_get_from_token_revoked_throws(): void {
        $this->resetAfterTest();

        $user = $this->getDataGenerator()->create_user();
        $repository = new api_token_repository();

        $token = $repository->create_token('Test', 'correctsecret', $user->id, ['scope']);
        $repository->revoke_token($token->get_id());
        $tokenstring = $this->build_token_string($token->get_id(), 'correctsecret');

        $this->expectException(\core\exception\revoked_api_token_exception::class);
        $repository->get_from_token($tokenstring);
    }

    /**
     * A token with an invalid format is rejected.
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('invalid_token_strings')]
    public function test_get_from_token_invalid_format_throws(string $token): void {
        $this->resetAfterTest();

        $user = $this->getDataGenerator()->create_user();
        $repository = new api_token_repository();

        $this->expectException(\core\exception\invalid_api_token_exception::class);
        $repository->get_from_token($token);
    }

    /**
     * Data providerfor invalid token format tests.
     *
     * @return array<string, string[]>
     */
    public static function invalid_token_strings(): array {
        return [
            'empty' => [''],
            'not base64 encoded' => ['invalidformat'],
            'does not contain a / in the encoded string' => [base64_encode('invalidstring')],
            'tokenid is not numeric' => [base64_encode('notanumber/secret')],
        ];
    }

    /**
     * Logging access records where the token was used from, not just when.
     */
    public function test_log_token_access_records_the_address(): void {
        global $DB;

        $this->resetAfterTest();

        $user = $this->getDataGenerator()->create_user();
        $repository = new api_token_repository();
        $token = $repository->create_token('Token', 'secret', $user->id, ['scope']);

        $_SERVER['REMOTE_ADDR'] = '203.0.113.42';
        $repository->log_token_access($token->get_id());

        $record = $DB->get_record('rest_api_tokens', ['id' => $token->get_id()], '*', MUST_EXIST);

        $this->assertEquals('203.0.113.42', $record->lastaccessip);
        $this->assertNotEmpty($record->lastaccessed);

        // Written as one partial update, so the fields it does not name must survive untouched.
        $this->assertEquals('Token', $record->name);
        $this->assertEquals('scope', $record->scopes);
        $this->assertEquals($user->id, $record->userid);
        $this->assertNotEmpty($record->token);
    }

    /**
     * Test logging token access.
     */
    public function test_log_token_access(): void {
        $this->resetAfterTest();

        $user = $this->getDataGenerator()->create_user();
        $repository = new api_token_repository();

        $token = $repository->create_token('Test', 'secret', $user->id, ['scope']);
        $this->assertNull($token->get_lastaccessed());

        // Capture the time windows before and after execution.
        $before = time();
        $repository->log_token_access($token->get_id());
        $after = time();

        $updatedtoken = $repository->get_by_id($token->get_id());
        $actual = $updatedtoken->get_lastaccessed();

        $this->assertNotNull($actual);
        $this->assertGreaterThanOrEqual($before, $actual);
        $this->assertLessThanOrEqual($after, $actual);
    }

    /**
     * Test retrieving user tokens.
     *
     * @param string $userkey The user key to retrieve tokens for.
     * @param bool $includeinactive Whether to include inactive tokens.
     * @param array $expectednames The expected token names.
     */
    #[DataProvider('get_user_tokens_provider')]
    public function test_get_user_tokens(string $userkey, bool $includeinactive, array $expectednames): void {
        global $DB;

        $this->resetAfterTest();

        // Create users.
        $users = [
            'user1' => $this->getDataGenerator()->create_user(),
            'user2' => $this->getDataGenerator()->create_user(),
            'user3' => $this->getDataGenerator()->create_user(),
        ];

        $repository = new api_token_repository();

        // Create an active token for user1.
        $repository->create_token('Active Token 1', 'secret', $users['user1']->id, ['scope']);
        // Create revoked token for user 1.
        $token2 = $repository->create_token('Revoked Token', 'secret', $users['user1']->id, ['scope']);
        $repository->revoke_token($token2->get_id());
        // Create an expired token for user1.
        $token3 = $repository->create_token('Expired Token', 'secret', $users['user1']->id, ['scope']);
        $DB->set_field('rest_api_tokens', 'expirytime', time() - 3600, ['id' => $token3->get_id()]);

        // Create an active token for user2.
        $repository->create_token('Active Token 2', 'secret', $users['user2']->id, ['scope']);

        // No tokens for user3.

        $tokens = $repository->get_user_tokens($users[$userkey]->id, $includeinactive);

        $this->assertCount(count($expectednames), $tokens);

        $actualnames = array_map(function ($token) {
            return $token->get_name();
        }, $tokens);

        $this->assertEqualsCanonicalizing($expectednames, $actualnames);
    }

    /**
     * Data provider for get_user_tokens tests.
     */
    public static function get_user_tokens_provider(): array {
        return [
            'user 1, active only' => [
                'user1',
                false,
                [
                    'Active Token 1',
                ],
            ],
            'user 1, include inactive' => [
                'user1',
                true,
                [
                    'Active Token 1',
                    'Revoked Token',
                    'Expired Token',
                ],
            ],
            'user 2, active only' => [
                'user2',
                false,
                [
                    'Active Token 2',
                ],
            ],
            'user 2, include inactive' => [
                'user2',
                true,
                [
                    'Active Token 2',
                ],
            ],
            'user 3, active only' => [
                'user3',
                false,
                [],
            ],
        ];
    }
}
