//
// mailgun.js
//
// Builds out the Mailgun object from the other modules
//

// Imports
var fs = require('fs');

// Basic setup for the class
var Mailgun = function(key, server) {
  this.key = key;
  this.server = server || undefined;
};

// And now, a bit of magic -- we import every file from the current
// directory (except for this one), and add/bind its exports to
// the mailgun object.
var files = fs.readdirSync('.');
for (var i=0; i<files.length; i++) {

  // Eh, makes life easier
  var file = files[i];

  // Only try to import javascript files
  if (!file.match(/\.js$/) || !fs.statSync(file).isFile())
    continue;

  // Make a nice module name
  var name = file.split('.')[0];

  // Do the import
  var m = require(file);

  // Set up the subobject
  Mailgun[name] = {};

  // Start mashing in attributes
  for (var i in m) if (m.hasOwnProperty(i)) {
    if (typeof m[i] == 'function') {
      // Beat the closure scoping
      Mailgun[name][i] = (function(f) {
        // Bind the function to the Mailgun object
        return function() { f.apply(Mailgun, arguments) }
      })(m[i]);
    }
  }
}

exports.Mailgun = Mailgun;
