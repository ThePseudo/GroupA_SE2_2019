'use strict'

const path = require('path');
const fs = require('fs');
const os = require('os');
const express = require('express');
const upload = require('express-fileupload');
const pug = require('pug');
const myInterface = require('./functions.js');
const fileUpload_handler = require('express-fileupload');
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

var fullName = "";
var con;
var classID;
var courseID;
var teacherID;
var studentID;
var studentName = "";
var courseName = "";
var className = "";

router.use(/\/.*/, function (req, res, next) {
    fullName = req.session.user.first_name + " " + req.session.user.last_name;
    teacherID = req.session.user.id;
    con = myInterface.DBconnect();
    next();
});

// TODO: improve when we'll have course-class relation, this will be simplified
router.use("/class/:classid/course/:courseid",
    (req, res, next) => {
        classID = req.params.classid;
        courseID = req.params.courseid;
        if (!isNaN(classID) && !isNaN(courseID)) {
            var sql = "SELECT course_name FROM course WHERE id = ?";
            con.query(sql, [courseID], (err, rows) => {
                if (err) {
                    res.end("DB error: " + err);
                    return;
                }
                if (rows.length < 1) {
                    res.end("This course does not exist");
                    return;
                }
                courseName = rows[0].course_name;
                sql = "SELECT class_name FROM class WHERE id = ?";
                con.query(sql, [classID], (err, rows) => {
                    if (err) {
                        res.end("DB error: " + err);
                        return;
                    }
                    if (rows.length < 1) {
                        res.end("This course does not exist");
                        return;
                    }
                    className = rows[0].class_name;
                    next();
                });
            });
        }
        else {
            next();
        }
    }
);

router.use("/class/:classid/course/:courseid/student/:studentid",
    (req, res, next) => {
        studentID = req.params.studentid;
        if (!isNaN(studentID)) {
            let sql = "SELECT first_name, last_name, class_id FROM student WHERE id = ?";
            con.query(sql, [studentID], (err, rows) => {
                if (err) {
                    res.end("DB error: " + err);
                    return;
                }
                if (rows.length < 1) {
                    res.end("This student does not exist");
                    return;
                }
                if (classID != rows[0].class_id) {
                    res.end("The student does not belong to this class");
                    return;
                }
                studentName = rows[0].first_name + " " + rows[0].last_name;
                next();
            });
        }
        else {
            next();
        }
    }
);

router.get("/teacher_home", (req, res) => { // T3
    var date = new Date();
    var year = date.getFullYear();
    if (date.getMonth() < 9) { // before august
        year--;
    }

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
    let sql = "SELECT * FROM student WHERE class_id =? ORDER BY last_name"
    con.query(sql, [classID], (err, rows, fields) => {
        if (err) {
            res.end("DB error: " + err);
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
        }
        con.query("SELECT class_name FROM class WHERE id = ?", [classID], (err, rows, fields) => {
            if (err) {
                res.end("DB error: " + err);
                return;
            }
            res.render('../pages/teacher/teacher_coursehome.pug', {
                classid: classID,
                courseid: courseID,
                fullName: fullName,
                message: message,
                courseName: rows[0].class_name,
                student_array: student_array,
                n_students: n_students
            });
        })
    });
});

//------------------------------------------------------

// Topic registration
router.route("/class/:classid/course/:courseid/reg_topic").get((req, res) => {
    var dateString = myInterface.dailyDate();
    var msg = req.query.msg;
    var writtenMsg = "";
    var msgClass = "";
    switch (msg) {
        case "err":
            writtenMsg = "Please, fill all the data";
            msgClass = "err_msg"
            break;
        case "ok":
            writtenMsg = "Topic added correctly";
            msgClass = "ok_msg";
            break;
        default:
            break;
    }
    res.render("../pages/teacher/teacher_coursetopic.pug", {
        fullName: fullName,
        dateString: dateString,
        courseid: courseID,
        classid: classID,
        msg: writtenMsg,
        msgClass: msgClass,
        className: className,
        courseName: courseName
    });
}).post(
    [
        body('description').trim().escape(),
        body('date').trim().escape().toDate(),
        body('topic_name').trim().escape()
    ],
    (req, res) => {
        var description = req.body.description;
        var date = req.body.date;
        var topic_name = req.body.topic_name;
        if (!description || !date || !topic_name) {
            res.redirect("./reg_topic?msg=err");
            return;
        }
        con.query('SELECT COUNT(*) as c FROM topic', (err, rows) => { // because we have no AUTO_UPDATE available on the DB
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            con.query("INSERT INTO topic(id, topic_date, id_class,id_course,description) VALUES(?, ?, ?, ?, ?)", [rows[0].c + 1, date, req.params.classid, req.params.courseid, description], (err, rows) => {
                if (err) {
                    res.end("There is a problem in the DB connection. Please, try again later " + err);
                    return;
                }
                con.end();
                res.redirect("./reg_topic?msg=ok")
            });
        });
    });

