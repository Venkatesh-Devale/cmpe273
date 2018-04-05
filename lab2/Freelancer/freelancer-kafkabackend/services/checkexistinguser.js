var mongoClient = require('./mongo');

function handle_request(msg, callback){

    console.log("In check existing user handle request:", msg);

    mongoClient.connect( (err, dbo) => {

        dbo.collection('users').find({username: msg.username}).toArray((err, result) => {
            if(result.length !== 0) {
                callback(null, 'Username already exists');
            } else {
                callback(null, 'Username does not exists');
            }
        })
    });

}

exports.handle_request = handle_request;