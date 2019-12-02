//'use strict';

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

//IMPORTO oggetto rappresentante la sessione.
//Per accedere ->  SESSION.sessioneData
//Per accedere a user SESSION.sessioneData.user
//Per accedere a campo user es. SESSION.sessioneData.user.id
//Per aggiungere campo a user SESSION.sessioneData.user.nomecampo = valore 
//Per aggiungere campo a sessione -> SESSION.sessioneData.nomecampo = valore
var SESSION = require("./Auth_manager.js");

var router = express.Router();

router.use('/:id', function(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    next();
}, function(req, res, next) {
    console.log('Request Type:', req.method);
    next();
});

router.get("/enroll_student", (req, res) => {
    const compiledPage = pug.compileFile("pages/officer/officer_registerstudent.pug");
    res.end(compiledPage());
});

router.post("/reg_parent", (req, res) => {
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
            res.render("./officer/officer_registerparent.pug", { err_msg: "An error occurred, retry" });
            res.end();
            return;
        }
        if (rows.length <= 0) {
            res.end("Count impossible to compute");
            return;
        }
        con.query("INSERT INTO parent(id, first_name, last_name, cod_fisc, email, password, first_access) VALUES(?, ?, ?, ?, ?, ?, ?)", [rows[0].c + 1, name, surname, SSN, email, password, 1], (err, result) => {
            if (err) {
                res.render("./officer/officer_registerparent.pug", { err_msg: "An error occurred, retry" });
                res.end();
                return;
            }
            console.log("Data successfully uploaded! " + result.insertId);
            con.end();
            res.redirect("/admin/home");
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
            res.render("./officer/officer_registerstudent.pug", { err_msg: "An error occurred, retry" });
            res.end();
            return;
        }
        if (rows.length <= 0) {
            res.render("./officer/officer_registerstudent.pug", { err_msg: "An error occurred, retry" });
            res.end();
            return;
        }
        let c = rows[0].c + 1;
        con.query('SELECT ID FROM parent WHERE cod_fisc = ?', [SSN1], (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
            if (err) {
                res.render("./officer/officer_registerstudent.pug", { err_msg: "An error occurred, retry" });
                res.end();
                return;
            }
            if (rows.length <= 0) {
                if (SSN1 != "" && SSN1 != null) {
                    res.render("./officer/officer_registerstudent.pug", { err_msg: "SSN parent 1 not found" });
                    res.end();
                    return;
                }
                con.query('SELECT ID FROM parent WHERE cod_fisc = ?', [SSN2], (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
                    if (err) {
                        res.render("./officer/officer_registerstudent.pug", { err_msg: "An error occurred, retry" });
                        res.end();
                        return;
                    }
                    if (rows.length <= 0) {
                        if (SSN2 != "" && SSN2 != null) {
                            res.render("./officer/officer_registerstudent.pug", { err_msg: "SSN parents not found" });
                            res.end();
                            return;
                        }
                        res.render("./officer/officer_registerstudent.pug", { err_msg: "Please digit at least a SSN of one parent" });
                        res.end();
                        return;
                    }
                    let ID2 = rows[0].ID;
                    con.query("INSERT INTO student(id, first_name, last_name, cod_fisc, class_id, parent_1, parent_2) VALUES(?, ?, ?, ?, ?, ?, ?)", [c, name, surname, SSN, 0, ID2, ""], (err, result) => {
                        if (err) {
                            res.render("./officer/officer_registerstudent.pug", { err_msg: "An error occurred, retry" });
                            res.end();
                            return;
                        }
                        console.log("Data successfully uploaded! " + result.insertId);
                        con.end();
                        res.redirect("/admin/home");
                    });
                });
                return;
            }
            let ID1 = rows[0].ID;
            con.query('SELECT ID FROM parent WHERE cod_fisc = ?', [SSN2], (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
                if (err) {
                    rres.render("./officer/officer_registerstudent.pug", { err_msg: "An error occurred, retry" });
                    res.end();
                    return;
                }
                if (rows.length <= 0) {
                    if (SSN1 != "" && SSN1 != null) {
                        res.render("./officer/officer_registerstudent.pug", { err_msg: "SSN parent 2 not found" });
                        res.end();
                        return;
                    }
                    con.query("INSERT INTO student(id, first_name, last_name, cod_fisc, class_id, parent_1, parent_2) VALUES(?, ?, ?, ?, ?, ?, ?)", [c, name, surname, SSN, 0, ID1, ""], (err, result) => {
                        if (err) {
                            res.render("./officer/officer_registerstudent.pug", { err_msg: "An error occurred, retry" });
                            res.end();
                            return;
                        }
                        console.log("Data successfully uploaded! " + result.insertId);
                        con.end();
                        res.redirect("/admin/home");
                    });
                    return;
                }
                let ID2 = rows[0].ID;
                con.query("INSERT INTO student(id, first_name, last_name, cod_fisc, class_id, parent_1, parent_2) VALUES(?, ?, ?, ?, ?, ?, ?)", [c, name, surname, SSN, 0, ID1, ID2], (err, result) => {
                    if (err) {
                        res.render("./officer/officer_registerstudent.pug", { err_msg: "An error occurred, retry" });
                        res.end();
                        return;
                    }
                    console.log("Data successfully uploaded! " + result.insertId);
                    con.end();
                    res.redirect("/admin/home");
                });
            });
        });
    });
});

router.get("/home", (req, res) => {
    const compiledPage = pug.compileFile("pages/officer/officer_home.pug");
    res.end(compiledPage());
});

router.get("/enroll_parent", (req, res) => {
    const compiledPage = pug.compileFile("pages/officer/officer_registerparent.pug");
    res.end(compiledPage());
});

router.get("/insert_communication", (req, res) => {
    const compiledPage = pug.compileFile("pages/officer/officer_communication.pug");
    res.end(compiledPage());
});

router.get('/parents', (req, res) => {
    res.end("Hello, parents!");
});

module.exports = router;