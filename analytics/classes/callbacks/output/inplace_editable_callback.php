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

namespace core_analytics\callbacks\output;

use core\callbacks\output\inplace_editable_interface;
use core\callbacks\output\inplace_editable_object;
use core_external\external_api;

/**
 * Inplace editable callback implementation.
 *
 * @package    core_analytics
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class inplace_editable_callback implements
    inplace_editable_interface
{
    #[\Override]
    public function execute_inplace_editable(inplace_editable_object $callback): void {
        $value = match ($callback->itemtype) {
            'modelname' => $this->inplace_editable_modelname($callback),
            default => null,
        };

        $callback->set_renderable($value);
    }

    /**
     * Inplace editable callback for model name.
     *
     * @param inplace_editable_object $callback
     * @return \core\output\inplace_editable
     */
    private function inplace_editable_modelname(inplace_editable_object $callback): \core\output\inplace_editable {
        $context = \core\context\system::instance();
        external_api::validate_context($context);
        require_capability('moodle/analytics:managemodels', $context);

        $model = new \core_analytics\model($callback->itemid);
        $model->rename(clean_param($callback->newvalue, PARAM_NOTAGS));

        return $model->inplace_editable_name();
    }
}
