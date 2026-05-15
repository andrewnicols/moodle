const fs = require('fs');

// The tsconfig.aliases.json uses JSONC (JSON with comments) — strip line comments before parsing.
const aliasesRaw = fs.readFileSync('./tsconfig.aliases.json', 'utf-8').replace(/\/\/[^\n]*/g, '');
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
moduleNameMapper['^@moodlehq/design-system$'] = '<rootDir>/lib/js/bundles/design-system.js';

/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'jsdom',
    clearMocks: true,
    testMatch: ['**/esm/tests/**/*.test.{ts,tsx}'],
    moduleNameMapper,
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: './tsconfig.jest.json',
        }],
        // The design-system bundle ships ESM .js files that Jest cannot load natively.
        'lib/js/bundles/design-system.*\\.js$': ['ts-jest', {
            tsconfig: {allowJs: true, esModuleInterop: true, jsx: 'react-jsx'},
            useESM: false,
        }],
    },
    setupFiles: [
        '<rootDir>/.jest/globalM.ts',
    ],
    setupFilesAfterEnv: [
        '@testing-library/jest-dom',
        '<rootDir>/.jest/globalSetup.ts',
    ],
    collectCoverageFrom: [
        '**/esm/src/**/*.{ts,tsx}',
        '!**/*.d.ts',
    ],
};
