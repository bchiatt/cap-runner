'use strict';

var Mongo  = require('mongodb'),
    fs     = require('fs'),
    path   = require('path'),
    Rug    = require('./rug');

function Client(id, o){
  this._id         = Mongo.ObjectID();
  this.userId      = Mongo.ObjectID(id);
  this.name        = o.name;
  this.isActive    = o.isActive || false;
  this.photo       = o.photo || '/assets/img/default.jpg';
  this.precautions = o.precautions || {};
  if(o.current){
                this.current     = {
                                     admitDate : new Date(o.current.admitDate) || new Date(),
                                     room      : o.current.room || null,
                                     insurance : o.current.insurance || null,
                                     isRug     : o.current.isRug || null
                                   };

                if(o.current.pt){this.current.pt = {
                                                     evalDate  : new Date(o.current.pt.evalDate) || null,
                                                     wkly      : o.current.pt.wkly || null,
                                                     frequency : {
                                                                   high : o.current.pt.frequency.high * 1 || null,
                                                                   low  : o.current.pt.frequency.low * 1 || null
                                                                 },
                                                     rcDate     : new Date(o.current.pt.rcDate) || null,
                                                     dcDate     : new Date(o.current.pt.dcDate) || null
                                                   };
                }

                if(o.current.ot){this.current.ot = {
                                                     evalDate  : new Date(o.current.ot.evalDate) || null,
                                                     wkly      : o.current.ot.wkly || null,
                                                     frequency : {
                                                                   high : o.current.ot.frequency.high * 1 || null,
                                                                   low  : o.current.ot.frequency.low * 1 || null
                                                                 },
                                                     rcDate     : new Date(o.current.ot.rcDate) || null,
                                                     dcDate     : new Date(o.current.ot.dcDate) || null
                                                   };
                }

                if(o.current.st){this.current.st = {
                                                     evalDate  : new Date(o.current.st.evalDate) || null,
                                                     wkly      : o.current.st.wkly || null,
                                                     frequency : {
                                                                   high : o.current.st.frequency.high * 1 || null,
                                                                   low  : o.current.st.frequency.low * 1 || null
                                                                 },
                                                     rcDate     : new Date(o.current.st.rcDate) || null,
                                                     dcDate     : new Date(o.current.st.dcDate) || null
                                                   };
                }
  }else{
    this.current = {};
  }
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
  if(!obj._id){obj = new Client(userId, obj);}
  if(obj.rug){delete obj.rug;}

  obj._id         = Mongo.ObjectID(obj._id);
  obj.userId      = Mongo.ObjectID(userId);

  Rug.findByClientId(obj._id, function(err, rug){
    if(!rug && obj.current.admitDate){
      Rug.create(userId, obj, function(){
        Client.collection.save(obj, cb);
      });
    }else{
      Client.collection.save(obj, cb);
    }
  });
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

