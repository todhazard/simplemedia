(function () {
  'use strict';

  /*
  * Core module, configuration, and routes
  * */
  angular
    .module('app.media', [])

    // set globals - url paths and browser identity
    .value('globalVals', {
      env: "dev",
      svcPort: "3030",
      appUrl: location.protocol + "//" + location.hostname + ":" + location.port,
      odataUrl: location.protocol + "//" + location.hostname + ":3030/odata/media",
      svcUrl: location.protocol + "//" + location.hostname + ":3030",
      uploadUrl: location.protocol + "//" + location.hostname + ":3030/api/upload",
      batchApiUrl: location.protocol + "//" + location.hostname + ":3030/api/batch",
      configUrl: location.protocol + "//" + location.hostname + ":" + location.port + "/app/main/media/config/config.json",
      browser: function () {
        return function () {
          // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
          if (!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
            var isOpera = 'Opera';
            return 'Opera';
          }
          // Firefox 1.0+
          if (typeof InstallTrigger !== 'undefined') {
            return 'Firefox';
          }
          // At least Safari 3+: "[object HTMLElementConstructor]"
          if (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) {
            return 'Safari';
          }
          // Chrome 1+
          if (!!window.chrome && !isOpera) {
            return 'Chrome'
          }
          // At least IE6
          if (/*@cc_on!@*/false || !!document.documentMode) {
            return 'IE'
          }
        }
      }
    })

  angular
    .module('app.media')
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider, $mdDateLocaleProvider){

    // set date type for datepicker format
    $mdDateLocaleProvider.formatDate = function(date) {
      return date ? moment(date).format('YYYY-MM-DD') : '';
    };

    $mdDateLocaleProvider.parseDate = function(dateString) {
      var m = moment(dateString, 'YYYY-MM-DD', true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };



    $stateProvider
      .state('app.media', {
        abstract: true,
        url: '/media',
        resolve: {
          // todo: implement config at resolve?
          appConf: function (globalVals, $http, $q) {


            return {};
          }
        }
      })

      // define nested ui-route state for table / details view
      .state('app.media.view', {
        url: '/view',
        views: {
          'content@app': {
            templateUrl: 'app/main/media/media.index.html',
            controller: 'mediaCtrl as vm'
          },
          'mediaviewContent@app.media.view': {
            templateUrl: 'app/main/media/media-view-list.html',
            controller: 'mediaCtrl as vm'
          },

        }

      })

      // main filter and body
      .state('app.media.view.tile', {
        url: '/edit',
        views: {
          'mediaviewContent@app.media.view': {
            templateUrl: 'app/main/media/media-view.html',
            controller: 'mediaCtrl as vm'
          }
        },

      })

      //// grouping filter
      .state('app.media.view.group', {
        url: '/group',
        views: {
          'mediaviewContent@app.media.view': {
            templateUrl: 'app/main/media/media-view-card.html',
            controller: 'mediaCtrl as vm'
          }
        },

      })


    $translatePartialLoaderProvider.addPart('app/main/media/list');

    // Navigation
    msNavigationServiceProvider.saveItem('app.list', {
      title: 'list',
      icon: 'icon-tile-four',
      state: 'app.media.view',
      translate: 'Details',
      weight: 1
    });

    msNavigationServiceProvider.saveItem('app.tile', {
      title: 'list',
      icon: 'icon-tile-four',
      state: 'app.media.view.tile',
      translate: 'Edit',
      weight: 1
    });

    msNavigationServiceProvider.saveItem('app.group', {
      title: 'list',
      icon: 'icon-tile-four',
      state: 'app.media.view.group',
      translate: 'Group',
      weight: 1
    });
  }


})();


