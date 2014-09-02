var fs = require('fs'),
    path = require('path');

var got = require('got');

function saveFile(url, name, cb) {
  cb || (cb = function(err) {
    if (err) {
      throw err;
    }
    console.log('`%s` updated successfully.', name)
  });
  got(url, function(err, data) {
    if (err) {
      return cb(err);
    }
    fs.writeFile(path.join(__dirname, name), data, function(err) {
      if (err) {
        return cb(err);
      }
      cb();
    })
  });
}

saveFile('https://raw.githubusercontent.com/jviereck/regjsparser/master/test/test-data-unicode.json', 'test-data-unicode.json');
saveFile('https://raw.githubusercontent.com/jviereck/regjsparser/master/test/test-data.json', 'test-data.json');
