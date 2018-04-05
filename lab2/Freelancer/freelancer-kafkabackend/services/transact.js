var mongo = require('./mongo');

function handle_request(msg, callback){

    console.log("In transact handle request:", msg);
    var updatedBalanceForEmployer = msg.employerbalance - msg.bidamount;
    mongo.connect((err, dbo) => {
        if(err) {

            throw err;
        }
        else {

            var myquery = { username: msg.employer };
            var newvalues = {$set: { balance: updatedBalanceForEmployer }} ;
            dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
                if (err) {
                    console.log("In updating employer balance",err);

                    callback(null, 'ERROR');
                }
                else {
                    console.log("1 document employer balance updated", result.result);

                    //updating worker balance

                    var updatedBalanceForWorker = msg.workerbalance + msg.bidamount;
                    myquery = { username: msg.worker };
                    newvalues = {$set: { balance: updatedBalanceForWorker }} ;
                    dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
                        if (err) {
                            console.log("In updating worker balance",err);

                            callback(null, 'ERROR');
                        }
                        else {
                            console.log("1 document worker balance updated", result.result);

                            //inserting into transactionhistory for employer
                            dbo.collection('transaction_history').insertOne({
                                transactionid: msg.transactionidemployer,
                                transactiontype: 'debit',
                                username: msg.employer,
                                projectname: msg.projectname,
                                projectid: msg.projectid,
                                amount: msg.bidamount,
                                date: new Date()
                            }).then( (result) => {
                                console.log("Transaction Insertion Successfull for worker");
                                console.log(result.insertedId);

                                //inserting into transactionhistory for worker
                                dbo.collection('transaction_history').insertOne({
                                    transactionid: msg.transactionidworker,
                                    transactiontype: 'credit',
                                    username: msg.worker,
                                    projectname: msg.projectname,
                                    projectid: msg.projectid,
                                    amount: msg.bidamount,
                                    date: new Date()
                                }).then( (result) => {
                                    console.log("Transaction Insertion Successfull for worker");
                                    console.log(result.insertedId);

                                    //update the status to close of the project

                                    dbo.collection('projects').updateOne(
                                        {id: msg.projectid},
                                        {$set: {open: 'closed'}}, function(err, result) {
                                            if(err) {
                                                console.log(err);

                                                callback(null, "Error updating project status to close");
                                            } else {
                                                callback(null, '200');

                                            }
                                        })

                                })
                            })
                        }

                    });



                }

            });
        }
    })

}

exports.handle_request = handle_request;