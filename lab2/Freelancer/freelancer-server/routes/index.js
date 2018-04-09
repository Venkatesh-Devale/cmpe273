var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var fs= require('fs');
var multiparty = require('multiparty');
var util = require('util');
var mongo = require('mongodb');
var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://root:root@ds149495.mlab.com:49495/cmpe273venkateshfreelancer";
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
var nodemailer = require('nodemailer');
var kafka = require('./kafka/client');

// var transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//         user: 'devalevenkatesh@gmail.com', // Your email id
//         pass: '94714Sanjay' // Your password
//     }
// });

// var connectionPool = mysql.createPool({
//   connectionLimit : 1000,
//   host : 'localhost',
//   user : 'root',
//   password : 'root',
//   database : 'freelancer'
// })



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/checkexistinguser', (req, res, next) => {
   console.log('In checkexistinguser...', req.body);

    kafka.make_request('checkexistinguser_topic', req.body, (err, result) => {
        if(err) {
            console.log(err);
            throw err;
        } else {
            console.log("After checking existing user kakfa result", result);
            res.json(result);
        }


    });

   // mongoClient.connect(url, (err, db) => {
   //    var dbo = db.db('freelancer');
   //    dbo.collection('users').find({username: req.body.username}).toArray((err, result) => {
   //        if(result.length !== 0) {
   //            res.json('Username already exists');
   //        } else {
   //            res.json('Username does not exists');
   //        }
   //    })
   // });
});

router.post('/signup', function(req, res, next) {
  console.log(req.body);

  kafka.make_request('signup_topic', req.body, (err, result) => {
      if(err) {
          console.log(err);
          throw err;
      } else {
          console.log("After signup kakfa result", result);
          res.json(result);
      }


  });

});



//this will be called from authenticate function from passport in /login API call
passport.use(new LocalStrategy( function(username, password, done) {

    kafka.make_request('login_topic',{username:username,password:password}, function(err,results){
        console.log('in result');
        console.log("After our result from kafka backend",results);
        if(err) {
            return done(err, {});
        }

        if(results.length > 0) {

            console.log("Inside result.length",results[0].username);
            return done(null, results[0]);
        } else {
            return done(null, false);
        }
    });

    }
));

router.post('/login', function(req, res, next) {
  console.log(req.body);

    passport.authenticate('local', function(err, user) {
        if(err) {
            console.log("In authenticate....",err);
            res.json('ERROR');
        }

        if(!user) {
            console.log("In authenticate....error in authenticating as user could not be found");
            res.json('ERROR');
        }
        if(user) {
            console.log("In user authenticate....", user);
            req.session.username = user.username;
            console.log("Session Started...", req.session);
            var jsonResponse = {"result" : user.username, "session": req.session.username};
            res.send(jsonResponse);
        }

    })(req, res, next);
});


router.get('/checksession', (req, res) => {
  console.log("In checksession...",req.session.username);
  if(req.session.username) {
    res.json({"session" : req.session});
  }
    
  else 
    res.json({"session" : "ERROR"});
});

router.post('/logout', (req, res) => {
  console.log('Logging out...', req.session.username);
  req.session.destroy();
  res.json({"result": "Session destoryed..please login"});
});

router.post('/updateprofile', function(req, res, next) {
  console.log(req.body);
  const username = req.body.username;
  const email = req.body.email;
  const phone = req.body.phone;
  const aboutme = req.body.aboutme;
  const skills = req.body.skills;

    kafka.make_request('update_topic', req.body, (err, result) => {
       console.log(result);
       res.json(result);
    });
    // mongoClient.connect(url, function(err, db) {
    //     if (err) throw err;
    //     else {
    //         var dbo = db.db("freelancer");
    //         var myquery = { username: username };
    //         var newvalues = {$set: {email: email, phone: phone, aboutme: aboutme, skills: skills }} ;
    //         dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
    //             if (err) {
    //                 res.json('ERROR');
    //             }
    //             else {
    //                 console.log("1 document updated", result.result);
    //                 res.json('UPDATE_SUCCESS');
    //                 db.close();
    //             }
    //
    //         });
    //     }
    // });
});

router.post('/getprofile', function(req, res, next) {
  console.log(req.body);
  console.log('In getprofile node...' + req.session.username);
    kafka.make_request('getprofile_topic', req.body, (err, result) => {
        console.log(result);
        res.json(result);
    });

    // mongoClient.connect(url, (err, db) => {
    //     if(err) throw err;
    //     else {
    //         console.log("Connected to mongodb...");
    //         var dbo = db.db("freelancer");
    //         var query = {username: req.body.username};
    //         dbo.collection("users").find(query).toArray( (err, result) => {
    //             if(err) {
    //                 res.json('ERROR');
    //             }
    //
    //             if(result.length > 0) {
    //                 console.log(result);
    //                 res.json(result);
    //                 db.close();
    //             }
    //         });
    //     }
    // });

});


router.post('/postproject', function(req, res, next) {
  console.log('In server side...', req.body);
  // const employer = req.body.owner;
  // const title = req.body.title;
  // const description = req.body.description;
  // const skills_required = req.body.skillsRequired;
  // const budgetrange = req.body.budgetrange;
  // const id = req.body.id;

    kafka.make_request('postproject_topic', req.body, (err, result) => {
        console.log(result);
        res.json(result);
    });

  // mongoClient.connect(url, function(err, db) {
  //     if(err) throw err;
  //     else {
  //         var dbo = db.db('freelancer');
  //         dbo.collection('projects').insertOne({
  //             id: id,
  //             title: title,
  //             description: description,
  //             skills_required: skills_required,
  //             budgetrange: budgetrange,
  //             employer: employer,
  //             open: 'open',
  //             worker: '',
  //             number_of_bids: 0,
  //             estimated_completion_date: null
  //         }).then( (response) => {
  //             console.log("Project Insertion Successfully");
  //             console.log(response.insertedId);
  //             db.close();
  //             res.json('PROJECT_INSERTED_SUCCESS');
  //         })
  //     }
  // })
  
});


