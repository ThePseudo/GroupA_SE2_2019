//'use strict';

const express = require('express');
const pug = require('pug');
//const mailHandler = require("../modules/ethereal.js"); one-time email modules disabled but it works (maybe just for test!)
const mailHandler = require("./nodemailer.js");
const db = require('../modules/functions.js');
const bcrypt = require('bcrypt');

var router = express.Router();

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


router.get("/insert_communication", (req, res) => {
    const compiledPage = pug.compileFile("../pages/officer/officer_communication.pug");
    res.end(compiledPage());
});
////////////////////////
router.post("/insert_comm", (req, res) => {
    let desc = req.body.desc;

    var con = db.DBconnect();

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

router.post("/reg_teacher", (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let SSN = req.body.SSN;
    let email = req.body.email;
    let password = req.body.password;

    var con = db.DBconnect();


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
            console.log(result.insertId + " " + name + " " + surname + " " + SSN + " " + email + " " + password);
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
    let password = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    let hash_pwd = bcrypt.hashSync(password, 10);

    var con = db.DBconnect();

    con.query('SELECT COUNT(*) as c FROM officer', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        if (rows.length <= 0) {
            res.end("Count impossible to compute");
            return;
        }
        con.query("INSERT INTO officer(id, first_name, last_name, cod_fisc, email, password, first_access,principal) VALUES(?, ?, ?, ?, ?, ?, ?, ?)", [rows[0].c + 1, name, surname, SSN, email, hash_pwd, 0, 0], (err, result) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            mailHandler.mail_handler(name, surname, SSN, email, password, "officer");
            console.log("Data successfully uploaded! " + result.insertId);
            con.end();
            res.redirect("/admin/enroll_officer");
        });
    });
});

//COMMENTO MOMENTANEAMENTE ROUTE PER ENROLL PRINCIPAL

router.post("/reg_principal", (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let SSN = req.body.SSN;
    let email = req.body.email;
    let password = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    let hash_pwd = bcrypt.hashSync(password, 10);

    var con = db.DBconnect();

    con.query('SELECT COUNT(*) as c FROM officer', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        if (rows.length <= 0) {
            res.end("Count impossible to compute");
            return;
        }
        con.query("INSERT INTO officer (id, first_name, last_name, cod_fisc, email, password, first_access, principal) VALUES(?, ?, ?, ?, ?, ?, ?, ?)", [rows[0].c + 1, name, surname, SSN, email, hash_pwd, 0, 1], (err, result) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            mailHandler.mail_handler(name, surname, SSN, email, password, "principal");
            console.log("Data successfully uploaded! " + result.insertId);
            con.end();
            res.redirect("/admin/enroll_principal");
        });
    });
});


router.post("/reg_teacher", (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let SSN = req.body.SSN;
    let email = req.body.email;
    let password = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    let hash_pwd = bcrypt.hashSync(password, 10);
    var con = db.DBconnect();


    con.query('SELECT COUNT(*) as c FROM teacher', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        if (rows.length <= 0) {
            res.end("Count impossible to compute");
            return;
        }
        con.query("INSERT INTO teacher(id, first_name, last_name, cod_fisc, email, password, first_access) VALUES(?, ?, ?, ?, ?, ?, ?)", [rows[0].c + 1, name, surname, SSN, email, hash_pwd, 0], (err, result) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            mailHandler.mail_handler(name, surname, SSN, email, password, "teacher");
            console.log("Data successfully uploaded! " + result.insertId);
            console.log(result.insertId + " " + name + " " + surname + " " + SSN + " " + email + " " + password);
            con.end();
            res.redirect("/admin/enroll_teacher");
        });
    });
});


router.post("/reg_topic", (req, res) => {
    let course = req.body.course;
    let date = req.body.date;
    let classroom = req.body.class;
    let desc = req.body.desc;

    var con = db.DBconnect();


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