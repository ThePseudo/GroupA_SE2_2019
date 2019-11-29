const express = require('express');
const pug = require('pug');
const mysql = require('mysql');

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

router.get('/parent_home', (req, res) => {
  console.log(SESSION.sessionData);
  SESSION.sessionData.user.test = "ok";
  var commlist = [];
  var con = mysql.createConnection({
    host: "students-db",
    user: "root",
    password: "pwd",
    database: "students",
    insecureAuth: true
  });
  const compiledPage = pug.compileFile('../pages/parent/parent_homepage.pug');
  let sql = 'SELECT * FROM General_Communication';

  con.query(sql, function (err, rows, fields) {
    con.end();
    if (err) {
      res.end("There is a problem in the DB connection. Please, try again later\n" + err + "\n");
    } else {
      console.log(rows);
      // Check if the result is found or not
      for (var i = 0; i < rows.length; i++) {
        // Create the object to save the data.
        var communication = {
          id: rows[i].id,
          text: rows[i].communication,
          date: rows[i].comm_date
        }

        // Add object into array
        commlist[i] = communication;
      }
      res.end(compiledPage({
        communicationList: commlist,
        studentList: [
          'Marco Pecoraro',
          'Giulio Pecoraro',
          'Luigia Pecoraro'
        ]
      }));
    }

  });

  /* res.end(compiledPage({
      communicationList: [
          comm1,
          comm2
      ],
      studentList: [
          'Marco Pecoraro',
          'Giulio Pecoraro',
          'Luigia Pecoraro'
      ]
  })); */
});

router.get('/register_parent', (req, res) => {
  res.end("Hello, register parents!");
});

router.get("/marks", (req, res) => {
  // TODO: ID SHOULD BE TAKEN FROM SESSION
  var marks = [];
  const compiledPage = pug.compileFile("../pages/parent/parent_allmark.pug");
  var con = mysql.createConnection({
    host: "students-db",
    user: "root",
    password: "pwd",
    database: "students",
    insecureAuth: true
  });

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
            res.end(compiledPage({
              student_name: rows[0].first_name + " " + rows[0].last_name,
              student_marks: marks
            }));
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
  const compiledPage = pug.compileFile('../pages/parent/parent_courselist.pug');
  var courses = [];

  var con = mysql.createConnection({
    host: "students-db",
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
      res.end(compiledPage({
        courses: courses
      }));
    }
    con.end();
  });
});


module.exports = router;