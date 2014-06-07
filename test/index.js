var fs = require('fs');
var jsesc = require('jsesc');

var generate = require('../regjsgen').generate;

var generateTests = [].concat(
  JSON.parse(fs.readFileSync('test/generate_input.json') || '[]'),
  JSON.parse(fs.readFileSync('test/generate_unicode_input.json', 'utf8') || '[]')
);
var generateResult = [].concat(
  JSON.parse(fs.readFileSync('test/generate_output.json') || '[]'),
  JSON.parse(fs.readFileSync('test/generate_unicode_output.json', 'utf8') || '[]')
);

if (generateTests.length !== generateResult.length) {
  fail('Generate input and output file needs to have same number of arguments');
}

var stringify = function(obj) {
  return jsesc(obj, {
    json: true, compact: true
  });
};

generateTests.forEach(function(ast, idx) {
  var generated;
  try {
    generated = generate(ast);
  } catch (error) {
    generated = {
      type: 'error',
      name: error.name,
      message: error.message
    };
  }

  var result = generateResult[idx],
      astString = stringify(ast),
      generatedStringified = stringify(generated);

  if (generatedStringified !== stringify(result)) {
    throw new Error('Failure generating ' + stringify(result) +
      '\nfrom AST:\n' + astString + '\n\n' + generatedStringified);
  } else {
    console.log('PASSED TEST: ' + astString);
  }
});
