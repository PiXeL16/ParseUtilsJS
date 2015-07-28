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
 */
Parse.initialize("gj2TfaLUgtmIrBNovNrVYCtsGGGJS3UV2RqsPTpe", "lXGNArrpLeY7p9OP0sJZQzU2iLZaSoMF7I1H2cja","FmwsZHYjTcUMqNCcELfw45w5eZaw3fJ8UMhD4urP");

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
  query.find({
    success: function(installations) {
      logger.debug("Successfully retrieved " + installations.length + " instalations.");

      logger.debug("Updating instalation and adding channel of " + channelName);
      for (var i = 0; i < installations.length; i++){
        // Add the channel to all the installations for this user
        installations[i].addUnique("channels", channelName); //Add the channel to the installation
        changedObjects.push(installations[i]); //Add the installation to be saved later on!
      }

      //Saving all the installations
      Parse.Object.saveAll(changedObjects, {
        success: function(installations) {
          //All installation saved
          logger.debug("Updated all instalations objects");

        },
        error: function(error) {
          // An error occurred while saving one of the objects.
          logger.error("Error saving installations "+ error);
        }
      });

    },
    error: function(error) {
      logger.error("Error: " + error.code + " " + error.message);
    }
  });
}
