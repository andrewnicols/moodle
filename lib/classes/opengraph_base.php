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

use stdClass;

/**
 * OpenGraph Image Class.
 *
 * @package    core
 * @copyright  2022 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class opengraph_base {

    /** @var \context The context to return data for */
    protected $context;

    /**
     * Overrided constructor to force QR codes.
     *
     * @param string $data the data to generate the code
     */
    public function __construct(\context $context) {
        $this->context = $context;
    }

    final public function get_content(string $mimetype): string {
        $data = $this->get_data();

        switch($mimetype) {
            case 'image/png':
                return $this->get_png_content($data);
            default:
                throw new \moodle_exception('invalidmimetype', 'error', '', $mimetype);
        }
    }

    final protected function get_png_content(opengraph_image_data $data): string {
        global $CFG;

        require_once("{$CFG->libdir}/filelib.php");
        // Now we have the data, we can generate the image.
        $image = imagecreate(1200, 600);

        // TODO Determine the best way to compile this image and allow themes to override aspects of the design.
        $bg = imagecolorallocate($image, 255, 255, 255);
        $textcolour = imagecolorallocate($image, 0, 0, 255);
        $secondarycolour = imagecolorallocate($image, 0, 0, 255);

        imagestring($image, 5, 80, 160, $data->get_title(), $textcolour);
        imagettftext($image, 60, 0, 80, 160, $textcolour, 'arial.ttf', $data->get_title());
        if ($data->has_subtitle()) {
            imagestring($image, 5, 80, 160, $data->get_subtitle(), $secondarycolour);
        }

        // Add the primary image.
        $fs = get_file_storage();
        $sitelogo = $fs->get_file(
            (\context_system::instance())->id,
            'core_admin',
            'logo',
            0,
            '/',
            get_config('core_admin', 'logo')
        );
        if ($data->has_primary_image()) {
            $primaryimage = imagecreatefrompng($data->get_primary_image_path());
            imagecopy($image, $primaryimage, 0, 0, 0, 0, 1200, 600);

            if ($sitelogo) {
                $siteimage = imagecreatefromstring($sitelogo->get_content());
                imagecopy($image, $siteimage, 0, 0, 0, 0, 1200, 600);
            }
        } else {
            // Use the site logo as the primary image.
        }

        ob_start();
        imagepng($image);
        imagedestroy($image);
        $content = ob_get_clean();

        return $content;
    }

    abstract protected function get_data(): opengraph_image_data;
}
