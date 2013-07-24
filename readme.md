# node-mailgun

A wrapper around (Mailgun)[http://mailgun.com]'s v2 REST API.

# Installation

    npm install mailgun

# Usage

Mailgun's v2 API is honestly quite lovely, and as such `node-mailgun`
really just provides a thin wrapper around it (which is a good thing!).

```javascript
var mg = new require('mailgun').Mailgun2('api-key');
mg2.send
```

## General Info

Generally, you'll just be calling methods on a `Mailgun2` object.  All
methods take a callback of the form `function(err, data)` as their last
argument.  When an error occurs, `err` will be set to a relevant `Error`
object.  Otherwise, `err` will be `undefined`.  Unless something lower-level
went wrong, the `data` parameter will always be set to the parsed
response from Mailgun -- in the case of errors, this may provide some
additional information about what went wrong.

## Initialization

Access to the API is done through a `Mailgun2` object.  It's instantiated
like so:

```javascript
var mg = new require('mailgun').Mailgun2('api-key');
```

## API Methods

TODO

# Testing

Seeing as `node-mailgun` is just an API wrapper, testing doesn't buy but
so much confidence.  However, there is indeed a test suite that does
what it can to excercise the library.  To run it, simply do

```bash
npm test
```

With older versions of `npm` you'll need to use `npm install --dev` if you
want to do testing.

# The Previous Version

If you were using the previous version of `node-mailgun` built against
the v1 API, it's still here, and you can continue using it through the
`mailgun.Mailgun` interface as per usual.

Its documentation is no longer here, obviously.  If you need it, look
at the (prior version on Github)[https://github.com/shz/node-mailgun/blob/2944f538cefea4bb15fb748419fe0c30602be0c1/readme.md].

# License

Public domain, baby!  You can basically do anything you want with the
code/docs; attribution would be nice, but isn't required.

See `license.txt` for details.
