'use strict';

const express = require('express');
const session = require('express-session');
var FileStore = require('session-file-store')(session);
const cookieParser = require("cookie-parser");
//const session = require('cookie-session');
const fs = require('fs');
const https = require('https');
const http = require('http');
const pug = require('pug');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// App
const app = express();
app.set('view engine', 'pug');
app.set('views', './pages');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const adminPages = require('./modules/admin.js');
const parentPages = require('./modules/parent.js');
const auth_router = require("./modules/Auth_manager.js");

// Constants
const HTTPPORT = 8000;
const HTTPSPORT = 8080;
const HOST = '0.0.0.0';

// other routers
module.exports = function (app) {
    app.use('/action/*', require('./modules'));
};

//mount external route, now I can access to external route via ex. /admin/routename inside adminPages module .js
app.use('/admin', adminPages);
app.use('/parent', parentPages);
app.use('/auth_router', auth_router);
var SESSION = auth_router.sessionData;

const options = {
    key: fs.readFileSync("./certs/localhost.key"),
    cert: fs.readFileSync("./certs/localhost.cert")
};

// Main page
app.get('/', (req, res) => {
    if (SESSION != undefined) 
        res.redirect("/" + sessionData.user.user_type + "/" + sessionData.user.user_type +"_home");
    const compiledPage = pug.compileFile("pages/home.pug");
    res.end(compiledPage());
});

app.get("/style", (req, res) => {
    const page = fs.readFileSync("pages/base/style.css");
    res.end(page);
});

app.get("/teacher_page", (req, res) => {
    const compiledPage = pug.compileFile("pages/teacher_page.pug");
    res.end(compiledPage());
});

app.get("/topics", (req, res) => {
    const compiledPage = pug.compileFile("pages/topics.pug");
    res.end(compiledPage());
});

app.get("/enroll_teacher", (req, res) => {
    const compiledPage = pug.compileFile("pages/sysadmin/systemad_registerteacher.pug");
    res.end(compiledPage());
});

app.get("/enroll_officer", (req, res) => {
    const compiledPage = pug.compileFile("pages/sysadmin/systemad_registerofficer.pug");
    res.end(compiledPage());
});

app.get("/enroll_principal", (req, res) => {
    const compiledPage = pug.compileFile("pages/sysadmin/systemad_registerprincipal.pug");
    res.end(compiledPage());
});

app.get("/admin/enroll_student", (req, res) => {
    const compiledPage = pug.compileFile("pages/officer/officer_registerstudent.pug");
    res.end(compiledPage());
});

app.get("/admin/enroll_parent", (req, res) => {
    const compiledPage = pug.compileFile("pages/officer/officer_registerparent.pug");
    res.end(compiledPage());
});

app.get("/admin/insert_communication", (req, res) => {
    const compiledPage = pug.compileFile("pages/officer/officer_communication.pug");
    res.end(compiledPage());
});

app.get("/parent/course_mark", (req, res) => {
    const compiledPage = pug.compileFile("pages/parent/parent_coursemark.pug");
    res.end(compiledPage());
});

app.get("/parent/course_hw", (req, res) => {
    const compiledPage = pug.compileFile("pages/parent/parent_coursehomework.pug");
    res.end(compiledPage());
});

app.get("/parent/course_topic", (req, res) => {
    const compiledPage = pug.compileFile("pages/parent/parent_coursetopic.pug");
    res.end(compiledPage());
});

// TODO: make this and fix it

app.post("/insert_comm", (req, res) => {
    let desc = req.body.desc;

    var con = mysql.createConnection({
        host: "student-db",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });
    let date = new Date();
    con.query('SELECT COUNT(*) as c FROM General_Communication', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        if (rows.length <= 0) {
            res.end("Count impossible to compute");
            return;
        }
        con.query("INSERT INTO teacher(id, communication, comm_date) VALUES(?, ?, ?)", [rows[0].c + 1, desc, date], (err, result) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            console.log("Data successfully uploaded! " + result.insertId);
            con.end();
            res.redirect("/teachers");
        });
    });
});

app.post("/reg_parent", (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let SSN = req.body.SSN;
    let email = req.body.email;
    let password = req.body.password;

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });

    con.query('SELECT COUNT(*) as c FROM parent', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        if (rows.length <= 0) {
            res.end("Count impossible to compute");
            return;
        }
        con.query("INSERT INTO parent(id, first_name, last_name, cod_fisc, email, password, first_access) VALUES(?, ?, ?, ?, ?, ?, ?)", [rows[0].c + 1, name, surname, SSN, email, password, 1], (err, result) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            console.log("Data successfully uploaded! " + result.insertId);
            con.end();
            res.redirect("/parents");
        });
    });
});

app.post("/reg_teacher", (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let SSN = req.body.SSN;
    let email = req.body.email;
    let password = req.body.password;

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });

    con.query('SELECT COUNT(*) as c FROM teacher', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        if (rows.length <= 0) {
            res.end("Count impossible to compute");
            return;
        }
        con.query("INSERT INTO teacher(id, first_name, last_name, cod_fisc, email, password, first_access) VALUES(?, ?, ?, ?, ?, ?, ?)", [rows[0].c + 1, name, surname, SSN, email, password, 1], (err, result) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            console.log("Data successfully uploaded! " + result.insertId);
            con.end();
            res.redirect("/teachers");
        });
    });
});

app.post("/reg_officer", (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let SSN = req.body.SSN;
    let email = req.body.email;
    let password = req.body.password;

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });

    con.query('SELECT COUNT(*) as c FROM officer', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        if (rows.length <= 0) {
            res.end("Count impossible to compute");
            return;
        }
        con.query("INSERT INTO officer(id, first_name, last_name, cod_fisc, email, password, first_access) VALUES(?, ?, ?, ?, ?, ?, ?)", [rows[0].c + 1, name, surname, SSN, email, password, 1], (err, result) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            console.log("Data successfully uploaded! " + result.insertId);
            con.end();
            res.redirect("/officers");
        });
    });
});

