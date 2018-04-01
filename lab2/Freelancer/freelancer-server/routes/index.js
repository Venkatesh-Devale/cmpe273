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
var url = "mongodb://localhost:27017/";
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'devalevenkatesh@gmail.com', // Your email id
        pass: '94714Sanjay' // Your password
    }
});

var connectionPool = mysql.createPool({
  connectionLimit : 1000,
  host : 'localhost',
  user : 'root',
  password : 'root',
  database : 'freelancer'
})


// var mongoConnectionPool;
//
// mongoClient.connect(url, (err, db) => {
//     if(err) throw err;
//     mongoConnectionPool = db;
// })


// var connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "freelancer"
// });

//var globalUsername = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/checkexistinguser', (req, res, next) => {
   console.log('In checkexistinguser...', req.body);
   mongoClient.connect(url, (err, db) => {
      var dbo = db.db('freelancer');
      dbo.collection('users').find({username: req.body.username}).toArray((err, result) => {
          if(result.length !== 0) {
              res.json('Username already exists');
          } else {
              res.json('Username does not exists');
          }
      })
   });
});

router.post('/signup', function(req, res, next) {
  console.log(req.body);

  const username = req.body.username;
  let password = req.body.password;
  const emailid = req.body.emailid;
  
  ////commented mysql part from lab1
  // connectionPool.getConnection((err, connection) => {
  //   if(err) {
  //     res.json({
  //       code : 100,
  //       status : "Error in connecting to database"
  //     });
  //
  //   } else {
  //     bcrypt.hash(password, saltRounds, (err, hash) => {
  //       console.log("In /signup....password hash is:" + hash);
  //     console.log('Connected to database with thread '+ connection.threadId);
  //     var sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  //     connection.query(sql,[username, emailid, hash], (err, result) => {
  //       if(err) {
  //         console.log(err.name);
  //         console.log(err.message);
  //         res.json('ERROR');
  //       }
  //       else {
  //         console.log("New user signed up...");
  //         res.json('SIGNUP_SUCCESS');
  //       }
  //     });
  //
  //     })
  //
  //   }
  // });

    //mongo from lab2
    mongoClient.connect(url, (err, connection) => {
        if(err) throw err;
        else {

            bcrypt.hash(password, saltRounds, (err, hash) => {
                console.log("In /signup....password hash is:" + hash);

                console.log("Connected to mongodb...");
                var dbo = connection.db("freelancer");
                dbo.collection('users').insertOne({
                    username: req.body.username,
                    password: hash,
                    email: req.body.emailid,
                    phone: '',
                    aboutme: '',
                    skills: '',
                    image_name: 'default.png'
                }).then( (result) => {
                    console.log("Insertion Successfully");
                    console.log(result.insertedId);
                    connection.close();
                    res.json('SIGNUP_SUCCESS');
                })


            })



        }
    });
  
});



//this will be called from authenticate function from passport in /login API call
passport.use(new LocalStrategy( function(username, password, done) {
        mongoClient.connect(url, (err, db) => {
            if(err) throw err;
            else
                console.log("Connected to mongodb...");
            var dbo = db.db("freelancer");
            var query = {username: username};
            dbo.collection("users").find(query).toArray( (err, result) => {
                if(err) {
                    return done(err, false);
                }

                if(result.length > 0) {
                    console.log(result[0].username);
                    var hash = result[0].password;
                    bcrypt.compare(password, hash, (err, doesMatch) => {
                        if(doesMatch) {
                            console.log("Inside result.length",result[0].username);
                            return done(null, result[0]);
                        } else {
                            return done(null, false);
                        }
                        db.close();
                    })

                }
            });
        });
    }
));

