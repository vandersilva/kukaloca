/*
 * 
 * @returns {undefined}
 * app\training\index.controller.js
 * 
 * Client-side script that handles controller functions for training set, 
 * including load of training set for update, or insertion of a new training set
 * 
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('Training.IndexController', Controller);

    function Controller($window, UserService, TrainingService, FlashService, $stateParams) {
        var vm = this;

        vm.user = null;
        vm.training = null;
        vm.saveTraining = saveTraining;

        initController();

        /*
         * initController called to initialize form with basic parameters, and optionally pre-existing training set for modification
         * 
         */
        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                if (console) console.log("Loading training set controller. _id = %s", $stateParams._id );
                vm.user = user;
                vm.trainingID = $stateParams._id;
                
                //if adding new trainign set, skip next initializations
                if (!vm.trainingID || vm.trainingID === '') {
                    return;
                }

                //As it is updating existing trainign set, load current training by its ID
                //load training
                TrainingService.GetTraining(vm.trainingID).then(function (training) {
                        //console.log("-->Got training set %s: %s", vm.trainingID, JSON.stringify(training) );
                        vm.training = training;
                    })
                    .catch(function (error) {
                        if (console) console.log("Error getting training set!");
                    });

            });
        }


        /*
        * saveTraining is called for performing saving of new OR updated training set
        */
        function saveTraining() {
            if (console) console.log("Inside training index.controller saveTraining");
            
            if (vm.trainingID && vm.trainingID !== '') {
                updateTraining();
            } else {
                createNewTraining();
            }

            /*
            * createNewTraining is called for performing saving of new training set
            */
            function createNewTraining() {
                if (console) console.log("Inside training index.controller createNewTraining");
                TrainingService.SaveNewTraining(vm.training)
                    .then(function () {
                        //FlashService.Success('Training created');
                        $window.location = '#/';
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            }

            /*
            * updateTraining is called for performing update of a selected training set
            */
            function updateTraining() {
                if (console) console.log("Inside training index.controller updateTraining for ID: %s", vm.trainingID);
                TrainingService.UpdateTraining(vm.trainingID, vm.training)
                        .then(function() {
                        $window.location = '#/';
                    })
                    .catch(function (error) {
                        if (console) console.log("Error updating!");
                    });
            }
    
        }


    }

})();