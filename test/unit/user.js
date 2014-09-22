'use strict';

var expect    = require('chai').expect,
    User      = require('../../server/models/user'),
    dbConnect = require('../../server/lib/mongodb'),
    cp        = require('child_process'),
    Mongo     = require('mongodb'),
    db        = 'cap-runner-test';

describe('User', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new User object', function(){
      var o = {
        username : 'sue',
        password : 'abcd',
        },
      u = new User(o);
      expect(u).to.be.instanceof(User);
    });
  });
});
