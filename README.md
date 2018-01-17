# regjsgen [![Build status](https://travis-ci.org/demoneaux/regjsgen.svg?branch=master)](https://travis-ci.org/demoneaux/regjsgen) [![Code coverage status](https://img.shields.io/codecov/c/github/demoneaux/regjsgen.svg)](https://codecov.io/gh/demoneaux/regjsgen)

[![Greenkeeper badge](https://badges.greenkeeper.io/demoneaux/regjsgen.svg)](https://greenkeeper.io/)

Generate regular expressions from [regjsparser](https://github.com/jviereck/regjsparser)’s AST.

## Installation

```bash
npm install --save regjsgen
```

## API

### `regjsgen.generate(ast)`

This function accepts an abstract syntax tree representing a regular expression, and returns the generated regular expression string.

```js
var regjsparser = require('regjsparser');
var regjsgen = require('regjsgen');

// Generate an AST with `regjsparser`.
var ast = regjsparser.parse(regex);

// Modify AST
// …

// Generate `RegExp` string with `regjsgen`.
regex = regjsgen.generate(ast);
```

## Support

Tested in Node.js 0.10.x, 0.12.x, 4.x and 5.x.

## Author

| [![twitter/demoneaux](https://gravatar.com/avatar/029b19dba521584d83398ada3ecf6131?s=70)](https://twitter.com/demoneaux "Follow @demoneaux on Twitter") |
|---|
| [Benjamin Tan](https://demoneaux.github.io/) |

## Contributors

| [![twitter/mathias](https://gravatar.com/avatar/24e08a9ea84deb17ae121074d0f17125?s=70)](https://twitter.com/mathias "Follow @mathias on Twitter") |
|---|
| [Mathias Bynens](https://mathiasbynens.be/) |
