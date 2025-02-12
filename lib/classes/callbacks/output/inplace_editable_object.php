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

namespace core\callbacks\output;

use core\callbacks\abstract_callback_object;
use core\callbacks\must_exist_interface;
use core\callbacks\replaces_legacy_callback_interface;
use core\exception\coding_exception;

/**
 * The callback data for an execution of an inplace editable form field.
 *
 * This callback is called when an inplace editable form field is submitted.
 *
 * The new value is passed in, and the callback should update the item implementation with the new value.
 * The callback should return a renderable inplace editable object to replace the current value with in the interface.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class inplace_editable_object extends abstract_callback_object implements
    must_exist_interface,
    replaces_legacy_callback_interface
{
    /** @var ?\core\output\inplace_editable The inplace editable to be renderered */
    public ?\core\output\inplace_editable $renderable = null;

    /**
     * The constructor an inplace editable callback.
     *
     * @param string $itemtype The item type.
     * @param string $itemid The item id.
     * @param string $newvalue The new value.
     */
    public function __construct(
        /** @var string The item type of the editable */
        public readonly string $itemtype,
        /** @var int|string The item id of the editable */
        public readonly int|string $itemid,
        /** @var string The new value to apply */
        public readonly string $newvalue,
    ) {
    }

    /**
     * Set the inplace editable to be rendered.
     *
     * @param ?\core\output\inplace_editable $renderable
     */
    public function set_renderable(?\core\output\inplace_editable $renderable): void {
        $this->renderable = $renderable;
    }

    /**
     * Get the inplace editable to be rendered.
     *
     * If the inplace editable has not been set, this will throw a coding exception.
     *
     * @return \core\output\inplace_editable
     * @throws coding_exception
     */
    public function get_renderable(): \core\output\inplace_editable {
        if ($this->renderable === null) {
            throw new coding_exception('The inplace editable has not been set.');
        }

        return $this->renderable;
    }

    #[\Override]
    public function get_implementing_interface_names(): array {
        return [inplace_editable_interface::class];
    }

    #[\Override]

    public function call_legacy_callback(string $component): bool {
        $renderable = component_callback(
            $component,
            'inplace_editable',
            [
                $this->itemtype,
                $this->itemid,
                $this->newvalue,
            ],
        );

        if (!$renderable || !($renderable instanceof \core\output\inplace_editable)) {
            return false;
        }
        $this->set_renderable($renderable);

        return true;
    }
}