router.post('/getallprojects', function(req, res, next) {
    console.log('In getallprojects', req.body);

    kafka.make_request('getallprojects_topic', {} ,(err, result) => {
        console.log(result);
        res.json(result);
    });

    // mongoClient.connect(url, (err, db) => {
    //     if(err) {
    //         db.close();
    //         throw err;
    //     }
    //     else {
    //         console.log("Connected to mongodb...");
    //         var dbo = db.db("freelancer");
    //
    //         dbo.collection("projects").find({}).toArray( (err, result) => {
    //             if(err) {
    //                 db.close();
    //                 res.json('ERROR');
    //             }
    //
    //             if(result.length > 0) {
    //                 console.log("In mongos get all open projects...",result);
    //                 db.close();
    //                 res.json(result);
    //             }
    //         });
    //     }
    // });

});


router.post('/getallrelevantopenprojects', function(req, res, next) {
    // var userSkills = null;
    // var userSkillsArray = null;
    // var allOpenProjectsArray = null;
    // var finalRelevantProjectsArray = [];
    // console.log("In /getallrelevantopenprojects", req.body.username);
    //
    // mongoClient.connect(url, (err, db) => {
    //     if(err) throw err;
    //     else {
    //         console.log("Connected to mongodb...");
    //         var dbo = db.db("freelancer");
    //         var query = {username: req.body.username};
    //         dbo.collection("users").find(query).toArray( (err, result) => {
    //             if(err) {
    //                 console.log('ERROR');
    //                 res.json('ERROR');
    //             }
    //
    //             if(result.length > 0) {
    //                 userSkills = result[0].skills;
    //                 if(userSkills === null) {
    //                     console.log("User has not updated any skills...");
    //                     res.json({"finalRelevantProjectsArray": finalRelevantProjectsArray});
    //
    //                 }
    //
    //             else {
    //                     userSkillsArray = userSkills.split(",");
    //                     console.log("User Skills Array...", userSkillsArray);
    //                     dbo.collection("projects").find({open:'open'}).toArray( (err, result) => {
    //                         if(err) {
    //                             console.log(err);
    //                             res.json('ERROR');
    //
    //                         }
    //
    //                         if(result.length > 0) {
    //                             allOpenProjectsArray = result;
    //                             var count = 0;
    //                             for(var i = 0; i < allOpenProjectsArray.length; i++) {
    //                                 count = 0;
    //                                 var projectRequiredSkillsArray = allOpenProjectsArray[i].skills_required.split(',');
    //                                 console.log("projectRequiredSkillsArray",projectRequiredSkillsArray);
    //                                 for(var j = 0; j < userSkillsArray.length; j++) {
    //                                     for(var k = 0; k < projectRequiredSkillsArray.length; k++) {
    //                                         if(userSkillsArray[j].toLowerCase() === projectRequiredSkillsArray[k].toLocaleLowerCase()) {
    //                                             count++;
    //                                         }
    //                                     }
    //                                 }
    //                                 console.log("Final Skills matched count...", count);
    //                                 if(count >= 2) {
    //                                     finalRelevantProjectsArray.push(allOpenProjectsArray[i]);
    //                                 }
    //                             }
    //                             console.log("Matched final skills projects...", finalRelevantProjectsArray);
    //                             db.close();
    //                             res.json({"finalRelevantProjectsArray" : finalRelevantProjectsArray});
    //                         }
    //
    //                     });
    //                 }
    //
    //             }
    //         });
    //
    //
    //
    //     }
    //
    // });
    //
    //
    //

    kafka.make_request('getallrelevantprojects_topic', req.body ,(err, result) => {
        console.log(result);
        res.json(result);
    });
});



router.post('/getmypublishedprojects', function(req, res, next) {
  console.log('In getmypublishedprojects');
    kafka.make_request('getmypublished_topic', req.body ,(err, result) => {
        console.log(result);
        res.json(result);
    });
    // mongoClient.connect(url, (err, db) => {
    //     if(err) throw err;
    //     else {
    //         console.log("Connected to mongodb...");
    //         var dbo = db.db("freelancer");
    //
    //         dbo.collection('projects').aggregate([
    //             { $match: { "employer" : req.body.username } },
    //             {
    //             $lookup:{
    //                 "from":"bids",
    //                 "localField":"id",
    //                 "foreignField":"projectid",
    //                 "as":"projectbids"
    //                 }
    //             },
    //             {
    //             $unwind:{
    //                 "path": "$projectbids",
    //                 "preserveNullAndEmptyArrays": true
    //                 }
    //             },
    //             {
    //             $group:{
    //                     "_id":{"id" : "$id",
    //                     "title" : "$title",
    //                     "description" : "$description",
    //                     "skills_required" : "$skills_required",
    //                     "budgetrange" : "$budgetrange",
    //                     "number_of_bids" : "$number_of_bids",
    //                     "employer" : "$employer",
    //                     "worker" : "$worker",
    //                     "open" : "$open",
    //                     "estimated_completion_date" : "$estimated_completion_date"},
    //                     "average":{$avg:"$projectbids.bidamount"}
    //                 }
    //             },
    //             {
    //             $project:{
    //                 "id" : "$_id.id",
    //                 "title" : "$_id.title",
    //                 "description" : "$_id.description",
    //                 "skills_required" : "$_id.skills_required",
    //                 "budgetrange" : "$_id.budgetrange",
    //                 "number_of_bids" :"$_id.number_of_bids",
    //                 "employer" : "$_id.employer",
    //                 "worker" : "$_id.worker",
    //                 "open" : "$_id.open",
    //                 "estimated_completion_date" : "$_id.estimated_completion_date",
    //                 "average" :{$ifNull: [ "$average",0 ] }
    //                 }
    //             }
    //
    //
    //     ]).toArray(function(err, result) {
    //             if (err) {
    //                 res.json('ERROR');
    //             }
    //             else {
    //                 res.json(result);
    //             }
    //
    //             db.close();
    //         });
    //     }
    // });




});


