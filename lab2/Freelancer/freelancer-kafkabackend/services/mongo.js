var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/freelancer';


exports.connect = (callback) => {
    mongoClient.connect(url, { poolSize: 20 }, (err, db) => {
        if(err) {
            console.log("Error in connecting to mongo", err)
        } else {
            callback(err, db);
        }
    });
}


