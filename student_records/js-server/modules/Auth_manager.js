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
var nodemailer = require('nodemailer'); 
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

function manageCollaborator(con,user_info,sessionData,response){
    let sql = 'SELECT * FROM officer JOIN admin ON officer.cod_fisc = admin.cod_fisc WHERE officer.cod_fisc = ?';
    let insert = [user_info.cod_fisc];
    sql = mysql.format(sql,insert); //mix all together with "mysql.format()" and pass as parameter to .query() method
    console.log(sql);
    con.query(sql, (err, result)=> {
        if(err){
            console.log(err);
            return;
        }
        if (result.length > 0) {
            console.log("OK ADMIN");
            con.end();
            console.log("ok prima del setup");
            setup_session_var("admin",result[0],sessionData);
            console.log("ok dopo setup");
            response.redirect("/admin/admin_home");
        }
        else{
            console.log("OK OFFICER");
            con.end();
            setup_session_var("officer",result[0],sessionData);
            response.redirect("/officer/officer_home");
        }       
    });
}

function send_Email(user_info){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'youremail@gmail.com',
          pass: 'yourpassword'
        }
      });
      
      var mailOptions = {
        from: 'youremail@gmail.com',
        to: 'myfriend@yahoo.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
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

router.get('/login_collaborator', (req, res) => {
    console.log(req.session.user);
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
                if(user_type == 'parent' && !result[0].first_access){
                    console.log("ok primo accesso");
                    con.end();
                    //TODO: function send email
                    //send_Email(result[0]);
                }
                 //The cod_fisc exists in the DB, now check the password
                 if(bcrypt.compareSync(password,  result[0].password)) {
                    console.log("OK PWD");
                     //password match

                     //SESSION MANAGEMENT
                     if(user_type == "officer"){
                        user_type = manageCollaborator(con,result[0],req.session,res);
                        console.log(user_type);
                     }
                     else{
                         con.end();
                     setup_session_var(user_type,result[0],req.session);
                     res.redirect("/"+user_type + "/" + user_type + "_home");
                     }
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

//TODO: da dove prendo cod_fisc? UNTESTED
router.post('/change_pwd', (req, res) => { 
    var password = req.body.password;   
    //Check if password field are filled
    if (!password) {  
        res.render("../pages/change_pwd.pug", {err_msg: "Please enter a new password"});
    }
    else{ 
        console.log("TRY CONNECT");
        var con = DB_open_connection();
        bcrypt.hash(password, 10).then(function(hash) {
            con.query('UPDATE parent SET password = ? WHERE id = ?', [hash, userId], function (err, result) {
                if (error) console.log(err);
            });
        });
    }
});


module.exports = router; //esporto handler delle route in questo modulo