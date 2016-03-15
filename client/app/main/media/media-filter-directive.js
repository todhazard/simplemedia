/*
*   Directive contains dom elements and functionality to filter media service requests
* */

(function () {
  'use strict';

  angular
    .module('app.media')
    .directive('mediaFilter', mediaFilter);

  /** @ngInject */
  function mediaFilter(mediaFactory) {
    return {
      scope: true,  // inherit from parent
      templateUrl: 'app/main/media/media-filter.html',
    };
  }

})();

