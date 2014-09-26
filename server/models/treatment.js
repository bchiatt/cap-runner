'use strict';

var Mongo     = require('mongodb'),
    async     = require('async'),
    Client    = require('./client'),
    Rug       = require('./rug'),
    Therapist = require('./therapist');

function Treatment(obj){
  this.userId      = Mongo.ObjectID(obj.userId);
  this.clientId    = Mongo.ObjectID(obj.clientId);
  this.therapistId = Mongo.ObjectID(obj.therapistId);
  this.txDate      = new Date(obj.txDate);
  this.mins        = obj.mins;
  this.discipline  = obj.discipline;
  this.isArchived  = false;
  this.review      = {
                       isNote: false,
                       isMins: false
                     };
}

Object.defineProperty(Treatment, 'collection', {
  get: function(){return global.mongodb.collection('treatments');}
});

Treatment.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Treatment.collection.findOne({_id:_id}, cb);
};

Treatment.update = function(tx, cb){
   tx._id         = Mongo.ObjectID(tx._id);
   tx.userId      = Mongo.ObjectID(tx.userId);
   tx.clientId    = Mongo.ObjectID(tx.clientId);
   tx.therapistId = Mongo.ObjectID(tx.therapistId);
   tx.txDate      = new Date(tx.txDate);

   delete tx.temp;

   Treatment.collection.save(tx, cb);
};

Treatment.create = function(obj, cb){
  var newTxs = [];

  obj.active.pt.forEach(function(therapist){
    therapist.treatments.forEach(function(tx){
      tx.therapistId = therapist._id;
      tx.userId      = therapist.userId;
      newTxs.push(tx);
    });
  });

  obj.active.ot.forEach(function(therapist){
    therapist.treatments.forEach(function(tx){
      tx.therapistId = therapist._id;
      tx.userId      = therapist.userId;
      newTxs.push(tx);
    });
  });

  obj.active.st.forEach(function(therapist){
    therapist.treatments.forEach(function(tx){
      tx.therapistId = therapist._id;
      tx.userId      = therapist.userId;
      newTxs.push(tx);
    });
  });

  async.map(newTxs, iterator, cb);
};

Treatment.getPast = function(id, cb){
  Treatment.collection.find({userId:id}).toArray(function(err, txs){
    async.map(txs, addTherapist, function(){
      async.map(txs, addClient, function(){
        cb(null, txs);
      });
    });
  });
};

Treatment.archive = function(tx, cb){
  tx.isArchived = true;
  Rug.makeMinsActual(tx, function(){
    Treatment.update(tx, cb);
  });
};

Treatment.remove = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Treatment.collection.remove({_id:_id}, cb);
};

module.exports = Treatment;

//private helper function
function iterator(tx, cb){
  var newTx = new Treatment(tx);
  Treatment.collection.save(newTx, cb);
}

function addTherapist(tx, cb){
  Therapist.findById(tx.therapistId, function(err, therapist){
    tx.temp = {};
    tx.temp.therapist = therapist.name;
    cb(null, tx);
  });
}

function addClient(tx, cb){
  Client.findById(tx.clientId, function(err, client){
    tx.temp.client = client;
    cb(null, tx);
  });
}
