var mongo = require('./mongo');
//var mongo = require('mongodb').MongoClient;
//var url = "mongodb://root:root@ds149495.mlab.com:49495/cmpe273venkateshfreelancer";


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