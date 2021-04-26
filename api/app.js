import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import routes from './routes'
import http from 'http'
import multipart from 'connect-multiparty'
import settings from './config/settings';
import geolib from 'geolib';

const https = require('https')
const fs = require('fs');


const app = express();
const server = http.Server(app);

const cert = fs.readFileSync('./certificate.crt');
const ca = fs.readFileSync('./ca_bundle.crt');
const key = fs.readFileSync('./private.key');


// Define garbage collector
if (global.gc) {
  setInterval(() => {
    global.gc();
  }, 30000);
}

// Define HttpError class
class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Define DbError class
class DbError extends Error {
  constructor(message, code) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

// (+) LIBRARIES

// Define lib
const lib = {};

// Define http error
lib.httpError = (status, message) => {

  // Define result
  let result = new Error(message);

  // Define result status
  result.status = status || 400;

  // Return result
  return result;
};

// Define db error
lib.dbError = (code, message) => {

  // Define result
  let result = new Error(message);

  // Define result status
  result.code = code || -1000;

  // Return result
  return result;
};

// Define lib jsonwebtoken
lib.jsonwebtoken = require('jsonwebtoken');

// Define lib crypto
lib.bcrypt = require('bcrypt');

// Define lib uuid
lib.uuid = require('uuid');

// Define lib fs
lib.fs = require('fs');

// Define lib url
lib.url = require('url');

// Define lib moment
lib.moment = require('moment');

// Define lib trae
lib.trae = require('trae');

// Define crypto
lib.crypto = require('crypto');

// Define geolib
lib.geolib = require('geolib');

// Define lib password generator
lib.passwordGenerator = require('password-generator')

// Define lib nodeMailer
lib.nodemailer = require('nodemailer');

// Define lib utils
lib.utils = {

  // Define method
  // to normalize file name (the-name -> theName)
  normalizeFileName: (value) => {
    return value.replace(/\.js$/, '').replace(/\./g, ' ').replace(/_/g, ' ').replace(/\W+(.)/g, function(match, chr) {
      return chr.toUpperCase();
    });
  }
};

// Define lib mongoose
lib.mongodb = {};
lib.mongodb.mongoose = require('mongoose');
lib.mongodb.plugins = [];
lib.mongodb.plugins.push(require('mongoose-unique-validator'));
lib.mongodb.plugins.push(require('meanie-mongoose-to-json'));

// (-) LIBRARIES



let options = {
   cert: cert,
   ca: ca,
   key: key
};

https.createServer(options, app).listen(settings.portHttps);


app.use(function (req, res, next) {
	if (process.env.NODE_ENV && process.env.NODE_ENV == 'test') {
		req.settings = require('./test/config/settings')
	} else {
		req.settings = require('./config/settings')
	}
	return next()
})


// cache control error 304
app.disable('etag');

// CORS
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, Accept, x-access-token, x-accepted-format')
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
	next()
})

app.use(multipart({
	uploadDir: '/tmp/'
}))

app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({
	parameterLimit: 100000,
	limit: '50mb',
	extended: true
}));

app.use(cookieParser())


// (+) DATABASE

global.database = {};
global.database.mongodb = lib.mongodb;

// (-) DATABASE



// (+) HELPERS

// Define helpers
let helpersLoad = {};
let helpersPath = __dirname + '/helpers';
lib.fs.readdirSync(helpersPath).forEach((helperCode) => {
    let helperName = lib.utils.normalizeFileName(helperCode);
    let helperPath = helpersPath + '/' + helperCode;
    lib.fs.readdirSync(helperPath).forEach((helperFile) => {
      if (helperFile.match(/\.js$/)) {
        let methodName = lib.utils.normalizeFileName(helperFile);
        helpersLoad[helperName] = helpersLoad[helperName] || {};
        helpersLoad[helperName][methodName] = require(helperPath + '/' + helperFile);
      }
    });
});

// Verify helpers
global.helpers = {};
for (let h in helpersLoad) {
  global.helpers[h] = {};
  global.helpers[h].settings = settings;
  // global.helpers[h].server = server;
  global.helpers[h].router = express.Router();
  global.helpers[h].app = app;
  // global.helpers[h].db = db;
  global.helpers[h].lib = lib;
  for (let f in helpersLoad[h]) {
    if (helpersLoad[h][f] && typeof helpersLoad[h][f] == 'function') {
      try {
        global.helpers[h][f] = helpersLoad[h][f](global.helpers[h]);
        console.info('Helper "' + h + '.' + f + '" loaded');
      } catch(error) {
        console.error('Helper "' + h + '.' + t + '" not loaded');
        console.error(error);
      }
    }
  }
}

// (-) HELPERS



// (+) MODULES

// Define modules
let modulesLoad = {};
let modulesPath = __dirname + '/modules';
lib.fs.readdirSync(modulesPath).forEach((moduleCode) => {
  let moduleName = lib.utils.normalizeFileName(moduleCode);
  let modulePath = modulesPath + '/' + moduleCode;
  lib.fs.readdirSync(modulePath).forEach((moduleFile) => {
    if (moduleFile.match(/\.js$/)) {
      let methodName = lib.utils.normalizeFileName(moduleFile);
      modulesLoad[moduleName] = modulesLoad[moduleName] || {};
      modulesLoad[moduleName][methodName] = require(modulePath + '/' + moduleFile);
    }
  });
});

// Verify modules
global.modules = {};
for (let m in modulesLoad) {
  global.modules[m] = {};
  global.modules[m].settings = settings;
  // global.modules[m].server = server;
  global.modules[m].router = express.Router();
  global.modules[m].app = app;
  // global.modules[m].db = db;
  global.modules[m].lib = lib;
  for (let t in modulesLoad[m]) {
    if (modulesLoad[m][t] && typeof modulesLoad[m][t] == 'function') {
      try {
        modulesLoad[m][t](global.modules[m]);
        console.info('Module "' + m + '.' + t + '" loaded');
      } catch(error) {
        console.error('Module "' + m + '.' + t + '" not loaded');
        console.error(error);
      }
    }
  }
}

// Build models
for (let m in global.modules) {
  if (global.modules[m].schema) {
     for (let p of global.database.mongodb.plugins) global.modules[m].schema.plugin(p);
  	 global.modules[m].model = global.database.mongodb.mongoose.model(m, global.modules[m].schema);
  }
}


// Verify modules models events
for (let m in global.modules) {
  if (global.modules[m].model && global.modules[m].model.beforeExecuteLoad) {
    global.modules[m].model.beforeExecuteLoad();
  }
}

// Define api routes
for (let m in global.modules) {
  if (global.modules[m].router) {
    console.log(global.modules[m].model);
    app.use('/api/' + m + '/', global.modules[m].router);
  }
}

// (-) MODULES



/*
 * @static content
 * app.use('/speechToText', express.static(path.join(__dirname, './static/speechToText.html')));
 * app.use('/files', express.static(path.join(__dirname, './static/files/')));
 */
app.use('/api', routes)

app.use('/', express.static(path.join(__dirname, '../adm/dist/adm/')))
app.use('/files', express.static(path.join(__dirname, '../adm/files/')))

app.get('/*',  function(req, res) {
	res.sendFile('index.html', { root: '../adm/dist/adm/' })
})


// Define api error middleware
app.use("/api", (error, req, res, next) => {
  res.status(error.status || 400).send({
    message: error.message
  });
});

export {app, server}
