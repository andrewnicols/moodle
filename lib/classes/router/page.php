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

namespace core\router;

use core\exception\coding_exception;
use core\router\schema\parameter;
use core\router\schema\response\response;
use core\router\schema\request_body;
use Attribute;
use Psr\Http\Message\RequestInterface;

/**
 * Routing attribute.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD)]
class page extends route {
    public function __construct(
        ?string $path = null,
        null|array|string $method = null,
        readonly array $pathtypes = [],
        array $queryparams = [],
        array $headerparams = [],
        ?request_body $requestbody = null,
        array $responses = [],
        bool $deprecated = false,
        array $tags = [],
        bool $cookies = true,
        bool $abortafterconfig = false,

        protected bool|string $requirelogin = false,
        protected bool|string $requirecourselogin = false,
        protected bool $autologinguest = true,

        // Note. We do not make use of these extras.
        // These allow us to add additional arguments in future versions, whilst allowing plugins to use this version.
        ...$extra,

    ) {
        parent::__construct(
            path: $path,
            method: $method,
            pathtypes: $pathtypes,
            queryparams: $queryparams,
            headerparams: $headerparams,
            requestbody: $requestbody,
            responses: $responses,
            deprecated: $deprecated,
            tags: $tags,
            cookies: $cookies,
            abortafterconfig: $abortafterconfig,
        );
    }

    public function require_login(RequestInterface $request): void {
        if ($this->requirelogin === false) {
            return;
        }

        if ($this->requirelogin === true) {
            require_login(
                autologinguest: $this->autologinguest,
            );
            return;
        }

        require_login(
            courseorid: $this->requirelogin,
            autologinguest: $this->autologinguest,
        );
    }
}
