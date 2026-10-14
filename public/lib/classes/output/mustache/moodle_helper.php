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


namespace core\output\mustache;

use Mustache\LambdaHelper;

/**
 * Base class for Moodle's Mustache lambda helpers.
 *
 * @package    core
 * @category   output
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class moodle_helper {
    /**
     * Render the given text only if it contains Mustache tags; plain text is returned unchanged.
     *
     * This avoids a lambda template lookup for text which does not need rendering.
     *
     * @param string $text
     * @param LambdaHelper $helper
     * @return string
     */
    protected function render_if_tagged(string $text, LambdaHelper $helper): string {
        if (!str_contains($text, '{{')) {
            return $text;
        }
        return (string) $helper->render($text);
    }
}
