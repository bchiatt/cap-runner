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
    schedule       = require('../controllers/schedule'),
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
  app.get('/clients/:id/rug', clients.rug);
  app.delete('/clients/:id', clients.remove);
  app.get('/clients', clients.index);
  app.post('/clients/rug', clients.updateRug);
  app.post('/clients', clients.create);
  app.put('/clients', clients.update);
  app.post('/clients/photo', clients.photo);
  app.get('/therapists', therapists.index);
  app.post('/therapists', therapists.create);
  app.put('/therapists', therapists.update);
  app.delete('/therapists/:id', therapists.remove);
  app.post('/therapists/photo', therapists.photo);
  app.post('/schedule/new', schedule.create);
  app.post('/schedule', schedule.futureDate);
  app.get('/treatments', treatments.getPast);
  app.post('/treatments', treatments.archive);
  app.put('/treatments', treatments.save);
  app.delete('/treatments/:id', treatments.remove);
  app.delete('/logout', users.logout);

  console.log('Express: Routes Loaded');
};

