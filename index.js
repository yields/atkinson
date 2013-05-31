
/**
 * dependencies
 */

var unserialize = require('unserialize')
  , value = require('value');

/**
 * default storage.
 */

Atkinson.store = window.localStorage || {};

/**
 * selector.
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
  if (!el) el = prefix, prefix = el.id;
  this.prefix = prefix;
  this.el = el;
}

/**
 * remember all input values.
 *
 * Atkinson will store them in localStorage,
 * you may call `recall` on page load in order
 * for Atkinson to fill all inputs automatically.
 *
 * @return {Atkinson}
 */

Atkinson.prototype.save = function(){
  var all = this.el.querySelectorAll(this.selector)
    , len = all.length
    , store = this.store
    , key, val;

  for (var i = 0; i < len; ++i) {
    key = this.prefix + ':' + i + ':' + all[i].name;
    val = JSON.stringify(value(all[i]));
    store[key] = val;
  }

  return this;
};

/**
 * recall all remembered data.
 *
 * the method fills the form fields automatically,
 * with the remembered values.
 *
 * @return {Atkinson}
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
    value(all[i], val);
  }

  return this;
};

/**
 * forget all remembered data.
 *
 * the method will be called automatically
 * when the form is submitted to the server.
 *
 * @return {Atkinson}
 */

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
