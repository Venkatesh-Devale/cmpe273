var mongo = require('./mongo');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'devalevenkatesh@gmail.com', // Your email id
        pass: '94714Sanjay' // Your password
    }
});

function handle_request(msg, callback) {
    mongo.connect((err, dbo) => {
        if (err) throw err;
        else {

            var myquery = { id: msg.pid };
            var date = new Date();

            date.setDate(msg.period);
            var newvalues = {$set: {worker: msg.freelancer , estimated_completion_date: date}} ;

            dbo.collection("projects").updateOne(myquery, newvalues, function(err, result) {
                if (err) {
                    callback(null, 'ERROR');
                }
                else {
                    console.log("1 document updated", result.result);
                    dbo.collection('projects').aggregate([
                        {
                            $match: {
                                "id": msg.pid
                            }
                        },
                        {
                            $lookup: {
                                "from": "users",
                                "localField": "worker",
                                "foreignField": "username",
                                "as": "freelancerAndProjectDetails"
                            }
                        },
                        {
                            $unwind: {
                                "path": "$freelancerAndProjectDetails",
                                "preserveNullAndEmptyArrays": true
                            }
                        },
                        {
                            $project: {
                                "id" : 1,
                                "title" : 1,
                                "description" : 1,
                                "skills_required" : 1,
                                "budgetrange" : 1,
                                "employer" : 1,
                                "open" : 1,
                                "worker" : 1,
                                "number_of_bids" : 1,
                                "workeremail": "$freelancerAndProjectDetails.email"
                            }
                        }
                    ]).toArray(function (err, result) {
                        console.log("After getting project details and freelancer email", result[0])
                        //write logic to send email
                        var text = 'Hello world from Venkatesh';
                        var mailOptions = {
                            from: 'devalevenkatesh@gmail.com', // sender address
                            to: result[0].workeremail, // list of receivers
                            subject: 'You are hired on Freelancer for Project '+ result[0].title, // Subject line
                            //text: text //, // plaintext body
                            html:
                            '<p>This is to inform you that you have been hired for the project with below details, logon to Freelancer now.</p>' +
                            '<h3> Project Name:</h3>'+ result[0].title +
                            '<h3> Description:</h3>' + result[0].description +
                            '<h3> Employer:</h3>' + result[0].employer // You can choose to send an HTML body instead
                        };

                        transporter.sendMail(mailOptions, function(error, info){
                            if(error){
                                console.log(error);

                            }else{
                                console.log('Message sent: ' + info.response);

                            };
                        });

                    });
                    callback(null, 'UPDATE_SUCCESS');

                }

            });
        }
    })
}

exports.handle_request = handle_request;