var fs = require('fs');
var jsesc = require('jsesc');

var generate = require('../regjsgen').generate;

var stringify = function(obj) {
  return jsesc(obj, {
    json: true,
    compact: false,
    indent: '  '
  });
};

var runTests = function(data, excused) {
  excused || (excused = []);
  var keys = Object.keys(data).filter(function(name) {
    return data[name].type != 'error' && excused.indexOf(name) == -1;
  });
  keys.forEach(function(regex) {
    var results = data[regex];
    var generated;
    try {
      generated = JSON.stringify(generate(results));
    } catch (exception) {
      generated = {
        type: 'error',
        name: exception.name,
        message: exception.message,
        input: regex
      };
      var stack = exception.stack;
    }

    if (generated !== JSON.stringify(regex)) {
      console.log(
        'Failure generating string ' + JSON.stringify(regex) +  ':\n' + generated +
        '\n' + JSON.stringify(results)
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
//runTests(require('./test-data-unicode.json'));
