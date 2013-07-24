
//
// Common request functionality for the Mailgun v2 API
//

var https = require('https'),
    querystring = require('querystring');

// The base URL for Mailgun's v2 API
var base = '/v2';

// Fires a request to Mailgun's v2 API
var fire = function(key, method, path, params, callback) {

  // This function requires a minimum of four arguments, so if they
  // aren't all supplied, we'll have a problem.
  if (arguments.length < 4) throw new Error('Missing arguments');

  // Magic arguments
  if (typeof params == 'function') {
    callback = params;
    params = null;
  }

  // Correct the path if it doesn't start with a /
  if (path[0] !== '/') path = '/' + path;

  // Build the request options
  var options = {
    host: 'api.mailgun.net',
    port: 443,
    path: base + path,
    method: method
  };

  // If there are POST/PUT params, prepare the data and set the
  // content length header
  if (params) {
    var body = querystring.stringify(params);
    options.headers = {
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    };
  }

  // Wraps the callback, ensuring it's only called once.  Why do we
  // need this?  It's possible for res.on('close') to fire after
  // res.on('end') according do the docs (well, clarification: it *might*
  // be possible), so to be safe we use this.
  var callbackWrapper = function() {
    // Only fire the callback if it actually exists
    if (callback) callback.apply(this, arguments);

    // Wipe out the callback so that this function will only fire once
    callback = undefined;
  };

  // Prepare the request
  var req = https.request(options, function(res) {
    var data = '';
    res.on('data', function(c) { data += c });
    res.on('close', callbackWrapper);
    res.on('end', function() {
      // Deserialize the JSON we were given in the response
      try {
        data = JSON.parse(data);
      } catch (err) {
        return callbackWrapper(new Error('Bad JSON from API'));
      }

      // Handle some common status codes
      if (res.status == 400) return callbackWrapper(new Error('Missing parameters.  This is probably a bug in node-mailgun -- please report it!'), data);
      if (res.status == 401) return callbackWrapper(new Error('Bad API key'), data);
      if (res.status == 402) return callbackWrapper(new Error('Request failed'), data);
      if (res.status == 404) return callbackWrapper(new Error('Resource not found.  This is probably a bug in node-mailgun -- please report it!'), data);
      if (res.status >= 500) return callbackWrapper(new Error('Mailgun server error'), data);

      // Send the response on down the line
      callbackWrapper(undefined, data);
    });
  });

  // Add auth if it's there.  We don't use the `auth` option in
  // to `https.request()` because `nock` doesn't seem to pick it
  // up, which means we can't test the auth header...
  if (key)
    req.setHeader('Authorization', 'Basic ' + new Buffer('api:' + key).toString('base64'));

  // Handle errors by passing them along
  req.on('error', callbackWrapper);

  // Write the body if we have one, and be done
  req.end(body, 'utf8');
};

// Exports
exports.fire = fire;
