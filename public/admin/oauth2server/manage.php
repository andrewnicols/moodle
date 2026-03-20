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
 * Admin page for managing a single OAuth2 server client (secrets and redirect URIs).
 *
 * @package    core
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once(__DIR__ . '/../../config.php');
require_once($CFG->libdir . '/adminlib.php');

use core\oauth2\server\client_entity;
use core\oauth2\server\client_manager;
use core\oauth2\server\form\redirect_uri as redirect_uri_form;

admin_externalpage_setup('oauth2server');

$clientidentifier = required_param('clientidentifier', PARAM_ALPHANUMEXT);
$action = optional_param('action', '', PARAM_ALPHAEXT);

$client = client_manager::get_client_by_identifier($clientidentifier);
if (!$client) {
    throw new moodle_exception('invalidrecord');
}

$manageurl = new moodle_url('/admin/oauth2server/manage.php', ['clientidentifier' => $clientidentifier]);
$clientsurl = new moodle_url('/admin/oauth2server/clients.php');

// Set the navbar to show the clients list page as the active parent.
$PAGE->navbar->override_active_url($clientsurl);

switch ($action) {
    case 'generatesecret':
        require_sesskey();

        $activecount = client_manager::count_active_secrets($clientidentifier);
        if ($activecount >= client_manager::MAX_ACTIVE_SECRETS) {
            redirect(
                $manageurl,
                get_string('oauth2server:secretmaxreached', 'moodle', client_manager::MAX_ACTIVE_SECRETS),
                null,
                \core\output\notification::NOTIFY_ERROR,
            );
        }

        $secret = client_manager::generate_secret($clientidentifier);

        // Display the secret one time.
        echo $OUTPUT->header();
        echo $OUTPUT->heading(get_string('oauth2server:secretgenerated', 'moodle'));
        echo $OUTPUT->notification(
            get_string('oauth2server:secretgeneratedinfo', 'moodle'),
            \core\output\notification::NOTIFY_WARNING,
        );

        echo html_writer::start_div('oauth2server-secret-display card p-4 mb-3');

        echo html_writer::tag('label', get_string('oauth2server:clientidentifier', 'moodle'), [
            'class' => 'font-weight-bold d-block',
        ]);
        echo html_writer::tag('code', s($clientidentifier), ['class' => 'd-block mb-3']);

        echo html_writer::tag('label', get_string('oauth2server:secretvalue', 'moodle'), [
            'class' => 'font-weight-bold d-block',
        ]);
        echo html_writer::tag('input', '', [
            'type' => 'text',
            'readonly' => 'readonly',
            'value' => $secret,
            'class' => 'form-control-plaintext border p-2 mb-2',
            'id' => 'oauth2-secret-value',
            'style' => 'font-family: monospace; font-size: 1rem;',
        ]);

        echo html_writer::tag('button', get_string('copytoclipboard', 'core'), [
            'class' => 'btn btn-secondary mb-3',
            'onclick' => "navigator.clipboard.writeText(document.getElementById('oauth2-secret-value').value);",
        ]);

        echo html_writer::end_div();

        // Acknowledgment form: "I have copied the secret".
        echo html_writer::start_tag('form', ['method' => 'get', 'action' => $manageurl->out_omit_querystring()]);
        echo html_writer::input_hidden_params($manageurl);
        echo $OUTPUT->single_button(
            $manageurl,
            get_string('oauth2server:secretcopied', 'moodle'),
        );
        echo html_writer::end_tag('form');

        echo $OUTPUT->footer();
        exit;

    case 'revokesecret':
        require_sesskey();
        $secretid = required_param('secretid', PARAM_INT);

        if (!optional_param('confirm', false, PARAM_BOOL)) {
            echo $OUTPUT->header();
            echo $OUTPUT->confirm(
                get_string('oauth2server:revokesecretconfirm', 'moodle'),
                new moodle_url($manageurl, [
                    'action' => 'revokesecret',
                    'secretid' => $secretid,
                    'confirm' => 1,
                    'sesskey' => sesskey(),
                ]),
                $manageurl,
            );
            echo $OUTPUT->footer();
            exit;
        }

        client_manager::revoke_secret($secretid);
        redirect($manageurl, get_string('changessaved'), null, \core\output\notification::NOTIFY_SUCCESS);
        break;

    case 'adduri':
        // Handled by the form below in the default view.
        break;

    case 'removeuri':
        require_sesskey();
        $uriid = required_param('uriid', PARAM_INT);

        if (!optional_param('confirm', false, PARAM_BOOL)) {
            global $DB;
            $urirecord = $DB->get_record('oauth2_server_client_redirect_uris', ['id' => $uriid], '*', MUST_EXIST);

            echo $OUTPUT->header();
            echo $OUTPUT->confirm(
                get_string('oauth2server:removeredirecturiconfirm', 'moodle', s($urirecord->uri)),
                new moodle_url($manageurl, [
                    'action' => 'removeuri',
                    'uriid' => $uriid,
                    'confirm' => 1,
                    'sesskey' => sesskey(),
                ]),
                $manageurl,
            );
            echo $OUTPUT->footer();
            exit;
        }

        client_manager::remove_redirect_uri($uriid);
        redirect($manageurl, get_string('changessaved'), null, \core\output\notification::NOTIFY_SUCCESS);
}

