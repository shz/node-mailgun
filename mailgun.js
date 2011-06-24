//
// Copyright (C) 2011 Patrick Stein
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//

// Dirt simple includes.  Nice that we can keep things simple :)
var http = require('http'),
    querystring = require('querystring');

// Mailgun options constants.  See Mailgun's API docs for details.
var MAILGUN_TAG = 'X-Mailgun-Tag',
    CAMPAIGN_ID = 'X-Campaign-Id';

// This class is used to tie functionality to an API key, rather than
// using a global initialization function that forces people to use
// only one API key per application.
var Mailgun = function(apiKey) {

  // The docs use a base64 header for auth, but that doesnt' seem to
  // actually work.  Mailgun's canonical libraries instead use the
  // raw api key in a query parameter, which we do as well.  As such,
  // this isn't actually needed.  I include it still for posterity.
  this._apiKey64 = new Buffer(apiKey).toString('base64');

  this._apiKey = apiKey;
};
Mailgun.prototype = {};

Mailgun.prototype.sendText = function(sender, recipients, subject, text) {

  // These are flexible arguments, so we define them here to make
  // sure they're in scope.
  var servername = '';
  var options = {};
  var callback = null;

  // Less than 4 arguments means we're missing something that prevents
  // us from even sending an email, so we fail.
  if (arguments.length < 4)
    throw new Error('Missing required argument');

  // Flexible argument magic!
  var args = Array.prototype.slice.call(arguments, 4);
  // Pluck servername.
  if (args[0] && typeof args[0] == 'string')
    servername = args.shift() || servername;
  // Pluck options.
  if (args[0] && typeof args[0] == 'object')
    options = args.shift() || options;
  // Pluck callback.
  if (args[0] && typeof args[0] == 'function')
    callback = args.shift() || callback;
  // Don't be messy.
  delete args;

  // We allow recipients to be passed as either a string or an array,
  // but normalize to to an array for consistency later in the
  // function.
  if (typeof(recipients) == 'string')
      recipients = [recipients];

  // Build the HTTP POST body text.
  var body = querystring.stringify({
    sender: sender,
    recipients: recipients.join(', '),
    subject: subject,
    body: text,
    options: JSON.stringify(options)
  });

  // Prepare our options for the HTTP request we'll make to the
  // Mailgun API.
  var httpOptions = {
    host: 'mailgun.net',
    port: 80,
    method: 'POST',
    path: '/api/messages.txt?api_key=' + apiKey +
          (servername ? '&servername=' + servername : ''),

    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body)
    }
  };

  // Fire the request to Mailgun's API.
  var req = http.request(httpOptions, function(res) {

    // If the user supplied a callback, fire it and set `err` to the
    // status code of the request if it wasn't successful.
    if (callback) callback(res.statusCode != 201 ? res.statusCode : undefined);
  });

  // Wrap up the request by sending the body, which contains the
  // actual email data we want to send.
  req.end(body);
};

Mailgun.prototype.sendRaw = function(sender, recipients, rawBody) {

  // These are flexible arguments, so we define them here to make
  // sure they're in scope.
  var servername = '';
  var callback = null;

  // Less than 3 arguments means we're missing something that prevents
  // us from even sending an email, so we fail.
  if (arguments.length < 3)
    throw new Error('Missing required argument');

  // Flexible argument magic!
  var args = Array.prototype.slice.call(arguments, 3);
  // Pluck servername.
  if (args[0] && typeof args[0] == 'string')
    servername = args.shift() || servername;
  // Pluck callback.
  if (args[0] && typeof args[0] == 'function')
    callback = args.shift() || callback;
  // Don't be messy.
  delete args;

  // We allow recipients to be passed as either a string or an array,
  // but normalize to to an array for consistency later in the
  // function.
  if (typeof(recipients) == 'string')
      recipients = [recipients];

  // Mailgun wants its messages formatted in a special way.  Why?
  // Who knows.
  var message = sender +
                '\n' + recipients.join(', ') +
                '\n\n' + rawBody;

  // Prepare our options for the HTTP request we'll make to the
  // Mailgun API.
  var httpOptions = {
    host: 'mailgun.net',
    port: 80,
    method: 'POST',
    path: '/api/messages.eml?api_key=' + apiKey +
          (servername ? '&servername=' + servername : ''),

    // Yep, that's a plaintext body.  Again, Mailgun wants the MIME
    // data sent with some extra formatting, so I guess plaintext
    // makes sense.
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Length': Buffer.byteLength(message)
    }
  };

  // Fire the request to Mailgun's API.
  var req = http.request(httpOptions, function(res) {

    // If the user supplied a callback, fire it and set `err` to the
    // status code of the request if it wasn't successful.
    if (callback) callback(res.statusCode != 201 ? res.statusCode : undefined);
  });

  // Wrap up the request by sending the message, which contains the
  // actual email data we want to send.
  req.end(message);

};

exports.Mailgun = Mailgun;
exports.MAILGUN_TAG = MAILGUN_TAG;
exports.CAMPAIGN_ID = CAMPAIGN_ID;

module.exports = exports;

