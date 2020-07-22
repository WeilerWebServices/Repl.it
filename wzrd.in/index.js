var express = require('express'),
    log = require('minilog')('browserify-cdn'),
    cors = require('cors'),
    compression = require('compression');

var bundler = require('./bundler'),
    defaults = require('./defaults'),
    admin = require('./admin'),
    requestLogger = require('./request-logger');

var app = express(),
    bundle = bundler(defaults());

var singular = require('./singular'),
    multiple = require('./multiple'),
    statuses = require('./statuses');

app.routes = new express.Router();

//
// Add static assets
//
app.use(requestLogger);
app.use(cors());
app.use(app.routes);
app.use(compression());
app.use(express.static(__dirname + '/public'));

//
// Admin REST API
//
admin(app.routes, bundle);

//
// Single-module bundles
//
singular(app.routes, bundle);

//
// Multiple-module bundles
//
multiple(app.routes, bundle);

//
// Build statuses
//
statuses(app.routes, bundle);

//
// Exports
//
exports.app = app;
exports.bundler = bundler;
exports.defaults = defaults;
