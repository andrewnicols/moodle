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

namespace core\router\middleware;

use core\exception\invalid_parameter_exception;
use core\formatting;
use core\text_formatting_options;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * Apply text representation preferences for the duration of an API request.
 *
 * @package core
 * @copyright 2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class text_formatting_middleware implements MiddlewareInterface {
    /**
     * Create the middleware.
     *
     * @param formatting $formatter Shared formatter
     */
    public function __construct(
        /** @var formatting Shared formatter */
        protected formatting $formatter,
    ) {
    }

    #[\Override]
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface {
        $params = $request->getQueryParams();
        $mode = $params['textMode'] ?? 'formatted';
        $filter = $params['applyContextFilters'] ?? null;
        if (!in_array($mode, ['formatted', 'raw'], true)) {
            throw new invalid_parameter_exception('textMode must be formatted or raw.');
        }
        if ($mode === 'raw' && $filter !== null) {
            throw new invalid_parameter_exception('applyContextFilters cannot be used with raw text.');
        }
        $options = new text_formatting_options(
            raw: $mode === 'raw',
            filter: $filter === null ? null : (bool) $filter,
        );

        $previous = $this->formatter->get_external_options();
        $this->formatter->set_external_options($options);
        try {
            return $handler->handle($request);
        } finally {
            $this->formatter->set_external_options($previous);
        }
    }
}
