'use strict';

const express = require('express');
const session = require('express-session')
const fs = require('fs');
const https = require('https');
const http = require('http');
const pug = require('pug');
const bcrypt = require('bcrypt');
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

// other routers
module.exports = function (app) {
    app.use('/action/*', require('./modules'));
};



const options = {
    key: fs.readFileSync("./certs/localhost.key"),
    cert: fs.readFileSync("./certs/localhost.cert")
};

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
        user: "parent"
    }));
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
    var course = req.body.course;
    var date = req.body.date;
    var classroom = req.body.class;
    var desc = req.body.desc;
    var id_class;
    var id_course;
    var id = 1;
    var count = 0;

    const compiledPage = pug.compileFile("pages/reg_topic.pug");
    
    var con = mysql.createConnection({
        host: "students-db",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });

    /*let sql = 'SELECT id FROM class WHERE class_name = ?';
    con.query(sql, [classroom], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
        } else {
            // Check if the result is found or not
            console.log(rows);
            id_class = {
                id: rows[0].id
            };
        }
        count++;
        return show(count);
    }); 
    
    sql = 'SELECT id FROM course WHERE course_name= ?';
    con.query(sql, [course], function (err, rows,fields) {
         if (err) {
             res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
         } else {
                // Check if the result is found or not
    //         // id_course = JSON.stringify(rows.id);
    //         // console.log(rows);
             id_course = {
                 id: rows[0].id 
             }   
         }
         count++;
        return show(count);
     }); 

     function show(val){
         console.log(val);
         if(val==2){
             console.log(id_class.id);
             console.log(id_course.id);
            sql = 'INSERT INTO topic (id, topic_date, id_class, id_course, description) VALUES (?,?,?,?,?)';
            con.query(sql, [id, date, id_class.id, id_course.id, desc], function (err, rows, fields) {
                if (err) res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
            });
         }
         return;
     } 
     //console.log(id_course.id);
     //console.log(id_class.id);
    // // sql = 'INSERT INTO topic (id, topic_date, id_class, id_course, description) VALUES (?,?,?,?,?)';
    // // con.query(sql, [id, date, id_class, id_course, desc], function (err, rows, fields) {
    // //     if (err) res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
    // // });

    // // con.end();
    // console.log(id_class.id);
    // console.log(id_course.id); */
    let sql = 'INSERT INTO topic (id, topic_date, id_class, id_course, description) VALUES (' + id + ',' + date + /*', (SELECT id FROM course WHERE course_name = '+course+'), (SELECT id FROM class WHERE class_name = '+classroom+'),'*/ +",fede,silvio," + desc + ')';

    con.query(sql, function(err, result) {

         if (err) {
             console.log("[mysql error]",err);
             //res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
         }
    });
    con.end();
    res.end();
});

app.post("/register", (req, res) => {
    var name = req.body.name;
    var surname = req.body.surname;
    var fiscalcode = req.body.fiscalcode;
    const compiledPage = pug.compileFile("pages/register.pug");

    res.end(compiledPage({
        student_name: name,
        student_surname: surname,
        student_fiscalcode: fiscalcode
    }));
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

    let sql = 'SELECT * FROM mark, course WHERE mark.course_id = course.id';

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

//app.listen(PORT, HOST);

const httpApp = express();
httpApp.get("*", (req, res) => {
    res.redirect("https://" + req.hostname + ":" + HTTPSPORT + req.path);
});
http.createServer(httpApp).listen(HTTPPORT);
https.createServer(options, app).listen(HTTPSPORT);

console.log(`Running on http://${HOST}:${HTTPPORT}`);
console.log(`Running on https://${HOST}:${HTTPSPORT}`);
