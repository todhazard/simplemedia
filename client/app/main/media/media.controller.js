(function () {
  'use strict';

  angular
    .module('app.media')
    .controller('mediaCtrl', mediaCtrl);

  /** @ngInject */
  function mediaCtrl($scope, mediaFactory, $mdDialog, $mdMedia, $document) {
    //   //function mediaCtrl($scope, mediaFactory, configData) {

    var vm = this;
    angular.extend(vm, mediaFactory);

    // set default date selection range
    var startDateStr = moment().subtract(1, 'm').format('YYYY-MM-DD').toString();
    vm.startDate = new Date(startDateStr.split("-"));

    var endDateStr = moment().format('YYYY-MM-DD').toString();

    vm.endDate = new Date(endDateStr.split("-"));

    // set default date selection min/max
    vm.minDate = new Date("2001-11-12".split(","));
    vm.maxDate = vm.endDate;

    vm.updateSearchQuery = function(){
      mediaFactory.updateSearchQuery("Date Pick", [vm.startDate, vm.endDate]);
    };

    console.log("mediaFactory.odata.fieldModels")
    console.log(mediaFactory.odata.fieldModels)


    var flds = [
      'Directory',
      'FileName',
      'Make',
      'destDir',
      'Model',
      'Orientation',
      'datePick',
      'FileSize',
      'GPSPosition',
      'GPSAltitude'
    ];

    // todo: specify members

    vm.rows.vals = [];


    vm.setYear = function (y) {
      vm.odata.enums.years.selected = y;
      updateQuery()

    };


    vm.setMonth = function (m) {
      vm.odata.enums.months.selected = m;
      updateQuery();
    };

    var getSelectedMediaItemIds = function () {
      // put selected item ids to a list
      var selectedItemList = [];
      angular.forEach(vm.rows.vals, function (item) {
        if (item.isSelected) {
          console.log("item selected")
          selectedItemList.push(item._id);
        } else {
          console.log("not selected")

        }
      });
      return selectedItemList;
    }

    /*
     *  Controller method takes key/field and updates items determined to be selected
     * */
    vm.updateSelectedItems = function (key, val) {

      // define update object
      var updateDef = {"keyval": {}};
      updateDef.keyval[key] = val;
      updateDef.ids = getSelectedMediaItemIds();

      //  send def to bach update service
      mediaFactory.runBatchUpdate(updateDef);
    };
    vm.updateBoolField = function (field, fieldName) {

      field[fieldName] = field[fieldName] * -1;
    },
      vm.updateGroupedQuery = function () {

        mediaFactory
          .fields(flds)
          .filter("substringof(datePick,'" + vm.odata.enums.years.selected + "-" + vm.odata.enums.months.selected + "')")
          .groupBy([
            'FileName',
            'Make',
            'Model',
            'datePick',
            'FileSize'])
          .orderBy(['datePick', 'asc'])
          .query(function (result) {
            vm.rows.vals = result;

          });
      };


    vm.showMediaDialog = function (e, mediaItem) {

      $mdDialog.show({
        controller: 'mediaDialogController',
        controllerAs: 'vm',
        templateUrl: 'app/main/media/dialog/dialog.html',
        parent: angular.element($document.body),
        targetEvent: e,
        clickOutsideToClose: true,
        locals: {
          mediaItem: mediaItem
        }
      }).then(function (response) {
        if (response.type === 'add') {

        }
        else {

        }
      });

      /* fix to set height of media scroll to parent view */
      vm.listStyle = {
        height: ($window.innerHeight - 112) + 'px'
      };
      $window.addEventListener('resize', onResize);
      function onResize() {
        self.listStyle.height = ($window.innerHeight - 112) + 'px';
        if (!$scope.$root.$$phase) $scope.$digest();
      }

    }


  }
})();



