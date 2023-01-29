"use strict";

/* eslint-disable */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _module = _interopRequireDefault(require("module"));

var _process = _interopRequireDefault(require("process"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let moduleIsBuiltinCache = null;
/**
 * Check if a module name is a built-in module.
 *
 * @param {string} name Module name.
 * @returns {boolean} Is built-in.
 */

function moduleIsBuiltin(name) {
  if (/^node:/.test(name)) {
    return true;
  }

  while (!moduleIsBuiltinCache) {
    // Node v9.3.0+
    const list = _module.default.builtinModules;

    if (list) {
      moduleIsBuiltinCache = new Set(list);
      break;
    } // Older versions:


    const natives = _process.default.binding('natives');

    if (natives) {
      const list = Object.keys(natives).filter(s => !/^internal\//.test(s));
      moduleIsBuiltinCache = new Set(list);
      break;
    }

    throw new Error('Cannot lookup builtin modules');
  }

  return moduleIsBuiltinCache.has(name);
}
/**
 * Stat path if exists.
 *
 * @param {string} path File path.
 * @returns {fs.Stats|null} Stat object or null.
 */


function pathStat(path) {
  try {
    // eslint-disable-next-line no-sync
    return _fs.default.statSync(path);
  } catch (err) {
    return null;
  }
}
/**
 * Read JSON from path.
 *
 * @param {string} path JSON path.
 * @returns {object|Array|string|number|boolean|null} JSON data.
 */


function readJson(path) {
  // eslint-disable-next-line no-sync
  return JSON.parse(_fs.default.readFileSync(path, 'utf8'));
}
/**
 * Read module package.json file.
 *
 * @param {string} moduleDir Module directory.
 * @returns {object} Contents of package.json file.
 */


function readPackageJson(moduleDir) {
  return readJson(_path.default.join(moduleDir, 'package.json'));
}
/**
 * Trim ./ from head of string.
 *
 * @param {string} path Path string.
 * @returns {string} Trimmed string.
 */


function trimDotSlash(path) {
  return path.replace(/^(\.\/)+/, '');
}
/**
 * Check if import path is a built-in module.
 *
 * @param {string} path Import path.
 * @returns {boolean} Is built-in.
 */


function importIsBuiltin(path) {
  return moduleIsBuiltin(path);
}
/**
 * Check if import path is a URL.
 *
 * @param {string} path Import path.
 * @returns {boolean} Is URL.
 */


function importIsUrl(path) {
  return /^[^/]+:\/\//.test(path);
}
/**
 * Check if import path is a file.
 *
 * @param {string} path Import path.
 * @returns {boolean} Is file.
 */


function importIsFile(path) {
  return path === '.' || path === '..' || /^\.?\.?\//.test(path);
}
/**
 * Parse bare imort path, namespace aware.
 *
 * @param {string} path Import path.
 * @returns {string} Object with package name and path.
 */


function importBareParse(path) {
  const ns = path.match(/^(@[^/]+\/[^/]+)([\s\S]*)$/);

  if (ns) {
    return {
      name: ns[1],
      path: ns[2]
    };
  }

  const pk = path.match(/^([^/]+)([\s\S]*)$/);

  if (pk) {
    return {
      name: pk[1],
      path: pk[2]
    };
  }

  return null;
}
/**
 * Expand extensions options into a list.
 *
 * @param {string|Array} e Extenions to be expanded.
 * @returns {object} List of sources and a destination.
 */


function expandExtensions(e) {
  let src = null;
  let dst = null;

  if (Array.isArray(e)) {
    const l = e.length;
    src = l ? e[0] : null;
    dst = l > 1 ? e[1] : null;
  } else {
    src = e;
  }

  const srcs = Array.isArray(src) ? src : [src];
  return {
    srcs,
    dst
  };
}
/**
 * Get module paths for a file.
 *
 * @param {string} file File path.
 * @returns {Array} Module paths.
 */


function modulePathsForFile(file) {
  // Node v12.2.0+:
  if (_module.default.createRequire) {
    return _module.default.createRequire(file).resolve.paths('');
  } // Node v10.12.0+:


  if (_module.default.createRequireFromPath) {
    return _module.default.createRequireFromPath(file).resolve.paths('');
  } // Older versions:


  return [].concat(_module.default._nodeModulePaths(_path.default.dirname(file)), _module.default.globalPaths);
}
/**
 * Resolve the named module director for a file.
 *
 * @param {string} name Module name.
 * @param {string} file File path.
 * @returns {string} Director path.
 */


function resolveModuleDir(name, file) {
  const paths = modulePathsForFile(file);

  for (const p of paths) {
    const full = _path.default.join(p, name);

    if (pathStat(full)) {
      return full;
    }
  }

  throw new Error(`Failed to resolve directory for module: ${name} in: ${file}`);
}
/**
 * Resolve extension for a path base.
 *
 * @param {string} base Path base.
 * @param {Array|string} extensions Extensions option.
 * @param {boolean} [expand=false] Should extensions be expanded.
 * @returns {string|null} Resolved extension.
 */


function resolveExtension(base, extensions, expand = false) {
  const stat = pathStat(base);
  const paths = [''];

  if (stat) {
    if (stat.isDirectory()) {
      paths.push('/index');
    } else {
      return '';
    }
  }

  for (const path of paths) {
    for (const extension of extensions) {
      const {
        srcs,
        dst
      } = expand ? expandExtensions(extension) : {
        srcs: [extension],
        dst: extension
      };

      for (const src of srcs) {
        const stat = pathStat(`${base}${path}${src}`);

        if (stat && !stat.isDirectory()) {
          return dst === null ? `${path}${src}` : `${path}${dst}`;
        }
      }
    }
  }

  return null;
}
/**
 * Visitor callback for declaration with path.
 *
 * @param {object} nodePath AST node.
 * @param {object} state AST state.
 */


function visitDeclarationPath(nodePath, state) {
  const {
    source
  } = nodePath.node;
  const src = source.value; // Parse options.

  const optsSource = (state.opts || {}).source;

  if (!optsSource) {
    return;
  }

  const extensions = optsSource.extensions || [];
  const ignoreUnresolved = optsSource.ignoreUnresolved || false; // Resolve the file base.

  const {
    filename
  } = state.file.opts;

  const resolveBase = _path.default.join(_path.default.dirname(filename), src); // Resolve from the base.

  const resolved = resolveExtension(resolveBase, extensions, true);

  if (resolved === null) {
    if (!ignoreUnresolved) {
      throw new Error(`Failed to resolve path: ${src} in: ${filename}`);
    }
  } else {
    source.value += resolved;
  }
}
/**
 * Visitor callback for declaration with bare import path.
 *
 * @param {object} nodePath AST node.
 * @param {object} state AST state.
 * @param {object} bareImport Bare import info object.
 */


function visitDeclarationBarePath(nodePath, state, bareImport) {
  const {
    source
  } = nodePath.node;
  const src = source.value; // Parse options.

  const optsSubmodule = (state.opts || {}).submodule;

  if (!optsSubmodule) {
    return;
  }

  const extensions = optsSubmodule.extensions || [];
  const ignoreUnresolved = optsSubmodule.ignoreUnresolved || false;
  const ignoreExports = optsSubmodule.ignoreExports || false; // Resolve the module base, or fail.

  const {
    filename
  } = state.file.opts;
  const moduleName = bareImport.name;
  const moduleDir = resolveModuleDir(moduleName, filename); // Optionally ignore modules that have exports.

  if (ignoreExports && 'exports' in readPackageJson(moduleDir)) {
    return;
  } // Resolve the file then resolve extension.


  const resolveBase = `${moduleDir}${bareImport.path}`;
  const resolved = resolveExtension(resolveBase, extensions);

  if (resolved === null) {
    if (!ignoreUnresolved) {
      throw new Error(`Failed to resolve module: ${src} in: ${filename}`);
    }
  } else {
    const {
      source
    } = nodePath.node;
    source.value += resolved;
  }
}
/**
 * Visitor callback for declaration with bare import main.
 *
 * @param {object} nodePath AST node.
 * @param {object} state AST state.
 * @param {object} bareImport Bare import info object.
 */


function visitDeclarationBareMain(nodePath, state, bareImport) {
  // Parse options.
  const optsModule = (state.opts || {}).module;

  if (!optsModule) {
    return;
  }

  const entry = optsModule.entry || [];
  const ignoreExports = optsModule.ignoreExports || false;

  if (!entry.length) {
    return;
  } // Resolve the module base, or fail.


  const {
    filename
  } = state.file.opts;
  const moduleName = bareImport.name;
  const moduleDir = resolveModuleDir(moduleName, filename); // Optionally ignore modules that have exports.

  let pkg = null;

  if (ignoreExports && 'exports' in (pkg = readPackageJson(moduleDir))) {
    return;
  } // Try different entry resolvers.


  for (const info of entry) {
    const entryType = info.type;
    let filePath = null;
    let extensions = []; // Handle the different types.

    switch (entryType) {
      case 'package.json':
        {
          pkg = pkg || readPackageJson(moduleDir);
          filePath = pkg ? pkg[info.field] : null;
          extensions = info.extensions || [];
          break;
        }

      case 'file':
        {
          filePath = info.path;
          extensions = info.extensions || [];
          break;
        }

      default:
        {
          throw new Error(`Unknown entry type: ${entryType}`);
        }
    } // Skip if empty path.


    if (!filePath) {
      continue;
    } // Resolve entry if possible.


    const resolveBase = _path.default.join(moduleDir, filePath);

    const resolved = resolveExtension(resolveBase, extensions);

    if (resolved === null) {
      continue;
    } // Update path and finish.


    const {
      source
    } = nodePath.node;
    source.value += `/${trimDotSlash(filePath)}${resolved}`;
    break;
  }
}
/**
 * Visitor callback for declarations.
 *
 * @param {object} nodePath AST node.
 * @param {object} state AST state.
 */


function visitDeclaration(nodePath, state) {
  const {
    source
  } = nodePath.node;

  if (!source) {
    return;
  } // Get source, check if needs resolving, and how.


  const src = source.value; // Ignore any URL imports.

  if (importIsUrl(src)) {
    return;
  } // Ignore any builin modules.


  if (importIsBuiltin(src)) {
    return;
  } // Check if file path.


  if (importIsFile(src)) {
    visitDeclarationPath(nodePath, state);
    return;
  } // Check if bare import (a module or submodule).


  const bareImport = importBareParse(src);

  if (bareImport) {
    if (bareImport.path) {
      visitDeclarationBarePath(nodePath, state, bareImport);
    } else {
      visitDeclarationBareMain(nodePath, state, bareImport);
    }

    return;
  }
}
/**
 * Babel plugin entry point.
 *
 * @returns {object} Plugin methods.
 */
// eslint-disable-next-line arrow-body-style, import/no-default-export


var _default = () => {
  return {
    visitor: {
      /**
       * Visitor callback for import declarations.
       *
       * @param {object} path AST node.
       * @param {object} state AST state.
       */
      ImportDeclaration(path, state) {
        visitDeclaration(path, state);
      },

      /**
       * Visitor callback for export all declarations.
       *
       * @param {object} path AST node.
       * @param {object} state AST state.
       */
      ExportAllDeclaration(path, state) {
        visitDeclaration(path, state);
      },

      /**
       * Visitor callback for export names declarations.
       *
       * @param {object} path AST node.
       * @param {object} state AST state.
       */
      ExportNamedDeclaration(path, state) {
        visitDeclaration(path, state);
      }

    }
  };
};

exports.default = _default;
//# sourceMappingURL=index.js.map
