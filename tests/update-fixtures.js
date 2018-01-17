var fs = require('fs'),
    path = require('path'),
    request = require('request');

function saveFile(url, name) {
  name || (name = url.slice(url.lastIndexOf('/') + 1));

  request.get(url)
    .on('error', function(err) {
      console.log(err);
    })
    .pipe(
      fs.createWriteStream(path.join(__dirname, name))
    )
    .on('finish', function() {
      console.log('`%s` updated successfully.', name);
    });
}

saveFile('https://raw.githubusercontent.com/jviereck/regjsparser/gh-pages/test/test-data.json');
saveFile('https://raw.githubusercontent.com/jviereck/regjsparser/gh-pages/test/test-data-nonstandard.json');
saveFile('https://raw.githubusercontent.com/jviereck/regjsparser/gh-pages/test/test-data-unicode.json');
saveFile('https://raw.githubusercontent.com/jviereck/regjsparser/gh-pages/test/test-data-unicode-properties.json');
saveFile('https://raw.githubusercontent.com/jviereck/regjsparser/gh-pages/test/test-data-named-groups.json');
saveFile('https://raw.githubusercontent.com/jviereck/regjsparser/gh-pages/test/test-data-named-groups-unicode.json');
saveFile('https://raw.githubusercontent.com/jviereck/regjsparser/gh-pages/test/test-data-named-groups-unicode-properties.json');
