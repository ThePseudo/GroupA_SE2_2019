const express = require('express');
const pug = require('pug');
const mysql = require('mysql');
const session = require('express-session')
const fs = require('fs');
const https = require('https');
const http = require('http');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

//IMPORTO oggetto rappresentante la sessione.
//Per accedere ->  SESSION.sessioneData
//Per accedere a user SESSION.sessioneData.user
//Per accedere a campo user es. SESSION.sessioneData.user.id
//Per aggiungere campo a user SESSION.sessioneData.user.nomecampo = valore 
//Per aggiungere campo a sessione -> SESSION.sessioneData.nomecampo = valore
var SESSION = require("./Auth_manager.js"); 

var router = express.Router();

router.use('/:id', function (req, res, next) {
  console.log('Parent request URL:', req.originalUrl);
  next();
}, function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});


router.get("/parent_courselist", (req, res) => {
  const compiledPage = pug.compileFile("../pages/parent/parent_courselist.pug");
  res.end(compiledPage());
});

//// Page not found
// router.get('/*', (req, res) => {
//   fs.readFile(req.path, (err, data) => {
//       if (err) {
//           const compiledPage = pug.compileFile("../pages/base/404.pug");
//           res.end(compiledPage());
//       }
//       res.end(data);

//   })
// });

// router.post('/*', (req, res) => {
//   fs.readFile(req.path, (err, data) => {
//       if (err) {
//           const compiledPage = pug.compileFile("../pages/base/404.pug");
//           res.end(compiledPage());
//       }
//       res.end(data);

//   })
// });

router.get('/parent_home', (req, res) => {
  console.log(SESSION.sessionData);
  var commlist = [];
  var studlist = [];
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pwd",
    database: "students",
    insecureAuth: true
  });
  const compiledPage = pug.compileFile('../pages/parent/parent_homepage.pug');

  con.query('SELECT * FROM General_Communication', (err, rows, fields) => {

    if (err) {
      res.end("There is a problem in the DB connection. Please, try again later\n" + err + "\n");
      return;
    } 
      console.log(rows);
      for (var i = 0; i < rows.length; i++) {
        var communication = {
          id: rows[i].id,
          text: rows[i].communication,
          date: rows[i].comm_date
        }
        commlist[i] = communication;
      }
      //let sql = 'SELECT id,first_name,last_name FROM student';
      con.query('SELECT id,first_name,last_name FROM student WHERE parent_1=1 OR parent_2=1', (err, rows, fields) => {
        if (err) {
          res.end("There is a problem in the DB connection. Please, try again later\n" + err + "\n");
          return;
        } 
        console.log(rows);
        for (var i = 0; i < rows.length; i++) {
          var student = {
            id: rows[i].id,
            first_name: rows[i].first_name,
            last_name: rows[i].last_name
          }
          studlist[i] = student;
        }
        //console.log("Data successfully uploaded! " + result.insertId);
        con.end();
        res.end(compiledPage({
          communicationList: commlist,
          studentList: studlist,
        }));

      });
  });
});

router.get('/register_parent', (req, res) => {
  res.end("Hello, register parents!");
});

router.get("/marks", (req, res) => {
  // TODO: ID SHOULD BE TAKEN FROM SESSION
  var marks = [];
  var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "pwd",
    database: "students",
    insecureAuth: true
  });

  console.log("Connected to db");

  let sql = 'SELECT * FROM mark, course ' +
    'WHERE mark.course_id = course.id ' +
    'AND mark.student_id = ? ' +
    'ORDER BY mark.date_mark DESC';

  con.query(sql, [1], function (err, rows, fields) {
    if (err) {
      res.end("DB error: " + err);
    } else {
      // Check if the result is found or not
      for (var i = 0; i < rows.length; i++) {
        // Create the object to save the data.
        var mark = {
          subject: rows[i].course_name,
          date: rows[i].date_mark,
          mark: rows[i].score
        }

        // Add object into array
        marks[i] = mark;
      }

      sql = "SELECT first_name, last_name FROM student WHERE id = ?"

      con.query(sql, [1], function (err, rows, fields) {
        if (err) {
          res.end("DB error: " + err);
        } else {
          if (rows) {
            res.render("../pages/parent/parent_allmark.pug", {
              student_name: rows[0].first_name + " " + rows[0].last_name,
              student_marks: marks
            });
          }
          else {
            res.end("This student does not exist!");
          }
        }
        con.end();
      });
    }
  });
});


router.get('/show_courses', (req, res) => {
  var courses = [];

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pwd",
    database: "students",
    insecureAuth: true
  });

  var sql = "SELECT * FROM course ORDER BY id";
  con.query(sql, (err, rows, fields) => {
    if (err) {
      res.end("DB error: " + err);
    } else {
      for (var i = 0; i < rows.length; ++i) {
        var course = {
          id: rows[i].id,
          name: rows[i].course_name,
          newRow: (rows[i].id % 2 == 1)
        }
        courses[i] = course;
      }
      res.render('../pages/parent/parent_courselist.pug', {
        courses: courses
      });
    }
    con.end();
  });
});


module.exports = router;