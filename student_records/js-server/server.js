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
app.use(bodyParser.urlencoded({ extended: false }));

// ### Functions definition section ### 

function wrapper_createConnection(){
    let con = mysql.createConnection({
        host: "students-db",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });
    return con;
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

app.post("/register", (req, res) => {
    name = req.body.name;
    surname = req.body.surname;
    fiscalcode = req.body.fiscalcode;
    const compiledPage = pug.compileFile("pages/register.pug");
    res.end(compiledPage({
        student_name : name,
        student_surname : surname,
        student_fiscalcode : fiscalcode
    }));
});



app.get("/marks", (req, res) => {
    const compiledPage = pug.compileFile("pages/student_marks.pug");
    var con = wrapper_createConnection();

    con.connect(function (err) {
        if (err) {
            console.log("Error: " + err);
            return;
        }
        console.log("Connected!");
    });

    let sql = 'SELECT * FROM mark';
 
    con.query(sql, function(err, rows, fields) {
		var mark;

	  	if (err) {
	  		res.status(500).json({"status_code": 500,"status_message": "internal server error"});
	  	} else {
	  		// Check if the result is found or not
	  		for (var i = 0; i < rows.length; i++){
	  			// Create the object to save the data.
	  			var mark = {
		  			'course_id':rows[i].course_id,
		  			'score':rows[i].score,
		  			'date':rows[i].date_mark
                  }
                  
                    // Add object into array
                    markList.push(mark);
                    // render the student_marks.plug page.
                    res.render('student_marks', {"markList": markList});
                }
	  	}
	});

	// Close MySQL connection
	connection.end();

    res.end(compiledPage({
        // TODO: student name should be taken from DB
        student_name: "Marco Pecoraro",
        student_marks: marks
    }));
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
