(function (){
  'use strict';

  angular
    .module('app.mediaupload', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
  {
    // State
    $stateProvider
      .state('app.mediaupload', {
        url    : '/mediaupload',
        views  : {
          'content@app': {
            templateUrl: 'app/main/mediaupload/mediaupload.html',
            controller : 'mediauploadCtrl as vm'
          }
        },
        resolve: {
          mediauploadData: function (msApi)
          {
            return {}; //return msApi.resolve('mediaupload@get');
          }
        }
      });

    // Translation
  //  $translatePartialLoaderProvider.addPart('app/main/mediaupload');

    // Api
    //msApiProvider.register('mediaupload', ['app/data/mediaupload/mediaMonthly.json']);
  //  msApiProvider.register('mediaMonthly', ['app/data/mediaMonthly/mediaMonthly.json']);
    // Navigation
    //msNavigationServiceProvider.saveItem('fuse', {
    //    title : 'mediaupload',
    //    group : true,
    //    weight: 1
    //});

    // define sidebar
    msNavigationServiceProvider.saveItem('app.mediaupload', {
      title    : 'mediaupload',
      icon     : 'icon-tile-four',
      state    : 'app.mediaupload',
      /*stateParams: {
       'param1': 'page'
       },*/
      translate: 'Add Media',
      weight   : 1
    });
  }
})();
