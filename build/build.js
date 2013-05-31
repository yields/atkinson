
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
  }

  if (require.aliases.hasOwnProperty(index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-type/index.js", Function("exports, require, module",
"\n/**\n * toString ref.\n */\n\nvar toString = Object.prototype.toString;\n\n/**\n * Return the type of `val`.\n *\n * @param {Mixed} val\n * @return {String}\n * @api public\n */\n\nmodule.exports = function(val){\n  switch (toString.call(val)) {\n    case '[object Function]': return 'function';\n    case '[object Date]': return 'date';\n    case '[object RegExp]': return 'regexp';\n    case '[object Arguments]': return 'arguments';\n    case '[object Array]': return 'array';\n    case '[object String]': return 'string';\n  }\n\n  if (val === null) return 'null';\n  if (val === undefined) return 'undefined';\n  if (val && val.nodeType === 1) return 'element';\n  if (val === Object(val)) return 'object';\n\n  return typeof val;\n};\n//@ sourceURL=component-type/index.js"
));
require.register("component-value/index.js", Function("exports, require, module",
"\n/**\n * Module dependencies.\n */\n\nvar typeOf = require('type');\n\n/**\n * Set or get `el`'s' value.\n *\n * @param {Element} el\n * @param {Mixed} val\n * @return {Mixed}\n * @api public\n */\n\nmodule.exports = function(el, val){\n  if (2 == arguments.length) return set(el, val);\n  return get(el);\n};\n\n/**\n * Get `el`'s value.\n */\n\nfunction get(el) {\n  switch (type(el)) {\n    case 'checkbox':\n    case 'radio':\n      if (el.checked) {\n        var attr = el.getAttribute('value');\n        return null == attr ? true : attr;\n      } else {\n        return false;\n      }\n    case 'radiogroup':\n      for (var i = 0, radio; radio = el[i]; i++) {\n        if (radio.checked) return radio.value;\n      }\n      break;\n    case 'select':\n      for (var i = 0, option; option = el.options[i]; i++) {\n        if (option.selected) return option.value;\n      }\n      break;\n    default:\n      return el.value;\n  }\n}\n\n/**\n * Set `el`'s value.\n */\n\nfunction set(el, val) {\n  switch (type(el)) {\n    case 'checkbox':\n    case 'radio':\n      if (val) {\n        el.checked = true;\n      } else {\n        el.checked = false;\n      }\n      break;\n    case 'radiogroup':\n      for (var i = 0, radio; radio = el[i]; i++) {\n        radio.checked = radio.value === val;\n      }\n      break;\n    case 'select':\n      for (var i = 0, option; option = el.options[i]; i++) {\n        option.selected = option.value === val;\n      }\n      break;\n    default:\n      el.value = val;\n  }\n}\n\n/**\n * Element type.\n */\n\nfunction type(el) {\n  var group = 'array' == typeOf(el) || 'object' == typeOf(el);\n  if (group) el = el[0];\n  var name = el.nodeName.toLowerCase();\n  var type = el.getAttribute('type');\n\n  if (group && type && 'radio' == type.toLowerCase()) return 'radiogroup';\n  if ('input' == name && type && 'checkbox' == type.toLowerCase()) return 'checkbox';\n  if ('input' == name && type && 'radio' == type.toLowerCase()) return 'radio';\n  if ('select' == name) return 'select';\n  return name;\n}\n//@ sourceURL=component-value/index.js"
));
require.register("yields-unserialize/index.js", Function("exports, require, module",
"\n/**\n * Unserialize the given \"stringified\" javascript.\n * \n * @param {String} val\n * @return {Mixed}\n */\n\nmodule.exports = function(val){\n  try {\n    return JSON.parse(val);\n  } catch (e) {\n    return val || undefined;\n  }\n};\n//@ sourceURL=yields-unserialize/index.js"
));
require.register("atkinson/index.js", Function("exports, require, module",
"\n/**\n * dependencies\n */\n\nvar unserialize = require('unserialize')\n  , value = require('value');\n\n/**\n * default storage.\n */\n\nAtkinson.store = window.localStorage || {};\n\n/**\n * selector.\n */\n\nAtkinson.selector = 'input' + ([\n  ':not([type=\"submit\"])',\n  ':not([type=\"image\"])',\n  ':not([type=\"password\"])',\n  ':not([type=\"hidden\"])',\n  ':not([disabled])',\n  ', select, textarea'\n]).join('');\n\n/**\n * export `Atkinson`\n */\n\nmodule.exports = Atkinson;\n\n/**\n * initialize new `Atkinson` with the given `el`.\n *\n * @param {String} prefix\n * @param {HTMLFormElement} el\n */\n\nfunction Atkinson(prefix, el){\n  this.selector = Atkinson.selector;\n  this.store = Atkinson.store;\n  if (!el) el = prefix, prefix = el.id;\n  this.prefix = prefix;\n  this.el = el;\n}\n\n/**\n * remember all input values.\n *\n * Atkinson will store them in localStorage,\n * you may call `recall` on page load in order\n * for Atkinson to fill all inputs automatically.\n *\n * @return {Atkinson}\n */\n\nAtkinson.prototype.save = function(){\n  var all = this.el.querySelectorAll(this.selector)\n    , len = all.length\n    , store = this.store\n    , key, val;\n\n  for (var i = 0; i < len; ++i) {\n    key = this.prefix + ':' + i + ':' + all[i].name;\n    val = JSON.stringify(value(all[i]));\n    store[key] = val;\n  }\n\n  return this;\n};\n\n/**\n * recall all remembered data.\n *\n * the method fills the form fields automatically,\n * with the remembered values.\n *\n * @return {Atkinson}\n */\n\nAtkinson.prototype.restore = function(){\n  var all = this.el.querySelectorAll(this.selector)\n    , len = all.length\n    , store = this.store\n    , key, val\n    , type;\n\n  for (var i = 0; i < len; ++i) {\n    key = this.prefix + ':' + i + ':' + all[i].name;\n    val = unserialize(store[key]);\n    if (null == val) continue;\n    value(all[i], val);\n  }\n\n  return this;\n};\n\n/**\n * forget all remembered data.\n *\n * the method will be called automatically\n * when the form is submitted to the server.\n *\n * @return {Atkinson}\n */\n\nAtkinson.prototype.clean = function(){\n  var all = this.el.querySelectorAll(this.selector)\n    , len = all.length\n    , store = this.store\n    , key, val;\n\n  for (var i = 0; i < len; ++i) {\n    key = this.prefix + ':' + i + ':' + all[i].name;\n    val = store[key];\n    if (!val) continue;\n    delete store[key];\n  }\n\n  return this;\n};\n//@ sourceURL=atkinson/index.js"
));
require.alias("component-value/index.js", "atkinson/deps/value/index.js");
require.alias("component-value/index.js", "atkinson/deps/value/index.js");
require.alias("component-value/index.js", "value/index.js");
require.alias("component-type/index.js", "component-value/deps/type/index.js");

require.alias("component-value/index.js", "component-value/index.js");

require.alias("yields-unserialize/index.js", "atkinson/deps/unserialize/index.js");
require.alias("yields-unserialize/index.js", "unserialize/index.js");

