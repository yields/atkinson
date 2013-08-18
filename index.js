
/**
 * dependencies
 */

var unserialize = require('unserialize')
  , value = require('value');

/**
 * Export `store`.
 */

Atkinson.store = window.localStorage || {};

/**
 * Export `selector`.
 */

Atkinson.selector = 'input' + ([
  ':not([type="submit"])',
  ':not([type="image"])',
  ':not([type="password"])',
  ':not([type="hidden"])',
  ':not([disabled])',
  ', select, textarea'
]).join('');

/**
 * Export `adapter`.
 */

Atkinson.adapter = value;

/**
 * export `Atkinson`
 */

module.exports = Atkinson;

/**
 * initialize new `Atkinson` with the given `el`.
 *
 * @param {String} prefix
 * @param {HTMLFormElement} el
 */

function Atkinson(prefix, el){
  this.selector = Atkinson.selector;
  this.store = Atkinson.store;
  if (!el) el = prefix, prefix = el.action;
  this.value = Atkinson.adapter;
  this.prefix = prefix;
  this.el = el;
}

/**
 * Remember all input values.
 *
 * @return {Atkinson}
 * @api public
 */

Atkinson.prototype.save = function(){
  var all = this.el.querySelectorAll(this.selector)
    , len = all.length
    , store = this.store
    , key, val;

  for (var i = 0; i < len; ++i) {
    key = this.prefix + ':' + i + ':' + all[i].name;
    val = JSON.stringify(this.value(all[i]));
    store[key] = val;
  }

  return this;
};

/**
 * Restore all stored data to the form.
 *
 * @return {Atkinson}
 * @api public
 */

Atkinson.prototype.restore = function(){
  var all = this.el.querySelectorAll(this.selector)
    , len = all.length
    , store = this.store
    , key, val
    , type;

  for (var i = 0; i < len; ++i) {
    key = this.prefix + ':' + i + ':' + all[i].name;
    val = unserialize(store[key]);
    if (null == val) continue;
    this.value(all[i], val);
  }

  return this;
};

/**
 * Clear all stored data.
 *
 * @return {Atkinson}
 * @api public
 */

Atkinson.prototype.clear =
Atkinson.prototype.clean = function(){
  var all = this.el.querySelectorAll(this.selector)
    , len = all.length
    , store = this.store
    , key, val;

  for (var i = 0; i < len; ++i) {
    key = this.prefix + ':' + i + ':' + all[i].name;
    val = store[key];
    if (!val) continue;
    delete store[key];
  }

  return this;
};