// Class marks
router.get("/class/:classid/course/:courseid/class_mark", (req, res) => {
    var dateString = myInterface.dailyDate();
    var sql = "SELECT first_name, last_name FROM student AS St, teacher_course_class AS Tcc " +
        "WHERE Tcc.course_id = ? " +
        "AND St.class_id = ? AND Tcc.class_id = ? " +
        "AND Tcc.teacher_id = ? ";
    var msg = req.query.msg;
    var writtenMsg = "";
    var msgClass = "";
    switch (msg) {
        case "err":
            writtenMsg = "Please, fill all the data";
            msgClass = "err_msg";
            break;
        case "ok":
            writtenMsg = "Marks inserted correctly";
            msgClass = "ok_msg";
            break;
    }
    con.query(sql, [courseID, classID, classID, teacherID], (err, rows, fields) => {
        if (err) {
            res.end("Database problem: " + err);
            return;
        }
        var studlist = [];
        for (var i = 0; i < rows.length; ++i) {
            var stud = {
                first_name: rows[i].first_name,
                last_name: rows[i].last_name,
            }
            studlist[i] = stud;
        }
        res.render("../pages/teacher/teacher_insertclassmark.pug", {
            studlist: studlist,
            classid: classID,
            courseid: courseID,
            fullName: fullName,
            courseName: courseName,
            className: className,
            msg: writtenMsg,
            msgClass: msgClass,
            dateString: dateString
        });
    });
});

//TODO
/*
  AVOID SQL INJECTION
*/
router.post("/class/:classid/course/:courseid/reg_mark", (req, res) => {
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
        var marks = req.body.mark;
        var studlist = [];
        var sql4 = "SELECT MAX(id) as last_id FROM mark";
        con.query(sql4, (err, rows2, fields2) => {
            if (err) {
                res.end("Database problem reg_mark: " + err);
                return;
            }
            // TODO: avoid SQL injection
            let c = rows2[0].last_id + 1;
            var sql2 = "INSERT INTO mark" +
                "(id, student_id, course_id, score, date_mark, period_mark, mark_subj, " +
                "descr_mark_subj, type_mark_subj) VALUES ";
            var j = 0;
            var pre_insert = 0;
            for (var i = 0; i < rows.length; ++i) {
                var mark = marks[i];
                var stud = {
                    id_stud: rows[i].id,
                    first_name: rows[i].first_name,
                    last_name: rows[i].last_name,
                }
                studlist[i] = stud;

                if (mark) {
                    j = j + 1;
                    if (i > 0 && pre_insert) {
                        sql2 = sql2 + " , ";
                        pre_insert = 0;
                    }
                    sql2 = sql2 + "(" + c + "," + stud.id_stud + "," + courseID + "," + mark + ", '" + date_mark + "' ," + period_mark + ",'" + mark_subj + "','" + descr_mark_subj + "','" + type_mark_subj + "')";
                    c = c + 1;
                    pre_insert = 1;
                }
            }
            //console.log(sql2);
            // case err
            if (!mark_subj || !date_mark || !descr_mark_subj || !type_mark_subj || j < 1) {
                res.redirect("./class_mark?msg=err");
                return;
            }
            con.query(sql2, (err, rows, fields) => {
                con.end();
                if (err) {
                    res.end("Database problem errore qui: " + err);
                    return;
                }
                res.redirect("./class_mark?msg=ok");
            });
        });
    });
});

//TODO
router.get("/class/:classid/course/:courseid/insert_homework", (req, res) => { });

// Absences
router.get("/class/:classid/course/:courseid/absences", (req, res) => {
    res.render("../pages/teacher/teacher_insertabsence.pug", {
        fullName: fullName,
        classid: classID,
        courseid: courseID,
        className: className
    });
});

