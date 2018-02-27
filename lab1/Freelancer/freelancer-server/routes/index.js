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
      connection.query(sql,[username, password, emailid, usertype], (err, result) => {
        if(err) throw err;
        else {
          console.log("New user signed up...");
          res.json('SUCCESS');
        }
      });
      
    }
  })
  
});


module.exports = router;
