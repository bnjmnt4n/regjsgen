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

var runTests = function(data) {
  Object.keys(data).forEach(function(regex) {
    var results = data[regex];
    var generated;
    try {
      generated = generate(regex);
    } catch (exception) {
      generated = {
        type: 'error',
        name: exception.name,
        message: exception.message,
        input: regex
      };
      var stack = exception.stack;
    }

    if (stringify(generated) !== stringify(results)) {
      console.log(
        'Failure parsing string ' + regex +  ':' + JSON.stringify(generated) +
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

runTests(require('./test-data.json'));
runTests(require('./test-data-unicode.json'));
