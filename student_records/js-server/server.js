'use strict';

const express = require('express');
const session = require('express-session')
const fs = require('fs');
const https = require('https');
const http = require('http');
const pug = require('pug');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// Constants
const HTTPPORT = 8000;
const HTTPSPORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.set('view engine', 'pug');
app.set('views', './pages');
app.use(bodyParser.urlencoded({ extended: false }));

// other routers
module.exports = function (app) {
    app.use('/action/*', require('./modules'));
};



const options = {
    key: fs.readFileSync("./certs/localhost.key"),
    cert: fs.readFileSync("./certs/localhost.cert")
};

// Main page
app.get('/', (req, res) => {
    const compiledPage = pug.compileFile("pages/home.pug");
    res.end(compiledPage());
});

app.get('/login_teacher', (req, res) => {
    const compiledPage = pug.compileFile("pages/login.pug");
    res.end(compiledPage({
        user: "teacher"
    }));
});

app.get('/login_parent', (req, res) => {
    const compiledPage = pug.compileFile("pages/login.pug");
    res.end(compiledPage({
        user: "parent"
    }));
});

app.get("/style", (req, res) => {
    const page = fs.readFileSync("pages/base/style.css");
    res.end(page);
});

app.get("/enroll", (req, res) => {
    const compiledPage = pug.compileFile("pages/enroll.pug");
    res.end(compiledPage());
});

app.get("/teacher_page", (req, res) => {
    const compiledPage = pug.compileFile("pages/teacher_page.pug");
    res.end(compiledPage());
});

app.get("/topics", (req, res) => {
    const compiledPage = pug.compileFile("pages/topics.pug");
    res.end(compiledPage());
});

// TODO: make this and fix it
app.post("/reg_topic", (req, res) => {
    let course = req.body.course;
    let date = req.body.date;
    let classroom = req.body.class;
    let desc = req.body.desc;
    const compiledPage = pug.compileFile("pages/reg_topic.pug");

    var con = mysql.createConnection({
        host: "students-db",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });

    let sql = 'SELECT id FROM class WHERE class_name = ?';

    //let sql = 'SELECT id FROM class WHERE class_name=' + classroom;
    var class_id;

    con.query(sql, [classroom], function (err, rows, fields) {

        if (err) {
            res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
        } else {
            // Check if the result is found or not
            console.log(class_id = rows[0].id);

        }
    });
    sql = 'SELECT id FROM course WHERE course_name= ?';
    //let sql1 = 'SELECT id FROM course WHERE course_name=' + course;

    var course_id;

    con.query(sql, [course], function (err, rows, fields) {

        if (err) {
            res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
        } else {
            // Check if the result is found or not
            console.log(course_id = rows[0].id);

        }
    });
    sql = 'INSERT INTO topic (topic_date, id_class, id_course,description) VALUES (?, ?)';
    con.query(sql, [date, class_id, course_id, desc], function (err) {
        if (err) res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
    });
    con.end();

    // let sql2 = 'INSERT INTO topic (topic_date, id_class, id_course, description) VALUES (' + date + ',' + class_id + ',' + course_id + ',' + desc + ')';

    // con.query(sql2, function(err, rows, fields) {

    //     if (err) {
    //         res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
    //     }
    // });

    res.end(compiledPage({
        // topic_course: name,
        // topic_date: surname,
        // topic_class: classroom,
        // topic_desc: desc
    }));
});

app.post("/register", (req, res) => {
    var name = req.body.name;
    var surname = req.body.surname;
    var fiscalcode = req.body.fiscalcode;
    const compiledPage = pug.compileFile("pages/register.pug");

    res.end(compiledPage({
        student_name: name,
        student_surname: surname,
        student_fiscalcode: fiscalcode
    }));
});



app.get("/marks", (req, res) => {
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

    let sql = 'SELECT * FROM mark, course WHERE mark.course_id = course.id ORDER BY mark.date_mark DESC';

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




// Page not found
app.get('/*', (req, res) => {
    fs.readFile(req.path, (err, data) => {
        if (err) {
            const compiledPage = pug.compileFile("pages/base/404.pug");
            res.end(compiledPage());
        }
        res.end(data);

    })
});

app.post('/*', (req, res) => {
    fs.readFile(req.path, (err, data) => {
        if (err) {
            const compiledPage = pug.compileFile("pages/base/404.pug");
            res.end(compiledPage());
        }
        res.end(data);

    })
});

//app.listen(PORT, HOST);

const httpApp = express();
httpApp.get("*", (req, res) => {
    res.redirect("https://" + req.hostname + ":" + HTTPSPORT + req.path);
});
http.createServer(httpApp).listen(HTTPPORT);
https.createServer(options, app).listen(HTTPSPORT);

console.log(`Running on http://${HOST}:${HTTPPORT}`);
console.log(`Running on https://${HOST}:${HTTPSPORT}`);
