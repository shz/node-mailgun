//
// Bounce functionality
// [API Documetation](http://documentation.mailgun.net/api-bounces.html)
//

var request = require('../request');

//
// bounces([skip, limit], callback)
//
// Gets a list of all bounces, with the specified skip and
// limit counts.  Note that while skip and limit are optional,
// if one is specified the other must be as well.
//
// Arguments:
//
//   skip - Number of records to skip
//   limit - Number of records to return
//   callback - Called when the response completes
//
exports.bounces = function(skip, limit, callback) {

  // Magic args
  if (typeof skip == 'function') {
    callback = skip;
    skip = undefined;
    limit = undefined;
  } else if (typeof limit == 'function') {
    callback = limit;
    limit == undefined;
  }

  // Sanity checks to make sure the user didn't use this API
  // incorrectly.
  if ((skip === undefined && limit !== undefined)
  ||  (skip !== undefined && limit === undefined))
    throw new Error('Skip and limit must either both be undefined, or both specified');

  // Prep query params
  var query = {
    skip: skip || 0,
    limit: limit || 0
  };
  if (skip === undefined) delete query.skip;
  if (limit === undefined) delete query.skip;

  // Send the request
  request.fire(this.key, 'GET', this._path('/bounces', query), callback);
};

//
// bounce(address, [callback])
//
// Gets a specific bounce event for the given email address
//
// Arguments:
//
//   address - Email address to fetch the bounce event for (required)
//
exports.bounce = function(address, callback) {

  // Address is required, so get upset if the user didn't specify it
  if (!address)
    throw new Error('Address must be specified');

  request.fire(this.key, 'GET',
    this._path('/bounces/' + encodeURIComponent(address)), callback)
};

//
// createBounce(address, [code, [description]], [callback])
//
// Creates a bounce even for the given email address, and optionally
// a code and description.
//
// Arguments:
//
//   address - Email address the bounce is for
//   code - Error code
//   description - Error description
//
exports.createBounce = function(address, code, description, callback) {

  // Address is required, so get upset if the user didn't specify it
  if (!address)
    throw new Error('Address must be specified');

  // Build request data
  var data = {

  };

  request.fire(this.key, this._path('/bounces'), data, callback);
};

//
// deleteBounce(address, [callback])
//
// Clears a bounce event for the given email address
//
// Arguments:
//
//   address - Email address to clear the bounce for
//
exports.deleteBounce = function(address, callback) {

  // Address is required, so get upset if the user didn't specify it
  if (!address)
    throw new Error('Address must be specified');

  request.fire(this.key, 'DELETE',
    this._path('/bounces/' + encodeURIComponent(address)), callback);
};
