'use strict';

const express = require('express');
const pug = require('pug');
//const mailHandler = require("../modules/ethereal.js"); one-time email modules disabled but it works (maybe just for test!)
const mailHandler = require("./nodemailer.js");
const bcrypt = require('bcrypt');
const myInterface = require('../modules/functions.js');
const { body } = require('express-validator');


var router = express.Router();

class Student {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

function updateClass(classID, res) {
    var con = myInterface.DBconnect();
    con.query('SELECT id, last_name, first_name FROM student WHERE class_id=0', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        let StudList = [];
        var i = 0;
        Object.keys(rows).forEach(key => {
            let Stud = new Student(rows[key].id, rows[key].last_name + " " + rows[key].first_name);
            StudList[i] = Stud;
            i++;
        });
        con.query('SELECT id, last_name, first_name FROM student WHERE class_id=?', [classID], (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            let ClassList = [];
            i = 0;
            Object.keys(rows).forEach(key => {
                let Stud = new Student(rows[key].id, rows[key].last_name + " " + rows[key].first_name);
                ClassList[i] = Stud;
                i++;
            });
            con.query('SELECT class_name FROM class WHERE id=?', [classID], (err, rows, fields) => {
                if (err) {
                    res.end("There is a problem in the DB connection. Please, try again later " + err);
                    return;
                }
                res.render("../pages/officer/officer_classcomposition.pug", { className: rows[0].class_name, classID: classID, Class: ClassList, Students: StudList });
            });
        });
    });
}

router.get("/class/:classid/class_composition", (req, res) => {
    var classID = req.params.classid;
    updateClass(classID, res);
});

router.post("/class/:classid/up_class", (req, res) => {
    var classID = req.params.classid;
    var date = new Date();
    var year = date.getFullYear();
    if (date.getMonth() < 9) { // before august
        year--;
    }
    var con = myInterface.DBconnect();
    let i = 0;
    let j = 0;
    let update1 = "UPDATE student SET class_id=0";
    let del = "DELETE FROM student_class";
    let update2 = "UPDATE student SET class_id=" + classID;
    let ins = "INSERT INTO student_class (student_id, class_id, year)";
    Object.keys(req.body).forEach(key => {
        if (req.body[key] != 0) {
            if (i == 0) {
                update1 += " WHERE id=" + key;
                del += " WHERE student_id=" + key;
                i++;
            } else {
                update1 += " OR id=" + key;
                del += " OR student_id=" + key;
            }
        } else {
            if (j == 0) {
                update2 += " WHERE id=" + key;
                ins += " VALUES (" + key + "," + classID + "," + year + ")";
                j++;
            } else {
                update2 += " OR id=" + key;
                ins += ", (" + key + "," + classID + "," + year + ")";
            }
        }
    });
    if (i == 0 && j == 0) {
        updateClass(classID, res);
    }
    if (i != 0 && j != 0) {
        con.query(update1, (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            con.query(update2, (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
                if (err) {
                    res.end("There is a problem in the DB connection. Please, try again later " + err);
                    return;
                }
                con.query(ins, (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
                    if (err) {
                        res.end("There is a problem in the DB connection. Please, try again later " + err);
                        return;
                    }
                    con.query(del, (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
                        if (err) {
                            res.end("There is a problem in the DB connection. Please, try again later " + err);
                            return;
                        }
                        updateClass(classID, res);
                    });
                });
            });
        });
    }
    if (i == 0 && j != 0) {
        con.query(update2, (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            con.query(ins, (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
                if (err) {
                    res.end("There is a problem in the DB connection. Please, try again later " + err);
                    return;
                }
                updateClass(classID, res);
            });
        });
    }
    if (i != 0 && j == 0) {
        con.query(update1, (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            con.query(del, (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
                if (err) {
                    res.end("There is a problem in the DB connection. Please, try again later " + err);
                    return;
                }
                updateClass(classID, res);
            });
        });
    }
})

