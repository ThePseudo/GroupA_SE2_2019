//'use strict';

const express = require('express');
const pug = require('pug');
const mysql = require('mysql');
const session = require('express-session');

//IMPORTO oggetto rappresentante la sessione.
//Per accedere ->  req.session
//Per accedere a user req.session.user
//Per accedere a campo user es. req.session.user.id
//Per aggiungere campo a user req.session.user.nomecampo = valore 
//Per aggiungere campo a sessione -> req.session.nomecampo = valore

var router = express.Router();

router.use(session({
  secret: 'students', //??
  saveUninitialized: false,
  resave: true,
  httpOnly: false
}));

router.use(/\/.*/, function (req, res, next) {
  try {
    if (req.session.user.user_type != 'teacher') {
      res.redirect("/");
      return;
    } else {
      next();
    }
  } catch (err) {
    res.redirect("/");
  }
});

router.get("/teacher_home", (req, res) => { // T3
  var fullName = req.session.user.first_name + " " + req.session.user.last_name;

  var date = new Date();
  var year = date.getFullYear();
  if (date.getMonth() < 9) { // before august
    year--;
  }

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pwd",
    database: "students",
    insecureAuth: true
  });

  var sql = "SELECT course_id, class_id, course_name, class_name FROM class, course, teacher_course_class " +
    "WHERE course_id = course.id AND class_id = class.id " +
    "AND year = ? AND teacher_id = ?";

  con.query(sql, [year, req.session.user.id], (err, rows, fields) => {
    if (err) {
      res.end("Database problem: " + err);
      return;
    }
    con.end();
    var classCourses = [];
    for (var i = 0; i < rows.length; ++i) {
      var classCourse = {
        classid: rows[i].class_id,
        courseid: rows[i].course_id,
        classname: rows[i].class_name,
        coursename: rows[i].course_name
      }
      classCourses[i] = classCourse;
    }
    res.render("../pages/teacher/teacher_home.pug", {
      fullName: fullName,
      class_courses: classCourses
    });
  });
});

// Note: from here on, routes should follow this format: "/class/:classid/course/:courseid/..."
// We will worry about security later, when we will have this format completed, like in parent.js
// We pass the classid and course id through the URLm and they are retrievable through the request like this:
// req.params.classid
// req.params.courseid


//TODO: change route and get parameters for future query
router.get("/topics", (req, res) => {
  var fullName = req.session.user.first_name + " " + req.session.user.last_name;
  const compiledPage = pug.compileFile("../pages/teacher/teacher_coursetopic.pug");
  var today = new Date();
  var dayString = today.getDate();
  var monthString = today.getMonth() + 1;
  if (dayString < 10) dayString = '0' + today.getDate();
  if (monthString < 10) monthString = '0' + (today.getMonth() + 1);
  var todayString = today.getFullYear() + "-" + monthString + "-" + dayString;
  res.end(compiledPage({
    fullName: fullName,
    dateString: todayString
  }));
});

router.get("/class/:classid/course/:courseid/class_mark", (req, res) => {
  var fullName = req.session.user.first_name + " " + req.session.user.last_name;
  const compiledPage = pug.compileFile("../pages/teacher/teacher_insertclassmark.pug");
  res.end(compiledPage());
});

module.exports = router;