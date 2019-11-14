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
const PORT = 8080;
const HOST = '0.0.0.0';

const DBPORT = 3300;

const httpsOptions = {
    key: fs.readFileSync('./certs/localhost.key'),
    cert: fs.readFileSync('./certs/localhost.cert')
};


// App
const app = express();
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));


const options = {
    key: fs.readFileSync("./certs/localhost.key"),
    cert: fs.readFileSync("./certs/localhost.cert")
};

// Main page
app.get('/', (req, res) => {
    const compiledPage = pug.compileFile("pages/home.pug");
    var con = mysql.createConnection({
        host: "students-db",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });

    con.connect(function (err) {
        if (err) {
            console.log("Error: " + err);
            return;
        }
        console.log("Connected!");
    });
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

app.get("/marks", (req, res) => {
    const compiledPage = pug.compileFile("pages/student_marks.pug");
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

// PROJECT FOR TORCHIANO - 12/11/19

/*
app.get("/price", (req, res) => {
    var price = req.query.price;
    var state = req.query.state;
    var nitems = req.query.nitems;

    price *= nitems;

    var con = mysql.createConnection({
        host: "students-db",
        user: "root",
        password: "pwd",
        database: "students",
        insecureAuth: true
    });

    con.connect(function (err) {
        if (err) {
            console.log(err)
            res.end(err);
        }
        console.log("Connected!");
        var temp = price / 100;
        con.query("SELECT discount FROM discounts WHERE threshold <= " + temp + " ORDER BY threshold DESC", function (err, result, fields) {
            if (err) {
                console.log(err)
                res.end(err);
            }
            console.log(result[0].discount);
            var real_discount = result[0].discount / 100;
            var discount_price = price - real_discount * price;
            // TAXES
            con.query("SELECT taxes FROM states WHERE code = '" + state + "'", function (err, result, fields) {
                if (err) {
                    console.log(err)
                    res.end(err);
                }

                // TAXES CALCULATED
                console.log(result[0].taxes);
                var real_taxes = result[0].taxes / 100;
                var tax_increment = real_taxes * discount_price / 100;
                console.log("Taxes calculated!");
                var final_price = Math.floor(discount_price + tax_increment);
                res.end("{\n\t\"Price\": \"" + price / 100 + "\"\n\t\"Discount price\": \"" + discount_price / 100
                    + "\"\n\t\"Taxes\": \"" + real_taxes / 100 + "\"\n\t\"Total price\": \"" + final_price / 100 + "\"\n}");
            });
        });
    });
});
*/

// END PROJECT FOR TORCHIANO - 12/11/19

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
    res.redirect("https://" + req.hostname + ":" + PORT + req.path);
});
http.createServer(httpApp).listen(8000);
https.createServer(options, app).listen(PORT);

console.log(`Running on http://${HOST}:8000`);
console.log(`Running on https://${HOST}:${PORT}`);
