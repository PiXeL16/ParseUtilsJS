/**
 * Class that adds a parse channel to all instalation of an App
 * Due to the parse request limit you may have to run the script several times to get all instalation to update
 */

//Class Variables
var winston = require('winston');
var Parse = require('parse').Parse;
var async = require('async');

/**
 * Initialize logger
 * @param  {[type]} winston.Logger [description]
 * @return {[type]}                [description]
 */
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: 'debug' }),
    new (winston.transports.File)({ filename: 'userLog.log' },{ level: 'debug' })
  ]
});

/**
 * Initialize Parse with keys
 */
Parse.initialize("WXYWaxFqpJWUq0Sc1RSF4T5pEcRa9hzd0L5WCdfy", "ViL8y0PTQ8kXXbAJZsHySeuyNluw3GRIe4KOZNZb","lyZ1SyItcofFzyzvg8eCzD5y78lJNJrbsN0dz99k");

//Getting users
updateInstalations();

/**
 * Update instalations
 * @return void
 */
function updateInstalations()
{
  logger.debug('Connecting to parse');

  logger.debug('Getting instalations');

  Parse.Cloud.useMasterKey();

  var changedObjects = [];
  var channelName = "costarica";

  var query = new Parse.Query(Parse.Installation);
  query.notContainedIn("channels", [channelName]);

  query.each(function(installation) {
    console.log("Updating instalation: " + installation.id);

    installation.addUnique("channels", channelName); //Add the channel to the installation

    installation.save();

  });
}
