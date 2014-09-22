'use strict';

var Mongo  = require('mongodb');

function Treatment(){
}

Object.defineProperty(Treatment, 'collection', {
  get: function(){return global.mongodb.collection('treatments');}
});

Treatment.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Treatment.collection.findOne({_id:_id}, cb);
};

module.exports = Treatment;

