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




    // define sidebar
    msNavigationServiceProvider.saveItem('apps.mediaupload', {
      title    : 'Upload Media',
      icon     : 'icon-tile-four',
      state    : 'app.mediaupload',
      /*stateParams: {
       'param1': 'page'
       },*/
     // translate: 'Add Media',
    //  weight   : 1
    });
  }
})();
