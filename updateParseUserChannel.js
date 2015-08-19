/**
 * Class that adds a parse channel to all instalation of an App
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
 * Master key is needed to update Instalation entities
 */
Parse.initialize("$PARSE_APPLICATION_ID", "$PARSE_JAVASCRIPT_KEY", "PARSE_MASTER_KEY");

//Getting users
updateInstalationsWithChannel();

/**
 * Update instalations
 * @return void
 */
function updateInstalationsWithChannel()
{
  logger.debug('Connecting to parse');

  logger.debug('Getting instalations');

  Parse.Cloud.useMasterKey();

  var changedObjects = [];
  var channelName = "yourchannelname";

  var query = new Parse.Query(Parse.Installation);
  query.notContainedIn("channels", [channelName]);

  query.each(function(installation) {
    console.log("Updating instalation: " + installation.id);

    installation.addUnique("channels", channelName); //Add the channel to the installation

    installation.save();

  });
}
