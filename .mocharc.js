const path = require('path');
const glob = require('glob');
const fetchComponentData = require('./.grunt/components').fetchComponentData;

// Build a spec to find all tests.
// Note: We could just use '**/tests/mocha/**/*.js', but this is very slow.
const spec = Object.keys(fetchComponentData().components)
    .map((componentPath) => {
        return [
            `${componentPath}/tests/mocha/**/*.js`,
            `${componentPath}/tests/mocha/**/*.ts`,
        ];
    })
    .flat()
    .filter((globPath) => {
        return glob.sync(path.join(process.cwd(), globPath)).length > 0;
    });

const sourceFiles = Object.keys(fetchComponentData().components)
    .map((componentPath) => {
        return [
            `${componentPath}/amd/src/**/*.js`,
        ];
    })
    .flat()
    .filter((globPath) => {
        return glob.sync(path.join(process.cwd(), globPath)).length > 0;
    });

const watchFiles = [].concat(spec, sourceFiles, [
    '.grunt/mocha',
]);

module.exports = {
    spec,
    require: [
        // Setup our babel configuration.
        ".grunt/mocha/setup-babel.mjs",

        // Require jsdom for our tests.
        ".grunt/mocha/setup-jsdom.mjs",

        // Setup Chai.
        ".grunt/mocha/setup-chai.mjs",

        // Add our own setup too.
        ".grunt/mocha/setup-moodle.mjs",
        ".grunt/mocha/setup-moodle-helpers.mjs",
        ".grunt/mocha/setup-moodle-loaders.mjs",
    ],

    color: true,

    'watch-files': watchFiles,
};
