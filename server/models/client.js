'use strict';

var Mongo  = require('mongodb');

function Client(){
}

Object.defineProperty(Client, 'collection', {
  get: function(){return global.mongodb.collection('clients');}
});

Client.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Client.collection.findOne({_id:_id}, cb);
};

module.exports = Client;

