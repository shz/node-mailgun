# node-mailgun

A mailgun API for node.js.  At the moment, this really only includes
sending functionality.

## Initialization

Access to the API is done through the Mailgun object.  It's instantiated
like so:

    var mg = new Mailgun('api-key');

## Sending Email

Mailgun's API provides two methods for sending email: raw, and text.  Both
of them are exposed here.

`sendText(sender, recipients, subject, text, servername='', options={}, callback(err))`

 * `sender` - Sender of the message
 * `recipients` - An array of recipients; these can be email addresses
                  *or* HTTP URLs.
 * `subject` - Message subject
 * `text` - Message body text
 * `servername` - The name of the Mailgun server.  If you only have
                  one server on your Mailgun account, this can be empty.
                  Otherwise, it should be set to the server you want to
                  send from.
 * `options` - Optional parameters.  See Mailgun's API docs for details on
               these.  At the time of writing, the only supported value is
               `headers`, which should be a hash of additional MIME headers
               you want to send.
 * `callback` - Callback to be fired when the email is done being sent.  This
                should take a single parameter, `err`, that will be set to 
                `true` if the email failed to send.

### Mailgun Headers

Mailgun understands a couple headers from `options`.  These are defined
below.

 * `X-Mailgun-Tag` - Used to tag sent emails (defined in `Mailgun.MAILGUN_TAG`)
 * `X-Campaign-Id` - Used for tracking campaign data (defined in `Mailgun.CAMPAIGN_ID`)

`sendRaw(sender, recipients, rawBody, servername, callback(err))`

 * `sender` - Sender of the message
 * `recipients` - An array of recipients; these can be email addresses
                  *or* HTTP URLs.
 * `rawBody` - MIME message to send
 * `servername` - The name of the Mailgun server.  If you only have
                  one server on your Mailgun account, this can be empty.
                  Otherwise, it should be set to the server you want to
                  send from.
 * `callback` - Callback to be fired when the email has finished sending.
                This function should take a single parameter, `err`, that 
                will be set to `true` if the email failed to send.

## Example

Here's a complete sending example.

    var mailgun = require('mailgun');

    var mg = new Mailgun('api-key');
    mg.sendText('example@example.com', ['rec1@example.com', 'rec2@example.com'],
      'This is the subject',
      'This is the text',
      'noreply@example.com', {},
      function(err) {
        if (err) console.log('Oh noes');
        else     console.log('Success');
    });

TODO:

 * routes
 * mailboxes