router.post('/insertBidAndUpdateNumberOfBids', function(req, res, next) {
    kafka.make_request('insertBidAndUpdateNumberOfBids_topic', req.body ,(err, result) => {
        console.log(result);
        res.json(result);
    });


    // mongoClient.connect(url, (err, db) => {
    //     if(err) throw err;
    //     else {
    //         console.log("Connected to mongodb...");
    //         var dbo = db.db("freelancer");
    //
    //         dbo.collection("bids").find({
    //             freelancer: freelancer,
    //             projectid: pid
    //         }).toArray( (err, result) => {
    //
    //             if(result.length == 0) {
    //                 dbo.collection("bids").insertOne({
    //                     projectid: pid,
    //                     freelancer: freelancer,
    //                     period: days,
    //                     bidamount: bidAmount
    //                 }).
    //                 then((result) => {
    //                     console.log("Bid inserted Successfully...");
    //                     dbo.collection("projects").find({
    //                         id: pid
    //                     }).toArray((err, result1) => {
    //                         console.log("After inserting bid..getting the number_of_bids for that project", result1[0].number_of_bids);
    //                         bids = result1[0].number_of_bids;
    //                         var ubids = bids + 1;
    //                         dbo.collection("projects").updateOne({id: pid}, {$set: {number_of_bids: ubids} }, function(err, result2) {
    //                             if (err) {
    //                                 console.log('ERROR in updating bids...');
    //                             }
    //                             else {
    //                                 console.log("1 document updated", result2.result);
    //                                 db.close();
    //                             }
    //
    //                         });
    //                     });
    //                     //db.close();
    //                     res.json('BID INSERTED SUCCESS');
    //                 })
    //             } else {
    //                 db.close();
    //                 res.json('ERROR');
    //             }
    //         });
    //
    //
    //     }
    // });
  
});


router.post('/getmybiddedprojects', function(req, res, next) {
  
  console.log(req.body);
    kafka.make_request('getmybiddedprojects_topic', req.body ,(err, result) => {
        console.log(result);
        res.json(result);
    });
    // mongoClient.connect(url, (err, db) => {
    //     if(err) throw err;
    //     else {
    //         console.log("Connected to mongodb...");
    //         var dbo = db.db("freelancer");
    //         dbo.collection('projects').aggregate([
    //
    //             {
    //                 $lookup:{
    //                     "from":"bids",
    //                     "localField":"id",
    //                     "foreignField":"projectid",
    //                     "as":"projectbids"
    //                 }
    //             },
    //             {
    //                 $unwind:{
    //                     "path": "$projectbids",
    //                     "preserveNullAndEmptyArrays": true
    //                 }
    //             },
    //             {
    //                 $group:{
    //                     "_id":{"id" : "$id",
    //                         "title" : "$title",
    //                         "description" : "$description",
    //                         "skills_required" : "$skills_required",
    //                         "budgetrange" : "$budgetrange",
    //                         "number_of_bids" : "$number_of_bids",
    //                         "employer" : "$employer",
    //                         "worker" : "$worker",
    //                         "open" : "$open",
    //                         "estimated_completion_date" : "$estimated_completion_date"},
    //                     "average":{$avg:"$projectbids.bidamount"}
    //                 }
    //             },
    //             {
    //                 $project:{
    //                     "_id" : 0,
    //                     "id" : "$_id.id",
    //                     "title" : "$_id.title",
    //                     "description" : "$_id.description",
    //                     "skills_required" : "$_id.skills_required",
    //                     "budgetrange" : "$_id.budgetrange",
    //                     "number_of_bids" :"$_id.number_of_bids",
    //                     "employer" : "$_id.employer",
    //                     "worker" : "$_id.worker",
    //                     "open" : "$_id.open",
    //                     "estimated_completion_date" : "$_id.estimated_completion_date",
    //                     "average" :{$ifNull: [ "$average",0 ] }
    //                 }
    //             },
    //             {
    //                 $lookup:
    //                     {
    //                         "from": "bids",
    //                         "localField": "id",
    //                         "foreignField": "projectid",
    //                         "as": "mybiddedProjects"
    //                     }
    //             },
    //             {
    //                 $unwind:
    //                     {
    //                         "path": "$mybiddedProjects",
    //                         "preserveNullAndEmptyArrays": true
    //                     }
    //             },
    //             { $match: { "mybiddedProjects.freelancer" : req.body.username } },
    //             {
    //                 $project:
    //                     {
    //                         "id" : 1,
    //                         "title" : 1,
    //                         "description" : 1,
    //                         "skills_required" : 1,
    //                         "budgetrange" : 1,
    //                         "number_of_bids" : 1,
    //                         "employer" : 1,
    //                         "worker" : 1,
    //                         "open" : 1,
    //                         "estimated_completion_date" : 1,
    //                         "average" : 1,
    //                         "freelancer" : "$mybiddedProjects.freelancer",
    //                         "period": "$mybiddedProjects.period",
    //                         "bidamount" : "$mybiddedProjects.bidamount"
    //                     }
    //             }
    //
    //         ]).toArray(function(err, result) {
    //             if (err) {
    //                 res.json('ERROR');
    //             }
    //             else {
    //                 res.json(result);
    //             }
    //
    //             db.close();
    //         });
    //     }
    // });



});