// AJAX absence table: this way we have a live update
router.get("/class/:classid/course/:courseid/absence_table", (req, res) => {
    var sql = "SELECT s.id, first_name, last_name " +
        "FROM student AS s, teacher_course_class AS tcc " +
        "WHERE s.class_id = tcc.class_id " +
        "AND tcc.teacher_id = ? AND s.class_id = ?";
    con.query(sql, [teacherID, classID], (err, rows) => {
        if (err) {
            res.end("Database error: " + err);
            return;
        }
        var students = new Map();
        for (var i = 0; i < rows.length; ++i) {
            var student = {
                id: rows[i].id,
                first_name: rows[i].first_name,
                last_name: rows[i].last_name,
                absent: false,
                lateEntry: false,
                earlyExit: false
            }
            students.set(rows[i].id, student);
        }
        sql = "SELECT student_id, absence_type, date_ab FROM absence WHERE date_ab = ?;"
        con.query(sql, [myInterface.dailyDate()], (err, rows) => {
            if (err) {
                res.end("Database error: " + err);
                return;
            }
            // Absence types = ['Absent', 'LateEntry', 'EarlyExit'];
            rows.forEach(row => {
                var student = students.get(row.student_id);
                switch (row.absence_type) {
                    case 'Absent':
                        student.absent = true;
                        break;
                    case 'LateEntry':
                        student.lateEntry = true;
                        break;
                    case 'EarlyExit':
                        student.earlyExit = true;
                        break;
                    default: break;
                }
                students.set(row.student_id, student);
            });

            var sortedStudents = Array.from(students.values());
            sortedStudents.sort((a, b) => a.last_name.localeCompare(b.last_name));
            res.render("../pages/teacher/teacher_insertabsence_table.pug", {
                students: sortedStudents
            });
        });
    });
});

// Insert and remove absences
router.post("/class/:classid/course/:courseid/student/:studentid/insert_absence", (req, res) => {
    const acceptedAbsTypes = ["Absent", "LateEntry", "EarlyExit"];
    var absType = req.body.type;
    if (!absType || !acceptedAbsTypes.includes(absType) || isNaN(studentID)) {
        res.end("Something in the input parameters went wrong!");
        return;
    }
    var sql = "INSERT INTO absence(student_id, date_ab, absence_type, justified) VALUES(?,?,?,0) " +
        "ON DUPLICATE KEY UPDATE absence_type = ?;";
    con.query(sql, [studentID, myInterface.dailyDate(), absType, absType], (err, result) => {
        if (err) {
            res.end("Database error: " + err);
            return;
        }
        res.end("Ok");
    });

});

router.post("/class/:classid/course/:courseid/student/:studentid/remove_absence", (req, res, next) => {
    if (isNaN(studentID)) {
        res.end("Something in the input parameters went wrong!");
        return;
    }
    var sql = "DELETE FROM absence WHERE student_id = ? AND date_ab = ?";
    con.query(sql, [studentID, myInterface.dailyDate()], (err, result) => {
        if (err) {
            res.end("Database error: " + err);
            return;
        }
        res.end("Ok");
    });
});


//Student single page
router.get("/class/:classid/course/:courseid/student/:studentid", (req, res) => {
    var msg = req.query.msg;
    let sql = "SELECT date_mark, score FROM mark " +
        " WHERE student_id = ? AND course_id = ? ORDER BY date_mark DESC";
    con.query(sql, [studentID, courseID], (err, rows) => {
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
            studentID: studentID,
            studentName: studentName,
            courseName: courseName,
            classid: classID,
            courseid: courseID,
            fullName: fullName,
            st_marks: marks,
            msg: msg
        });
    });
});