router.post('/login', function(req, res, next) {
  console.log(req.body);

  //commented mysql part from lab1
  // connectionPool.getConnection((err, connection) => {
  //   if(err) {
  //     res.json({
  //       code : 100,
  //       status : "Error in connecting to database"
  //     });
  //
  //   } else {
  //     console.log('Connected to database with thread '+ connection.threadId);
  //     var sql = 'SELECT * from users WHERE username = ' + mysql.escape(req.body.username);
  //
  //     connection.query(sql, (err, result) => {
  //
  //
  //     var hash = result[0].password;
  //     console.log("This is hashed password from the db...." + hash);
  //     bcrypt.compare(req.body.password, hash, (err, doesMatch) => {
  //       if(doesMatch) {
  //         console.log('Session started....');
  //         req.session.username = result[0].username;
  //         var jsonResponse = {"result" : result[0].username, "session": req.session.username};
  //         res.send(jsonResponse);
  //       } else {
  //         console.log(err);
  //         res.json('ERROR');
  //       }
  //     })
  //     });
  //
  //   }
  // })

 //mongo from lab2
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
  const email = req.body.email[0];
  const phone = req.body.phone[0];
  const aboutme = req.body.aboutme[0];
  const skills = req.body.skills[0];

  // connectionPool.getConnection((err, connection) => {
  //   if(err) {
  //     console.log('Cannot connect to DB..');
  //   } else {
  //     console.log('Connected to database with thread '+ connection.threadId);
  //     var sql = 'UPDATE users SET email = ' + mysql.escape(email) + ', phone = ' + mysql.escape(phone) + ', aboutme = ' + mysql.escape(aboutme) +
  //                 ' WHERE username = ' + mysql.escape(username);
  //     console.log(sql);
  //     connection.query(sql,(err, result) => {
  //       if(err) {
  //         console.log(err.name);
  //         console.log(err.message);
  //         //res.json('ERROR');
  //       }
  //       else {
  //         console.log("user updated...");
  //         res.json('UPDATE_SUCCESS');
  //       }
  //     });
  //   }
  // })


    mongoClient.connect(url, function(err, db) {
        if (err) throw err;
        else {
            var dbo = db.db("freelancer");
            var myquery = { username: username };
            var newvalues = {$set: {email: email, phone: phone, aboutme: aboutme, skills: skills }} ;
            dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
                if (err) {
                    res.json('ERROR');
                }
                else {
                    console.log("1 document updated", result.result);
                    res.json('UPDATE_SUCCESS');
                    db.close();
                }

            });
        }
    });
});

router.post('/getprofile', function(req, res, next) {
  console.log(req.body);
  console.log('In getprofile node...' + req.session.username);
  // connectionPool.getConnection((err, connection) => {
  //   if(err) {
  //     res.json({
  //       code : 100,
  //       status : "Error in connecting to database"
  //     });
  //
  //   } else {
  //     console.log('Connected to database with thread '+ connection.threadId);
  //     var sql = 'SELECT * from users WHERE username = ' + mysql.escape(req.body.username);
  //     connection.query(sql, (err, result) => {
  //       if(result.length == 0) {
  //         res.json('ERROR');
  //       }
  //       else {
  //         console.log(result);
  //         res.json(result);
  //       }
  //     });
  //
  //   }
  // })

    mongoClient.connect(url, (err, db) => {
        if(err) throw err;
        else {
            console.log("Connected to mongodb...");
            var dbo = db.db("freelancer");
            var query = {username: req.body.username};
            dbo.collection("users").find(query).toArray( (err, result) => {
                if(err) {
                    res.json('ERROR');
                }

                if(result.length > 0) {
                    console.log(result);
                    res.json(result);
                    db.close();
                }
            });
        }
    });

});


router.post('/postproject', function(req, res, next) {
  console.log('In server side...', req.body);
  const employer = req.body.owner;
  const title = req.body.title;
  const description = req.body.description;
  const skills_required = req.body.skillsRequired;
  const budgetrange = req.body.budgetrange;
  const id = req.body.id;

  // connectionPool.getConnection((err, connection) => {
  //   if(err) {
  //     res.json('DB Connection error');
  //   } else {
  //     var sql = 'INSERT INTO projects (id, title, description, skills_required, budgetrange, employer) VALUES (?, ?, ?, ?, ?, ?)';
  //     connection.query(sql, [id, title, description, skills_required, budgetrange, employer], (err, result) => {
  //         if(err) {
  //           console.log(err);
  //           res.json('ERROR');
  //         } else {
  //           console.log('Project inserted successfully...');
  //           res.json('PROJECT_INSERTED_SUCCESS');
  //         }
  //       })
  //   }
  // })

  mongoClient.connect(url, function(err, db) {
      if(err) throw err;
      else {
          var dbo = db.db('freelancer');
          dbo.collection('projects').insertOne({
              id: id,
              title: title,
              description: description,
              skills_required: skills_required,
              budgetrange: budgetrange,
              employer: employer,
              open: 'open',
              worker: '',
              number_of_bids: 0,
              estimated_completion_date: null
          }).then( (response) => {
              console.log("Project Insertion Successfully");
              console.log(response.insertedId);
              db.close();
              res.json('PROJECT_INSERTED_SUCCESS');
          })
      }
  })
  
});


