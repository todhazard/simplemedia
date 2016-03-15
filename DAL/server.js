
// modules section...
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var config   	   = require('./config');
var odataModel   	= require('./models/odataModel');
var ODataServer = require("simple-odata-server");
var MongoClient = require('mongodb').MongoClient;
var cluster        = require('cluster');
var upload = require('./controllers/upload');
var batchWorker = require('./controllers/batchWorker');
var busboy = require('connect-busboy');
var mongo = require('mongoose');


// define headers , encoding
app.all('/', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.use(bodyParser.urlencoded({ extended: true })); 			// parse application/x-www-form-urlencoded...;
app.use(bodyParser.json());


//// initialize uploading service
app.use(busboy());
app.post('/api/upload',upload.fileUploader);


require('./models/mediaModel');
mongo.connect(config.database);


// initializa odata services
var odataServer = ODataServer()
	.model(odataModel)

MongoClient.connect(config.database, function(err, db) {
	odataServer.onMongo(function(cb) { cb(err, db); });
});

app.use("/odata", function (req, res) {
	odataServer.handle(req, res);
});



// initialize batch worker service
app.post('/api/batch',batchWorker.updateMedia);

// routes section...
var apiRouter = require('./routes/apiRoutes');		// load the routes to our variable
app.use('/api', apiRouter);  						// Inject the routes to the application


// cluster services 
if (cluster.isMaster) {
	var numWorkers = require('os').cpus().length;
	console.log('Master cluster setting up ' + numWorkers + ' workers.');

	for (var i = 0; i < numWorkers; i++) {
		cluster.fork();
	}

	cluster.on('online', function (worker) {
		console.log('worker ' + worker.process.pid + ' is online')
	});

	cluster.on('exit', function (worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died with code: ' + code + ', and signal ' + signal);
		console.log('Starting a new worker');
		cluster.fork();
	})
} else {
	//app start-up...
	app.listen(config.port);
	console.log('Media Manager  API is listening on port ' + config.port);	// display output to the console...
	console.log('Press Ctrl + C to stop this server.');
	exports = module.exports = app;
}







