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

namespace core;

use Attribute;

/**
 * Attribute to describe a deprecated item.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[Attribute]
class deprecated {
    /**
     * A deprecated item.
     *
     * @param mixed $descriptor A brief descriptor of the thing that was deprecated.
     * @param null|string $since When it was deprecated
     * @param null|string $reason Why it was deprecated
     * @param null|string $replacement Any replacement for the deprecated thing
     * @param null|string $mdl Link to the Moodle Tracker issue for more information
     */
    public function __construct(
        public readonly mixed $descriptor,
        public readonly ?string $since = null,
        public readonly ?string $reason = null,
        public readonly ?string $replacement = null,
        public readonly ?string $mdl = null,
        public readonly bool $final = false,
        public readonly bool $emit = true,
    ) {
    }

    /**
     * Get a string describing the deprecation.
     *
     * @return string
     */
    public function get_deprecation_string(): string {
        $output = "Deprecation: {$this->descriptor} has been deprecated";
        if ($this->since) {
            $output .= " since {$this->since}";
        }

        $output .= ".";

        if ($this->reason) {
            $output .= " {$this->reason}.";
        }

        if ($this->replacement) {
            $output .= " Use {$this->replacement} instead.";
        }

        if ($this->mdl) {
            $output .= " See {$this->mdl} for more information.";
        }

        return $output;
    }

    /**
     * Emit the relevant deprecation notice.
     */
    public function emit_deprecation_notice(): void {
        if (!$this->emit) {
            return;
        }
        if ($this->final) {
            throw new \coding_exception(
                $this->get_deprecation_string(),
            );
        }

        debugging(
            $this->get_deprecation_string(),
            DEBUG_DEVELOPER,
        );
    }
}
