//'use strict';

const express = require('express');
const pug = require('pug');
//const mailHandler = require("../modules/ethereal.js"); one-time email modules disabled but it works (maybe just for test!)
const mailHandler = require("./nodemailer.js");
const bcrypt = require('bcrypt');
const db = require('../modules/functions.js');

var router = express.Router();

router.get("/officer_home", (req, res) => {
    const compiledPage = pug.compileFile("../pages/officer/officer_home.pug");
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
            res.redirect("/officer/officer_home");
        });
    });
});


router.post("/reg_parent", (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let SSN = req.body.SSN;
    let email = req.body.email;
    //Random string of 16 chars ; isa:ho aggiunto il punto e virgola mancante
    let password = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    let hash_pwd = bcrypt.hashSync(password, 10);

    var con = db.DBconnect();


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
            [rows[0].c + 1, name, surname, SSN, email, hash_pwd, 0], (err, result) => {
                if (err) {
                    res.end("There is a problem in the DB connection. Please, try again later " + err);
                    return;
                }
                // Da mettere in enroll function ! (Fede) 
                //invece di resut[0], passare cod_fisc e password
                //Prototipo funzione function (first_name,last_name,username,email,tmp_pwd,user_type)

                mailHandler.mail_handler(name, surname, SSN, email, password, "parent");
                console.log("Data successfully uploaded! " + result.insertId);
                con.end();
                res.redirect("/officer/enroll_parent");
            });
    });
});


router.post("/reg_student", (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let SSN = req.body.SSN;
    let SSN1 = req.body.SSN1;
    let SSN2 = req.body.SSN2;

    var con = db.DBconnect();


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
                        res.redirect("/officer/enroll_student");
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
                        res.redirect("/officer/enroll_student");
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
                    res.redirect("/officer/enroll_student");
                });
            });
        });
    });
});

module.exports = router;