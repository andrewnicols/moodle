// This file is part of Moodle - https://moodle.org/
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
const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  'plugins': [
    'babel',
    'promise',
    'jsdoc',
    'header',
  ],
  'env': {
    'browser': true,
    'amd': true
  },
  'globals': {
    'M': true,
    'Y': true
  },
  'rules': {
    // See http://eslint.org/docs/rules/ for all rules and explanations of all rules.

    // === Possible Errors ===
    'comma-dangle': OFF,
    'no-compare-neg-zero': ERROR,
    'no-cond-assign': ERROR,
    'no-console': ERROR,
    'no-constant-condition': ERROR,
    'no-control-regex': ERROR,
    'no-debugger': ERROR,
    'no-dupe-args': ERROR,
    'no-dupe-keys': ERROR,
    'no-duplicate-case': ERROR,
    'no-empty': WARNING,
    'no-empty-character-class': ERROR,
    'no-ex-assign': ERROR,
    'no-extra-boolean-cast': ERROR,
    'no-extra-parens': OFF,
    'no-extra-semi': ERROR,
    'no-func-assign': ERROR,
    'no-inner-declarations': ERROR,
    'no-invalid-regexp': ERROR,
    'no-irregular-whitespace': ERROR,
    'no-obj-calls': ERROR,
    'no-prototype-builtins': OFF,
    'no-regex-spaces': ERROR,
    'no-sparse-arrays': ERROR,
    'no-unexpected-multiline': ERROR,
    'no-unreachable': WARNING,
    'no-unsafe-finally': ERROR,
    'no-unsafe-negation': ERROR,
    'use-isnan': ERROR,
    'valid-jsdoc': [WARNING, {'requireReturn': false, 'requireParamDescription': false, 'requireReturnDescription': false}],
    'valid-typeof': ERROR,

    // === Best Practices ===
    // (these mostly match our jshint config)
    'array-callback-return': WARNING,
    'block-scoped-var': WARNING,
    'complexity': WARNING,
    'consistent-return': WARNING,
    'curly': ERROR,
    'dot-notation': WARNING,
    'no-alert': WARNING,
    'no-caller': ERROR,
    'no-case-declarations': ERROR,
    'no-div-regex': ERROR,
    'no-empty-pattern': ERROR,
    'no-empty-function': WARNING,
    'no-eq-null': ERROR,
    'no-eval': ERROR,
    'no-extend-native': ERROR,
    'no-extra-bind': WARNING,
    'no-fallthrough': ERROR,
    'no-floating-decimal': WARNING,
    'no-global-assign': WARNING,
    'no-implied-eval': ERROR,
    'no-invalid-this': ERROR,
    'no-iterator': ERROR,
    'no-labels': ERROR,
    'no-loop-func': ERROR,
    'no-multi-spaces': WARNING,
    'no-multi-str': ERROR,
    'no-new-func': ERROR,
    'no-new-wrappers': ERROR,
    'no-octal': ERROR,
    'no-octal-escape': ERROR,
    'no-proto': ERROR,
    'no-redeclare': WARNING,
    'no-return-assign': ERROR,
    'no-script-url': ERROR,
    'no-self-assign': ERROR,
    'no-self-compare': ERROR,
    'no-sequences': WARNING,
    'no-throw-literal': WARNING,
    'no-unmodified-loop-condition': ERROR,
    'no-unused-expressions': ERROR,
    'no-unused-labels': ERROR,
    'no-useless-call': WARNING,
    'no-useless-escape': WARNING,
    'no-with': ERROR,
    'wrap-iife': [ERROR, 'any'],

    // === Variables ===
    'no-delete-var': ERROR,
    'no-undef': ERROR,
    'no-undef-init': ERROR,
    'no-unused-vars': [ERROR, {'caughtErrors': 'none'}],

    // === Stylistic Issues ===
    'array-bracket-spacing': WARNING,
    'block-spacing': WARNING,
    'brace-style': [WARNING, '1tbs'],
    'camelcase': WARNING,
    'capitalized-comments': [WARNING, 'always', {'ignoreConsecutiveComments': true}],
    'comma-spacing': [WARNING, {'before': false, 'after': true}],
    'comma-style': [WARNING, 'last'],
    'computed-property-spacing': ERROR,
    'consistent-this': OFF,
    'eol-last': OFF,
    'func-call-spacing': [WARNING, 'never'],
    'func-names': OFF,
    'func-style': OFF,
    // Indent currently not doing well with our wrapping style, so disabled.
    'indent': [OFF, 4, {'SwitchCase': 1}],
    'key-spacing': [WARNING, {'beforeColon': false, 'afterColon': true, 'mode': 'minimum'}],
    'keyword-spacing': WARNING,
    'linebreak-style': [ERROR, 'unix'],
    'lines-around-comment': OFF,
    'max-len': [ERROR, 132],
    'max-lines': OFF,
    'max-depth': WARNING,
    'max-nested-callbacks': [WARNING, 5],
    'max-params': OFF,
    'max-statements': OFF,
    'max-statements-per-line': [WARNING, {max: 2}],
    'new-cap': [WARNING, {'properties': false}],
    'new-parens': WARNING,
    'newline-after-var': OFF,
    'newline-before-return': OFF,
    'newline-per-chained-call': OFF,
    'no-array-constructor': OFF,
    'no-bitwise': ERROR,
    'no-continue': OFF,
    'no-inline-comments': OFF,
    'no-lonely-if': OFF,
    'no-mixed-operators': OFF,
    'no-mixed-spaces-and-tabs': ERROR,
    'no-multiple-empty-lines': WARNING,
    'no-negated-condition': OFF,
    'no-nested-ternary': WARNING,
    'no-new-object': OFF,
    'no-plusplus': OFF,
    'no-tabs': ERROR,
    'no-ternary': OFF,
    'no-trailing-spaces': ERROR,
    'no-underscore-dangle': OFF,
    'no-unneeded-ternary': OFF,
    'no-whitespace-before-property': WARNING,
    'object-curly-newline': OFF,
    'object-curly-spacing': WARNING,
    'object-property-newline': OFF,
    'one-var': OFF,
    'one-var-declaration-per-line': [WARNING, 'initializations'],
    'operator-assignment': OFF,
    'operator-linebreak': OFF,
    'padded-blocks': OFF,
    'quote-props': [WARNING, 'as-needed', {'unnecessary': false, 'keywords': true, 'numbers': true}],
    'quotes': OFF,
    'require-jsdoc': WARNING,
    'semi': ERROR,
    'semi-spacing': [WARNING, {'before': false, 'after': true}],
    'sort-vars': OFF,
    'space-before-blocks': WARNING,
    'space-before-function-paren': [WARNING, 'never'],
    'space-in-parens': WARNING,
    'space-infix-ops': WARNING,
    'space-unary-ops': WARNING,
    'spaced-comment': WARNING,
    'unicode-bom': ERROR,
    'wrap-regex': OFF,

    // === Promises ===
    'promise/always-return': WARNING,
    'promise/no-return-wrap': WARNING,
    'promise/param-names': WARNING,
    'promise/catch-or-return': [WARNING, {terminationMethod: ['catch', 'fail']}],
    'promise/no-native': WARNING,
    'promise/no-promise-in-callback': WARNING,
    'promise/no-callback-in-promise': WARNING,
    'promise/avoid-new': WARNING,

    // === Deprecations ===
    "no-restricted-properties": [WARNING, {
        'object': 'M',
        'property': 'str',
        'message': 'Use AMD module "core/str" or M.util.get_string()'
    }],

    'header/header': [
        ERROR,
        'line',
        [
            ' This file is part of Moodle - https://moodle.org/',
            '',
            ' Moodle is free software: you can redistribute it and/or modify',
            ' it under the terms of the GNU General Public License as published by',
            ' the Free Software Foundation, either version 3 of the License, or',
            ' (at your option) any later version.',
            '',
            ' Moodle is distributed in the hope that it will be useful,',
            ' but WITHOUT ANY WARRANTY; without even the implied warranty of',
            ' MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the',
            ' GNU General Public License for more details.',
            '',
            ' You should have received a copy of the GNU General Public License',
            ' along with Moodle.  If not, see <http://www.gnu.org/licenses/>.',
        ],
        1,
    ],
  },
  overrides: [
    {
      files: ["**/yui/src/**/*.js"],
      // Disable some rules which we can't safely define for YUI rollups.
      rules: {
        'no-undef': OFF,
        'no-unused-vars': OFF,
        'no-unused-expressions': OFF,

        // === JSDocs ===
        "jsdoc/check-access": OFF,
        "jsdoc/check-alignment": OFF,
        "jsdoc/check-param-names": OFF,
        "jsdoc/check-property-names": OFF,
        "jsdoc/empty-tags": OFF,
        "jsdoc/implements-on-classes": OFF,
        "jsdoc/multiline-blocks": OFF,
        "jsdoc/require-jsdoc": OFF,
        "jsdoc/require-param": OFF,
        "jsdoc/require-param-name": OFF,
        "jsdoc/require-param-type": OFF,
        "jsdoc/require-property": OFF,
        "jsdoc/require-property-name": OFF,
        "jsdoc/require-property-type": OFF,

        // Disable the header addition.
        "header/header": OFF,
      }
    },
    {
      files: [
          ".eslintrc.js",
          "**/amd/src/*.js",
          "**/amd/src/**/*.js",
          "Gruntfile.js",
          ".grunt/*.js",
          ".grunt/tasks/*.js",
          "jsdoc.conf.js",
      ],
      // We support es6 now. Woot!
      env: {
        es6: true
      },
      // We're using babel transpiling so use their parser
      // for linting.
      parser: '@babel/eslint-parser',
      // Check AMD with some slightly stricter rules.
      rules: {
        'no-unused-vars': ERROR,
        'no-implicit-globals': ERROR,
        // Disable all of the rules that have babel versions.
        'new-cap': OFF,
        // Not using this rule for the time being because it isn't
        // compatible with jQuery and ES6.
        'no-invalid-this': OFF,
        'object-curly-spacing': OFF,
        'quotes': OFF,
        'semi': OFF,
        'no-unused-expressions': OFF,
        // Enable all of the babel version of these rules.
        'babel/new-cap': [WARNING, {'properties': false}],
        // Not using this rule for the time being because it isn't
        // compatible with jQuery and ES6.
        'babel/no-invalid-this': OFF,
        'babel/object-curly-spacing': WARNING,
        // This is off in the original style int.
        'babel/quotes': OFF,
        'babel/semi': ERROR,
        'babel/no-unused-expressions': ERROR,
        // === Promises ===
        // We have Promise now that we're using ES6.
        'promise/no-native': OFF,
        'promise/avoid-new': OFF,

        // === JSDocs ===
        "jsdoc/check-access": [
          ERROR,
        ],
        "jsdoc/check-alignment": 1, // Recommended.
        "jsdoc/check-param-names": [
          ERROR,
        ],
        "jsdoc/check-property-names": [
          ERROR,
        ],
        "jsdoc/empty-tags": [
          ERROR,
        ],
        "jsdoc/implements-on-classes": [
          ERROR,
        ],
        "jsdoc/multiline-blocks": [
          ERROR,
        ],
        "jsdoc/require-jsdoc": [
          ERROR,
        ],
        "jsdoc/require-param": [
          ERROR,
        ],
        "jsdoc/require-param-name": [
          ERROR,
        ],
        "jsdoc/require-param-type": [
          ERROR,
        ],
        "jsdoc/require-property": [
          ERROR,
        ],
        "jsdoc/require-property-name": [
          ERROR,
        ],
        "jsdoc/require-property-type": [
          ERROR,
        ],
      },
      parserOptions: {
        'ecmaVersion': 9,
        'sourceType': 'module',
        'requireConfigFile': false,
      }
    },
    {
      files: [
        ".eslintrc.js",
        "Gruntfile.js",
        ".grunt/*.js",
        ".grunt/tasks/*.js",
      ],
      env: {
        es6: true,
        commonjs: true,
        node: true,
      },
    }
  ]
};
