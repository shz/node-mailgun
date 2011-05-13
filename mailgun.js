var http = require('http'),
    buffer = require('buffer'),
    querystring = require('querystring');

//constants
var MAILGUN_TAG = 'X-Mailgun-Tag';
    
var Mailgun = function(apiKey) {
  var apiKey64 = new Buffer(apiKey).toString('base64');
  
  this.sendText = function(sender, recipients, subject, text, servername, options, callback) {
    //defaults
    servername = servername || '';
    options = options || {}
    
    //prep http request
    var httpOptions = {
      host: 'http://mailgun.net',
      port: 80,
      method: 'POST',
      path: '/api/messages.txt',
      headers = {
        'Authorization': 'Basic ' + apiKey64,
        'Content-Type': 'application/x-www-urlencoded'
      }
    };

    //fire the request
    var req = http.request(httpOptions, responseCb);
    req.write(querystring.stringify({
      servername: servername,
      sender: sender,
      recipients: recipients.join(', '),
      subject: subject,
      body: text,
      options: JSON.stringify(options)
    }));
    req.end();
    
    //handles the response from the server
    var responseCb = function(res) {
      callback(res.statusCode == 201);
    };
  };
  
  this.sendRaw = function(sender, recipients, raw_body, servername, callback) {
    //defaults
    servername = servername || '';
    
    //prep http request
    var httpOptions = {
      host: 'http://mailgun.net',
      port: 80,
      method: 'POST',
      path: '/api/messages.eml?servername=' + servername,
      headers = {
        'Authorization': 'Basic ' + apiKey64,
        'Content-Type': 'text/plain; charset=utf-8'
      }
    };
    
    //fire the request
    var req = http.request(httpOptions, responseCb);
    var message = 'From: ' + sender +
                  '\nTo: ' + recipients.join(', ') +
                  '\n\n' + raw_body;
    req.write(message);
    req.end();
    
    var responseCb = function(res) {
      callback(res.statusCode == 201);
    };
  };
};

exports.Mailgun = Mailgun;
