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
 * Author class.
 *
 * @package    mod_forum
 * @copyright  2019 Ryan Wyllie <ryan@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace mod_forum\local\entities;

use stdClass;

/**
 * Author class.
 *
 * @copyright  2019 Ryan Wyllie <ryan@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class author {
    /** @var int $id ID */
    private $id;
    /** @var int $pictureitemid Picture item id */
    private $pictureitemid;
    /** @var string $firstname First name */
    private $firstname;
    /** @var string $lastname Last name */
    private $lastname;
    /** @var string $email Email */
    private $email;
    /** @var bool $deleted Deleted */
    private $deleted;
    /** @var string $middlename Middle name */
    private $middlename;
    /** @var string $firstnamephonetic Phonetic spelling of first name */
    private $firstnamephonetic;
    /** @var string $lastnamephonetic Phonetic spelling of last name */
    private $lastnamephonetic;
    /** @var string $alternatename Altername name */
    private $alternatename;
    /** @var string $imagealt Image alt */
    private $imagealt;

    /**
     * Constructor.
     *
     * @param int $id ID
     * @param int $pictureitemid Picture item id
     * @param string $firstname First name
     * @param string $lastname Last name
     * @param string $email Email
     * @param string|null $middlename Middle name
     * @param string|null $firstnamephonetic Phonetic spelling of first name
     * @param string|null $lastnamephonetic Phonetic spelling of last name
     * @param string|null $alternatename Altername name
     * @param string|null $imagealt Image alt
     */
    public function __construct(
        int $id,
        int $pictureitemid,
        string $firstname,
        string $lastname,
        string $email,
        bool $deleted,
        string $middlename = null,
        string $firstnamephonetic = null,
        string $lastnamephonetic = null,
        string $alternatename = null,
        string $imagealt = null
    ) {
        $this->id = $id;
        $this->pictureitemid = $pictureitemid;
        $this->firstname = $firstname;
        $this->lastname = $lastname;
        $this->email = $email;
        $this->deleted = $deleted;
        $this->middlename = $middlename;
        $this->firstnamephonetic = $firstnamephonetic;
        $this->lastnamephonetic = $lastnamephonetic;
        $this->alternatename = $alternatename;
        $this->imagealt = $imagealt;
    }

    /**
     * Return the id.
     *
     * @return int
     */
    public function get_id() : int {
        return $this->id;
    }

    /**
     * Return the picture item id.
     *
     * @return int
     */
    public function get_picture_item_id() : int {
        return $this->pictureitemid;
    }

    /**
     * Return the first name.
     *
     * @return string
     */
    public function get_first_name() : string {
        return $this->firstname;
    }

    /**
     * Return the last name.
     *
     * @return string
     */
    public function get_last_name() : string {
        return $this->lastname;
    }

    /**
     * Return the full name.
     *
     * @return string
     */
    public function get_full_name(forum $forum) : string {
        return \core_user::displayname($this->to_object(), $forum->get_context());
    }

    /**
     * Return the email.
     *
     * @return string
     */
    public function get_email() : string {
        return $this->email;
    }

    /**
     * Is the author deleted?
     *
     * @return bool
     */
    public function is_deleted() : bool {
        return !empty($this->deleted);
    }

    /**
     * Return the middle name.
     *
     * @return string|null
     */
    public function get_middle_name() : ?string {
        return $this->middlename;
    }

    /**
     * Return the first name phonetic.
     *
     * @return string|null
     */
    public function get_first_name_phonetic() : ?string {
        return $this->firstnamephonetic;
    }

    /**
     * Return the last name phonetic.
     *
     * @return string|null
     */
    public function get_last_name_phonetic() : ?string {
        return $this->lastnamephonetic;
    }

    /**
     * Return the alternate name.
     *
     * @return string|null
     */
    public function get_alternate_name() : ?string {
        return $this->alternatename;
    }

    /**
     * Return the image alt.
     *
     * @return string|null
     */
    public function get_image_alt() : ?string {
        return $this->imagealt;
    }

    protected function to_object(): stdClass {
        return (object) [
            'id' => $this->get_id(),
            'firstname' => $this->get_first_name(),
            'lastname' => $this->get_last_name(),
            'email' => $this->get_email(),
            'deleted' => $this->is_deleted(),
            'middlename' => $this->get_middle_name(),
            'firstnamephonetic' => $this->get_first_name_phonetic(),
            'lastnamephonetic' => $this->get_last_name_phonetic(),
            'alternatename' => $this->get_alternate_name(),
        ];
    }
}
