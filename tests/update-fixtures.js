const { createWriteStream } = require('node:fs');
const { join } = require('node:path');
const { pipeline } = require('node:stream/promises');

async function saveFile(url) {
  const name = url.slice(url.lastIndexOf('/') + 1);

  try {
    const { body } = await fetch(url);

    await pipeline(
      body,
      createWriteStream(join(__dirname, name)),
    );
    console.log('`%s` updated successfully.', name);
  } catch(err) {
    console.error('Error writing to file:', err);
  }
}

const FIXTURE_URLS = [
  'https://raw.githubusercontent.com/jviereck/regjsparser/gh-pages/test/test-data.json',
  'https://raw.githubusercontent.com/jviereck/regjsparser/gh-pages/test/test-data-lookbehind.json',
  'https://raw.githubusercontent.com/jviereck/regjsparser/gh-pages/test/test-data-nonstandard.json',
  'https://raw.githubusercontent.com/jviereck/regjsparser/gh-pages/test/test-data-named-groups.json',
  'https://raw.githubusercontent.com/jviereck/regjsparser/gh-pages/test/test-data-named-groups-unicode.json',
  'https://raw.githubusercontent.com/jviereck/regjsparser/gh-pages/test/test-data-named-groups-unicode-properties.json',
  'https://raw.githubusercontent.com/jviereck/regjsparser/gh-pages/test/test-data-unicode.json',
  'https://raw.githubusercontent.com/jviereck/regjsparser/gh-pages/test/test-data-unicode-properties.json',
  'https://raw.githubusercontent.com/jviereck/regjsparser/gh-pages/test/test-data-unicode-set.json',
  'https://raw.githubusercontent.com/jviereck/regjsparser/gh-pages/test/test-data-modifiers-group.json',
];

(async () => {
  await Promise.all(FIXTURE_URLS.map(saveFile));
})();
