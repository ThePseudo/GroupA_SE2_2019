'use strict';

const express = require('express');
const pug = require('pug');
const db = require('../modules/functions.js');
const { body } = require('express-validator');

//IMPORTO oggetto rappresentante la sessione.
//Per accedere ->  req.session
//Per accedere a user req.session.user
//Per accedere a campo user es. req.session.user.id
//Per aggiungere campo a user req.session.user.nomecampo = valore 
//Per aggiungere campo a sessione -> req.session.nomecampo = valore

var router = express.Router();

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

router.get("/upload_file", (req, res) => {
  var con = db.DBconnect();
  con.query("SELECT course_id, class_id FROM teacher_course_class WHERE teacher_id=1", (err, rows) => {
    if (err) {
      res.end("There is a problem in the DB connection. Please, try again later " + err);
      return;
    }
    var Course_list = [];
    var i = 0;
    rows.forEach(element => {
      Course_list[i] = element.class_id + "-" + element.course_id;
      i++;
    });
    con.end();
    res.render("../pages/teacher/teacher_coursematerial.pug", {
      Courses: Course_list
    });
  });
});

router.post("/up_file", [body('desc')
  .not().isEmpty()
  .trim()
  .escape()
], (req, res) => {
  let desc = req.body.desc;
  let file = req.body.file;
  var con = db.DBconnect();
  con.query("SELECT course_id, class_id FROM teacher_course_class WHERE teacher_id=1", (err, rows) => {
    if (err) {
      res.end("There is a problem in the DB connection. Please, try again later " + err);
      return;
    }
    var Course_list = [];
    var i = 0;
    rows.forEach(element => {
      Course_list[i] = element.class_id + "-" + element.course_id;
      i++;
    });
    con.end();
    if (!desc || !file) {
      res.render("../pages/teacher/teacher_coursematerial.pug", { flag_ok: "0", message: "Please fill the description and upload the file", Courses: Course_list });
      return;
    }
    res.render("../pages/teacher/teacher_coursematerial.pug", {
      Courses: Course_list
    });
  });
});

router.get("/teacher_home", (req, res) => { // T3
  var fullName = req.session.user.first_name + " " + req.session.user.last_name;

  var date = new Date();
  var year = date.getFullYear();
  if (date.getMonth() < 9) { // before august
    year--;
  }

  var con = db.DBconnect();


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
// ALWAYS pass classid and courseid to pages, used for sidebar

//------------------------------------------

router.get("/class/:classid/course/:courseid/course_home", (req, res) => {
  var fullName = req.session.user.first_name + " " + req.session.user.last_name;

  var con = db.DBconnect();

  var classID = req.params.classid;
  var courseID = req.params.courseid;
  var teacherID = req.session.user.id;

  let sql = "SELECT * FROM student WHERE class_id =? ORDER BY last_name"
  con.query(sql, [classID], (err, rows, fields) => {
    if (err) {
      console.log(err);
      con.end();
      return;
    } else {
      var message = "";
      var n_students = 0;
      var student_array = [];

      if (rows.length <= 0) {
        message = "No Student enrolled yet";
      } else {
        n_students = rows.length;
        for (var i = 0; i < n_students; i++) {
          student_array[i] = {};
          student_array[i].id = rows[i].id;
          student_array[i].first_name = rows[i].first_name;
          student_array[i].last_name = rows[i].last_name;
          student_array[i].cod_fisc = rows[i].cod_fisc;
          student_array[i].parent_1 = rows[i].parent_1;
          student_array[i].parent_2 = rows[i].parent_1;
        }
      }
      con.end();
    }
    res.render('../pages/teacher/teacher_coursehome.pug', {
      classid: classID,
      courseid: courseID,
      fullName: fullName,
      message: message,
      //courseName: "Math",
      student_array: student_array,
      n_students: n_students
    });
  });
});

//------------------------------------------------------


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
  var con = db.DBconnect();


  var classID = req.params.classid;
  var courseID = req.params.courseid;
  var teacherID = req.session.user.id;

  var sql = "SELECT first_name, last_name FROM student AS St, teacher_course_class AS Tcc " +
    "WHERE Tcc.course_id = ? " +
    "AND St.class_id = ? AND Tcc.class_id = ? " +
    "AND Tcc.teacher_id = ? ";

  con.query(sql, [courseID, classID, classID, teacherID], (err, rows, fields) => {
    if (err) {
      res.end("Database problem: " + err);
      return;
    }
    con.end();
    var studlist = [];
    for (var i = 0; i < rows.length; ++i) {
      var stud = {
        first_name: rows[i].first_name,
        last_name: rows[i].last_name,
      }
      studlist[i] = stud;
    }

    res.end(compiledPage({
      studlist: studlist,
      classid: req.params.classid,
      courseid: req.params.courseid,
      fullName: fullName
    }));
  });
});

