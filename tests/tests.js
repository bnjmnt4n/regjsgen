var generate = require('../regjsgen').generate;

function runTests(data, excused) {
  excused || (excused = []);
  var keys = Object.keys(data).filter(function(name) {
    return data[name].type != 'error' && excused.indexOf(name) == -1;
  });
  keys.forEach(function(regex) {
    var node = data[regex],
        expected = JSON.stringify(regex),
        generated;
    try {
      generated = JSON.stringify(generate(node));
    } catch (exception) {
      generated = JSON.stringify({
        type: 'error',
        name: exception.name,
        message: exception.message,
        input: regex
      });
      var stack = exception.stack;
    }

    if (generated !== expected) {
      console.log(
        [
          'Failure generating regular expression: %s',
          'Generated: %s',
          'AST: %s'
        ].join('\n'),
        expected,
        generated,
        JSON.stringify(node)
      );
      if (stack) {
        console.log(stack);
      }
      process.exit(1);
    } else {
      console.log('PASSED TEST: ' + regex);
    }
  });
};

runTests(require('./test-data.json'), [
  '([Nn]?ever|([Nn]othing\\s{1,}))more',
  '[\\0001]',
  '[\\u{02}-\\u{003}]',
  '\\ca',
  '\\cb',
  '\\cc',
  '\\cd',
  '\\ce',
  '\\cf',
  '\\cg',
  '\\ch',
  '\\ci',
  '\\cj',
  '\\ck',
  '\\cl',
  '\\cm',
  '\\cn',
  '\\co',
  '\\cp',
  '\\cq',
  '\\cr',
  '\\cs',
  '\\ct',
  '\\cu',
  '\\cv',
  '\\cw',
  '\\cx',
  '\\cy',
  '\\cz',
  '\\u{000000}',
  '\\u{02}',
  '\\u{003}',
  '\\u{0004}',
  '\\u{00005}',
  '\\u{01D306}'
]);
runTests(require('./test-data-nonstandard.json'), [
  'a\\91'
]);
runTests(require('./test-data-unicode.json'), [
  '\\u{000000}',
  '\\u{0000000000000000000}',
  '\\u{0}',
  '\\u{02}',
  '\\u{003}',
  '\\u{0004}',
  '\\u{00005}',
  '\\u{01D306}',
  '[\\u{02}-\\u{003}]',
  '[\\uD83D\\uDCA9-\\uD83D\\uDCAB]',
  '[a-b\\uD83D\\uDCA9-\\uD83D\\uDCAB]',
  '[\\uD83D\\uDCA9-\\uD83D\\uDCABa-b]',
  '[\\uD83D\\uDCA9\\uD83D\\uDCAB]',
  '[a-b\\uD83D\\uDCA9\\uD83D\\uDCAB]',
  '[\\uD83D\\uDCA9\\uD83D\\uDCABa-b]',
  '\\uD83D\\uDCA9',
  '(?:\\uD83D\\uDCA9)'
]);
