var mongo = require('./mongo');

function handle_request(msg, callback){

    console.log("In insert worker comment handle request:"+ msg);
    mongo.connect((err, dbo) => {
        if(err) {
            console.log(err);
            callback(null, 'ERROR');
        } else {
            dbo.collection('projects').updateOne(
                {id: msg.projectid},
                {$set: {comment: msg.comment}}, function(err, result) {
                    if(err) {
                        console.log(err);
                        callback(null, 'ERROR');
                    } else {
                        console.log(result.result);
                        callback(null, 'Comment Updated Successfully');
                    }
                })
        }
    });

}

exports.handle_request = handle_request;