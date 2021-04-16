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
 * PHPUnit tool_brickfield tests
 *
 * @package   tool_brickfield
 * @copyright  2020 onward: Brickfield Education Labs, www.brickfield.ie
 * @author     Mike Churchward (mike@brickfieldlabs.ie)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace tool_brickfield;

defined('MOODLE_INTERNAL') || die();

class mock_brickfieldconnect extends brickfieldconnect {

    const VALIDAPIKEY = '123456789012345678901234567890ab';
    const VALIDSECRETKEY = 'ab123456789012345678901234567890';
    protected $apikey = '';
    protected $secretkey = '';

    public function is_registered(): bool {
        return ($this->apikey == self::VALIDAPIKEY) && ($this->secretkey == self::VALIDSECRETKEY);
    }

    public function update_registration(string $apikey, string $secretkey): bool {
        $this->apikey = $apikey;
        $this->secretkey = $secretkey;
        return $this->is_registered();
    }
}