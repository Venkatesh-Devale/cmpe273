var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connectionPool = mysql.createPool({
  connectionLimit : 1000,
  host : 'localhost',
  user : 'root',
  password : 'root',
  database : 'freelancer'
})


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', function(req, res, next) {
  console.log(req.body);

  const username = req.body.username;
  const password = req.body.password;
  const emailid = req.body.emailid;
  const usertype = req.body.radioHireOrEmployer;

  connectionPool.getConnection((err, connection) => {
    if(err) {
      res.json({
        code : 100,
        status : "Error in connecting to database"
      });
      
    } else {
      console.log('Connected to database with thread '+ connection.threadId);
      var sql = 'INSERT INTO users (username, email, password, usertype) VALUES (?, ?, ?, ?)';
      connection.query(sql,[username, emailid, password, usertype], (err, result) => {
        if(err) {
          console.log(err.name);
          console.log(err.message);
          res.json('ERROR');
        }
        else {
          console.log("New user signed up...");
          res.json('SIGNUP_SUCCESS');
        }
      });
      
    }
  })
  
});

router.post('/login', function(req, res, next) {
  console.log(req.body);
  connectionPool.getConnection((err, connection) => {
    if(err) {
      res.json({
        code : 100,
        status : "Error in connecting to database"
      });
      
    } else {
      console.log('Connected to database with thread '+ connection.threadId);
      var sql = 'SELECT * from users WHERE username = ' + mysql.escape(req.body.username) +' AND password = ' + mysql.escape(req.body.password);
      connection.query(sql, (err, result) => {
        if(result.length == 0) {
          res.json('ERROR');
        }
        else {
          console.log(result.length);
          res.json('LOGIN_SUCCESS');
        }
      });
      
    }
  })
});


module.exports = router;
