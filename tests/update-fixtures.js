var fs = require('fs'),
    path = require('path'),
    request = require('request');

function saveFile(url, name) {
  name || (name = url.slice(url.lastIndexOf('/') + 1));

  request.get(url, function(err, response, body) {
    if (err) {
      console.log(err);
    } else {
      fs.writeFile(path.join(__dirname, name), body, function() {
        if (err) {
          console.log(err);
        } else {
          console.log('`%s` updated successfully.', name);
        }
      });
    }
  });
}

saveFile('https://github.com/jviereck/regjsparser/raw/gh-pages/test/test-data.json');
saveFile('https://github.com/jviereck/regjsparser/raw/gh-pages/test/test-data-nonstandard.json');
saveFile('https://github.com/jviereck/regjsparser/raw/gh-pages/test/test-data-unicode.json');
saveFile('https://github.com/jviereck/regjsparser/raw/gh-pages/test/test-data-unicode-properties.json');
