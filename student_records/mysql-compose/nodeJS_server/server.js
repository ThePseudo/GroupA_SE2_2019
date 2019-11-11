const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql');
const router = express.Router();

app.listen(8080);

var connection = mysql.createConnection({
  host     : 'db:3306',
  user     : 'root',
  database : 'test_db',
  password : 'pwd',
  charset  : 'utf8',
  port     : '3306'
});

connection.connect();

// connection.query('SELECT * FROM employees', function(err, rows, fields) {
//   if (err) throw err;
//   console.log('The solution is: ', rows[0].solution);
// });

connection.end();
/* router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/home.html'));
  //__dirname : It will resolve to your project folder.
});

app.use("/",router);
app.listen(8080); */