
/**
 * default storage.
 */

Atkinson.store = window.localStorage || {};

/**
 * selector.
 */

Atkinson.selector = 'input' + ([
  ':not([type^="submit"])',
  ':not([type^="image"])',
  ':not([type^="password"])',
  ':not([type^="hidden"])',
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
    key = this.prefix + ':' + all[i].name;
    val = get(all[i]);
    if (undefined === val) continue;
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
    , key, val;

  for (var i = 0; i < len; ++i) {
    key = this.prefix + ':' + all[i].name;
    val = store[key];
    if (!val) continue;
    set(all[i], store[key]);
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
    key = this.prefix + ':' + all[i].name;
    val = store[key];
    if (!val) continue;
    delete store[key];
  }

  return this;
};

/**
 * set el to val.
 * 
 * @param {Element} el
 * @param {Mixed} val
 */

function set(el, val){
  if ('select' == el.tagName.toLowerCase()) {
    select(el, val.split(','));
  } else if ('checkbox' == el.type) {
    el.checked = 'true' == val;
  } else if ('radio' == el.type) {
    el.checked = val == el.value;
  } else {
    el.value = val;
  }
}

/**
 * get el value.
 * 
 * @param {Element} el
 * @return {Mixed}
 */

function get(el){
  if ('select' == el.tagName.toLowerCase()) {
    return selected(el);
  } else if ('checkbox' == el.type) {
    return el.checked;
  } else if ('radio' == el.type) {
    if (!el.checked) return;
    return el.value;
  } else {
    return el.value;
  }
}

/**
 * select array of options.
 * 
 * @param {Element} el
 * @param {Array} values
 */

function select(el, vals){
  var all = el.options
    , len = vals.length;

  for (var i = 0; i < len; ++i) {
    all[vals[i]].selected = true;
  }
}

/**
 * get selected options as array.
 * 
 * @param {Element} el
 * @return {Array}
 */

function selected(el){
  var all = el.options
    , len = all.length
    , ret = [];

  for (var i = 0; i < len; ++i) {
    if (all[i].selected) ret.push(i);
  }

  return ret;
}
