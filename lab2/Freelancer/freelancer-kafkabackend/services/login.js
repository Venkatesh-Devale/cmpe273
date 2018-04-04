var bcrypt = require('bcrypt');
var mongoClient = require('./mongo');

function handle_request(msg, callback){

    console.log("In login handle request:"+ JSON.stringify(msg));

    mongoClient.connect( (err, db) => {
        if(err) {
            console.log("In login handle request",err);
            callback(null, "Error in login query connecting to mongodb");
        }
        else {
            console.log("Connected to mongodb...");

            var query = {username: msg.username};
            db.collection("users").find(query).toArray( (err, result) => {
                if(err) {
                    console.log("In login handle request",err);
                    callback(null, "Error in login query");
                }

                if(result.length > 0) {
                    console.log(result[0].username);
                    var hash = result[0].password;
                    bcrypt.compare(msg.password, hash, (err, doesMatch) => {
                        if(doesMatch) {

                            console.log("Inside result.length",result[0].username);
                            callback(null, result);
                        } else {

                            callback(null, []);
                        }

                    })

                } else {

                    callback(null, []);
                }
            });
        }

    });

}

exports.handle_request = handle_request;