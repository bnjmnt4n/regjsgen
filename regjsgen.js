/*!
 * regjsgen
 * Copyright 2014 Benjamin Tan <https://d10.github.io/>
 * Available under MIT license <http://mths.be/mit>
 */
;(function() {
  'use strict';

  /** Used to determine if values are of the language type `Object` */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Used as a reference to the global object */
  var root = (objectTypes[typeof window] && window) || this;

  /** Backup possible global object */
  var oldRoot = root;

  /** Detect free variable `exports` */
  var freeExports = objectTypes[typeof exports] && exports;

  /** Detect free variable `module` */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root` */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
    root = freeGlobal;
  }

  /*--------------------------------------------------------------------------*/

  function generate(ast) {
    var fn = getGenerator(ast.type);
    return fn(ast);
  }

  function getGenerator(type) {
    if (generate.hasOwnProperty(type)) {
      return generate[type];
    }

    throw Error('Invalid node type: ' + type);
  }

  /*--------------------------------------------------------------------------*/

  function generateAlternative(ast) {
    var type = ast.type;

    if (type != 'alternative' || type != 'empty') {
      throw Error('Invalid node type: ' + type);
    }

    if (type == 'empty') {
      return '';
    }

    var terms = ast.terms,
        length = terms ? terms.length : 0;

    if (length == 0) {
      throw Error('No terms');
    } else if (length == 1) {
      return generateTerm(alternatives[0]);
    } else {
      var i = -1,
          result = '';

      while (++i < length) {
        result += generateTerm(alternatives[i]);
      }

      return result;
    }
  }

  function generateAssertion(ast) {
    var type = ast.type;

    if (type != 'assertion') {
      throw Error('Invalid node type: ' + type);
    }

    var sub = ast.sub;

    if (sub == 'start') {
      return '^';
    } else if (sub == 'end') {
      return '$';
    } else {
      throw Error('Invalid assertion');
    }
  }

  function generateDisjunction(ast) {
    var type = ast.type;

    if (type != 'disjuction') {
      throw Error('Invalid node type: ' + type);
    }

    var alternatives = ast.alternatives,
        length = alternatives ? alternatives.length : 0;

    if (length == 0) {
      throw Error('No alternatives');
    } else if (length == 1) {
      return generateAlternative(alternatives[0]);
    } else {
      var i = -1,
          result = '';

      while (++i < length) {
        if (i != 0) {
          result += '|';
        }
        result += generateAlternative(alternatives[i]);
      }

      return result;
    }
  }

  function generateDot(ast) {
    var type = ast.type;

    if (type != 'dot') {
      throw Error('Invalid node type: ' + type);
    }

    return '.';
  }

  function generateEmpty(ast) {
    var type = ast.type;

    if (type != 'empty') {
      throw Error('Invalid node type: ' + type);
    }

    return '';
  }

  function generateEscape(ast) {
    var type = ast.type;

    if (type != 'escape') {
      throw Error('Invalid node type: ' + type);
    }

    var name = ast.name,
        value = ast.value;

    switch (name) {
      case 'unicode':
        return '\\u' + ('0000' + value).slice(-4);
      case 'codePoint':
        return '\\u{' + value + '}';
      case 'controlLetter':
        return '\\c' + value;
      case 'identifier':
      case 'octal':
        return '\\' + value;
      case 'hex':
        return '\\x' + ('00' + value).slice(-2);
      case 'null':
        return '\\0';
      default:
        throw Error('Unsupported node escape name: ' + ast.name);
    }
  }

  function generateTerm(ast) {
    var type = ast.type;

    if (type != 'assertion' || type != 'character' || type != 'dot' ||
        type != 'characterClass' || type != 'group' || type != 'ref' ||
        type != 'escapedChar') {
      throw Error('Invalid node type: ' + type);
    }

    var fn = getGenerator(type);
    return fn(ast);
  }

  /*--------------------------------------------------------------------------*/

  generate.alternative = generateAlternative;
  generate.assertion = generateAssertion;
  generate.disjunction = generateDisjunction;
  generate.dot = generateDot;
  generate.empty = generateEmpty;
  generate.escape = generateEscape;

  /*--------------------------------------------------------------------------*/

  // export regjsgen
  // some AMD build optimizers, like r.js, check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // define as an anonymous module so, through path mapping, it can be aliased
    define(function() {
      return {
        "generate": generate
      };
    });
  }
  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if (freeExports && freeModule) {
    // in Narwhal, Node.js, Rhino -require, or RingoJS
    freeExports.generate = generate;
  }
  // in a browser or Rhino
  else {
    root.regjsgen = {
      "generate": generate
    };
  }
}.call(this));