router.post('/getallopenprojects', function(req, res, next) {
  console.log('In getallopenprojects');
  // connectionPool.getConnection((err, connection) => {
  //   if(err) {
  //     res.json({
  //       code : 100,
  //       status : "Error in connecting to database"
  //     });
  //
  //   } else {
  //     console.log('Connected to database with thread '+ connection.threadId);
  //     var sql = 'SELECT * from projects WHERE open = ' + mysql.escape('open');
  //     connection.query(sql, (err, result) => {
  //       if(result.length == 0) {
  //         res.json('ERROR');
  //       }
  //       else {
  //         console.log(result);
  //         res.json(result);
  //       }
  //     });
  //
  //   }
  // });

    mongoClient.connect(url, (err, db) => {
        if(err) throw err;
        else {
            console.log("Connected to mongodb...");
            var dbo = db.db("freelancer");
            var query = {open: "open"};
            dbo.collection("projects").find(query).toArray( (err, result) => {
                if(err) {
                    res.json('ERROR');
                }

                if(result.length > 0) {
                    console.log("In mongos get all open projects...",result);
                    res.json(result);
                    db.close();
                }
            });
        }
    });
});


router.post('/getallrelevantopenprojects', function(req, res, next) {
    var userSkills = null;
    var userSkillsArray = null;
    var allOpenProjectsArray = null;
    var finalRelevantProjectsArray = [];
    console.log("In /getallrelevantopenprojects", req.body.username);

    mongoClient.connect(url, (err, db) => {
        if(err) throw err;
        else {
            console.log("Connected to mongodb...");
            var dbo = db.db("freelancer");
            var query = {username: req.body.username};
            dbo.collection("users").find(query).toArray( (err, result) => {
                if(err) {
                    console.log('ERROR');
                    res.json('ERROR');
                }

                if(result.length > 0) {
                    userSkills = result[0].skills;
                    if(userSkills === null) {
                        console.log("User has not updated any skills...");
                        res.json({"finalRelevantProjectsArray": finalRelevantProjectsArray});

                    }

                else {
                        userSkillsArray = userSkills.split(",");
                        console.log("User Skills Array...", userSkillsArray);
                        dbo.collection("projects").find({}).toArray( (err, result) => {
                            if(err) {
                                console.log(err);
                                res.json('ERROR');

                            }

                            if(result.length > 0) {
                                allOpenProjectsArray = result;
                                var count = 0;
                                for(var i = 0; i < allOpenProjectsArray.length; i++) {
                                    count = 0;
                                    var projectRequiredSkillsArray = allOpenProjectsArray[i].skills_required.split(',');
                                    console.log("projectRequiredSkillsArray",projectRequiredSkillsArray);
                                    for(var j = 0; j < userSkillsArray.length; j++) {
                                        for(var k = 0; k < projectRequiredSkillsArray.length; k++) {
                                            if(userSkillsArray[j].toLowerCase() === projectRequiredSkillsArray[k].toLocaleLowerCase()) {
                                                count++;
                                            }
                                        }
                                    }
                                    console.log("Final Skills matched count...", count);
                                    if(count >= 2) {
                                        finalRelevantProjectsArray.push(allOpenProjectsArray[i]);
                                    }
                                }
                                console.log("Matched final skills projects...", finalRelevantProjectsArray);
                                db.close();
                                res.json({"finalRelevantProjectsArray" : finalRelevantProjectsArray});
                            }

                        });
                    }

                }
            });



        }

    });





});



router.post('/getmypublishedprojects', function(req, res, next) {
  console.log('In getmypublishedprojects');
  // connectionPool.getConnection((err, connection) => {
  //   if(err) {
  //     res.json({
  //       code : 100,
  //       status : "Error in connecting to database"
  //     });
  //
  //   } else {
  //     console.log('Connected to database with thread '+ connection.threadId);
  //     var sql = 'select * from projects left join (select projectid, sum(bidamount)/count(projectid) as average from bids group by projectid) as t' +
  //               ' on projects.id = t.projectid where employer = ' +  mysql.escape(req.body.username);
  //
  //
  //     connection.query(sql, (err, result) => {
  //       if(result.length == 0) {
  //         console.log("In getmypublished projects...1",result);
  //         res.json('ERROR');
  //       }
  //       else {
  //         console.log("In getmypublished projects...2",result);
  //         res.json(result);
  //       }
  //     });
  //
  //   }
  // })

    mongoClient.connect(url, (err, db) => {
        if(err) throw err;
        else {
            console.log("Connected to mongodb...");
            var dbo = db.db("freelancer");

            dbo.collection('projects').aggregate([
                { $match: { "employer" : req.body.username } },
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


        ]).toArray(function(err, result) {
                if (err) {
                    res.json('ERROR');
                }
                else {
                    res.json(result);
                }

                db.close();
            });
        }
    });




});


