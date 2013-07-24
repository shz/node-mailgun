var nock = require('nock')
  , mg2 = require('../lib/mailgun2')
  , request = require('../lib/request')
  ;

exports.setUp = function(callback) {
  this.mg = new mg2.Mailgun('api-key');
  this.nock = nock('https://api.mailgun.net');
  callback();
};


exports.testMethod = function(test) {
  var nock = this.nock.post('/v2/').reply(200);
  request.fire(null, 'POST', '/', function() {
    nock.done();
    test.done();
  });
};

exports.testPath = function(test) {
  var nock = this.nock.get('/v2/foo').reply(200);
  request.fire(null, 'GET', '/foo', function() {
    nock.done();
    test.done();
  });
};

exports.testParams = function(test) {
  var nock = this.nock.post('/v2/', 'foo=bar').reply(200);
  nock = nock.matchHeader('Content-Type', /application\/x\-www\-form\-urlencoded/);
  nock = nock.matchHeader('Content-Length', 7);
  request.fire(null, 'POST', '/', {foo: 'bar'}, function() {
    nock.done();
    test.done();
  });
};

exports.testHasAuth = function(test) {
  var nock = this.nock.get('/v2/test').reply(200);
  nock = nock.matchHeader('Authorization', 'Basic ' + new Buffer('api:api-key').toString('base64'));
  request.fire('api-key', 'GET', '/test', function() {
    nock.done();
    test.done();
  });
};

var testRequestStatus = function(status) {
  exports['testStatus' + status] = function(test) {
    var nock = this.nock.get('/v2/').reply('status');
    request.fire(null, 'GET', '/', function(err) {
      nock.done();
      test.ok(err instanceof Error);
      test.done();
    });
  };
};
testRequestStatus(400);
testRequestStatus(401);
testRequestStatus(402);
testRequestStatus(404);
testRequestStatus(500);
testRequestStatus(501);

exports.testBody = function(test) {
  var nock = this.nock.get('/v2/').reply(200, {foo: 'bar'});
  request.fire(null, 'GET', '/', function(err, data) {
    nock.done();

    test.ifError(err);
    test.deepEqual(data, {foo: 'bar'});

    test.done();
  });
};
