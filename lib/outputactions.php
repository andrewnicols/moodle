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
 * Classes representing JS event handlers, used by output components.
 *
 * Please see http://docs.moodle.org/en/Developement:How_Moodle_outputs_HTML
 * for an overview.
 *
 * @package core
 * @category output
 * @copyright 2009 Nicolas Connault
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * Helper class used by other components that involve an action on the page (URL or JS).
 *
 * @copyright 2009 Nicolas Connault
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since Moodle 2.0
 * @package core
 * @category output
 */
class component_action implements templatable {
    /**
     * @var string $module The name of the AMD module to load
     */
    protected ?array $module = null;

    /**
     * @var bool $nomodule Whether a module is required at all.
     */
    protected bool $nomodule = false;

    /**
     * @var array The action data attributes to add.
     */
    protected array $actionattributes = [];

    /**
     * @var string $event The DOM event that will trigger this action when caught
     */
    public $event;

    /**
     * @var string A function name to call when the button is clicked
     * The JS function you create must have two arguments:
     *      1. The event object
     *      2. An object/array of arguments ($jsfunctionargs)
     */
    public $jsfunction = false;

    /**
     * @var array An array of arguments to pass to the JS function
     */
    public $jsfunctionargs = [];

    /**
     * Constructor
     * @param string $event DOM event
     * @param string $jsfunction An optional JS function. Required if jsfunctionargs is given
     * @param array $jsfunctionargs An array of arguments to pass to the jsfunction
     */
    public function __construct($event, $jsfunction, $jsfunctionargs = []) {
        if (empty($this->module) && empty($this->nomodule)) {
            // Provide backwards compatability for existing content until 4.6.
            // TODO: Remove this in 4.6.
            debugging(
                'The use of inline action JS is deprecated. Please use an AMD module instead.',
                DEBUG_DEVELOPER
            );

            $this->event = $event;

            $this->jsfunction = $jsfunction;
            $this->jsfunctionargs = $jsfunctionargs;

            if (!empty($this->jsfunctionargs)) {
                if (empty($this->jsfunction)) {
                    throw new coding_exception('The component_action object needs a jsfunction value to pass the jsfunctionargs to.');
                }
            }
        }
    }

    /**
     * Mark this action as not requiring the addition of any other javascript
     */
    protected function set_nomodule(): void {
        $this->nomodule = true;
    }

    /**
     * Set the module required to use this action, with an optional function name.
     *
     * @param string $module The AMD module name
     * @param string|null $function An optional function to call on the module
     */
    protected function set_module(string $module, ?string $function = null): void {
        $this->module = [
            'module' => $module,
            'function' => $function,
        ];
    }

    /**
     * Fetch the action attributes.
     *
     * @return array
     */
    protected function get_action_attributes() {
        return array_map(function($key, $value): array {
            return [
                'key' => $key,
                'value' => $value,
            ];
        }, array_keys($this->actionattributes), $this->actionattributes);
    }

    /**
     * Set an action attribute.
     *
     * @param string $key
     * @param mixed $value
     */
    protected function set_action_attribute(string $key, $value): void {
        $this->actionattributes[$key] = $value;
    }

    /**
     * Export for template.
     *
     * @param renderer_base $output The renderer.
     * @return stdClass
     */
    public function export_for_template(renderer_base $output) {
        if (empty($this->nomodule) && empty($this->module)) {
            // Provide backwards compatability for existing content until 4.6.
            // TODO: Remove this in 4.6.
            $args = !empty($this->jsfunctionargs) ? json_encode($this->jsfunctionargs) : false;
            return (object) [
                'event' => $this->event,
                'jsfunction' => $this->jsfunction,
                'jsfunctionargs' => $args,
            ];
        }

        return (object) [
            'nomodule' => $this->nomodule,
            'module' => $this->module,
            'actiondata' => $this->get_action_attributes(),
        ];
    }
}


/**
 * Confirm action
 *
 * @copyright 2009 Nicolas Connault
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since Moodle 2.0
 * @package core
 * @category output
 */
class confirm_action extends component_action {

    /**
     * Constructs the confirm action object
     *
     * @param string $message The message to display to the user when they are shown the confirm dialogue
     * @param string $callback Deprecated since 2.7
     * @param string $continuelabel The string to use for he continue button
     * @param string $cancellabel Deprecated since 4.2
     */
    public function __construct($message, $callback = null, $continuelabel = null, $cancellabel = null) {
        $this->set_action_attribute('modal', 'confirmation');
        $this->set_action_attribute('modal-content', $message);
        if ($continuelabel) {
            $this->set_action_attribute('modal-yes-button', $continuelabel);
        }

        $this->set_module('core/utility');

        if ($callback !== null) {
            debugging(
                'The callback argument to new confirm_action() has been deprecated.',
                DEBUG_DEVELOPER
            );
        }

        if ($cancellabel !== null) {
            debugging(
                'The cancellabel argument to new confirm_action() has been deprecated.' .
                DEBUG_DEVELOPER
            );
        }

        parent::__construct('', '');
    }
}


/**
 * Component action for a popup window.
 *
 * @copyright 2009 Nicolas Connault
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since Moodle 2.0
 * @package core
 * @category output
 */
class popup_action extends component_action {
    /**
     * @var array An array of parameters that will be passed to the window.open JS function.
     */
    public $params = [
        'height' =>  600,
        'width' => 800,
        'top' => 0,
        'left' => 0,
        'fullscreen' => false,
        'noreferrer' => false,
        'noopener' => false,
    ];

    /**
     * Constructor
     *
     * @param string $event DOM event
     * @param moodle_url|string $url A moodle_url object, required if no jsfunction is given
     * @param string $name The JS function to call for the popup (default 'popup')
     * @param array $params An array of popup parameters supported by window.open
     * @see {https://developer.mozilla.org/en-US/docs/Web/API/Window/open#windowfeatures}
     */
    public function __construct($event, $url, $name = 'popup', $params = []) {
        if ($name) {
            if (preg_match("/\s/", $name)) {
                throw new coding_exception(
                    'The $name of a popup window shouldn\'t contain spaces - string modified.'
                );
            }
        }

        $this->set_module('core/utility');
        $this->set_action_attribute('popup-name', json_encode($name));
        $this->set_action_attribute('popup-url', json_encode(
            (new moodle_url($url))->out(false),
            JSON_UNESCAPED_SLASHES
        ));

        foreach ($this->params as $var => $val) {
            if (array_key_exists($var, $params)) {
                $this->params[$var] = $params[$var];
            }
        }

        parent::__construct('', '');
    }

    /**
     * Export for template.
     *
     * @param renderer_base $output The renderer.
     * @return stdClass
     */
    public function export_for_template(renderer_base $output) {
        $this->set_action_attribute('popup', 'popup');
        $this->set_action_attribute('popup-fullscreen', json_encode(!empty($this->params['fullscreen'])));
        unset($this->params['fullscreen']);

        $this->set_action_attribute('popup-options', json_encode($this->params));
        return parent::export_for_template($output);
    }

    /**
     * Returns a string of concatenated option->value pairs used by JS to call the popup window,
     * based on this object's variables
     *
     * @return string String of option->value pairs for JS popup function.
     */
    public function get_js_options() {
        $jsoptions = '';

        foreach ($this->params as $var => $val) {
            if (is_string($val) || is_int($val)) {
                $jsoptions .= "$var=$val,";
            } elseif (is_bool($val)) {
                $jsoptions .= ($val) ? "$var," : "$var=0,";
            }
        }

        $jsoptions = substr($jsoptions, 0, strlen($jsoptions) - 1);

        return $jsoptions;
    }
}
