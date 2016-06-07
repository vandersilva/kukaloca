/*
 * 
 * @returns {undefined}
 * 
 * app\home\index.controller.js
 * 
 * Client-side script/controller to handle home page display, including the 
 * loading of the training sets for the logged in user, and invoking calls to delete a training set
 * 
 *
 */
(function () {
    'use strict';

    /*
     * Defines modeal pop-up behavior, used for confirming the deletion of training sets, etc.
     */
    var myModule = angular.module('app');
    myModule.directive('ngConfirmClick', [
      function(){
        return {
          priority: -1,
          restrict: 'A',
          link: function(scope, element, attrs){
            element.bind('click', function(e){
              var message = attrs.ngConfirmClick;
              // confirm() requires jQuery
              if(message && !confirm(message)){
                e.stopImmediatePropagation();
                e.preventDefault();
              }
            });
          }
        };
      }
    ]);

    angular
            .module('app')
            .controller('Home.IndexController', Controller);

    /*
     * Controller initialization.
     * initController() is called for loading main screen, loading training set, user profile, etc.
     * Other functions are helper functions for actions from main screen, like deleting a training set, etc.
     */
    function Controller($window, UserService, TrainingService) {
        var vm = this;
        vm.user = null;
        vm.userTrainings = null;
        vm.deleteTraining = deleteTraining;


        initController();

        /*
        * initController loads main screen (training sets for user, user profile, etc)
        */
        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;

                getListOfTrainings();
                
                function getListOfTrainings() {
                    console.log("About to call TraininService.GetTrainings()");
                    TrainingService.GetTrainings().then(function(userTrainings) {
                        vm.userTrainings = userTrainings;
                        });
                    }
            });
        }
        
        /*
        * deleteTraining is called for performing deletion of a selected training set
        */
        function deleteTraining(training_id) {
            TrainingService.DeleteTraining(training_id)
                    .then(function() {
                    $window.location = '/';
                })
                .catch(function (error) {
                    console.log("Error deleting!");
                });
        }
    
        
    }

})();