// Default view: show client details, secrets, and redirect URIs.

// Handle the redirect URI add form.
$uriform = new redirect_uri_form($manageurl);
$uriform->set_data(['clientidentifier' => $clientidentifier]);

if ($uriform->is_cancelled()) {
    redirect($manageurl);
}

if ($uridata = $uriform->get_data()) {
    require_sesskey();
    client_manager::add_redirect_uri($clientidentifier, $uridata->uri);
    redirect($manageurl, get_string('changessaved'), null, \core\output\notification::NOTIFY_SUCCESS);
}

echo $OUTPUT->header();

// Client info heading.
$status = ((int) $client->status === client_entity::STATUS_ACTIVE)
    ? get_string('oauth2server:clientstatusactive', 'moodle')
    : get_string('oauth2server:clientstatusrevoked', 'moodle');

echo $OUTPUT->heading(s($client->name));
if (!empty($client->description)) {
    echo html_writer::tag('p', s($client->description), ['class' => 'text-muted']);
}
echo html_writer::tag(
    'p',
    html_writer::tag('strong', get_string('oauth2server:clientidentifier', 'moodle') . ': ') .
    html_writer::tag('code', s($clientidentifier)),
);
echo html_writer::tag(
    'p',
    html_writer::tag('strong', get_string('oauth2server:clientstatus', 'moodle') . ': ') .
    $status,
);

// Secrets section.
echo $OUTPUT->heading(get_string('oauth2server:secrets', 'moodle'), 3);

$secrets = client_manager::get_secrets($clientidentifier);

if (!empty($secrets)) {
    $table = new html_table();
    $table->head = [
        'ID',
        get_string('oauth2server:timecreated', 'moodle'),
        get_string('oauth2server:clientstatus', 'moodle'),
        get_string('oauth2server:lastaccessed', 'moodle'),
        get_string('oauth2server:actions', 'moodle'),
    ];
    $table->attributes['class'] = 'admintable generaltable table-hover';

    foreach ($secrets as $secret) {
        $secretstatus = ((int) $secret->status === client_entity::STATUS_ACTIVE)
            ? get_string('oauth2server:clientstatusactive', 'moodle')
            : get_string('oauth2server:clientstatusrevoked', 'moodle');

        $lastaccessed = $secret->lastaccessed ? userdate($secret->lastaccessed) : '-';

        $secretactions = [];
        if ((int) $secret->status === client_entity::STATUS_ACTIVE) {
            $revokeurl = new moodle_url($manageurl, [
                'action' => 'revokesecret',
                'secretid' => $secret->id,
                'sesskey' => sesskey(),
            ]);
            $secretactions[] = html_writer::link($revokeurl, get_string('oauth2server:revokesecret', 'moodle'));
        }

        $table->data[] = [
            $secret->id,
            userdate($secret->timecreated),
            $secretstatus,
            $lastaccessed,
            implode(' | ', $secretactions),
        ];
    }

    echo html_writer::table($table);
}

$activecount = client_manager::count_active_secrets($clientidentifier);
if ($activecount < client_manager::MAX_ACTIVE_SECRETS) {
    $generateurl = new moodle_url($manageurl, [
        'action' => 'generatesecret',
        'sesskey' => sesskey(),
    ]);
    echo $OUTPUT->single_button($generateurl, get_string('oauth2server:generatesecret', 'moodle'));
} else {
    echo $OUTPUT->notification(
        get_string('oauth2server:secretmaxreached', 'moodle', client_manager::MAX_ACTIVE_SECRETS),
        \core\output\notification::NOTIFY_INFO,
    );
}

// Redirect URIs section.
echo $OUTPUT->heading(get_string('oauth2server:redirecturis', 'moodle'), 3);

$uris = client_manager::get_redirect_uris($clientidentifier);

if (!empty($uris)) {
    $uritable = new html_table();
    $uritable->head = [
        'URI',
        get_string('oauth2server:actions', 'moodle'),
    ];
    $uritable->attributes['class'] = 'admintable generaltable table-hover';

    foreach ($uris as $uri) {
        $removeurl = new moodle_url($manageurl, [
            'action' => 'removeuri',
            'uriid' => $uri->id,
            'sesskey' => sesskey(),
        ]);

        $uritable->data[] = [
            s($uri->uri),
            html_writer::link($removeurl, get_string('oauth2server:removeredirecturi', 'moodle')),
        ];
    }

    echo html_writer::table($uritable);
}

// Add redirect URI form.
echo $OUTPUT->heading(get_string('oauth2server:addredirecturi', 'moodle'), 4);
$uriform->display();

echo $OUTPUT->footer();
