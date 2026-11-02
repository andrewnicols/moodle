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

use core\exception\coding_exception;
use core\model;
use core\model\manager;

/**
 * Issuer lifecycle and database-dependent operations outside model instances.
 *
 * @package    core
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class issuer_model_manager extends manager {
    /**
     * Match issuer::before_validate(), including explicit null on existing records.
     *
     * @param model $model Issuer to prepare.
     */
    protected function prepare_validation(model $model): void {
        if (!$model instanceof issuer_model) {
            throw new coding_exception('The issuer manager requires an issuer model.');
        }
        if (!$model->get('id') || $model->get('sortorder') === null) {
            $model->sortorder = $this->db->count_records('oauth2_issuer');
        }
    }

    /**
     * Find a named endpoint.
     *
     * @param issuer_model $issuer Issuer model.
     * @param string $type Endpoint type without the _endpoint suffix.
     * @return string|false Cleaned URL, or false if absent.
     */
    public function get_endpoint_url(issuer_model $issuer, string $type): string|false {
        $record = $this->db->get_record('oauth2_endpoint', [
            'issuerid' => $issuer->get('id'),
            'name' => $type . '_endpoint',
        ]);
        return $record ? (new endpoint_model())->from_record($record)->get('url') : false;
    }

    /**
     * Whether the issuer can be used to log in.
     *
     * @param issuer_model $issuer Issuer model.
     * @return bool Login availability.
     */
    public function is_available_for_login(issuer_model $issuer): bool {
        return $issuer->get('id') && $issuer->is_configured()
            && $issuer->get('showonloginpage') != issuer::SERVICEONLY
            && $issuer->get('showonloginpage') != issuer::SMTPWITHXOAUTH2
            && $issuer->get('enabled') && !empty($this->get_endpoint_url($issuer, 'userinfo'));
    }

    /**
     * Retain the deprecated authentication-support query for legacy callers.
     *
     * @param issuer_model $issuer Issuer model.
     * @return bool Authentication support.
     */
    public function is_authentication_supported(issuer_model $issuer): bool {
        debugging('Method is_authentication_supported() is deprecated, please use is_available_for_login()', DEBUG_DEVELOPER);
        return !empty($this->get_endpoint_url($issuer, 'userinfo'));
    }

    /**
     * Whether a system account has a refresh token and all required scopes.
     *
     * @param issuer_model $issuer Issuer model.
     * @return bool Connection status.
     */
    public function is_system_account_connected(issuer_model $issuer): bool {
        if (!$issuer->is_configured()) {
            return false;
        }
        $record = $this->db->get_record('oauth2_system_account', ['issuerid' => $issuer->get('id')]);
        if (!$record) {
            return false;
        }
        $account = (new system_account())->from_record($record);
        if (empty($account->get('refreshtoken'))) {
            return false;
        }
        // Plugin scope callbacks may type-hint the legacy issuer class.
        $legacy = (new issuer())->from_record($issuer->to_record());
        $scopes = explode(' ', api::get_system_scopes_for_issuer($legacy));
        $granted = ' ' . $account->get('grantedscopes') . ' ';
        foreach ($scopes as $scope) {
            if ($scope !== '' && !str_contains($granted, ' ' . $scope . ' ')) {
                return false;
            }
        }
        return true;
    }
}