router.post('/getmyassignedprojects', function(req, res, next) {
   console.log(req.body.username);
    kafka.make_request('getmyassignedprojects_topic', req.body ,(err, result) => {
        console.log(result);
        res.json(result);
    });
   // mongoClient.connect(url, function(err, db) {
   //     if(err) throw err;
   //     else {
   //         var dbo = db.db('freelancer');
   //         dbo.collection('projects').find({worker: req.body.username}).toArray(function (err, result) {
   //             if(result.length > 0) {
   //                 res.json({'myassignedprojectsArray': result});
   //             } else {
   //                 res.json({'myassignedprojectsArray': []});
   //             }
   //         });
   //     }
   // })
});


router.post('/getproject', function(req, res, next) {
  console.log('In getproject', req.body);

    kafka.make_request('getproject_topic', req.body ,(err, result) => {
        console.log(result);
        res.json(result);
    });

    // mongoClient.connect(url, (err, db) => {
    //     if(err) throw err;
    //     else {
    //         console.log("Connected to mongodb...");
    //         var dbo = db.db("freelancer");
    //
    //         dbo.collection('projects').aggregate([
    //             {
    //                 $match: { "id" : projectId }
    //             },
    //             {
    //                 $lookup:{
    //                     "from":"bids",
    //                     "localField":"id",
    //                     "foreignField":"projectid",
    //                     "as":"projectbids"
    //                 }
    //             },
    //             {
    //                 $unwind:{
    //                     "path": "$projectbids",
    //                     "preserveNullAndEmptyArrays": true
    //                 }
    //             },
    //             {
    //                 $group:{
    //                     "_id":{"id" : "$id",
    //                         "title" : "$title",
    //                         "description" : "$description",
    //                         "skills_required" : "$skills_required",
    //                         "budgetrange" : "$budgetrange",
    //                         "number_of_bids" : "$number_of_bids",
    //                         "employer" : "$employer",
    //                         "worker" : "$worker",
    //                         "open" : "$open",
    //                         "estimated_completion_date" : "$estimated_completion_date"},
    //                     "average":{$avg:"$projectbids.bidamount"}
    //                 }
    //             },
    //             {
    //                 $project:{
    //                     "_id" : 0,
    //                     "id" : "$_id.id",
    //                     "title" : "$_id.title",
    //                     "description" : "$_id.description",
    //                     "skills_required" : "$_id.skills_required",
    //                     "budgetrange" : "$_id.budgetrange",
    //                     "number_of_bids" :"$_id.number_of_bids",
    //                     "employer" : "$_id.employer",
    //                     "worker" : "$_id.worker",
    //                     "open" : "$_id.open",
    //                     "estimated_completion_date" : "$_id.estimated_completion_date",
    //                     "average" :{$ifNull: [ "$average",0 ] }
    //                 }
    //             }
    //         ]).toArray(function(err, result) {
    //             if (err) {
    //                 res.json('ERROR');
    //             }
    //             else {
    //                 res.json(result);
    //             }
    //
    //             db.close();
    //         });
    //     }
    // });

})

router.post('/getAllBidsForThisProject', (req, res, next) => {
  console.log('In getAllBidsForThisProject', req.body.projectid);


    kafka.make_request('getallbidsforthisproject_topic', req.body ,(err, result) => {
        console.log(result);
        res.json(result);
    });

    // mongoClient.connect(url, (err, db) => {
    //     if(err) throw err;
    //     else {
    //         console.log("Connected to mongodb...");
    //         var dbo = db.db("freelancer");
    //
    //         dbo.collection('projects').aggregate([
    //             {
    //                 $match: { "id" : projectId }
    //             },
    //             {
    //                 $lookup:{
    //                     "from":"bids",
    //                     "localField":"id",
    //                     "foreignField":"projectid",
    //                     "as":"projectbids"
    //                 }
    //             },
    //             {
    //                 $unwind:{
    //                     "path": "$projectbids",
    //                     "preserveNullAndEmptyArrays": false
    //                 }
    //             },
    //             {
    //                 $group:{
    //                     "_id":{"id" : "$id",
    //                         "title" : "$title",
    //                         "description" : "$description",
    //                         "skills_required" : "$skills_required",
    //                         "budgetrange" : "$budgetrange",
    //                         "number_of_bids" : "$number_of_bids",
    //                         "employer" : "$employer",
    //                         "worker" : "$worker",
    //                         "open" : "$open",
    //                         "estimated_completion_date" : "$estimated_completion_date"},
    //                     "average":{$avg:"$projectbids.bidamount"}
    //                 }
    //             },
    //             {
    //                 $project:{
    //                     "_id" : 0,
    //                     "id" : "$_id.id",
    //                     "title" : "$_id.title",
    //                     "description" : "$_id.description",
    //                     "skills_required" : "$_id.skills_required",
    //                     "budgetrange" : "$_id.budgetrange",
    //                     "number_of_bids" :"$_id.number_of_bids",
    //                     "employer" : "$_id.employer",
    //                     "worker" : "$_id.worker",
    //                     "open" : "$_id.open",
    //                     "estimated_completion_date" : "$_id.estimated_completion_date",
    //                     "average" :{$ifNull: [ "$average",0 ] }
    //                 }
    //             },
    //             {
    //                 $lookup:
    //                     {
    //                         "from": "bids",
    //                         "localField": "id",
    //                         "foreignField": "projectid",
    //                         "as": "mybiddedProjects"
    //                     }
    //             },
    //             {
    //                 $unwind:
    //                     {
    //                         "path": "$mybiddedProjects",
    //                         "preserveNullAndEmptyArrays": true
    //                     }
    //             },
    //             {
    //                 $project:
    //                     {
    //                         "id" : 1,
    //                         "title" : 1,
    //                         "description" : 1,
    //                         "skills_required" : 1,
    //                         "budgetrange" : 1,
    //                         "number_of_bids" : 1,
    //                         "employer" : 1,
    //                         "worker" : 1,
    //                         "open" : 1,
    //                         "estimated_completion_date" : 1,
    //                         "average" : 1,
    //                         "freelancer" : "$mybiddedProjects.freelancer",
    //                         "period": "$mybiddedProjects.period",
    //                         "bidamount" : "$mybiddedProjects.bidamount"
    //                     }
    //             },
    //             {
    //                 $lookup: {
    //                     "from" : "users",
    //                     "localField" : "employer",
    //                     "foreignField" : "username",
    //                     "as" : "projectbidsWithUserDetails"
    //                 }
    //             },
    //             {
    //                 $unwind:
    //                     {
    //                         "path": "$projectbidsWithUserDetails",
    //                         "preserveNullAndEmptyArrays": true
    //                     }
    //             },
    //             {
    //                 $project: {
    //                     "freelancer" : 1,
    //                     "period" : 1,
    //                     "bidamount" : 1,
    //                     "image_name" : "$projectbidsWithUserDetails.image_name",
    //                     "employer" : 1
    //
    //                 }
    //             }
    //
    //
    //
    //         ]).toArray(function(err, result) {
    //             if (err) {
    //                 res.json('ERROR');
    //             }
    //             else {
    //                 res.json(result);
    //             }
    //
    //             db.close();
    //         });
    //     }
    // });
})

