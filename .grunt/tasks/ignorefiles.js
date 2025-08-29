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
/* jshint node: true, browser: false */
/* eslint-env node */

/**
 * @copyright  2021 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

const path = require('path');
const fs = require('fs');
const ComponentList = require(path.join(process.cwd(), '.grunt', 'components.js'));
const gruntFilePath = fs.realpathSync(process.cwd());

module.exports = grunt => {
    /**
     * Generate the phpDocumentor configuration.
     *
     * @param {Object} thirdPartyPaths
     */
    const phpdocConfig = (thirdPartyPaths) => {
        const {toXML} = require('jstoxml');

        const getPathStanza = (pathData) => ({
            _name: 'path',
            _content: pathData,
        });

        const ignores = [];
        thirdPartyPaths.forEach(library => {
            ignores.push(getPathStanza(library));
        });

        const componentPaths = [];
        ComponentList.getComponentPaths(`${gruntFilePath}/`).forEach(componentPath => {
            componentPaths.push(getPathStanza(`${componentPath}/classes/*`));
            componentPaths.push(getPathStanza(`${componentPath}/classes/**/*`));
            componentPaths.push(getPathStanza(`${componentPath}/lib.php`));
            componentPaths.push(getPathStanza(`${componentPath}/locallib.php`));
            componentPaths.push(getPathStanza(`${componentPath}/tests/classes/*`));

            ignores.push(getPathStanza(`${componentPath}/tests/**/*`));
        });

        const config = {
            _name: 'phpdocumentor',
            _attrs: {
                configVersion: "3",
                "xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",
                "xmlns": "https://www.phpdoc.org",
                "xsi:noNamespaceSchemaLocation": "https://raw.githubusercontent.com/phpDocumentor/phpDocumentor/master/data/xsd/phpdoc.xsd",
            },
            _content: {
                paths: {
                    output: "public/phpdoc",
                    cache: ".phpdoc/cache",
                },
                version: {
                    _attrs: {
                        number: "main"
                    },
                    api: [
                        {
                            _name: 'ignore',
                            _attrs: {
                                hidden: "true",
                                symlinks: "true",
                            },
                            _content: ignores,
                        },
                        {
                            _name: 'source',
                            _attrs: {
                                dsn: '.',
                            },
                            _content: componentPaths,
                        },
                        {
                            _name: 'output',
                            _content: 'public/phpdoc',
                        },
                        {
                            _name: 'include-source',
                            _content: 'true',
                        },
                    ],
                },
            },
        };

        grunt.file.write('phpdoc.dist.xml', toXML(config, {
            header: true,
            indent: '  ',
        }) + "\n");
    };

    /**
     * Generate the PHPCS configuration.
     *
     * @param {Object} thirdPartyPaths
     */
    const phpcsIgnore = (thirdPartyPaths) => {
        const {toXML} = require('jstoxml');

        const config = {
            _name: 'ruleset',
            _attrs: {
                name: "MoodleCore",
            },
            _content: [
                {
                    rule: {
                        _attrs: {
                            ref: './phpcs.xml.dist',
                        },
                    },
                },
            ],
        };

        thirdPartyPaths.forEach(library => {
            config._content.push({
                'exclude-pattern': library,
            });
        });

        grunt.file.write('phpcs.xml', toXML(config, {
            header: true,
            indent: '  ',
        }) + "\n");
    };

    /**
     * Generate ignore files (utilising thirdpartylibs.xml data)
     */
    const handler = function() {
        // An array of paths to third party directories.
        const thirdPartyPaths = ComponentList.getThirdPartyPaths();

        // Generate .eslintignore.
        const eslintIgnores = [
            '# Generated by "grunt ignorefiles"',
            // Do not ignore the .grunt directory.
            '!/.grunt',

            // Ignore all yui/src meta directories and build directories.
            '*/**/yui/src/*/meta/',
            '*/**/build/',
        ].concat(thirdPartyPaths);
        grunt.file.write('.eslintignore', eslintIgnores.join('\n') + '\n');

        // Generate .stylelintignore.
        const stylelintIgnores = [
            '# Generated by "grunt ignorefiles"',
            '**/yui/build/*',
            'public/theme/boost/style/moodle.css',
            'public/theme/classic/style/moodle.css',
            'jsdoc/styles/*.css',
            'public/admin/tool/componentlibrary/hugo/dist/css/docs.css',
        ].concat(thirdPartyPaths);
        grunt.file.write('.stylelintignore', stylelintIgnores.join('\n') + '\n');

        phpcsIgnore(thirdPartyPaths);
        phpdocConfig(thirdPartyPaths);
    };

    grunt.registerTask('ignorefiles', 'Generate ignore files for linters', handler);

    return handler;
};
