(function(global) {
  'use strict';

  var VERSION = 1;
  var MIN_ROTATION_MS = 3 * 60 * 60 * 1000;
  var MAX_ROTATION_MS = 6 * 60 * 60 * 1000;
  var CLOCK_SKEW_MS = 5 * 60 * 1000;
  var RECORD_KEY = 'jpgsantos-style-rotation-v1';
  var LEGACY_STYLE_KEY = 'style';
  var PROBE_KEY = 'jpgsantos-style-storage-probe';
  var memory = {};

  function storageCandidate(name) {
    try {
      var candidate = global[name];
      if (!candidate) return null;
      candidate.setItem(PROBE_KEY, '1');
      candidate.removeItem(PROBE_KEY);
      return candidate;
    } catch (error) {
      return null;
    }
  }

  var storage = storageCandidate('localStorage') || storageCandidate('sessionStorage');

  function read(key) {
    if (storage) {
      try {
        var storedValue = storage.getItem(key);
        if (storedValue !== null) memory[key] = storedValue;
        return storedValue;
      } catch (error) {
        storage = null;
      }
    }
    return Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : null;
  }

  function write(key, value) {
    var serialized = String(value);
    memory[key] = serialized;
    if (!storage) return;
    try {
      storage.setItem(key, serialized);
    } catch (error) {
      storage = null;
    }
  }

  function normalizeStyles(styles, fallback) {
    var normalized = [];
    (Array.isArray(styles) ? styles : []).forEach(function(style) {
      if (typeof style !== 'string' || !style || normalized.indexOf(style) !== -1) return;
      normalized.push(style);
    });
    if (normalized.length > 0) return normalized;
    return [typeof fallback === 'string' && fallback ? fallback : 'default'];
  }

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function differentStyle(styles, current) {
    var alternatives = styles.filter(function(style) { return style !== current; });
    return alternatives.length > 0 ? randomItem(alternatives) : current;
  }

  function randomDelay() {
    return MIN_ROTATION_MS + Math.floor(Math.random() * (MAX_ROTATION_MS - MIN_ROTATION_MS + 1));
  }

  function newRecord(current, styles, now) {
    return {
      version: VERSION,
      current: current,
      next: differentStyle(styles, current),
      assignedAt: now,
      rotateAt: now + randomDelay(),
      lastVisitAt: now
    };
  }

  function parseRecord(value) {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  }

  function validTimestamp(value) {
    return Number.isFinite(value) && Math.floor(value) === value;
  }

  function validRecord(record, styles, now) {
    if (!record || record.version !== VERSION) return false;
    if (styles.indexOf(record.current) === -1 || styles.indexOf(record.next) === -1) return false;
    if (styles.length > 1 && record.current === record.next) return false;
    if (!validTimestamp(record.assignedAt) || !validTimestamp(record.rotateAt)) return false;
    if (record.assignedAt > now + CLOCK_SKEW_MS) return false;
    var interval = record.rotateAt - record.assignedAt;
    return interval >= MIN_ROTATION_MS && interval <= MAX_ROTATION_MS;
  }

  function saveRecord(record) {
    write(RECORD_KEY, JSON.stringify(record));
    write(LEGACY_STYLE_KEY, record.current);
    return record;
  }

  function resolve(styles, fallback) {
    var available = normalizeStyles(styles, fallback);
    var fallbackStyle = available.indexOf(fallback) !== -1 ? fallback : available[0];
    var now = Date.now();
    var legacyStyle = read(LEGACY_STYLE_KEY);
    var record = parseRecord(read(RECORD_KEY));

    if (!validRecord(record, available, now)) {
      var initialStyle = available.indexOf(legacyStyle) !== -1 ? legacyStyle : randomItem(available);
      return saveRecord(newRecord(initialStyle || fallbackStyle, available, now)).current;
    }

    if (available.indexOf(legacyStyle) !== -1 && legacyStyle !== record.current) {
      return saveRecord(newRecord(legacyStyle, available, now)).current;
    }

    if (record.rotateAt <= now) {
      var promotedStyle = record.next !== record.current ? record.next : differentStyle(available, record.current);
      return saveRecord(newRecord(promotedStyle, available, now)).current;
    }

    record.lastVisitAt = now;
    return saveRecord(record).current;
  }

  function select(style, styles) {
    var available = normalizeStyles(styles, style);
    var selected = available.indexOf(style) !== -1 ? style : available[0];
    return saveRecord(newRecord(selected, available, Date.now())).current;
  }

  global.__siteStyleRotation = {
    resolve: resolve,
    select: select,
    recordKey: RECORD_KEY,
    minMs: MIN_ROTATION_MS,
    maxMs: MAX_ROTATION_MS
  };
})(window);
