var mg2 = require('../lib/mailgun2');

// Test path utility

exports.testPathHasParams = function(test) {
  var m = new mg2.Mailgun('api-key');
  test.equal(m._path('/foo/bar', {
    baz: 'bam',
    flim: 'jim'
  }), '/foo/bar?baz=bam&flim=jim');
  test.done();
};

exports.testPathHasServer = function(test) {
  var m = new mg2.Mailgun('api-key', 'mail.example.com');
  test.equal(m._path('/foo/bar'), '/mail.example.com/foo/bar');
  test.done();
};
