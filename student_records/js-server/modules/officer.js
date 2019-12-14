//'use strict';

const express = require('express');
const pug = require('pug');
//const mailHandler = require("../modules/ethereal.js"); one-time email modules disabled but it works (maybe just for test!)
const mailHandler = require("./nodemailer.js");
const bcrypt = require('bcrypt');
const db = require('../modules/functions.js');
const { body } = require('express-validator');

var router = express.Router();

router.get("/officer_home", (req, res) => {
    const compiledPage = pug.compileFile("../pages/officer/officer_home.pug");
    res.end(compiledPage());
});

router.get("/enroll_student", (req, res) => {
    const compiledPage = pug.compileFile("./pages/officer/officer_registerstudent.pug");
    res.end(compiledPage());
});

router.get("/enroll_parent", (req, res) => {
    const compiledPage = pug.compileFile("./pages/officer/officer_registerparent.pug");
    res.end(compiledPage());
});

router.get("/insert_communication", (req, res) => {
    const compiledPage = pug.compileFile("./pages/officer/officer_communication.pug");
    res.end(compiledPage());
});
////////////////////////
router.post("/insert_comm", [body('name')
    .not().isEmpty()
    .trim()
    .escape()
], (req, res) => {
    let desc = req.body.desc;

    var con = db.DBconnect();
    let date = new Date();
    if (!desc) {
        res.render("../pages/officer/officer_communication.pug", { flag_ok: "0", message: "Please fill the description" });
        return;
    }
    con.query('SELECT COUNT(*) as c FROM General_Communication', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        con.query("INSERT INTO General_Communication(id, communication, comm_date) VALUES(?, ?, ?)", [rows[0].c + 1, desc, date], (err, result) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            con.end();
            res.render("../pages/officer/officer_communication.pug", { flag_ok: "1", message: "Message uploaded" });
            return;
        });
    });
});


router.route("/reg_parent").post([body('name')
    .not().isEmpty()
    .trim()
    .escape(), body('surname')
        .not().isEmpty()
        .trim()
        .escape(), body('SSN')
            .not().isEmpty()
            .trim()
            .escape(), body('email')
                .not().isEmpty()
                .trim()
                .escape().isEmail()
], (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let SSN = req.body.SSN;
    let email = req.body.email;
    //Random string of 16 chars ; isa:ho aggiunto il punto e virgola mancante
    let password = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    let hash_pwd = bcrypt.hashSync(password, 10);

    var con = db.DBconnect();

    if (!name || !surname || !SSN || !email) {
        res.render("../pages/officer/officer_registerparent.pug", { flag_ok: "0", message: "Please fill the form correctly" });
        return;
    }

    con.query('SELECT COUNT(*) as c FROM parent', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        let count = rows[0].c + 1;
        con.query('SELECT COUNT(*) as c FROM parent WHERE cod_fisc = ?', [SSN], (err, rows, fields) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            if (rows[0].c == 0) {
                con.query("INSERT INTO parent(id, first_name, last_name, cod_fisc, email, password, first_access) VALUES(?, ?, ?, ?, ?, ?, ?)", [count, name, surname, SSN, email, hash_pwd, 0], (err, result) => {
                    if (err) {
                        res.end("There is a problem in the DB connection. Please, try again later " + err);
                        return;
                    }
                    mailHandler.mail_handler(name, surname, SSN, email, password, "parent");
                    res.render("../pages/officer/officer_registerparent.pug", { flag_ok: "1", message: "New parent insertly correctly" });
                    con.end();
                    return;
                });
            } else {
                res.render("../pages/officer/officer_registerparent.pug", { flag_ok: "0", message: "Parent already exist" });
                return;
            }
        });
    });
});


