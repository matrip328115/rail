/*!
 * Rail v1.0.1
 * Zero-dependency, data-aware chip rail for web apps.
 * https://github.com/matrip328115/rail
 * MIT License
 */
;(function(global, factory){
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else if (typeof define === 'function' && define.amd) define(factory);
  else global.Rail = factory();
})(typeof self !== 'undefined' ? self : this, function(){
  'use strict';

  var VERSION = '1.0.1';
  var STYLE_ID = 'rail-styles-v1';
  var RESERVED_ALL = '__ALL__';   // reserved value for the "All" chip
  var stylesInjected = false;

  /* =========================================================
     STYLE INJECTION
     ========================================================= */
  function injectStyles(){
    if (stylesInjected) return;
    if (typeof document === 'undefined') return;
    if (document.getElementById(STYLE_ID)){ stylesInjected = true; return; }
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = [
      '.rail-c{',
      '  --rc-bg:#111519;',
      '  --rc-bg-hover:#1E242C;',
      '  --rc-border:#232B34;',
      '  --rc-border-hover:#2F3945;',
      '  --rc-text:#8B98A8;',
      '  --rc-text-hover:#E9EEF4;',
      '  --rc-text-active:#C3F53C;',
      '  --rc-accent:#C3F53C;',
      '  --rc-accent-soft:rgba(195,245,60,.08);',
      '  --rc-accent-glow:rgba(195,245,60,.14);',
      '  --rc-accent-ring:rgba(195,245,60,.22);',
      '  --rc-accent-ink:#0F1400;',
      '  --rc-badge-bg:rgba(255,255,255,.04);',
      '  --rc-badge-text:#5E6B7A;',
      '  --rc-radius:10px;',
      '  --rc-gap:6px;',
      '  --rc-h:34px;',
      '  --rc-font:13px;',
      '  --rc-font-weight:600;',
      '  --rc-pad-x:11px;',
      '  display:flex;',
      '  gap:var(--rc-gap);',
      '  overflow-x:auto;',
      '  padding:2px 0;',
      '  scrollbar-width:none;',
      '  -ms-overflow-style:none;',
      '  scroll-behavior:smooth;',
      '}',
      '.rail-c::-webkit-scrollbar{display:none}',
      '.rail-c[data-size="sm"]{--rc-h:30px;--rc-font:12px;--rc-pad-x:9px}',
      '.rail-c[data-size="lg"]{--rc-h:40px;--rc-font:14px;--rc-pad-x:14px}',
      '.rail-c[data-dense="true"]{--rc-gap:4px}',

      '.rail-c__chip{',
      '  flex:none;',
      '  min-width:42px;',
      '  height:var(--rc-h);',
      '  padding:0 var(--rc-pad-x);',
      '  border-radius:var(--rc-radius);',
      '  border:1px solid var(--rc-border);',
      '  background:var(--rc-bg);',
      '  color:var(--rc-text);',
      '  font:inherit;',
      '  font-size:var(--rc-font);',
      '  font-weight:var(--rc-font-weight);',
      '  font-variant-numeric:tabular-nums;',
      '  display:inline-flex;',
      '  align-items:center;',
      '  justify-content:center;',
      '  gap:7px;',
      '  white-space:nowrap;',
      '  cursor:pointer;',
      '  user-select:none;',
      '  transition:border-color .15s, color .15s, background .15s, box-shadow .15s;',
      '  position:relative;',
      '  -webkit-tap-highlight-color:transparent;',
      '  outline:none;',
      '}',
      '.rail-c__chip:hover:not(.rail-c__chip--active):not(.rail-c__chip--disabled){',
      '  color:var(--rc-text-hover);',
      '  border-color:var(--rc-border-hover);',
      '  background:var(--rc-bg-hover);',
      '}',
      '.rail-c__chip--active{',
      '  color:var(--rc-text-active);',
      '  border-color:var(--rc-accent);',
      '  background:var(--rc-accent-soft);',
      '  box-shadow:0 0 0 1px var(--rc-accent);',
      '}',
      '.rail-c__chip:focus-visible{',
      '  box-shadow:0 0 0 3px var(--rc-accent-ring);',
      '}',
      '.rail-c__chip--active:focus-visible{',
      '  box-shadow:0 0 0 1px var(--rc-accent), 0 0 0 4px var(--rc-accent-ring);',
      '}',
      '.rail-c__chip--disabled{',
      '  opacity:.35;',
      '  pointer-events:none;',
      '}',

      '.rail-c__dot{',
      '  width:8px;height:8px;border-radius:3px;flex:none;',
      '  background:var(--rc-dot-color,#8B98A8);',
      '  box-shadow:0 0 8px -2px var(--rc-dot-color,transparent);',
      '}',
      '.rail-c__icon{font-size:1.05em;line-height:1;flex:none}',
      '.rail-c__label{overflow:hidden;text-overflow:ellipsis;max-width:200px}',
      '.rail-c__badge{',
      '  font-size:.75em;',
      '  color:var(--rc-badge-text);',
      '  font-weight:700;',
      '  padding:0 5px;',
      '  min-width:16px;',
      '  border-radius:5px;',
      '  background:var(--rc-badge-bg);',
      '  text-align:center;',
      '  line-height:1.4;',
      '}',
      '.rail-c__chip--active .rail-c__badge{',
      '  color:var(--rc-text-active);',
      '  background:var(--rc-accent-glow);',
      '}',

      '.rail-c__chip--skeleton{',
      '  width:60px;',
      '  background:linear-gradient(90deg,var(--rc-bg) 0%,var(--rc-bg-hover) 50%,var(--rc-bg) 100%);',
      '  background-size:200% 100%;',
      '  animation:rail-shimmer 1.4s ease-in-out infinite;',
      '  pointer-events:none;',
      '}',
      '@keyframes rail-shimmer{',
      '  0%{background-position:200% 0}',
      '  100%{background-position:-200% 0}',
      '}',

      '.rail-c__error{',
      '  padding:0 var(--rc-pad-x);',
      '  height:var(--rc-h);',
      '  display:inline-flex;',
      '  align-items:center;',
      '  font-size:12px;',
      '  color:#FF6B6B;',
      '  border:1px dashed #FF6B6B;',
      '  border-radius:var(--rc-radius);',
      '  background:rgba(255,107,107,.05);',
      '}',
      '.rail-c__empty{',
      '  padding:0 var(--rc-pad-x);',
      '  height:var(--rc-h);',
      '  display:inline-flex;',
      '  align-items:center;',
      '  font-size:12px;',
      '  color:var(--rc-badge-text);',
      '}'
    ].join('');
    document.head.appendChild(s);
    stylesInjected = true;
  }

  /* =========================================================
     HELPERS
     ========================================================= */
  function escapeHtml(v){
    return String(v == null ? '' : v).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function hashCode(str){
    var h = 0, s = String(str);
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  }

  function colorOf(v){
    return 'hsl(' + (hashCode(v) % 360) + ' 62% 62%)';
  }

  function getValue(obj, keyOrFn){
    if (typeof keyOrFn === 'function') return keyOrFn(obj);
    return obj == null ? undefined : obj[keyOrFn];
  }

  /* =========================================================
     RAIL CLASS
     ========================================================= */
  function Rail(opts){
    if (!(this instanceof Rail)) return new Rail(opts);
    this._init(opts || {});
  }

  Rail.prototype._init = function(opts){
    this.opts = {
      items:         opts.items || [],
      active:        opts.multiple
                       ? (Array.isArray(opts.active) ? opts.active.slice() : [])
                       : (opts.active != null ? opts.active : null),
      multiple:      !!opts.multiple,
      size:          opts.size || 'md',
      dense:         !!opts.dense,
      // NOTE: In multiple mode, "All" chip is disabled. To reset, use setActive([]).
      showAll:       opts.showAll !== false && !opts.multiple,
      allLabel:      opts.allLabel || 'All',
      accentColor:   opts.accentColor || null,
      colorize:      opts.colorize !== false,
      autoColorText: opts.autoColorText !== false,
      emptyMessage:  opts.emptyMessage || null,
      loadItems:     opts.loadItems || null,
      renderItem:    opts.renderItem || null,
      onSelect:      opts.onSelect || null,
      onDeselect:    opts.onDeselect || null,
      onClear:       opts.onClear || null
    };
    this._el = null;
    this._loading = false;
    this._error = null;
    this._destroyed = false;
    this._listeners = {};
  };

  /* ---------- lifecycle ---------- */
  Rail.prototype.mount = function(target){
    injectStyles();
    if (typeof target === 'string'){
      target = document.querySelector(target);
    }
    if (!target) throw new Error('Rail.mount: target not found');

    var el = document.createElement('div');
    el.className = 'rail-c';
    el.setAttribute('role', 'listbox');
    if (this.opts.multiple) el.setAttribute('aria-multiselectable', 'true');
    el.dataset.size = this.opts.size;
    if (this.opts.dense) el.dataset.dense = 'true';
    if (this.opts.accentColor){
      el.style.setProperty('--rc-accent', this.opts.accentColor);
    }

    var self = this;
    el.addEventListener('click', function(e){ self._handleClick(e); });
    el.addEventListener('keydown', function(e){ self._handleKeyDown(e); });

    target.innerHTML = '';
    target.appendChild(el);
    this._el = el;
    this._destroyed = false;

    if (this.opts.loadItems) this._loadAsync();
    else this._render();

    return this;
  };

  Rail.prototype.destroy = function(){
    this._destroyed = true;
    if (this._el && this._el.parentNode){
      this._el.parentNode.removeChild(this._el);
    }
    this._el = null;
    this._listeners = {};
    return this;
  };

  /* ---------- data API ---------- */
  Rail.prototype.setItems = function(items){
    if (this._destroyed) return this;
    this.opts.items = Array.isArray(items) ? items.slice() : [];
    this._loading = false;
    this._error = null;
    this._render();
    return this;
  };

  Rail.prototype.setActive = function(value){
    if (this._destroyed) return this;
    if (this.opts.multiple){
      this.opts.active = Array.isArray(value)
        ? value.slice()
        : (value == null ? [] : [value]);
    } else {
      this.opts.active = value == null ? null : value;
    }
    this._render();
    return this;
  };

  Rail.prototype.getActive = function(){
    return this.opts.multiple
      ? (Array.isArray(this.opts.active) ? this.opts.active.slice() : [])
      : this.opts.active;
  };

  Rail.prototype.setLoading = function(v){
    if (this._destroyed) return this;
    this._loading = !!v;
    this._error = null;
    this._render();
    return this;
  };

  Rail.prototype.setError = function(err){
    if (this._destroyed) return this;
    this._error = typeof err === 'string'
      ? err
      : (err && err.message) || 'Failed to load';
    this._loading = false;
    this._render();
    return this;
  };

  /* ---------- events ---------- */
  Rail.prototype.on = function(event, fn){
    (this._listeners[event] = this._listeners[event] || []).push(fn);
    return this;
  };

  Rail.prototype.off = function(event, fn){
    if (!this._listeners[event]) return this;
    this._listeners[event] = this._listeners[event].filter(function(f){ return f !== fn; });
    return this;
  };

  /* ---------- internals ---------- */
  Rail.prototype._emit = function(event){
    var args = Array.prototype.slice.call(arguments, 1);
    var fns = this._listeners[event] || [];
    for (var i = 0; i < fns.length; i++){
      try { fns[i].apply(null, args); }
      catch (e){ if (typeof console !== 'undefined') console.error(e); }
    }
  };

  Rail.prototype._fireOption = function(name, arg1, arg2){
    var fn = this.opts[name];
    if (!fn) return;
    try { fn.call(null, arg1, arg2); }
    catch (e){ if (typeof console !== 'undefined') console.error(e); }
  };

  Rail.prototype._loadAsync = function(){
    var self = this;
    this._loading = true;
    this._render();
    Promise.resolve()
      .then(function(){ return self.opts.loadItems(); })
      .then(function(items){
        if (self._destroyed) return;
        self.setItems(items || []);
      })
      .catch(function(err){
        if (self._destroyed) return;
        self.setError(err);
      });
  };

  Rail.prototype._isActive = function(item){
    var v = item.value;
    if (this.opts.multiple){
      var arr = this.opts.active || [];
      for (var i = 0; i < arr.length; i++){
        if (String(arr[i]) === String(v)) return true;
      }
      return false;
    }
    return this.opts.active !== null &&
           this.opts.active !== undefined &&
           String(this.opts.active) === String(v);
  };

  Rail.prototype._render = function(){
    if (!this._el) return;

    if (this._loading){
      var skeleton = '';
      for (var i = 0; i < 6; i++){
        skeleton += '<div class="rail-c__chip rail-c__chip--skeleton"></div>';
      }
      this._el.innerHTML = skeleton;
      return;
    }

    if (this._error){
      this._el.innerHTML =
        '<div class="rail-c__error">⚠ ' + escapeHtml(this._error) + '</div>';
      return;
    }

    var opts = this.opts;

    if (!opts.items.length && !opts.showAll){
      this._el.innerHTML = opts.emptyMessage
        ? '<div class="rail-c__empty">' + escapeHtml(opts.emptyMessage) + '</div>'
        : '';
      return;
    }

    var parts = [];

    if (opts.showAll){
      var isAll = (opts.active === null || opts.active === undefined);
      parts.push(
        '<button type="button" class="rail-c__chip' +
        (isAll ? ' rail-c__chip--active' : '') + '"' +
        ' role="option" aria-selected="' + isAll + '"' +
        ' data-rail-value="' + RESERVED_ALL + '">' +
        escapeHtml(opts.allLabel) + '</button>'
      );
    }

    for (var j = 0; j < opts.items.length; j++){
      var item = opts.items[j];
      var isActive = this._isActive(item);
      var disabledCls = item.disabled ? ' rail-c__chip--disabled' : '';
      var activeCls = isActive ? ' rail-c__chip--active' : '';
      var customCls = item.className ? ' ' + item.className : '';

      var inner;
      if (opts.renderItem){
        inner = opts.renderItem(item);
      } else {
        var dot = '';
        if (opts.colorize && item.color !== false){
          var dotColor = item.color ||
            (opts.autoColorText ? colorOf(item.value) : null);
          if (dotColor){
            dot = '<span class="rail-c__dot" style="--rc-dot-color:' +
                  dotColor + '"></span>';
          }
        }
        var icon = item.icon
          ? '<span class="rail-c__icon">' + escapeHtml(item.icon) + '</span>'
          : '';
        var labelText = (item.label != null) ? item.label : item.value;
        var badge = (item.count != null)
          ? '<span class="rail-c__badge">' + item.count + '</span>'
          : '';
        inner = dot + icon +
                '<span class="rail-c__label">' + escapeHtml(labelText) + '</span>' +
                badge;
      }

      parts.push(
        '<button type="button" class="rail-c__chip' + activeCls + disabledCls + customCls + '"' +
        ' role="option" aria-selected="' + isActive + '"' +
        ' data-rail-value="' + escapeHtml(item.value) + '"' +
        ' data-rail-idx="' + j + '">' +
        inner + '</button>'
      );
    }

    this._el.innerHTML = parts.join('');
  };

  Rail.prototype._handleClick = function(e){
    var chip = e.target.closest('[data-rail-value]');
    if (!chip || chip.classList.contains('rail-c__chip--disabled')) return;
    var value = chip.dataset.railValue;

    if (value === RESERVED_ALL){
      this.opts.active = this.opts.multiple ? [] : null;
      this._render();
      this._emit('clear', this);
      this._fireOption('onClear', this);
      return;
    }

    var idx = (chip.dataset.railIdx != null)
      ? Number(chip.dataset.railIdx)
      : -1;
    var item = (idx >= 0 && this.opts.items[idx]) || { value: value };

    if (this.opts.multiple){
      var arr = Array.isArray(this.opts.active) ? this.opts.active.slice() : [];
      var pos = -1;
      for (var i = 0; i < arr.length; i++){
        if (String(arr[i]) === String(value)){ pos = i; break; }
      }
      if (pos === -1){
        arr.push(value);
        this.opts.active = arr;
        this._render();
        this._emit('select', item, this);
        this._fireOption('onSelect', item, this);
      } else {
        arr.splice(pos, 1);
        this.opts.active = arr;
        this._render();
        this._emit('deselect', item, this);
        this._fireOption('onDeselect', item, this);
      }
    } else {
      if (this.opts.active !== null &&
          String(this.opts.active) === String(value)){
        this.opts.active = null;
        this._render();
        this._emit('clear', this);
        this._fireOption('onClear', this);
      } else {
        this.opts.active = value;
        this._render();
        this._emit('select', item, this);
        this._fireOption('onSelect', item, this);
      }
    }
  };

  Rail.prototype._handleKeyDown = function(e){
    if (!this._el) return;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
      e.preventDefault();
      var chips = Array.prototype.slice.call(
        this._el.querySelectorAll('[data-rail-value]')
      );
      if (!chips.length) return;
      var current = chips.indexOf(document.activeElement);
      var next = (e.key === 'ArrowRight')
        ? current + 1
        : current - 1;
      if (current === -1) next = 0;
      if (next < 0) next = 0;
      if (next >= chips.length) next = chips.length - 1;
      chips[next].focus();
      return;
    }

    if (e.key === 'Home' || e.key === 'End'){
      e.preventDefault();
      var chips2 = this._el.querySelectorAll('[data-rail-value]');
      if (!chips2.length) return;
      (e.key === 'Home' ? chips2[0] : chips2[chips2.length - 1]).focus();
      return;
    }

    if (e.key === 'Enter' || e.key === ' '){
      var active = document.activeElement;
      if (active && active.dataset && active.dataset.railValue){
        e.preventDefault();
        active.click();
      }
    }
  };

  /* =========================================================
     PUBLIC API
     ========================================================= */
  return {
    version: VERSION,

    create: function(opts){
      return new Rail(opts);
    },

    fromData: function(config){
      config = config || {};
      var data = config.data || [];
      var key = config.key;
      var label = config.label;
      var sort = config.sort;
      var filterEmpty = config.filterEmpty !== false;

      if (!key) throw new Error('Rail.fromData: "key" is required');

      var map = new Map();
      for (var i = 0; i < data.length; i++){
        var row = data[i];
        var rawKey = getValue(row, key);
        if (filterEmpty &&
            (rawKey === undefined || rawKey === null || rawKey === '')){
          continue;
        }
        var k = String(rawKey);
        if (!map.has(k)){
          map.set(k, {
            value: k,
            label: label ? getValue(row, label) : rawKey,
            count: 0
          });
        }
        map.get(k).count++;
      }

      var items = [];
      map.forEach(function(v){ items.push(v); });

      if (typeof sort === 'function'){
        items.sort(sort);
      } else if (sort === 'count'){
        items.sort(function(a,b){ return b.count - a.count; });
      } else if (sort === 'desc'){
        items.sort(function(a,b){
          return String(b.value).localeCompare(String(a.value));
        });
      } else {
        items.sort(function(a,b){
          return String(a.value).localeCompare(String(b.value));
        });
      }

      return items;
    },

    colorOf: colorOf
  };
});
