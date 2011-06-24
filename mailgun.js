//
// Copyright (C) 2011 by Patrick Stein
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

var http = require('http'),
    querystring = require('querystring');

//constants
var MAILGUN_TAG = 'X-Mailgun-Tag',
    CAMPAIGN_ID = 'X-Campaign-Id';

var Mailgun = function(apiKey) {
  //the docs use a base64 header for auth, but that doesn't seem to work...
  //var apiKey64 = new Buffer(apiKey).toString('base64');

  this.sendText = function(sender, recipients, subject, text, servername, options, callback) {
    //magic arguments
    if (arguments.length < 5) {
      throw new Error('Missing required argument');
    } else if (arguments.length == 5) {
      callback = servername;
      servername = '';
      options = {};
   } else if (arguments.length == 6) {
      callback = options;
      servername = servername;
      options = {};
    }

    //defaults
    servername = servername || '';
    options = options || {};
    //be flexible with recipients
    if (typeof(recipients) == 'string')
      recipients = [recipients];

    //generate the body text
    var body = querystring.stringify({
      sender: sender,
      recipients: recipients.join(', '),
      subject: subject,
      body: text,
      options: JSON.stringify(options)
    });

    //prep http request
    var httpOptions = {
      host: 'mailgun.net',
      port: 80,
      method: 'POST',
      path: '/api/messages.txt?api_key=' + apiKey + '&servername=' + servername,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    //fire the request
    var req = http.request(httpOptions, function(res) {
      if (callback) callback(res.statusCode != 201 ? res.statusCode : undefined);
    });
    req.end(body);
  };

  this.sendRaw = function(sender, recipients, rawBody, servername, callback) {
    //magic arguments
    if (arguments.length < 4) {
      throw new Error('Missing required argument');
    } else if (arguments.length == 4) {
      callback = servername;
      servername = '';
    }

    //defaults
    servername = servername || '';
    //be flexible with recipients
    if (typeof(recipients) == 'string')
      recipients = [recipients];


    //create the message
    var message = sender +
                  '\n' + recipients.join(', ') +
                  '\n\n' + rawBody;

    //prep http request
    var httpOptions = {
      host: 'mailgun.net',
      port: 80,
      method: 'POST',
      path: '/api/messages.eml?api_key=' + apiKey + '&servername=' + servername,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Length': Buffer.byteLength(message)
      }
    };

    //fire the request
    var req = http.request(httpOptions, function(res) {
      if (callback) callback(res.statusCode != 201);
    });
    req.end(message);
  };
};

exports.Mailgun = Mailgun;
exports.MAILGUN_TAG = MAILGUN_TAG;
exports.CAMPAIGN_ID = CAMPAIGN_ID;

module.exports = exports;