router.route("/reg_student").post([body('name')
    .not().isEmpty()
    .trim()
    .escape(), body('surname')
        .not().isEmpty()
        .trim()
        .escape(), body('SSN')
            .not().isEmpty()
            .trim()
            .escape(), body('SSN1')
                .not().isEmpty()
                .trim()
                .escape(), body('SSN2')
                    .not().isEmpty()
                    .trim()
                    .escape()
], (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let SSN = req.body.SSN;
    let SSN1 = req.body.SSN1;
    let SSN2 = req.body.SSN2;

    var con = db.DBconnect();

    if (!name || !surname || !SSN) {
        res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "0", message: "Please fill the form correctly" });
        return;
    }

    con.query('SELECT COUNT(*) as c FROM student', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }

        let count = rows[0].c + 1;
        if (SSN1 && SSN2) {
            con.query('SELECT ID FROM parent WHERE cod_fisc = ? OR cod_fisc = ?', [SSN1, SSN2], (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
                if (err) {
                    res.end("There is a problem in the DB connection. Please, try again later " + err);
                    return;
                }
                if (rows.length != 2) {
                    res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "0", message: "Please fill the form with correct parents IDs" });
                    return;
                }
                con.query('SELECT COUNT(*) as c FROM student WHERE cod_fisc = ?', [SSN], (err, rows, fields) => {
                    if (err) {
                        res.end("There is a problem in the DB connection. Please, try again later " + err);
                        return;
                    }
                    if (rows[0].c == 0) {
                        con.query("INSERT INTO student(id, first_name, last_name, cod_fisc, class_id, parent_1, parent_2) VALUES(?, ?, ?, ?, ?, ?, ?)", [count, name, surname, SSN, 0, SSN1, SSN2], (err, result) => {
                            if (err) {
                                res.end("There is a problem in the DB connection. Please, try again later " + err);
                                return;
                            }
                            res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "1", message: "New student inserted correctly" });
                            con.end();
                            return;
                        });
                    } else {
                        res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "0", message: "Student already exist" });
                        return;
                    }
                });
            });
        } else if (SSN1) {
            con.query('SELECT ID FROM parent WHERE cod_fisc = ?', [SSN1], (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
                if (err) {
                    res.end("There is a problem in the DB connection. Please, try again later " + err);
                    return;
                }
                if (rows.length != 1) {
                    res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "0", message: "Please fill the form with correct parent ID" });
                    return;
                }
                con.query('SELECT COUNT(*) as c FROM student WHERE cod_fisc = ?', [SSN], (err, rows, fields) => {
                    if (err) {
                        res.end("There is a problem in the DB connection. Please, try again later " + err);
                        return;
                    }
                    if (rows[0].c == 0) {
                        con.query("INSERT INTO student(id, first_name, last_name, cod_fisc, class_id, parent_1, parent_2) VALUES(?, ?, ?, ?, ?, ?, ?)", [count, name, surname, SSN, 0, SSN1, null], (err, result) => {
                            if (err) {
                                res.end("There is a problem in the DB connection. Please, try again later " + err);
                                return;
                            }
                            res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "1", message: "New student insertly correctly" });
                            con.end();
                            return;
                        });
                    } else {
                        res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "0", message: "Student already exist" });
                        return;
                    }
                });
            });
        } else if (SSN2) {
            con.query('SELECT ID FROM parent WHERE cod_fisc = ?', [SSN2], (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
                if (err) {
                    res.end("There is a problem in the DB connection. Please, try again later " + err);
                    return;
                }
                if (rows.length != 1) {
                    res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "0", message: "Please fill the form with correct parent ID" });
                    return;
                }
                con.query('SELECT COUNT(*) as c FROM student WHERE cod_fisc = ?', [SSN], (err, rows, fields) => {
                    if (err) {
                        res.end("There is a problem in the DB connection. Please, try again later " + err);
                        return;
                    }
                    if (rows[0].c == 0) {
                        con.query("INSERT INTO student(id, first_name, last_name, cod_fisc, class_id, parent_1, parent_2) VALUES(?, ?, ?, ?, ?, ?, ?)", [count, name, surname, SSN, 0, SSN2, null], (err, result) => {
                            if (err) {
                                res.end("There is a problem in the DB connection. Please, try again later " + err);
                                return;
                            }
                            res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "1", message: "New student insertly correctly" });
                            con.end();
                            return;
                        });
                    } else {
                        res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "0", message: "Student already exist" });
                        return;
                    }
                });
            });
        } else {
            res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "0", message: "Please fill the form correctly with at least one parent ID" });
            return;
        }
    });
});

module.exports = router;