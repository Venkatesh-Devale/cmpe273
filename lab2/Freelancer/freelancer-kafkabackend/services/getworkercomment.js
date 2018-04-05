var mongo = require('./mongo');

function handle_request(msg, callback){

    console.log("In get worker comment handle request:", msg);
    mongo.connect((err, dbo) => {
        if(err) {
            console.log(err);
            callback(null, 'ERROR');
        } else {

            dbo.collection('projects').find({id: msg.projectid}).toArray(function(err, result) {
                if(err) {
                    console.log(err);
                    callback(null, 'ERROR');
                } else {
                    console.log(result);
                    callback(null, result[0].comment);
                }
            })
        }
    });

}

exports.handle_request = handle_request;