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

namespace core\test;

use stdClass;

/**
 * Mailpit message handling implementation.
 *
 * @package    core
 * @category   test
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class mailpit_message implements message {
    protected bool $hydrated = false;

    /**
     * Create a message from an api response.
     *
     * @param \stdClass $message The api response.
     * @return mailpit_message
     */
    public static function create_from_api_response(
        email_catcher $client,
        \stdClass $message,
    ): self {
        return new self(
            client: $client,
            id: $message->ID,
            sender: $message->From,
            subject: $message->Subject,
            recipients: $message->To,
            cc: $message->Cc,
            attachmentcount: $message->Attachments,
        );
    }

    protected function __construct(
        protected email_catcher $client,
        protected string $id,
        protected stdClass $sender,
        protected string $subject,
        protected array $recipients,
        protected array $cc = [],
        protected array $bcc = [],
        protected int $attachmentcount = 0,
        protected ?string $text = null,
        protected ?string $html = null,
        protected array $attachments = [],
        protected array $inline = [],
    ) {
    }

    protected function hydrate(): void {
        if (!$this->hydrated) {
            $message = $this->client->get_message_data($this->id);
            $this->text = $message->Text;
            $this->html = $message->HTML;
            $this->attachments = $message->Attachments;
            $this->inline = $message->Inline;
            $this->hydrated = true;
        }
    }

    /**
     * Get the text representation of the body, if one was provided.
     *
     * @return null|string
     */
    public function get_body_text(): ?string {
        $this->hydrate();
        return $this->text;
    }

    /**
     * Get the HTML representation of the body, if one was provided.
     *
     * @return null|string
     */
    public function get_body_html(): ?string {
        $this->hydrate();
        return $this->html;
    }

    /**
     * Get the number of attachments.
     *
     * @return int
     */
    public function get_attachment_count(): int {
        return $this->attachmentcount;
    }

    /**
     * Get the message attachments.
     *
     * @return array
     */
    public function get_attachments(): array {
        $this->hydrate();
        return array_merge(
            $this->attachments,
            $this->inline,
        );
    }

    /**
     * Get the message recipients.
     *
     * @return array
     */
    public function get_recipients(): iterable {
        foreach ($this->recipients as $user) {
            yield mailpit_message_user::from_recipient($user);
        }
    }

    /**
     * Whether the message has the specified recipient.
     *
     * @param string $email The email address.
     * @return bool
     */
    public function has_recipient(string $email): bool {
        foreach ($this->get_recipients() as $recipient) {
            if ($recipient->get_address() === $email) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get the message cc recipients.
     *
     * @return array
     */
    public function get_cc(): iterable {
        foreach ($this->cc as $user) {
            yield mailpit_message_user::from_recipient($user);
        }
    }

    /**
     * Get the message bcc recipients.
     *
     * @return array
     */
    public function get_bcc(): iterable {
        foreach ($this->bcc as $user) {
            yield mailpit_message_user::from_recipient($user);
        }
    }

    /**
     * Get the message subject.
     *
     * @return string
     */
    public function get_subject(): string {
        return $this->subject;
    }

    /**
     * Get the message sender.
     *
     * @return string
     */
    public function get_sender(): message_user {
        return mailpit_message_user::from_sender($this->sender);
    }
}
