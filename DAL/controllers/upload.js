'use strict';
/* controller to manage media uploads */
var fs = require('fs');
var config = require('../config');

exports.fileUploader = function(req, res) {
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename) {

        var fstream = fs.createWriteStream(config.uploadDest+filename+'_' + Date.now());


        file.pipe(fstream);
        fstream.on('close', function (err) {
            if(err){
                return res.end(err);
            }

            res.writeHead(303, { Connection: 'close', Location: '/' });
        });
    });

};
