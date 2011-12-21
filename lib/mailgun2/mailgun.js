//
// mailgun.js
//
// Builds out the Mailgun object from the other modules
//

var fs = require('fs'),
    path = require('path');

// Basic setup for the class
var Mailgun = function(key, server) {
  this.key = key;
  this.server = server || undefined;
};
Mailgun.prototype = {};
Mailgun.prototype.constructor = Mailgun;

// And now, a bit of magic -- we import every file from the current
// directory (except for this one), and add/bind its exports to
// the mailgun object.
var files = fs.readdirSync(__dirname);
for (var i=0; i<files.length; i++) {

  // Eh, makes life easier
  var file = files[i];
  var absfile = path.join(__dirname, file);

  // Skip the current file
  if (file == 'mailgun.js') // Using __filename is more hassle than it's worth
    continue;
  // Skip the request library
  if (file == 'request.js')
    continue;
  // Only try to import javascript files
  if (!file.match(/\.js$/) || !fs.statSync(absfile).isFile())
    continue;

  // Make a nice module name
  var name = file.split('.')[0];

  // Do the import
  var m = require(absfile);

  // Set up the subobject
  Mailgun.prototype[name] = {};

  // Start mashing in attributes
  for (var i in m) if (m.hasOwnProperty(i)) {

    // Bind functions to the Mailgun object
    if (typeof m[i] == 'function') {
      // Beat the closure scoping
      Mailgun.prototype[name][i] = (function(f) {
        return function() { f.apply(Mailgun, arguments) }
      })(m[i]);

    // For everything else, add the object to the relevant scope,
    // but don't actually bind it
    } else {

    }
  }
}

exports.Mailgun = Mailgun;
