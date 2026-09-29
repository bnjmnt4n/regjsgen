var assert = require('assert');
var Module = require('module');
var path = require('path');

var filename = path.join(__dirname, '..', 'regjsgen.js');
var realGlobal = global;

// Loads a fresh copy of `regjsgen.js` through the module system (so that
// coverage instrumentation still applies), with the given `exports` object.
function load(exports) {
  var mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  if (exports) {
    mod.exports = exports;
  }
  mod.load(filename);
  return mod;
}

// Temporarily sets properties on the global object while running `callback`.
function withGlobals(values, callback) {
  var names = Object.keys(values),
      saved = {};

  names.forEach(function(name) {
    saved[name] = Object.getOwnPropertyDescriptor(realGlobal, name);
    realGlobal[name] = values[name];
  });

  try {
    return callback();
  } finally {
    names.forEach(function(name) {
      if (saved[name]) {
        Object.defineProperty(realGlobal, name, saved[name]);
      } else {
        delete realGlobal[name];
      }
    });
  }
}

function assertIsRegjsgen(regjsgen) {
  assert.ok(regjsgen, 'regjsgen should be exported');
  assert.strictEqual(typeof regjsgen.generate, 'function');
  assert.strictEqual(regjsgen.generate({ 'type': 'dot' }), '.');
}

function test(description, callback) {
  callback();
  console.log('PASSED TEST: %s', description);
}

// Marking `exports` and `module` as DOM nodes disables CommonJS detection.
function domNodeExports() {
  return { 'nodeType': 1 };
}

// Returns a no-op AMD `define`, used to make the module export to its root.
function defineAmd() {
  function define() {}
  define.amd = {};
  return define;
}

/*--------------------------------------------------------------------------*/

test('exports `generate` via CommonJS', function() {
  var mod = load();
  assertIsRegjsgen(mod.exports);
  assert.strictEqual(realGlobal.regjsgen, undefined);
});

test('defines an anonymous AMD module', function() {
  var factory;
  function define(fn) {
    factory = fn;
  }
  define.amd = {};

  withGlobals({ 'define': define }, function() {
    var mod = load();
    assert.strictEqual(typeof factory, 'function');
    assertIsRegjsgen(factory());
    // The global object is also assigned to when using AMD.
    assert.strictEqual(realGlobal.regjsgen, factory());
    // CommonJS exports are skipped when AMD is detected.
    assert.strictEqual(mod.exports.generate, undefined);
    delete realGlobal.regjsgen;
  });
});

test('ignores `define` without `define.amd`', function() {
  var called = false;
  function define() {
    called = true;
  }

  withGlobals({ 'define': define }, function() {
    var mod = load();
    assert.strictEqual(called, false);
    assertIsRegjsgen(mod.exports);
  });
});

test('ignores `define` with a falsy `define.amd`', function() {
  var called = false;
  function define() {
    called = true;
  }
  define.amd = null;

  withGlobals({ 'define': define }, function() {
    var mod = load();
    assert.strictEqual(called, false);
    assertIsRegjsgen(mod.exports);
  });
});

test('exports to `this` when CommonJS is unavailable', function() {
  var exports = domNodeExports();
  load(exports);
  assertIsRegjsgen(exports.regjsgen);
  assert.strictEqual(exports.generate, undefined);
});

test('exports to `window` when available', function() {
  var window = {};
  withGlobals({ 'window': window }, function() {
    load(domNodeExports());
  });
  assertIsRegjsgen(window.regjsgen);
});

test('exports to a `global` that references itself via `window`', function() {
  var fakeGlobal = {};
  fakeGlobal.window = fakeGlobal;

  var exports = withGlobals({ 'global': fakeGlobal, 'define': defineAmd() }, function() {
    return load().exports;
  });
  assertIsRegjsgen(fakeGlobal.regjsgen);
  assert.strictEqual(exports.regjsgen, undefined);
});

test('exports to a `global` that references itself via `self`', function() {
  var fakeGlobal = {};
  fakeGlobal.self = fakeGlobal;

  withGlobals({ 'global': fakeGlobal, 'define': defineAmd() }, function() {
    load();
  });
  assertIsRegjsgen(fakeGlobal.regjsgen);
});

test('ignores a `global` that does not reference itself', function() {
  var fakeGlobal = {};

  var exports = withGlobals({ 'global': fakeGlobal, 'define': defineAmd() }, function() {
    return load().exports;
  });
  assert.strictEqual(fakeGlobal.regjsgen, undefined);
  assertIsRegjsgen(exports.regjsgen);
});
