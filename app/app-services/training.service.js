/*
 * app\app-services\training.service.js
 * 
 * Client-side script that bridges calls to RESTful api to handle training sets
 * 
 */
(function () {
    'use strict';

    angular
        .module('app')
        .factory('TrainingService', Service);

    function Service($http, $q) { 
        var service = {};

        service.GetTrainings    = GetTrainings;
        service.GetTraining     = GetTraining;
        service.SaveNewTraining = SaveNewTraining;
        service.DeleteTraining  = DeleteTraining;
        service.UpdateTraining  = UpdateTraining;
        service.SetIsTrained    = SetIsTrained;

        return service;

        function GetTrainings() {
            console.log("About to execute GetTrainings() inside TraininService.GetTrainings()");
            return $http.get('/api/trainings/getTrainings').then(handleSuccess, handleError);
        }

        function GetTraining(_id) {
            console.log("About to execute GetTraining() inside TraininService.GetTraining()");
            return $http.get('/api/trainings/getTraining/' + _id).then(handleSuccess, handleError);
        }

        function SaveNewTraining(training) {
            console.log("About to execute SaveNewTraining() inside TraininService.SaveNewTraining()");
            return $http.post('/api/trainings/saveNewTraining', training).then(handleSuccess, handleError);
        }

        function DeleteTraining(_id) {
            console.log("About to execute DeleteTraining() inside TraininService.DeleteTraining() for _id: %s", _id);
            return $http.delete('/api/trainings/deleteTraining/'  + _id).then(handleSuccess, handleError);
        }

        function UpdateTraining(_id, training) {
            console.log("About to execute UpdateTraining() inside TraininService.UpdateTraining() for _id: %s", _id);
            return $http.put('/api/trainings/updateTraining/'  + _id, training).then(handleSuccess, handleError);
        }

        function SetIsTrained(_id, isTrained) {
            console.log("About to execute SetIsTrained() inside TraininService.SetIsTrained() for _id: %s", _id);
            return $http.put('/api/trainings/setIsTrained/'  + _id + '/' + (isTrained ? "true" : "false") ).then(handleSuccess, handleError);
        }


        // private functions
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    } 

})();
