# RegJSGen

Generating `RegExp`s from RegJSParser's AST.

## Installation

```bash
npm install regjsgen
```

## Usage

```js
var generate = require('regjsgen').generate;
```

## Testing

Run the command

```bash
npm test
```

To create a new reference file, execute

```bash
node test/create_ref.js
```

from the repo top directory.
