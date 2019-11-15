'use strict';

const express = require('express');
const session = require('express-session')
const fs = require('fs');
const https = require('https');
const pug = require('pug');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// Constants
const PORT = 8000;
const HOST = '0.0.0.0';

const DBPORT = 3300;

// App
const app = express();
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));

// Main page
app.get('/', (req, res) => {
    const compiledPage = pug.compileFile("pages/home.pug");
    var con = mysql.createConnection({
        host: "students-db",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });

    con.connect(function(err) {
        if (err) {
            console.log("Error: " + err);
            return;
        }
        console.log("Connected!");
    });
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

app.get("/topics", (req, res) => {
    const compiledPage = pug.compileFile("pages/topics.pug");
    res.end(compiledPage());
});

app.post("/reg_topic", (req, res) => {
    course = req.body.course;
    date = req.body.date;
    classroom = req.body.class;
    desc = req.body.desc;
    const compiledPage = pug.compileFile("pages/reg_topic.pug");

    con.connect(function(err) {
        if (err) {
            console.log("Error: " + err);
            return;
        }
        console.log("Connected!");
    });

    let sql = 'SELECT id FROM class WHERE class_name=' + classroom;

    var class_id;

    con.query(sql, function(err, rows, fields) {

        if (err) {
            res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
        } else {
            // Check if the result is found or not
            class_id = rows[0].id;

        }
    });

    let sql1 = 'SELECT id FROM course WHERE course_name=' + course;

    var course_id;

    con.query(sql1, function(err, rows, fields) {

        if (err) {
            res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
        } else {
            // Check if the result is found or not
            course_id = rows[0].id;

        }
    });

    let sql2 = 'INSERT INTO topic (topic_date, id_class, id_course, description) VALUES (' + date + ',' + class_id + ',' + course_id + ',' + desc + ')';

    con.query(sql2, function(err, rows, fields) {

        if (err) {
            res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
        }
    });

    res.end(compiledPage({
        topic_course: name,
        topic_date: surname,
        topic_class: classroom,
        topic_desc: desc
    }));
});

app.post("/register", (req, res) => {
    var name = req.body.name;
    var surname = req.body.surname;
    var fiscalcode = req.body.fiscalcode;
    var parent1 = req.body.parent1;
    var parent2 = req.body.parent2;
    const compiledPage = pug.compileFile("pages/register.pug");

    con.connect(function(err) {
        if (err) {
            console.log("Error: " + err);
            return;
        }
        console.log("Connected!");
    });


    let sql = 'INSERT INTO student (first_name, second_name, cod_fisc, parent_1 , parent_2) VALUES (' + name + ',' + surname + ',' + fiscalcode + ',' + parent1 + ',' + parent2 +')';

    con.query(sql, function(err, rows, fields) {

        if (err) {
            res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
        }
    });

    res.end(compiledPage({
        student_name: name,
        student_surname: surname,
        student_fiscalcode: fiscalcode,
        student_parent1 : parent1,
        student_parent2 : parent2
    }));
});



app.get("/marks", (req, res) => {
    const compiledPage = pug.compileFile("pages/student_marks.pug");
    var marks = [];
    // TODO: get marks from database

    marks[0] = {
        date: new Date(2019, 9, 10),
        subject: "History",
        mark: "6"
    };

    marks[1] = {
        date: new Date(2019, 10, 12),
        subject: "Math",
        mark: "8"
    }

    marks.sort((a, b) => {
        return b.date - a.date;
    });

    res.end(compiledPage({
        // TODO: student name should be taken from DB
        student_name: "Marco Pecoraro",
        student_marks: marks
    }));
});

app.post('/login_teacher_action', (req, res) => {
    var ssn = req.body.SSN;
    console.log(ssn);
});

// PROJECT FOR TORCHIANO - 12/11/19

/*
app.get("/price", (req, res) => {
    var price = req.query.price;
    var state = req.query.state;
    var nitems = req.query.nitems;

    price *= nitems;

    var con = mysql.createConnection({
        host: "students-db",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });

    con.connect(function (err) {
        if (err) {
            console.log(err)
            res.end(err);
        }
        console.log("Connected!");
        var temp = price / 100;
        con.query("SELECT discount FROM discounts WHERE threshold <= " + temp + " ORDER BY threshold DESC", function (err, result, fields) {
            if (err) {
                console.log(err)
                res.end(err);
            }
            console.log(result[0].discount);
            var real_discount = result[0].discount / 100;
            var discount_price = price - real_discount * price;
            // TAXES
            con.query("SELECT taxes FROM states WHERE code = '" + state + "'", function (err, result, fields) {
                if (err) {
                    console.log(err)
                    res.end(err);
                }

                // TAXES CALCULATED
                console.log(result[0].taxes);
                var real_taxes = result[0].taxes / 100;
                var tax_increment = real_taxes * discount_price / 100;
                console.log("Taxes calculated!");
                var final_price = Math.floor(discount_price + tax_increment);
                res.end("{\n\t\"Price\": \"" + price / 100 + "\"\n\t\"Discount price\": \"" + discount_price / 100
                    + "\"\n\t\"Taxes\": \"" + real_taxes / 100 + "\"\n\t\"Total price\": \"" + final_price / 100 + "\"\n}");
            });
        });
    });
});
*/

// END PROJECT FOR TORCHIANO - 12/11/19

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

// HTTPS

/*
https.createServer({
    key: "", //fs.readFileSync('server.key'),
    cert: "" //fs.readFileSync('server.cert')
}, app)
    .listen(8000, function () {
        console.log(`HTTPS Running on http://${HOST}:${PORT}`);
    })
*/

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);