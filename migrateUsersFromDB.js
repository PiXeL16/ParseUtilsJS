/**
 * The idea of the script is to migrate all the user basic information to the Parse.com user to be able to do push notifications
 * This is just an example of an aproach that one could take, we dont care about managing the users in parse or adding much information
 * the idea is to have them in parse to be able to match devices to a user/email and send pushs to that users
 */

//Logging library
var winston = require('winston');
//In this example we are obtaining users from a MySql database
var mysql      = require('mysql');
//Parse user library
var Parse = require('parse').Parse;
//Async library
var async = require('async');

//We are going to set the same password to all Parse users in this example. We really dont care for user security in parse . Its really just to match users to devices
//You could also generate a password for the users depending on user data or password hashes
var PARSE_USER_PASS = '***PARSE_PASSWORD***';

//Init logger variables
var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({ level: 'debug' }),
      //We also want to save log
      new (winston.transports.File)({ filename: 'userLog.log' },{ level: 'debug' })
    ]
  });

//Your database connection, in this example mysql
var connection = mysql.createConnection({
  host     : '',
  user     : '',
  password : '',
  database : ''
});

Parse.initialize("$PARSE_APPLICATION_ID", "$PARSE_JAVASCRIPT_KEY");

//Migrate users from DB to parse
migrateUsers();

/**
 * Migrate users from a database to a parse instance
 * @return
 */
function migrateUsers()
{
  //Connects to database
	connection.connect();

  logger.debug('Connecting to database');

  logger.debug('Getting users');

  //Query users
	connection.query('SELECT * from USER', function(err, rows, fields) {
	  if (err) throw err;

    //Async the migration
    async.eachSeries(rows, function(userRow, callback) {

        logger.debug('Inserting user %s in Parse',userRow["username"]);
        logger.debug(userRow);

        //Creates a new user in parse
        var user = new Parse.User();
        //Update parse user data with what we have in the data base
        user.set("username", userRow["username"]);
        user.set("password", PARSE_USER_PASS);
        user.set("email", userRow["email"]);
        user.set("name", userRow["name"]);
        user.set("lastname", userRow["lastname"]);
        user.set("phone", userRow["phone"]);

        //Create users in parse
        user.signUp(null, {
          success: function(user) {
            logger.debug('user %s inserted succesfuly',userRow['USULOGIN']);
             callback();
          },
          error: function(user, error) {
            // Show the error message somewhere and let the user try again.
            logger.error("Error: " + error.code + " " + error.message);
            logger.error('user %s error',userRow['username']);
             callback();
          }
        });

      }, function(err){
          // If Error
          if( err ) {
            // One of the iterations produced an error.
            // All processing will now stop.
            logger.error(err);

          } else {
            connection.end();
          }
      });

 connection.end();

	});


}
