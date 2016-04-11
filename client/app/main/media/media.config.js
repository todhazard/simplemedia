angular
  .module('app.media')
  .config(config);

/** @ngInject */
function config($stateProvider,
                globalConstants,
                $urlRouterProvider,
                msNavigationServiceProvider,
                $mdDateLocaleProvider) {


  // set date type for datepicker to work with moment/app format
  $mdDateLocaleProvider.formatDate = function (date) {
    return date ? moment(date).format('YYYY-MM-DD') : '';
  };

  $mdDateLocaleProvider.parseDate = function (dateString) {
    var m = moment(dateString, 'YYYY-MM-DD', true);
    return m.isValid() ? m.toDate() : new Date(NaN);
  };

  $urlRouterProvider.otherwise('/media/view');
  $stateProvider
    .state('app.media', {
      abstract: true,
      url: '/media',
      // params:{"bodyName":"$stateParams.bodyName"},
      views: {
        'content@app': {
          templateUrl: 'app/main/media/media.index.html',
          controller: 'mediaCtrl as vm',
        }
      }
    })

    // define nested ui-route state for table / details view
    .state('app.media.view', {
      url: '/view?headerName&bodyName',
      views: {
        // grid/list views
        'mediaviewContent@app.media': {
          templateUrl: function ($stateParams) {
            return globalConstants.mediaTemplateUrls[$stateParams.bodyName];
          }
        }
      },
      resolve: {
        bodyName: function ($stateParams) {
          globalConstants.userState.selectedView = $stateParams.bodyName;
        }
      }
    })

    // main filter and body
    .state('app.media.view.tile', {
      url: '/edit',
      views: {
        'mediaviewContent@app.media.view': {
          templateUrl: 'app/main/media/views/grid/grid.html',
          controller: 'mediaCtrl as vm'
        }
      }
    })

    //// grouping filter
    .state('app.media.view.group', {
      url: '/group',
      views: {
        'mediaviewContent@app.media.view': {
          templateUrl: 'app/main/media/grouped/grouped.html',
          controller: 'mediaCtrl as vm'
        }
      }

    })

    //// grouping filter
    .state('app.media.grouped', {
      url: '/group',
      views: {
        'mediaviewContent@app.media.grouped': {
          templateUrl: 'app/main/media/views/grouped/grouped.html',
        }
      },
      resolve: {
        bodyName: function ($stateParams) {
          globalConstants.userState.selectedView = 'groupView';
          return 'groupView';
        }
      }

    })
    //// grouping filter
    .state('app.media.grid', {
      url: '/grid',
      views: {
        'mediaviewContent@app.media.grid': {
          templateUrl: 'app/main/media/views/grid/grid.html',
          //   controller: 'mediaCtrl as vm'
        }
      },
      resolve: {
        bodyName: function ($stateParams) {

          return 'tileView';
        }
      }

    })
    //// grouping filter
    .state('app.media.list', {
      url: '/list',
      views: {
        'mediaviewContent@app.media.list': {
          templateUrl: 'app/main/media/views/list/list.html',
          //  controller: 'mediaCtrl as vm'
        }
      },
      resolve: {
        bodyName: function ($stateParams) {
          return 'listView';
        }
      }
    })


// MENU ITEM DEFINITIONS

  // define sidebar and Navigation
  msNavigationServiceProvider.saveItem('apps', {
    title: 'MEDIA',
    group: true,
    weight: 1
  });

  msNavigationServiceProvider.saveItem('apps.media', {
    title: 'Edit',
    icon: 'icon-tile-four',
    weight: 1
  });

  msNavigationServiceProvider.saveItem('apps.media.details', {
    title: 'details',
    state: 'app.media.view({headerName:"simpleFilter",bodyName:"listView"})'
    /*stateParams: {
     'param1': 'page'
     },*/

  });

  msNavigationServiceProvider.saveItem('apps.media.tile', {
    title: 'tile',
    state: 'app.media.view({headerName:"simpleFilter",bodyName:"tileView"})'
  });

  msNavigationServiceProvider.saveItem('apps.media.group', {
    title: 'Group Duplicates',
    state: 'app.media.view({headerName:"simpleFilter",bodyName:"groupView"})'
  });

}
