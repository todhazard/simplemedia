(function ()
{
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(LoginData)
    {
        var vm = this;

        // Data
        vm.helloText = "some hello text";//LoginData.data.helloText;

        // Methods

        //////////
    }
})();
