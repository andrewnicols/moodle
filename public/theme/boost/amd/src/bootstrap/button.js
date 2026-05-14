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
 * Backward compatibility module for Button.
 *
 * @module     theme_boost/bootstrap/button
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Deprecated from 'core/deprecated';
import {Button} from '../index';

Deprecated('theme_boost/bootstrap/button', {
    replacement: 'import {Button} from "core/bootstrap";',
    mdl: 'MDL-XXXXX',
    reason: 'All Bootstrap modules are already all included automatically',
});

export default Button;