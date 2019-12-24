'use strict';

const express = require('express');
const pug = require('pug');
const mailHandler = require("./nodemailer.js");
const myInterface = require('../modules/functions.js');
const bcrypt = require('bcrypt');
const { body } = require('express-validator');
var router = express.Router();


router.use(/\/.*/, function (req, res, next) {
    try {
        if (req.session.user.user_type != 'admin') {
            res.redirect("/");
            return;
        } else {
            next();
        }
    } catch (err) {
        res.redirect("/");
    }
});


router.get("/admin_home", (req, res) => {
    const compiledPage = pug.compileFile("../pages/sysadmin/systemad_home.pug");
    res.end(compiledPage());
});

router.get("/insert_communication", (req, res) => {
    const compiledPage = pug.compileFile("../pages/officer/officer_communication.pug");
    res.end(compiledPage());
});

////////////////////////
router.post("/insert_comm", (req, res) => {
    let desc = req.body.desc;

    var con = myInterface.DBconnect();

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

router.route("/enroll_teacher").get((req, res) => {
    res.render("../pages/sysadmin/systemad_registerteacher.pug");
}).post(
    [
        body('name').trim().escape(),
        body('surname').trim().escape(),
        body('SSN').trim().escape(),
        body('email').trim().escape().isEmail().normalizeEmail()
    ],
    (req, res) => {
        let name = req.body.name;
        let surname = req.body.surname;
        let SSN = req.body.SSN;
        let email = req.body.email;
        let password = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
        let hash_pwd = bcrypt.hashSync(password, 10);
        var con = myInterface.DBconnect();

        if (!name || !surname || !SSN || !email) {
            res.render("../pages/sysadmin/systemad_registerteacher.pug", { ok_flag: 0, message: "Please, fill all the form fields" });
            return;
        }

        if (!myInterface.checkItalianSSN(SSN)) {
            res.render("../pages/sysadmin/systemad_registerteacher.pug", { flag_ok: "0", message: "Please, insert a valid Italian SSN" });
            return;
        }
        //TODO:check valid email format server side

        //Check if SSN already inserted (so the new teacher's data is expected to be already inside the db)
        con.query('SELECT * FROM teacher WHERE cod_fisc = ?', [SSN], (err, rows) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }

            if (rows.length > 0) {
                res.render("../pages/sysadmin/systemad_registerteacher.pug", { flag_ok: 0, message: "Teacher already exists" });
            } else {
                con.query('SELECT COUNT(*) as c FROM teacher', (err, rows) => { // because we have no AUTO_UPDATE available on the DB
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
                        res.render("../pages/sysadmin/systemad_registerteacher.pug", { flag_ok: 1, message: "New teacher inserted correctly" });
                    });
                });
            }
        });
    });


router.route("/enroll_officer").get((req, res) => {
    res.render("../pages/sysadmin/systemad_registerofficer.pug");
}).post(
    [
        body('name').trim().escape(),
        body('surname').trim().escape(),
        body('SSN').trim().escape(),
        body('email').trim().escape().isEmail().normalizeEmail()
    ],
    (req, res) => {
        let name = req.body.name;
        let surname = req.body.surname;
        let SSN = req.body.SSN;
        let email = req.body.email;
        let password = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
        let hash_pwd = bcrypt.hashSync(password, 10);
        var con = myInterface.DBconnect();

        if (!name || !surname || !SSN || !email) {
            res.render("../pages/sysadmin/systemad_registerofficer.pug", { ok_flag: 0, message: "Please, fill all the form fields" });
            return;
        }

        if (!myInterface.checkItalianSSN(SSN)) {
            res.render("../pages/sysadmin/systemad_registerofficer.pug", { flag_ok: "0", message: "Please, insert a valid Italian SSN" });
            return;
        }
        //TODO:check valid email format server side

        //Check if SSN already inserted (so the new officer/principal's data is expected to be already inside the db)
        con.query('SELECT * FROM officer WHERE cod_fisc = ?', [SSN], (err, rows) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }

            if (rows.length > 0) {
                res.render("../pages/sysadmin/systemad_registerofficer.pug", { flag_ok: 0, message: "Officer already exists" });
            } else {
                con.query('SELECT COUNT(*) as c FROM officer', (err, rows) => { // because we have no AUTO_UPDATE available on the DB
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
                        res.render("../pages/sysadmin/systemad_registerofficer.pug", { flag_ok: 1, message: "New officer inserted correctly" });
                    });
                });
            }
        });
    });


router.route("/enroll_principal").get((req, res) => {
    res.render("../pages/sysadmin/systemad_registerprincipal.pug");
}).post(
    [
        body('name').trim().escape(),
        body('surname').trim().escape(),
        body('SSN').trim().escape(),
        body('email').trim().escape().isEmail().normalizeEmail()
    ],
    (req, res) => {
        let name = req.body.name;
        let surname = req.body.surname;
        let SSN = req.body.SSN;
        let email = req.body.email;
        let password = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
        let hash_pwd = bcrypt.hashSync(password, 10);
        var con = myInterface.DBconnect();

        if (!name || !surname || !SSN || !email) {
            res.render("../pages/sysadmin/systemad_registerprincipal.pug", { ok_flag: 0, message: "Please, fill all the form fields" });
            return;
        }

        if (!myInterface.checkItalianSSN(SSN)) {
            res.render("../pages/sysadmin/systemad_registerprincipal.pug", { flag_ok: "0", message: "Please, insert a valid Italian SSN" });
            return;
        }
        //TODO:check valid email format server side

        //Check if SSN already inserted (so the new officer/principal's data is expected to be already inside the db)
        con.query('SELECT * FROM officer WHERE cod_fisc = ?', [SSN], (err, rows) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }

            if (rows.length > 0) {
                res.render("../pages/sysadmin/systemad_registerprincipal.pug", { flag_ok: 0, message: "Principal already exists" });
            } else {
                con.query('SELECT COUNT(*) as c FROM officer', (err, rows) => { // because we have no AUTO_UPDATE available on the DB
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
                        //The login route and page are the same for both principal and officer.
                        //There is a flag inside the DB in order to recognise if I'm principal or officer
                        mailHandler.mail_handler(name, surname, SSN, email, password, "officer");
                        console.log("Data successfully uploaded! " + result.insertId);
                        con.end();
                        res.render("../pages/sysadmin/systemad_registerprincipal.pug", { flag_ok: 1, message: "New principal inserted correctly" });
                    });
                });
            }
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