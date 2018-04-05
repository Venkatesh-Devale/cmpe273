var mongo = require('./mongo');

function handle_request(msg, callback){

    console.log("In get user account balance handle request:"+ msg);

    mongo.connect( (err, dbo) => {
        if(err) throw err;
        else {
            console.log("Connected to mongodb...");

            var query = {username: msg.user};
            dbo.collection("users").find(query).toArray( (err, result) => {
                if(err) {

                    callback(null, 'ERROR');
                }

                if(result.length > 0) {
                    console.log(result);

                    callback(null, result);
                }
            });
        }
    });

}

exports.handle_request = handle_request;