'use strict';

var Treatment = require('../models/treatment');

exports.getPast = function(req, res){
  Treatment.getPast(req.user._id, function(err, treatments){
    res.send({treatments:treatments});
  });
};

exports.archive = function(req, res){
  Treatment.archive(req.body, function(){
    res.status(200).end();
  });
};

exports.save = function(req, res){
  Treatment.update(req.body, function(){
    res.status(200).end();
  });
};

exports.remove = function(req, res){
  Treatment.remove(req.params.id, function(){
    res.status(200).end();
  });
};

exports.unArchive = function(req, res){
  Treatment.unArchive(req.body.id, function(){
    res.status(200).end();
  });
};
