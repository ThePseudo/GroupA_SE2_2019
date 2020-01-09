'use strict';

const express = require('express');
const myInterface = require('../modules/functions.js');

//IMPORTO oggetto rappresentante la sessione.
//Per accedere ->  req.session
//Per accedere a user req.session.user
//Per accedere a campo user es. req.session.user.id
//Per aggiungere campo a user req.session.user.nomecampo = valore 
//Per aggiungere campo a sessione -> req.session.nomecampo = valore

var router = express.Router();

var fullName = "";
var con;
var studentName = "";
var parentID;
var studentID;
var classID;
var courseID;
var className = "";
var courseName = "";

const start_time_slot = ["08:00", "09:00", "10:00", "11:00", "12:00"];

router.use(/\/.*/, function (req, res, next) {
    fullName = req.session.user.first_name + " " + req.session.user.last_name;
    parentID = req.session.user.id;
    con = myInterface.DBconnect();
    next();
});

router.use('/:id', function (req, res, next) {
    studentID = req.params.id;
    if (!isNaN(studentID)) {
        let sql = "SELECT first_name, last_name, class_id, class_name " +
            "FROM student, class WHERE student.class_id = class.id AND student.id = ? AND (parent_1 = ? OR parent_2 = ?)"
        con.query(sql, [studentID, parentID, parentID], (err, rows) => {
            if (err) {
                res.end("Database problem: " + err)
                return;
            }
            if (rows.length < 1) {
                myInterface.sendUnauthorized(res);
                return;
            }
            classID = rows[0].class_id;
            className = rows[0].class_name
            studentName = rows[0].first_name + " " + rows[0].last_name;
            next();
        });
    } else {
        next();
    }
});

router.use("/:studentID/course/:courseID", function (req, res, next) {
    courseID = req.params.courseID;
    if (!isNaN(courseID)) {
        let sql = "SELECT course_name FROM course WHERE id = ?";
        con.query(sql, [courseID], (err, rows) => {
            if (err) {
                res.end("DB problem: " + err);
                return;
            }
            if (rows.length < 1) {
                myInterface.sendUnauthorized(res);
                return;
            }
            courseName = rows[0].course_name;
            next();
        });
    } else {
        next();
    }
});

// Routes


router.get('/parent_home', (req, res) => {
    var commlist = [];
    var studlist = [];
    con.query('SELECT * FROM General_Communication ORDER BY comm_date DESC', (err, rows, fields) => {
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later\n" + err + "\n");
            return;
        }
        //console.log(rows);
        for (var i = 0; i < rows.length; i++) {
            var communication_date = rows[i].comm_date.getDate() + "/" +
                (rows[i].comm_date.getMonth() + 1) + "/" + rows[i].comm_date.getFullYear();
            var communication = {
                id: rows[i].id,
                text: rows[i].communication,
                date: communication_date
            }
            commlist[i] = communication;
        }
        //let sql = 'SELECT id,first_name,last_name FROM student';
        con.query('SELECT id,first_name,last_name FROM student WHERE parent_1=? OR parent_2=?', [req.session.user.id, req.session.user.id], (err, rows, fields) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later\n" + err + "\n");
                return;
            }
            //console.log(rows);
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
            res.render('../pages/parent/parent_homepage.pug', {
                communicationList: commlist,
                studentList: studlist,
            });
        });
    });
});



// ALL MARKS

router.get("/:studentID/marks", (req, res) => {
    var marks = [];
    let sql = 'SELECT * FROM mark, course ' +
        'WHERE mark.course_id = course.id ' +
        'AND mark.student_id = ? ' +
        'ORDER BY mark.date_mark DESC';
    con.query(sql, [studentID], function (err, rows, fields) {
        if (err) {
            res.end("DB error: " + err);
            return;
        }
        // Check if the result is found or not
        for (var i = 0; i < rows.length; i++) {
            // Create the object to save the data.
            var mark = {
                subject: rows[i].course_name,
                date: rows[i].date_mark,
                mark: rows[i].score,
                type: rows[i].type_mark_subj
            }
            // Add object into array
            marks[i] = mark;
        }
        res.render("../pages/parent/parent_allmark.pug", {
            student_name: studentName,
            student_marks: marks,
            childID: studentID,
            fullName: fullName
        });
    });
});

// COURSES

