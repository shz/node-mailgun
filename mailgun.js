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
    options = {}
    
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
  
  
};

exports.Mailgun = Mailgun;
