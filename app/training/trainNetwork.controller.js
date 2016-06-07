/*
 * 
 * @returns {undefined}
 * app\training\trainNetwork.controller.js
 * 
 * Client-side script that handles controller functions for training the network 
 * 
 */
(function () {
    'use strict';
    
    angular
        .module('app')
        .controller('Training.TrainNetworkController', Controller);

    function Controller($window, UserService, TrainingService, FlashService, $stateParams) {
        var vm = this;

        vm.user = null;
        vm.training = null;
        vm.trainNetwork = trainNetwork;

        initController();

        /*
         * initController called to initialize form with basic parameters, and optionally pre-existing training set for modification
         * 
         */
        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                console.log("Loading training set controller. _id = %s", $stateParams._id );
                vm.user = user;
                vm.trainingID = $stateParams._id;
                

                //As it is updating existing trainign set, load current training by its ID
                //load training
                TrainingService.GetTraining(vm.trainingID).then(function (training) {
                        //console.log("-->Got training set %s: %s", vm.trainingID, JSON.stringify(training) );
                        vm.training = training;
                    })
                    .catch(function (error) {
                        console.log("Error getting training set!");
                    });

            });
        }


        /*
        * saveTraining is called for performing saving of new OR updated training set
        */
        function trainNetwork() {
            console.log("Inside training trainNetwork.controller trainNetwork");
            
            TrainingService.SetIsTrained(vm.trainingID, true)
                    .then(function() {
                    $window.location = '/';
                })
                .catch(function (error) {
                    console.log("Error updating!");
                });
    
        }


    }

})();