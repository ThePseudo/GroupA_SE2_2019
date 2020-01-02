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

router.get("/class_composition", (req, res)  => {
    var classselected = req.query.classselected;
    var msg = req.query.msg;
    var writtenMsg = "";
    var msgClass = "";
    switch (msg) {
        case "ok":
            writtenMsg = "Class composition update correctly";
            msgClass = "ok_msg";
            break;
        case "err":
            writtenMsg = "Some error occured in student class composition";
            msgClass = "err_msg";
            break;
        case "err_class":
            writtenMsg = "The class already exists";
            msgClass = "err_msg";
            break;
        default:
            break;
    }

    con.query("SELECT id,class_name FROM class", (err, result) => {
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        var classlist = [];
        for (var i = 0; i < result.length; i++) {
            var classitem = {
                id: result[i].id,
                class_name: result[i].class_name,
            }
            classlist[i] = classitem;
        }
        var query = "SELECT * FROM student WHERE class_id IS NULL";
        if(classselected!='Select' && classselected!=undefined)
            query=query+" OR class_id="+classselected;
        console.log(classselected);
        console.log(query);
        con.query(query, (err, result2) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            var studentnoclass = [];
            for (var i = 0; i < result2.length; i++) {
                var studentnoclassitem = {
                    id: result2[i].id,
                    first_name: result2[i].first_name,
                    last_name: result2[i].last_name,
                    cod_fisc: result2[i].cod_fisc,
                    class_id: result2[i].class_id,
                    parent_1: result2[i].parent_1,
                    parent_2: result2[i].parent_2
                }
                studentnoclass[i] = studentnoclassitem;
            }
           
            console.log("print student no class");
            console.log(studentnoclass);
          
            res.render("../pages/officer/officer_classcomposition.pug",{
                classlist: classlist,
                studentnoclass: studentnoclass,
                fullName: fullName,
                msg: writtenMsg,
                msgclass: msgClass,
                classselected: classselected
            });
        });
    });
});

router.post("/up_class", (req, res) => {
    var student =req.body['pippo[]'];
    var classselected = req.body.classselected;
    var query = "SELECT * FROM student WHERE class_id IS NULL OR class_id="+classselected;
    con.query(query, (err, result2) => {
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        var updatequery = "";
        console.log(student);
        for(var i=0; i<result2.length;i++){
            if(student!=undefined && student.includes(result2[i].id + '')){
                console.log("selected");
                console.log(result2[i].id+" "+result2[i].first_name+" "+result2[i].last_name+"\n");
                updatequery = updatequery + " UPDATE student SET class_id="+classselected+" WHERE id="+result2[i].id+";";
            }
            else{
                console.log("not selected");
                console.log(result2[i].id+" "+result2[i].first_name+" "+result2[i].last_name+"\n");
                updatequery = updatequery + " UPDATE student SET class_id=NULL WHERE id="+result2[i].id+";";
            }
        }
        console.log(updatequery);
        con.query(updatequery,(err, result) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }           
            res.redirect("./class_composition?msg=ok&classselected="+classselected);
            return;
        });
    });
});

router.post("/new_class", (req, res) => {
    var newclassyear = req.body.newclassyear;
    var newclasssection = req.body.newclasssection;
    var classname = newclassyear+newclasssection;

    con.query("SELECT class_name FROM class WHERE class_name = ?",[classname],(err, result) => {
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        if(result.length>0){
            res.redirect("./class_composition?msg=err_class");
            con.end();
            return;
        }
        con.query("INSERT INTO class (class_name) VALUES (?)",[classname],(err, result3) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }           
            con.end();
            res.redirect("./class_composition?msg=ok");
            return;
        });
    });
    
});

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
            break;
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