(function () {
  'use strict';

  angular
    .module('app.media')
    .controller('mediaGroupCtrl', mediaGroupCtrl);

  /* */
  /** @ngInject */
  function mediaGroupCtrl($scope, mediaFactory) {
    var vm = this;

  //todo: populate from config
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

    angular.extend(vm, mediaFactory);
    vm.rows.vals = [];

    vm.setYear = function (y) {
      vm.odata.enums.years.selected = y;
      updateQuery()

    };
    vm.setMonth = function (m) {
      vm.odata.enums.months.selected = m;
      updateQuery();
    };
    vm.updateFilteredQuery = function(){
      console.log("updateFilteredQuery called")
    };
    var updateQuery = function () {

      mediaFactory
        .fields(flds)
        .filter("substringof(datePick,'" + vm.odata.enums.years.selected + "-" + vm.odata.enums.months.selected + "')")
        .groupBy([
          'FileName',
          'Make',
          'Model',
          'datePick',
          'FileSize'])
        .query(function (result) {
          vm.rows.vals = result;


        });
    };

  }

})();
