//'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const app = express();
const { body } = require('express-validator');
var router = express.Router();
const db = require('./functions');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Funzione chiamata dopo il check user e pwd e serve per caricare tutte le info utili relative all'user loggato
function setup_session_var(user_type, user_info, sess) {
    //session è un typeof "session", inizializzo la sessione fuori da questa route e poi la associo a "sessionData"
    console.log(user_info);
    console.log(user_type);
    sess.user = {};
    sess.user.id = user_info.id; //aggiungo attributo id a user
    sess.user.first_name = user_info.first_name;
    sess.user.last_name = user_info.last_name
    sess.user.cod_fisc = user_info.cod_fisc;
    sess.user.email = user_info.email;
    sess.user.user_type = user_type;
    sess.user.first_access = user_info.first_access;
}

//La seguente funzione controlla se sono al primo accesso o meno e di conseguenza mi reindirizza al cambio password  alla home
//L'ho creata per non dover ripetere il blocco if-else sia nella callback di login che nella funzione "manageCollaborator"
function myRedirect(sess, res) {
    if (!sess.user.first_access) {
        res.redirect("/auth_router/change_pwd");
        return;
    }
    else {
        res.redirect("/" + sess.user.user_type + "/" + sess.user.user_type + "_home");
        return;
    }
}


router.route('/login_parent').get((req, res) => {

    if (req.session.user) {
        res.redirect("/parent/parent_home");
        return;
    }
    res.render("../pages/login_parent.pug");

}).post(
    [body('cod_fisc')
        .not().isEmpty()
        .trim()
        .escape()],
    (req, res) => {
        //i valori del form sono individuati dal valore dell'attributo "name"!
        var cod_fisc = req.body.cod_fisc;
        var password = req.body.password;

        //Check if both cod_fisc and password field are filled
        if (!cod_fisc || !password) {
            res.render("../pages/login_parent.pug", { err_msg: "Please enter username and password" });
        }
        else { //If yes, try to connect to the DB and check cod_fisc and then password (string+salt hashed via bcrypt module)
            console.log("TRY CONNECT");
            var con = db.DBconnect();

            let sql = 'SELECT * FROM parent WHERE cod_fisc = ?';
            con.query(sql, [cod_fisc], (err, result) => {

                if (err) {
                    console.log(err);
                    con.end();
                    return;
                }

                if (result.length > 0) {
                    console.log("OK USER");

                    //The cod_fisc exists in the DB, now check the hashed password ( a string + salt) via method "compareSync"
                    if (bcrypt.compareSync(password, result[0].password)) {
                        console.log("OK PWD");

                        setup_session_var("parent", result[0], req.session);
                        con.end();
                        myRedirect(req.session, res);

                    } else {
                        // Passwords don't match
                        con.end();
                        res.render("../pages/login_parent.pug", { err_msg: 'Incorrect Username and/or Password!' });
                    }
                } else {
                    // user don't match
                    res.render("../pages/login_parent.pug", { err_msg: 'Incorrect Username and/or Password!' });
                }
            });
        }
    });

router.route('/login_teacher').get((req, res) => {

    if (req.session.user) {
        res.redirect("/teacher/teacher_home");
        return;
    }
    res.render("../pages/login_teacher.pug");

}).post(
    [body('cod_fisc')
        .not().isEmpty()
        .trim()
        .escape()],
    (req, res) => {
        //i valori del form sono individuati dal valore dell'attributo "name"!
        var cod_fisc = req.body.cod_fisc;
        var password = req.body.password;

        //Check if both cod_fisc and password field are filled
        if (!cod_fisc || !password) {
            res.render("../pages/login_teacher.pug", { err_msg: "Please enter username and password" });
        }
        else { //If yes, try to connect to the DB and check cod_fisc and then password (string+salt hashed via bcrypt module)
            console.log("TRY CONNECT");
            var con = db.DBconnect();

            let sql = 'SELECT * FROM teacher WHERE cod_fisc = ?';
            con.query(sql, [cod_fisc], (err, result) => {

                if (err) {
                    console.log(err);
                    con.end();
                    return;
                }

                if (result.length > 0) {
                    console.log("OK USER");

                    //The cod_fisc exists in the DB, now check the hashed password ( a string + salt) via method "compareSync"
                    if (bcrypt.compareSync(password, result[0].password)) {
                        console.log("OK PWD");

                        setup_session_var("teacher", result[0], req.session);
                        con.end();
                        myRedirect(req.session, res);

                    } else {
                        // Passwords don't match
                        con.end();
                        res.render("../pages/login_teacher.pug", { err_msg: 'Incorrect Username and/or Password!' });
                    }
                } else {
                    // user don't match
                    res.render("../pages/login_teacher.pug", { err_msg: 'Incorrect Username and/or Password!' });
                }
            });
        }
    });

router.route('/login_officer').get((req, res) => {

    if (req.session.user) {
        res.redirect("/officer/officer_home");
        return;
    }
    res.render("../pages/login_officer.pug");

}).post(
    [body('cod_fisc')
        .not().isEmpty()
        .trim()
        .escape()],
    (req, res) => {
        //i valori del form sono individuati dal valore dell'attributo "name"!
        var cod_fisc = req.body.cod_fisc;
        var password = req.body.password;

        //Check if both cod_fisc and password field are filled
        if (!cod_fisc || !password) {
            res.render("../pages/login_officer.pug", { err_msg: "Please enter username and password" });
        }
        else { //If yes, try to connect to the DB and check cod_fisc and then password (string+salt hashed via bcrypt module)
            console.log("TRY CONNECT");
            var con = db.DBconnect();

            let sql = 'SELECT * FROM officer WHERE cod_fisc = ? AND !principal';
            con.query(sql, [cod_fisc], (err, result) => {

                if (err) {
                    console.log(err);
                    con.end();
                    return;
                }

                if (result.length > 0) {
                    console.log("OK USER");

                    //The cod_fisc exists in the DB, now check the hashed password ( a string + salt) via method "compareSync"
                    if (bcrypt.compareSync(password, result[0].password)) {
                        console.log("OK PWD");

                        setup_session_var("officer", result[0], req.session);
                        con.end();
                        myRedirect(req.session, res);

                    } else {
                        // Passwords don't match
                        con.end();
                        res.render("../pages/login_officer.pug", { err_msg: 'Incorrect Username and/or Password!' });
                    }
                } else {
                    // user don't match
                    res.render("../pages/login_officer.pug", { err_msg: 'Incorrect Username and/or Password!' });
                }
            });
        }
    });

