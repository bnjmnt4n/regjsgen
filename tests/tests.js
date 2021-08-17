var generate = require('../regjsgen').generate;
var parse = require('regjsparser').parse;
var astNodesAreEquivalent = require('./equiv');

function runTests(data, options) {
  options || (options = {});
  var excused = options.excused || [],
      flags = options.flags || '',
      features = options.features || {};

  var keys = Object.keys(data).filter(function(name) {
    return data[name].type != 'error' && excused.indexOf(name) == -1;
  });

  keys.forEach(function(regex) {
    var node = data[regex],
        expected = JSON.stringify(regex),
        generated,
        passed,
        stack;

    // Ensure that the generated regex matches the original input.
    try {
      generated = JSON.stringify(generate(node));
      passed = generated == expected;
    } catch (error) {
      stack = error.stack;
      generated = JSON.stringify({
        'name': error.name,
        'message': error.message,
        'input': regex
      });
    }

    if (passed) {
      console.log('PASSED TEST: %s', expected);
      return;
    }

    // If the generated regex does not match the original input, the output
    // could be identical to the original input in terms of the AST.
    // eg. `a{1,}` generates the same AST nodes as `a+`.
    // Compare the ASTs of the generated regex and the input regex.
    try {
      passed = astNodesAreEquivalent(
        parse(regex, flags, features),
        parse(generate(node), flags, features)
      );
    } catch (error) {
      stack = error.stack;
      generated = JSON.stringify({
        'name': error.name,
        'message': error.message,
        'input': regex
      });
    }

    if (!passed) {
      console.error(
        [
          'FAILED TEST: %s',
          'Generated: %s',
          'Input AST: %s'
        ].join('\n'),
        JSON.stringify(regex),
        generated,
        JSON.stringify(node)
      );
      if (stack) {
        console.error(stack);
      }
      process.exit(1);
    } else {
      console.log('PASSED TEST: %s', expected);
    }
  });
};

runTests(require('./test-data.json'));
runTests(require('./test-data-nonstandard.json'));
runTests(require('./test-data-unicode.json'), { 'flags': 'u' });
runTests(require('./test-data-unicode-properties.json'), {
  'flags': 'u',
  'features': { 'unicodePropertyEscape': true }
});
runTests(require('./test-data-named-groups.json'), {
  'features': { 'namedGroups': true }
});
runTests(require('./test-data-named-groups-unicode.json'), {
  'flags': 'u',
  'features': { 'namedGroups': true }
});
runTests(require('./test-data-named-groups-unicode-properties.json'), {
  'flags': 'u',
  'features': { 'namedGroups': true, 'unicodePropertyEscape': true }
});
runTests(require('./test-data-lookbehind.json'), {
  'features': { 'lookbehind': true }
});
runTests(require('./test-data-unicode-set.json'), {
  'flags': 'uv',
  'features': { 'unicodePropertyEscape': true, 'unicodeSet': true }
});
