/*
 *  controllers\api\trainings.controller.js
 *  
 *  Defines routes and basic methods for handling server side RESTful api requests for managing trainings
 *  
 */

var config = require('config.json');
var express = require('express');
var router = express.Router();
var trainingService = require('services/training.service');
//var util = require('util');
var logger = require('utils/logger');


// routes
router.get      ('/getTrainings', getTrainings);
router.get      ('/getTraining/:_id', getTraining);
router.post     ('/saveNewTraining', saveNewTraining);
router.delete   ('/deleteTraining/:_id', deleteTraining);
router.put      ('/updateTraining/:_id', updateTraining);
router.put      ('/setIsTrained/:_id/:isTrained', setIsTrained);


module.exports = router;
logger.debug("Defined trainings.controllers routes");


/*
 * getTrainings
 * Receives http request to get training sets for specific user ID
 * Returns collection of training sets for that user
 * 
 */
function getTrainings(req, res) {
    trainingService.getTrainingsByUser(req.user.sub)
        .then(function (trainings) {
            //console.log("Inside trainings.controller  getTrainings() method. Got trainings: %s", util.inspect(trainings));
            logger.debug("Inside trainings.controller  getTrainings() method. Got trainings." );
            if (trainings) {
                res.send(trainings);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            logger.debug("Returning error from trainings.controller err: ", err);
            res.status(400).send(err);
        });
}


/*
 * getTraining
 * Receives http request to get training set for specific training ID
 * Returns training set matching that ID
 * 
 */
function getTraining(req, res) {
    trainingService.getTraining(req.params._id)
        .then(function (training) {
            //console.log("Inside trainings.controller  getTraining() method. Got training: %s", util.inspect(training));
            logger.debug("Inside trainings.controller  getTraining() method. Got training." );
            if (training) {
                res.send(training);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            logger.debug("Returning error from trainings.controller err: ", err);
            res.status(400).send(err);
        });
}


/*
 * saveNewTraining
 * Receives http request to insert training set for specific user ID
 * 
 */
function saveNewTraining(req, res) {
    trainingService.saveNewTraining(req.user.sub, req.body)
        .then(function () {
            logger.debug("Inside trainings.controller  saveNewTraining() method. ");
            res.sendStatus(200);;
        })
        .catch(function (err) {
            logger.debug("Returning error from trainings.controller err: ", err);
            res.status(400).send(err);
        });
}


/*
 * updateTraining
 * Receives http request to update training set for specific user ID
 * 
 */
function updateTraining(req, res) {
    logger.debug("Inside trainings.controller  updateTraining() method, for _id: %s", req.params._id);
    trainingService.updateTraining(req.params._id, req.body) 
        .then(function () {
            logger.debug("Inside trainings.controller  updateTraining() method. ");
            res.sendStatus(200);;
        })
        .catch(function (err) {
            logger.err("Returning error from trainings.controller err: ", err);
            res.status(400).send(err);
        });
}

/*
 * setIsTrained
 * Receives http request to update isTrained for specific training set
 * 
 */
function setIsTrained(req, res) {
    logger.debug("Inside trainings.controller  setIsTrained() method, for _id: %s", req.params._id);
    trainingService.setIsTrained(req.params._id, req.params.isTrained) 
        .then(function () {
            logger.debug("Inside trainings.controller  updateTraining() method. ");
            res.sendStatus(200);;
        })
        .catch(function (err) {
            logger.err("Returning error from trainings.controller err: ", err);
            res.status(400).send(err);
        });
}


/*
 * deleteTrainings
 * Receives http request to delete training set for specific training ID
 * 
 */
function deleteTraining(req, res) {
    logger.debug("Inside trainings.controller  deleteTraining() method, for _id: %s", req.params._id);
    trainingService.deleteTraining(req.params._id)
        .then(function () {
            logger.debug("Inside trainings.controller  deleteTraining() method SUCESSFULL. ");
            res.sendStatus(200);;
        })
        .catch(function (err) {
            logger.error("Returning error from trainings.controller err: ", err);
            res.status(400).send(err);
        });
}




