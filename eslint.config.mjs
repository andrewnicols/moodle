import babel from "@babel/eslint-plugin";
import promise from "eslint-plugin-promise";
import jsdoc from "eslint-plugin-jsdoc";
import globals from "globals";
import babelParser from "@babel/eslint-parser";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

// Load our eslint ignore content.
const ignorePath = path.join(__dirname, ".eslintignores");
const ignoreContent = await fs.promises.readFile(ignorePath, "utf8");
const ignoreLines = ignoreContent.split(/\r?\n/).map((line) => line.trim());

export default [{
    // TODO Read a separate file for this.
    ignores: ignoreLines,
}, ...compat.extends("eslint:recommended", "plugin:promise/recommended"), {
    plugins: {
        "@babel": babel,
        promise,
        jsdoc,
    },

    linterOptions: {
        reportUnusedDisableDirectives: true,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.amd,

            // Moodle globals.
            M: true,
            Y: true,
        },
    },

    rules: {
        // Possible errors.
        "comma-dangle": "off",
        "no-console": "error",
        "no-empty": "warn",
        "no-extra-parens": "off",
        "no-prototype-builtins": "off",
        "no-unreachable": "warn",

        // Best practices - mostly matching the legacy jshint configuratino.
        "array-callback-return": "warn",
        "block-scoped-var": "warn",
        complexity: "warn",
        "consistent-return": "warn",
        curly: "error",
        "dot-notation": "warn",
        "no-alert": "warn",
        "no-caller": "error",
        "no-div-regex": "error",
        "no-empty-function": "warn",
        "no-eq-null": "error",
        "no-eval": "error",
        "no-extend-native": "error",
        "no-extra-bind": "warn",
        "no-floating-decimal": "warn",
        "no-global-assign": "warn",
        "no-implied-eval": "error",
        "no-invalid-this": "error",
        "no-iterator": "error",
        "no-labels": "error",
        "no-loop-func": "error",
        "no-multi-spaces": "warn",
        "no-multi-str": "error",
        "no-new-func": "error",
        "no-new-wrappers": "error",
        "no-octal-escape": "error",
        "no-proto": "error",
        "no-redeclare": "warn",

        "no-restricted-globals": ["error", {
            name: "Notification",
        }],

        "no-return-assign": "error",
        "no-script-url": "error",
        "no-self-compare": "error",
        "no-sequences": "warn",
        "no-throw-literal": "warn",
        "no-unmodified-loop-condition": "error",
        "no-unused-expressions": "error",
        "no-useless-call": "warn",
        "no-useless-escape": "warn",
        "wrap-iife": ["error", "any"],

        // Variables.
        "no-undef-init": "error",

        "no-unused-vars": ["error", {
            caughtErrors: "none",
        }],

        // Stylistic issues.
        "array-bracket-spacing": "warn",
        "block-spacing": "warn",
        "brace-style": ["warn", "1tbs"],
        camelcase: "warn",

        "capitalized-comments": ["warn", "always", {
            ignoreConsecutiveComments: true,
        }],

        "comma-spacing": ["warn", {
            before: false,
            after: true,
        }],

        "comma-style": ["warn", "last"],
        "computed-property-spacing": "error",
        "consistent-this": "off",
        "eol-last": "off",
        "func-call-spacing": ["warn", "never"],
        "func-names": "off",
        "func-style": "off",

        // Indent currently not doing well with our wrapping style.
        // Disabled for now.
        indent: ["off", 4, {
            SwitchCase: 1,
        }],

        "key-spacing": ["warn", {
            beforeColon: false,
            afterColon: true,
            mode: "minimum",
        }],

        "keyword-spacing": "warn",
        "linebreak-style": ["error", "unix"],
        "lines-around-comment": "off",
        "max-len": ["error", 132],
        "max-lines": "off",
        "max-depth": "warn",
        "max-nested-callbacks": ["warn", 5],
        "max-params": "off",
        "max-statements": "off",

        "max-statements-per-line": ["warn", {
            max: 2,
        }],

        "new-cap": ["warn", {
            properties: false,
        }],

        "new-parens": "warn",
        "newline-per-chained-call": "off",
        "no-array-constructor": "off",
        "no-bitwise": "error",
        "no-continue": "off",
        "no-inline-comments": "off",
        "no-lonely-if": "off",
        "no-mixed-operators": "off",
        "no-multiple-empty-lines": "warn",
        "no-negated-condition": "off",
        "no-nested-ternary": "warn",
        "no-new-object": "off",
        "no-plusplus": "off",
        "no-tabs": "error",
        "no-ternary": "off",
        "no-trailing-spaces": "error",
        "no-underscore-dangle": "off",
        "no-unneeded-ternary": "off",
        "no-whitespace-before-property": "warn",
        "object-curly-newline": "off",
        "object-curly-spacing": "warn",
        "object-property-newline": "off",
        "one-var": "off",
        "one-var-declaration-per-line": ["warn", "initializations"],
        "operator-assignment": "off",
        "operator-linebreak": "off",
        "padded-blocks": "off",

        "quote-props": ["warn", "as-needed", {
            unnecessary: false,
            keywords: true,
            numbers: true,
        }],

        quotes: "off",
        semi: "error",

        "semi-spacing": ["warn", {
            before: false,
            after: true,
        }],

        "sort-vars": "off",
        "space-before-blocks": "warn",
        "space-before-function-paren": ["warn", "never"],
        "space-in-parens": "warn",
        "space-infix-ops": "warn",
        "space-unary-ops": "warn",
        "spaced-comment": "warn",
        "unicode-bom": "error",
        "wrap-regex": "off",

        // Promises.
        "promise/always-return": "warn",
        "promise/no-return-wrap": "warn",
        "promise/param-names": "warn",

        "promise/catch-or-return": ["warn", {
            terminationMethod: ["catch", "fail", "always"],
            allowFinally: true,
        }],

        "promise/no-native": "warn",
        "promise/avoid-new": "warn",

        // Deprecations.
        "no-restricted-properties": ["warn", {
            object: "M",
            property: "str",
            message: "Use \"core/str\" module or M.util.get_string()",
        }],
    },
}, {
    // Different rules for all YUI code.
    files: ["**/yui/src/**/*.js"],

    languageOptions: {
        globals: {},
        parser: babelParser,
        ecmaVersion: 5,
        sourceType: "module",
        parserOptions: {
            requireConfigFile: false,
        },
    },

    rules: {
        // Disable some rules which we can't safely define for YUI rollups.
        "no-undef": "off",
        "no-unused-vars": "off",
        "no-unused-expressions": "off",

        // JSDocs are different for YUI.
        "jsdoc/check-access": "off",
        "jsdoc/check-alignment": "off",
        "jsdoc/check-param-names": "off",
        "jsdoc/check-property-names": "off",
        "jsdoc/empty-tags": "off",
        "jsdoc/implements-on-classes": "off",
        "jsdoc/multiline-blocks": "off",
        "jsdoc/require-jsdoc": "off",
        "jsdoc/require-param": "off",
        "jsdoc/require-param-name": "off",
        "jsdoc/require-param-type": "off",
        "jsdoc/require-property": "off",
        "jsdoc/require-property-name": "off",
        "jsdoc/require-property-type": "off",
    },
}, {
    // Different rules for all AMD code.
    files: [
        "**/amd/src/*.js",
        "**/amd/src/**/*.js",
        "**/Gruntfile.js",
        ".grunt/*.js",
        ".grunt/tasks/*.js",
        "**/jsdoc.conf.js",
    ],

    languageOptions: {
        parser: babelParser,
        ecmaVersion: 6,
        sourceType: "module",

        parserOptions: {
            requireConfigFile: false,
        },
    },

    rules: {
        "no-implicit-globals": "error",
        // Not using this rule for the time being because it isn't
        // compatible with jQuery and ES6.
        quotes: "off",

        // Enable all of the babel version of these rules.
        "new-cap": ["warn", {
            properties: false,
        }],

        // Not using this rule for the time being because it isn't
        // compatible with jQuery and ES6.
        "no-invalid-this": "off",
        "object-curly-spacing": "warn",
        semi: "error",
        "no-unused-expressions": "error",
        // We have Promise now that we're using ES6.
        "promise/no-native": "off",
        "promise/avoid-new": "off",

        // JSDocs.
        "jsdoc/check-access": "error",
        "jsdoc/check-alignment": 1,
        "jsdoc/check-param-names": "error",
        "jsdoc/check-property-names": "error",
        "jsdoc/empty-tags": "error",
        "jsdoc/implements-on-classes": "error",
        "jsdoc/multiline-blocks": "error",
        "jsdoc/require-jsdoc": "error",
        "jsdoc/require-param": "error",
        "jsdoc/require-param-name": "error",
        "jsdoc/require-param-type": "error",
        "jsdoc/require-property": "error",
        "jsdoc/require-property-name": "error",
        "jsdoc/require-property-type": "error",
    }
}];
