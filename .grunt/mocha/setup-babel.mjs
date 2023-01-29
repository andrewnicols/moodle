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
 * This file is responsible for the babel setup and configuration for use in Mocha tests.
 *
 * @copyright Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import path from 'path';
import registerBabel from '@babel/register';
import {
    fetchComponentData,
    getPathFromAMDModuleName,
} from '../components.js';

import overrideRequire from 'override-require';

const isOverride = (request) => {
    if (request.startsWith('.')) {
        return false;
    }
    if (request.split('/').length === 1) {
        return false;
    }
    if (request.startsWith('/')) {
        return false;
    }
    const path = getPathFromAMDModuleName(request);
    if (path) {
        return true;
    }
    return false;
};

const resolveRequest = (request, parent) => {
    const modulePath = getPathFromAMDModuleName(request);
    return parent.require(path.join(process.cwd(), modulePath));
};
overrideRequire(isOverride, resolveRequest);

// Register Babel first.
// We want to do this here, with our own configuration which is separate to the grunt amd configuration.

const getModuleResolver = () => {
    const componentData = fetchComponentData().components;
    const aliases = {
        jquery: './lib/jquery/jquery-3.6.1.js',
        requirejs: './lib/requirejs/require.js',
    };
    for (const [thisPath, component] of Object.entries(componentData)) {
        aliases[component] = `./${thisPath}/amd/src`;
    }

    return [
        "module-resolver",
        {
            extensions: [".ts", ".mjs", ".js"],
            root: ["./"],
            alias: aliases,
        },
    ];
};

const getEsmModuleResolver = () => {
    const componentData = fetchComponentData().components;
    const aliases = {
        jquery: './lib/jquery/jquery-3.6.1.js',
        requirejs: './lib/requirejs/require.js',
    };
    for (const [thisPath, component] of Object.entries(componentData)) {
        aliases[component] = `./${thisPath}/amd/src`;
    }

    return [
        path.join(process.cwd(), '.grunt', 'mocha', 'esm-resolver.js'),
        {
            extensions: [".ts", ".mjs", ".js"],
            root: ["./"],
            // "alias",
            source: {
                alias: aliases,
                ignoreUnresolved: true,
            },
        },
    ];
};

registerBabel({
    presets: [
        ['@babel/preset-env', {
            "exclude": ["transform-regenerator"],
        }]
    ],
    plugins: [
        getEsmModuleResolver(),

        ['transform-amd-to-es6', {
            amdToES6Modules: true, // true by default
            excludes: [
                '**/lib/requirejs/require.js',
                '**/lib/jquery/jquery*.js',
                '**/lib/amd/src/loglevel.js',
            ]
        }],
        ["@babel/plugin-proposal-class-properties"],
        getModuleResolver(),
    ],
});
