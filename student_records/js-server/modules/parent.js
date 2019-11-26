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

router.get('/parent_home', (req, res) => {
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
            res.end("There is a problem in the DB connection. Please, try again later\n"+err+"\n");
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
            console.log(rows);
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
            res.end(compiledPage({
                student_name: "Marco Pecoraro",
                student_marks: marks
            }));
        }

    });
});

router.get("/enroll", (req, res) => {
    const compiledPage = pug.compileFile("../pages/enroll.pug");
    res.end(compiledPage());
});

module.exports = router;