//TODO
router.post("/class/:classid/course/:courseid/reg_mark", (req, res) => {

  var fullName = req.session.user.first_name + " " + req.session.user.last_name;
  const compiledPage = pug.compileFile("../pages/teacher/teacher_insertclassmark.pug");
  var con = db.DBconnect();


  var classID = req.params.classid;
  var courseID = req.params.courseid;
  var teacherID = req.session.user.id;
  var date_mark = req.body.date;
  var period_mark = 0;
  var mark_subj = req.body.subject;
  var descr_mark_subj = req.body.desc;
  var type_mark_subj = req.body.type;

  var sql = "SELECT St.id, first_name, last_name FROM student AS St, teacher_course_class AS Tcc " +
    "WHERE Tcc.course_id = ? " +
    "AND St.class_id = ? AND Tcc.class_id = ? " +
    "AND Tcc.teacher_id = ? ";

  con.query(sql, [courseID, classID, classID, teacherID], (err, rows, fields) => {
    if (err) {
      res.end("Database problem reg_mark: " + err);
      return;
    }
    else {
      var marks = req.body.mark;
      var studlist = [];

      var sql4 = "SELECT MAX(id) as last_id FROM mark";
      con.query(sql4, (err, rows2, fields2) => {
        if (err) {
          res.end("Database problem reg_mark: " + err);
          return;
        }
        else {
          let c = rows2[0].last_id + 1;
          var sql2 = "INSERT INTO mark(id,student_id,course_id,score,date_mark,period_mark,mark_subj,descr_mark_subj,type_mark_subj) VALUES ";

          for (var i = 0; i < rows.length; ++i) {
            if (i > 0) {
              sql2 = sql2 + " , ";
            }
            var stud = {
              id_stud: rows[i].id,
              first_name: rows[i].first_name,
              last_name: rows[i].last_name,
            }
            var mark = marks[i];
            studlist[i] = stud;
            sql2 = sql2 + "(" + c + "," + stud.id_stud + "," + courseID + "," + mark + ", '" + date_mark + "' ," + period_mark + ",'" + mark_subj + "','" + descr_mark_subj + "','" + type_mark_subj + "')";
            c = c + 1;
          }
          console.log(sql2);
          con.query(sql2, (err, rows, fields) => {
            if (err) {
              res.end("Database problem errore qui: " + err);
              return;
            }
            else {
              var sql3 = "SELECT * FROM mark";
              con.query(sql3, (err, rows, fields) => {
                if (err) {
                  res.end("Database problem errore sql3: " + err);
                  return;
                }
                else {
                  for (var j = 0; j < rows.length; j++) {
                    console.log(rows[j].id + " " + rows[j].student_id + " " + rows[j].course_id + " " + rows[j].score + " " +
                      rows[j].date_mark + " " + rows[j].period_mark + " " +
                      rows[j].mark_subj + " " + rows[j].descr_mark_subj + " " + rows[j].type_mark_subj);
                  }
                  con.end();
                  console.log("Data successfully uploaded! ");
                  res.render("../pages/teacher/teacher_insertclassmark.pug", { studlist: studlist, flag_ok: "1", message: "New class marks inserted correctly" });
                  return;
                }
              });
            }
          });
        }
      });
    }
  });

});

//TODO
router.get("/class/:classid/course/:courseid/add_material", (req, res) => {
});


//TODO: nome provvisorio per presenze e note, cambiare anche il nome della route nel file "sidebar.pug" 
//presenze e note stessa route? magari due route diverse e due tasti diversi nella sidebar?
router.get("/class/:classid/course/:courseid/insert_stuff", (req, res) => { });

//TODO
router.get("/class/:classid/course/:courseid/insert_homework", (req, res) => { });

router.get("/class/:classid/course/:courseid/student/:studentid", (req, res) => {
  var fullName = req.session.user.first_name + " " + req.session.user.last_name;
  var con = db.DBconnect();

  var sql = "SELECT first_name, last_name FROM student WHERE id = ?";
  con.query(sql, [req.params.studentid], (err, rows, fields) => {
    if (err) {
      res.end("Database error: " + err);
      return;
    }
    var studentName = rows[0].first_name + " " + rows[0].last_name;
    sql = "SELECT course_name FROM course WHERE id = ?";
    con.query(sql, [req.params.courseid], (err, rows, fields) => {
      if (err) {
        res.end("Database error: " + err);
        return;
      }
      var courseName = rows[0].course_name;
      sql = "SELECT date_mark, score FROM mark WHERE student_id = ? AND course_id = ? ORDER BY date_mark DESC";
      con.query(sql, [req.params.studentid, req.params.courseid], (err, rows, fields) => {
        con.end();
        if (err) {
          res.end("Database error: " + err);
          return;
        }
        var marks = [];
        for (var i = 0; i < rows.length; ++i) {
          var mark = {
            score: rows[i].score,
            date: rows[i].date_mark.getDate() + "/" +
              (rows[i].date_mark.getMonth() + 1) + "/" + rows[i].date_mark.getFullYear()
          }
          marks[i] = mark;
        }
        res.render("../pages/teacher/teacher_singlestudent.pug", {
          studentName: studentName,
          courseName: courseName,
          classid: req.params.classid,
          courseid: req.params.courseid,
          fullName: fullName,
          st_marks: marks
        });
      });
    });
  });
  // test: https://localhost:8080/teacher/class/1/course/1/student/1
});

module.exports = router;
