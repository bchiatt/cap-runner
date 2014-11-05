'use strict';

var Mongo  = require('mongodb'),
    fs     = require('fs'),
    path   = require('path');

function Therapist(userId, obj){
  this._id           = Mongo.ObjectID(obj._id) || Mongo.ObjectId();
  this.userId        = Mongo.ObjectID(userId);
  this.name          = obj.name;
  this.discipline    = obj.discipline;
  this.productivity  = obj.productivity * 1 || null;
  this.isTherapist   = (obj.isTherapist ? true : false);
  this.isFullTime    = (obj.isFullTime ? true : false);
  this.photo         = '/assets/img/default.jpg';
  this.lateEvals     = obj.lateEvals || {
                                          mon : false,
                                          tue : false,
                                          wed : false,
                                          thu : false,
                                          fri : false
                                        };
  if(obj.lateEvals){
    this.lateEvals     = {
      mon : obj.lateEvals.mon || false,
      tue : obj.lateEvals.tue || false,
      wed : obj.lateEvals.wed || false,
      thu : obj.lateEvals.thu || false,
      fri : obj.lateEvals.fri || false
    };
  }

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

Therapist.create = function(userId, obj, cb){
  obj = new Therapist(userId, obj);
  Therapist.collection.save(obj, cb);
};

Therapist.update = function(userId, obj, cb){
  obj._id    = Mongo.ObjectID(obj._id);
  obj.userId = Mongo.ObjectID(userId);
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

Therapist.getFuture = function(userId, date, cb){
  var therapists        = {};

  therapists.active = {pt: [], ot: [], st: []};
  therapists.oncall = {pt: [], ot: [], st: []};

  date = getDayOfWeek(date);

  Therapist.all(userId, function(err, all){
    all.forEach(function(therapist){
      therapist.treatments = [];
      therapist.txMins     = 0;
      if(therapist.isTherapist && therapist.schedule[date].mins){
        therapist.schedule = therapist.schedule[date];
        switch (therapist.discipline){
          case 'PT':
            therapists.active.pt.push(therapist);
            break;
          case 'OT':
            therapists.active.ot.push(therapist);
            break;
          case 'ST':
            therapists.active.st.push(therapist);
            break;
        }
      }else{
        switch (therapist.discipline){
          case 'PT':
            therapists.oncall.pt.push(therapist);
            break;
          case 'OT':
            therapists.oncall.ot.push(therapist);
            break;
          case 'ST':
            therapists.oncall.st.push(therapist);
            break;
        }
      }
    });
    cb(err, therapists);
  });
};

module.exports = Therapist;

// Private helper functions
function getDayOfWeek(date){
  var days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
      day  = new Date(date).getUTCDay();

  date = days[day];

  return date;
}
