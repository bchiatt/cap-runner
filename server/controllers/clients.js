'use strict';

var Client = require('../models/client'),
    Rug    = require('../models/rug'),
    mp     = require('multiparty');

exports.index = function(req, res){
  Client.all(req.user._id, function(err, clients){
    res.send({clients:clients});
  });
};

exports.update = function(req, res){
  Client.update(req.user._id, req.body, function(){
    Client.all(req.user._id, function(err, clients){
      res.send({clients:clients});
    });
  });
};

exports.photo = function(req, res){
  var form = new mp.Form();
  form.parse(req, function(err, fields, files){
    Client.findById(fields.myObj[0], function(err, client){
      Client.photo(client, files, function(err, client){
        res.send({client:client});
      });
    });
  });
};

exports.remove = function(req, res){
  Client.remove(req.params.id, function(){
    res.status(200).end();
  });
};

exports.rug = function(req, res){
  Rug.findByClientId(req.params.id, function(err, rug){
    res.send({rug:rug});
  });
};

exports.updateRug = function(req, res){
  Rug.update(req.body, function(){
    res.status(200).end();
  });
};
