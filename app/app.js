/*
 * app\app.js
 * 
 * Main controller
 * 
 */

(function () {
    'use strict'; 

    angular
        .module('app', ['ui.router'])
        .config(config)
        .run(run);

    function config($httpProvider, $stateProvider, $urlRouterProvider) {
        // Disables heavy AJAX caching for GET method on IE, causing app state issues
        $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.cache = false;
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

        
        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'Home.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'home' }
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'account' }
            })
            .state('training', {
                url: '/training',
                templateUrl: 'training/index.html',
                controller: 'Training.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'training' }
            })
            .state('updateTraining', {
                url: '/training/:_id',
                templateUrl: 'training/index.html',
                controller: 'Training.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'training' }
            })
            .state('trainNetwork', {
                url: '/training/trainNetwork/:_id',
                templateUrl: 'training/trainNetwork.html',
                controller: 'Training.TrainNetworkController',
                controllerAs: 'vm',
                data: { activeTab: 'training' }
            }); 
    }

    function run($http, $rootScope, $window) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/kukaloca/app/token', function (token) {
            window.jwtToken = token;
            angular.bootstrap(document, ['app']);
        });
    });
})();