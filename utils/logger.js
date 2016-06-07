/*
 * logger.js
 * 
 * Configuration for global logger, using both console (debug) and mongodb (info/etc)
 * 
 */

var winston = require('winston');
require('winston-mongodb').MongoDB;
var config = require('config.json');
winston.emitErrs = true;
env = config.debugLevel || 'development';

var fs = require( 'fs' );
var logDir = config.logsFolder || 'logs'; 
if ( !fs.existsSync( logDir ) ) {
	// Create the directory if it does not exist
	fs.mkdirSync( logDir );
}

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: env === 'development' ? 'debug' : 'info', // if dev env, log it all, else log info/warn/error only
            filename: logDir + '/all-logs.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 3,
            colorize: false
        }),
        // Should chose one or the other, file or MongoDB. Both is an overkill
        new(winston.transports.MongoDB)({
            db : config.connectionString,
            collection: 'logs',
            level: env === 'development' ? 'debug' : 'warn' // if dev env, log it all, else log warn/error only
        }),
        new winston.transports.Console({
            level: env === 'development' ? 'debug' : 'warn', // if dev env, log it all, else log warn/error only
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

logger.info('Chill Winston. Logs are being captured all over...');


module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

