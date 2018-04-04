var mongoClient = require('./mongo');

function handle_request(msg, callback){

    console.log("In get user profile handle request:"+ msg);
    mongoClient.connect((err, db) => {
        if(err) {
            console.log("In getprofile handle request",err);
            callback(null, "Error in getprofile query connecting to mongodb");
        }
        else {
            console.log("Connected to mongodb...");

            var query = {username: msg.username};
            db.collection("users").find(query).toArray( (err, result) => {
                if(err) {

                    callback(null,'ERROR');
                }

                if(result.length > 0) {
                    console.log(result);

                    callback(null, result);

                } else {
                    console.log(result);

                    callback(null, 'ERROR');
                }
            });
        }
    });

}

exports.handle_request = handle_request;