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

namespace core\navigation\output;

use core\output\renderable;
use core\output\renderer_base;
use core\output\templatable;

/**
 * more menu navigation renderable
 *
 * @package     core
 * @category    navigation
 * @copyright   2021 onwards Adrian Greeve
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class more_menu implements renderable, templatable {
    /**
     * Constructor for this class.
     *
     * @param object $content Navigation objects.
     * @param string $navbarstyle class name.
     * @param bool $haschildren The content has children.
     * @param bool $istablist When true, the more menu should be rendered and behave with a tablist ARIA role.
     *                        If false, it's rendered with a menubar ARIA role. Defaults to false.
     */
    public function __construct(
        /** @var object Navigation objects */
        protected object $content,
        /** @var string Class name to apply to the navbar */
        protected string $navbarstyle,
        /** @var bool Whether the content has any child */
        protected bool $haschildren = true,
        /** @var bool Whether the content should be rendered as an ARIA tablist (true) or menubar (false) */
        protected bool $istablist = false,
    ) {
    }

    #[\Override]
    public function export_for_template(renderer_base $output): array {
        $data = [
            'navbarstyle' => $this->navbarstyle,
            'istablist' => $this->istablist,
        ];
        if ($this->haschildren) {
            // The node collection doesn't have anything to render so exit now.
            if (!isset($this->content->children) || count($this->content->children) == 0) {
                return [];
            }
            // Find all nodes that have children and are defined to show the children in a submenu.
            // For each of these nodes we would like to display a dropdown menu and in order to achieve that
            // (as required by the template) we need to set the node's property 'moremenuid' to a new unique value and
            // 'haschildren' to true.
            foreach ($this->content->children as &$item) {
                if (
                    $item->showchildreninsubmenu && isset($this->content->children) &&
                        count($this->content->children) > 0
                ) {
                    $item->moremenuid = uniqid();
                    $item->haschildren = true;
                }
            }

            $data['nodecollection'] = $this->content;
        } else {
            $data['nodearray'] = (array) $this->content;
        }
        $data['moremenuid'] = uniqid();

        return $data;
    }
}
