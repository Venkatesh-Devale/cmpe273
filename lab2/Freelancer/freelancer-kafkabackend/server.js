var connection =  new require('./kafka/Connection');
var login = require('./services/login');
var signup = require('./services/signup');
var update = require('./services/update_user_profile');
var getprofile = require('./services/getuserprofile');
var postproject = require('./services/postproject');
var getallprojects = require('./services/getallprojects');
var getallrelevantprojects = require('./services/getallrelevantopenprojects');
var getmypublishedprojects = require('./services/getmypublishedprojects');
var insertBidAndUpdateNumberOfBids = require('./services/insertBidAndUpdateNumberOfBids');
var getmybiddedprojects = require('./services/getmybiddedprojects');
var getmyassignedprojects = require('./services/getmyassignedprojects');
var getproject = require('./services/getproject');
var getallbidsforthisproject = require('./services/getAllBidsForThisProject');
var getspecificbidforproject = require('./services/getspecificbidforproject');
var setworkerforproject = require('./services/setworkerforproject');
var getuseraccountbalance = require('./services/getuseraccountbalance');
var transact = require('./services/transact');
var getsearchcriteria = require('./services/getSearchCriteria');
var getsearchcriteriafordashboard = require('./services/getSearchCriteriaForDashBoard');
var getsearchcriteriafordashboardfreelancer = require('./services/getSearchCriteriaForFreelancerDashboard');
var gettransactionhistory = require('./services/gettransactionhistory');
var updateuserbalance = require('./services/updateuserbalance');
var insertworkercomment = require('./services/insertworkercomment');
var getworkercomment = require('./services/getworkercomment');
var getuserimage = require('./services/getuserimage');
var checkexistinguser =require('./services/checkexistinguser');


var consumerLogin = connection.getConsumer('login_topic');
var consumerSignup = connection.getConsumer('signup_topic');
var consumerUpdateUserProfile = connection.getConsumer('update_topic');
var consumerGetUserProfile = connection.getConsumer('getprofile_topic');
var consumerPostProject = connection.getConsumer('postproject_topic');
var consumerGetAllProjects = connection.getConsumer('getallprojects_topic');
var consumerGetAllRelevantProjects = connection.getConsumer('getallrelevantprojects_topic');
var consumerGetMyPublishedProject = connection.getConsumer('getmypublished_topic');
var consumerinsertBidAndUpdateNumberOfBids = connection.getConsumer('insertBidAndUpdateNumberOfBids_topic');
var consumergetmybiddedprojects = connection.getConsumer('getmybiddedprojects_topic');
var consumergetmyassignedprojects = connection.getConsumer('getmyassignedprojects_topic');
var consumerGetproject = connection.getConsumer('getproject_topic');
var consumerGetAllBidsForThisProject = connection.getConsumer('getallbidsforthisproject_topic');
var consumergetspecificbidforproject = connection.getConsumer('getspecificbidforproject');
var consumersetworkerforproject = connection.getConsumer('setworkerforproject_topic');
var consumergetuseraccountbalance = connection.getConsumer('getuseraccountbalance_topic');
var consumertransact = connection.getConsumer('transact_topic');
var consumergetsearchcriteria = connection.getConsumer('getsearchcriteria_topic');
var consumergetsearchcriteriafordashboard = connection.getConsumer('getsearchcriteriafordashboard_topic');
var consumergetsearchcriteriafordashboardfreelancer = connection.getConsumer('getsearchcriteriafordashboardfreelancer_topic');
var consumergettransactionhistory = connection.getConsumer('gettransactionhistory_topic');
var consumerupdateuserbalance = connection.getConsumer('updateuserbalance_topic');
var consumerinsertworkercomment = connection.getConsumer('insertworkercomment_topic');
var consumergetworkercomment = connection.getConsumer('getworkercomment_topic');
var consumergetuserimage = connection.getConsumer('getuserimage_topic');
var consumercheckexistinguser = connection.getConsumer('checkexistinguser_topic');

