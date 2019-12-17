//'use strict';
var path = require('path');
var fs = require('fs');
var os = require('os');
const express = require('express');
const upload = require('express-fileupload');
const pug = require('pug');
const db = require('../modules/functions.js');
const { body } = require('express-validator');
const Busboy = require('busboy');
const inspect = require('util').inspect;

//IMPORTO oggetto rappresentante la sessione.
//Per accedere ->  req.session
//Per accedere a user req.session.user
//Per accedere a campo user es. req.session.user.id
//Per aggiungere campo a user req.session.user.nomecampo = valore 
//Per aggiungere campo a sessione -> req.session.nomecampo = valore

var router = express.Router();

//router.use(/\/.*/, function(req, res, next) {
/*try {
        if (req.session.user.user_type != 'teacher') {
            res.redirect("/");
            return;
        } else {
            next();
        }
    } catch (err) {
        res.redirect("/");
    }
});*/

router.get("/class/:classid/course/:courseid/upload_file", (req, res) => {
    var classID = req.params.classid;
    var courseID = req.params.courseid;
    var con = db.DBconnect();
    res.render("../pages/teacher/teacher_coursematerial.pug", { classID: classID, courseID: courseID });

});

router.post("/class/:classid/course/:courseid/up_file", (req, res) => {
    const compiledPage = pug.compileFile("./pages/teacher/teacher_coursematerial.pug");
    res.set({ 'Content-Type': 'application/xhtml+xml; charset=utf-8' });
    var classID = req.params.classid;
    var courseID = req.params.courseid;
    var date = new Date();
    var con = db.DBconnect();
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        let desc = inspect(val);
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            var saveTo = path.join('.', "/upload/" + filename);
            console.log('Desc: ' + desc + ' Uploading: ' + saveTo);
            file.pipe(fs.createWriteStream(saveTo));
            con.query('SELECT COUNT(*) as c FROM material', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
                if (err) {
                    res.end("There is a problem in the DB connection. Please, try again later " + err);
                    return;
                }
                con.query("INSERT INTO material(id, course_id, class_id, description, link, date_mt) VALUES(?, ?, ?, ?, ?, ?)", [rows[0].c + 1, courseID, classID, desc, saveTo, date], (err, result) => {
                    if (err) {
                        res.end("There is a problem in the DB connection. Please, try again later " + err);
                        return;
                    }
                    con.end();
                });
            });
        });
    });
    busboy.on('finish', function() {
        console.log('Upload complete');
        res.writeHead(200, { 'Connection': 'close' });

        //fa l'upload ma non va alla pagina successiva
        //res.render non si puà usare qui non provateci
        //da problemi di header res.render
        res.end(compiledPage({
            classID: classID,
            courseID: courseID,
        }));
    });
    return req.pipe(busboy);

    /*console.log(req);
    con.query("SELECT t.course_id, t.class_id, course_name, class_name FROM teacher_course_class t, course co, class cl WHERE teacher_id=1 AND t.course_id=co.id AND t.class_id=cl.id", (err, rows) => {
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        con.end();
        if (!file) {
            res.render("../pages/teacher/teacher_coursematerial.pug", { flag_ok: "0", message: "Please fill the description and upload the file", Courses: Course_list });
            return;
        }
        res.render("../pages/teacher/teacher_coursematerial.pug");
    });*/
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
router.get("/class/:classid/course/:courseid/add_material", (req, res) => {});

//TODO
router.get("/class/:classid/course/:courseid/class_marks", (req, res) => {

});

//TODO: nome provvisorio per presenze e note, cambiare anche il nome della route nel file "sidebar.pug" 
//presenze e note stessa route? magari due route diverse e due tasti diversi nella sidebar?
router.get("/class/:classid/course/:courseid/insert_stuff", (req, res) => {});

//TODO
router.get("/class/:classid/course/:courseid/insert_homework", (req, res) => {});

module.exports = router;