'use strict';
/*
 *
 * A service to receive and handle batch update tasks on mongo
 *
 * */

var db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID,

    config = require("../config"),
    _ = require("lodash"),
    moment = require("moment");


/*
 *
 * Batch update -  specify single collection for update (key / vals), and array (id list) of  documents to update:
 * sample :

             var updateDef = {
             "keyval" : {},
             "ids" : [],
             };

 * */

exports.updateMedia = function (req, res) {

    var url = config.database;
    var ids = req.body.ids;
    var keyval = req.body.keyval;

    MongoClient.connect(url, function (err, db) {

        if (err) return;

        var collection = db.collection('media');

        _.each(ids, function (id) {

            collection.updateOne({_id: ObjectId(id)},
                {$set: keyval}, function (err, result) {
                    if (err) {

                    }
                    if (result) {

                    }
                }
            );
        })


    });
    res.send("success");

};


