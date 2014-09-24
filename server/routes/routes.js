'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    session        = require('express-session'),
    RedisStore     = require('connect-redis')(session),
    debug          = require('../lib/debug'),
    security       = require('../lib/security'),
    clients        = require('../controllers/clients'),
    therapists     = require('../controllers/therapists'),
    treatments     = require('../controllers/treatments'),
    users          = require('../controllers/users');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(express.static(__dirname + '/../../public'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(session({store:new RedisStore(), secret:'my super secret key', resave:true, saveUninitialized:true, cookie:{maxAge:null}}));

  app.use(security.authenticate);
  app.use(debug.info);

  app.post('/register', users.register);
  app.post('/login', users.login);

  app.use(security.bounce);
  app.get('/clients', clients.index);
  app.post('/clients', clients.update);
  app.delete('/clients/:id', clients.remove);
  app.post('/clients/photo', clients.photo);
  app.get('/therapists', therapists.index);
  app.post('/therapists', therapists.update);
  app.delete('/therapists/:id', therapists.remove);
  app.post('/therapists/photo', therapists.photo);
  app.get('/schedule', treatments.index);
  app.delete('/logout', users.logout);

  console.log('Express: Routes Loaded');
};