router.post('/getspecificbidforproject', (req, res, next) => {
   console.log('In getspecificbidforproject server side...', req.body.projectid);

    kafka.make_request('getspecificbidforproject', req.body ,(err, result) => {
        console.log(result);
        res.json(result);
    });

    // mongoClient.connect(url, (err, db) => {
    //     if(err) throw err;
    //     else {
    //         console.log("Connected to mongodb...");
    //         var dbo = db.db("freelancer");
    //
    //
    //
    //         dbo.collection("projects").aggregate([
    //             {
    //                 $match: { "id": req.body.projectid}
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
    //                 res.json('ERROR');
    //             }
    //
    //             if(result.length > 0) {
    //                 console.log(result);
    //                 res.json(result);
    //                 db.close();
    //             }
    //         });
    //     }
    // });

});


router.post('/setworkerforproject', (req, res, next) => {
  console.log(req.body);
    kafka.make_request('setworkerforproject_topic', req.body ,(err, result) => {
        console.log(result);
        res.json(result);
    });
    // mongoClient.connect(url, function(err, db) {
    //     if (err) throw err;
    //     else {
    //         var dbo = db.db("freelancer");
    //         var myquery = { id: req.body.pid };
    //         var date = new Date();
    //         date.setDate(req.body.period);
    //         var newvalues = {$set: {worker: req.body.freelancer , estimated_completion_date: date}} ;
    //
    //         dbo.collection("projects").updateOne(myquery, newvalues, function(err, result) {
    //             if (err) {
    //                 res.json('ERROR');
    //             }
    //             else {
    //                 console.log("1 document updated", result.result);
    //                 dbo.collection('projects').aggregate([
    //                     {
    //                         $match: {
    //                             "id": req.body.pid
    //                         }
    //                     },
    //                     {
    //                         $lookup: {
    //                             "from": "users",
    //                             "localField": "worker",
    //                             "foreignField": "username",
    //                             "as": "freelancerAndProjectDetails"
    //                         }
    //                     },
    //                     {
    //                         $unwind: {
    //                             "path": "$freelancerAndProjectDetails",
    //                             "preserveNullAndEmptyArrays": true
    //                         }
    //                     },
    //                     {
    //                         $project: {
    //                             "id" : 1,
    //                             "title" : 1,
    //                             "description" : 1,
    //                             "skills_required" : 1,
    //                             "budgetrange" : 1,
    //                             "employer" : 1,
    //                             "open" : 1,
    //                             "worker" : 1,
    //                             "number_of_bids" : 1,
    //                             "workeremail": "$freelancerAndProjectDetails.email"
    //                         }
    //                     }
    //                 ]).toArray(function (err, result) {
    //                     console.log("After getting project details and freelancer email", result[0])
    //                     //write logic to send email
    //                     var text = 'Hello world from Venkatesh';
    //                     var mailOptions = {
    //                         from: 'devalevenkatesh@gmail.com', // sender address
    //                         to: result[0].workeremail, // list of receivers
    //                         subject: 'You are hired on Freelancer for Project '+ result[0].title, // Subject line
    //                         //text: text //, // plaintext body
    //                         html:
    //                         '<p>This is to inform you that you have been hired for the project with below details, logon to Freelancer now.</p>' +
    //                         '<h3> Project Name:</h3>'+ result[0].title +
    //                         '<h3> Description:</h3>' + result[0].description +
    //                         '<h3> Employer:</h3>' + result[0].employer // You can choose to send an HTML body instead
    //                     };
    //
    //                     transporter.sendMail(mailOptions, function(error, info){
    //                         if(error){
    //                             console.log(error);
    //
    //                         }else{
    //                             console.log('Message sent: ' + info.response);
    //
    //                         };
    //                     });
    //                 });
    //                 res.json('UPDATE_SUCCESS');
    //                 db.close();
    //             }
    //
    //         });
    //     }
    // });

})

router.post('/getuseraccountbalance', (req, res, next) => {
    console.log(req.body);
    kafka.make_request('getuseraccountbalance_topic', req.body ,(err, result) => {
        console.log(result);
        res.json(result);
    });
    // mongoClient.connect(url, (err, db) => {
    //     if(err) throw err;
    //     else {
    //         console.log("Connected to mongodb...");
    //         var dbo = db.db("freelancer");
    //         var query = {username: req.body.user};
    //         dbo.collection("users").find(query).toArray( (err, result) => {
    //             if(err) {
    //                 db.close();
    //                 res.json('ERROR');
    //             }
    //
    //             if(result.length > 0) {
    //                 console.log(result);
    //                 db.close();
    //                 res.json(result);
    //             }
    //         });
    //     }
    // });


});

