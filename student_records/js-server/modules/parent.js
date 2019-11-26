const express = require('express');
const pug = require('pug');
const mysql = require('mysql');

var router = express.Router();

router.use('/:id', function (req, res, next) {
  console.log('Parent request URL:', req.originalUrl);
  next();
}, function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

router.get('/choose_student', (req, res) => {
  const compiledPage = pug.compileFile('../pages/parent/choose_student.pug');
  res.end(compiledPage({
    numStudents: 3,
    studentList: [
      'Marco Pecoraro',
      'Giulio Pecoraro',
      'Luigia Pecoraro'
    ]
  }));
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