router.post('/insertBidAndUpdateNumberOfBids', function(req, res, next) {
  console.log(req.body);
  const pid = req.body.project_id;
  const bidAmount = parseInt(req.body.bid);
  const days = parseInt(req.body.deliveryDays);
  const freelancer = req.body.freelancer;
  let bids = 0;
  // connectionPool.getConnection((err, connection) => {
  //   if(err) {
  //     res.json({
  //       code : 100,
  //       status : "Error in connecting to database"
  //     });
  //
  //   } else {
  //
  //     console.log('Connected to database with thread '+ connection.threadId);
  //     var sqltemp = 'SELECT * FROM bids WHERE freelancer = ' + mysql.escape(freelancer) + ' AND projectid = ' + mysql.escape(pid);
  //     connection.query(sqltemp, (err, result) => {
  //       if(result.length == 0) {
  //         var sqlInsert = 'INSERT INTO bids (projectid, freelancer, period, bidamount) VALUES (?, ?, ?, ?)';
  //         connection.query(sqlInsert,[pid, freelancer, days, bidAmount], (err, result) => {
  //           if(err) {
  //             //console.log(err.name);
  //             //console.log(err.message);
  //             res.json('ERROR');
  //           }
  //           else {
  //             console.log("Bid inserted Successfully...");
  //             res.json('BID INSERTED SUCCESS');
  //           }
  //         });
  //       } else {
  //         res.json('ERROR');
  //       }
  //     })
  //
  //
  //     var getNumberOfBids = 'SELECT number_of_bids from projects WHERE id = ' + mysql.escape(pid);
  //     connection.query(getNumberOfBids, (err, result) => {
  //       if(err)
  //         console.log(err);
  //       else {
  //         bids = result[0].number_of_bids;
  //       console.log('After getNumberOfBids...'+bids);
  //       var ubids = bids + 1;
  //       var updateBids = 'UPDATE projects SET number_of_bids = ' + ubids + ' WHERE id = ' + mysql.escape(pid);
  //         connection.query(updateBids, (err, result) => {
  //           if(err)
  //             console.log(err);
  //           else
  //             console.log('After updateBids...',result);
  //
  //       });
  //       }
  //
  //     });
  //
  //
  //
  //   }
  // })

    mongoClient.connect(url, (err, db) => {
        if(err) throw err;
        else {
            console.log("Connected to mongodb...");
            var dbo = db.db("freelancer");

            dbo.collection("bids").find({
                freelancer: freelancer,
                projectid: pid
            }).toArray( (err, result) => {

                if(result.length == 0) {
                    dbo.collection("bids").insertOne({
                        projectid: pid,
                        freelancer: freelancer,
                        period: days,
                        bidamount: bidAmount
                    }).
                    then((result) => {
                        console.log("Bid inserted Successfully...");
                        dbo.collection("projects").find({
                            id: pid
                        }).toArray((err, result1) => {
                            console.log("After inserting bid..getting the number_of_bids for that project", result1[0].number_of_bids);
                            bids = result1[0].number_of_bids;
                            var ubids = bids + 1;
                            dbo.collection("projects").updateOne({id: pid}, {$set: {number_of_bids: ubids} }, function(err, result2) {
                                if (err) {
                                    console.log('ERROR in updating bids...');
                                }
                                else {
                                    console.log("1 document updated", result2.result);
                                    db.close();
                                }

                            });
                        });
                        //db.close();
                        res.json('BID INSERTED SUCCESS');
                    })
                } else {
                    db.close();
                    res.json('ERROR');
                }
            });


        }
    });
  
});


