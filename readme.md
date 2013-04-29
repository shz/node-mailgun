# node-mailgun

This library provides simple access to Mailgun's API for node.js applications.
It's MIT licensed, and being used in production over at [Hipsell](http://hipsell.com).

## Installation

    npm install mailgun

Or you can just throw `mailgun.js` into your application.  There are
no dependendies outside of node's standard library.

**Note:** `master` on Github is going to be untested/unstable at times,
          as this is a small enough library that I don't want to bother
          with a more complicated repo structure.  As such, you should
          really only rely on the version of `mailgun` in `npm`, as
          I'll only ever push stable and tested code there.

## Usage

At the time of writing, Mailgun's documentation is actually incorrect in places,
which is unfortunate.  As such, I'm going to re-document everything in this README
according to the actual way it's implemented in `node-mailgun`, which itself
is based off the implementation from Mailgun's github account, and not the API
docs on the site.

## Initialization

Access to the API is done through a Mailgun object.  It's instantiated
like so:

    var mg = new Mailgun('api-key');

## Sending Email

Mailgun's API provides two methods for sending email: raw, and text.  Both
of them are exposed here.

### sendText

Sends a simple plain-text email.  This also allows for slightly easier
sending of Mailgun options, since with `sendRaw` you have to set them
in the MIME body yourself.

`sendText(sender, recipients, subject, text, [servername=''], [options={}], [callback(err)])`

 * `sender` - Sender of the message; this should be a full email address
              (e.g. `example@example.com`).
 * `recipients` - A string (`example@example.com`) or array of strings (`['a@example.com', 'b@example.com']`)
                  of recipients; these can be email addresses *or* HTTP URLs.
 * `subject` - Message subject
 * `text` - Message body text
 * `servername` - The name of the Mailgun server.  If you only have
                  one server on your Mailgun account, this can be omitted.
                  Otherwise, it should be set to the server you want to
                  send from.
 * `options` - Optional parameters.  See Mailgun's API docs for details on
               these.  At the time of writing, the only supported value is
               `headers`, which should be a hash of additional MIME headers
               you want to send.
 * `callback` - Callback to be fired when the email is done being sent.  This
                should take a single parameter, `err`, that will be set to
                the status code of the API HTTP response code  if the email
                failed to send; on success, `err` will be `undefined`.

#### Example

    sendText('sender@example.com',
             ['recipient1@example.com', 'http://example.com/recipient2'],
             'Behold the wonderous power of email!',
             {'X-Campaign-Id': 'something'},
             function(err) { err && console.log(err) });

### sendRaw

Sends a raw MIME message.  *Don't* just use this with text; instead,
you should either build a MIME message manually or by using some MIME
library such as andris9's mailcomposer module https://github.com/andris9/mailcomposer 
(FWIW mailcomposer is the same module used by the popular nodemailer module http://github.com/andris9/Nodemailer).

`sendRaw(sender, recipients, rawBody, [servername], [callback(err)])`

 * `sender` - Sender of the message; this should be a full email address
              (e.g. `example@example.com`)
 * `recipients` - A string (`example@example.com`) or array of strings (`['a@example.com', 'b@example.com']`)
                  of recipients; these can be email addresses *or* HTTP URLs.
 * `rawBody` - MIME message to send
 * `servername` - The name of the Mailgun server.  If you only have
                  one server on your Mailgun account, this can be omitted.
                  Otherwise, it should be set to the server you want to
                  send from.
 * `callback` - Callback to be fired when the email is done being sent.  This
                should take a single parameter, `err`, that will be set to
                the status code of the API HTTP response code  if the email
                failed to send; on success, `err` will be `undefined`.

**Note:** Sending a message via raw MIME lets you use Mailgun's built-in
          templating shinies.  Check out the [Mailgun Docs](http://documentation.mailgun.net/Documentation/DetailedDocsAndAPIReference#Message_Templates)
          for details.

#### Example

    sendRaw('sender@example.com',
            ['recipient1@example.com', 'http://example.com/recipient2'],
            'From: sender@example.com' +
              '\nTo: ' + 'recipient1@example.com, http://example.com/recipient2' +
              '\nContent-Type: text/html; charset=utf-8' +
              '\nSubject: I Love Email' +
              '\n\nBecause it\'s just so awesome',
            function(err) { err && console.log(err) });

### Email Addresses

Mailgun allows sender and recipient email addresses to be formatted in
several different ways:

 * `'John Doe' <john@example.com>`
 * `"John Doe" <john@example.com>`
 * `John Doe <john@example.com>`
 * `<john@example.com>`
 * `john@example.com`

### Mailgun Headers

Mailgun understands a couple special headers, specified via `options` when using
`sendText`, or in the MIME headers when using `sendRaw`.  These are defined
below.

 * `X-Mailgun-Tag` - Used to tag sent emails (defined in `Mailgun.MAILGUN_TAG`)
 * `X-Campaign-Id` - Used for tracking campaign data (defined in `Mailgun.CAMPAIGN_ID`)

### Example

Here's a complete sending example.

    var Mailgun = require('mailgun').Mailgun;

    var mg = new Mailgun('some-api-key');
    mg.sendText('example@example.com', ['Recipient 1 <rec1@example.com>', 'rec2@example.com'],
      'This is the subject',
      'This is the text',
      'noreply@example.com', {},
      function(err) {
        if (err) console.log('Oh noes: ' + err);
        else     console.log('Success');
    });

## Routing

Mailgun lets you route incoming email to different destinations.  TODO - more docs

### createRoute

Creates a new route.  TODO - more docs

`createRoute(pattern, destination, [callback(err, id)])`

TODO - document arguments

### deleteRoute

Deletes the route with the specified ID if it exists, otherwise fails silently.

`deleteRoute(id, [callback(err)])`

 * id - Route ID, as returned by `getRoutes()` or `createRoute`.
 * Callback to be fired when the deletion is completed.  This callback
   takes a single argument, `err`, that will be set to an Error object
   if something went wrong with the deletion.  If the deletion succeeded, or
   no route existed with the specified ID, `err` will be `undefined`.

### getRoutes

Gets a list of all routes.

`getRoutes(callback(err, routes))`

 * `callback` - Callback to be fired when the request has finished.  This
                should take two parameters: `err`, which will hold either an
                HTTP error code, or an error string on failure; and `routes`,
                which will be a list of routes on success.  Routes returned
                through this callback will be objects with three fields: `pattern`,
                `destination`, and `id`.

#### Example

    getRoutes(function(err, routes) {

      if (err) console.log('Error:', err);

      for (var i=0; i<routes.length; i++) {
        console.log('Route');
        console.log('  Pattern:', routes[i].pattern);
        console.log('  Destination:', routes[i].destination);
        console.log('  Id:', routes[i].id);
      }
    });

## Eventual Work:

 * Mailboxes

