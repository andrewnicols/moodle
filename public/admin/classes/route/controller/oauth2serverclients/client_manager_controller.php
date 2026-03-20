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

namespace core_admin\route\controller\oauth2serverclients;

use core\router\schema\parameters\path_parameter;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use core\oauth2\server\client_entity;
use core\oauth2\server\client_manager;
use core\oauth2\server\form\client as client_form;
use core\output\html_writer;
use core_table\output\html_table;


/**
 * Class client_manager_controller
 *
 * @package    core_admin
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\core\router\route(
    title: 'OAuth2 Client Management',
    path: '/oauth2server/clients',
)]
class client_manager_controller {
    /**
     * Constructor for the client manager controller.
     *
     * @param \core\oauth2\server\client_repository $repository The client repository used to manage OAuth2 clients
     */
    public function __construct(
        /** @var \core\oauth2\server\client_repository The client repository used to manage OAuth2 clients */
        private \core\oauth2\server\client_repository $repository,
    ) {
    }

    /**
     * List the OAuth2 clients.
     *
     * @param ResponseInterface $response The response object
     * @return ResponseInterface The response object with the rendered client list
     */
    #[\core\router\route(
        path: '',
    )]
    public function list_clients(
        ResponseInterface $response,
    ): ResponseInterface {
        global $PAGE, $OUTPUT;

        $this->setup_admin_page();

        $response->getBody()->write($OUTPUT->header());
        $response->getBody()->write($OUTPUT->heading($PAGE->title));

        $clients = client_manager::get_all_clients();
        if (empty($clients)) {
            $response->getBody()->write($OUTPUT->notification(
                get_string('oauth2server:noclients', 'moodle'),
                \core\output\notification::NOTIFY_INFO,
            ));
        } else {
            $response->getBody()->write(html_writer::table($this->get_client_table($clients)));
        }

        $createurl = \core\router\util::get_path_for_callable([self::class, 'create_client_form']);
        $response->getBody()->write($OUTPUT->single_button($createurl, get_string('oauth2server:createclient', 'moodle'), 'get'));

        $response->getBody()->write($OUTPUT->footer());

        return $response;
    }

    #[\core\router\route(
        path: '/create',
        method: ['GET', 'POST'],
    )]
    public function create_client_form(
        ServerRequestInterface $request,
        ResponseInterface $response,
    ): ResponseInterface {
        $this->setup_admin_page();
        return $this->create_or_edit_client(
            $request,
            $response,
            \core\router\util::get_path_for_callable([self::class, __FUNCTION__]),
            null,
        );
    }

    #[\core\router\route(
        path: '/{client}/edit',
        method: ['GET', 'POST'],
        pathtypes: [
            new \core_admin\route\parameters\oauth2\server\path_client(),
        ],
    )]
    public function edit_client_form(
        ServerRequestInterface $request,
        ResponseInterface $response,
        \stdClass $clientobject,
    ): ResponseInterface {
        $this->setup_admin_page();
        return $this->create_or_edit_client(
            $request,
            $response,
            \core\router\util::get_path_for_callable([self::class, __FUNCTION__], ['client' => $clientobject->id]),
            $clientobject,
        );
    }

    /**
     * Revoke a client.
     *
     * @param ServerRequestInterface $request The request object
     * @param ResponseInterface $response The response object
     * @param \stdClass $clientobject The client object to revoke
     * @return ResponseInterface The response object with the result of the revoke action
     */
    #[\core\router\route(
        path: '/{client}/revoke',
        pathtypes: [
            new \core_admin\route\parameters\oauth2\server\path_client(),
        ],
        queryparams: [
            new \core\router\schema\parameters\query_parameter(
                name: 'confirm',
                type: \core\param::BOOL,
                description: 'Whether the action has been confirmed by the user',
            ),
        ],
    )]
    public function revoke_client(
        ServerRequestInterface $request,
        ResponseInterface $response,
        \stdClass $clientobject,
        bool $confirm = false,
    ): ResponseInterface {
        global $OUTPUT;
        $this->setup_admin_page();
        require_sesskey();

        if ($confirm) {
            client_manager::revoke_client($clientobject->id);
            return \core\router\util::redirect_to_callable(
                $request,
                $response,
                [self::class, 'list_clients'],
            );
        }
            $confirmurl = \core\router\util::get_path_for_callable([self::class, __FUNCTION__], ['client' => $clientobject->id], ['confirm' => 1]);
            $cancelurl = \core\router\util::get_path_for_callable([self::class, 'list_clients']);
            echo $OUTPUT->confirm(
                get_string('oauth2server:revokeconfirm', 'moodle', s($client->name)),
                new moodle_url($baseurl, ['action' => 'revoke', 'id' => $clientid, 'confirm' => 1, 'sesskey' => sesskey()]),
                $baseurl,
            );

            $response->getBody()->write($this->get_revoke_confirmation_page($clientobject, $confirmurl, $cancelurl));
            return $response;
    }

    private function create_or_edit_client(
        ServerRequestInterface $request,
        ResponseInterface $response,
        \core\url $baseurl,
        ?\stdClass $clientobject = null,
    ): ResponseInterface {
        global $PAGE, $OUTPUT;

        $mform = new client_form($baseurl, null);

        if ($clientobject) {
            $formdata = (object) [
                'id' => $clientobject->id,
                'name' => $clientobject->name,
                'description' => $clientobject->description ?? '',
            ];
            $mform->set_data($formdata);
        }

        if ($mform->is_cancelled()) {
            return \core\router\util::redirect_to_callable(
                $request,
                $response,
                [self::class, 'list_clients'],
            );
        }

        if ($data = $mform->get_data()) {
            if (!empty($data->id)) {
                client_manager::update_client($data->id, $data->name, $data->description ?? '');
            } else {
                $this->repository->create_client(
                    \core\context\system::instance(),
                    $data->name,
                    $data->description ?? '',
                    [],
                );
            }

            \core\notification::info(get_string('changessaved'));
            return \core\router\util::redirect_to_callable(
                $request,
                $response,
                [self::class, 'list_clients'],
            );
        }

        $response->getBody()->write($OUTPUT->header());
        $response->getBody()->write($OUTPUT->heading(get_string('oauth2server:createclient', 'moodle')));
        $response->getBody()->write($mform->render());
        $response->getBody()->write($OUTPUT->footer());

        return $response;
    }

    private function setup_admin_page(): void {
        global $CFG, $PAGE;

        require_once("{$CFG->libdir}/adminlib.php");

        admin_externalpage_setup('oauth2server');
        $PAGE->set_pagelayout('admin');
        $PAGE->set_title(get_string('oauth2server:clients', 'moodle'));
    }

    private function get_client_table(
        array $clients,
    ): html_table {
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
            $manageurl = new \core\url('/admin/oauth2server/manage.php', [
                'clientidentifier' => $client->clientidentifier,
            ]);
            $actions[] = html_writer::link(
                $manageurl,
                get_string('oauth2server:manage', 'moodle'),
            );

            // Edit link.
            // TODO
            $baseurl = new \core\url('/admin/oauth2server/clients', ['action' => 'edit', 'id' => $client->id]);
            $actions[] = html_writer::link(
                \core\router\util::get_path_for_callable([self::class, 'edit_client_form'], ['client' => $client->id]),
                get_string('edit'),
            );

            if ((int) $client->status === client_entity::STATUS_ACTIVE) {
                // Revoke link.
                $revokeurl = new \core\url($baseurl, [
                    'action' => 'revoke',
                    'id' => $client->id,
                    'sesskey' => sesskey(),
                ]);
                $actions[] = html_writer::link($revokeurl, get_string('oauth2server:revokeclient', 'moodle'));
            } else {
                // Enable link.
                $enableurl = new \core\url($baseurl, [
                    'action' => 'enable',
                    'id' => $client->id,
                    'sesskey' => sesskey(),
                ]);
                $actions[] = html_writer::link($enableurl, get_string('oauth2server:enableclient', 'moodle'));

                // Delete link (only for revoked clients).
                $deleteurl = new \core\url($baseurl, [
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

        return $table;
    }
}
