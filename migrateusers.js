
var winston = require('winston');
var mysql      = require('mysql');
var Parse = require('parse').Parse;
var async = require('async');

var PARSE_USER_PASS = 'Qu3C0M3M05SOIN';


var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({ level: 'debug' }),
       new (winston.transports.File)({ filename: 'userLog.log' },{ level: 'debug' })
    ]
  });

var connection = mysql.createConnection({
  host     : 'us-cdbr-iron-east-01.cleardb.net',
  user     : 'b69955b94f9b94',
  password : '35ae18b1',
  database: 'heroku_9a6ce741d9ab0ed'
});

Parse.initialize("WXYWaxFqpJWUq0Sc1RSF4T5pEcRa9hzd0L5WCdfy", "ViL8y0PTQ8kXXbAJZsHySeuyNluw3GRIe4KOZNZb");

//Getting users
getUsers();


function getUsers()
{
	connection.connect();

  logger.debug('Connecting to database');

  logger.debug('Getting users');

	connection.query('SELECT * from USER', function(err, rows, fields) {
	  if (err) throw err;


    async.eachSeries(rows, function(userRow, callback) {

        logger.debug('Inserting user %s in Parse',userRow['USULOGIN']);
        logger.debug(userRow);

        var user = new Parse.User();
        user.set("username", userRow['USULOGIN']);
        user.set("password", PARSE_USER_PASS);
        user.set("email", userRow['USULOGIN']);
        user.set("name", userRow['PNOMBRE']);
        user.set("lastname", userRow['PAPELLIDO1']);
        user.set("phone", userRow['PCASA']);

        user.signUp(null, {
          success: function(user) {
            logger.debug('user %s inserted succesfuly',userRow['USULOGIN']);
             callback();
          },
          error: function(user, error) {
            // Show the error message somewhere and let the user try again.
            logger.error("Error: " + error.code + " " + error.message);
            logger.error('user %s error',userRow['USULOGIN']);
             callback();
          }
        });
   
      }, function(err){
          // if any of the file processing produced an error, err would equal that error
          if( err ) {
            // One of the iterations produced an error.
            // All processing will now stop.
            logger.error(err);
         
          } else {
            connection.end();
          }
      });

 connection.end();
    //  // rows.forEach(function(row) { 

        
    //     insertUserInParse(rows[0]);

    // // });


	});


}