router.route('/login_admin').get((req, res) => {

    if (req.session.user) {
        res.redirect("/admin/admin_home");
        return;
    }
    res.render("../pages/login_admin.pug");

}).post(
    [body('cod_fisc')
        .not().isEmpty()
        .trim()
        .escape()],
    (req, res) => {
        //i valori del form sono individuati dal valore dell'attributo "name"!
        var cod_fisc = req.body.cod_fisc;
        var password = req.body.password;

        //Check if both cod_fisc and password field are filled
        if (!cod_fisc || !password) {
            res.render("../pages/login_admin.pug", { err_msg: "Please enter username and password" });
        }
        else { //If yes, try to connect to the DB and check cod_fisc and then password (string+salt hashed via bcrypt module)
            console.log("TRY CONNECT");
            var con = db.DBconnect();

            let sql = 'SELECT * FROM admin WHERE cod_fisc = ?';
            con.query(sql, [cod_fisc], (err, result) => {

                if (err) {
                    console.log(err);
                    con.end();
                    return;
                }

                if (result.length > 0) {
                    console.log("OK USER");

                    //The cod_fisc exists in the DB, now check the hashed password ( a string + salt) via method "compareSync"
                    if (bcrypt.compareSync(password, result[0].password)) {
                        console.log("OK PWD");

                        setup_session_var("admin", result[0], req.session);
                        con.end();
                        res.redirect("/admin/admin_home");

                    } else {
                        // Passwords don't match
                        con.end();
                        res.render("../pages/login_admin.pug", { err_msg: 'Incorrect Username and/or Password!' });
                    }
                } else {
                    // user don't match
                    res.render("../pages/login_admin.pug", { err_msg: 'Incorrect Username and/or Password!' });
                }
            });
        }
    });

router.route('/login_principal').get((req, res) => {

    if (req.session.user) {
        res.redirect("/principal/principal_home");
        return;
    }
    res.render("../pages/login_principal.pug");

}).post(
    [body('cod_fisc')
        .not().isEmpty()
        .trim()
        .escape()],
    (req, res) => {
        //i valori del form sono individuati dal valore dell'attributo "name"!
        var cod_fisc = req.body.cod_fisc;
        var password = req.body.password;

        //Check if both cod_fisc and password field are filled
        if (!cod_fisc || !password) {
            res.render("../pages/login_principal.pug", { err_msg: "Please enter username and password" });
        }
        else { //If yes, try to connect to the DB and check cod_fisc and then password (string+salt hashed via bcrypt module)
            console.log("TRY CONNECT");
            var con = db.DBconnect();

            let sql = 'SELECT * FROM officer WHERE cod_fisc = ? AND principal';
            con.query(sql, [cod_fisc], (err, result) => {

                if (err) {
                    console.log(err);
                    con.end();
                    return;
                }

                if (result.length > 0) {
                    console.log("OK USER");

                    //The cod_fisc exists in the DB, now check the hashed password ( a string + salt) via method "compareSync"
                    if (bcrypt.compareSync(password, result[0].password)) {
                        console.log("OK PWD");

                        setup_session_var("principal", result[0], req.session);
                        con.end();
                        res.redirect("/principal/principal_home");

                    } else {
                        // Passwords don't match
                        con.end();
                        res.render("../pages/principal_admin.pug", { err_msg: 'Incorrect Username and/or Password!' });
                    }
                } else {
                    // user don't match
                    res.render("../pages/login_principal.pug", { err_msg: 'Incorrect Username and/or Password!' });
                }
            });
        }
    });


router.route('/change_pwd').get((req, res) => {
    res.render("../pages/change_pwd.pug");
}).post(((req, res) => {
    var password = req.body.password;
    var confirm_pwd = req.body.confirm_pwd;
    var render_path = "../pages/change_pwd.pug";

    //Check if password field are filled
    if (!password || !confirm_pwd) {
        res.render(render_path, { err_msg: "Please, enter a new password and confirm it" });
    }
    else if (password != confirm_pwd) {
        res.render(render_path, { err_msg: "Please, the two passwords MUST be the same" });
    }
    else {
        console.log("TRY CONNECT");
        var con = db.DBconnect();
        let hash_pwd = bcrypt.hashSync(password, 10);
        console.log(req.session.user.cod_fisc);
        con.query('UPDATE ?? SET password = ?, first_access = ? WHERE cod_fisc = ?', [req.session.user.user_type, hash_pwd, 1, req.session.user.cod_fisc], function (err, result) {
            console.log(result);
            if (err) {
                con.end();
                console.log(err);
                return;
            }
            else {
                let user_t = req.session.user.user_type;
                console.log(user_t);
                con.end();
                res.redirect("/" + user_t + "/" + user_t + "_home");
            }
        });
    }
}));


router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/'); //ritorno alla root (qui è la homepage)
});

module.exports = router; //esporto handler delle route in questo modulo
