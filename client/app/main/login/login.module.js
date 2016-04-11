(function ()
{
    'use strict';

    angular
        .module('app.login', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.login', {
                url    : '/login',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/login/login.html',
                        controller : 'LoginController as vm'
                    }
                },
                resolve: {
                    LoginData: function (msApi)
                    {
                        return {};
                        //return msApi.resolve('login@get');
                    }
                }
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/login');

        // Api
   //    msApiProvider.register('login', ['app/data/sample/sample.json']);

        // sidebar - define/set parent menu
        msNavigationServiceProvider.saveItem('fuse', {
            title : 'SAMPLE',
            group : true,
            weight: 1
        });

        // sidebar - define/set current menu item
        msNavigationServiceProvider.saveItem('fuse.login', {
            title    : 'Login',
            icon     : 'icon-tile-four',
            state    : 'app.login',
            /*stateParams: {
                'param1': 'page'
             },*/
            translate: 'login menu item',
            weight   : 1
        });
    }
})();
