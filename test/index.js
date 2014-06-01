var fs = require('fs');
var jsesc = require('jsesc');

var generate = require('../regjsgen').generate;

var parseTests = [].concat(
  JSON.parse(fs.readFileSync('test/parse_input.json') || '[]'),
  JSON.parse(fs.readFileSync('test/parse_unicode_input.json', 'utf8') || '[]')
);
var parseResult = [].concat(
  JSON.parse(fs.readFileSync('test/parse_output.json') || '[]'),
  JSON.parse(fs.readFileSync('test/parse_unicode_output.json', 'utf8') || '[]')
);

if (parseTests.length !== parseResult.length) {
  fail('Parse input and output file needs to have same number of arguments');
}

var stringify = function(obj) {
  return jsesc(obj, {
    json: true, compact: true
  });
};

parseTests.forEach(function(ast, idx) {
  var generated;
  try {
    generated = generate(ast);
  } catch (error) {
    generated = {
      type: 'error',
      name: error.name,
      message: error.message,
      input: ast
    };
  }

  var result = parseResult[idx],
      astString = stringify(ast);

  if (stringify(generated) !== stringify(result)) {
    throw new Error('Failure generating ' + JSON.stringify(result) +
      '\nfrom AST:\n' + astString);
  } else {
    console.log('PASSED TEST: ' + astString);
  }
});
