var mongoClient = require('./mongo');

function handle_request(msg, callback){

    console.log("In update user profile handle request:", msg);
    mongoClient.connect((err, db) => {
        if(err) {
            console.log("In update user profile handle request",err);
            callback(null, "Error in update user profile query connecting to mongodb");
        }
        else {

            var myquery = { username: msg.username };
            var newvalues = {$set: {email: msg.email, phone: msg.phone, aboutme: msg.aboutme, skills: msg.skills }} ;
            db.collection("users").updateOne(myquery, newvalues, function(err, result) {
                if (err) {
                    console.log("Error in update user");

                    callback(null, 'ERROR');
                }
                else {
                    console.log("1 document updated", result.result);

                    callback(null, 'UPDATE_SUCCESS');
                }
            });
        }
    });

}

exports.handle_request = handle_request;