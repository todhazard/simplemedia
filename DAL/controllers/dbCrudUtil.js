/* generic mongoose controller */
sendJsonResponse = function(res, status, content){

	res.status(status); 	// Set the status ( error code if any)
	res.json(content); 		// Set the data that needs to go back to the response. 

};


parseError = function(res, status, err){
	var objKeys = Object.keys(err.errors);
	var errArray = [];
	for (var i = 0; i < objKeys.length; i++) {
		errArray.push((err.errors[objKeys[i]].message)); //Gets the message property from the embedded error object in the data object
	};
	var errResponse = {};
	errResponse.errDescriptions = errArray;
	sendJsonResponse(res, status, errResponse);

};


module.exports.getAllRecords = function(req, res, obj){

    // Query the collenction for the passed model and return all records. 
	obj.find(function(err, reqData) {	
		// Send the response back to the callign procedure. 				
		if (err) {
			parseError(res, 406, err);
		}
		else {
			sendJsonResponse(res, 200, reqData);
		}
	});
};


//
//  Returns an instance of the passed Model Object. 
//  The ID of such object is collected form the request parameters. 
//
module.exports.getSingleRecord = function(req, res, obj){

	// Get the ID of the passed object and query the collection. 
	obj.findById(req.params.id, function(err, reqData) {
		// Send the response back to the callign procedure. 
		if (err) {
			parseError(res, 406, err);
		}
		else {
			sendJsonResponse(res, 200, reqData);
		}
	});
};


//
//  Deletes  an instance of the passed Model Object. 
//  The ID of such object is collected form the request parameters. 
//
module.exports.deleteRecord = function(req, res, obj){
	
	// Get the ID od the passed object and delete it form the collection
	 obj.remove({ _id: req.params.id}, function(err, reqData) {
	 	// Send the response back to the callign procedure. 
	 	if (err) {
			parseError(res, 406, err);
		}	
		else {
			sendJsonResponse(res, 200, 'Record Succesfully Deleted');
		}	 
	});
};


//
//  Creates a record of the passed Model Object. 
//  Collects all data from the request body
//
module.exports.createRecord = function(req, res, obj){

    //  Create a brand new object with the attributes passed by the form. 

	var newObj = new obj(req.body);

	// Save the object. 
	newObj.save(function(err) {
		// Send the response back to the callign procedure. 
		if (err) {
			console.log(err);
			parseError(res, 406, err);
		 }
		 else {
			sendJsonResponse(res, 200, 'Record Sucessfully Created'); 
		 }
	});

};


//
//  Updates a record of the passed Model Object. 
//  Collects all data from the request body
//
module.exports.updateRecord= function(req, res, obj){

	// GEt the ID of the passed object.  Find it and udpate it. 
	// Make sure we pass the runVAlidators flag = true so default validation is 
	// applied to embedded documents.
	obj.findByIdAndUpdate(req.params.id, req.body,  {runValidators : true}, function(err, reqData) {
		// Send the response back to the callign procedure. 
		console.log(err);
		if (err) {
			sendJsonResponse(res, 406, err);
		}
		else {
			sendJsonResponse(res, 200, 'Record Sucessfully Updated'); 
		}
		
	});
};
