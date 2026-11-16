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

namespace core\router\parameters;

use core\exception\invalid_parameter_exception;
use core\param;
use core\router\schema\parameters\query_parameter;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Query parameter controlling context filters for text output.
 *
 * @package core
 * @copyright 2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class query_apply_context_filters extends query_parameter {
    /**
     * Create the parameter.
     */
    public function __construct() {
        parent::__construct(
            name: 'applyContextFilters',
            type: param::BOOL,
            description: 'Apply context-enabled filters to formatted text. Defaults to false. '
                . 'Cannot be combined with raw text.',
        );
    }

    #[\Override]
    public function validate(ServerRequestInterface $request, array $params): ServerRequestInterface {
        try {
            return parent::validate($request, $params);
        } catch (\ValueError $exception) {
            throw new invalid_parameter_exception('applyContextFilters must be true or false.');
        }
    }
}