router.post('/getmybiddedprojects', function(req, res, next) {
  
  console.log(req.body);
  // connectionPool.getConnection((err, connection) => {
  //   if(err) {
  //     res.json({
  //       code : 100,
  //       status : 'Error in connecting to database'
  //     })
  //   } else {
  //     let sql = 'select * from projects as p ' +
  //     'inner join ((select b.projectid, b.freelancer, b.bidamount, b.period, t1.average from bids as b ' +
  //     'inner join (select projectid, sum(bidamount)/count(projectid) as average from bids ' +
  //     'group by projectid) as t1 ' +
  //     'on b.projectid = t1.projectid ' +
  //     'where b.freelancer = ' + mysql.escape(req.body.username) + ') as t2 )' +
  //     'on p.id = t2.projectid';
  //     connection.query(sql, (err, result) => {
  //       if(err)
  //         console.log(err);
  //       else {
  //         console.log(result);
  //         res.json(result);
  //       }
  //     })
  //   }
  // })

    mongoClient.connect(url, (err, db) => {
        if(err) throw err;
        else {
            console.log("Connected to mongodb...");
            var dbo = db.db("freelancer");
            dbo.collection('projects').aggregate([

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
                { $match: { "mybiddedProjects.freelancer" : req.body.username } },
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
                    res.json('ERROR');
                }
                else {
                    res.json(result);
                }

                db.close();
            });
        }
    });



});

router.post('/getmyassignedprojects', function(req, res, next) {
   console.log(req.body.username);
   mongoClient.connect(url, function(err, db) {
       if(err) throw err;
       else {
           var dbo = db.db('freelancer');
           dbo.collection('projects').find({worker: req.body.username}).toArray(function (err, result) {
               if(result.length > 0) {
                   res.json({'myassignedprojectsArray': result});
               } else {
                   res.json({'myassignedprojectsArray': []});
               }
           });
       }
   })
});


router.post('/getproject', function(req, res, next) {
  console.log('In getproject', req.body);
  const projectId = req.body.projectid;
  // connectionPool.getConnection((err, connection) => {
  //   if(err) {
  //     res.json({
  //       code : 100,
  //       status : "Error in connecting to database"
  //     });
  //
  //   } else {
  //     var sql = 'select * from projects as p ' +
  //     'left join ((select projectid, sum(bidamount)/count(projectid) as average ' +
  //     'from bids ' +
  //     'group by projectid) as t) ' +
  //     'on p.id = t.projectid ' +
  //     'where p.id = ' + mysql.escape(projectId);
  //     connection.query(sql, (err, result) => {
  //       if(err) {
  //         res.json({
  //           code : 100,
  //           status : "Error retreiving project..."
  //         });
  //       } else {
  //         res.json(result);
  //       }
  //     })
  //   }
  // })
    mongoClient.connect(url, (err, db) => {
        if(err) throw err;
        else {
            console.log("Connected to mongodb...");
            var dbo = db.db("freelancer");

            dbo.collection('projects').aggregate([
                {
                    $match: { "id" : projectId }
                },
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
                }
            ]).toArray(function(err, result) {
                if (err) {
                    res.json('ERROR');
                }
                else {
                    res.json(result);
                }

                db.close();
            });
        }
    });

})

router.post('/getAllBidsForThisProject', (req, res, next) => {
  console.log('In getAllBidsForThisProject', req.body.projectid);
  const projectId = req.body.projectid;
  // connectionPool.getConnection((err, connection) => {
  //   if(err) {
  //     res.json({
  //       code : 100,
  //       status : "Error in connecting to database"
  //     });
  //
  //   } else {
  //     //var sql = 'SELECT * from bids inner join projects on bids.projectid = projects.id WHERE projectid = ' + mysql.escape(projectId);
  //     var sql = 'select  t.freelancer, t.period, t.bidamount, users.image_name from users inner join ((SELECT bids.freelancer, bids.bidamount, bids.period from bids inner join projects on bids.projectid = projects.id WHERE projectid = ' + mysql.escape(projectId) + ') as t) on t.freelancer = users.username;'
  //     connection.query(sql, (err, result) => {
  //       if(err) {
  //         res.json({
  //           code : 100,
  //           status : "Error retreiving bids..."
  //         });
  //       } else {
  //         res.json(result);
  //       }
  //     })
  //   }
  // })
    mongoClient.connect(url, (err, db) => {
        if(err) throw err;
        else {
            console.log("Connected to mongodb...");
            var dbo = db.db("freelancer");

            dbo.collection('projects').aggregate([
                {
                    $match: { "id" : projectId }
                },
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
                        "preserveNullAndEmptyArrays": false
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
                },
                {
                    $lookup: {
                        "from" : "users",
                        "localField" : "employer",
                        "foreignField" : "username",
                        "as" : "projectbidsWithUserDetails"
                    }
                },
                {
                    $unwind:
                        {
                            "path": "$projectbidsWithUserDetails",
                            "preserveNullAndEmptyArrays": true
                        }
                },
                {
                    $project: {
                        "freelancer" : 1,
                        "period" : 1,
                        "bidamount" : 1,
                        "image_name" : "$projectbidsWithUserDetails.image_name",
                        "employer" : 1

                    }
                }



            ]).toArray(function(err, result) {
                if (err) {
                    res.json('ERROR');
                }
                else {
                    res.json(result);
                }

                db.close();
            });
        }
    });
})

