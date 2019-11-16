'use strict';

const express = require('express');
const session = require('express-session')
const fs = require('fs');
const https = require('https');
const pug = require('pug');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// Constants
const PORT = 8000;
const HOST = '0.0.0.0';

const DBPORT = 3300;

// App
const app = express();
app.set('view engine', 'pug');
app.set('views', './pages');
app.use(bodyParser.urlencoded({ extended: false }));

// ### Functions definition section ### 

function wrapper_createConnection(){
    return mysql.createConnection({
        host: "students-db",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });
}


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

app.post("/reg_topic", (req, res) => {
    let course = req.body.course;
    let date = req.body.date;
    let classroom = req.body.class;
    let desc = req.body.desc;
    const compiledPage = pug.compileFile("pages/reg_topic.pug");

    var con =wrapper_createConnection();
    con.connect(function(err) {
        if (err) {
            console.log("Error: " + err);
            return;
        }
        console.log("Connected!");
    });
    let sql = 'SELECT id FROM class WHERE class_name = ?';

    //let sql = 'SELECT id FROM class WHERE class_name=' + classroom;
    var id_class;

    con.query(sql,[classroom],function(err, rows, fields) {

        if (err) {
            res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
        } else {
            // Check if the result is found or not
            console.log(id_class = rows[0].id);

        }
    });
    sql = 'SELECT id FROM course WHERE course_name= ?';
    //let sql1 = 'SELECT id FROM course WHERE course_name=' + course;

    var id_course;

    con.query(sql,[course], function(err, rows, fields) {

        if (err) {
            res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
        } else {
            // Check if the result is found or not
            console.log(id_course = rows[0].id);

        }
    });

    //Check conversion date to insert into DB
    //Check if prepared statement works instead of the second versio commented
    console.log(date);

    // sql = 'INSERT INTO topic (topic_date, id_class, id_course,description) VALUES (?, ?, ? ,?)';
    // con.query(sql,["2019-11-03",id_class,id_course,desc], function(err) {
    //         if (err) res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
    // });
    

    // let sql2 = 'INSERT INTO topic (topic_date, id_class, id_course, description) VALUES (' + date + ',' + id_class + ',' + id_course + ',' + desc + ')';

    // con.query(sql2, function(err, rows, fields) {

    //     if (err) {
    //         res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
    //     }
    // });
    con.end();
    res.end(compiledPage({
        // topic_course: name,
        // topic_date: surname,
        // topic_class: classroom,
        // topic_desc: desc
    }));
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
    //const compiledPage = pug.compileFile("pages/student_marks.pug");
    var con = wrapper_createConnection();
    var student_marks = [];
    var student_name;
    con.connect(function (err) {
        if (err) {
            console.log("Error: " + err);
            return;
        }
        console.log("Connected!");
    });

    //Marks are shown using the static marks array, the query works but problem with the date format
    //With object array "student_marks" nothing is shown on student_mark.pug
    //Retrieve marks of student_id (here 1)
    let sql =  `SELECT mark.student_id, mark.course_id, mark.score AS mark, mark.date_mark AS date, course.course_name AS subject
                FROM mark
                INNER JOIN course
                ON mark.course_id = course.id 
                WHERE student_id = ?`
                ;

    con.query(sql,[1], function(err, rows, fields) {
		var mark;

	  	if (err) {
	  		res.status(500).json({"status_code": 500,"status_message": "internal server error"});
	  	} else {
	  		// Check if the result is found or not
	  		for (var i = 0; i < rows.length; i++){
	  			// Create the object to save the data.
                
                let MySQL_date = rows[i].date;
                let jsDate = new Date(Date.parse(MySQL_date.toString().replace('-','/','g')));

                var mark = {
                'subject':rows[i].subject,
                'mark':rows[i].mark,
                'date':jsDate
                }
                  
                    // Add object into array
                    student_marks.push(mark);
                    console.log(student_marks[i].subject);
                    console.log(student_marks[i].mark);
                    console.log(jsDate);

                }
	  	}
	});
	// Close MySQL connection
	con.end();
    
    var marks = [];
    // TODO: get marks from database

    marks[0] = {
        date: new Date(2019, 9, 10),
        subject: "History",
        mark: "6"
    };

    marks[1] = {
        date: new Date(2019, 10, 12),
        subject: "Math",
        mark: "8"
    }

    marks.sort((a, b) => {
        return b.date - a.date;
    });

    res.render('student_marks.pug', {
        "student_name": "Marco Pecoraro",
        student_marks : student_marks
     });

    //res.render('student_marks.pug', {markList: markList, student_name: "Marco Pecoraro"});
    //pug.renderFile('pages/student_marks.pug',{
        
    //   });
	//res.end();
    // res.end(compiledPage({
    //     // TODO: student name should be taken from DB
    //     student_name: "Marco Pecoraro",
    //     //student_marks: marks
    // })
    // );
});

app.post('/login_teacher_action', (req, res) => {
    var ssn = req.body.SSN;
    console.log(ssn);
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

// HTTPS

/*
https.createServer({
    key: "", //fs.readFileSync('server.key'),
    cert: "" //fs.readFileSync('server.cert')
}, app)
    .listen(8000, function () {
        console.log(`HTTPS Running on http://${HOST}:${PORT}`);
    })
*/

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);