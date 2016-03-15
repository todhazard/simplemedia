
// Author:
// Date: 02-07-2016
//
// Summary:
// Controller for CRUD operations for the Media model
//

var objModel = require('mongoose').model('media');   		// Load the data model needed for this controller
var crud = require('./dbCrudUtil');				// Load the CRUD utility -- This utility does all the work


// create single Media
module.exports.createOneMedia = function (req, res) {

    crud.createRecord(req, res, objModel);

};

// get all Medias
module.exports.getAllMedias = function (req, res) {
console.log("get all data")
  //  crud.getAllRecords(req, res, objModel);
};

// get one Media
module.exports.getOneMedia = function (req, res) {

    crud.getSingleRecord(req, res, objModel);
};

// update single Media
module.exports.updateMedia = function (req, res) {

    crud.updateRecord(req, res, objModel);
};

// ddelete single Media
module.exports.deleteMedia = function (req, res) {

    crud.deleteRecord(req, res, objModel);

};

// get vals on distinct fields