router.get("/:studentID/show_courses", (req, res) => {
    var course_hours = [];
    var coursesArray = [];
    var year = myInterface.getCurrentYear();

    var sql = ` SELECT first_name, last_name, teacher.id as teacher_id, course_name, course.id as course_id,color,year
                FROM course, teacher_course_class as tcc, teacher
                WHERE course.id = tcc.course_id  AND tcc.teacher_id = teacher.id AND tcc.class_id = ? AND year = ?
                ORDER BY course_id `;
    let params = [classID, year];
    con.query(sql, params, (err, rows) => {
        if (err) {
            res.end("Database problem: " + err);
            return;
        }

        for (var i = 0; i < rows.length; i++) {
            var course = {
                course_id: rows[i].course_id,
                courseName: rows[i].course_name,
                color: rows[i].color,
                teacherFullName: rows[i].last_name + " " + rows[i].first_name
            }
            coursesArray[i] = course;
        }

        var len = coursesArray.length;

        //console.log(coursesMap);
        sql = ` SELECT  tcc.teacher_id as teacher_id, tt.start_time_slot as start_time_slot,tt.class_id as class_id, tt.course_id as course_id, tt.day as day 
                    FROM timetable as tt ,teacher_course_class as tcc
                    WHERE tt.course_id = tcc.course_id 
                    AND tt.class_id = tcc.class_id AND tt.teacher_id = tcc.teacher_id
                    AND year = ? AND tcc.class_id = ?
                    ORDER BY tt.day,tt.start_time_slot `

        params = [year, classID]
        con.query(sql, params, (err, rows) => {
            if (err) {
                res.end("DB error: " + err);
                return;
            }

            for (var timeslot = 0; timeslot < 5; timeslot++) {
                course_hours[timeslot] = [];
                for (var day = 0; day < 5; day++) {
                    course_hours[timeslot][day] = {}
                }
            }

            for(let i= 0;i<rows.length;i++){
                for(var j=0;j<len;j++){
                    if(coursesArray[j].course_id==rows[i].course_id){
                        course_hours[rows[i].start_time_slot-1][rows[i].day-1] = coursesArray[j];
                    }
                }
            }

            con.end();
            res.render('../pages/parent/parent_courselist.pug', {
                courses: coursesArray,
                className: className,
                childID: studentID,
                fullName: fullName,
                course_hours: course_hours,
                start_time_slot: start_time_slot,
                studentName: studentName
            });
        });
    });
});

router.get('/:studentID/course/:courseID', (req, res) => {
    res.render('../pages/parent/parent_coursehomepage.pug', {
        courseName: courseName,
        courseID: courseID,
        childID: studentID,
        fullName: fullName,
        className: className,
        studentName: studentName
    });
});

/// course marks
router.get('/:studentID/course/:courseID/marks', (req, res) => {
    let sql = 'SELECT date_mark, score, type_mark_subj  FROM mark ' +
        'WHERE mark.student_id = ? ' +
        'AND mark.course_id = ? ' +
        'ORDER BY mark.date_mark DESC';
    con.query(sql, [studentID, courseID], (err, rows, fields) => {
        con.end();
        if (err) {
            res.end("DB error: " + err);
            return;
        }
        var marks = [];
        for (var i = 0; i < rows.length; ++i) {
            var student_mark = {
                date: rows[i].date_mark,
                mark: rows[i].score,
                type: rows[i].type_mark_subj
            }
            marks[i] = student_mark;
        }
        res.render('../pages/parent/parent_coursemark.pug', {
            courseName: courseName,
            student_name: studentName,
            student_marks: marks,
            childID: studentID,
            fullName: fullName,
            courseID: courseID
        });
    });
});

// course topics
router.get('/:studentID/course/:courseID/topics', (req, res) => {
    let sql = 'SELECT topic_date, description FROM topic ' +
        'WHERE topic.id_class = ? ' +
        'AND topic.id_course = ? ' +
        'ORDER BY topic.topic_date DESC';
    con.query(sql, [classID, courseID], (err, rows, fields) => {
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
            courseName: courseName,
            student_name: studentName,
            topics: topics,
            childID: studentID,
            fullName: fullName,
            courseID: courseID,
            className: className
        });
    });
});

// course homeworks

router.get('/:studentID/course/:courseID/material_homework', (req, res) => {
    let sql = 'SELECT date_hw, description FROM homework ' +
        'WHERE class_id = ? ' +
        'AND course_id = ? ' +
        'ORDER BY date_hw DESC';
    con.query(sql, [classID, courseID], (err, rows, fields) => {
        if (err) {
            res.end("DB error: " + err);
            return;
        }
        var homeworks = [];
        for (var i = 0; i < rows.length; ++i) {
            var homework = {
                date: rows[i].date_hw.getDate() + "/" +
                    (rows[i].date_hw.getMonth() + 1) + "/" +
                    rows[i].date_hw.getFullYear(),
                description: rows[i].description
            }
            homeworks[i] = homework;
        }
        sql = 'SELECT link, description, date_mt FROM material ' +
            'WHERE class_id = ? ' +
            'AND course_id = ? ' +
            'ORDER BY date_mt DESC';
        con.query(sql, [classID, courseID], (err, rows, fields) => {
            con.end();
            if (err) {
                res.end("DB error: " + err);
                return;
            }
            var materials = [];
            for (var i = 0; i < rows.length; ++i) {
                var material = {
                    link: rows[i].link,
                    date: rows[i].date_mt.getDate() + "/" +
                        (rows[i].date_mt.getMonth() + 1) + "/" +
                        rows[i].date_mt.getFullYear(),
                    description: rows[i].description
                }
                materials[i] = material;
            }
            res.render('../pages/parent/parent_coursehomework.pug', {
                courseName: courseName,
                student_name: studentName,
                student_hws: homeworks,
                childID: studentID,
                fullName: fullName,
                course_mtw: materials,
                courseID: courseID,
                className: className,
            });
        });
    });
});

