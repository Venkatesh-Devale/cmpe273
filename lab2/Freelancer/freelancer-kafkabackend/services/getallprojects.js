var mongoClient = require('./mongo');

function handle_request(msg, callback){

    console.log("In update user profile handle request:", msg);
    mongoClient.connect((err, db) => {
        if(err) {
            throw err;
        }
        else {
            console.log("Connected to mongodb...");
            db.collection("projects").find({}).toArray( (err, result) => {
                if(err) {

                    callback(null,'ERROR');
                }

                if(result.length > 0) {
                    console.log("In mongos get all open projects...",result);

                    callback(null, result);
                }
            });
        }
    })

}

exports.handle_request = handle_request;