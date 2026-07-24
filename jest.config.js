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

/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'jsdom',
    clearMocks: true,
    testMatch: ['**/esm/tests/**/*.test.{ts,tsx}'],
    moduleNameMapper: {
        ...moduleNameMapper,
        // The design system package's "exports" map only declares an ESM ("import") condition,
        // so bypass conditional-exports resolution and point straight at the built entry file.
        '^@moodlehq/design-system$': '<rootDir>/node_modules/@moodlehq/design-system/dist/index.js',
    },
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: './tsconfig.jest.json',
        }],
        '^.+\\.jsx?$': ['ts-jest', {
            tsconfig: './tsconfig.jest.json',
            isolatedModules: true,
        }],
    },
    transformIgnorePatterns: [
        '/node_modules/(?!@moodlehq/design-system)',
    ],
    setupFiles: [
        '<rootDir>/.jest/globalM.ts',
    ],
    setupFilesAfterEnv: [
        '@testing-library/jest-dom',
        '<rootDir>/.jest/globalSetup.ts',
        '<rootDir>/.jest/mockRedirect.ts',
    ],
    collectCoverageFrom: [
        '**/esm/src/**/*.{ts,tsx}',
        '!**/*.d.ts',
    ],
};
