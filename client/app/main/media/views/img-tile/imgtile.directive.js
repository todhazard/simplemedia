/*
 *   Directive contains dom elements and functionality to filter media service requests
 * */

(function () {
  'use strict';

  angular
    .module('app.media')
    .directive('imgTile', imgTile);

  // updateSelectedItem
  /** @ngInject */
  function imgTile(mediaFactory) {
    return {
      restrict: "E",
      scope: {
        item: '='
      },  // inherit from parent
      templateUrl: 'app/main/media/views/img-tile/img-tile.html',
      controller: function ($scope) {
        var tileVm = this;
        tileVm.item = $scope.item;

        tileVm.toggleItemSelection = function (item) {

          tileVm.item.isSelected = mediaFactory.toggleItemSelection(item._id);
        };
      },
      controllerAs: 'tileVm'
    };
  }

})();

