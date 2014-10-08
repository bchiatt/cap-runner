'use strict';

var Therapist = require('../models/therapist'),
    mp        = require('multiparty');

exports.index = function(req, res){
  Therapist.all(req.user._id, function(err, therapists){
    res.send({therapists:therapists});
  });
};

exports.create = function(req, res){
  Therapist.create(req.user._id, req.body, function(){
    Therapist.all(req.user._id, function(err, therapists){
      res.send({therapists:therapists});
    });
  });
};

exports.update = function(req, res){
  Therapist.update(req.user._id, req.body, function(){
    Therapist.all(req.user._id, function(err, therapists){
      res.send({therapists:therapists});
    });
  });
};

exports.photo = function(req, res){
  var form = new mp.Form();
  form.parse(req, function(err, fields, files){
    Therapist.findById(fields.myObj[0], function(err, therapist){
      Therapist.photo(therapist, files, function(err, therapist){
        res.send({therapist:therapist});
      });
    });
  });
};

exports.remove = function(req, res){
  Therapist.remove(req.params.id, function(){
    res.status(200).end();
  });
};
