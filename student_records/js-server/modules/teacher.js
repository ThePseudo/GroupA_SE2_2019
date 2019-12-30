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

router.use(/\/.*/, function(req, res, next) {
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


router.get("/class/:classid/course/:courseid/upload_file", (req, res) => {
    var classID = req.params.classid;
    var courseID = req.params.courseid;
    var con = myInterface.DBconnect();
    sql = 'SELECT link, description, date_mt FROM material ' +
        'WHERE class_id = ? ' +
        'AND course_id = ? ' +
        'ORDER BY date_mt DESC';
    con.query(sql, [classID, courseID], (err, rows, fields) => {
        if (err) {
            res.end("DB error: " + err);
            return;
        }
        var materials = [];
        for (var i = 0; i < rows.length; ++i) {
            var material = {
                link: rows[i].link,
                description: rows[i].description
            }
            materials[i] = material;
        }
        con.end();
        res.render("../pages/teacher/teacher_coursematerial.pug", { Materials: materials, classID: classID, courseID: courseID });
    });
});

router.get("/class/:classid/course/:courseid/upload_file/true", (req, res) => {
    var classID = req.params.classid;
    var courseID = req.params.courseid;
    var con = myInterface.DBconnect();
    sql = 'SELECT link, description, date_mt FROM material ' +
        'WHERE class_id = ? ' +
        'AND course_id = ? ' +
        'ORDER BY date_mt DESC';
    con.query(sql, [classID, courseID], (err, rows, fields) => {
        if (err) {
            res.end("DB error: " + err);
            return;
        }
        var materials = [];
        for (var i = 0; i < rows.length; ++i) {
            var material = {
                link: rows[i].link,
                description: rows[i].description
            }
            materials[i] = material;
        }
        con.end();
        res.render("../pages/teacher/teacher_coursematerial.pug", {
            Materials: materials,
            classID: classID,
            courseID: courseID,
            flag_ok: "1",
            message: "Upload file success",
        });
    });
});

router.post("/class/:classid/course/:courseid/up_file", (req, res) => {
    const compiledPage = pug.compileFile("./pages/teacher/teacher_coursematerial.pug");
    res.set({ 'Content-Type': 'application/xhtml+xml; charset=utf-8' });
    var classID = req.params.classid;
    var courseID = req.params.courseid;
    var date = new Date();
    var con = myInterface.DBconnect();
    var saveTo;
    var desc;
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        desc = inspect(val);
        console.log('Desc: ' + desc);
    });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        saveTo = path.join('.', "upload/" + filename);
        console.log('Uploading: ' + saveTo);
        file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('finish', function() {
        console.log('Upload complete');
        res.writeHead(303, { Connection: 'close', Location: '/teacher/class/' + classID + '/course/' + courseID + '/upload_file/true' });
        con.query('SELECT COUNT(*) as c FROM material', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            con.query("INSERT INTO material(id, course_id, class_id, description, link, date_mt) VALUES(?, ?, ?, ?, ?, ?)", [rows[0].c + 1, courseID, classID, desc, saveTo, date], (err, result) => {
                if (err) {
                    res.end("DB error: " + err);
                    return;
                }
                con.end();
                console.log("I'm here");
                res.end();
            });
        });
        //fa l'upload ma non va alla pagina successiva
        //res.render non si può usare qui non provateci
        //dà problemi di header res.render
    });

    //res.render("../pages/teacher/teacher_coursematerial.pug", { classID: classID, courseID: courseID });
    req.pipe(busboy);

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

    var con = myInterface.DBconnect();


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

    var con = myInterface.DBconnect();

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

router.route("/class/:classid/course/:courseid/reg_homework").get((req, res) => {
    var fullName = req.session.user.first_name + " " + req.session.user.last_name;
    var dateString = myInterface.dailyDate();
    var listHw = [];
    var classID = req.params.classid;
    var courseID = req.params.courseid;

    var con = myInterface.DBconnect();

    console.log(classID + " " + courseID);
    con.query('SELECT date_hw, description FROM homework WHERE course_id= ? AND class_id= ?', [courseID, classID], (err, rows) => { // because we have no AUTO_UPDATE available on the DB
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        for (var i = 0; i < rows.length; ++i) {
            var Hw = {
                date: rows[i].date_hw,
                description: rows[i].description,
            }
            listHw[i] = Hw;
        }
        con.end();
        res.render("../pages/teacher/teacher_coursehomework.pug", {
            fullName: fullName,
            dateString: dateString,
            courseid: req.params.courseid,
            classid: req.params.classid,
            HomeworkList: listHw
        });
    });

}).post(
    [
        body('description').trim().escape(),
        body('date').trim().escape().toDate()
    ],
    (req, res) => {
        var fullName = req.session.user.first_name + " " + req.session.user.last_name;
        var dateString = myInterface.dailyDate();
        var description = req.body.description;
        var date = req.body.date;
        var classID = req.params.classid;
        var courseID = req.params.courseid;

        if (!description || !date) {
            res.render("../pages/teacher/teacher_coursehomework.pug", {
                ok_flag: 0,
                message: "Please, fill all the form fieds",
                fullName: fullName,
                dateString: dateString,
                courseid: req.params.courseid,
                classid: req.params.classid
            });
            return;
        }

        var con = myInterface.DBconnect();

        con.query('SELECT COUNT(*) as c FROM homework', (err, rows) => { // because we have no AUTO_UPDATE available on the DB
            if (err) {
                res.end("3) There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            con.query("INSERT INTO homework(id, class_id, course_id, description, date_hw) VALUES(?, ?, ?, ?, ?)", [rows[0].c + 1, req.params.classid, req.params.courseid, description, date], (err, rows) => {
                if (err) {
                    res.end("2) There is a problem in the DB connection. Please, try again later " + err);
                    return;
                }
                var listHw = []
                con.query('SELECT date_hw, description FROM homework WHERE course_id= ? AND class_id= ?', [courseID, classID], (err, rows) => { // because we have no AUTO_UPDATE available on the DB
                    if (err) {
                        res.end("1) There is a problem in the DB connection. Please, try again later " + err);
                        return;
                    }
                    for (var i = 0; i < rows.length; ++i) {
                        var Hw = {
                            date: rows[i].date_hw,
                            description: rows[i].description,
                        }
                        listHw[i] = Hw;
                    }
                    con.end();
                    res.render("../pages/teacher/teacher_coursehomework.pug", {
                        flag_ok: "1",
                        message: "New homework inserted correctly",
                        fullName: fullName,
                        dateString: dateString,
                        courseid: req.params.courseid,
                        classid: req.params.classid,
                        HomeworkList: listHw
                    });
                });
            });
        });
    });

router.route("/class/:classid/course/:courseid/reg_topic").get((req, res) => {
    var fullName = req.session.user.first_name + " " + req.session.user.last_name;
    var dateString = myInterface.dailyDate();

    res.render("../pages/teacher/teacher_coursetopic.pug", {
        fullName: fullName,
        dateString: dateString,
        courseid: req.params.courseid,
        classid: req.params.classid
    });
}).post(
    [
        body('description').trim().escape(),
        body('date').trim().escape().toDate(),
        body('topic_name').trim().escape()
    ],
    (req, res) => {
        var fullName = req.session.user.first_name + " " + req.session.user.last_name;
        var dateString = myInterface.dailyDate();
        var description = req.body.description;
        var date = req.body.date;
        var topic_name = req.body.topic_name;

        console.log(description);
        console.log(topic_name);
        console.log(date);

        if (!description || !date || !topic_name) {
            res.render("../pages/teacher/teacher_coursetopic.pug", {
                ok_flag: 0,
                message: "Please, fill all the form fieds",
                fullName: fullName,
                dateString: dateString,
                courseid: req.params.courseid,
                classid: req.params.classid
            });
            return;
        }

        var con = myInterface.DBconnect();
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
                res.render("../pages/teacher/teacher_coursetopic.pug", {
                    flag_ok: "1",
                    message: "New topic inserted correctly",
                    fullName: fullName,
                    dateString: dateString,
                    courseid: req.params.courseid,
                    classid: req.params.classid
                });
            });
        });
    });

