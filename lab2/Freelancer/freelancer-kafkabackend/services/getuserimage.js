var mongo = require('./mongo');

function handle_request(msg, callback){

    console.log("In get user image handle request:"+ msg);
    mongo.connect((err, dbo) => {
        if(err) {
            console.log(err);

            callback(null, err);
        } else {

            dbo.collection('users').find({username: msg.username}).toArray((err, result) => {
                if(err) {
                    console.log(err);

                    callback(null, 'No Image found');
                } else {

                    console.log(result);
                    callback(null, {image_name: result[0]});
                }

            })
        }
    });

}

exports.handle_request = handle_request;