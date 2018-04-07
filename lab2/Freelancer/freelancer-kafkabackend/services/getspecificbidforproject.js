var mongo = require('./mongo');

function handle_request(msg, callback) {
    console.log('In get specifc bid for the project kafkabackend');
    // mongo.connect((err, db) => {
    //     if(err) throw err;
    //     else {
    //         console.log("Connected to mongodb...");
    //
    //         db.collection("projects").aggregate([
    //             {
    //                 $match: { "id": msg.projectid}
    //             },
    //             {
    //                 $project: {
    //                     "id": 1,
    //                     "worker":1,
    //                     "employer": 1,
    //                     "title": 1,
    //                     "description" : 1,
    //                     "estimated_completion_date": 1
    //                 }
    //             }
    //             ,
    //             {
    //                 $lookup: {
    //                     from: "bids",
    //                     let: { pid: "$id", worker: "$worker" },
    //                     pipeline: [
    //                         { $match:
    //                                 { $expr:
    //                                         { $and:
    //                                                 [
    //                                                     { $eq: [ "$projectid",  "$$pid" ] },
    //                                                     { $eq: [ "$freelancer", "$$worker" ] }
    //                                                 ]
    //                                         }
    //                                 }
    //                         }
    //                     ],
    //                     as: "projectspecificbid"
    //                 }
    //             },
    //             {
    //                 $unwind: {
    //                     "path": "$projectspecificbid"
    //                 }
    //             },
    //             {
    //                 $project: {
    //                     "_id": 0,
    //                     "id" : 1,
    //                     "employer" : 1,
    //                     "worker" : 1,
    //                     "title": 1,
    //                     "description" : 1,
    //                     "estimated_completion_date": 1,
    //                     "bidperiod" : "$projectspecificbid.period",
    //                     "bidamount" : "$projectspecificbid.bidamount"
    //                 }
    //             }
    //         ]).toArray( (err, result) => {
    //             if(err) {
    //                 console.log("Error in get specifc bid for the project", err);
    //                 callback(null, 'ERROR');
    //             }
    //
    //             else if(result.length > 0) {
    //                 console.log(result);
    //                 callback(null, result);
    //             }
    //         });
    //     }
    // })
    var finalResult = [];
    mongo.connect((err, db) => {
        if(err) {
            console.log("Error connecting to db in get specific bid");
            throw err;
        }
        else {
            db.collection('projects').find({id: msg.projectid}).toArray((err, result1) => {
                if(err) {
                    console.log('Error in querying projects');
                } else {
                    console.log("Project found:", result1[0]);
                    db.collection('bids').find(
                        {   projectid: result1[0].id,
                            freelancer: result1[0].worker
                        }).toArray((err, result2) => {
                        if(err) {
                            console.log('Error in querying bids');
                        } else {
                            console.log("Specifc bid is: ", result2[0]);
                            var result = {
                                id: result1[0].id,
                                title: result1[0].title,
                                description: result1[0].description,
                                employer: result1[0].employer,
                                worker: result1[0].worker,
                                estimated_completion_date: result1[0].estimated_completion_date,
                                bidperiod: result2[0].period,
                                bidamount: result2[0].bidamount
                            }
                            finalResult.push(result);
                            callback(null, finalResult);
                        }

                    })
                }

            })
        }
    })
}

exports.handle_request = handle_request