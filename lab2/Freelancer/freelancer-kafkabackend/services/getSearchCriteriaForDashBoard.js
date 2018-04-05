var mongo = require('./mongo');

function handle_request(msg, callback){

    console.log("In get search criteria for dashboard handle request:", msg);
    var finalArrayToreturn = [];
    mongo.connect((err, dbo) => {
        if(err) throw err;
        else {
            console.log("Connected to mongodb...");
            dbo.collection('projects').aggregate([
                { $match: { "employer" : msg.username } },
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
                        "_id":0,
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
                }


            ]).toArray( (err, result) => {
                //console.log(result);
                for(var i = 0; i < result.length; i++) {
                    var n = result[i].title.replace(/[^a-zA-Z ]/g, "x").toLowerCase().search(msg.search.replace(/[^a-zA-Z ]/g, "x").toLowerCase());
                    if(n !== -1) {
                        finalArrayToreturn.push(result[i]);
                    }

                }
                //console.log(finalArrayToreturn);
                callback(null, finalArrayToreturn);
            });

        }
    })

}

exports.handle_request = handle_request;