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

// other routers
module.exports = function (app) {
    app.use('/action/*', require('./modules'));
};



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

app.get('/login_teacher', (req, res) => {
    const compiledPage = pug.compileFile("pages/login.pug");
    res.end(compiledPage({
        user: "teacher"
    }));
});

app.get('/login_parent', (req, res) => {
    const compiledPage = pug.compileFile("pages/login.pug");
    res.end(compiledPage({
        err_msg: ""
    }));
});

//------------
//Variabile globale per la sessione. Questa soluzione va bene per un solo utente, per multiuser vedere altre soluzioni (es. Redis Server)

var sessionData; // Questa variabile rappresenta la sessione, un po' il lavoro che face $_SESSION in PHP

//------------

app.post('/auth_parent',(req, res) => {
    //i valori del form sono individuati dal valore dell'attributo "name"!
    var cod_fisc = req.body.cod_fisc;   
    var password = req.body.password;   
    var sessionData;

    const loginPage = pug.compileFile("pages/login.pug");

    //Check if both cod_fisc and password field are filled
    if (!cod_fisc || !password) {
        res.end(loginPage({
            err_msg: "Please enter username and password"
        }));
    }
    else{ //If yes, try to connect to the DB and check cod_fisc and then password (string+salt hashed via bcrypt module)
        var con = mysql.createConnection({
            host: "students-db",
            user: "root",
            password: "pwd",
            database: "students",
            insecureAuth: true
        });
        
        let sql = 'SELECT * FROM parent WHERE cod_fisc = ?';
        con.query(sql, [cod_fisc],(err, result)=> {
            if (result.length > 0) {
                //The cod_fisc exists in the DB, now check the password
                if(bcrypt.compareSync(password,  result[0].password)) {
                    //password match
                    console.log("ok password");
                    con.end();
                    
                    //SESSION MANAGEMENT
                    //-----------------------------
                    
                    //session è un typeof "session", inizializzo la sessione fuori da questa route e poi la associo a "sessionData"
                    sessionData = session;
            
                    sessionData.user = {};     //Nella variabile ho un campo user che è un oggetto e acui posso aggiungere attributi privati /equivale a $_SESSION['user']
                    sessionData.user.id = result[0].id; //aggiungo attributo id a user e lo salvo nella variabile "sessionData"
                    sessionData.user.first_name = result[0].first_name;
                    sessionData.user.last_name = result[0].last_name
                    sessionData.user.cod_fisc = result[0].cod_fisc;
                    sessionData.user.email = result[0].email;

                    //-----------------------------  

                    res.redirect("/parent_homepage");
                    /* res.end(parentPage({
                        //parent: parent no needed with session variables!
                    })); */
                } else {
                    // Passwords don't match
                    con.end();
                    console.log("error password");
                    res.end(loginPage({
                        err_msg: 'Incorrect Username and/or Password!'
                    }));
                } 
            }else {
                // Passwords don't match
                console.log("error user");
                res.end(loginPage({
                    err_msg: 'Incorrect Username and/or Password!'
                }));
            } 
        });  
    }
});

app.get("/style", (req, res) => {
    const page = fs.readFileSync("pages/base/style.css");
    res.end(page);
});

app.get("/enroll", (req, res) => {
    const compiledPage = pug.compileFile("pages/enroll.pug");
    res.end(compiledPage());
});

app.get("/teacher_page", (req, res) => {
    const compiledPage = pug.compileFile("pages/teacher_page.pug");
    res.end(compiledPage());
});

app.get("/topics", (req, res) => {
    const compiledPage = pug.compileFile("pages/topics.pug");
    res.end(compiledPage());
});

// TODO: make this and fix it
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
                con.query("INSERT INTO topic(id, topic_date, id_class, id_course, description) VALUES(?, ?, ?, ?, ?)",
                    [rows[0].c, date, class_id, course_id, desc], (err, result) => {
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
