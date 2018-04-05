var mongo = require('./mongo');

function handle_request(msg, callback) {
    mongo.connect((err, dbo) => {
        if(err) {
            console.log(err);

            callback(null, 'ERROR');
        } else {
            console.log("Connected to mongodb...");

            dbo.collection('transaction_history').find({username: msg.user}).toArray((err, result) => {
                if(err) {

                    callback(null, 'ERROR');
                }

                if(result.length > 0) {
                    console.log(result);

                    callback(null, result);
                } else {

                    callback(null, 'No transaction history for this user');
                }
            })
        }
    })
}

exports.handle_request = handle_request;