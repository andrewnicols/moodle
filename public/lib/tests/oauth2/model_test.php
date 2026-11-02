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

namespace core\oauth2;

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;

/**
 * Differential tests of the OAuth2 models against their existing persistents.
 *
 * @package    core
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(endpoint_model::class)]
#[CoversClass(issuer_model::class)]
#[CoversClass(issuer_model_manager::class)]
final class model_test extends \advanced_testcase {
    /**
     * Compare validation errors as well as acceptance of the same URL.
     *
     * @param string $url URL to validate.
     */
    #[DataProvider('endpoint_url_provider')]
    public function test_endpoint_validation_parity(string $url): void {
        $record = (object) ['issuerid' => 1, 'name' => 'authorization_endpoint', 'url' => $url];
        $legacy = (new endpoint())->from_record($record);
        $model = (new endpoint_model())->from_record($record);
        $this->assertEquals($legacy->validate(), $model->validate());
    }

    /**
     * Endpoint URL cases, including URLs accepted by PARAM_URL but not the domain rule.
     *
     * @return array Test cases.
     */
    public static function endpoint_url_provider(): array {
        return [
            'https' => ['https://example.invalid/authorize'],
            'http' => ['http://example.invalid/authorize'],
            'ftp' => ['ftp://example.invalid/authorize'],
            'uppercase scheme' => ['HTTPS://example.invalid/authorize'],
            'empty' => [''],
            'malformed' => ['not a URL'],
        ];
    }

    /**
     * Setters must not introduce normalisation absent from the legacy implementation.
     */
    public function test_name_assignment_parity(): void {
        foreach ([[endpoint::class, endpoint_model::class], [issuer::class, issuer_model::class]] as [$old, $new]) {
            $legacy = new $old();
            $model = new $new();
            $legacy->set('name', ' spaced name ');
            $model->set('name', ' spaced name ');
            $this->assertSame($legacy->to_record()->name, $model->to_record()->name);
            $this->assertSame($legacy->get('name'), $model->get('name'));
        }
    }

    /**
     * Match all default getter values and domain validation rules.
     *
     * @param array $values Values overriding defaults.
     */
    #[DataProvider('issuer_values_provider')]
    public function test_issuer_validation_parity(array $values): void {
        $record = (object) ($values + ['id' => 1, 'name' => 'Example issuer']);
        $legacy = (new issuer())->from_record($record);
        $model = (new issuer_model())->from_record($record);
        $this->assertEquals($legacy->validate(), $model->validate());
        $this->assertEquals($legacy->to_record(), $model->to_record());
        foreach (array_keys(issuer::properties_definition()) as $property) {
            $this->assertSame($legacy->get($property), $model->get($property), $property);
        }
    }

    /**
     * Issuer inputs covering nullable/default fields and URL/email validation.
     *
     * @return array Test cases.
     */
    public static function issuer_values_provider(): array {
        return [
            'defaults' => [[]],
            'https' => [['baseurl' => 'https://example.invalid/']],
            'http' => [['baseurl' => 'http://example.invalid/']],
            'malformed URL' => [['baseurl' => 'not a URL']],
            'nullable fields' => [['image' => null, 'servicetype' => null, 'systememail' => null]],
            'email' => [['systememail' => 'oauth@example.invalid']],
            'bad email' => [['systememail' => 'not an email']],
            'false flags' => [['enabled' => false, 'basicauth' => false, 'requireconfirmation' => false]],
            'trimmed credentials' => [['clientid' => ' client ', 'clientsecret' => ' example ']],
            'null sort order' => [['sortorder' => null]],
        ];
    }

    /**
     * Both managers reject HTTP endpoints before any database write.
     */
    public function test_invalid_endpoint_is_never_saved(): void {
        global $DB;
        $this->resetAfterTest();
        $model = (new endpoint_model())->from_record((object) [
            'issuerid' => 1,
            'name' => 'authorization_endpoint',
            'url' => 'http://example.invalid/',
        ]);
        $before = $DB->count_records('oauth2_endpoint');
        try {
            (new \core\model\manager($DB))->save($model, 1);
            $this->fail('An insecure endpoint was saved.');
        } catch (\invalid_parameter_exception $e) {
            $this->assertStringContainsString('url', $e->getMessage());
        }
        $this->assertSame($before, $DB->count_records('oauth2_endpoint'));
    }

    /**
     * The issuer manager preserves new-record sort ordering, audit fields and CRUD.
     */
    public function test_issuer_lifecycle_parity(): void {
        global $DB, $USER;
        $this->resetAfterTest();
        $this->setAdminUser();
        $manager = new issuer_model_manager($DB);
        $record = (object) ['name' => 'Example', 'image' => '', 'sortorder' => 999];
        $legacy = (new issuer())->from_record($record);
        $model = (new issuer_model())->from_record($record);
        $this->assertEquals($legacy->validate(), $manager->validate($model));
        $this->assertEquals($legacy->to_record(), $model->to_record());

        $count = $DB->count_records('oauth2_issuer');
        $legacy->create();
        $this->assertSame($count, $legacy->get('sortorder'));
        $manager->save($model, (int) $USER->id);
        $this->assertSame($count + 1, $model->get('sortorder'));
        $this->assertSame((int) $USER->id, $model->get('usermodified'));
        $loaded = $manager->get(issuer_model::class, $model->get('id'));
        $old = new issuer($model->get('id'));
        $this->assertEquals($old->to_record(), $loaded->to_record());
        $loaded->sortorder = 17;
        $loaded->name = 'Updated';
        $created = $loaded->get('timecreated');
        $manager->save($loaded, (int) $USER->id);
        $old->read();
        $this->assertEquals($old->to_record(), $loaded->to_record());
        $this->assertSame($created, $loaded->get('timecreated'));
        $this->assertSame(17, $loaded->sortorder);
        $this->assertTrue($manager->delete($loaded));
        $this->assertSame(0, $loaded->get('id'));
        $this->assertFalse($DB->record_exists('oauth2_issuer', ['id' => $old->get('id')]));
    }

    /**
     * Compare configuration, allowed domains, display name and system email helpers.
     */
    public function test_issuer_local_helpers_parity(): void {
        $this->resetAfterTest();
        foreach (
            [
            ['name' => 'Example'],
            ['name' => 'Example', 'clientid' => ' client ', 'clientsecret' => ' example '],
            ['name' => 'Example', 'clientid' => ' ', 'clientsecret' => ' '],
            ['name' => 'Example', 'alloweddomains' => 'example.invalid,*.example.org'],
            ['name' => 'Example', 'loginpagename' => 'Login name', 'systememail' => 'oauth@example.invalid'],
            ['name' => 'Example', 'loginpagename' => '', 'systememail' => ''],
            ] as $values
        ) {
            $legacy = (new issuer())->from_record((object) $values);
            $model = (new issuer_model())->from_record((object) $values);
            $this->assertSame($legacy->is_configured(), $model->is_configured());
            $this->assertSame($legacy->get_display_name(), $model->get_display_name());
            $this->assertSame($legacy->get_system_email(), $model->get_system_email());
            foreach (['user@example.invalid', 'user@sub.example.org', 'user@elsewhere.invalid', 'missingdomain'] as $email) {
                $this->assertSame($legacy->is_valid_login_domain($email), $model->is_valid_login_domain($email));
            }
        }
    }

    /**
     * Query helpers preserve endpoint lookup and every login visibility mode.
     */
    public function test_issuer_query_helpers_parity(): void {
        global $DB;
        $this->resetAfterTest();
        $legacy = (new issuer())->set('name', 'Example')->set('image', '')
            ->set('clientid', 'example')->set('clientsecret', 'example');
        $legacy->create();
        $manager = new issuer_model_manager($DB);
        $model = $manager->get(issuer_model::class, $legacy->get('id'));
        $this->assertSame($legacy->get_endpoint_url('userinfo'), $manager->get_endpoint_url($model, 'userinfo'));
        (new endpoint())->set('issuerid', $legacy->get('id'))
            ->set('name', 'userinfo_endpoint')->set('url', 'https://example.invalid/userinfo')->create();
        $this->assertSame($legacy->get_endpoint_url('userinfo'), $manager->get_endpoint_url($model, 'userinfo'));
        foreach ([issuer::SERVICEONLY, issuer::EVERYWHERE, issuer::LOGINONLY, issuer::SMTPWITHXOAUTH2] as $mode) {
            foreach ([true, false] as $enabled) {
                $legacy->set('showonloginpage', $mode)->set('enabled', $enabled);
                $model->showonloginpage = $mode;
                $model->enabled = $enabled;
                $this->assertSame($legacy->is_available_for_login(), $manager->is_available_for_login($model));
            }
        }
        $expected = $legacy->is_authentication_supported();
        $this->assertDebuggingCalled();
        $actual = $manager->is_authentication_supported($model);
        $this->assertDebuggingCalled();
        $this->assertSame($expected, $actual);
    }

    /**
     * Compare missing accounts, missing refresh tokens and scope membership.
     */
    public function test_issuer_system_account_parity(): void {
        global $DB;
        $this->resetAfterTest();
        $legacy = (new issuer())->set('name', 'Example')->set('image', '')
            ->set('clientid', 'example')->set('clientsecret', 'example');
        $legacy->create();
        $model = (new issuer_model())->from_record($legacy->to_record());
        $manager = new issuer_model_manager($DB);
        $this->assertSame($legacy->is_system_account_connected(), $manager->is_system_account_connected($model));
        $account = (new system_account())->set('issuerid', $legacy->get('id'))->set('refreshtoken', '')
            ->set('grantedscopes', '')->set('email', 'oauth@example.invalid')->set('username', 'example');
        $account->create();
        $this->assertSame($legacy->is_system_account_connected(), $manager->is_system_account_connected($model));
        $account->set('refreshtoken', 'example-test-token')->update();
        $this->assertSame($legacy->is_system_account_connected(), $manager->is_system_account_connected($model));
        $account->set('grantedscopes', api::get_system_scopes_for_issuer($legacy))->update();
        $this->assertTrue($legacy->is_system_account_connected());
        $this->assertTrue($manager->is_system_account_connected($model));
        $legacy->set('clientid', '');
        $model->clientid = '';
        $this->assertSame($legacy->is_system_account_connected(), $manager->is_system_account_connected($model));
    }
}