var producer = connection.getProducer();


//Login
console.log('server is running');
consumerLogin.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    login.handle_request(data.data, function(err,res){
        console.log('after login handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

//checking existing user
consumercheckexistinguser.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    checkexistinguser.handle_request(data.data, function(err,res){
        console.log('after get worker comment handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

//Signup
consumerSignup.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    signup.handle_request(data.data, function(err,res){
        console.log('after signup handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

//Update user profile
consumerUpdateUserProfile.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    update.handle_request(data.data, function(err,res){
        console.log('after update handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

//Get user profile
consumerGetUserProfile.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    getprofile.handle_request(data.data, function(err,res){
        console.log('after update handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

//get all projects
consumerGetAllProjects.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    getallprojects.handle_request(data.data, function(err,res){
        console.log('after update handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

//get all relevant projects
consumerGetAllRelevantProjects.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    getallrelevantprojects.handle_request(data.data, function(err,res){
        console.log('after login handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});


//post a project
consumerPostProject.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    postproject.handle_request(data.data, function(err,res){
        console.log('after post project handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});


//get my published projects
consumerGetMyPublishedProject.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    getmypublishedprojects.handle_request(data.data, function(err,res){
        console.log('after login handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

//inserting bids
consumerinsertBidAndUpdateNumberOfBids.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    insertBidAndUpdateNumberOfBids.handle_request(data.data, function(err,res){
        console.log('after login handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});


//get my bidded projects
consumergetmybiddedprojects.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    getmybiddedprojects.handle_request(data.data, function(err,res){
        console.log('after login handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

//get my assigned projects
consumergetmyassignedprojects.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    getmyassignedprojects.handle_request(data.data, function(err,res){
        console.log('after login handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

//getproject
consumerGetproject.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    getproject.handle_request(data.data, function(err,res){
        console.log('after login handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});


//get all bids for this project
consumerGetAllBidsForThisProject.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    getallbidsforthisproject.handle_request(data.data, function(err,res){
        console.log('after login handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

//get specific bid for a project
consumergetspecificbidforproject.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    getspecificbidforproject.handle_request(data.data, function(err,res){
        console.log('after login handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});


//set worker for the project
consumersetworkerforproject.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    setworkerforproject.handle_request(data.data, function(err,res){
        console.log('after set worker project handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

//get user account balance
consumergetuseraccountbalance.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    getuseraccountbalance.handle_request(data.data, function(err,res){
        console.log('after set worker project handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

//transaction
consumertransact.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    transact.handle_request(data.data, function(err,res){
        console.log('after set worker project handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

//get search criteria
consumergetsearchcriteria.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    getsearchcriteria.handle_request(data.data, function(err,res){
        console.log('after set worker project handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

//get search criteria for dashboard
consumergetsearchcriteriafordashboard.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    getsearchcriteriafordashboard.handle_request(data.data, function(err,res){
        console.log('after set worker project handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

//get search criteria for freelancer dashboard
consumergetsearchcriteriafordashboardfreelancer.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    getsearchcriteriafordashboardfreelancer.handle_request(data.data, function(err,res){
        console.log('after set worker project handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

//get transaction history for a user
consumergettransactionhistory.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    gettransactionhistory.handle_request(data.data, function(err,res){
        console.log('after set worker project handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

//update user balance
consumerupdateuserbalance.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    updateuserbalance.handle_request(data.data, function(err,res){
        console.log('after set worker project handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

//insert worker comment
consumerinsertworkercomment.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    insertworkercomment.handle_request(data.data, function(err,res){
        console.log('after insert worker comment handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

//get worker comment
consumergetworkercomment.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    getworkercomment.handle_request(data.data, function(err,res){
        console.log('after get worker comment handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

//get user image
consumergetuserimage.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('Data after parsing', data);
    console.log('Data after parsing priting data only', data.data);
    getuserimage.handle_request(data.data, function(err,res){
        console.log('after get worker comment handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});





