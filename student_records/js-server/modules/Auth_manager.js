'use strict';

const express = require('express');
const session = require('express-session');
const fs = require('fs');
const https = require('https');
const http = require('http');
const pug = require('pug');
const bcrypt = require('bcrypt'); 
//const bcrypt = require('bcryptjs');// substituted also this module with the following module in JSON 
const mysql = require('mysql');
const bodyParser = require('body-parser');
const parent = require('./parent.js');
var SESSION_DATA=null;  

const app = express();
var router = express.Router();
app.use("/parent",parent);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//functions
function DB_open_connection(){
    return  mysql.createConnection({
                host: "students-db",
                user: "root",
                password: "pwd",
                database: "students",
                insecureAuth: true
            });
}

function setup_session_var(user_type,user_info,sessionData){
    //session è un typeof "session", inizializzo la sessione fuori da questa route e poi la associo a "sessionData"
    
    sessionData.user = {};     //Nella variabile ho un campo user che è un oggetto e acui posso aggiungere attributi privati /equivale a $_SESSION['user']
    sessionData.user.id = user_info.id; //aggiungo attributo id a user e lo salvo nella variabile "sessionData"
    sessionData.user.first_name = user_info.first_name;
    sessionData.user.last_name = user_info.last_name
    sessionData.user.cod_fisc = user_info.cod_fisc;
    sessionData.user.email = user_info.email;
    sessionData.user.user_type = user_type;
    
}

/* // middleware function to check for logged-in users (esporto all'esterno)
var sessionChecker = function(req, res, next){
    if (req.session.user && req.cookies.user_sid) {
        console.log(req.session.user);
        res.redirect('../pages/parent_homepage');
    } else {
        next();
    }    
} */

router.get('/login_parent', (req, res) => {
    console.log(req.session.user);
        if(req.session.user) res.redirect("/parent/parent_home");
        res.render("../pages/login_parent.pug");  
});

router.get('/login_teacher', (req, res) => {
    console.log(req.session.user);
    res.render("../pages/login_teacher.pug");
});

router.route('/login')
.post((req, res) => {
    //i valori del form sono individuati dal valore dell'attributo "name"!
    var user_type = req.body.user_type;
    var cod_fisc = req.body.cod_fisc;   
    var password = req.body.password;   

    var render_path = "../pages/login_" + user_type + ".pug";
     console.log(user_type);

     //Check if both cod_fisc and password field are filled
     if (!cod_fisc || !password) {  
        res.render(render_path, {err_msg: "Please enter username and password"});
    }
     else{ //If yes, try to connect to the DB and check cod_fisc and then password (string+salt hashed via bcrypt module)
        console.log("TRY CONNECT");
        var con = DB_open_connection();
         console.log(user_type);
        //Prepared Statement with placeholder for both table and fields values
        let sql = 'SELECT * FROM ?? WHERE cod_fisc = ?';
        let insert = [user_type,cod_fisc];
        sql = mysql.format(sql,insert); //mix all together with "mysql.format()" and pass as parameter to .query() method
       
         con.query(sql, (err, result)=> {
             if (result.length > 0) {
                console.log("OK USER");
                 //The cod_fisc exists in the DB, now check the password
                 if(bcrypt.compareSync(password,  result[0].password)) {
                    console.log("OK PWD");
                     //password match
                     con.end();
                     //SESSION MANAGEMENT
                     setup_session_var(user_type,result[0],req.session);
                     res.redirect("/"+user_type + "/" + user_type + "_home");
                 } else {
                     // Passwords don't match
                     con.end();
                     res.render(render_path, {err_msg: 'Incorrect Username and/or Password!'});
                 } 
            }else {
                 // user don't match
                 res.render(render_path, {err_msg: 'Incorrect Username and/or Password!'});
            } 
         });  
     }
    });

router.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/'); //ritorno alla root (qui è la homepage)
    });

});
//------------

module.exports = router; //esporto handler delle route in questo modulo