// Class marks
router.get("/class/:classid/course/:courseid/class_mark", (req, res) => {
    var fullName = req.session.user.first_name + " " + req.session.user.last_name;
    const compiledPage = pug.compileFile("../pages/teacher/teacher_insertclassmark.pug");
    var con = myInterface.DBconnect();


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
    var con = myInterface.DBconnect();


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
        } else {
            var marks = req.body.mark;
            var studlist = [];
            var sql4 = "SELECT MAX(id) as last_id FROM mark";
            con.query(sql4, (err, rows2, fields2) => {
                if (err) {
                    res.end("Database problem reg_mark: " + err);
                    return;
                } else {
                    let c = rows2[0].last_id + 1;
                    var sql2 = "INSERT INTO mark(id,student_id,course_id,score,date_mark,period_mark,mark_subj,descr_mark_subj,type_mark_subj) VALUES ";
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
                    console.log(sql2);
                    if (!mark_subj || !date_mark || !descr_mark_subj || !type_mark_subj || j < 1) {
                        res.render("../pages/teacher/teacher_insertclassmark.pug", { fullName: fullName, courseid: courseID, classid: classID, studlist: studlist, flag_ok: "0", message: "Please fill the form correctly" });
                        return;
                    }
                    con.query(sql2, (err, rows, fields) => {
                        if (err) {
                            res.end("Database problem errore qui: " + err);
                            return;
                        } else {
                            var sql3 = "SELECT * FROM mark";
                            con.query(sql3, (err, rows, fields) => {
                                if (err) {
                                    res.end("Database problem errore sql3: " + err);
                                    return;
                                } else {
                                    for (var j = 0; j < rows.length; j++) {
                                        console.log(rows[j].id + " " + rows[j].student_id + " " + rows[j].course_id + " " + rows[j].score + " " +
                                            rows[j].date_mark + " " + rows[j].period_mark + " " +
                                            rows[j].mark_subj + " " + rows[j].descr_mark_subj + " " + rows[j].type_mark_subj);
                                    }
                                    con.end();
                                    console.log("Data successfully uploaded! ");
                                    res.render("../pages/teacher/teacher_insertclassmark.pug", { fullName: fullName, courseid: courseID, classid: classID, studlist: studlist, flag_ok: "1", message: "New class marks inserted correctly" });
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
router.get("/class/:classid/course/:courseid/add_material", (req, res) => {});

//TODO: nome provvisorio per presenze e note, cambiare anche il nome della route nel file "sidebar.pug" 
//presenze e note stessa route? magari due route diverse e due tasti diversi nella sidebar?

router.get("/class/:classid/course/:courseid/insert_stuff", (req, res) => {});

//TODO
router.get("/class/:classid/course/:courseid/insert_homework", (req, res) => {});

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
    // test: https://localhost:8080/teacher/class/1/course/1/student/1
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