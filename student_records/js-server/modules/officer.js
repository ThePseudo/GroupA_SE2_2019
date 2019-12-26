'use strict';

const express = require('express');
const mailHandler = require("./mail.js");
const bcrypt = require('bcrypt');
const myInterface = require('../modules/functions.js');
const { body } = require('express-validator');

var router = express.Router();

var fullName = "";
var con;

router.use(/\/.*/, function (req, res, next) {
    fullName = req.session.user.first_name + " " + req.session.user.last_name;
    con = myInterface.DBconnect();
    next();
});

// Officer home
router.get("/officer_home", (req, res) => {
    res.render("../pages/officer/officer_home.pug");
});

// Class composition
class Student {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

function updateClass(classID, res) {
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

// Class composition partially done, some TODOs:
/*
    + Graphic improvement
    + Add a GET message parameter request
    + Don't use updateClass(), write the code directly here
*/
router.get("/class/:classid/class_composition", (req, res) => {
    var classID = req.params.classid;
    updateClass(classID, res);
});

// In updating the class composition, some TODOs:
/*
    + Don't use res.render, use res.redirect with a GET message (look at the following routes + their pages)
    + Review both GET and post
*/
router.post("/class/:classid/up_class", (req, res) => {
    var classID = req.params.classid;
    var date = new Date();
    var year = date.getFullYear();
    if (date.getMonth() < 9) { // before august
        year--;
    }
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

////////////////////////////////////////////////

// Insert communication
router.get("/insert_communication", (req, res) => {
    var msg = req.query.msg;
    var writtenMsg = "";
    var msgClass = "";
    switch (msg) {
        case "ok":
            writtenMsg = "Communication inserted correctly";
            msgClass = "ok_msg";
            break;
        case "err":
            writtenMsg = "Please fill the description";
            msgClass = "err_msg";
            break;
        default:
            break;
    }
    res.render("../pages/officer/officer_communication.pug", {
        fullName: fullName,
        msg: writtenMsg,
        msgclass: msgClass
    });
});

////////////////////////
router.post("/insert_comm", [body('name')
    .not().isEmpty()
    .trim()
    .escape()
], (req, res) => {
    let desc = req.body.desc;

    let date = new Date();
    if (!desc) {
        res.redirect("./insert_communication?msg=err");
        return;
    }
    con.query("INSERT INTO General_Communication(communication, comm_date) VALUES(?, ?)", [desc, date], (err, result) => {
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        con.end();
        res.redirect("./insert_communication?msg=ok");
        return;
    });
});

// Register parent
/*
    TODO
    Note: see again for code redundancy
*/
router.route("/enroll_parent").get((req, res) => {
    var msg = req.query.msg;
    var writtenMsg = "";
    var classMsg = "";
    switch (msg) {
        case "noform":
            writtenMsg = "Please, fill all the data";
            classMsg = "err_msg";
            break;
        case "nossn":
            writtenMsg = "Please, insert a valid italian SSN";
            classMsg = "err_msg";
            break;
        case "parex":
            writtenMsg = "Parent already exists";
            classMsg = "err_msg";
            break;
        case "ok":
            writtenMsg = "New parent inserted correctly";
            classMsg = "ok_msg"
            break;
        default:
            break;
    }
    res.render("../pages/officer/officer_registerparent.pug", {
        fullName: fullName,
        msg: writtenMsg,
        classmsg: classMsg
    });
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

        if (!name || !surname || !SSN || !email) {
            res.redirect("./enroll_parent?msg=noform");
            return;
        }
        if (!myInterface.checkItalianSSN(SSN)) {
            res.redirect("./enroll_parent?msg=nossn");
            return;
        }
        //TODO: check email format

        //Check if SSN already inserted (so the new parent's data is expected to be already inside the db)
        con.query('SELECT * FROM parent WHERE cod_fisc = ? FOR UPDATE', [SSN], (err, rows) => {
            if (err) {
                res.end("DB error: " + err);
                return;
            }

            if (rows.length > 0) {
                res.redirect("./enroll_parent?msg=parex");
                return;
            }

            con.query("INSERT INTO parent(first_name, last_name, cod_fisc, email, password, first_access) VALUES(?, ?, ?, ?, ?, ?)",
                [name, surname, SSN, email, hash_pwd, 0], (err, result) => {
                    if (err) {
                        res.end("DB error: " + err);
                        return;
                    }
                    mailHandler.mail_handler(name, surname, SSN, email, password, "parent");
                    res.redirect("./enroll_parent?msg=ok");
                    con.end();
                    return;
                });
        });
    }
);

// Enroll student
/*
    TODO
    Note: see again for code redundancy
    RES RENDERS OH NOOOOOOO!
*/
router.route("/enroll_student").get((req, res) => {
    var msg = req.query.msg;
    var writtenMsg = "";
    var classMsg = "";
    switch (msg) {
        case "err":
            writtenMsg = "Please, fill all the required data";
            classMsg = "err_msg";
            break;
        case "noparform":
            writtenMsg = "Please, insert at least 1 parent";
            classMsg = "err_msg";
            break;
        case "nossn":
            writtenMsg = "Please, insert a valid italian SSN";
            classMsg = "err_msg";
            break;
        case "studex":
            writtenMsg = "Student already exists";
            classMsg = "err_msg";
            break;
        case "noparssn":
            writtenMsg = "Please, insert a valid Italian SSN for parents";
            classMsg = "err_msg";
            break;
        case "nopar":
            writtenMsg = "This parent does not exist";
            classMsg = "err_msg";
        case "ok":
            writtenMsg = "New parent inserted correctly";
            classMsg = "ok_msg"
            break;
        default:
            break;
    }
    res.render("../pages/officer/officer_registerstudent.pug", {
        fullName: fullName,
        msg: writtenMsg,
        msgclass: classMsg
    });
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

        var params = [SSN1, SSN2];

        if (!name || !surname || !SSN) {
            res.redirect("./enroll_student?msg=err");
            return;
        }

        if (!myInterface.checkItalianSSN(SSN)) {
            res.redirect("./enroll_student?msg=nossn");
            return;
        }

        // Check for parent SSNs
        if (SSN1 && !myInterface.checkItalianSSN(SSN1)) {
            res.redirect("./enroll_student?msg=noparssn");
            return;
        }

        if (SSN2 && !myInterface.checkItalianSSN(SSN2)) {
            res.redirect("./enroll_student?msg=noparssn");
            return;
        }
        if (!SSN1 && !SSN2) {
            res.redirect("./enroll_student?msg=noparform");
            return;
        }

        // If no SSN1 but SSN2
        else if (SSN2 && !SSN1) {
            SSN1 = SSN2;
            SSN2 = null;
        }
        if (!SSN2) {
            params = [SSN1, SSN1];
        }
        con.query('SELECT ID FROM parent WHERE cod_fisc = ? OR cod_fisc = ?',
            params, (err, rows, fields) => {
                if (err) {
                    res.end("DB error: " + err);
                    return;
                }
                var ID1 = rows[0].ID;
                var ID2 = null;
                if (SSN1 && SSN2) {
                    if (rows.length != 2) {
                        res.redirect("./enroll_student?msg=nopar");
                        return;
                    }
                    ID2 = rows[1].ID;
                }
                else if (SSN1 && !SSN2) {
                    if (rows.length != 1) {
                        res.redirect("./enroll_student?msg=nopar");
                        return;
                    }
                }
                con.query('SELECT COUNT(*) as c FROM student WHERE cod_fisc = ?', [SSN], (err, rows) => {
                    if (err) {
                        res.end("DB error: " + err);
                        return;
                    }
                    if (rows[0].c != 0) {
                        res.redirect("./enroll_student?msg=studex");
                        return;
                    }
                    con.query("INSERT INTO student(first_name, last_name, cod_fisc, class_id, parent_1, parent_2) VALUES(?, ?, ?, ?, ?, ?)",
                        [name, surname, SSN, 0, ID1, ID2], (err, result) => {
                            if (err) {
                                res.end("DB error: " + err);
                                return;
                            }
                            res.redirect("./enroll_student?msg=ok");
                            con.end();
                            return;
                        });
                });
            });
    }
);

module.exports = router;