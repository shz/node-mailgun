//
// Bounce functionality
// (http://documentation.mailgun.net/api-bounces.html)[API Documetation]
//

var request = require('./request');

//
// Gets a list of all bounces, with the specified skip and
// limit counts.  Note that while skip and limit are optional,
// if one is specified the other must also be.
//
// Arguments:
//
//   skip - Number of records to skip (default 0)
//   limit - Number of records to return (default 100)
//
exports.bounces = function(skip, limit, callback) {

  // Mailgun does its own default, but to make sure the API
  // docs line up, I'll manually default these.
  if (skip === undefined && limit === undefined) {

    skip = 0;
    limit = 100;

  // Sanity checks to make sure the user didn't use this API
  // incorrectly.
  } else if (skip !== undefined && limit === undefined) {

    throw new Error('Skip and limit must either both be undefined, or both specified');
  }

  // Normalize skip and limit if they're 0
  if (!skip) skip = 0;
  if (!limit) limit = 0;

  // Send the request
  request.fire(this.key, 'GET', this._path('/bounces', {skip: skip, limit: limit}), function(err, res) {

  });
};

exports.bounce = function(address) {

};

exports.bounce = function() {

};
