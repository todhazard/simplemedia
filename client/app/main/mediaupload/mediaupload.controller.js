(function () {
  'use strict';

  angular
    .module('app.mediaupload')
    .controller('mediauploadCtrl', mediauploadCtrl);


  /** @ngInject */
  function mediauploadCtrl($scope, $http, $timeout, Upload, globalVals) {
      var vm = this;
      $scope.stat = {
        progress: 0,
        message: "",
        uploadButtonEnabled: false,
        bitsTotalUpload: 0,
        items: [],
        src64: {},
        srcImg: {},
        bitsFilesCompleted: 0
      }

      $scope.stat.items = [];
      $scope.isHTML5 = true;
      $scope.upload = [];
      $scope.fileUploadObj = {
      };
      $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 !== false);


      $scope.onFileSelect = function($files) {
        //todo: table refresh
        $scope.FileList = $files;
        $scope.uploadError = false;
        $scope.stat.items = [];
        $scope.stat.originalWidth = [];
        $scope.stat.originalHeight = [];
        $scope.stat.src64 = {};
        $scope.stat.srcImg = {};
        for (var i = 0; i < $scope.FileList.length; i++) {
          $scope.stat.items.push({
            progress: 0,
            file: $scope.FileList[i],
            isEditMe: false,
            scale: 0,
            coords: { x: 0, y: 0, x2: 0, y2: 0, w: 0, h: 0 },
            angle: 0,
            dimensions:[0,0],
            bitsSize: $scope.FileList[i].size,
            isUploading: false,
            isIncludeInList: true,
            isSuccess: false,
            isCancel: false,
            isError: false,
            isReady: true
          });
          $scope.stat.bitsTotalUpload = $scope.stat.bitsTotalUpload + ($scope.FileList[i].size);
        }
        $scope.stat.uploadButtonEnabled = true;
        $scope.stat.progress = 0;
        $scope.stat.message = "";
        $scope.stat.uploadButtonEnabled = false;
        $scope.stat.bitsTotalUpload = 0;
        $scope.stat.bitsFilesCompleted = 0;
      }


    //$scope.fupload = function(){
    //  var file = $scope.FileList[0];
    //  var fd = new FormData();
    //  fd.append('file', file);
    //  $http.post(globalVals.uploadUrl, fd, {
    //      transformRequest: angular.identity,
    //      headers: {'Content-Type': undefined}
    //    })
    //    .success(function(){
    //    })
    //    .error(function(){
    //    });
    //
    //
    //}
    //
    //$scope.fupload2 = function(){
    //  var $file = $scope.FileList[0];
    //  Upload.upload({
    //    url: globalVals.uploadUrl,
    //    method: 'POST',
    //    fields: {
    //      username: 'some name'
    //    },
    //    file: $file,
    //    fileFormDataName: 'photo'
    //  });
    //
    //}
      $scope.onUploadTriggered = function (singleUploadI) {
        var currentI = 0;
        //var fullUrl = location.protocol + "//" + location.hostname + (location.port && ":" + location.port) + "/api/files/upload";
        var maxI = $scope.FileList.length;

        if (arguments.length > 0) {
          currentI = singleUploadI;
          maxI = currentI + 1;
        }

        $scope.stat.message = "upload started";
        for (var i = currentI; i < maxI; i++) {
          var $file = $scope.FileList[i];
          $scope.stat.uploadButtonEnabled = false;
          $scope.fileUploadObj.scale = $scope.stat.items[i].scale;
          $scope.fileUploadObj.isEditMe = $scope.stat.items[i].isEditMe;
          $scope.fileUploadObj.coords = $scope.stat.items[i].coords;
          $scope.fileUploadObj.angle = $scope.stat.items[i].angle;
          $scope.fileUploadObj.dimensions = $scope.stat.items[i].dimensions;
          $scope.fileUploadObj.originalWidth = $scope.stat.originalWidth[$file.name];
          $scope.fileUploadObj.originalHeight = $scope.stat.originalHeight[$file.name];

          $scope.stat.message = "Loading file " + parseInt(i + 1) + " of " + $scope.FileList.length;
          (function (index) {
            Upload.upload({
              url: globalVals.uploadUrl,
              data: {
                otherInfo: 'isuo', file: $file
              },
              method: 'POST'
            }).then(function (resp) {
              $scope.stat.items[index].isSuccess =true;
              $scope.stat.items[index].isUploading = false;
              if (_.every($scope.stat.items, 'isSuccess', true)) {
                $scope.stat.message = "File uploads are complete";
              }
            }, function (resp) {
              $scope.uploadError = true;
              $scope.stat.items[index].isError = true;
              $scope.stat.message = "Error Encountered: " + resp.status;
               console.log(resp);
              $scope.stat.uploadButtonEnabled = false;
              return false;
            }, function (evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              // get upload percentages
              $scope.stat.items[index].isUploading = true;
              $scope.stat.items[index].isReady = false;
              $scope.stat.bitsFractionCompleted = (($scope.stat.bitsFilesCompleted + evt.loaded) / $scope.stat.bitsTotalUpload);
              $scope.stat.progress = parseInt(100.0 * ($scope.stat.bitsFractionCompleted / $scope.stat.bitsTotalUpload));
              $scope.stat.items[index].progress = parseInt(100.0 * (evt.loaded / evt.total));
              $scope.stat.progress = parseInt(100.0 * (evt.loaded / evt.total));
            });
          })(i);
        }
      }

      $scope.abortUpload = function (index) {
        $scope.stat.message = "upload aborted";
        $scope.stat.uploadButtonEnabled = false;
        $scope.upload[index].abort();
        $scope.stat.items[index].isCancel = true;
      }

      $scope.cancelSingleFile = function (index) {
        $scope.stat.items[index].isCancel = true;
        $scope.upload[index].abort();
      }

      $scope.removeSingleFile = function (index) {
        $scope.stat.items[index].isIncludeInList = false;
      }

      $scope.updateThumbnail = function(i) {

      }
  }

})();
