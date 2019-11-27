'use strict';

const express = require('express');
const session = require('express-session')
const fs = require('fs');
const https = require('https');
const http = require('http');
const pug = require('pug');
const bcrypt = require('bcrypt'); 
//const bcrypt = require('bcryptjs');// substituted also this module with the following module in JSON 
const mysql = require('mysql');
const bodyParser = require('body-parser');
const adminPages = require('./modules/admin.js');
const parentPages = require('./modules/parent.js')

//Variabile globale per la sessione. Questa soluzione va bene per un solo utente, per multiuser vedere altre soluzioni (es. Redis Server)
var sessionData; // Questa variabile rappresenta la sessione, un po' il lavoro che face $_SESSION in PHP

// Constants
const HTTPPORT = 8000;
const HTTPSPORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.set('view engine', 'pug');
app.set('views', './pages');
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

<<<<<<< HEAD
// other routers
module.exports = function (app) {
    app.use('/action/*', require('./modules'));
};


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

function setup_session_var(user_type,user_info){
    //session è un typeof "session", inizializzo la sessione fuori da questa route e poi la associo a "sessionData"
    sessionData = session;
    
    sessionData.user = {};     //Nella variabile ho un campo user che è un oggetto e acui posso aggiungere attributi privati /equivale a $_SESSION['user']
    sessionData.user.id = user_info.id; //aggiungo attributo id a user e lo salvo nella variabile "sessionData"
    sessionData.user.first_name = user_info.first_name;
    sessionData.user.last_name = user_info.last_name
    sessionData.user.cod_fisc = user_info.cod_fisc;
    sessionData.user.email = user_info.email;
    sessionData.user.user_type = user_type;

    console.log(sessionData.user);
}

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/pages/parent_homepage');
    } else {
        next();
    }    
};
=======
app.use('/admin', adminPages);
app.use('/parent', parentPages);
>>>>>>> master

const options = {
    key: fs.readFileSync("./certs/localhost.key"),
    cert: fs.readFileSync("./certs/localhost.cert")
};

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {   secure: true,
                maxAge: 10000 } // maxAge is in milliseconds
}));
  

// Main page
app.get('/', (req, res) => {
    const compiledPage = pug.compileFile("pages/home.pug");
    res.end(compiledPage());
});

app.get('/login_collaborator', (req, res) => {
    const compiledPage = pug.compileFile("pages/login.pug");
    res.end(compiledPage({
        user: "collaborator"
    }));
});

app.get('/login_teacher', (req, res) => {
    const compiledPage = pug.compileFile("pages/login.pug");
    res.end(compiledPage({
        user: "teacher"
    }));
});

<<<<<<< HEAD
// app.get('/login_parent', (req, res) => {
//     const compiledPage = pug.compileFile("pages/login.pug");
//     res.end(compiledPage({
//         err_msg: ""
//     }));
// });

app.route('/login_parent').get(sessionChecker, (req, res) => {
    res.render("/pages/login.pug", {err_msg: ""});
}).post((req, res) => {
     //i valori del form sono individuati dal valore dell'attributo "name"!
     var cod_fisc = req.body.cod_fisc;   
     var password = req.body.password;   
    
     //Check if both cod_fisc and password field are filled
     if (!cod_fisc || !password) {  
        res.render("/pages/login.pug", {err_msg: "Please enter username and password"});
    }
     else{ //If yes, try to connect to the DB and check cod_fisc and then password (string+salt hashed via bcrypt module)
        console.log("TRY CONNECT");
        var con = DB_open_connection();
         let sql = 'SELECT * FROM parent WHERE cod_fisc = ?';
         con.query(sql, [cod_fisc],(err, result)=> {
             if (result.length > 0) {
                console.log("OK USER");
                 //The cod_fisc exists in the DB, now check the password
                 if(bcrypt.compareSync(password,  result[0].password)) {
                    console.log("OK PWD");
                     //password match
                     con.end();
                     //SESSION MANAGEMENT
                     setup_session_var("parent",result[0]);
                     res.redirect("/pages/parent_homepage");
                     
                 } else {
                     // Passwords don't match
                     con.end();
                     res.render("/pages/login.pug", {err_msg: 'Incorrect Username and/or Password!'});
                 } 
            }else {
                 // user don't match
                 res.render("/pages/login.pug", {err_msg: 'Incorrect Username and/or Password!'});
            } 
         });  
     }

    
    })

//------------
=======
/* app.get('/parent_home', (req, res) => {
    const compiledPage = pug.compileFile("pages/parent/parent_homepage.pug");
    res.end(compiledPage({
        user: "parent_home"
    }));
}); */