router.post('/getspecificbidforproject', (req, res, next) => {
   console.log('In getspecificbidforproject server side...', req.body.projectid);


    mongoClient.connect(url, (err, db) => {
        if(err) throw err;
        else {
            console.log("Connected to mongodb...");
            var dbo = db.db("freelancer");



            dbo.collection("projects").aggregate([
                {
                    $match: { "id": req.body.projectid}
                },
                {
                    $project: {
                        "id": 1,
                        "worker":1,
                        "employer": 1,
                        "title": 1,
                        "description" : 1,
                        "estimated_completion_date": 1
                    }
                }
                ,
                {
                    $lookup: {
                        from: "bids",
                        let: { pid: "$id", worker: "$worker" },
                        pipeline: [
                            { $match:
                                    { $expr:
                                            { $and:
                                                    [
                                                        { $eq: [ "$projectid",  "$$pid" ] },
                                                        { $eq: [ "$freelancer", "$$worker" ] }
                                                    ]
                                            }
                                    }
                            }
                        ],
                        as: "projectspecificbid"
                    }
                },
                {
                    $unwind: {
                        "path": "$projectspecificbid"
                    }
                },
                {
                    $project: {
                        "_id": 0,
                        "id" : 1,
                        "employer" : 1,
                        "worker" : 1,
                        "title": 1,
                        "description" : 1,
                        "estimated_completion_date": 1,
                        "bidperiod" : "$projectspecificbid.period",
                        "bidamount" : "$projectspecificbid.bidamount"
                    }
                }
            ]).toArray( (err, result) => {
                if(err) {
                    res.json('ERROR');
                }

                if(result.length > 0) {
                    console.log(result);
                    res.json(result);
                    db.close();
                }
            });
        }
    });

});