router.post('/transact', (req, res, next) => {
   console.log(req.body);

    kafka.make_request('transact_topic', req.body ,(err, result) => {
        console.log(result);
        res.json(result);
    });

   // var updatedBalanceForEmployer = req.body.employerbalance - req.body.bidamount;
   //
   // mongoClient.connect(url, (err, db) => {
   //     if(err) {
   //         db.close();
   //         throw err;
   //     }
   //     else {
   //         var dbo = db.db("freelancer");
   //         var myquery = { username: req.body.employer };
   //         var newvalues = {$set: { balance: updatedBalanceForEmployer }} ;
   //         dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
   //             if (err) {
   //                 console.log("In updating employer balance",err);
   //                 db.close();
   //                 res.json('ERROR');
   //             }
   //             else {
   //                 console.log("1 document employer balance updated", result.result);
   //
   //                 //updating worker balance
   //
   //                 var updatedBalanceForWorker = req.body.workerbalance + req.body.bidamount;
   //                 myquery = { username: req.body.worker };
   //                 newvalues = {$set: { balance: updatedBalanceForWorker }} ;
   //                 dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
   //                     if (err) {
   //                         console.log("In updating worker balance",err);
   //                         db.close();
   //                         res.json('ERROR');
   //                     }
   //                     else {
   //                         console.log("1 document worker balance updated", result.result);
   //
   //                         //inserting into transactionhistory for employer
   //                         dbo.collection('transaction_history').insertOne({
   //                             transactionid: req.body.transactionidemployer,
   //                             transactiontype: 'debit',
   //                             username: req.body.employer,
   //                             projectname: req.body.projectname,
   //                             projectid: req.body.projectid,
   //                             amount: req.body.bidamount,
   //                             date: new Date()
   //                         }).then( (result) => {
   //                             console.log("Transaction Insertion Successfull for worker");
   //                             console.log(result.insertedId);
   //
   //                             //inserting into transactionhistory for worker
   //                             dbo.collection('transaction_history').insertOne({
   //                                 transactionid: req.body.transactionidworker,
   //                                 transactiontype: 'credit',
   //                                 username: req.body.worker,
   //                                 projectname: req.body.projectname,
   //                                 projectid: req.body.projectid,
   //                                 amount: req.body.bidamount,
   //                                 date: new Date()
   //                             }).then( (result) => {
   //                                 console.log("Transaction Insertion Successfull for worker");
   //                                 console.log(result.insertedId);
   //
   //                                 //update the status to close of the project
   //
   //                                 dbo.collection('projects').updateOne(
   //                                     {id: req.body.projectid},
   //                                     {$set: {open: 'closed'}}, function(err, result) {
   //                                          if(err) {
   //                                              console.log(err);
   //                                              db.close();
   //                                              res.json("Error updating project status to close");
   //                                          } else {
   //                                              res.json('200');
   //                                              db.close();
   //                                          }
   //                                     })
   //
   //                             })
   //                         })
   //                     }
   //
   //                 });
   //
   //
   //
   //             }
   //
   //         });
   //     }
   // })

});

router.post('/getSearchCriteria', (req, res, next) => {
    console.log("In getSearchCriteria", req.body.search);
    kafka.make_request('getsearchcriteria_topic', req.body ,(err, result) => {
        console.log(result);
        res.json(result);
    });

    // var finalArrayToreturn = [];
    // mongoClient.connect(url, (err, db) => {
    //     if(err) throw err;
    //     else {
    //         console.log("Connected to mongodb...");
    //         var dbo = db.db("freelancer");
    //         var query = {open: "open"};
    //         dbo.collection("projects").find(query).toArray( (err, result) => {
    //             for(var i = 0; i < result.length; i++) {
    //                 var n = result[i].title.replace(/[^a-zA-Z ]/g, "x").toLowerCase().search(req.body.search.replace(/[^a-zA-Z ]/g, "x").toLowerCase());
    //                 var m = result[i].skills_required.replace(/[^a-zA-Z ]/g, "x").toLowerCase().search(req.body.search.replace(/[^a-zA-Z ]/g, "x").toLowerCase());
    //
    //                 if(n !== -1 || m !== -1) {
    //                     finalArrayToreturn.push(result[i]);
    //                 }
    //             }
    //             console.log(finalArrayToreturn);
    //             res.json(finalArrayToreturn);
    //         });
    //     }
    // });


});

