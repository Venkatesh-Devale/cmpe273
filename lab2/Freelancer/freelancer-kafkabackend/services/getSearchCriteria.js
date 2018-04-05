var mongo = require('./mongo');

function handle_request(msg, callback){

    console.log("In get search criteria handle request:", msg);
    var finalArrayToreturn = [];
    mongo.connect((err, dbo) => {
        if(err) throw err;
        else {
            console.log("Connected to mongodb...");

            var query = {open: "open"};
            dbo.collection("projects").find(query).toArray( (err, result) => {
                for(var i = 0; i < result.length; i++) {
                    var n = result[i].title.replace(/[^a-zA-Z ]/g, "x").toLowerCase().search(msg.search.replace(/[^a-zA-Z ]/g, "x").toLowerCase());
                    var m = result[i].skills_required.replace(/[^a-zA-Z ]/g, "x").toLowerCase().search(msg.search.replace(/[^a-zA-Z ]/g, "x").toLowerCase());

                    if(n !== -1 || m !== -1) {
                        finalArrayToreturn.push(result[i]);
                    }
                }
                console.log(finalArrayToreturn);
                callback(null, finalArrayToreturn);
            });
        }
    })

}

exports.handle_request = handle_request;