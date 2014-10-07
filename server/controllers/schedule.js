'use strict';

var Therapist  = require('../models/therapist'),
    Rug        = require('../models/rug'),
    Treatment  = require('../models/treatment');

exports.futureDate = function(req, res){
  Rug.getFuture(req.user._id, req.body.date, function(err, treatments){
    Therapist.getFuture(req.user._id, req.body.date, function(err, therapists){
      res.send({treatments:treatments, therapists:therapists});
    });
  });
};

exports.create = function(req, res){
  Treatment.create(req.body, function(){
    res.status(200).end();
  });
};

