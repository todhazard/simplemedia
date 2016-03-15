/* Tie OData models together */

var mediasmType   	   = require('./mediasmType');
var mediaType   	   = require('./mediaType');
var mediaparsedType   	   = require('./mediaparsedType');

module.exports = {
  namespace: "mediadb",
  entityTypes: {
    "UserType": {
      "_id": {"type": "Edm.String", key: true},
      "test": {"type": "Edm.String"},
    },
    "MediaType": mediaType,
  },
  entitySets: {
    "users": {
      entityType: "mediadb.UserType"
    },
      "media": {
      entityType: "mediadb.MediaType"
    },
  }
};