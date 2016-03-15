
var mongo = require('mongoose');
var config = require('../config');

require('./mediaModel');


mongo.connect(config.database);			// Connec to the DB .
