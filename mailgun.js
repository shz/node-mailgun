var http = require('http'),
    querystring = require('querystring');

//constants
var MAILGUN_TAG = 'X-Mailgun-Tag',
    CAMPAIGN_ID = 'X-Campaign-Id';
    
var Mailgun = function(apiKey) {
  //the docs use a base64 header for auth, but that doesn't seem to work...
  //var apiKey64 = new Buffer(apiKey).toString('base64');
  
  this.sendText = function(sender, recipients, subject, text, servername, options, callback) {
    //defaults
    servername = servername || '';
    options = options || {};
   
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
      if (callback) callback(res.statusCode != 201);
    });
    req.end(body);
  };
  
  this.sendRaw = function(sender, recipients, rawBody, servername, callback) {
    //defaults
    servername = servername || '';
   
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

