var mongo = require('./mongo');

function handle_request(msg, callback) {
    console.log('In getmyassigned projects kafkabackend');
    mongo.connect((err, db) => {
        if(err) throw err;
        else {

            db.collection('projects').find({worker: msg.username}).toArray(function (err, result) {
                if(result.length > 0) {
                    callback(null, {'myassignedprojectsArray': result});
                } else {
                    callback(null, {'myassignedprojectsArray': []});
                }
            });
        }
    })
}

exports.handle_request = handle_request