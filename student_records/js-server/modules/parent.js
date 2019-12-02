'use strict';

const express = require('express');
const pug = require('pug');
const mysql = require('mysql');

//IMPORTO oggetto rappresentante la sessione.
//Per accedere ->  SESSION.sessionData
//Per accedere a user SESSION.sessionData.user
//Per accedere a campo user es. SESSION.sessionData.user.id
//Per aggiungere campo a user SESSION.sessionData.user.nomecampo = valore 
//Per aggiungere campo a sessione -> SESSION.sessionData.nomecampo = valore

var SESSION = require("./Auth_manager.js");

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
  }
});


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


// ALL MARKS

router.get("/:childID/marks", (req, res) => {
  var fullName = SESSION.sessionData.user.first_name + " " + SESSION.sessionData.user.last_name;
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
              student_marks: marks,
              childID: childID,
              fullName: fullName
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
  var fullName = SESSION.sessionData.user.first_name + " " + SESSION.sessionData.user.last_name;
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
          newRow: (rows[i].id % 4 == 1),
          color: rows[i].color
        }
        courses[i] = course;
      }

      // TODO: retrieve data from DB, need new table
      var course_hour = []; // length: 7
      var course_hour_row = []; // length: 6
      course_hour_row = ["FF0000", "0000FF", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF"];
      course_hour[0] = course_hour_row;
      course_hour_row = ["FFFFFF", "FF0000", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF"];
      course_hour[1] = course_hour_row;
      course_hour_row = ["00FF00", "FF0000", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF"];
      course_hour[2] = course_hour_row;
      course_hour_row = ["00FF00", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF"];
      course_hour[3] = course_hour_row;
      course_hour_row = ["FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "FF0000", "FFFFFF"];
      course_hour[4] = course_hour_row;
      course_hour_row = ["FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF"];
      course_hour[5] = course_hour_row;
      course_hour_row = ["FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF"];
      course_hour[6] = course_hour_row;

      res.render('../pages/parent/parent_courselist.pug', {
        courses: courses,
        childID: req.params.childID,
        fullName: fullName,
        course_hours: course_hour
      });
    }
    con.end();
  });
});

router.get('/:childID/course/:id', (req, res) => {
  var fullName = SESSION.sessionData.user.first_name + " " + SESSION.sessionData.user.last_name;
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
        childID: req.params.childID,
        fullName: fullName
      });
    }
  });
});

/// course marks

router.get('/:childID/course/:id/marks', (req, res) => {
  var fullName = SESSION.sessionData.user.first_name + " " + SESSION.sessionData.user.last_name;
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pwd",
    database: "students",
    insecureAuth: true
  });

  var sql = 'SELECT course_name FROM course WHERE course.id = ?';

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
      sql = 'SELECT date_mark, score FROM mark ' +
        'WHERE mark.student_id = ? ' +
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
          childID: req.params.childID,
          fullName: fullName,
          courseID: req.params.id
        });
      });
    });
  });
});

// course topics

router.get('/:childID/course/:id/topics', (req, res) => {
  var fullName = SESSION.sessionData.user.first_name + " " + SESSION.sessionData.user.last_name;
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pwd",
    database: "students",
    insecureAuth: true
  });

  var sql = 'SELECT course_name FROM course WHERE course.id = ?';

  con.query(sql, [req.params.id], (err, rows, fields) => {
    if (err) {
      res.end("DB error: " + err);
      return;
    }
    var course_name = rows[0].course_name;
    sql = "SELECT first_name, last_name, class_id FROM student WHERE id = ?";
    con.query(sql, [req.params.childID], (err, rows, fields) => {
      if (err) {
        res.end("DB error: " + err);
        return;
      }
      var student_name = rows[0].first_name + " " + rows[0].last_name;
      var classID = rows[0].class_id;
      sql = 'SELECT topic_date, description FROM topic ' +
        'WHERE topic.id_class = ? ' +
        'AND topic.id_course = ? ' +
        'ORDER BY topic.topic_date DESC';
      con.query(sql, [classID, req.params.id], (err, rows, fields) => {
        if (err) {
          res.end("DB error: " + err);
          return;
        }
        var topics = [];
        for (var i = 0; i < rows.length; ++i) {
          var topic = {
            date: rows[i].topic_date,
            description: rows[i].description
          }
          topics[i] = topic;
        }

        res.render('../pages/parent/parent_coursetopic.pug', {
          courseName: course_name,
          student_name: student_name,
          topics: topics,
          childID: req.params.childID,
          fullName: fullName,
          courseID: req.params.id
        });
      });
    });
  });
});

// course homeworks

router.get('/:childID/course/:id/material_homework', (req, res) => {
  var fullName = SESSION.sessionData.user.first_name + " " + SESSION.sessionData.user.last_name;
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pwd",
    database: "students",
    insecureAuth: true
  });

  var sql = 'SELECT course_name FROM course WHERE course.id = ?';

  con.query(sql, [req.params.id], (err, rows, fields) => {
    if (err) {
      res.end("DB error: " + err);
      return;
    }
    var course_name = rows[0].course_name;
    sql = "SELECT first_name, last_name, class_id FROM student WHERE id = ?";
    con.query(sql, [req.params.childID], (err, rows, fields) => {
      if (err) {
        res.end("DB error: " + err);
        return;
      }
      var student_name = rows[0].first_name + " " + rows[0].last_name;
      var classID = rows[0].class_id;
      sql = 'SELECT date_hw, description FROM homework ' +
        'WHERE class_id = ? ' +
        'AND course_id = ? ' +
        'ORDER BY date_hw DESC';
      con.query(sql, [classID, req.params.id], (err, rows, fields) => {
        if (err) {
          res.end("DB error: " + err);
          return;
        }
        var homeworks = [];
        for (var i = 0; i < rows.length; ++i) {
          var homework = {
            date: rows[i].date_hw,
            description: rows[i].description
          }
          homeworks[i] = homework;
        }

        res.render('../pages/parent/parent_coursehomework.pug', {
          courseName: course_name,
          student_name: student_name,
          student_hws: homeworks,
          childID: req.params.childID,
          fullName: fullName,
          courseID: req.params.id
        });
      });
    });
  });
});

module.exports = router;