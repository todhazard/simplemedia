/**
 * Created by todd on 3/11/2016.
 */


(function () {
  'use strict';


  angular
    .module('app.autoCompleteMultiSel')
    .factory('distinctFieldsSvc', distinctFieldsSvc);

  function distinctFieldsSvc(globalVals, $http) {


    var getDistinctFieldVals = function (modelKey, callback) {

      var url = globalVals.svcUrl + '/api/mediadistinct?fieldName=' + modelKey;

      $http({
        method: 'GET',
        url: url
      }).then(function successCallback(response) {
        if (callback) {
          callback(response);
        }

      }, function errorCallback(err) {
      });
    }

    return {'getDistinctFieldVals': getDistinctFieldVals}
  }


})();