router.post("/class/:classid/course/:courseid/student/:studentid/insert_mark", [
    body('subject').escape(),
    body('desc').escape()
], (req, res) => {
    var modifier = req.body.modifier;
    var mark = req.body.mark;
    var type = req.body.type;
    // Nullables
    var subject = req.body.subject;
    var description = req.body.desc;

    var finalMark = Number(mark) + Number(modifier);

    var dateMark = new Date();
    var period = 1;
    if (dateMark.getMonth() > 1) { // after March
        period = 2;
    }

    // Check on nullables
    if (subject.replace(/ /g, '').replace(/(?:\r\n|\r|\n)/g, '') == "" ||
        description.replace(/ /g, '').replace(/(?:\r\n|\r|\n)/g, '') == "") {
        res.redirect("../" + studentID + "?msg=markerr");
        return;
    }

    //console.log(subject + "\n" + description);
    var sql = "SELECT COUNT(*) AS id FROM mark FOR UPDATE;";
    con.query(sql, (err, rows, fields) => {
        if (err) {
            res.end("Database error: " + err);
            return;
        }
        var id = rows[0].id;
        ++id;
        sql = "INSERT INTO mark " +
            "(id, student_id, course_id, score, date_mark, period_mark, mark_subj, descr_mark_subj, type_mark_subj) " +
            "VALUES(?,?,?,?,?,?,?,?,?);";
        con.query(sql, [id, studentID, courseID, finalMark, dateMark, period, subject, description, type],
            (err, result) => {
                con.end();
                if (err) {
                    res.end("Database error: " + err);
                    return;
                }
                res.redirect("../" + studentID + "?msg=markok");
            });
    });
});

router.post("/class/:classid/course/:courseid/student/:studentid/insert_note", [
    body('note').escape()
], (req, res) => {
    var note = req.body.note;
    if (note.replace(/ /g, '').replace(/(?:\r\n|\r|\n)/g, '') == '') {
        res.redirect("../" + studentID + "?msg=noteerr");
        return;
    }
    var sql = "SELECT COUNT(*) AS id FROM note FOR UPDATE;";
    con.query(sql, (err, rows, fields) => {
        if (err) {
            res.end("Database error: " + err);
            return;
        }
        var id = rows[0].id;
        ++id;
        sql = "INSERT INTO note(id, student_id, teacher_id, note_date, motivation, justified) " +
            "VALUES(?,?,?,?,?,?);"
        con.query(sql, [id, studentID, teacherID, new Date(), note, 0], (err, result) => {
            if (err) {
                res.end("Database error: " + err);
                return;
            }
            res.redirect("../" + studentID + "?msg=noteok");
        });
    });
});

// Class upload
router.get("/class/:classid/course/:courseid/add_material", (req, res) => {
    res.render("../pages/teacher/teacher_coursematerial.pug", {
        classID: classID,
        courseID: courseID,
        fullName: fullName
    });

});

/*
  TODO: don't use res.render, instead redirect to add_material
*/
router.post("/class/:classid/course/:courseid/up_file", (req, res) => {
    const compiledPage = pug.compileFile("./pages/teacher/teacher_coursematerial.pug");
    res.set({ 'Content-Type': 'application/xhtml+xml; charset=utf-8' });
    var date = new Date();
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        let desc = inspect(val);
        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
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
    busboy.on('finish', function () {
        console.log('Upload complete');
        res.writeHead(200, { 'Connection': 'close' });

        //fa l'upload ma non va alla pagina successiva
        //res.render non si può usare qui non provateci
        //dà problemi di header res.render
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

/*
  TODO: don't use res.render, instead redirect to add_material
*/
router.route("/class/:classid/course/:courseid/upload_file").get((req, res) => {
    console.log(req.params.classid);
    console.log(req.params.courseid);
    let sql = "SELECT date, description, link FROM material WHERE class_id = ? AND course_id = ?";
    con.query(sql, [req.params.classid, req.params.courseid], (err, rows) => {
        if (err) {
            res.end(err);
            con.end();
            return;
        }
        let upload_file_array = [];
        for (var i = 0; i < rows.length; i++) {
            upload_file_array[i] = {};
            var date = rows[i].date.getDate() + "/" + (rows[i].date.getMonth() + 1) + "/" + rows[i].date.getFullYear();
            upload_file_array[i].date = date;
            upload_file_array[i].description = rows[i].description;
            upload_file_array[i].link = rows[i].link;
        }
        con.end();
        console.log(upload_file_array);
        res.render("../pages/teacher/teacher_coursematerial.pug", { upload_file_array: upload_file_array });
    })
}).post(
    [
        body('desc').trim().escape()
    ],
    (req, res) => {
        let description = req.body.description;
        let file = req.body.file;

        //sanitize file?
        if (!description || !file) {
            res.render("../pages/teacher/teacher_coursematerial.pug", { flag_ok: "0", message: "Please, fill the description and choose a file to upload" });
            return;
        }
        /*
       
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        let sampleFile = req.files.sampleFile;
      
        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
          if (err)
            return res.status(500).send(err);
      
          res.send('File uploaded!');
        });
        */

    });

module.exports = router;