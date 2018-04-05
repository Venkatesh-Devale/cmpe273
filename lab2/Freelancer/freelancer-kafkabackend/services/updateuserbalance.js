var mongo = require('./mongo');

function handle_request(msg, callback) {
    mongo.connect((err, dbo) => {
        if (err) throw err;
        else {

            var myquery = { username: msg.username };
            var newvalues = {$set: { balance: msg.amount}} ;
            dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
                if (err) {
                    callback(null, 'ERROR');
                }
                else {
                    console.log("1 document updated", result.result);
                    dbo.collection('transaction_history').insertOne({
                        transactionid: msg.transactionid,
                        transactiontype: msg.transactiontype,
                        username: msg.username,
                        amount: msg.transactedamount,
                        date: new Date(),
                        projectname: msg.projectname,
                    }).then( (result) => {
                        console.log("Transaction Insertion Successfull for user");
                        console.log(result.insertedId);

                        callback(null, 'UPDATE_SUCCESS');
                    })

                }

            });
        }
    })
}

exports.handle_request = handle_request;