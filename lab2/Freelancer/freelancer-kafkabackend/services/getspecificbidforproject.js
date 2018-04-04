var mongo = require('./mongo');

function handle_request(msg, callback) {
    console.log('In get specifc bid for the project kafkabackend');
    mongo.connect((err, db) => {
        if(err) throw err;
        else {
            console.log("Connected to mongodb...");

            db.collection("projects").aggregate([
                {
                    $match: { "id": msg.projectid}
                },
                {
                    $project: {
                        "id": 1,
                        "worker":1,
                        "employer": 1,
                        "title": 1,
                        "description" : 1,
                        "estimated_completion_date": 1
                    }
                }
                ,
                {
                    $lookup: {
                        from: "bids",
                        let: { pid: "$id", worker: "$worker" },
                        pipeline: [
                            { $match:
                                    { $expr:
                                            { $and:
                                                    [
                                                        { $eq: [ "$projectid",  "$$pid" ] },
                                                        { $eq: [ "$freelancer", "$$worker" ] }
                                                    ]
                                            }
                                    }
                            }
                        ],
                        as: "projectspecificbid"
                    }
                },
                {
                    $unwind: {
                        "path": "$projectspecificbid"
                    }
                },
                {
                    $project: {
                        "_id": 0,
                        "id" : 1,
                        "employer" : 1,
                        "worker" : 1,
                        "title": 1,
                        "description" : 1,
                        "estimated_completion_date": 1,
                        "bidperiod" : "$projectspecificbid.period",
                        "bidamount" : "$projectspecificbid.bidamount"
                    }
                }
            ]).toArray( (err, result) => {
                if(err) {
                    callback(null, 'ERROR');
                }

                if(result.length > 0) {
                    console.log(result);
                    callback(null, result);
                }
            });
        }
    })
}

exports.handle_request = handle_request