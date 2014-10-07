'use strict';

var Mongo  = require('mongodb'),
    async  = require('async');

function Rug(userId, client){
  var date, day;

  this.clientId = Mongo.ObjectID(client._id);
  this.userId   = Mongo.ObjectID(userId);
  this.calc     = {};
  for(var i = 0; i < 100; i++){
    date = new Date(client.current.admitDate);
    day = date.setDate(date.getDate() + i);
    day = new Date(day).setHours(0, 0, 0, 0);
    this.calc[day]           = {};
    this.calc[day].pt        = {};
    this.calc[day].pt.proj   = 0;
    this.calc[day].pt.actual = 0;
    this.calc[day].ot        = {};
    this.calc[day].ot.proj   = 0;
    this.calc[day].ot.actual = 0;
    this.calc[day].st        = {};
    this.calc[day].st.proj   = 0;
    this.calc[day].st.actual = 0;
  }
}

Object.defineProperty(Rug, 'collection', {
  get: function(){return global.mongodb.collection('rugs');}
});

Rug.all = function(id, cb){
  Rug.collection.find({userId:id}).toArray(cb);
};

Rug.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Rug.collection.findOne({_id:_id}, cb);
};

Rug.findByClientId = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Rug.collection.findOne({clientId:_id}, cb);
};

Rug.create = function(userId, client, cb){
  var r = new Rug(userId, client);
  Rug.collection.save(r, cb);
};

Rug.update = function(rug, cb){
  rug._id      = Mongo.ObjectID(rug._id);
  rug.clientId = Mongo.ObjectID(rug.clientId);
  rug.userId   = Mongo.ObjectID(rug.userId);

  Rug.collection.save(rug, cb);
};

Rug.getFuture = function(userId, date, cb){
  var treatments = {pt: [], ot: [], st:[]},
      modDate    = date.split('T');

  modDate = modDate[0].split('-').join(', ');

  date = new Date(modDate).setHours(0, 0, 0, 0);

  Rug.all(userId, function(err, rugs){
    rugs.forEach(function(rug){
      if(rug.calc[date]){
        if(rug.calc[date].pt.proj){
          treatments.pt.push({
            clientId   : rug.clientId,
            txDate     : new Date(date),
            discipline : 'PT',
            mins       : rug.calc[date].pt.proj
          });
        }
        if(rug.calc[date].ot.proj){
          treatments.ot.push({
            clientId   : rug.clientId,
            txDate     : new Date(date),
            discipline : 'OT',
            mins       : rug.calc[date].ot.proj
          });
        }
        if(rug.calc[date].st.proj){
          treatments.st.push({
            clientId   : rug.clientId,
            txDate     : new Date(date),
            discipline : 'ST',
            mins       : rug.calc[date].st.proj
          });
        }
      }
    });

    async.map(treatments.pt, iterator, function(){
      async.map(treatments.ot, iterator, function(){
        async.map(treatments.st, iterator, function(){
          cb(null, treatments);
        });
      });
    });
  });
};

Rug.makeMinsActual = function(tx, cb){
  Rug.findByClientId(tx.clientId, function(err, rug){
    var date = new Date(tx.txDate).setHours(0, 0, 0, 0);

    rug.calc[date][tx.discipline.toLowerCase()].actual = tx.mins * 1;

    Rug.update(rug, cb);
  });
};

module.exports = Rug;

//private helper functions

function iterator(tx, cb){
  var Client = require('./client');
  Client.findById(tx.clientId, function(err, client){
    tx.clientName = client.name;
    cb(null, tx);
  });
}
