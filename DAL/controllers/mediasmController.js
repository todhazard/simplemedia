

// Summary:
// Controller for CRUD operations for the Media model


var objModel = require('mongoose').model('mediasm');   		// Load the data model needed for this controller
var crud = require('./dbCrudUtil');				// Load the CRUD utility -- This utility does all the work


// create single Media
module.exports.createOneMediasm = function (req, res) {

    crud.createRecord(req, res, objModel);

};

// get all Mediasm
module.exports.getAllMediassm = function (req, res) {

    crud.getAllRecords(req, res, objModel);
};

// get one Media
module.exports.getOneMediasm = function (req, res) {

    crud.getSingleRecord(req, res, objModel);
};

// update single Media
module.exports.updateMediasm = function (req, res) {

    crud.updateRecord(req, res, objModel);
};

// ddelete single Media
module.exports.deleteMediasm = function (req, res) {

    crud.deleteRecord(req, res, objModel);

};