app.get('/login_parent', (req, res) => {
    const compiledPage = pug.compileFile("pages/login.pug");
    res.end(compiledPage({
        user: "parent"
    }));
});
>>>>>>> master

app.get("/style", (req, res) => {
    const page = fs.readFileSync("pages/base/style.css");
    res.end(page);
});

app.get("/teacher_page", (req, res) => {
    const compiledPage = pug.compileFile("pages/teacher_page.pug");
    res.end(compiledPage());
});

app.get("/topics", (req, res) => {
    const compiledPage = pug.compileFile("pages/topics.pug");
    res.end(compiledPage());
});

app.get("/enroll_teacher", (req, res) => {
    const compiledPage = pug.compileFile("pages/systemad_registerteacher.pug");
    res.end(compiledPage());
});

app.get("/enroll_officer", (req, res) => {
    const compiledPage = pug.compileFile("pages/systemad_registerofficer.pug");
    res.end(compiledPage());
});

app.get("/enroll_principal", (req, res) => {
    const compiledPage = pug.compileFile("pages/systemad_registerprincipal.pug");
    res.end(compiledPage());
});

app.get("/enroll_student", (req, res) => {
    const compiledPage = pug.compileFile("pages/officer_registerstudent.pug");
    res.end(compiledPage());
});

app.get("/enroll_parent", (req, res) => {
    const compiledPage = pug.compileFile("pages/officer_registerparent.pug");
    res.end(compiledPage());
});

// TODO: make this and fix it

app.post("/reg_parent", (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let SSN = req.body.SSN;
    let email = req.body.email;
    let password = req.body.password;

    var con = mysql.createConnection({
        host: "students-db",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });

    con.query('SELECT COUNT(*) as c FROM parent', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        con.query("INSERT INTO parent(id, first_name, last_name, cod_fisc, email, password, first_access) VALUES(?, ?, ?, ?, ?)", [rows[0].c, name, surname, SSN, email, password, 1], (err, result) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            console.log("Data successfully uploaded! " + result.insertId);
            con.end();
            res.redirect("/parents");
        });
    });
});

app.post("/reg_teacher", (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let SSN = req.body.SSN;
    let email = req.body.email;
    let password = req.body.password;

    var con = mysql.createConnection({
        host: "students-db",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });

    con.query('SELECT COUNT(*) as c FROM teacher', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        con.query("INSERT INTO teacher(id, first_name, last_name, cod_fisc, email, password, first_access) VALUES(?, ?, ?, ?, ?)", [rows[0].c, name, surname, SSN, email, password, 1], (err, result) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            console.log("Data successfully uploaded! " + result.insertId);
            con.end();
            res.redirect("/teachers");
        });
    });
});

app.post("/reg_officer", (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let SSN = req.body.SSN;
    let email = req.body.email;
    let password = req.body.password;

    var con = mysql.createConnection({
        host: "students-db",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });

    con.query('SELECT COUNT(*) as c FROM officer', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        con.query("INSERT INTO officer(id, first_name, last_name, cod_fisc, email, password, first_access) VALUES(?, ?, ?, ?, ?)", [rows[0].c, name, surname, SSN, email, password, 1], (err, result) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            console.log("Data successfully uploaded! " + result.insertId);
            con.end();
            res.redirect("/officers");
        });
    });
});

app.post("/reg_principal", (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let SSN = req.body.SSN;
    let email = req.body.email;
    let password = req.body.password;

    var con = mysql.createConnection({
        host: "students-db",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });

    con.query('SELECT COUNT(*) as c FROM principal', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        con.query("INSERT INTO principal(id, first_name, last_name, cod_fisc, email, password, first_access) VALUES(?, ?, ?, ?, ?)", [rows[0].c, name, surname, SSN, email, password, 1], (err, result) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            console.log("Data successfully uploaded! " + result.insertId);
            con.end();
            res.redirect("/principal");
        });
    });
});

app.post("/reg_student", (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let SSN = req.body.SSN;
    let SSN1 = req.body.SSN1;
    let SSN2 = req.body.SSN2;

    var con = mysql.createConnection({
        host: "students-db",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });

    con.query('SELECT COUNT(*) as c FROM student', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        con.query('SELECT ID as ID1 FROM parent WHERE cod_fisc = ?', [SSN1], (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            con.query('SELECT ID as ID2 FROM parent WHERE cod_fisc = ?', [SSN2], (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
                if (err) {
                    res.end("There is a problem in the DB connection. Please, try again later " + err);
                    return;
                }
                con.query("INSERT INTO student(id, first_name, last_name, cod_fisc, class_id, parent_1, parent_2) VALUES(?, ?, ?, ?, ?)", [rows[0].c, name, surname, SSN, 0, ID1, ID2], (err, result) => {
                    if (err) {
                        res.end("There is a problem in the DB connection. Please, try again later " + err);
                        return;
                    }
                    console.log("Data successfully uploaded! " + result.insertId);
                    con.end();
                    res.redirect("/students");
                });
            });
        });
    });
});