router.post('/getSearchCriteriaForDashBoard', (req, res, next) => {
    console.log("In getSearchCriteriaForDashBoard", req.body);
    kafka.make_request('getsearchcriteriafordashboard_topic', req.body ,(err, result) => {
        console.log(result);
        res.json(result);
    });
//     var finalArrayToreturn = [];
//     mongoClient.connect(url, (err, db) => {
//         if(err) throw err;
//         else {
//             console.log("Connected to mongodb...");
//             var dbo = db.db("freelancer");
//
// ﻿           dbo.collection('projects').aggregate([
//                 { $match: { "employer" : req.body.username } },
//                 {
//                     $lookup:{
//                         "from":"bids",
//                         "localField":"id",
//                         "foreignField":"projectid",
//                         "as":"projectbids"
//                     }
//                 },
//                 {
//                     $unwind:{
//                         "path": "$projectbids",
//                         "preserveNullAndEmptyArrays": true
//                     }
//                 },
//                 {
//                     $group:{
//                         "_id":{"id" : "$id",
//                             "title" : "$title",
//                             "description" : "$description",
//                             "skills_required" : "$skills_required",
//                             "budgetrange" : "$budgetrange",
//                             "number_of_bids" : "$number_of_bids",
//                             "employer" : "$employer",
//                             "worker" : "$worker",
//                             "open" : "$open",
//                             "estimated_completion_date" : "$estimated_completion_date"},
//                         "average":{$avg:"$projectbids.bidamount"}
//                     }
//                 },
//                 {
//                     $project:{
//                         "_id":0,
//                         "id" : "$_id.id",
//                         "title" : "$_id.title",
//                         "description" : "$_id.description",
//                         "skills_required" : "$_id.skills_required",
//                         "budgetrange" : "$_id.budgetrange",
//                         "number_of_bids" :"$_id.number_of_bids",
//                         "employer" : "$_id.employer",
//                         "worker" : "$_id.worker",
//                         "open" : "$_id.open",
//                         "estimated_completion_date" : "$_id.estimated_completion_date",
//                         "average" :{$ifNull: [ "$average",0 ] }
//                     }
//                 }
//
//
//             ]).toArray( (err, result) => {
//                 //console.log(result);
//                 for(var i = 0; i < result.length; i++) {
//                     var n = result[i].title.replace(/[^a-zA-Z ]/g, "x").toLowerCase().search(req.body.search.replace(/[^a-zA-Z ]/g, "x").toLowerCase());
//                     if(n !== -1) {
//                         finalArrayToreturn.push(result[i]);
//                     }
//
//                 }
//                 //console.log(finalArrayToreturn);
//                 res.json(finalArrayToreturn);
//             });
//
//         }
//     });
});

router.post('/getSearchCriteriaForFreelancerDashboard', (req, res, next) => {
    console.log("In getSearchCriteriaForFreelancerDashboard", req.body);

    kafka.make_request('getsearchcriteriafordashboardfreelancer_topic', req.body ,(err, result) => {
        console.log(result);
        res.json(result);
    });

    // var finalArrayToreturn = [];
    // mongoClient.connect(url, (err, db) => {
    //     if(err) throw err;
    //     else {
    //         console.log("Connected to mongodb...");
    //         var dbo = db.db("freelancer");
    //         ﻿dbo.collection("projects").aggregate([
    //
    //             {
    //                 $lookup:{
    //                     "from":"bids",
    //                     "localField":"id",
    //                     "foreignField":"projectid",
    //                     "as":"projectbids"
    //                 }
    //             },
    //             {
    //                 $unwind:{
    //                     "path": "$projectbids",
    //                     "preserveNullAndEmptyArrays": true
    //                 }
    //             },
    //             {
    //                 $group:{
    //                     "_id":{"id" : "$id",
    //                         "title" : "$title",
    //                         "description" : "$description",
    //                         "skills_required" : "$skills_required",
    //                         "budgetrange" : "$budgetrange",
    //                         "number_of_bids" : "$number_of_bids",
    //                         "employer" : "$employer",
    //                         "worker" : "$worker",
    //                         "open" : "$open",
    //                         "estimated_completion_date" : "$estimated_completion_date"},
    //                     "average":{$avg:"$projectbids.bidamount"}
    //                 }
    //             },
    //             {
    //                 $project:{
    //                     "_id" : 0,
    //                     "id" : "$_id.id",
    //                     "title" : "$_id.title",
    //                     "description" : "$_id.description",
    //                     "skills_required" : "$_id.skills_required",
    //                     "budgetrange" : "$_id.budgetrange",
    //                     "number_of_bids" :"$_id.number_of_bids",
    //                     "employer" : "$_id.employer",
    //                     "worker" : "$_id.worker",
    //                     "open" : "$_id.open",
    //                     "estimated_completion_date" : "$_id.estimated_completion_date",
    //                     "average" :{$ifNull: [ "$average",0 ] }
    //                 }
    //             },
    //             {
    //                 $lookup:
    //                     {
    //                         "from": "bids",
    //                         "localField": "id",
    //                         "foreignField": "projectid",
    //                         "as": "mybiddedProjects"
    //                     }
    //             },
    //             {
    //                 $unwind:
    //                     {
    //                         "path": "$mybiddedProjects",
    //                         "preserveNullAndEmptyArrays": true
    //                     }
    //             },
    //             { $match: { "mybiddedProjects.freelancer" : req.body.username } },
    //             {
    //                 $project:
    //                     {
    //                         "id" : 1,
    //                         "title" : 1,
    //                         "description" : 1,
    //                         "skills_required" : 1,
    //                         "budgetrange" : 1,
    //                         "number_of_bids" : 1,
    //                         "employer" : 1,
    //                         "worker" : 1,
    //                         "open" : 1,
    //                         "estimated_completion_date" : 1,
    //                         "average" : 1,
    //                         "freelancer" : "$mybiddedProjects.freelancer",
    //                         "period": "$mybiddedProjects.period",
    //                         "bidamount" : "$mybiddedProjects.bidamount"
    //                     }
    //             }
    //
    //         ]).toArray( (err, result) => {
    //             //console.log(result);
    //             for(var i = 0; i < result.length; i++) {
    //                 var n = result[i].title.replace(/[^a-zA-Z ]/g, "x").toLowerCase().search(req.body.search.replace(/[^a-zA-Z ]/g, "x").toLowerCase());
    //                 if(n !== -1) {
    //                     finalArrayToreturn.push(result[i]);
    //                 }
    //
    //             }
    //             console.log(finalArrayToreturn);
    //             res.json(finalArrayToreturn);
    //         });
    //     }
    // });
});


