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

namespace core_sms;

use DI\Attribute\Inject;
use Generator;
use ReflectionException;

/**
 * Class manager
 *
 * @package    core_sms
 * @copyright  2024 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class manager {
    /** @var \moodle_database $db */
    #[Inject(
        name: 'moodle_database'
    )]
    protected \moodle_database $db;

    /**
     * Send an SMS to the given recipient.
     *
     * @param string $recipient The phone number to send the SMS to
     * @param string $content The SMS Content
     * @param string $component The owning component
     * @param string $messagetype The message type within the component
     * @param null|int $recipientuserid The user id of the recipient if one exists
     * @param bool $sensitive Whether this SMS contains sensitive information
     * @param bool $async Whether this SMS should be sent asynchronously. Note: Sensitive messages cannot be sent async
     * @return message
     * @throws \coding_exception If a sensitive message is sent asynchronously
     */
    public function send(
        string $recipient,
        string $content,
        string $component,
        string $messagetype,
        ?int $recipientuserid,
        bool $sensitive = false,
        bool $async = true,
    ): message {
        $message = new message(
            recipient: $recipient,
            content: $content,
            component: $component,
            messagetype: $messagetype,
            recipientuserid: $recipientuserid,
            sensitive: $sensitive,
        );

        if ($sensitive && $async) {
            throw new \coding_exception('Sensitive messages cannot be sent asynchronously');
        }

        if ($gateway = $this->get_gateway_for_message($message)) {
            $message = $message->with(gateway: $gateway->id);
            $message = $gateway->send(
                message: $message,
                async: $async,
            );
        } else {
            $message = $message->with(status: message_status::GATEWAY_NOT_AVAILABLE);
        }

        return $this->save_message($message);
    }

    /**
     * Get the gateways that can send the given message.
     *
     * @param message $message
     * @return gateway[]
     */
    public function get_possible_gateways_for_message(
        message $message,
    ): array {
        $gateways = [];
        foreach ($this->get_enabled_gateway_instances() as $gateway) {
            if ($gateway->get_send_priority($message)) {
                $gateways[] = $gateway;
            }
        }

        return $gateways;
    }

    /**
     * Get the gateway that can send the given message.
     *
     * @param message $message
     * @return null|gateway
     */
    public function get_gateway_for_message(
        message $message,
    ): ?gateway {
        $gateways = $this->get_possible_gateways_for_message($message);
        if (!count($gateways)) {
            return null;
        }

        // Sort the gateways by their send priority for this message.
        usort($gateways, fn($a, $b) => $a->get_send_priority($message) <=> $b->get_send_priority($message));

        return array_pop($gateways);
    }

    /**
     * Get a list of all gateway instances.
     *
     * @param null|array $filter The database filter to apply
     * @return array
     */
    public function get_gateway_instances(?array $filter = null): array {
        return array_filter(
            array_map(
                function ($record): ?gateway {
                    if (!class_exists($record->gateway)) {
                        // TODO Decide whether to throw an exception? Debugging?
                        return null;
                    }

                    return new $record->gateway(
                        id: $record->id,
                        enabled: $record->enabled,
                        config: $record->config,
                    );
                },
                $this->db->get_records(
                    table: 'sms_gateways',
                    conditions: $filter,
                ),
            )
        );
    }

    /**
     * Get a list of all enabled gateway instances.
     *
     * @return array
     */
    public function get_enabled_gateway_instances(): array {
        return $this->get_gateway_instances(['enabled' => 1]);
    }

    /**
     * Save the message to the database.
     *
     * @param message $message
     * @return message
     */
    public function save_message(
        message $message,
    ): message {
        if ($message->sensitive) {
            // Sensitive messages should not store content.
            $message = $message->with(content: null);
        }
        if ($message->id) {
            $this->db->update_record('sms_messages', $message->to_record());
            return $message;
        }
        $id = $this->db->insert_record('sms_messages', $message->to_record());

        return $message->with(id: $id);
    }

    /**
     * Enable a gateway.
     *
     * @param gateway $gateway
     * @return gateway
     */
    public function enable_gateway(gateway $gateway): gateway {
        $gateway = $gateway->with(enabled: true);
        $this->db->update_record('sms_gateways', $gateway->to_record());

        return $gateway;
    }

    /**
     * Disable a gateway.
     *
     * @param gateway $gateway
     * @return gateway
     */
    public function disable_gateway(gateway $gateway): gateway {
        $gateway = $gateway->with(enabled: false);
        $this->db->update_record('sms_gateways', $gateway->to_record());

        return $gateway;
    }

    /**
     * Create a new gateway instance.
     *
     * @param string $classname
     * @param \stdClass $config
     * @return gateway
     */
    public function create_gateway_instance(
        string $classname,
        bool $enabled = false,
        ?\stdClass $config = null,
    ): gateway {
        $gateway = new $classname(
            enabled: $enabled,
            config: $config ? json_encode($config) : '',
        );

        $id = $this->db->insert_record('sms_gateways', $gateway->to_record());

        return $gateway->with(id: $id);
    }

    /**
     * Get all messages.
     *
     * @param string $sort
     * @param null|array $filter
     * @param int $pagesize
     * @param int $page
     * @return Generator
     */
    public function get_messages(
        string $sort = 'timecreated ASC',
        ?array $filter = null,
        int $pagesize = 0,
        int $page = 0,
    ): Generator {
        $rows = $this->db->get_records(
            table: 'sms_messages',
            conditions: $filter,
            limitfrom: $pagesize * $page,
            limitnum: $pagesize,
            sort: $sort,
        );

        foreach ($rows as $record) {
            yield new message(
                id: $record->id,
                recipient: $record->recipient,
                content: $record->content,
                component: $record->component,
                messagetype: $record->messagetype,
                recipientuserid: $record->recipientuserid,
                sensitive: $record->sensitive,
                status: message_status::from($record->status),
                gateway: $record->gateway,
            );
        }
    }

    /**
     * Get a message
     *
     * @param array $filter
     * @return message
     */
    public function get_message(
        array $filter,
    ): message {
        $record = $this->db->get_record(
            table: 'sms_messages',
            conditions: $filter,
        );

        return new message(
            id: $record->id,
            recipient: $record->recipient,
            content: $record->content,
            component: $record->component,
            messagetype: $record->messagetype,
            recipientuserid: $record->recipientuserid,
            sensitive: $record->sensitive,
            status: message_status::from($record->status),
            gateway: $record->gateway,
        );
    }
}
