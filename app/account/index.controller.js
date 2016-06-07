/*
 * app\account\index.controller.js
 * 
 * client-side script/controller for handling account updates and deletion
 * 
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.IndexController', Controller);

    function Controller($window, UserService, FlashService) {
        var vm = this;

        vm.user = null;
        vm.saveUser = saveUser;
        vm.deleteUser = deleteUser;

        //var logger = require('logger');

        initController();

        function initController() {
            // get current user
            //logger.debug("Inside account index.controller initController");
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
        }

        function saveUser() {
            UserService.Update(vm.user)
                .then(function () {
                    FlashService.Success('User updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deleteUser() {
            UserService.Delete(vm.user._id)
                .then(function () {
                    // log user out
                    $window.location = '/login';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }

})();