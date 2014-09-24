'use strict';

var Mongo  = require('mongodb'),
    fs     = require('fs'),
    path   = require('path');

function Client(){
}

Object.defineProperty(Client, 'collection', {
  get: function(){return global.mongodb.collection('clients');}
});

Client.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Client.collection.findOne({_id:_id}, cb);
};

Client.all = function(id, cb){
  Client.collection.find({userId:id}).toArray(cb);
};

Client.update = function(userId, obj, cb){
  obj = new Client(userId, obj);
  Client.collection.save(obj, cb);
};

Client.remove = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Client.collection.remove({_id:_id}, cb);
};

Client.photo = function(client, files, cb){
  var dir    = __dirname + '/../../public/assets/img/' + client._id,
      exist  = fs.existsSync(dir),
      self   = client;

  if(!exist){
    fs.mkdirSync(dir);
  }

  var ext    = path.extname(files.file[0].path),
      rel    = '/assets/img/' + self._id + '/profile' + ext,
      abs    = dir + '/profile' + ext;
  fs.renameSync(files.file[0].path, abs);

  self.photo = rel;

  Client.collection.save(self, function(){
    cb(null, self);
  });

};

module.exports = Client;

