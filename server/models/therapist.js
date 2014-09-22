'use strict';

var Mongo  = require('mongodb');

function Therapist(){
}

Object.defineProperty(Therapist, 'collection', {
  get: function(){return global.mongodb.collection('therapists');}
});

Therapist.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Therapist.collection.findOne({_id:_id}, cb);
};

module.exports = Therapist;

