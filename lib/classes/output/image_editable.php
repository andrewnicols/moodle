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
 * Contains class \core\output\image_editable
 *
 * @package    core
 * @category   output
 * @copyright  2020 Bas Brands
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace core\output;

use templatable;
use renderable;
use lang_string;

/**
 * Class allowing to quick edit an image
 *
 * This class is used for editing an image. To display call:
 * echo $OUTPUT->render($element);
 * or
 * echo $OUTPUT->render_from_template('core/image_editable', $element->export_for_template($OUTPUT));
 *
 *
 * @package    core
 * @category   output
 * @copyright  2020 Bas Brands
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class image_editable implements templatable, renderable {

    /**
     * @var string current image displayed as background image.
     */
    protected $currentimage;

    /**
     * @var string defaultimage image used when no user defined image is available.
     */
    protected $defaultimage;

    /**
     * @var string component the component linked to this image.
     */
    protected $component;

    /**
     * @var string filearea the filearea this image should be stored in.
     */
    protected $filearea;

    /**
     * @var string contextid the contextid to associate with the component.
     */
    protected $contextid;

    /**
     * @var bool rounded true if this image should be rounded.
     */
    protected $rounded;

    /**
     * @var int size the width and height of the image editor.
     */
    protected $size;

    /**
     * @var int draftitemid the draftitemid used when the image is rendered as a form field.
     */
    protected $draftitemid;

    /**
     * @var array formelement the additional form fiels for this element.
     */
    protected $formelements;

    /**
     * Constructor
     *
     * Prints the image with edit controls
     *
     */
    public function __construct($data) {
        $this->currentimage = $data->currentimage;
        $this->defaultimage = $data->defaultimage;
        $this->component = $data->component;
        $this->filearea = $data->filearea;
        $this->contextid = $data->contextid;
        $this->rounded = $data->rounded;
        $this->size = $data->size;
        $this->draftitemid = $data->draftitemid;
        $this->formelements = $data->formelements;
    }

    /**
     * Export this data so it can be used as the context for a mustache template (core/image_editable).
     *
     * @param renderer_base $output typically, the renderer that's calling this function
     * @return array data context for a mustache template
     */
    public function export_for_template(\renderer_base $output) {
        global $USER;

        // prevent caching of the image.
        $currentimage = false;
        if ($this->currentimage) {
            $currentimage = new \moodle_url($this->currentimage, ['ref' => time()]);
        }
        if (!$this->contextid) {
            $this->contextid = (\context_user::instance($USER->id))->id;
        }

        return [
            'currentimage' => $this->currentimage,
            'defaultimage' => $this->defaultimage,
            'component' => $this->component,
            'filearea' => $this->filearea,
            'contextid' => $this->contextid,
            'rounded' => $this->rounded,
            'size' => $this->size,
            'maxbytes' => get_max_upload_file_size(),
            'draftitemid' => $this->draftitemid,
            'formelements' => $this->formelements
        ];
    }

    /**
     * Renders this element
     *
     * @param renderer_base $output typically, the renderer that's calling this function
     * @return string
     */
    public function render(\renderer_base $output) {
        return $output->render_from_template('core/image_editable', $this->export_for_template($output));
    }
}
