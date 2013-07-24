//
// mailgun.js
//
// Builds out the Mailgun object from the other modules
//

var querystring = require('querystring');

// Basic setup for the class
var Mailgun = function(key, server) {
  this.key = key;
  this.server = server || undefined;
};
Mailgun.prototype = {};
Mailgun.prototype.constructor = Mailgun;

// Utility method for exposing building a server-specific path
Mailgun.prototype._path = function(p, params) {
  var path = this.server ? '/' + this.server + p : p;

  // Add the params if they were specified
  if (params)
    path += '?' + querystring.stringify(params);

  return path;
};

// Start importing modules to give Mailgun its functionality
var extend = function(module) {
  var m = require('./modules/' + module + '.js');
  for (var i in m) if (m.hasOwnProperty(i)) {

    // Little safety warning to make sure I don't screw up
    if (Mailgun.hasOwnProperty(i))
      throw new Error('Double set on ' + i);

    Mailgun.prototype[i] = m[i];
  }
};

extend('send');
extend('routes');
extend('bounces');
extend('logs');
extend('stats');
extend('unsubscribe');
extend('mailboxes');
extend('spam');

exports.Mailgun = Mailgun;