router.post('/gettransactionhistory', (req, res, next) => {
    console.log("In gettransactionhistory", req.body);
    kafka.make_request('gettransactionhistory_topic', req.body ,(err, result) => {
        console.log(result);
        res.json(result);
    });
    // mongoClient.connect(url, (err, db) => {
    //     if(err) {
    //         console.log(err);
    //         db.close();
    //         res.json('ERROR');
    //     } else {
    //         console.log("Connected to mongodb...");
    //         var dbo = db.db('freelancer');
    //         dbo.collection('transaction_history').find({username: req.body.user}).toArray((err, result) => {
    //             if(err) {
    //                 db.close();
    //                 res.json('ERROR');
    //             }
    //
    //             if(result.length > 0) {
    //                 console.log(result);
    //                 db.close();
    //                 res.json(result);
    //             } else {
    //                 db.close();
    //                 res.json('No transaction history for this user');
    //             }
    //         })
    //     }
    // })
});

router.post('/updateuserbalance', (req, res, next) => {
    console.log(req.body);

    kafka.make_request('updateuserbalance_topic', req.body ,(err, result) => {
        console.log(result);
        res.json(result);
    });

    // mongoClient.connect(url, function(err, db) {
    //     if (err) throw err;
    //     else {
    //         var dbo = db.db("freelancer");
    //         var myquery = { username: req.body.username };
    //         var newvalues = {$set: { balance: req.body.amount}} ;
    //         dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
    //             if (err) {
    //                 res.json('ERROR');
    //             }
    //             else {
    //                 console.log("1 document updated", result.result);
    //                 dbo.collection('transaction_history').insertOne({
    //                     transactionid: req.body.transactionid,
    //                     transactiontype: req.body.transactiontype,
    //                     username: req.body.username,
    //                     amount: req.body.transactedamount,
    //                     date: new Date(),
    //                     projectname: req.body.projectname,
    //                 }).then( (result) => {
    //                     console.log("Transaction Insertion Successfull for user");
    //                     console.log(result.insertedId);
    //                     db.close();
    //                     res.json('UPDATE_SUCCESS');
    //                 })
    //
    //             }
    //
    //         });
    //     }
    // });
});



router.post('/insertworkercomment', (req, res, next) => {
    console.log(req.body);

    kafka.make_request('insertworkercomment_topic', req.body ,(err, result) => {
        console.log(result);
        res.json(result);
    });


    // mongoClient.connect(url, (err, db) => {
    //     if(err) {
    //         console.log(err);
    //         res.json('ERROR');
    //     } else {
    //         var dbo = db.db('freelancer');
    //         dbo.collection('projects').updateOne(
    //             {id: req.body.projectid},
    //             {$set: {comment: req.body.comment}}, function(err, result) {
    //                 if(err) {
    //                     console.log(err);
    //                     res.json('ERROR');
    //                 } else {
    //                     console.log(result.result);
    //                     res.json('Comment Updated Successfully');
    //                 }
    //             })
    //     }
    // })

});


router.post('/getworkercomment', (req, res, next) => {
    kafka.make_request('getworkercomment_topic', req.body ,(err, result) => {
        console.log(result);
        res.json(result);
    });
    // console.log(req.body);
    // mongoClient.connect(url, (err, db) => {
    //     if(err) {
    //         console.log(err);
    //         res.json('ERROR');
    //     } else {
    //         var dbo = db.db('freelancer');
    //         dbo.collection('projects').find({id: req.body.projectid}).toArray(function(err, result) {
    //             if(err) {
    //                 console.log(err);
    //                 res.json('ERROR');
    //             } else {
    //                 console.log(result[0]);
    //                 res.json(result[0].comment);
    //             }
    //         })
    //     }
    // })
});


router.post('/saveimage', (req, res) => {
    console.log("hello");
    let image_form = new multiparty.Form();
    image_form.parse(req, (err, fields, files) => {
        console.log(files);
        let { path: tempPath, originalFilename } = files.filevalue[0];
        var fileType = originalFilename.split(".");
        console.log(fileType)
        let copyToPath = "./images/" + fields.username[0] + "." + fileType[fileType.length - 1];
        //add path (copyToPath) to database pending
        console.log(copyToPath);
        fs.readFile(tempPath, (err, data) => {
            if (err) throw err;
            fs.writeFile(copyToPath, data, (err) => {
                if (err) throw err;
                // delete temp image
                fs.unlink(tempPath, () => {
                });

                mongoClient.connect(url, (err, db) => {
                    if(err) throw err;
                    else {
                        console.log('Connected to mongodb');
                        var dbo = db.db('cmpe273venkateshfreelancer');
                        dbo.collection('users').updateOne(
                            { username: fields.username[0] },
                            { $set: { image_name: fields.username[0] + "." + fileType[fileType.length - 1] } },
                            function(err, result) {
                                if(err) {
                                    db.close();
                                    console.log('err');
                                    throw err;
                                } else {
                                    db.close();
                                    res.json({message: 'Image Uploaded', fileType: fileType[fileType.length - 1]});
                                }
                            }
                        )
                    }
                })

                //
            });
        });
        console.log("In /saveImage... ", req.body);
        //res.json({message: "hello"});
    });
});

router.get('/getuserimage', (req, res) => {
    kafka.make_request('getuserimage_topic', req.query ,(err, result) => {
        console.log(result);
        res.json(result);
    });
    // mongoClient.connect(url, (err, db) => {
    //     if(err) {
    //         console.log(err);
    //         db.close();
    //         throw err;
    //     } else {
    //         var dbo = db.db('freelancer');
    //         dbo.collection('users').find({username: req.query.username}).toArray((err, result) => {
    //             if(err) {
    //                 console.log(err);
    //                 db.close();
    //                 res.json('No Image found');
    //             } else {
    //                 db.close();
    //                 console.log(result);
    //                 res.json({image_name: result[0]});
    //             }
    //
    //         })
    //     }
    // })

});


module.exports = router;
