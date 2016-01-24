# Contributing to regjsgen

Contributions are always welcome. Before contributing, please [search the issue tracker](https://github.com/demoneaux/regjsgen/issues);
your issue may have already been discussed or fixed in `master`. To contribute, [fork](https://help.github.com/articles/fork-a-repo/) regjsgen, commit your changes, & [send a pull request](https://help.github.com/articles/using-pull-requests/).

## Tests

Include updated unit tests in the `test` directory as part of your pull request.

Before running the unit tests you’ll need to install, `npm i`, [development dependencies](https://docs.npmjs.com/files/package.json#devdependencies).
Run unit tests from the command-line via `npm test`.
Fixtures can be updated from the [regjsparser](https://github.com/jviereck/regjsparser) repository via `npm run update-fixtures`.

## Coding Guidelines

In addition to the following guidelines, please follow the conventions already established in the code.

- **Spacing**:<br>
  Use two spaces for indentation. No tabs.

- **Naming**:<br>
  Keep variable & method names concise & descriptive.

- **Quotes**:<br>
  Single-quoted strings are preferred to double-quoted strings; however, please use a double-quoted string if the value contains a single-quote character to avoid unnecessary escaping.

- **Comments**:<br>
  Please use single-line comments to annotate significant additions.
