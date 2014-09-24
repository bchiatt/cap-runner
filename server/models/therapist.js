'use strict';

var Mongo  = require('mongodb'),
    fs     = require('fs'),
    path   = require('path');

function Therapist(userId, obj){
  this._id           = Mongo.ObjectID(obj._id) || Mongo.ObjectId();
  this.userId        = Mongo.ObjectID(userId);
  this.name          = obj.name;
  this.discipline    = obj.discipline;
  this.productivity  = obj.productivity * 1;
  this.isTherapist   = (obj.isTherapist ? true : false);
  this.isFullTime    = (obj.isFullTime ? true : false);
  this.photo         = obj.photo || '/assets/img/default.jpg';
  this.lateEvals     = {
                 mon : obj.lateEvals.mon || false,
                 tue : obj.lateEvals.tue || false,
                 wed : obj.lateEvals.wed || false,
                 thu : obj.lateEvals.thu || false,
                 fri : obj.lateEvals.fri || false
  };
  this.schedule      = obj.schedule || {};
}

Object.defineProperty(Therapist, 'collection', {
  get: function(){return global.mongodb.collection('therapists');}
});

Therapist.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Therapist.collection.findOne({_id:_id}, cb);
};

Therapist.all = function(id, cb){
  Therapist.collection.find({userId:id}).toArray(cb);
};

Therapist.update = function(userId, obj, cb){
  obj = new Therapist(userId, obj);
  Therapist.collection.save(obj, cb);
};

Therapist.remove = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Therapist.collection.remove({_id:_id}, cb);
};

Therapist.photo = function(therapist, files, cb){
  var dir    = __dirname + '/../../public/assets/img/' + therapist._id,
      exist  = fs.existsSync(dir),
      self   = therapist;

  if(!exist){
    fs.mkdirSync(dir);
  }

  var ext    = path.extname(files.file[0].path),
      rel    = '/assets/img/' + self._id + '/profile' + ext,
      abs    = dir + '/profile' + ext;
  fs.renameSync(files.file[0].path, abs);

  self.photo = rel;

  Therapist.collection.save(self, function(){
    cb(null, self);
  });

};

module.exports = Therapist;

