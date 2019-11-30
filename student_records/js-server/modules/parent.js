const express = require('express');
const pug = require('pug');
const mysql = require('mysql');

var router = express.Router();

router.use(/\/.*/, function (req, res, next) {
  try {
    if (SESSION.sessionData.user.user_type != 'parent') {
      res.redirect('/auth_router/logout');
      return;
    }
  }
  catch (error) {
    res.redirect("/");
    return;
  }
  next();
});


router.use('/:id/*', function (req, res, next) {
  var parentID = SESSION.sessionData.user.id;
  var childID = req.params.id;
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pwd",
    database: "students",
    insecureAuth: true
  });

  if (!isNaN(childID)) {
    let sql = "SELECT id FROM student WHERE id = ? AND (parent_1 = ? OR parent_2 = ?)"
    con.query(sql, [childID, parentID, parentID], (err, rows, fields) => {
      if (err) {
        res.end("Database problem: " + err)
      } else {
        if (rows.length < 1) {
          res.end("It's not your child you're looking for, is it?");
        }
        else
          next();
      }
    });
  }
  else {
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

router.get("/:childID/marks", (req, res) => {
  var childID = req.params.childID;
  var marks = [];
  var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "pwd",
    database: "students",
    insecureAuth: true
  });

  let sql = 'SELECT * FROM mark, course ' +
    'WHERE mark.course_id = course.id ' +
    'AND mark.student_id = ? ' +
    'ORDER BY mark.date_mark DESC';

  con.query(sql, [childID], function (err, rows, fields) {
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

        router.get("/marks", (req, res) => {
          var marks = [];
          var student_name; // todo: retrieve from db
          const compiledPage = pug.compileFile("pages/student_marks.pug");
          var con = mysql.createConnection({
            host: "students-db",
            user: "root",
            password: "pwd",
            database: "students",
            insecureAuth: true
          });

          let sql = 'SELECT * FROM mark, course WHERE mark.course_id = course.id ORDER BY date_mark DESC';

          con.query(sql, function (err, rows, fields) {
            con.end();
            if (err) {
              res.end("There is a problem in the DB connection. Please, try again later");
            } else {
              if (rows) {
                res.render("../pages/parent/parent_allmark.pug", {
                  student_name: rows[0].first_name + " " + rows[0].last_name,
                  student_marks: marks,
                  childID: childID
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

// COURSES

router.get('/:childID/show_courses', (req, res) => {
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
        courses: courses,
        childID: req.params.childID
      });
    }
    con.end();
  });
});

router.get('/:childID/course/:id', (req, res) => {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pwd",
    database: "students",
    insecureAuth: true
  });

  var sql = 'SELECT course_name FROM course WHERE id = ?';

  con.query(sql, [req.params.id], (err, rows, fields) => {
    if (err) {
      res.end("DB error: " + err);
    } else {
      res.render('../pages/parent/parent_coursehomepage.pug', {
        courseName: rows[0].course_name,
        courseID: req.params.id,
        childID: req.params.childID
      });
    }
  });
});

router.get('/:childID/course/:id/marks', (req, res) => {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pwd",
    database: "students",
    insecureAuth: true
  });
  // TODO: retrieve child from DB

  var sql = 'SELECT course_name FROM course, mark WHERE course.id = ?';

  con.query(sql, [req.params.id], (err, rows, fields) => {
    if (err) {
      res.end("DB error: " + err);
      return;
    }
    var course_name = rows[0].course_name;
    sql = "SELECT first_name, last_name FROM student WHERE id = ?";
    con.query(sql, [req.params.childID], (err, rows, fields) => {
      if (err) {
        res.end("DB error: " + err);
        return;
      }
      var student_name = rows[0].first_name + " " + rows[0].last_name;
      sql = 'SELECT date_mark, score FROM mark, course ' +
        'WHERE mark.course_id = course.id ' +
        'AND mark.student_id = ? ' +
        'AND mark.course_id = ? ' +
        'ORDER BY mark.date_mark DESC';
      con.query(sql, [req.params.childID, req.params.id], (err, rows, fields) => {
        if (err) {
          res.end("DB error: " + err);
          return;
        }
        var marks = [];
        for (var i = 0; i < rows.length; ++i) {
          var student_mark = {
            date: rows[i].date_mark,
            mark: rows[i].score
          }
          marks[i] = student_mark;
        }

        res.render('../pages/parent/parent_coursemark.pug', {
          courseName: course_name,
          student_name: student_name,
          student_marks: marks,
          childID: req.params.childID
        });
      });
    });
  });
});

module.exports = router;