//'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const ethereal = require("./ethereal.js");
const app = express();
const session = require('express-session');
var router = express.Router();

//global.sessionObj = {};

/* var sessionObj= session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {   secure: true,
                maxAge: 10000 } // maxAge is in milliseconds
}); */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//functions
function DB_open_connection() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });
}


router.use(session({
    secret: 'students',
    saveUninitialized: false,
    resave: true,
    httpOnly: false
}));

function setup_session_var(user_type, user_info, session) {
    //session è un typeof "session", inizializzo la sessione fuori da questa route e poi la associo a "sessionData"
    console.log(user_info);
    session.user = {};     //Nella variabile ho un campo user che è un oggetto e acui posso aggiungere attributi privati /equivale a $_SESSION['user']
    session.user.id = user_info.id; //aggiungo attributo id a user e lo salvo nella variabile "sessionData"
    session.user.first_name = user_info.first_name;
    session.user.last_name = user_info.last_name
    session.user.cod_fisc = user_info.cod_fisc;
    session.user.email = user_info.email;
    session.user.user_type = user_type;
    session.user.first_access = user_info.first_access;
}

function manageCollaborator(con, user_info, response, req) {
    let sql = 'SELECT * FROM officer JOIN admin ON officer.cod_fisc = admin.cod_fisc WHERE officer.cod_fisc = ?';
    let insert = [user_info.cod_fisc];
    sql = mysql.format(sql, insert); //mix all together with "mysql.format()" and pass as parameter to .query() method
    con.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
        if (result.length > 0) {
            console.log("OK ADMIN");
            con.end();
            console.log("ok prima del setup");
            setup_session_var("admin", user_info, req.session);
            console.log("ok dopo setup");
            response.redirect("/admin/admin_home");
        }
        else {
            console.log("OK OFFICER");
            con.end();
            console.log("ok prima del setup");
            setup_session_var("officer", user_info, req.session);
            console.log("ok dopo setup");
            response.redirect("/officer/officer_home");
        }
    });
}

router.get('/login_parent', (req, res) => {

    if (req.session.user)
        res.redirect("/parent/parent_home");
    res.render("../pages/login_parent.pug");
});

router.get('/login_teacher', (req, res) => {

    if (req.session.user)
        res.redirect("/parent/teacher_home");
    res.render("../pages/login_teacher.pug");
});

router.get('/login_collaborator', (req, res) => {
    /*
    if (req.session.user) {
        let redirect_route = "/" + req.session.user.user_type + "/" + req.session.user.user_type + "_home";
        res.redirect(redirect_route);
    }*/
    res.render("../pages/login_officer.pug");
});

router.route('/login')
    .post((req, res) => {
        //i valori del form sono individuati dal valore dell'attributo "name"!
        var user_type = req.body.user_type;
        var cod_fisc = req.body.cod_fisc;
        var password = req.body.password;
        var render_path = "../pages/login_" + user_type + ".pug";

        //Check if both cod_fisc and password field are filled
        if (!cod_fisc || !password) {
            res.render(render_path, { err_msg: "Please enter username and password" });
        }
        else { //If yes, try to connect to the DB and check cod_fisc and then password (string+salt hashed via bcrypt module)
            console.log("TRY CONNECT");
            var con = DB_open_connection();
            console.log(user_type);
            //Prepared Statement with placeholder for both table and fields values
            let sql = 'SELECT * FROM ?? WHERE cod_fisc = ?';
            let insert = [user_type, cod_fisc];
            sql = mysql.format(sql, insert); //mix all together with "mysql.format()" and pass as parameter to .query() method

            con.query(sql, (err, result) => {
                if (result.length > 0) {
                    console.log("OK USER");

                    if (user_type == 'parent' && !result[0].first_access) {
                        console.log("ok primo accesso");
                        con.end();
                        if (password == result[0].password) { //non uso la funzione di verifica hash perchè ho una stringa normale temporanea  
                            setup_session_var(user_type, result[0],req.session);
                            res.redirect("/auth_router/change_pwd");
                            return;
                        }
                        else res.render(render_path, { err_msg: 'Incorrect Username and/or Password!' });
                    }
                    //The cod_fisc exists in the DB, now check the password
                    if (bcrypt.compareSync(password, result[0].password)) {
                        console.log("OK PWD");
                        //password match

                        //SESSION MANAGEMENT
                        if (user_type == "officer") {
                            user_type = manageCollaborator(con, result[0], res, req);
                            console.log(user_type);
                        }
                        else {
                            con.end();
                            console.log("1");
                            setup_session_var(user_type, result[0], req.session);
                            res.redirect("/" + user_type + "/" + user_type + "_home");
                        }
                    } else {
                        // Passwords don't match
                        con.end();
                        res.render(render_path, { err_msg: 'Incorrect Username and/or Password!' });
                    }
                } else {
                    // user don't match
                    res.render(render_path, { err_msg: 'Incorrect Username and/or Password!' });
                }
            });
        }
    });

router.get('/logout', (req, res) => {
    /*
    req.session = {};
    console.log(req.session);
    */
    req.session.destroy();
    res.redirect('/'); //ritorno alla root (qui è la homepage)
});

//TODO: TESTS
router.route('/change_pwd').get((req, res) => {
    res.render("../pages/change_pwd.pug");
}).post((req, res) => {
    var password = req.body.password;
    //Check if password field are filled
    if (!password) {
        res.render("../pages/change_pwd.pug", { err_msg: "Please enter a new password" });
    }
    else {
        console.log("TRY CONNECT");
        var con = DB_open_connection();
        let hash = bcrypt.hashSync(password, 10);
        console.log(req.session.user.cod_fisc);
        con.query('UPDATE parent SET password = ?, first_access = ? WHERE cod_fisc = ?', [hash, 1, req.session.user.cod_fisc], function (err, result) {
            console.log(result);

            if (err) {
                console.log(err);
            }
            else {
                console.log(req.session.user);
                let user_t = req.session.user.user_type;
                console.log(user_t);
                con.end();
                res.redirect("/parent/parent_home");
                //res.redirect("/"+ user_t + "/"+ user_t + "_home");
            }
        });
    }
});


module.exports = router; //esporto handler delle route in questo modulo