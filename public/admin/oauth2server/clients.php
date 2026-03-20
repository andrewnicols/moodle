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

/**
 * Admin page for managing OAuth2 server clients.
 *
 * @package    core
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once(__DIR__ . '/../../config.php');
require_once($CFG->libdir . '/adminlib.php');

use core\oauth2\server\client_entity;
use core\oauth2\server\client_manager;
use core\oauth2\server\client_repository;
use core\oauth2\server\form\client as client_form;

admin_externalpage_setup('oauth2server');

$action = optional_param('action', '', PARAM_ALPHAEXT);
$clientid = optional_param('id', 0, PARAM_INT);
$baseurl = new moodle_url('/admin/oauth2server/clients.php');

switch ($action) {
    case 'create':
    case 'edit':
        $formdata = null;
        if ($action === 'edit') {
            $client = client_manager::get_client_by_id($clientid);
            if (!$client) {
                throw new moodle_exception('invalidrecord');
            }
            $formdata = (object) [
                'id' => $client->id,
                'name' => $client->name,
                'description' => $client->description ?? '',
            ];
        }

        $mform = new client_form($PAGE->url, null);
        if ($formdata) {
            $mform->set_data($formdata);
        }

        if ($mform->is_cancelled()) {
            redirect($baseurl);
        }

        if ($data = $mform->get_data()) {
            if (!empty($data->id)) {
                client_manager::update_client($data->id, $data->name, $data->description ?? '');
                redirect(
                    $baseurl,
                    get_string('changessaved'),
                    null,
                    \core\output\notification::NOTIFY_SUCCESS,
                );
            } else {
                $repo = new client_repository();
                $client = $repo->create_client(
                    \core\context\system::instance(),
                    $data->name,
                    $data->description ?? '',
                    [],
                );
                redirect(
                    new moodle_url('/admin/oauth2server/manage.php', ['clientidentifier' => $client->getIdentifier()]),
                    get_string('changessaved'),
                    null,
                    \core\output\notification::NOTIFY_SUCCESS,
                );
            }
        }

        $heading = ($action === 'edit')
            ? get_string('oauth2server:editclient', 'moodle')
            : get_string('oauth2server:createclient', 'moodle');

        echo $OUTPUT->header();
        echo $OUTPUT->heading($heading);
        $mform->display();
        echo $OUTPUT->footer();
        exit;

    case 'revoke':
        require_sesskey();
        if (!optional_param('confirm', false, PARAM_BOOL)) {
            $client = client_manager::get_client_by_id($clientid);
            if (!$client) {
                throw new moodle_exception('invalidrecord');
            }
            echo $OUTPUT->header();
            echo $OUTPUT->confirm(
                get_string('oauth2server:revokeconfirm', 'moodle', s($client->name)),
                new moodle_url($baseurl, ['action' => 'revoke', 'id' => $clientid, 'confirm' => 1, 'sesskey' => sesskey()]),
                $baseurl,
            );
            echo $OUTPUT->footer();
            exit;
        }
        client_manager::revoke_client($clientid);
        redirect($baseurl, get_string('changessaved'), null, \core\output\notification::NOTIFY_SUCCESS);
        break;

    case 'enable':
        require_sesskey();
        client_manager::enable_client($clientid);
        redirect($baseurl, get_string('changessaved'), null, \core\output\notification::NOTIFY_SUCCESS);
        break;

    case 'delete':
        require_sesskey();
        if (!optional_param('confirm', false, PARAM_BOOL)) {
            $client = client_manager::get_client_by_id($clientid);
            if (!$client) {
                throw new moodle_exception('invalidrecord');
            }
            if ((int) $client->status !== client_entity::STATUS_REVOKED) {
                redirect(
                    $baseurl,
                    get_string('oauth2server:deletenotrevokedfirst', 'moodle'),
                    null,
                    \core\output\notification::NOTIFY_ERROR,
                );
            }
            echo $OUTPUT->header();
            echo $OUTPUT->confirm(
                get_string('oauth2server:deleteconfirm', 'moodle', s($client->name)),
                new moodle_url($baseurl, ['action' => 'delete', 'id' => $clientid, 'confirm' => 1, 'sesskey' => sesskey()]),
                $baseurl,
            );
            echo $OUTPUT->footer();
            exit;
        }
        client_manager::delete_client($clientid);
        redirect($baseurl, get_string('changessaved'), null, \core\output\notification::NOTIFY_SUCCESS);
        break;

    default:
        // List all clients.
        echo $OUTPUT->header();
        echo $OUTPUT->heading(get_string('oauth2server:clients', 'moodle'));

        $clients = client_manager::get_all_clients();

        if (empty($clients)) {
            echo $OUTPUT->notification(get_string('oauth2server:noclients', 'moodle'), \core\output\notification::NOTIFY_INFO);
        } else {
            $table = new html_table();
            $table->head = [
                get_string('oauth2server:clientname', 'moodle'),
                get_string('oauth2server:clientdescription', 'moodle'),
                get_string('oauth2server:clientidentifier', 'moodle'),
                get_string('oauth2server:clientstatus', 'moodle'),
                get_string('oauth2server:timecreated', 'moodle'),
                get_string('oauth2server:lastaccessed', 'moodle'),
                get_string('oauth2server:actions', 'moodle'),
            ];
            $table->attributes['class'] = 'admintable generaltable table-hover';

            foreach ($clients as $client) {
                $status = ((int) $client->status === client_entity::STATUS_ACTIVE)
                    ? get_string('oauth2server:clientstatusactive', 'moodle')
                    : get_string('oauth2server:clientstatusrevoked', 'moodle');

                $timecreated = userdate($client->timecreated);
                $lastaccessed = $client->lastaccessed ? userdate($client->lastaccessed) : '-';

                $actions = [];

                // Manage link.
                $manageurl = new moodle_url('/admin/oauth2server/manage.php', [
                    'clientidentifier' => $client->clientidentifier,
                ]);
                $actions[] = html_writer::link($manageurl, get_string('oauth2server:manage', 'moodle'));

                // Edit link.
                $editurl = new moodle_url($baseurl, ['action' => 'edit', 'id' => $client->id]);
                $actions[] = html_writer::link($editurl, get_string('edit'));

                if ((int) $client->status === client_entity::STATUS_ACTIVE) {
                    // Revoke link.
                    $revokeurl = new moodle_url($baseurl, [
                        'action' => 'revoke',
                        'id' => $client->id,
                        'sesskey' => sesskey(),
                    ]);
                    $actions[] = html_writer::link($revokeurl, get_string('oauth2server:revokeclient', 'moodle'));
                } else {
                    // Enable link.
                    $enableurl = new moodle_url($baseurl, [
                        'action' => 'enable',
                        'id' => $client->id,
                        'sesskey' => sesskey(),
                    ]);
                    $actions[] = html_writer::link($enableurl, get_string('oauth2server:enableclient', 'moodle'));

                    // Delete link (only for revoked clients).
                    $deleteurl = new moodle_url($baseurl, [
                        'action' => 'delete',
                        'id' => $client->id,
                        'sesskey' => sesskey(),
                    ]);
                    $actions[] = html_writer::link($deleteurl, get_string('delete'));
                }

                $table->data[] = [
                    s($client->name),
                    s($client->description ?? ''),
                    html_writer::tag('code', s($client->clientidentifier)),
                    $status,
                    $timecreated,
                    $lastaccessed,
                    implode(' | ', $actions),
                ];
            }

            echo html_writer::table($table);
        }

        // Create new client button.
        $createurl = new moodle_url($baseurl, ['action' => 'create']);
        echo $OUTPUT->single_button($createurl, get_string('oauth2server:createclient', 'moodle'));

        echo $OUTPUT->footer();
        exit;
}