router.get("/officer_home", (req, res) => {
    const compiledPage = pug.compileFile("../pages/officer/officer_home.pug");
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

    var con = myInterface.DBconnect();
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


router.route("/enroll_parent").get((req, res) => {
    res.render("../pages/officer/officer_registerparent.pug");
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
            res.render("../pages/officer/officer_registerparent.pug", { flag_ok: "0", message: "Please, fill the form correctly" });
            return;
        }

        if (!myInterface.checkItalianSSN(SSN)) {
            res.render("../pages/officer/officer_registerparent.pug", { flag_ok: "0", message: "Please, insert a valid Italian SSN" });
            return;
        }

        //TODO: check email format

        //Check if SSN already inserted (so the new parent's data is expected to be already inside the db)
        con.query('SELECT * FROM parent WHERE cod_fisc = ?', [SSN], (err, rows) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }

            if (rows.length > 0) {
                res.render("../pages/officer/officer_registerparent.pug", { flag_ok: "0", message: "Parent already exists" });
            } else {
                con.query('SELECT COUNT(*) as c FROM parent', (err, rows) => { // because we have no AUTO_UPDATE available on the DB
                    if (err) {
                        res.end("There is a problem in the DB connection. Please, try again later " + err);
                        return;
                    }
                    con.query("INSERT INTO parent(id, first_name, last_name, cod_fisc, email, password, first_access) VALUES(?, ?, ?, ?, ?, ?, ?)", [rows[0].c + 1, name, surname, SSN, email, hash_pwd, 0], (err, result) => {
                        if (err) {
                            res.end("There is a problem in the DB connection. Please, try again later " + err);
                            return;
                        }
                        mailHandler.mail_handler(name, surname, SSN, email, password, "parent");
                        res.render("../pages/officer/officer_registerparent.pug", { flag_ok: "1", message: "New parent inserted correctly" });
                        con.end();
                        return;
                    });
                });
            }
        });
    });


router.route("/enroll_student").get((req, res) => {
    res.render("../pages/officer/officer_registerstudent.pug");
}).post(
    [
        body('name').trim().escape(),
        body('surname').trim().escape(),
        body('SSN').trim().escape(),
        body('SSN1').trim().escape(),
        body('SSN2').trim().escape()
    ],
    (req, res) => {
        let name = req.body.name;
        let surname = req.body.surname;
        let SSN = req.body.SSN;
        let SSN1 = req.body.SSN1;
        let SSN2 = req.body.SSN2;

        var con = myInterface.DBconnect();

        if (!name || !surname || !SSN) {
            res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "0", message: "Please, fill the form correctly" });
            return;
        }

        if (!myInterface.checkItalianSSN(SSN)) {
            res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "0", message: "Please, insert a valid Italian SSN for the student" });
            return;
        }

        if (SSN1 && !myInterface.checkItalianSSN(SSN1)) {
            res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "0", message: "Please, insert a valid Italian SSN for parents" });
            return;
        }

        if (SSN2 && !myInterface.checkItalianSSN(SSN2)) {
            res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "0", message: "Please, insert a valid Italian SSN for parents" });
            return;
        }

        con.query('SELECT COUNT(*) as c FROM student', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }

            let count = rows[0].c + 1;
            if (SSN1 && SSN2) {
                con.query('SELECT ID FROM parent WHERE cod_fisc = ? OR cod_fisc = ?', [SSN1, SSN2], (err, rows, fields) => {
                    if (err) {
                        res.end("There is a problem in the DB connection. Please, try again later " + err);
                        return;
                    }
                    if (rows.length != 2) {
                        res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "0", message: "Please, fill the form with existing parents SSN" });
                        return;
                    }
                    var ID1 = rows[0].ID;
                    var ID2 = rows[1].ID;

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
                            res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "0", message: "Student already exists" });
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
                        res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "0", message: "Please, fill the form with existing parent SSN" });
                        return;
                    }
                    var ID = rows[0].ID;

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
                                res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "1", message: "New student inserted correctly" });
                                con.end();
                                return;
                            });
                        } else {
                            res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "0", message: "Student already exists" });
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
                        res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "0", message: "Please fill the form with existing parent SSN" });
                        return;
                    }
                    var ID = rows[0].id;

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
                                res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "1", message: "New student inserted correctly" });
                                con.end();
                                return;
                            });
                        } else {
                            res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "0", message: "Student already exists" });
                            return;
                        }
                    });
                });
            } else {
                res.render("../pages/officer/officer_registerstudent.pug", { flag_ok: "0", message: "Please, fill the form correctly with at least one parent SSN" });
                return;
            }
        });
    });

module.exports = router;