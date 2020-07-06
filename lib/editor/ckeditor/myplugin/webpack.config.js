/* eslint-env node */
// webpack.config.js

'use strict';

const path = require( 'path' );
const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );

module.exports = {
    externals: {
        '@ckeditor/ckeditor5-core/src/plugin': '@ckeditor/ckeditor5-core/src/plugin',
        '@ckeditor/ckeditor5-core/src/command': '@ckeditor/ckeditor5-core/src/command',

        '@ckeditor/ckeditor5-ui/src/button/buttonview': '@ckeditor/ckeditor5-ui/src/button/buttonview',
        '@ckeditor/ckeditor5-ui/src/toolbar/toolbarseparatorview': '@ckeditor/ckeditor5-ui/src/toolbar/toolbarseparatorview',
        '@ckeditor/ckeditor5-ui/src/dropdown/button/splitbuttonview': '@ckeditor/ckeditor5-ui/src/dropdown/button/splitbuttonview',
        '@ckeditor/ckeditor5-ui/src/dropdown/utils': '@ckeditor/ckeditor5-ui/src/dropdown/utils',
    },

    // https://webpack.js.org/configuration/entry-context/
    entry: './plugin.js',

    // https://webpack.js.org/configuration/output/
    output: {
        path: path.resolve(__dirname, '../', 'amd', 'src'),
        filename: 'plugin.js',
        libraryTarget: 'amd',
        devtoolNamespace: 'editorckeditor_highlight',
    },

    module: {
        rules: [
            {
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,

                use: [ 'raw-loader' ]
            },
            {
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,

                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'singletonStyleTag',
                            attributes: {
                                'data-cke': true
                            }
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: styles.getPostCssConfig( {
                            themeImporter: {
                                themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
                            },
                            minify: true
                        } )
                    }
                ]
            }
        ]
    },

    // Useful for debugging.
    devtool: 'source-map',

    // By default webpack logs warnings if the bundle is bigger than 200kb.
    performance: { hints: false }
};
