// Just read in all test files in this directory
var fs = require('fs');
fs.readdirSync(__dirname).forEach(function(name) {
  if (name == 'run.js')
    return;

  exports[name.split('.js')[0].split('test_')[1]] = require('./' + name);
});
