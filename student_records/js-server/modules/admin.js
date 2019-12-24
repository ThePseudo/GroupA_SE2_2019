'use strict';

const express = require('express');
const mailHandler = require("./nodemailer.js");
const myInterface = require('../modules/functions.js');
const bcrypt = require('bcrypt');
const { body } = require('express-validator');
const router = express.Router();

var con;
var msg;
var msgText;
var msgClass;

var first_name;
var last_name;
var SSN;
var email;
var password;
var hash_pwd;
var userType;

router.use(/\/.*/,
    function (req, res, next) {
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
    }, function (req, res, next) {
        first_name = req.body.name;
        last_name = req.body.surname;
        SSN = req.body.SSN;
        email = req.body.email;
        password = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
        hash_pwd = bcrypt.hashSync(password, 10);
        con = myInterface.DBconnect();
        next();
    }, (req, res, next) => {
        msg = req.query.msg;
        msgClass = "";
        msgText = "";
        switch (msg) {
            case "err":
                msgText = "Please, fill all the data";
                msgClass = "err_msg";
                break;
            case "errssn":
                msgText = "Please, insert an Italian SSN";
                msgClass = "err_msg";
                break;
            case "errpres":
                msgText = "User already registered";
                msgClass = "err_msg";
                break;
            case "ok":
                msgText = "User inserted correctly";
                msgClass = "ok_msg";
                break;
            default:
                break;
        }
        next();
    }
);

router.use("/enroll/:user", (req, res, next) => {
    userType = req.params.user;
    next();
})

router.get("/admin_home", (req, res) => {
    res.render("../pages/sysadmin/systemad_home.pug");
});

router.route("/enroll/:user").get((req, res) => {
    var renderPath;
    switch (userType) {
        case "teacher":
            renderPath = "../pages/sysadmin/systemad_registerteacher.pug";
            break;
        case "officer":
            renderPath = "../pages/sysadmin/systemad_registerofficer.pug";
            break;
        case "principal":
            renderPath = "../pages/sysadmin/systemad_registerprincipal.pug";
            break;
        default:
            res.redirect("/admin/admin_home");
            return;
    }
    res.render(renderPath, {
        msg: msgText,
        msgClass: msgClass
    });
}).post(
    [
        body('name').trim().escape(),
        body('surname').trim().escape(),
        body('SSN').trim().escape(),
        body('email').trim().escape().isEmail().normalizeEmail()
    ],
    (req, res) => {
        var table = userType;
        var principal = 0;
        if (userType == "principal") {
            table = "officer";
            principal = 1;
        }
        if (!first_name || !last_name || !SSN || !email) {
            res.redirect("./" + userType + "?msg=err");
            return;
        }
        if (!myInterface.checkItalianSSN(SSN)) {
            res.redirect("./" + userType + "?msg=errssn");
            return;
        }
        //TODO:check valid email format server side

        //Check if SSN already inserted (so the new teacher's data is expected to be already inside the db)
        con.query("SELECT * FROM " + table + " WHERE cod_fisc = ?", [SSN], (err, rows) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            if (rows.length > 0) {
                res.redirect("./" + userType + "?msg=errpres");
            } else {
                con.query('SELECT COUNT(*) as c FROM ' + table, (err, rows) => { // because we have no AUTO_UPDATE available on the DB
                    if (err) {
                        res.end("There is a problem in the DB connection. Please, try again later " + err);
                        return;
                    }
                    if (rows.length <= 0) {
                        res.end("Count impossible to compute");
                        return;
                    }
                    var sql;
                    var params = [];
                    switch (table) {
                        case "teacher":
                            sql = "INSERT INTO teacher(id, first_name, last_name, cod_fisc, email, password, first_access) VALUES(?, ?, ?, ?, ?, ?, ?)";
                            params = [rows[0].c + 1, first_name, last_name, SSN, email, hash_pwd, 0];
                            break;
                        case "officer":
                            sql = "INSERT INTO officer(id, first_name, last_name, cod_fisc, email, password, first_access,principal) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
                            params = [rows[0].c + 1, first_name, last_name, SSN, email, hash_pwd, 0, principal];
                            break;
                        default:
                            break;
                    }
                    con.query(sql, params, (err, result) => {
                        con.end();
                        if (err) {
                            res.end("There is a problem in the DB connection. Please, try again later " + err);
                            return;
                        }
                        mailHandler.mail_handler(first_name, last_name, SSN, email, password, "teacher");
                        res.redirect("./" + userType + "?msg=ok");
                    });
                });
            }
        });
    }
);

module.exports = router;