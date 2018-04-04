var mongoClient = require('./mongo');
var bcrypt = require('bcrypt');

const saltRounds = 10;

function handle_request(msg, callback){

    console.log("In signup handle request:", msg);
        mongoClient.connect((err, db) => {
        if(err) {
            console.log("In signup handle request",err);
            callback(null, "Error in signup query connecting to mongodb");
        }
        else {

            bcrypt.hash(msg.password, saltRounds, (err, hash) => {
                console.log("In /signup....password hash is:" + hash);

                console.log("Connected to mongodb...");

                db.collection('users').insertOne({
                    username: msg.username,
                    password: hash,
                    email: msg.emailid,
                    phone: '',
                    aboutme: '',
                    skills: '',
                    image_name: 'default.png',
                    balance: 0
                }).then( (result) => {
                    console.log("Insertion Successfully");
                    console.log(result.insertedId);

                    callback(null,'SIGNUP_SUCCESS');
                })


            })



        }
    });

}

exports.handle_request = handle_request;