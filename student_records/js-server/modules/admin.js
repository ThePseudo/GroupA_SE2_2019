//'use strict';

const express = require('express');
const pug = require('pug');
const ethereal = require("../modules/ethereal.js");
const mysql = require('mysql');
const session = require('express-session');


var SESSION = require("./Auth_manager.js");

var router = express.Router();

router.use(session({
    secret: 'students',
    saveUninitialized: false,
    resave: true,
    httpOnly: false
}));

// router.use('/:id', function (req, res, next) {
//     console.log('Request URL:', req.originalUrl);
//     next();
// }, function (req, res, next) {
//     console.log('Request Type:', req.method);
//     next();
// });

// TODO: make this and fix it
/////////////////////////////////
//ricambiare tutte le app in route
router.get("/officer_home", (req, res) => {
    const compiledPage = pug.compileFile("../pages/officer/officer_home.pug");
    res.end(compiledPage());
});

router.get("/admin_home", (req, res) => {
    const compiledPage = pug.compileFile("../pages/sysadmin/systemad_home.pug");
    res.end(compiledPage());
});

router.get("/enroll_teacher", (req, res) => {
    const compiledPage = pug.compileFile("../pages/sysadmin/systemad_registerteacher.pug");
    res.end(compiledPage());
});

router.get("/enroll_officer", (req, res) => {
    const compiledPage = pug.compileFile("../pages/sysadmin/systemad_registerofficer.pug");
    res.end(compiledPage());
});

router.get("/enroll_principal", (req, res) => {
    const compiledPage = pug.compileFile("../pages/sysadmin/systemad_registerprincipal.pug");
    res.end(compiledPage());
});

router.get("/enroll_student", (req, res) => {
    const compiledPage = pug.compileFile("../pages/officer/officer_registerstudent.pug");
    res.end(compiledPage());
});

router.get("/enroll_parent", (req, res) => {
    const compiledPage = pug.compileFile("../pages/officer/officer_registerparent.pug");
    res.end(compiledPage());
});

router.get("/insert_communication", (req, res) => {
    const compiledPage = pug.compileFile("../pages/officer/officer_communication.pug");
    res.end(compiledPage());
});
////////////////////////
router.post("/insert_comm", (req, res) => {
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
        con.query("INSERT INTO General_Communication(id, communication, comm_date) VALUES(?, ?, ?)", [rows[0].c + 1, desc, date], (err, result) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            console.log("Data successfully uploaded! " + result.insertId);
            con.end();
            res.redirect("/admin/officer_home");
        });
    });
});


router.post("/reg_parent", (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let SSN = req.body.SSN;
    let email = req.body.email;
    //Random string of 16 chars
    let password = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)


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
        con.query("INSERT INTO parent(id, first_name, last_name, cod_fisc, email, password, first_access) VALUES(?, ?, ?, ?, ?, ?, ?)",
            [rows[0].c + 1, name, surname, SSN, email, password, 0], (err, result) => {
                if (err) {
                    res.end("There is a problem in the DB connection. Please, try again later " + err);
                    return;
                }
                // Da mettere in enroll function ! (Fede) 
                //invece di resut[0], passare cod_fisc e password
                //Prototipo funzione function (first_name,last_name,username,email,tmp_pwd,user_type)

                ethereal.mail_handler(name, surname, SSN, email, password, "parent");
                console.log("Data successfully uploaded! " + result.insertId);
                con.end();
                res.redirect("/admin/enroll_parent");
            });
    });
});

router.post("/reg_teacher", (req, res) => {
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
            res.redirect("/admin/enroll_teacher");
        });
    });
});

router.post("/reg_officer", (req, res) => {
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
            res.redirect("/admin/enroll_officer");
        });
    });
});

router.post("/reg_principal", (req, res) => {
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
            res.redirect("/admin/enroll_principal");
        });
    });
});

router.post("/reg_student", (req, res) => {
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
                        res.redirect("/admin/enroll_student");
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
                        res.redirect("/admin/enroll_student");
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
                    res.redirect("/admin/enroll_student");
                });
            });
        });
    });
});

router.post("/reg_topic", (req, res) => {
    let course = req.body.course;
    let date = req.body.date;
    let classroom = req.body.class;
    let desc = req.body.desc;

    const compiledPage = pug.compileFile("pages/topics.pug");

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
            var course_id = rows[0].id + 1;
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

router.post("/register", (req, res) => {
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


module.exports = router;