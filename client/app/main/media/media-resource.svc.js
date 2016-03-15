(function () {
  'use strict';

  angular
    .module('app.media')
    .factory("Resource", Resource);

  /** @ngInject */
  function Resource($resource) {
    return function (url, params, methods) {
      var defaults = {
        update: {method: 'post', isArray: false},
        create: {method: 'post'},
        remove: {method: 'delete'}
      };

      methods = angular.extend(defaults, methods);

      var resource = $resource(url, params, methods);

      resource.prototype.$save = function () {
        if (!this.id) {
          this.id = -1;
          return this.$create();
        }
        else {
          return this.$update();
        }
      };

      resource.prototype.$delete = function () {
        return this.$remove();
      };

      return resource;
    }
  }

  angular
    .module('app.media')
    .factory('configSvc', configSvc);

  function configSvc($resource, globalVals) {
    var urlPath = globalVals.configUrl;
      return $resource(urlPath, {});
  }

})();