router.post('/setworkerforproject', (req, res, next) => {
  console.log(req.body);
  // connectionPool.getConnection( (err, connection) => {
  //   if(err) {
  //     res.json('Error connecting to database...')
  //   } else {
  //     var sql = 'update projects set worker = ' + mysql.escape(req.body.freelancer) + ' where id = ' + mysql.escape(req.body.pid);
  //     connection.query(sql, (err, result) => {
  //       if(err) {
  //         res.json('Error updating the worker for this project');
  //       } else {
  //         //res.json('Worker set successfully for this project');
  //         var newQuery = 'update projects set estimated_completion_date = (SELECT DATE_ADD(CURDATE(), INTERVAL (select period from bids ' +
  //         'where freelancer = '+ mysql.escape(req.body.freelancer) +' and projectid = '+ mysql.escape(req.body.pid) +' ) DAY)) ' + 'where id = ' + mysql.escape(req.body.pid);
  //         connection.query(newQuery, (err, result) => {
  //           if(err) {
  //             console.log(err);
  //           } else {
  //             res.json('Updated the estimated completion date...');
  //           }
  //         })
  //       }
  //     });
  //
  //   }
  // })
    mongoClient.connect(url, function(err, db) {
        if (err) throw err;
        else {
            var dbo = db.db("freelancer");
            var myquery = { id: req.body.pid };
            var newvalues = {$set: {worker: req.body.freelancer , estimated_completion_date: new Date()}} ;

            dbo.collection("projects").updateOne(myquery, newvalues, function(err, result) {
                if (err) {
                    res.json('ERROR');
                }
                else {
                    console.log("1 document updated", result.result);
                    dbo.collection('projects').aggregate([
                        {
                            $match: {
                                "id": req.body.pid
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
                    res.json('UPDATE_SUCCESS');
                    db.close();
                }

            });
        }
    });

})

router.post('/getuseraccountbalance', (req, res, next) => {
    console.log(req.body);

    mongoClient.connect(url, (err, db) => {
        if(err) throw err;
        else {
            console.log("Connected to mongodb...");
            var dbo = db.db("freelancer");
            var query = {username: req.body.user};
            dbo.collection("users").find(query).toArray( (err, result) => {
                if(err) {
                    db.close();
                    res.json('ERROR');
                }

                if(result.length > 0) {
                    console.log(result);
                    db.close();
                    res.json(result);
                }
            });
        }
    });


});

router.post('/transact', (req, res, next) => {
   console.log(req.body);
   var updatedBalanceForEmployer = req.body.employerbalance - req.body.bidamount;

   mongoClient.connect(url, (err, db) => {
       if(err) {
           db.close();
           throw err;
       }
       else {
           var dbo = db.db("freelancer");
           var myquery = { username: req.body.employer };
           var newvalues = {$set: { balance: updatedBalanceForEmployer }} ;
           dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
               if (err) {
                   console.log("In updating employer balance",err);
                   db.close();
                   res.json('ERROR');
               }
               else {
                   console.log("1 document employer balance updated", result.result);

                   //updating worker balance

                   var updatedBalanceForWorker = req.body.workerbalance + req.body.bidamount;
                   myquery = { username: req.body.worker };
                   newvalues = {$set: { balance: updatedBalanceForWorker }} ;
                   dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
                       if (err) {
                           console.log("In updating worker balance",err);
                           db.close();
                           res.json('ERROR');
                       }
                       else {
                           console.log("1 document worker balance updated", result.result);

                           //inserting into transactionhistory for employer
                           dbo.collection('transaction_history').insertOne({
                               transactionid: req.body.transactionidemployer,
                               transactiontype: 'debit',
                               username: req.body.employer,
                               projectname: req.body.projectname,
                               projectid: req.body.projectid,
                               amount: req.body.bidamount,
                               date: new Date()
                           }).then( (result) => {
                               console.log("Transaction Insertion Successfull for worker");
                               console.log(result.insertedId);

                               //inserting into transactionhistory for worker
                               dbo.collection('transaction_history').insertOne({
                                   transactionid: req.body.transactionidworker,
                                   transactiontype: 'credit',
                                   username: req.body.worker,
                                   projectname: req.body.projectname,
                                   projectid: req.body.projectid,
                                   amount: req.body.bidamount,
                                   date: new Date()
                               }).then( (result) => {
                                   console.log("Transaction Insertion Successfull for worker");
                                   console.log(result.insertedId);

                                   //update the status to close of the project

                                   dbo.collection('projects').updateOne(
                                       {id: req.body.projectid},
                                       {$set: {open: 'closed'}}, function(err, result) {
                                            if(err) {
                                                console.log(err);
                                                db.close();
                                                res.json("Error updating project status to close");
                                            } else {
                                                res.json('200');
                                                db.close();
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

});

router.post('/getSearchCriteria', (req, res, next) => {
    console.log("In getSearchCriteria", req.body.search);
    var finalArrayToreturn = [];
    mongoClient.connect(url, (err, db) => {
        if(err) throw err;
        else {
            console.log("Connected to mongodb...");
            var dbo = db.db("freelancer");
            var query = {open: "open"};
            dbo.collection("projects").find(query).toArray( (err, result) => {
                for(var i = 0; i < result.length; i++) {
                    var n = result[i].title.replace(/[^a-zA-Z ]/g, "x").toLowerCase().search(req.body.search.replace(/[^a-zA-Z ]/g, "x").toLowerCase());
                    var m = result[i].skills_required.replace(/[^a-zA-Z ]/g, "x").toLowerCase().search(req.body.search.replace(/[^a-zA-Z ]/g, "x").toLowerCase());

                    if(n !== -1 || m !== -1) {
                        finalArrayToreturn.push(result[i]);
                    }
                }
                console.log(finalArrayToreturn);
                res.json(finalArrayToreturn);
            });
        }
    });


});

router.post('/getSearchCriteriaForDashBoard', (req, res, next) => {
    console.log("In getSearchCriteriaForDashBoard", req.body);
    var finalArrayToreturn = [];
    mongoClient.connect(url, (err, db) => {
        if(err) throw err;
        else {
            console.log("Connected to mongodb...");
            var dbo = db.db("freelancer");

﻿           dbo.collection('projects').aggregate([
                { $match: { "employer" : req.body.username } },
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
                    var n = result[i].title.replace(/[^a-zA-Z ]/g, "x").toLowerCase().search(req.body.search.replace(/[^a-zA-Z ]/g, "x").toLowerCase());
                    if(n !== -1) {
                        finalArrayToreturn.push(result[i]);
                    }

                }
                //console.log(finalArrayToreturn);
                res.json(finalArrayToreturn);
            });

        }
    });
});

router.post('/getSearchCriteriaForFreelancerDashboard', (req, res, next) => {
    console.log("In getSearchCriteriaForFreelancerDashboard", req.body);
    var finalArrayToreturn = [];
    mongoClient.connect(url, (err, db) => {
        if(err) throw err;
        else {
            console.log("Connected to mongodb...");
            var dbo = db.db("freelancer");
            ﻿dbo.collection("projects").aggregate([

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
                { $match: { "mybiddedProjects.freelancer" : req.body.username } },
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

            ]).toArray( (err, result) => {
                //console.log(result);
                for(var i = 0; i < result.length; i++) {
                    var n = result[i].title.replace(/[^a-zA-Z ]/g, "x").toLowerCase().search(req.body.search.replace(/[^a-zA-Z ]/g, "x").toLowerCase());
                    if(n !== -1) {
                        finalArrayToreturn.push(result[i]);
                    }

                }
                console.log(finalArrayToreturn);
                res.json(finalArrayToreturn);
            });
        }
    });
});


router.post('/gettransactionhistory', (req, res, next) => {
    console.log("In gettransactionhistory", req.body);
    mongoClient.connect(url, (err, db) => {
        if(err) {
            console.log(err);
            db.close();
            res.json('ERROR');
        } else {
            console.log("Connected to mongodb...");
            var dbo = db.db('freelancer');
            dbo.collection('transaction_history').find({username: req.body.user}).toArray((err, result) => {
                if(err) {
                    db.close();
                    res.json('ERROR');
                }

                if(result.length > 0) {
                    console.log(result);
                    db.close();
                    res.json(result);
                } else {
                    db.close();
                    res.json('No transaction history for this user');
                }
            })
        }
    })
});

router.post('/updateuserbalance', (req, res, next) => {
    console.log(req.body);
    mongoClient.connect(url, function(err, db) {
        if (err) throw err;
        else {
            var dbo = db.db("freelancer");
            var myquery = { username: req.body.username };
            var newvalues = {$set: { balance: req.body.amount}} ;
            dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
                if (err) {
                    res.json('ERROR');
                }
                else {
                    console.log("1 document updated", result.result);
                    dbo.collection('transaction_history').insertOne({
                        transactionid: req.body.transactionid,
                        transactiontype: req.body.transactiontype,
                        username: req.body.username,
                        amount: req.body.transactedamount,
                        date: new Date(),
                        projectname: req.body.projectname,
                    }).then( (result) => {
                        console.log("Transaction Insertion Successfull for user");
                        console.log(result.insertedId);
                        db.close();
                        res.json('UPDATE_SUCCESS');
                    })

                }

            });
        }
    });
});



router.post('/insertworkercomment', (req, res, next) => {
    console.log(req.body);

    mongoClient.connect(url, (err, db) => {
        if(err) {
            console.log(err);
            res.json('ERROR');
        } else {
            var dbo = db.db('freelancer');
            dbo.collection('projects').updateOne(
                {id: req.body.projectid},
                {$set: {comment: req.body.comment}}, function(err, result) {
                    if(err) {
                        console.log(err);
                        res.json('ERROR');
                    } else {
                        console.log(result.result);
                        res.json('Comment Updated Successfully');
                    }
                })
        }
    })

});


router.post('/getworkercomment', (req, res, next) => {
    console.log(req.body);
    mongoClient.connect(url, (err, db) => {
        if(err) {
            console.log(err);
            res.json('ERROR');
        } else {
            var dbo = db.db('freelancer');
            dbo.collection('projects').find({id: req.body.projectid}).toArray(function(err, result) {
                if(err) {
                    console.log(err);
                    res.json('ERROR');
                } else {
                    console.log(result[0]);
                    res.json(result[0].comment);
                }
            })
        }
    })
});

//mysql yet to convert to mongo
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
                connectionPool.getConnection(function(err, connection){
                    var sql = "update users set image_name='" + fields.username[0] + "." + fileType[fileType.length - 1] +   "' where username = '" +  fields.username[0] + "'";
                    connection.query(sql,function(err,rows){
                        if(err) throw err;
                        connection.release();
                        console.log(rows);
                    });
                    res.json({message: 'Image Uploaded', fileType: fileType[fileType.length - 1]});
                });
            });
        });
        console.log("In /saveImage... ", req.body);
        //res.json({message: "hello"});
    });
});

router.get('/getuserimage', (req, res) => {
    connectionPool.getConnection(function(err, connection){
        var sql = "select image_name from users where username='" + req.query.username + "'";
        connection.query(sql,function(err,rows){
            if(err) throw err;
            connection.release();
            console.log(rows);
            res.json({image_name: rows[0]})
        });
    })
});


module.exports = router;
