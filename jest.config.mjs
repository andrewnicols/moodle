/**
 * @returns {Promise<import('jest').Config>}
 */
export default {
    testEnvironment: 'jsdom',
    testMatch: [
        '**/tests/amd/?(*.)(test).mjs',
    ],
    moduleNameMapper: {
        // '^core_(.*)$': '<rootDir>/lib/amd/src/$1.js',
        'jquery': '<rootDir>/lib/jquery/jquery-3.6.1.js',
    },
    modulePathIgnorePatterns: [
        '<rootDir>/.*/amd/build/',
    ],
    resolver: '<rootDir>.grunt/jest/resolver.js',
};