//show absences & notes

router.get('/:studentID/absences_notes', (req, res) => {
    var absence_array = [];
    var note_array = [];
    var sql = "SELECT n.note_date, n.motivation, n.justified, t.first_name, t.last_name, " +
        "t.email,t.id FROM note AS n,teacher AS t " +
        "WHERE n.teacher_id = t.id AND n.student_id = ? ORDER BY n.note_date DESC";
    con.query(sql, [studentID], (err, rows) => {
        if (err) {
            res.end("DB error: " + err);
            return;
        }
        for (var i = 0; i < rows.length; i++) {
            note_array[i] = {};
            note_array[i].teacherFullName = rows[i].first_name + " " + rows[i].last_name;
            note_array[i].teacherEmail = rows[i].email;
            note_array[i].date = rows[i].note_date.getDate() + "/" + (rows[i].note_date.getMonth() + 1) + "/" + rows[i].note_date.getFullYear();
            note_array[i].motivation = rows[i].motivation;
            note_array[i].justified = rows[i].justified;
            note_array[i].teacherID = rows[i].id;
        }
        sql = "SELECT absence_type, date_ab, justified FROM absence WHERE student_id = ? ORDER BY date_ab DESC";
        con.query(sql, [studentID], (err, rows) => {
            if (err) {
                res.end("DB error: " + err);
                return;
            }
            for (var i = 0; i < rows.length; i++) {
                absence_array[i] = {};
                absence_array[i].date = rows[i].date_ab.getDate() + "/" + (rows[i].date_ab.getMonth() + 1) + "/" + rows[i].date_ab.getFullYear();
                absence_array[i].type = rows[i].absence_type;
                absence_array[i].justified = rows[i].justified;
            }
            res.render("../pages/parent/parent_absences_notes.pug", {
                fullName: fullName,
                note_array: note_array,
                absence_array: absence_array,
                childID: studentID,
                studentName: studentName
            });
        });
    });
});

// TODO (but much YEAH in the log <3)
router.route("/:teacherID/contact").get((req, res) => {
    console.log("qui");
    res.render("../pages/parent/popup_email_send.pug");
}).post((req, res) => {

});

// final term grades

router.get('/:studentID/final_term_grade', (req, res) => {
    var year = req.query.year;
    var term = req.query.term;
    var studentID = req.params.studentID;
    var writtenMsg = "";
    var msgClass = "";
    console.log(year+" "+term);
    var yearlist = [];
    var termlist = [];
    var student_final_term_grade = [];

    var query1= "SELECT DISTINCT(period_year) AS py FROM student_final_term_grade WHERE id_student= ?";
    var query2= "SELECT DISTINCT(period_term) AS pt FROM student_final_term_grade WHERE id_student= ? AND period_year=?";
    var query3= "SELECT course_name, period_grade FROM course, student_final_term_grade AS sftg " +
            "WHERE course.id=sftg.id_course AND id_student = ? AND period_year= ? AND period_term= ?";
    
    con.query(query1, [studentID], (err, rows1) => {
        if (err) {
            res.end("DB error: " + err);
            return;
        }
        for (var i = 0; i < rows1.length; i++) {
            yearlist[i] = rows1[i].py;
        }
        con.query(query2, [studentID,year], (err, rows2) => {
            if (err) {
                res.end("DB error: " + err);
                return;
            }
            for (var i = 0; i < rows2.length; i++) {
                termlist[i] = rows2[i].pt;
            }
            
            
            if(year!=undefined && term!=undefined && year!="select" && term!="select"){
                con.query(query3, [studentID,year,term], (err, rows3) => {
                    if (err) {
                        res.end("DB error: " + err);
                        return;
                    }
                    for (var i = 0; i < rows3.length; i++) {
                        var item = {
                            subject: rows3[i].course_name,
                            grade: rows3[i].period_grade 
                        }
                        student_final_term_grade[i] = item;
                    }
                    writtenMsg = "Final "+term+"° term grades table for the year "+year;
                    msgClass = "ok_msg";
                    res.render("../pages/parent/parent_finaltermgrades.pug", {
                        fullName: fullName,
                        studentName: studentName,
                        childID: studentID,
                        student_final_term_grade: student_final_term_grade,
                        yearlist: yearlist,
                        termlist: termlist,
                        msg: writtenMsg,
                        yearselected:year,
                        termselected:term,
                        msgclass: msgClass
                    });
                });
            }
            else{
            writtenMsg = "No final term grades or no selected year and term";
            msgClass = "err_msg";
            res.render("../pages/parent/parent_finaltermgrades.pug", {
                fullName: fullName,
                studentName: studentName,
                childID: studentID,
                student_final_term_grade: student_final_term_grade,
                yearlist: yearlist,
                termlist: termlist,
                msg: writtenMsg,
                yearselected:year,
                termselected:term,
                msgclass: msgClass
            });}
        });
    });
});



module.exports = router;