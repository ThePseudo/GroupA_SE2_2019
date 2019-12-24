//'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const app = express();
const { body } = require('express-validator');
var router = express.Router();
const myInterface = require('./functions');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var con;
var cod_fisc;
var password;
var textMsg;

var accepted_userTypes = ["parent", "teacher", "officer", "admin"];

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/'); //ritorno alla root (qui è la homepage)
});

router.use("/",
    (req, res, next) => {
        if (req.session.user) {
            res.redirect("/");
            return;
        }
        next();
    },
    (req, res, next) => {
        con = myInterface.DBconnect();
        //i valori del form sono individuati dal valore dell'attributo "name"!
        cod_fisc = req.body.cod_fisc;
        password = req.body.password;
        next();
    },
    (req, res, next) => {
        var msg = req.query.msg;
        textMsg = "";
        switch (msg) {
            case "err":
                textMsg = "Please enter username and password";
                break;
            case "wrong":
                textMsg = "Incorrect SSN/password"
                break;
            case "diffpwd":
                textMsg = "Passwords not matching";
                break;
            case "nopwd":
                textMsg = "Insert both passwords";
                break;
            default:
                break;
        }
        next();
    }
);

//Funzione chiamata dopo il check user e pwd e serve per caricare tutte le info utili relative all'user loggato
function setup_session_var(user_type, user_info, sess) {
    //session è un typeof "session", inizializzo la sessione fuori da questa route e poi la associo a "sessionData"
    //console.log(user_info);
    //console.log(user_type);
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

// All logins
router.route('/login/:userType').get((req, res) => {
    var userType = req.params.userType;
    if (!accepted_userTypes.includes(userType)) {
        res.redirect("/");
        return;
    }
    res.render("../pages/login.pug", {
        msg: textMsg,
        user: userType,
        shownUser: userType.replace(/^\w/, c => c.toUpperCase())
    });
}).post(
    [
        body('cod_fisc')
            .not().isEmpty()
            .trim()
            .escape()
    ],
    (req, res) => {
        var userType = req.params.userType;
        if (!accepted_userTypes.includes(userType)) {
            res.redirect("/");
            return;
        }
        //Check if both cod_fisc and password field are filled
        if (!cod_fisc || !password) {
            res.redirect("./" + userType + "?msg=err");
            return;
        }
        //If yes, try to connect to the DB and check cod_fisc and then password
        let sql = 'SELECT * FROM ' + userType + ' WHERE cod_fisc = ?';
        con.query(sql, [cod_fisc], (err, result) => {
            con.end();
            if (err) {
                res.end(err);
                return;
            }
            if (result.length > 0) {
                //The cod_fisc exists in the DB, now check the hashed password
                if (bcrypt.compareSync(password, result[0].password)) {
                    if (userType == "officer") {
                        // Principal in officer table
                        if (result[0].principal) {
                            userType = "principal";
                        }
                    }
                    setup_session_var(userType, result[0], req.session);
                    myRedirect(req.session, res);
                }
                else {
                    // Passwords don't match
                    res.redirect("./" + userType + "?msg=wrong");
                }
            } else {
                // user don't match
                res.redirect("./" + userType + "?msg=wrong");
            }
        });
    }
);

router.route('/change_pwd').get((req, res) => {
    res.render("../pages/change_pwd.pug", {
        msg: textMsg
    });
}).post((req, res) => {
    var confirm_pwd = req.body.confirm_pwd;
    //Check if password field are filled
    if (!password || !confirm_pwd) {
        res.redirect("./change_pwd?msg=nopwd");
        return;
    }
    if (password != confirm_pwd) {
        res.redirect("./change_pwd?msg=diffpwd");
        return;
    }
    let hash_pwd = bcrypt.hashSync(password, 10);
    var user_t = req.session.user.user_type;
    var table_to_update = user_t;
    if (user_t == "principal")
        table_to_update = "officer";
    con.query('UPDATE ? SET password = ?, first_access = ? WHERE cod_fisc = ?',
        [table_to_update, hash_pwd, 1, req.session.user.cod_fisc], function (err, result) {
            con.end();
            if (err) {
                res.end(err);
                return;
            }
            res.redirect("/" + user_t + "/" + user_t + "_home");
        });
});

module.exports = router; //esporto handler delle route in questo modulo