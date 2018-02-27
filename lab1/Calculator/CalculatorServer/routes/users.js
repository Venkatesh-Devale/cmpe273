var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/operations', function(req, res, next) {
  console.log(req.body);
  let data;
  switch(req.body.op) {
    case '+': data = Number(req.body.op1) + Number(req.body.op2);
              break;
    case '-': data = Number(req.body.op1) - Number(req.body.op2);
              break;
    case '*': data = Number(req.body.op1) * Number(req.body.op2);
              break;
    case '/': if(Number(req.body.op2) == 0) {
                data = 'Divide by zero error';
              } else {
                data = Number(req.body.op1) / Number(req.body.op2);
              }
              break;
    default: break;

  }
  res.json(data);
});



module.exports = router;
