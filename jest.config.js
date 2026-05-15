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
 * Jest Configuration for Moodle's JavaScript unit tests.
 *
 * @copyright  Meirza <meirza.arson@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

const fs = require('fs');
const path = require('path');

// The tsconfig.aliases.json uses JSONC (JSON with comments) — strip line comments before parsing.
const aliasesRaw = fs.readFileSync(path.join(__dirname, './tsconfig.aliases.json'), 'utf-8').replace(/\/\/[^\n]*/g, '');
const {compilerOptions} = JSON.parse(aliasesRaw);

// Convert TypeScript path aliases to Jest moduleNameMapper format.
const moduleNameMapper = Object.fromEntries(
    Object.entries(compilerOptions.paths).map(([key, [value]]) => [
        `^${key.replace('/*', '/(.*)$')}`,
        `<rootDir>/${value.replace('/*', '/$1')}`,
    ]),
);

// The @moodlehq/design-system npm package uses ESM-only exports which Jest
// cannot resolve directly. Map it to the pre-built bundle in lib/.
moduleNameMapper['^@moodlehq/design-system$'] = '<rootDir>/lib/js/bundles/design-system/index.js';

/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'jsdom',
    clearMocks: true,
    testMatch: ['**/esm/tests/**/*.test.{ts,tsx}'],
    moduleNameMapper,
    transform: {
        '^.+\\.(ts|tsx)$': ['@swc/jest', {
            jsc: {
                parser: {syntax: 'typescript', tsx: true},
                transform: {react: {runtime: 'automatic'}},
            },
        }],
        // The design-system bundle ships ESM .js files that Jest cannot load natively.
        'lib/js/bundles/design-system/.+\\.js$': ['@swc/jest', {
            jsc: {
                parser: {syntax: 'ecmascript', jsx: true},
                transform: {react: {runtime: 'automatic'}},
            },
        }],
    },
    collectCoverageFrom: [
        '**/esm/src/**/*.{ts,tsx}',
        '!**/*.d.ts',
    ],
    setupFiles: [
        '<rootDir>/.jest/globalM.ts',
    ],
    setupFilesAfterEnv: [
        '@testing-library/jest-dom',
        '<rootDir>/.jest/globalSetup.ts',
    ],
};
