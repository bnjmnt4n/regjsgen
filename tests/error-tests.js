var assert = require('assert');
var generate = require('../regjsgen').generate;

// Node factories.
function value(kind, codePoint) {
  return { 'type': 'value', 'kind': kind, 'codePoint': codePoint };
}

function symbol(char) {
  return value('symbol', char.codePointAt(0));
}

function identifier(name) {
  return { 'type': 'identifier', 'value': name };
}

function group(behavior, body) {
  return { 'type': 'group', 'behavior': behavior, 'body': body || [symbol('a')] };
}

function quantifier(body, min, max) {
  return { 'type': 'quantifier', 'min': min, 'max': max, 'greedy': true, 'body': [body] };
}

function testThrows(description, node, expected) {
  assert.throws(function() {
    generate(node);
  }, expected);
  console.log('PASSED TEST: %s', description);
}

function testGenerates(description, node, expected) {
  assert.strictEqual(generate(node), expected);
  console.log('PASSED TEST: %s', description);
}

/*--------------------------------------------------------------------------*/

// Unknown node types.
testThrows('unknown node type', { 'type': 'unknown' }, /^Error: Invalid node type: unknown$/);
testThrows('inherited property as node type', { 'type': 'toString' }, /^Error: Invalid node type: toString$/);
testThrows('node without a type', {}, /^Error: Invalid node type: undefined$/);

// Type assertions with a single expected type.
testThrows(
  'group name that is not an identifier',
  { 'type': 'group', 'behavior': 'normal', 'name': symbol('a'), 'body': [] },
  /^Error: Invalid node type: value; expected type: identifier$/
);
testThrows(
  'reference name that is not an identifier',
  { 'type': 'reference', 'name': symbol('a') },
  /^Error: Invalid node type: value; expected type: identifier$/
);
testThrows(
  'class strings containing a non-`classString` node',
  { 'type': 'classStrings', 'strings': [symbol('a')] },
  /^Error: Invalid node type: value; expected type: classString$/
);

// Type assertions with multiple expected types.
testThrows(
  'quantifier applied to a disjunction',
  quantifier({ 'type': 'disjunction', 'body': [] }, 0, null),
  /^Error: Invalid node type: disjunction; expected types: /
);
testThrows(
  'alternative containing a nested alternative',
  { 'type': 'alternative', 'body': [symbol('a'), { 'type': 'alternative', 'body': [] }] },
  /^Error: Invalid node type: alternative; expected types: /
);
testThrows(
  'character class containing a group',
  { 'type': 'characterClass', 'negative': false, 'kind': 'union', 'body': [group('normal')] },
  /^Error: Invalid node type: group; expected types: /
);
// The compiled type assertion regex is cached; ensure the cached copy still rejects.
testThrows(
  'quantifier applied to a quantifier (cached type assertion)',
  quantifier(quantifier(symbol('a'), 0, null), 0, null),
  /^Error: Invalid node type: quantifier; expected types: /
);

// Anchors.
testThrows('anchor with an invalid kind', { 'type': 'anchor', 'kind': 'middle' }, /^Error: Invalid assertion$/);

// Character class ranges.
testThrows(
  'character class range with a nested range as the minimum',
  {
    'type': 'characterClassRange',
    'min': { 'type': 'characterClassRange', 'min': symbol('a'), 'max': symbol('b') },
    'max': symbol('z')
  },
  /^Error: Invalid character class range$/
);
testThrows(
  'character class range with a nested range as the maximum',
  {
    'type': 'characterClassRange',
    'min': symbol('a'),
    'max': { 'type': 'characterClassRange', 'min': symbol('y'), 'max': symbol('z') }
  },
  /^Error: Invalid character class range$/
);

// Groups.
testThrows('group with an invalid behavior', group('sideways'), /^Error: Invalid behaviour: sideways$/);