app.post("/reg_principal", (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let SSN = req.body.SSN;
    let email = req.body.email;
    let password = req.body.password;

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });

    con.query('SELECT COUNT(*) as c FROM collaborator', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        if (rows.length <= 0) {
            res.end("Count impossible to compute");
            return;
        }
        con.query("INSERT INTO collaborator(id, first_name, last_name, cod_fisc, email, password, first_access) VALUES(?, ?, ?, ?, ?, ?, ?)", [rows[0].c + 1, name, surname, SSN, email, password, 1], (err, result) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            console.log("Data successfully uploaded! " + result.insertId);
            con.end();
            res.redirect("/principal");
        });
    });
});

app.post("/reg_student", (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let SSN = req.body.SSN;
    let SSN1 = req.body.SSN1;
    let SSN2 = req.body.SSN2;

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });

    con.query('SELECT COUNT(*) as c FROM student', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        if (rows.length <= 0) {
            res.end("Count impossible to compute");
            return;
        }
        let c = rows[0].c + 1;
        con.query('SELECT ID FROM parent WHERE cod_fisc = ?', [SSN1], (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            if (rows.length <= 0) {
                con.query('SELECT ID FROM parent WHERE cod_fisc = ?', [SSN2], (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
                    if (err) {
                        res.end("There is a problem in the DB connection. Please, try again later " + err);
                        return;
                    }
                    if (rows.length <= 0) {
                        res.end("Parent/s ID/s not found");
                        return;
                    }
                    let ID2 = rows[0].ID;
                    con.query("INSERT INTO student(id, first_name, last_name, cod_fisc, class_id, parent_1, parent_2) VALUES(?, ?, ?, ?, ?, ?, ?)", [c, name, surname, SSN, 0, ID2, ""], (err, result) => {
                        if (err) {
                            res.end("There is a problem in the DB connection. Please, try again later " + err);
                            return;
                        }
                        console.log("Data successfully uploaded! " + result.insertId);
                        con.end();
                        res.redirect("/students");
                    });
                });
                return;
            }
            let ID1 = rows[0].ID;
            con.query('SELECT ID FROM parent WHERE cod_fisc = ?', [SSN2], (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
                if (err) {
                    res.end("There is a problem in the DB connection. Please, try again later " + err);
                    return;
                }
                if (rows.length <= 0) {
                    con.query("INSERT INTO student(id, first_name, last_name, cod_fisc, class_id, parent_1, parent_2) VALUES(?, ?, ?, ?, ?, ?, ?)", [c, name, surname, SSN, 0, ID1, ""], (err, result) => {
                        if (err) {
                            res.end("There is a problem in the DB connection. Please, try again later " + err);
                            return;
                        }
                        console.log("Data successfully uploaded! " + result.insertId);
                        con.end();
                        res.redirect("/students");
                    });
                    return;
                }
                let ID2 = rows[0].ID;
                con.query("INSERT INTO student(id, first_name, last_name, cod_fisc, class_id, parent_1, parent_2) VALUES(?, ?, ?, ?, ?, ?, ?)", [c, name, surname, SSN, 0, ID1, ID2], (err, result) => {
                    if (err) {
                        res.end("There is a problem in the DB connection. Please, try again later " + err);
                        return;
                    }
                    console.log("Data successfully uploaded! " + result.insertId);
                    con.end();
                    res.redirect("/students");
                });
            });
        });
    });
});

app.post("/reg_topic", (req, res) => {
    let course = req.body.course;
    let date = req.body.date;
    let classroom = req.body.class;
    let desc = req.body.desc;

    const compiledPage = pug.compileFile("pages/reg_topic.pug");

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });

    let sql = 'SELECT id FROM class WHERE class_name = ?';
    con.query(sql, [classroom], function (err, rows, fields) {
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        var class_id = rows[0].id;
        sql = 'SELECT id FROM course WHERE course_name = ?';
        con.query(sql, [course], (err, rows, fields) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            var course_id = rows[0].id;
            con.query('SELECT COUNT(*) as c FROM topic', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
                if (err) {
                    res.end("There is a problem in the DB connection. Please, try again later " + err);
                    return;
                }
                con.query("INSERT INTO topic(id, topic_date, id_class, id_course, description) VALUES(?, ?, ?, ?, ?)", [rows[0].c, date, class_id, course_id, desc], (err, result) => {
                    if (err) {
                        res.end("There is a problem in the DB connection. Please, try again later " + err);
                        return;
                    }
                    console.log("Data successfully uploaded! " + result.insertId);
                    con.end();
                    res.redirect("/topics");
                });
            });
        });
    });
});

app.post("/register", (req, res) => {
    var name = req.body.name;
    var surname = req.body.surname;
    var fiscalcode = req.body.fiscalcode;
    var parent1 = req.body.parent1;
    var parent2 = req.body.parent2;

    con.connect(function (err) {
        if (err) {
            console.log("Error: " + err);
            return;
        }
        console.log("Connected!");
    });


    let sql = 'INSERT INTO student (first_name, second_name, cod_fisc, parent_1 , parent_2) VALUES (' + name + ',' + surname + ',' + fiscalcode + ',' + parent1 + ',' + parent2 + ')';

    con.query(sql, function (err, rows, fields) {

        if (err) {
            res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
        }
    });
    res.end();
});



app.get("/marks", (req, res) => {
    var marks = [];
    var student_name; // todo: retrieve from db
    const compiledPage = pug.compileFile("pages/student_marks.pug");
    var con = mysql.createConnection({
        host: "localhost",
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