# RegJSGen

Generating `RegExp`s from RegJSParser’s AST.

## Install

```bash
npm install --save regjsgen
```

## Usage

```js
var regjsgen = require('regjsgen');
// With `regjsparser`
var regjsparser = require('regjsparser');
var regex = '^a$';
var ast = regjsparser.parse(regex);
// Modify AST
// ...
// Regenerate `RegExp`
regex = regjsgen.generate(ast);
```

## Testing

Run the command

```bash
npm test
```

To create a new reference file, execute

```bash
node test/update-fixture.js
```

from the repo top directory.
