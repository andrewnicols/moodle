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
 * Shows a dialogue with info about this logs.
 *
 * @module     tool_analytics/log_info
 * @copyright  2017 David Monllao {@link http://www.davidmonllao.com}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import Modal from 'core/modal';
import {get_string as getString} from 'core/str';
import {render} from 'core/templates';

export const loadInfo = (id, info) => {
    document.addEventListener('click', (e) => {
        const link = e.target.closest(`[data-model-log-id="${id}"]`);
        if (!link) {
            return;
        }

        Modal.create({
            title: getString('loginfo', 'tool_analytics'),
            body: render('tool_analytics/log_info', {items: info}),
            large: true,
            show: true,
            removeOnClose: true,
        });
    });
};
