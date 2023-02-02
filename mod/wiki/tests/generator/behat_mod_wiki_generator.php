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
 * Behat data generator for mod_wiki.
 *
 * @package   mod_wiki
 * @category  test
 * @copyright 2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class behat_mod_wiki_generator extends behat_generator_base {

    protected function get_creatable_entities(): array {
        return [
            'pages' => [
                'singular' => 'page',
                'datagenerator' => 'page_for_behat',
                'required' => ['wiki', 'author'],
                'switchids' => [
                    'wiki' => 'wikiid',
                    'author' => 'userid',
                ],
            ],
        ];
    }

    /**
     * Look up the id of a wiki from its name.
     *
     * @param string $wikiname the book name, for example 'Test wiki'.
     * @return int corresponding id.
     */
    protected function get_wiki_id(string $wikiname): int {
        $cm = $this->get_cm_by_activity_name('wiki', $wikiname);

        return $cm->instance;
    }

    /**
     * Look up the id of a user from their username.
     *
     * @param string $user
     * @return int The userid
     */
    protected function get_author_id(string $user): int {
        return $this->get_user_id($user);
    }
}