app.post("/reg_topic", (req, res) => {
    let course = req.body.course;
    let date = req.body.date;
    let classroom = req.body.class;
    let desc = req.body.desc;

    const compiledPage = pug.compileFile("pages/reg_topic.pug");
    
    var con = mysql.createConnection({
        host: "students-db",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });

    let sql = 'SELECT id FROM class WHERE class_name = ?';
    con.query(sql, [classroom], function (err, rows, fields) {
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later " + err);
            return;
        }
        var class_id = rows[0].id;
        sql = 'SELECT id FROM course WHERE course_name = ?';
        con.query(sql, [course], (err, rows, fields) => {
            if (err) {
                res.end("There is a problem in the DB connection. Please, try again later " + err);
                return;
            }
            var course_id = rows[0].id;
            con.query('SELECT COUNT(*) as c FROM topic', (err, rows, fields) => { // because we have no AUTO_UPDATE available on the DB
                if (err) {
                    res.end("There is a problem in the DB connection. Please, try again later " + err);
                    return;
                }
                con.query("INSERT INTO topic(id, topic_date, id_class, id_course, description) VALUES(?, ?, ?, ?, ?)", [rows[0].c, date, class_id, course_id, desc], (err, result) => {
                    if (err) {
                        res.end("There is a problem in the DB connection. Please, try again later " + err);
                        return;
                    }
                    console.log("Data successfully uploaded! " + result.insertId);
                    con.end();
                    res.redirect("/topics");
                });
            });
        });
    });
});

app.post("/register", (req, res) => {
    var name = req.body.name;
    var surname = req.body.surname;
    var fiscalcode = req.body.fiscalcode;
    var parent1 = req.body.parent1;
    var parent2 = req.body.parent2;

    con.connect(function (err) {
        if (err) {
            console.log("Error: " + err);
            return;
        }
        console.log("Connected!");
    });


    let sql = 'INSERT INTO student (first_name, second_name, cod_fisc, parent_1 , parent_2) VALUES (' + name + ',' + surname + ',' + fiscalcode + ',' + parent1 + ',' + parent2 + ')';

    con.query(sql, function (err, rows, fields) {

        if (err) {
            res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
        }
    });
    res.end();
});



app.get("/marks", (req, res) => {
    var marks = [];
    var student_name; // todo: retrieve from db
    const compiledPage = pug.compileFile("pages/student_marks.pug");
    var con = mysql.createConnection({
        host: "students-db",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });

    let sql = 'SELECT * FROM mark, course WHERE mark.course_id = course.id ORDER BY date_mark DESC';

    con.query(sql, function (err, rows, fields) {
        con.end();
        if (err) {
            res.end("There is a problem in the DB connection. Please, try again later");
        } else {
            console.log(rows);
            // Check if the result is found or not
            for (var i = 0; i < rows.length; i++) {
                // Create the object to save the data.
                var mark = {
                    subject: rows[i].course_name,
                    date: rows[i].date_mark,
                    mark: rows[i].score
                }

                // Add object into array
                marks[i] = mark;
            }
            res.end(compiledPage({
                student_name: "Marco Pecoraro",
                student_marks: marks
            }));
        }

    });
});


// Page not found
app.get('/*', (req, res) => {
    fs.readFile(req.path, (err, data) => {
        if (err) {
            const compiledPage = pug.compileFile("pages/base/404.pug");
            res.end(compiledPage());
        }
        res.end(data);

    })
});

app.post('/*', (req, res) => {
    fs.readFile(req.path, (err, data) => {
        if (err) {
            const compiledPage = pug.compileFile("pages/base/404.pug");
            res.end(compiledPage());
        }
        res.end(data);

    })
});

app.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/'); //ritorno alla root (qui è la homepage)
    });

});

//app.listen(PORT, HOST);


const httpApp = express();
httpApp.get("*", (req, res) => {
    res.redirect("https://" + req.hostname + ":" + HTTPSPORT + req.path);
});
http.createServer(httpApp).listen(HTTPPORT);
https.createServer(options, app).listen(HTTPSPORT);

console.log(`Running on http://${HOST}:${HTTPPORT}`);
console.log(`Running on https://${HOST}:${HTTPSPORT}`);