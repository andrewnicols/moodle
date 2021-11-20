"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _helperModuleTransforms = require("@babel/helper-module-transforms");

var _core = require("@babel/core");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var buildWrapper = (0, _core.template)("\n  define(MODULE_NAME, AMD_ARGUMENTS, function(IMPORT_NAMES) {\n  })\n");

function _default(api, options) {
  var loose = options.loose,
      allowTopLevelThis = options.allowTopLevelThis,
      strict = options.strict,
      strictMode = options.strictMode,
      noInterop = options.noInterop;
  return {
    pre: function pre() {
      this.hasDefine = false;
      this.hasESModule = false;
    },
    visitor: {
      CallExpression: function CallExpression(path) {
        if (path.get('callee').isIdentifier({
          name: 'define'
        })) {
          this.hasDefine = true;
        }
      },
      ImportDeclaration: function ImportDeclaration(path) {
        this.hasESModule = true;
      },
      ExportDeclaration: function ExportDeclaration(path) {
        this.hasESModule = true;
      },
      ExportDefaultDeclaration: function ExportDefaultDeclaration(path) {
        this.hasESModule = true;
      },
      Program: {
        exit: function exit(path) {
          if (!(0, _helperModuleTransforms.isModule)(path)) return; // We don't transform a module if it has a define, or is "not" an ES6 module

          if (this.hasDefine) {
            return;
          }

          var moduleName = this.getModuleName();
          if (moduleName) moduleName = _core.types.stringLiteral(moduleName);

          var _rewriteModuleStateme = (0, _helperModuleTransforms.rewriteModuleStatementsAndPrepareHeader)(path, {
            loose: loose,
            strict: strict,
            strictMode: strictMode,
            allowTopLevelThis: allowTopLevelThis,
            noInterop: noInterop
          }),
              meta = _rewriteModuleStateme.meta,
              headers = _rewriteModuleStateme.headers;

          var amdArgs = [];
          var importNames = [];

          if ((0, _helperModuleTransforms.hasExports)(meta)) {
            amdArgs.push(_core.types.stringLiteral("exports"));
            importNames.push(_core.types.identifier(meta.exportName));
          }

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = meta.source[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var _step$value = _slicedToArray(_step.value, 2),
                  source = _step$value[0],
                  metadata = _step$value[1];

              amdArgs.push(_core.types.stringLiteral(source));
              importNames.push(_core.types.identifier(metadata.name));

              if (!(0, _helperModuleTransforms.isSideEffectImport)(metadata)) {
                var interop = (0, _helperModuleTransforms.wrapInterop)(path, _core.types.identifier(metadata.name), metadata.interop);

                if (interop) {
                  var header = _core.types.expressionStatement(_core.types.assignmentExpression("=", _core.types.identifier(metadata.name), interop));

                  header.loc = metadata.loc;
                  headers.push(header);
                }
              }

              headers.push.apply(headers, _toConsumableArray((0, _helperModuleTransforms.buildNamespaceInitStatements)(meta, metadata, loose)));
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          (0, _helperModuleTransforms.ensureStatementsHoisted)(headers);
          path.unshiftContainer("body", headers);
          var _path$node = path.node,
              body = _path$node.body,
              directives = _path$node.directives;
          path.node.directives = [];
          path.node.body = [];
          var amdWrapper = path.pushContainer("body", [buildWrapper({
            MODULE_NAME: moduleName,
            AMD_ARGUMENTS: _core.types.arrayExpression(amdArgs),
            IMPORT_NAMES: importNames
          })])[0];
          var amdFactory = amdWrapper.get("expression.arguments").filter(function (arg) {
            return arg.isFunctionExpression();
          })[0].get("body");
          amdFactory.pushContainer("directives", directives);
          amdFactory.pushContainer("body", body);
        }
      }
    }
  };
}
