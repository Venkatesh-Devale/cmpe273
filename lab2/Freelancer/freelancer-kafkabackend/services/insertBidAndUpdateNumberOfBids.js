var mongo = require('./mongo');

function handle_request(msg, callback) {
    console.log("In insertBidAndUpdateNumberOfBids kafkabackend");

    const pid = msg.project_id;
    const bidAmount = parseInt(msg.bid);
    const days = parseInt(msg.deliveryDays);
    const freelancer = msg.freelancer;
    let bids = 0;

    mongo.connect((err, db) => {
        console.log("Connected to mongodb...");


        db.collection("bids").find({
            freelancer: freelancer,
            projectid: pid
        }).toArray( (err, result) => {

            if(result.length == 0) {
                db.collection("bids").insertOne({
                    projectid: pid,
                    freelancer: freelancer,
                    period: days,
                    bidamount: bidAmount
                }).
                then((result) => {
                    console.log("Bid inserted Successfully...");
                    db.collection("projects").find({
                        id: pid
                    }).toArray((err, result1) => {
                        console.log("After inserting bid..getting the number_of_bids for that project", result1[0].number_of_bids);
                        bids = result1[0].number_of_bids;
                        var ubids = bids + 1;
                        db.collection("projects").updateOne({id: pid}, {$set: {number_of_bids: ubids} }, function(err, result2) {
                            if (err) {
                                console.log('ERROR in updating bids...');
                            }
                            else {
                                console.log("1 document updated", result2.result);

                            }

                        });
                    });
                    //db.close();
                    callback(null, 'BID INSERTED SUCCESS');
                })
            } else {

                callback(null, 'ERROR');
            }
        });
    })


}

exports.handle_request = handle_request;