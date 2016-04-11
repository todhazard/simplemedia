(function () {
  'use strict';

  angular
    .module('app.media')
    .controller('mediaCtrl', mediaCtrl);

  /** @ngInject */
  function mediaCtrl($scope, mediaFactory, $mdDialog, $document, $rootScope, globalConstants, $mdMedia) {

    var vm = this;
    angular.extend(vm, mediaFactory);

    console.log("in header controller")
    // set default date selection range
    var startDateStr = moment().subtract(1, 'm').format('YYYY-MM-DD').toString();
    var endDateStr = moment().format('YYYY-MM-DD').toString();

    var updateMonthlyViewQuery = function () {
      var groupByFields = [];


      // if view displays grouped sets
      if (globalConstants.userState.selectedView === "groupView") {

        groupByFields = [
          'FileName',
          'Make',
          'Model',
          'datePick',
          'FileSize'];
      }

      mediaFactory
        .fields(vm.odata.fieldsList)
        .filter("substringof(datePick,'" + vm.odata.dates.selectedYear + "-" + vm.odata.dates.selectedMonth + "')")
        .groupBy(groupByFields)
        .query(function (result) {
          console.log("in query, result = ")
          console.log(result)
          if (globalConstants.userState.selectedView === "groupView") {
            console.log("vm.rows.vals")
            //console.log(JSON.stringify(result))
          }
          vm.rows.vals = result;
        });

    };

    vm.updateSelectedItems = function (key, val) {
      mediaFactory.updateSelectedItems(key, val)
    };

    vm.updateBoolField = function (field, fieldName) {

      field[fieldName] = field[fieldName] * -1;
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

    vm.startDate = new Date(startDateStr.split("-"));
    vm.endDate = new Date(endDateStr.split("-"));

    // set default date selection min/max
    vm.minDate = new Date("2001-11-12".split("-"));

    vm.maxDate = vm.endDate;

    vm.updateSearchQuery = function () {
      mediaFactory.updateSearchQuery("Date Pick", [vm.startDate, vm.endDate]);
    };

    vm.updateSelectedItems = function (key, val) {
      mediaFactory.updateSelectedItems(key, val)
    };

    vm.updateGroupedQuery = function () {

      mediaFactory
        .fields(flds)
        .filter("substringof(datePick,'" + vm.odata.dates.selectedYear + "-" + vm.odata.dates.selectedMonth + "')")
        .groupBy([
          'FileName',
          'Make',
          'Model',
          'datePick',
          'FileSize'])
        //  .orderBy(['datePick', 'asc'])
        .query(function (result) {
          vm.rows.vals = result;
        });
    };

    vm.setYear = function (y) {
      console.log("setYear")

      vm.odata.dates.selectedYear = y; //todo: remove

      updateMonthlyViewQuery()

    };


    //,,,
    vm.setMonth = function (m) {
      console.log("set month")
      vm.odata.dates.selectedMonth = m; //todo: remove
      updateMonthlyViewQuery();
    };
    
  }
})();



