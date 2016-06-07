/*
 * 
 * @type Module config|Module config
 * services\training.services.js
 * 
 * Defines mongoDB service access layer for training sets
 * 
 */


var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var logger = require('utils/logger');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('trainings');
var ObjectId = require('mongodb').ObjectID;

var util = require('util');

var service = {};

service.getTrainingsByUser  = getTrainingsByUser;
service.getTraining         = getTraining;
service.saveNewTraining     = saveNewTraining;
service.deleteTraining      = deleteTraining;
service.updateTraining      = updateTraining;
service.setIsTrained        = setIsTrained;

module.exports = service;

/*
 *  getTrainingsByUser
 *  Receives UserID 
 *  Returns collection of training sets for that user
 *  
 */
function getTrainingsByUser(_id) {
    var deferred = Q.defer();
    var userObj_id = new ObjectId(_id);
    logger.debug("Will query trainings for userID: %s", userObj_id);
    db.trainings.find({ userID: userObj_id }).toArray(function(err, trainings) {
        if (err) { deferred.reject(err);
            logger.error("Error in query for trainings: " + err);
        }
        if (trainings) {
            deferred.resolve(trainings);
            
        } else {
            // user not found
            logger.debug("Training DB query returned nothing: %s ", trainings);
            trainings = {};
            deferred.resolve(trainings);
        }
    });

    return deferred.promise;
}


/*
 *  getTraining
 *  Receives training ID 
 *  Returns training set matching that ID
 *  
 */
function getTraining(_id) {
    var deferred = Q.defer();
    var trainingObj_id = new ObjectId(_id);
    logger.debug("Will query trainings for trainingID: %s", trainingObj_id);
    //db.trainings.find({ _id: trainingObj_id }).toArray(function(err, training) {
    db.trainings.findById(trainingObj_id, function (err, training) {
        if (err) { deferred.reject(err);
            logger.error("Error in query for training: " + err);
        }
        if (training) {
            deferred.resolve(training);
            
        } else {
            // user not found
            logger.debug("Training DB query returned nothing: %s ", training);
            training = {};
            deferred.resolve(training);
        }
    });

    return deferred.promise;
}


/*
 *  getTraining
 *  Receives training ID 
 *  Returns training set matching that ID
 *  
 */
function saveNewTraining(_id, trainingParam) {
    logger.debug("saveNewTraining mongoDB"); 
    var deferred = Q.defer();

    var userObj_id = new ObjectId(_id);
    db.trainings.insert({
            userID: userObj_id,
            title: trainingParam.title,
            description: trainingParam.description,
            algorithmType: trainingParam.algorithmType,
            numberOfLayers: trainingParam.numberOfLayers,
            activationFunction: trainingParam.activationFunction,
            inputNeurons: trainingParam.inputNeurons,
            outputNeurons: trainingParam.outputNeurons,
            dataSet: trainingParam.dataSet,
            isTrained: false
    }, function(err, training){
            if (err) { 
  		logger.err("Error inserting: " + err);
                deferred.reject(err);
            }
              deferred.resolve();
    });
    logger.debug("Done insert method!");

    return deferred.promise;
}

/*
 *  updateTraining
 *  Receives training ID and training parameters from form 
 *  
 */
function updateTraining(_id, trainingParam) {
    logger.debug("updateTraining mongoDB"); 
    var deferred = Q.defer();

    var myObj_id = new ObjectId(_id);
    db.trainings.findById(myObj_id, function (err, training) {
        if (err) deferred.reject(err);
        updateTrainingItem();
    });

    function updateTrainingItem() {
        // fields to update
        var set = {
            title: trainingParam.title,
            description: trainingParam.description,
            algorithmType: trainingParam.algorithmType,
            numberOfLayers: trainingParam.numberOfLayers,
            activationFunction: trainingParam.activationFunction,
            inputNeurons: trainingParam.inputNeurons,
            outputNeurons: trainingParam.outputNeurons,
            dataSet: trainingParam.dataSet,
        };

        db.trainings.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    }

    return deferred.promise;
}


/*
 *  setIsTrained
 *  Receives training ID and isTrained parameter to mark training set 
 *  
 *  
 */
function setIsTrained(_id, isTrained) {
    logger.debug("setIsTrained mongoDB"); 
    var deferred = Q.defer();

    var myObj_id = new ObjectId(_id);
    db.trainings.findById(myObj_id, function (err, training) {
        if (err) deferred.reject(err);
        // fields to update
        var set = {
            isTrained: isTrained
        };
        db.trainings.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    });

    return deferred.promise;
}


/*
 *  deleteTraining
 *  Receives training ID 
 *  
 */
function deleteTraining(_id) {
    var deferred = Q.defer();

    db.trainings.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });

    return deferred.promise;
}
