var mongo = require('./mongo');

function handle_request(msg, callback) {
    console.log('in getmybidded projects handle_request');
    mongo.connect((err, db) => {
        console.log("Connected to mongodb...");
        if(err) throw err;
        else {
            console.log("Connected to mongodb...");

            db.collection('projects').aggregate([

                {
                    $lookup:{
                        "from":"bids",
                        "localField":"id",
                        "foreignField":"projectid",
                        "as":"projectbids"
                    }
                },
                {
                    $unwind:{
                        "path": "$projectbids",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    $group:{
                        "_id":{"id" : "$id",
                            "title" : "$title",
                            "description" : "$description",
                            "skills_required" : "$skills_required",
                            "budgetrange" : "$budgetrange",
                            "number_of_bids" : "$number_of_bids",
                            "employer" : "$employer",
                            "worker" : "$worker",
                            "open" : "$open",
                            "estimated_completion_date" : "$estimated_completion_date"},
                        "average":{$avg:"$projectbids.bidamount"}
                    }
                },
                {
                    $project:{
                        "_id" : 0,
                        "id" : "$_id.id",
                        "title" : "$_id.title",
                        "description" : "$_id.description",
                        "skills_required" : "$_id.skills_required",
                        "budgetrange" : "$_id.budgetrange",
                        "number_of_bids" :"$_id.number_of_bids",
                        "employer" : "$_id.employer",
                        "worker" : "$_id.worker",
                        "open" : "$_id.open",
                        "estimated_completion_date" : "$_id.estimated_completion_date",
                        "average" :{$ifNull: [ "$average",0 ] }
                    }
                },
                {
                    $lookup:
                        {
                            "from": "bids",
                            "localField": "id",
                            "foreignField": "projectid",
                            "as": "mybiddedProjects"
                        }
                },
                {
                    $unwind:
                        {
                            "path": "$mybiddedProjects",
                            "preserveNullAndEmptyArrays": true
                        }
                },
                { $match: { "mybiddedProjects.freelancer" : msg.username } },
                {
                    $project:
                        {
                            "id" : 1,
                            "title" : 1,
                            "description" : 1,
                            "skills_required" : 1,
                            "budgetrange" : 1,
                            "number_of_bids" : 1,
                            "employer" : 1,
                            "worker" : 1,
                            "open" : 1,
                            "estimated_completion_date" : 1,
                            "average" : 1,
                            "freelancer" : "$mybiddedProjects.freelancer",
                            "period": "$mybiddedProjects.period",
                            "bidamount" : "$mybiddedProjects.bidamount"
                        }
                }

            ]).toArray(function(err, result) {
                if (err) {
                    callback(null, 'ERROR');
                }
                else {
                    callback(null, result);
                }


            });
        }
    })


}

exports.handle_request = handle_request;