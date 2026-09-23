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

declare(strict_types=1);

namespace core_reportbuilder\local\report;

use core\output\action_menu\link as action_menu_link;
use core\output\actions\popup_action;
use core\output\pix_icon;
use core\url;
use lang_string;
use stdClass;

/**
 * A generic action implementation.
 *
 * @package     core_reportbuilder
 * @copyright   2021 Paul Holden <paulh@moodle.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class row_action {
    /** @var pix_icon $icon */
    protected $icon;

    /** @var array $attributes */
    protected $attributes;

    /** @var bool $popup */
    protected $popup;

    /** @var callable[] $callbacks */
    protected $callbacks = [];

    /** @var lang_string|string $title */
    protected $title;

    /**
     * Create an instance of an action to be added to a report.
     *
     * @param pix_icon $icon
     * @param string[] $attributes Array of attributes to include in action, each will be cast to string prior to use
     * @param bool $popup
     * @param ?lang_string $title
     */
    public function __construct(
        pix_icon $icon,
        array $attributes = [],
        bool $popup = false,
        ?lang_string $title = null
    ) {
        $this->icon = $icon;
        $this->attributes = $attributes;
        $this->popup = $popup;
        // If title is not passed, check the title attribute from the icon.
        $this->title = $title ?? $icon->attributes['title'] ?? '';
    }

    /**
     * Get the action URL for this action type.
     *
     * @param stdClass $row The data row for which to generate the action URL.
     */
    abstract protected function get_action_url(stdClass $row): url;

    /**
     * Adds callback to the action. Used to verify action is available to current user, or preprocess values used in placeholders
     *
     * Multiple callbacks can be added. If at least one returns false then the action will not be displayed
     *
     * @param callable $callback
     * @return self
     */
    public function add_callback(callable $callback): self {
        $this->callbacks[] = $callback;
        return $this;
    }

    /**
     * Return action menu link suitable for output, or null if the action cannot be displayed (because one of its callbacks
     * returned false, {@see add_callback})
     *
     * @param stdClass $row
     * @return action_menu_link|null
     */
    public function get_action_link(stdClass $row): ?action_menu_link {
        foreach ($this->callbacks as $callback) {
            $row = clone $row; // Clone so we don't modify the shared row inside a callback.
            if (!$callback($row)) {
                return null;
            }
        }

        $url = $this->get_action_url($row);

        // Ensure we have a title attribute set, if one wasn't already provided.
        if (!array_key_exists('title', $this->attributes)) {
            $this->attributes['title'] = (string) $this->title;
        }
        $this->attributes['aria-label'] = $this->attributes['title'];

        if ($this->popup) {
            $this->attributes['data-action'] = 'report-action-popup';
            $this->attributes['data-popup-action'] = json_encode(new popup_action('click', $url));
        }

        // Interpolate any placeholders with correct values.
        $attributes = self::replace_placeholders($this->attributes, $row);

        // Ensure title attribute isn't duplicated.
        $title = $attributes['title'];
        unset($attributes['title']);

        return new action_menu_link($url, $this->icon, $title, null, $attributes);
    }

    /**
     * Given an array of values, replace all placeholders with corresponding property of the given row
     *
     * @param string[] $values
     * @param stdClass $row
     * @return array
     */
    protected static function replace_placeholders(array $values, stdClass $row): array {
        return array_map(static function ($value) use ($row) {
            return preg_replace_callback('/^:(?<property>.*)$/', static function (array $matches) use ($row): string {
                return (string) ($row->{$matches['property']} ?? '');
            }, (string) $value);
        }, $values);
    }
}
