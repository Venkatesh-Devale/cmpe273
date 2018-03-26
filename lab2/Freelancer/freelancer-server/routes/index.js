
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

var connectionPool = mysql.createPool({
  connectionLimit : 1000,
  host : 'localhost',
  user : 'root',
  password : 'root',
  database : 'freelancer'
})

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
              number_of_bids: 0
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

router.post('/getmypublishedprojects', function(req, res, next) {
  console.log('In getmypublishedprojects');
  connectionPool.getConnection((err, connection) => {
    if(err) {
      res.json({
        code : 100,
        status : "Error in connecting to database"
      });
      
    } else {
      console.log('Connected to database with thread '+ connection.threadId);
      var sql = 'select * from projects left join (select projectid, sum(bidamount)/count(projectid) as average from bids group by projectid) as t' +
                ' on projects.id = t.projectid where employer = ' +  mysql.escape(req.body.username);


      connection.query(sql, (err, result) => {
        if(result.length == 0) {
          console.log("In getmypublished projects...1",result);
          res.json('ERROR');
        }
        else {
          console.log("In getmypublished projects...2",result);
          res.json(result);
        }
      });
      
    }
  })


});


router.post('/insertBidAndUpdateNumberOfBids', function(req, res, next) {
  console.log(req.body);
  const pid = req.body.project_id;
  const bidAmount = req.body.bid;
  const days = req.body.deliveryDays;
  const freelancer = req.body.freelancer;
  let bids = 0;
  connectionPool.getConnection((err, connection) => {
    if(err) {
      res.json({
        code : 100,
        status : "Error in connecting to database"
      });
      
    } else {
      console.log('Connected to database with thread '+ connection.threadId);
      var sqltemp = 'SELECT * FROM bids WHERE freelancer = ' + mysql.escape(freelancer) + ' AND projectid = ' + mysql.escape(pid);
      connection.query(sqltemp, (err, result) => {
        if(result.length == 0) {
          var sqlInsert = 'INSERT INTO bids (projectid, freelancer, period, bidamount) VALUES (?, ?, ?, ?)';
          connection.query(sqlInsert,[pid, freelancer, days, bidAmount], (err, result) => {
            if(err) {
              //console.log(err.name);
              //console.log(err.message);
              res.json('ERROR');
            }
            else {
              console.log("Bid inserted Successfully...");
              res.json('BID INSERTED SUCCESS');
            }
          });
        } else {
          res.json('ERROR');
        }
      })
      
       
      var getNumberOfBids = 'SELECT number_of_bids from projects WHERE id = ' + mysql.escape(pid);
      connection.query(getNumberOfBids, (err, result) => {
        if(err) 
          console.log(err);
        else {
          bids = result[0].number_of_bids;
        console.log('After getNumberOfBids...'+bids);
        var ubids = bids + 1;
        var updateBids = 'UPDATE projects SET number_of_bids = ' + ubids + ' WHERE id = ' + mysql.escape(pid);
          connection.query(updateBids, (err, result) => {
            if(err)
              console.log(err);
            else
              console.log('After updateBids...',result);
        
        });
        }
        
      });
    }
  })
  
});


router.post('/getmybiddedprojects', function(req, res, next) {
  
  console.log(req.body);
  connectionPool.getConnection((err, connection) => {
    if(err) {
      res.json({
        code : 100,
        status : 'Error in connecting to database'
      })
    } else {
      let sql = 'select * from projects as p ' +
      'inner join ((select b.projectid, b.freelancer, b.bidamount, b.period, t1.average from bids as b ' +
      'inner join (select projectid, sum(bidamount)/count(projectid) as average from bids ' +
      'group by projectid) as t1 ' +
      'on b.projectid = t1.projectid ' +
      'where b.freelancer = ' + mysql.escape(req.body.username) + ') as t2 )' +
      'on p.id = t2.projectid';
      connection.query(sql, (err, result) => {
        if(err)
          console.log(err);
        else {
          console.log(result);
          res.json(result);
        }
      })
    }
  })



});

router.post('/getproject', function(req, res, next) {
  console.log('In getproject', req.body);
  const projectId = req.body.projectid;
  connectionPool.getConnection((err, connection) => {
    if(err) {
      res.json({
        code : 100,
        status : "Error in connecting to database"
      });
      
    } else {
      var sql = 'select * from projects as p ' +
      'left join ((select projectid, sum(bidamount)/count(projectid) as average ' +
      'from bids ' +
      'group by projectid) as t) ' +
      'on p.id = t.projectid ' +
      'where p.id = ' + mysql.escape(projectId);
      connection.query(sql, (err, result) => {
        if(err) {
          res.json({
            code : 100,
            status : "Error retreiving project..."
          });
        } else {
          res.json(result);
        }
      })
    }
  })
})

router.post('/getAllBidsForThisProject', (req, res, next) => {
  console.log('In getAllBidsForThisProject', req.body.projectid);
  const projectId = req.body.projectid;
  connectionPool.getConnection((err, connection) => {
    if(err) {
      res.json({
        code : 100,
        status : "Error in connecting to database"
      });
      
    } else {
      //var sql = 'SELECT * from bids inner join projects on bids.projectid = projects.id WHERE projectid = ' + mysql.escape(projectId);
      var sql = 'select  t.freelancer, t.period, t.bidamount, users.image_name from users inner join ((SELECT bids.freelancer, bids.bidamount, bids.period from bids inner join projects on bids.projectid = projects.id WHERE projectid = ' + mysql.escape(projectId) + ') as t) on t.freelancer = users.username;'
      connection.query(sql, (err, result) => {
        if(err) {
          res.json({
            code : 100,
            status : "Error retreiving bids..."
          });
        } else {
          res.json(result);
        }
      })
    }
  })
})

router.post('/setworkerforproject', (req, res, next) => {
  console.log(req.body);
  connectionPool.getConnection( (err, connection) => {
    if(err) {
      res.json('Error connecting to database...')
    } else {
      var sql = 'update projects set worker = ' + mysql.escape(req.body.freelancer) + ' where id = ' + mysql.escape(req.body.pid);
      connection.query(sql, (err, result) => {
        if(err) {
          res.json('Error updating the worker for this project');
        } else {
          //res.json('Worker set successfully for this project');
          var newQuery = 'update projects set estimated_completion_date = (SELECT DATE_ADD(CURDATE(), INTERVAL (select period from bids ' +
          'where freelancer = '+ mysql.escape(req.body.freelancer) +' and projectid = '+ mysql.escape(req.body.pid) +' ) DAY)) ' + 'where id = ' + mysql.escape(req.body.pid);
          connection.query(newQuery, (err, result) => {
            if(err) {
              console.log(err);
            } else {
              res.json('Updated the estimated completion date...');
            }
          })
        }
      });

    }
  })
})


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
