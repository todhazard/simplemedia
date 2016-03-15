/**
 * Created by todd on 3/11/2016.
 */

// Summary:
// Controller to return distinct vals on specified field
//

var media = require('mongoose').model('media');   		// Load the data model needed for this controller
//var crud = require('./dbCrudUtil');				// Load the CRUD utility -- This utility does all the work




// get all Medias
module.exports.getDistinctVals = function (req, res) {

    var fieldName=req.query.fieldName;

    media.distinct(fieldName, { }, function(err, data) {
        // Send the response back to the callign procedure.

        if (err) {
            res.status(406);
            res.json("err");
        }
        else {

            res.status(200);
            res.send(data);
        }
    });

};