// Backreferences.
testThrows('reference without an index or name', { 'type': 'reference' }, /^Error: Unknown reference type$/);
testThrows('reference with a zero index', { 'type': 'reference', 'matchIndex': 0 }, /^Error: Unknown reference type$/);

// Values.
testThrows('value without a code point', { 'type': 'value', 'kind': 'symbol' }, /^Error: Invalid code point: undefined$/);
testThrows('value with a string code point', value('symbol', '97'), /^Error: Invalid code point: 97$/);
testThrows('value with an unsupported kind', value('emoji', 97), /^Error: Unsupported node kind: emoji$/);
testThrows('single escape with an invalid code point', value('singleEscape', 0x61), /^Error: Invalid code point: 97$/);

// Invalid code points passed to `fromCodePoint`.
testThrows('symbol with a `NaN` code point', value('symbol', NaN), /^RangeError: Invalid code point: NaN$/);
testThrows('symbol with an infinite code point', value('symbol', Infinity), /^RangeError: Invalid code point: Infinity$/);
testThrows('symbol with a negative code point', value('symbol', -1), /^RangeError: Invalid code point: -1$/);
testThrows('symbol with a code point above U+10FFFF', value('symbol', 0x110000), /^RangeError: Invalid code point: 1114112$/);
testThrows('symbol with a non-integer code point', value('symbol', 97.5), /^RangeError: Invalid code point: 97.5$/);
testThrows('identifier escape with a negative code point', value('identifier', -1), /^RangeError: Invalid code point: -1$/);

/*--------------------------------------------------------------------------*/

// Boundary values that should still be generated.
testGenerates('symbol with the maximum code point', value('symbol', 0x10FFFF), '􏿿');
testGenerates('symbol with code point zero', value('symbol', 0), '\0');
testGenerates('unicode code point escape with the maximum code point', value('unicodeCodePointEscape', 0x10FFFF), '\\u{10FFFF}');
testGenerates('quantifier with `min` and `max` of zero', quantifier(symbol('a'), 0, 0), 'a{0}');
testGenerates('quantifier with `max` of `undefined`', quantifier(symbol('a'), 2, undefined), 'a{2,}');
testGenerates(
  'lazy quantifier',
  { 'type': 'quantifier', 'min': 0, 'max': 1, 'greedy': false, 'body': [symbol('a')] },
  'a??'
);
testGenerates(
  'modifier group with only disabled flags',
  { 'type': 'group', 'behavior': 'ignore', 'modifierFlags': { 'enabling': '', 'disabling': 'ims' }, 'body': [symbol('a')] },
  '(?-ims:a)'
);
testGenerates(
  'modifier group with only enabled flags',
  { 'type': 'group', 'behavior': 'ignore', 'modifierFlags': { 'enabling': 'ims', 'disabling': '' }, 'body': [symbol('a')] },
  '(?ims:a)'
);
testGenerates(
  'named group and named backreference',
  {
    'type': 'alternative',
    'body': [
      { 'type': 'group', 'behavior': 'normal', 'name': identifier('foo'), 'body': [symbol('a')] },
      { 'type': 'reference', 'name': identifier('foo') }
    ]
  },
  '(?<foo>a)\\k<foo>'
);
testGenerates(
  'null escape followed by a digit in a character class',
  { 'type': 'characterClass', 'negative': false, 'kind': 'union', 'body': [value('null', 0), symbol('1')] },
  '[\\0001]'
);
testGenerates(
  'null escape followed by a digit in a class string',
  {
    'type': 'classStrings',
    'strings': [{ 'type': 'classString', 'characters': [value('null', 0), symbol('9')] }]
  },
  '\\q{\\0009}'
);
testGenerates(
  'null escape followed by a non-digit',
  { 'type': 'alternative', 'body': [value('null', 0), symbol('a')] },
  '\\0a'
);
testGenerates(
  'null escape at the end of a sequence',
  { 'type': 'alternative', 'body': [symbol('1'), value('null', 0)] },
  '1\\0'
);
