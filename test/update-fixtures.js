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
        .on('finish', function() {
          console.log('`%s` updated successfully.', name);
        })
    );
}

saveFile('https://github.com/jviereck/regjsparser/raw/master/test/test-data.json');
saveFile('https://github.com/jviereck/regjsparser/raw/master/test/test-data-nonstandard.json');
saveFile('https://github.com/jviereck/regjsparser/raw/master/test/test-data-unicode.json');
